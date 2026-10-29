const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      validate: [
        (val) => Array.isArray(val) && val.length >= 2,
        'Question must have at least 2 options',
      ],
      required: [true, 'Options are required'],
    },
    correctOption: {
      type: Number,
      required: [true, 'Correct option index is required'],
      min: [0, 'Correct option index cannot be negative'],
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    marks: {
      type: Number,
      default: 10,
      min: [1, 'Marks must be at least 1'],
    },
  },
  { _id: true }
);

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exam title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'General',
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
      default: 20,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    passingPercentage: {
      type: Number,
      default: 60,
      min: [0, 'Passing percentage cannot be less than 0'],
      max: [100, 'Passing percentage cannot exceed 100'],
    },
    questions: {
      type: [questionSchema],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'Exam must contain at least one question',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Automatically calculate totalMarks from questions if totalMarks is 0 or not provided
examSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 10), 0);
  }
  next();
});

examSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Exam', examSchema);
