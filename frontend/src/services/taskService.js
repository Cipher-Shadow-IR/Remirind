import api from './api';

export const fetchTasks = (params) => api.get('/tasks', { params });
export const fetchTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const fetchStats = () => api.get('/tasks/stats');
