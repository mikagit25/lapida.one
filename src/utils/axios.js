import axios from 'axios';

// Глобальный axios-инстанс с автоматическим добавлением токена
// Используем относительные пути, которые будут проксированы Vite на API сервер
const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Глобальный response interceptor для автоматического logout при 401/403
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
