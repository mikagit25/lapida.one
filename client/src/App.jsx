import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserAccount from "./pages/UserAccount";
import Memorials from "./pages/Memorials";
import MemorialDetail from "./pages/MemorialDetail";
import PersonDetail from "./pages/PersonDetail";
import EditPerson from "./pages/EditPerson";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register"; // импорт

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<Home />} />

        {/* Страницы аутентификации */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Мемориалы */}
        <Route path="/memorials" element={<Memorials />} />
        <Route path="/memorial/:id" element={<MemorialDetail />} />

        {/* Страницы конкретных людей */}
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/person/:id/edit" element={<EditPerson />} />

        <Route path="/register" element={<Register />} />

        {/* Личный кабинет (только для авторизованных) */}
        <Route
          path="/user/account"
          element={
            <PrivateRoute>
              <UserAccount />
            </PrivateRoute>
          }
        />

        {/* 404 страница */}
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 — Страница не найдена</div>} />
      </Routes>
    </Router>
  );
}

export default App;
