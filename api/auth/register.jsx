import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await axios.post('/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500); // Перенаправление через 1.5 сек
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Ошибка регистрации'
      );
    }
  };

  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>Регистрация успешна!</div>}
      </form>
    </div>
  );
};

export default Register;