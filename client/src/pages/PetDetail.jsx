// src/pages/PetDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметра ID из URL

const pets = [
  {
    id: 1,
    name: 'Собака Бобик',
    breed: 'Овчарка',
    age: 5,
    description: 'Очень умная и верная собака.',
  },
  {
    id: 2,
    name: 'Кошка Мурка',
    breed: 'Сиамская',
    age: 3,
    description: 'Очень ласковая и игривая кошка.',
  },
  {
    id: 3,
    name: 'Попугай Кеша',
    breed: 'Жако',
    age: 2,
    description: 'Летает и разговаривает.',
  },
  // Добавь другие животные по аналогии
];

const PetDetail = () => {
  const { id } = useParams(); // Получаем параметр ID из URL
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const foundPet = pets.find((p) => p.id === parseInt(id)); // Находим животное по ID
    setPet(foundPet);
  }, [id]);

  if (!pet) {
    return <div>Животное не найдено</div>;
  }

  return (
    <div>
      <h1>{pet.name}</h1>
      <p>Порода: {pet.breed}</p>
      <p>Возраст: {pet.age} лет</p>
      <p>{pet.description}</p>
    </div>
  );
};

export default PetDetail;
