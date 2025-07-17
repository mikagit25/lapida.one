// src/pages/People.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Пример данных для людей
const samplePeople = [
  {
    id: 1,
    name: 'Иван Иванов',
    description: 'Память о великом человеке.',
    photo: 'https://via.placeholder.com/150',
    creatorId: 1, // ID создателя
  },
  {
    id: 2,
    name: 'Мария Петрова',
    description: 'Любящая мать и жена.',
    photo: 'https://via.placeholder.com/150',
    creatorId: 2, // ID создателя
  },
];

const People = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    // Здесь можно загружать данные с сервера или базы данных
    setPeople(samplePeople);
  }, []);

  return (
    <div>
      <h1>Список людей</h1>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link to={`/person/${person.id}`}>
              <img src={person.photo} alt={person.name} width={50} />
              <h3>{person.name}</h3>
            </Link>
            <p>{person.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default People;
