import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CompanyPublic from './pages/CompanyPublic';
import CompanyDemoAccount from './pages/CompanyDemoAccount';
import Register from './pages/Register';
import Login from './pages/Login';
import UserAccount from './pages/UserAccount';
import EditProfile from './pages/EditProfile';
import Memorials from './pages/Memorials';
import MemorialDetail from './pages/MemorialDetail';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './models/AuthContext.jsx';
import MemorialCreate from './pages/MemorialCreate';
import PersonDetail from './pages/PersonDetail';
import CompanyRegister from './pages/CompanyRegister';
import CompanyLogin from './pages/CompanyLogin';
import CompanyAccount from './pages/CompanyAccount';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/memorials" element={<Memorials />} />
          <Route path="/memorial/:id" element={<MemorialDetail />} />
          <Route path="/memorial/share/:shareUrl" element={<MemorialDetail />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          {/* Публичная демо-страница личного кабинета */}
          <Route path="/demo-account" element={<UserAccount demoMode={true} />} />
          {/* Публичная демо-страница компании */}
          <Route path="/demo-company" element={<CompanyDemoAccount />} />
          {/* Обычный личный кабинет (требует авторизации) */}
          <Route
            path="/user/account"
            element={
              <PrivateRoute>
                <UserAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/account"
            element={
              <PrivateRoute>
                <CompanyAccount />
              </PrivateRoute>
            }
          />
          <Route path="/company/:id" element={<CompanyPublic />} />
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/memorial/new"
            element={
              <PrivateRoute>
                <MemorialCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<div style={{ padding: '2rem' }}>404 — Страница не найдена</div>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;