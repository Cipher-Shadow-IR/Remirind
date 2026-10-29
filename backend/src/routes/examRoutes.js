const { Router } = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const {
  getExams,
  getExam,
  submitExam,
  getUserResults,
  getResultById,
} = require('../controllers/examController');

const router = Router();

// All exam routes require user authentication
router.use(authenticate);

// List available assessments (metadata only, no answers)
router.get('/', getExams);

// Get past exam results of current user
router.get('/results', getUserResults);

// Get specific exam result report with question breakdown and explanations
router.get(
  '/results/:id',
  [param('id').isMongoId().withMessage('Valid result ID is required')],
  validate,
  getResultById
);

// Get single exam and questions for taking (security: stripped of answer keys)
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Valid exam ID is required')],
  validate,
  getExam
);

// Submit answers for scoring and report generation
router.post(
  '/:id/submit',
  [
    param('id').isMongoId().withMessage('Valid exam ID is required'),
    body('answers')
      .custom((value) => {
        if (!value || (typeof value !== 'object' && !Array.isArray(value))) {
          throw new Error('Answers must be provided as an array or object');
        }
        return true;
      }),
    body('timeSpentSeconds')
      .optional()
      .isNumeric()
      .withMessage('Time spent must be a numeric value'),
  ],
  validate,
  submitExam
);

module.exports = router;
