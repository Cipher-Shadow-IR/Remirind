const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/User');
const Exam = require('../src/models/Exam');
const ExamResult = require('../src/models/ExamResult');
const examService = require('../src/services/examService');
const request = require('chai-http/lib/request');

let expect;

const mockExamId = new mongoose.Types.ObjectId();
const mockUserId = new mongoose.Types.ObjectId();
const mockQuestion1Id = new mongoose.Types.ObjectId();
const mockQuestion2Id = new mongoose.Types.ObjectId();

const sampleExamData = {
  _id: mockExamId,
  title: 'MERN Stack Assessment',
  description: 'Test on MongoDB, Express, React, and Node.js',
  category: 'MERN Stack',
  durationMinutes: 20,
  totalMarks: 20,
  passingPercentage: 60,
  isActive: true,
  questions: [
    {
      _id: mockQuestion1Id,
      questionText: 'What is Express?',
      options: ['Database', 'Web Framework', 'Operating System', 'Compiler'],
      correctOption: 1,
      explanation: 'Express is a minimal and flexible Node.js web application framework.',
      marks: 10,
    },
    {
      _id: mockQuestion2Id,
      questionText: 'What hook is used for side effects in React?',
      options: ['useState', 'useReducer', 'useEffect', 'useMemo'],
      correctOption: 2,
      explanation: 'useEffect handles side effects in React function components.',
      marks: 10,
    },
  ],
};

describe('Exam API & Security Test Suite', function () {
  this.timeout(10000);
  let token;

  before(async () => {
    const chai = await import('chai');
    const chaiHttp = (await import('chai-http')).default;
    chai.use(chaiHttp);
    expect = chai.expect;

    // Generate valid JWT token for test user
    const secret = process.env.JWT_SECRET || 'test-secret';
    process.env.JWT_SECRET = secret;
    token = jwt.sign({ id: mockUserId }, secret);

    // Mock User.findById so authenticate middleware accepts our test user
    User.findById = async (id) => {
      if (String(id) === String(mockUserId)) {
        return { _id: mockUserId, name: 'Security Tester', email: 'tester@example.com' };
      }
      return null;
    };
  });

  describe('Answer Security Verification', () => {
    beforeEach(() => {
      Exam.findOne = (query) => {
        return Promise.resolve({
          ...sampleExamData,
          toObject: () => JSON.parse(JSON.stringify(sampleExamData)),
        });
      };

      Exam.find = () => ({
        select: () => ({
          sort: () =>
            Promise.resolve([
              {
                ...sampleExamData,
                toObject: () => JSON.parse(JSON.stringify(sampleExamData)),
              },
            ]),
        }),
      });

      Exam.countDocuments = () => Promise.resolve(1);
    });

    it('should NEVER leak correctOption or explanation when student fetches exam for taking', (done) => {
      request(app)
        .get(`/api/exams/${mockExamId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.have.property('questions');
          expect(res.body.data.questions).to.be.an('array').with.lengthOf(2);

          // Deep check every question: correctOption and explanation MUST be omitted
          res.body.data.questions.forEach((q) => {
            expect(q).to.have.property('questionText');
            expect(q).to.have.property('options');
            expect(q).to.have.property('marks');
            expect(q).to.not.have.property('correctOption', 'Security violation: correctOption leaked in question payload!');
            expect(q).to.not.have.property('explanation', 'Security violation: explanation leaked in question payload!');
          });
          done();
        });
    });

    it('should omit question list and details from the exam catalog endpoint', (done) => {
      request(app)
        .get('/api/exams')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.property('title', 'MERN Stack Assessment');
          expect(res.body.data[0]).to.have.property('questionCount', 2);
          expect(res.body.data[0]).to.not.have.property('questions');
          done();
        });
    });
  });

  describe('Input Validation & Access Control', () => {
    it('should reject unauthenticated requests with 401 Unauthorized', (done) => {
      request(app)
        .get('/api/exams')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          done();
        });
    });

    it('should reject invalid exam ID with 400 Bad Request', (done) => {
      request(app)
        .get('/api/exams/invalid-mongo-id')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.include('Valid exam ID is required');
          done();
        });
    });

    it('should reject submission with non-array/non-object answers', (done) => {
      request(app)
        .post(`/api/exams/${mockExamId}/submit`)
        .set('Authorization', `Bearer ${token}`)
        .send({ answers: 'invalid-answers-string' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.include('Answers must be provided');
          done();
        });
    });

    it('should return 404 when taking a non-existent exam', (done) => {
      const nonExistentId = new mongoose.Types.ObjectId();
      Exam.findOne = () => Promise.resolve(null);

      request(app)
        .get(`/api/exams/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.include('Exam not found');
          done();
        });
    });
  });

  describe('Score Calculation & Evaluation', () => {
    beforeEach(() => {
      Exam.findById = (id) => Promise.resolve(sampleExamData);

      ExamResult.create = async (data) => ({
        _id: new mongoose.Types.ObjectId(),
        ...data,
      });
    });

    it('should calculate 100% score and passed=true for all correct answers', async () => {
      const answers = [
        { questionId: mockQuestion1Id, selectedOption: 1 }, // Correct (10 marks)
        { questionId: mockQuestion2Id, selectedOption: 2 }, // Correct (10 marks)
      ];

      const result = await examService.submitExam(mockExamId, mockUserId, answers, 120);

      expect(result.score).to.equal(20);
      expect(result.totalMarks).to.equal(20);
      expect(result.percentage).to.equal(100);
      expect(result.passed).to.be.true;
      expect(result.correctCount).to.equal(2);
      expect(result.incorrectCount).to.equal(0);
      expect(result.unansweredCount).to.equal(0);
    });

    it('should accurately calculate partial score, incorrect count, and unanswered count', async () => {
      const answers = [
        { questionId: mockQuestion1Id, selectedOption: 1 }, // Correct: 10 marks
        // Question 2 is unanswered
      ];

      const result = await examService.submitExam(mockExamId, mockUserId, answers, 60);

      expect(result.score).to.equal(10);
      expect(result.totalMarks).to.equal(20);
      expect(result.percentage).to.equal(50);
      expect(result.passed).to.be.false; // 50% < 60% passing threshold
      expect(result.correctCount).to.equal(1);
      expect(result.incorrectCount).to.equal(0);
      expect(result.unansweredCount).to.equal(1);
    });

    it('should accurately score incorrect submissions and reveal explanations in the report', (done) => {
      request(app)
        .post(`/api/exams/${mockExamId}/submit`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          answers: [
            { questionId: mockQuestion1Id, selectedOption: 0 }, // Incorrect (selected 0, correct is 1)
            { questionId: mockQuestion2Id, selectedOption: 2 }, // Correct (selected 2, correct is 2)
          ],
          timeSpentSeconds: 95,
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          const data = res.body.data;
          expect(data.score).to.equal(10);
          expect(data.totalMarks).to.equal(20);
          expect(data.percentage).to.equal(50);
          expect(data.passed).to.be.false;
          expect(data.correctCount).to.equal(1);
          expect(data.incorrectCount).to.equal(1);
          expect(data.unansweredCount).to.equal(0);

          // In the post-submission report, explanations and correct options ARE included for learning
          expect(data.details[0].isCorrect).to.be.false;
          expect(data.details[0].correctOption).to.equal(1);
          expect(data.details[0].explanation).to.include('Express is a minimal');
          expect(data.details[1].isCorrect).to.be.true;
          expect(data.details[1].correctOption).to.equal(2);
          done();
        });
    });
  });
});
