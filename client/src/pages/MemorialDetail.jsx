// src/pages/MemorialDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Пример данных для подробного отображения памятников
const sampleMemorials = [
  {
    id: 1,
    name: "Иван Иванов",
    description:
      "Память о великом человеке, который оставил след в сердцах. Он был примером мужества и доброты.",
    photo: "https://via.placeholder.com/150",
    flowers: 12,
    candles: 5,
    comments: [
      { id: 1, text: "Ты всегда будешь в наших сердцах!" },
      { id: 2, text: "Светлая память." },
    ],
  },
  {
    id: 2,
    name: "Мария Петрова",
    description: "Любящая мать и жена, всегда в наших сердцах.",
    photo: "https://via.placeholder.com/150",
    flowers: 7,
    candles: 2,
    comments: [
      { id: 1, text: "Ты была добрым и светлым человеком." },
      { id: 2, text: "Вечно в нашей памяти." },
    ],
  },
];

const MemorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memorial, setMemorial] = useState(null);

  useEffect(() => {
    // Ищем памятник по ID
    const foundMemorial = sampleMemorials.find(
      (memorial) => memorial.id === parseInt(id)
    );
    if (foundMemorial) {
      setMemorial(foundMemorial);
    } else {
      navigate("/memorials"); // Если не нашли памятник, перенаправляем на список
    }
  }, [id, navigate]);

  const handleAddComment = () => {
    // Добавить комментарий (для примера)
    setMemorial((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        { id: prev.comments.length + 1, text: "Новый комментарий" },
      ],
    }));
  };

  const handleAddFlower = () => {
    setMemorial((prev) => ({
      ...prev,
      flowers: prev.flowers + 1,
    }));
  };

  const handleAddCandle = () => {
    setMemorial((prev) => ({
      ...prev,
      candles: prev.candles + 1,
    }));
  };

  if (!memorial) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>{memorial.name}</h1>
      <img src={memorial.photo} alt={memorial.name} width={150} />
      <p>{memorial.description}</p>
      <button onClick={handleAddFlower}>Поставить цветок ({memorial.flowers})</button>
      <button onClick={handleAddCandle}>Зажечь свечу ({memorial.candles})</button>
      <h3>Комментарии</h3>
      <div>
        {memorial.comments.map((comment) => (
          <p key={comment.id}>{comment.text}</p>
        ))}
      </div>
      <button onClick={handleAddComment}>Добавить комментарий</button>
      <button onClick={() => navigate("/memorials")}>Назад</button>
    </div>
  );
};

export default MemorialDetail;
