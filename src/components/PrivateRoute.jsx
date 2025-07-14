import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  // Если токен отсутствует — перенаправляем на /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть — показываем дочерний компонент
  return children;
};

export default PrivateRoute;
