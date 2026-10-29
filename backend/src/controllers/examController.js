const examService = require('../services/examService');
const { successResponse } = require('../utils/response');

const getExams = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const exams = await examService.getAvailableExams({ category, search });
    successResponse(res, exams, 'Exams retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getExam = async (req, res, next) => {
  try {
    const exam = await examService.getExamForTaking(req.params.id);
    successResponse(res, exam, 'Exam retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const submitExam = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds } = req.body;
    const result = await examService.submitExam(
      req.params.id,
      req.user._id,
      answers,
      timeSpentSeconds
    );
    successResponse(res, result, 'Exam submitted and evaluated successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getUserResults = async (req, res, next) => {
  try {
    const results = await examService.getUserResults(req.user._id);
    successResponse(res, results, 'User exam results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getResultById = async (req, res, next) => {
  try {
    const result = await examService.getResultById(req.params.id, req.user._id);
    successResponse(res, result, 'Exam result retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExams,
  getExam,
  submitExam,
  getUserResults,
  getResultById,
};
