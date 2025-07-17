import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Здесь можно добавить логику проверки аутентификации
  const isAuthenticated = true; // Заглушка, замени на реальную проверку

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
