import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadCV: (formData) => api.post('/users/upload-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStats: () => api.get('/users/stats'),
};

// Interview API
export const interviewAPI = {
  create: (data) => api.post('/interviews/create', data),
  getById: (id) => api.get(`/interviews/${id}`),
  getUserInterviews: (userId, limit = 10) => api.get(`/interviews/user/${userId}?limit=${limit}`),
  createPersonalized: (data) => api.post('/interviews/personalized', data),
  finalize: (id) => api.put(`/interviews/${id}/finalize`),
  delete: (id) => api.delete(`/interviews/${id}`),
};

// Feedback API
export const feedbackAPI = {
  create: (data) => api.post('/feedback/generate', data),
  generate: (data) => api.post('/feedback/generate', data),
  getById: (id) => api.get(`/feedback/${id}`),
  getByInterview: (interviewId) => api.get(`/feedback/interview/${interviewId}`),
};

export default api;
