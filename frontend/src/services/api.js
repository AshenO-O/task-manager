import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authApi = {
  // Signup - Create new account
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Login - Authenticate user
  login: (credentials) => api.post('/auth/login', credentials),
};

// Task API calls
export const taskApi = {
  // Get all tasks for a user
  getTasks: (userId) => api.get(`/tasks?userId=${userId}`),
  
  // Create a new task
  createTask: (task) => api.post('/tasks', task),
  
  // Update an existing task
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  
  // Delete a task
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;