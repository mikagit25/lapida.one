import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../models/AuthContext';

const MemorialCreate = () => {
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Имя обязательно для заполнения');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/memorial', {
        name,
        biography,
        birthDate,
        deathDate,
        location,
        imageUrl
      });
      
      navigate(`/memorial/${res.data._id}`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Ошибка создания мемориала');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Необходима авторизация для создания мемориала</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Создать мемориал</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Имя *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Биография</label>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full border rounded px-3 py-2 h-24"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Дата рождения</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Дата смерти</label>
            <input
              type="date"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Место</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Место захоронения"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL изображения</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать мемориал'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/memorials')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemorialCreate;