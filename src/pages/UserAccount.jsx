import React from "react";
import { getUserFromToken } from "../utils/jwt";

const UserAccount = () => {
  const user = getUserFromToken();

  if (!user) {
    return <div>Пользователь не авторизован</div>;
  }

  return (
    <div>
      <h1>Добро пожаловать, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
      <button
        onClick={() => {
          localStorage.removeItem("jwt_token");
          window.location.href = "/";
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default UserAccount;
