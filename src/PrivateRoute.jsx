// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './models/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();
  // Строгая проверка: user должен быть объектом, иметь username или email, и токен не пустой
  const isAuthenticated = user && (user.username || user.email) && token;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
