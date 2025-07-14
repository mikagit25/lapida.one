// src/pages/CompanyAccount.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";  // Хук для уведомлений
import { getUserFromToken } from "../utils/jwt";  // Получение данных пользователя из JWT

const CompanyAccount = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();  // Хук уведомлений

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserFromToken();  // Получаем данные пользователя из токена
    if (!userData || userData.role !== "company") {
      showToast("Вы не авторизованы или не являетесь компанией", "error");
      navigate("/login");
    } else {
      setCompany(userData);
      setLoading(false);
    }
  }, [navigate, showToast]);

  const handleSave = () => {
    // Логика для сохранения данных компании (если необходимо)
    showToast("Данные компании успешно обновлены!");
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Личный кабинет компании {company.name}</h1>
      <form>
        <div>
          <label>Название компании</label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
        </div>

        <button type="button" onClick={handleSave}>
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};

export default CompanyAccount;
