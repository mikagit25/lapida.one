// src/pages/EditPerson.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { samplePeople } from '../data/sampleData'; // Подключаем данные
import { useToast } from '../hooks/useToast'; // Хук для уведомлений (опционально)

const EditPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(''); // Для ошибок
  const [previewImage, setPreviewImage] = useState(null); // Для предпросмотра изображения
  const { showToast } = useToast(); // Хук уведомлений

  useEffect(() => {
    const foundPerson = samplePeople.find(
      (person) => person.id === parseInt(id),
    );
    if (!foundPerson) {
      setError('Человек не найден.');
    }
    setPerson(foundPerson);
  }, [id]);

  // Функция для загрузки изображения
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Превью изображения
      setPerson((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson((prevPerson) => ({ ...prevPerson, [name]: value }));
  };

  const handleSave = () => {
    if (!person.name || !person.description) {
      setError('Все поля обязательны для заполнения.');
      return;
    }

    // Имитация сохранения данных
    console.log('Обновленные данные: ', person);

    // Показать уведомление об успешном сохранении
    showToast('Страница успешно обновлена!');

    navigate(`/person/${person.id}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!person) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Редактировать страницу памяти {person.name}</h1>
      <form>
        <div>
          <label>Имя</label>
          <input
            type="text"
            name="name"
            value={person.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Описание</label>
          <textarea
            name="description"
            value={person.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Фото */}
        <div>
          <label>Фото</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && <img src={previewImage} alt="Preview" width="100" />}
        </div>

        {/* Кнопка сохранения */}
        <button type="button" onClick={handleSave}>
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default EditPerson;
