import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Attach Authorization header from AuthContext/localStorage automatically
api.interceptors.request.use(
  (config) => {
    // Support multiple token keys: primary 'accessToken' set by AuthContext; fallback to legacy 'authToken'
    const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;