// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";  // Для перехода по маршрутам

const Home = () => {
  return (
    <div>
      <h1>Добро пожаловать на сайт Lapida</h1>
      <p>
        Это виртуальное кладбище. Здесь вы можете найти страницы памяти людей и животных.
      </p>
      {/* Ссылки на другие страницы */}
      <div>
        <Link to="/memorials">Посмотреть памятники</Link>
      </div>
      <div>
        <Link to="/pets">Посмотреть животных</Link>
      </div>
      <div>
        <Link to="/people">Посмотреть список людей</Link>
      </div>
      <div>
        <Link to="/profile">Перейти в личный кабинет</Link>
      </div>
      
      {/* Добавим ссылки на регистрацию и вход */}
      <div>
        <Link to="/register">Регистрация</Link>
      </div>
      <div>
        <Link to="/login">Вход</Link>
      </div>
    </div>
  );
};

export default Home;
