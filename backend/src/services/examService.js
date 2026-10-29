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
 * Get exam questions for taking a test
 * Crucial security: NEVER send correctOption or explanation to the client!
 */
const getExamForTaking = async (examId) => {
  const exam = await Exam.findOne({ _id: examId, isActive: true });
  if (!exam) {
    throw new AppError('Exam not found or is currently inactive', 404);
  }

  const doc = exam.toObject ? exam.toObject() : exam;

  // Sanitize questions: strictly omit correctOption and explanation
  const sanitizedQuestions = (doc.questions || []).map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    marks: q.marks || 10,
  }));

  return {
    _id: doc._id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    durationMinutes: doc.durationMinutes,
    totalMarks: doc.totalMarks || sanitizedQuestions.reduce((sum, q) => sum + q.marks, 0),
    passingPercentage: doc.passingPercentage,
    totalQuestions: sanitizedQuestions.length,
    questions: sanitizedQuestions,
  };
};

/**
 * Submit exam, evaluate score, and persist exam result
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

  let totalScore = 0;
  let totalMaxMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const details = exam.questions.map((q) => {
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
    totalQuestions: exam.questions.length,
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
