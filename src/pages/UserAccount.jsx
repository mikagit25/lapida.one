import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserAccount = () => {
  const { user, logout } = useAuth();

  return (
    <div className="user-account">
      <h1>Личный кабинет</h1>
      {user ? (
        <div>
          <p>Имя пользователя: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Выйти</button>
          <Link to="/edit-profile">Редактировать профиль</Link>
        </div>
      ) : (
        <p>
          Вы не авторизованы. <Link to="/login">Войти</Link>
        </p>
      )}
    </div>
  );
};

export default UserAccount;
