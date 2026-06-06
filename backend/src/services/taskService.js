const Task = require('../models/Task');
const AppError = require('../utils/AppError');

const createTask = async (data, userId) => {
  return Task.create({ ...data, userId });
};

const getTasks = async (userId, filters = {}) => {
  const query = { userId };

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  return Task.find(query).sort({ createdAt: -1 });
};

const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const updateTask = async (taskId, userId, data) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    data,
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const getDateBoundaries = () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const startOfNextWeek = new Date(startOfToday);
  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
  return { startOfToday, startOfTomorrow, startOfNextWeek };
};

const getDashboardStats = async (userId) => {
  const { startOfToday, startOfTomorrow, startOfNextWeek } = getDateBoundaries();

  const [
    total,
    pending,
    completed,
    highPriority,
    overdue,
    dueToday,
    dueThisWeek,
  ] = await Promise.all([
    Task.countDocuments({ userId }),
    Task.countDocuments({ userId, status: 'pending' }),
    Task.countDocuments({ userId, status: 'completed' }),
    Task.countDocuments({ userId, priority: 'high', status: 'pending' }),
    Task.countDocuments({
      userId,
      dueDate: { $lt: startOfToday },
      status: { $ne: 'completed' },
    }),
    Task.countDocuments({
      userId,
      dueDate: { $gte: startOfToday, $lt: startOfTomorrow },
    }),
    Task.countDocuments({
      userId,
      dueDate: { $gte: startOfToday, $lt: startOfNextWeek },
    }),
  ]);

  return { total, pending, completed, highPriority, overdue, dueToday, dueThisWeek };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
};
