import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://digital-heroes-zutk.onrender.com/api';
  }
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on explicit 401 for auth check routes, do not break on guest responses
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/me')) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
