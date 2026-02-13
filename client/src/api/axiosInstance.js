import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://multi-tenant-mkd7.onrender.com/api';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('tm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
