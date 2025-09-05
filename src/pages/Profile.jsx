// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../models/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Profile = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`/api/profile/${user._id}`)
      .then(res => {
        setPrivacy(res.data.user.privacy || 'public');
      })
      .catch(() => setError('Ошибка загрузки статуса приватности'))
      .finally(() => setLoading(false));
  }, [user]);

  const handlePrivacyChange = async (e) => {
    const newPrivacy = e.target.value;
    setPrivacy(newPrivacy);
    setLoading(true);
    setError('');
    try {
      await axios.patch(`/api/profile/${user._id}/privacy`, { privacy: newPrivacy });
    } catch {
      setError('Ошибка изменения приватности');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>

      <div className="my-4">
        <label className="font-semibold mr-2">Приватность аккаунта:</label>
        <select value={privacy} onChange={handlePrivacyChange} disabled={loading} className="border rounded px-2 py-1">
          <option value="public">Публичный</option>
          <option value="friends">Только для друзей</option>
          <option value="private">Закрытый</option>
        </select>
        {loading && <span className="ml-2 text-gray-400">Сохраняется...</span>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <button onClick={handleLogout}>Выход</button>
    </div>
  );
};

export default Profile;
