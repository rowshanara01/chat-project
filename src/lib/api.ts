import axios from 'axios';

// Create Axios instance with base REST URL
const api = axios.create({
  baseURL: 'https://frontend-task-chatapp.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;