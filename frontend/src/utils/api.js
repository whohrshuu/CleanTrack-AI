import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / errors
api.interceptors.response.use(
  (response) => response.data, // Unwrap the ApiResponse wrapper
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please log in again.');
      // Optional: redirect to login
      window.location.href = '/login';
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
