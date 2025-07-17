// src/pages/AddPerson.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPerson = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить логику для отправки данных на сервер
    // Временно добавляем нового человека в локальный список
    console.log({ name, description, photo });
    navigate('/people'); // Перенаправляем на страницу списка людей после добавления
  };

  return (
    <div>
      <h1>Добавить нового человека</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Фото (URL):</label>
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            required
          />
        </div>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddPerson;
