const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const AppError = require('../utils/AppError');
const defaultExams = require('../seeds/examSeedData');

/**
 * Ensure default exams are present in the database
 */
const autoSeedIfEmpty = async () => {
  try {
    const count = await Exam.countDocuments();
    if (count === 0) {
      await Exam.insertMany(defaultExams);
    }
  } catch (error) {
    // Non-blocking in case of DB read-only or indexing race conditions
    console.warn('Auto-seed check notice:', error.message);
  }
};

/**
 * Get all available exams with metadata and question count
 * Crucial security: questions and answers are omitted from the list view
 */
const getAvailableExams = async (filters = {}) => {
  await autoSeedIfEmpty();

  const query = { isActive: true };
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  const exams = await Exam.find(query)
    .select('title description category durationMinutes totalMarks passingPercentage questions createdAt updatedAt')
    .sort({ createdAt: -1 });

  return exams.map((exam) => {
    const doc = exam.toObject ? exam.toObject() : exam;
    const questionCount = Array.isArray(doc.questions) ? doc.questions.length : 0;
    // Strip questions array from general listing for efficiency and security
    const { questions, ...meta } = doc;
    return {
      ...meta,
      questionCount,
      totalQuestions: questionCount,
    };
  });
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Get exam questions for taking a test
 * Crucial security: NEVER send correctOption or explanation to the client!
 * Randomizes questions: if the pool has > 10 questions, selects a random set of 10 questions per session!
 */
const getExamForTaking = async (examId) => {
  const exam = await Exam.findOne({ _id: examId, isActive: true });
  if (!exam) {
    throw new AppError('Exam not found or is currently inactive', 404);
  }

  const doc = exam.toObject ? exam.toObject() : exam;
  const allQuestions = doc.questions || [];

  // If pool has more than 10 questions, pick a random sample of 10 questions
  const questionsCount = 10;
  const selectedPool = allQuestions.length > questionsCount
    ? shuffleArray(allQuestions).slice(0, questionsCount)
    : allQuestions;

  // Sanitize questions: strictly omit correctOption and explanation
  const sanitizedQuestions = selectedPool.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    marks: q.marks || 10,
  }));

  const totalMarks = sanitizedQuestions.reduce((sum, q) => sum + (q.marks || 10), 0);

  return {
    _id: doc._id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    durationMinutes: doc.durationMinutes,
    totalMarks,
    passingPercentage: doc.passingPercentage,
    totalQuestions: sanitizedQuestions.length,
    poolSize: allQuestions.length,
    questions: sanitizedQuestions,
  };
};

/**
 * Submit exam, evaluate score, and persist exam result
 * Accurately scores only the questions that were submitted in the user's session
 */
const submitExam = async (examId, userId, answersInput = [], timeSpentSeconds = 0) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new AppError('Exam not found', 404);
  }

  // Standardize answers input format (supports both Array of { questionId, selectedOption } and Object { [qId]: selectedOption })
  const answersMap = new Map();
  if (Array.isArray(answersInput)) {
    answersInput.forEach((ans) => {
      if (ans && ans.questionId) {
        answersMap.set(String(ans.questionId), ans.selectedOption);
      }
    });
  } else if (answersInput && typeof answersInput === 'object') {
    Object.entries(answersInput).forEach(([qId, selectedOption]) => {
      answersMap.set(String(qId), selectedOption);
    });
  }

  // Identify questions evaluated in this session
  // If the exam has <= 10 questions (e.g. focused test or test suites), evaluate all of them
  // If the exam has a larger pool (> 10 questions), evaluate the questions that were submitted in the user's session
  let questionsToEvaluate = [];
  if (exam.questions.length <= 10) {
    questionsToEvaluate = exam.questions;
  } else if (answersMap.size > 0) {
    const sessionIds = new Set(Array.from(answersMap.keys()));
    questionsToEvaluate = exam.questions.filter((q) => sessionIds.has(String(q._id)));
    // If fewer than 10 were sent in answersMap, fill the remainder up to 10 from pool to account for unanswered questions
    if (questionsToEvaluate.length < 10) {
      const remaining = exam.questions.filter((q) => !sessionIds.has(String(q._id)));
      questionsToEvaluate = questionsToEvaluate.concat(remaining.slice(0, 10 - questionsToEvaluate.length));
    }
  } else {
    // If submitted completely blank, evaluate first 10 questions as unanswered
    questionsToEvaluate = exam.questions.slice(0, 10);
  }

  let totalScore = 0;
  let totalMaxMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const details = questionsToEvaluate.map((q) => {
    const qIdStr = String(q._id);
    const selected = answersMap.has(qIdStr) ? answersMap.get(qIdStr) : null;
    const isAnswered = selected !== null && selected !== undefined && selected !== '';
    const selectedNum = isAnswered ? Number(selected) : null;
    const isCorrect = isAnswered && selectedNum === q.correctOption;
    const marks = q.marks || 10;
    totalMaxMarks += marks;

    let marksAwarded = 0;
    if (isAnswered) {
      if (isCorrect) {
        marksAwarded = marks;
        totalScore += marks;
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    } else {
      unansweredCount += 1;
    }

    return {
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedOption: selectedNum,
      correctOption: q.correctOption,
      isCorrect,
      marksAwarded,
      maxMarks: marks,
      explanation: q.explanation || '',
    };
  });

  const percentage = totalMaxMarks > 0
    ? Math.round((totalScore / totalMaxMarks) * 100 * 10) / 10
    : 0;

  const passed = percentage >= (exam.passingPercentage || 60);

  const result = await ExamResult.create({
    userId,
    examId: exam._id,
    examTitle: exam.title,
    category: exam.category,
    score: totalScore,
    totalMarks: totalMaxMarks,
    percentage,
    passed,
    totalQuestions: questionsToEvaluate.length,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeSpentSeconds: Number(timeSpentSeconds) || 0,
    details,
  });

  return result;
};

/**
 * Get test history for a specific user
 */
const getUserResults = async (userId) => {
  return ExamResult.find({ userId })
    .select('examId examTitle category score totalMarks percentage passed totalQuestions correctCount incorrectCount unansweredCount timeSpentSeconds createdAt')
    .sort({ createdAt: -1 });
};

/**
 * Get specific exam result by ID for a user
 */
const getResultById = async (resultId, userId) => {
  const result = await ExamResult.findOne({ _id: resultId, userId });
  if (!result) {
    throw new AppError('Exam result not found', 404);
  }
  return result;
};

module.exports = {
  getAvailableExams,
  getExamForTaking,
  submitExam,
  getUserResults,
  getResultById,
  autoSeedIfEmpty,
};
