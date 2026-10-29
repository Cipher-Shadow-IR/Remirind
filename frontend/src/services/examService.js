import api from './api';

export const fetchExams = (params) => api.get('/exams', { params });
export const fetchExamForTaking = (id) => api.get(`/exams/${id}`);
export const submitExam = (id, data) => api.post(`/exams/${id}/submit`, data);
export const fetchUserResults = () => api.get('/exams/results');
export const fetchResultById = (id) => api.get(`/exams/results/${id}`);
