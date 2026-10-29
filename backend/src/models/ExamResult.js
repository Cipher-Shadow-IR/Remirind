const mongoose = require('mongoose');

const answerDetailSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    selectedOption: {
      type: Number,
      default: null, // null if unanswered
    },
    correctOption: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
    maxMarks: {
      type: Number,
      default: 10,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const examResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    examTitle: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      required: true,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      required: true,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    details: [answerDetailSchema],
  },
  { timestamps: true }
);

examResultSchema.index({ userId: 1, createdAt: -1 });
examResultSchema.index({ examId: 1, userId: 1 });

module.exports = mongoose.model('ExamResult', examResultSchema);
