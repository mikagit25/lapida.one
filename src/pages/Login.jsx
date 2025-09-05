import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../models/AuthContext';
// Always use context for login

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const username = formData.username.trim().toLowerCase();
      const password = formData.password;
      if (!username || !password) {
        setError('Все поля обязательны');
        setLoading(false);
        return;
      }
      const response = await axios.post('/api/auth/login', { username, password });
      // Always update context and localStorage
      login({ user: response.data.user, token: response.data.token });
      console.log('Login.jsx: user', response.data.user);
      console.log('Login.jsx: token', response.data.token);
      navigate('/user/account');
    } catch (err) {
      setError('Ошибка входа: ' + (err.response?.data?.error || err.message || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Вход</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>Войти</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;