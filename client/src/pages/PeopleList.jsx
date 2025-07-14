// src/pages/PeopleList.jsx
import React from "react";
import { Link } from "react-router-dom"; // Для перехода на страницу профиля

const people = [
  { id: 1, name: "Иван Иванов", email: "ivan@example.com" },
  { id: 2, name: "Мария Петрова", email: "maria@example.com" },
  { id: 3, name: "Александр Сидоров", email: "alexander@example.com" },
  // Добавь больше данных по аналогии
];

const PeopleList = () => {
  return (
    <div>
      <h1>Список людей</h1>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link to={`/profile/${person.id}`}>
              {person.name} ({person.email})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleList;
