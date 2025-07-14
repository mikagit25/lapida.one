// src/pages/Pets.jsx
import React from "react";
import { Link } from "react-router-dom"; // Для перехода на подробную страницу животного

const pets = [
  { id: 1, name: "Собака Бобик", breed: "Овчарка", age: 5 },
  { id: 2, name: "Кошка Мурка", breed: "Сиамская", age: 3 },
  { id: 3, name: "Попугай Кеша", breed: "Жако", age: 2 },
  // Добавь другие животные по аналогии
];

const Pets = () => {
  return (
    <div>
      <h1>Список животных</h1>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            <Link to={`/pet/${pet.id}`}>
              {pet.name} ({pet.breed}), {pet.age} лет
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pets;
