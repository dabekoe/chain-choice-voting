import axios from 'axios';

const api = axios.create({
  baseURL: 'https://chain-choice-backend-1.onrender.com',
});

// Automatically attach token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
