// src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/jwt'; // Функция для получения данных из токена

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photo: null,
  });

  useEffect(() => {
    const currentUser = getUserFromToken();
    if (!currentUser) {
      setError('Пользователь не авторизован.');
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name,
      description: currentUser.description,
      photo: currentUser.photo,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    // Здесь можно добавить логику для сохранения изменений
    console.log('Обновленные данные: ', formData);
    // Переход обратно в личный кабинет
    navigate('/user/account');
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Редактировать профиль</h1>
      <form>
        <div>
          <label>Имя</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Фото */}
        <div>
          <label>Фото</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
          />
          {formData.photo && (
            <img src={URL.createObjectURL(formData.photo)} alt="Preview" width="100" />
          )}
        </div>

        {/* Кнопка сохранения */}
        <button type="button" onClick={handleSave}>
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
