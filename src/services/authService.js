import axios from '../utils/axios';

// Авторизация пользователя
export async function loginUser(credentials) {
  const { data } = await axios.post('/api/auth/login', credentials);
  return data;
}

// Регистрация пользователя
export async function registerUser(data) {
  const res = await axios.post('/api/auth/register', data);
  return res.data;
}

// Обновление профиля пользователя
export async function updateUserProfile(data) {
  const res = await axios.put('/api/auth/profile', data);
  return res.data;
}