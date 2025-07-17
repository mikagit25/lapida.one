// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !name || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    // Храним данные в localStorage (в реальности тут будет сервер)
    const userData = { email, name, password };
    localStorage.setItem('registered_user', JSON.stringify(userData));

    alert('Регистрация прошла успешно! Теперь войдите в систему.');
    navigate('/login');
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Эл. почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
  );
};

export default Register;
