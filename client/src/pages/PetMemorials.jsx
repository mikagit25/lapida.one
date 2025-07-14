// src/pages/PetMemorials.jsx
import React from 'react';
import { pets } from "../data/sampleData";  // Исправляем импорт

const PetMemorials = () => {
  return (
    <div>
      <h1>Список животных</h1>
      <ul>
        {pets.map(pet => (
          <li key={pet.id}>{pet.name} — {pet.type}, {pet.age} лет</li>
        ))}
      </ul>
    </div>
  );
};

export default PetMemorials;
