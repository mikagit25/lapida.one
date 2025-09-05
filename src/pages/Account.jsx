import React, { useEffect, useState } from 'react';
import { useAuth } from '../models/AuthContext';
import axios from '../utils/axios';

const Account = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!token) return;
    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.user))
      .catch(e => setErr('Ошибка загрузки профиля'));
  }, [token]);

  if (err) return <div style={{ color: 'red' }}>{err}</div>;
  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="account-container">
      <h1>Личный кабинет</h1>
      <div><strong>Имя пользователя:</strong> {user.username}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleString()}</div>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default Account;