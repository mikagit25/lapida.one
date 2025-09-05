import React from 'react';

const PetMemorials = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Страница мемориалов питомцев</h1>
      <p>Здесь будет отображаться информация о питомцах, их фото, истории, комментарии и т.д.</p>
      <ul>
        <li>Фото питомца</li>
        <li>История жизни</li>
        <li>Комментарии</li>
      </ul>
      <p style={{ color: '#888' }}>Это пример страницы питомца. В будущем здесь появится реальный контент.</p>
    </div>
  );
};

export default PetMemorials;
// src/pages/PetMemorials.jsx
import React from 'react';
import { pets } from '../data/sampleData'; // Исправляем импорт

const PetMemorials = () => {
  return (
    <div>
      <h1>Список животных</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            {pet.name} — {pet.type}, {pet.age} лет
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PetMemorials;
