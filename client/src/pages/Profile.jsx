// src/pages/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Функция для выхода
  const handleLogout = () => {
    // Очищаем localStorage
    localStorage.removeItem("user");

    // Перенаправляем на страницу входа
    navigate("/login");
  };

  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>

      {/* Кнопка для выхода */}
      <button onClick={handleLogout}>Выход</button>
    </div>
  );
};

export default Profile;
