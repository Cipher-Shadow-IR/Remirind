const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getStats,
} = require('../controllers/taskController');

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('status')
      .optional()
      .isIn(['pending', 'completed'])
      .withMessage('Status must be pending or completed'),
    body('dueDate')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('Due date must be a valid date')
      .custom((value) => {
        if (new Date(value) < getTomorrow()) {
          throw new Error('Due date must be tomorrow or later');
        }
        return true;
      }),
  ],
  validate,
  createTask
);

router.get('/', getTasks);

router.get('/:id', getTask);

router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('status')
      .optional()
      .isIn(['pending', 'completed'])
      .withMessage('Status must be pending or completed'),
    body('dueDate')
      .optional({ values: 'falsy' })
      .isISO8601()
      .withMessage('Due date must be a valid date')
      .custom((value) => {
        if (new Date(value) < getTomorrow()) {
          throw new Error('Due date must be tomorrow or later');
        }
        return true;
      }),
  ],
  validate,
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
