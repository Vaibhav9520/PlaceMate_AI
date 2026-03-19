import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log('🔗 API_URL configured as:', API_URL);

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
    console.log('📤 API Request Details:');
    console.log('- Method:', config.method?.toUpperCase());
    console.log('- URL:', config.url);
    console.log('- Base URL:', config.baseURL);
    console.log('- Full URL:', `${config.baseURL}${config.url}`);
    console.log('- Headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response SUCCESS:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:');
    console.error('- Status:', error.response?.status);
    console.error('- URL:', error.config?.url);
    console.error('- Method:', error.config?.method?.toUpperCase());
    console.error('- Message:', error.message);
    console.error('- Response Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadCV: (formData) => api.post('/users/upload-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStats: () => api.get('/users/stats'),
  generateInterview: (data) => api.post('/users/generate-interview', data),
};

// Interview API
export const interviewAPI = {
  create: (data) => api.post('/interviews/create', data),
  getById: (id) => api.get(`/interviews/${id}`),
  getUserInterviews: (userId, limit = 10) => api.get(`/interviews/user/${userId}?limit=${limit}`),
  createPersonalized: (data) => api.post('/interviews/personalized', data),
  generatePersonalized: (data) => api.post('/interviews/generate-personalized', data),
  generateRoleBased: (data) => api.post('/interviews/generate-role-based', data),
  submit: (data) => api.post('/interviews/submit', data),
  getRecent: () => {
    console.log('🔍 Making API call to /interviews/recent');
    return api.get('/interviews/recent');
  },
  finalize: (id) => api.put(`/interviews/${id}/finalize`),
  delete: (id) => {
    // Clean and validate the ID
    const cleanId = String(id).trim();
    console.log('🗑️ Delete API call for ID:', cleanId);
    return api.delete(`/interviews/${cleanId}`);
  },
};

// Feedback API
export const feedbackAPI = {
  create: (data) => api.post('/feedback/generate', data),
  generate: (data) => api.post('/feedback/generate', data),
  getById: (id) => api.get(`/feedback/${id}`),
  getByInterview: (interviewId) => api.get(`/feedback/interview/${interviewId}`),
};

export default api;
