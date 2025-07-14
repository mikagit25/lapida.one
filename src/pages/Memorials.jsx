// src/pages/Memorials.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Пример данных для памятников людей
const sampleMemorials = [
  {
    id: 1,
    name: "Иван Иванов",
    photo: "https://via.placeholder.com/150",
    description: "Память о великом человеке, который оставил след в сердцах.",
  },
  {
    id: 2,
    name: "Мария Петрова",
    photo: "https://via.placeholder.com/150",
    description: "Любящая мать и жена, всегда в наших сердцах.",
  },
];

const Memorials = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    // В будущем можно заменить на запрос к API для получения реальных данных
    setMemorials(sampleMemorials);
  }, []);

  return (
    <div>
      <h1>Список памятников</h1>
      <p>
        Здесь вы можете найти памятники людям, которые ушли, но остались в
        наших сердцах.
      </p>
      <div>
        {memorials.map((memorial) => (
          <div
            key={memorial.id}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <img
              src={memorial.photo}
              alt={memorial.name}
              width={150}
              style={{ borderRadius: "50%" }}
            />
            <h3>{memorial.name}</h3>
            <p>{memorial.description}</p>
            <Link to={`/memorial/${memorial.id}`} style={{ color: "#007bff" }}>
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memorials;
