import { useState, useEffect, useCallback } from 'react';
import {
  fetchTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  fetchStats,
} from '../services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchTasks(filters);
      setTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await fetchStats();
      setStats(data.data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const createTask = async (taskData) => {
    const { data } = await createTaskApi(taskData);
    setTasks((prev) => [data.data, ...prev]);
    loadStats();
    return data.data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await updateTaskApi(id, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    loadStats();
    return data.data;
  };

  const deleteTask = async (id) => {
    await deleteTaskApi(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    loadStats();
  };

  return {
    tasks,
    stats,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
