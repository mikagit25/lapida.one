import axios from 'axios';

// Глобально добавляем токен авторизации ко всем запросам
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Если у вас есть index.jsx — импортируйте его здесь
import('./index.jsx');