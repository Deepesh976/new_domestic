import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/authSlice';
import { checkTokenExpiration } from './authUtils';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // 🔥 IMPORTANT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    if (!checkTokenExpiration()) {
      store.dispatch(logout());
      window.location.href = '/login';
      return Promise.reject('Token expired');
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
