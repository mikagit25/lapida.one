import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './models/AuthContext.jsx';

// Simple Home component
const SimpleHome = () => (
  <div style={{ padding: '20px' }}>
    <h1>Lapida.one - Главная страница</h1>
    <p>Добро пожаловать на платформу цифровых мемориалов</p>
    <div>
      <a href="/memorials" style={{ marginRight: '10px' }}>Мемориалы</a>
      <a href="/login" style={{ marginRight: '10px' }}>Войти</a>
      <a href="/register">Регистрация</a>
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="*" element={<div style={{ padding: '20px' }}>404 — Страница не найдена</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
