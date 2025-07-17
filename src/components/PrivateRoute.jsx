import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Если пользователь не авторизован — перенаправляем на /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован — показываем дочерний компонент
  return children;
};

export default PrivateRoute;