// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/jwt'; // Импортируем функцию проверки токена

const PrivateRoute = ({ element }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" />; // Если нет токена, перенаправляем на страницу входа
  }

  return element; // Если есть токен, отрисовываем компонент
};

export default PrivateRoute;
