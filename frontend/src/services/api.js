import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to EVERY request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized responses (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API CALLS ==========
export const authApi = {
  // Signup - Create new account
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Login - Authenticate and get token
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user info (using token)
  getCurrentUser: () => api.get('/auth/me'),
};

// ========== TASK API CALLS ==========
export const taskApi = {
  // Get all tasks for logged in user (no userId needed - token handles it!)
  getTasks: () => api.get('/tasks'),
  
  // Create a new task
  createTask: (task) => api.post('/tasks', task),
  
  // Update a task
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  
  // Delete a task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;