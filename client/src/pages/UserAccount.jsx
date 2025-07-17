import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserAccount = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Здесь вы можете редактировать свой профиль.</p>
      <button onClick={() => navigate('/edit-profile')}>
        Редактировать профиль
      </button>
    </div>
  );
};

export default UserAccount;
