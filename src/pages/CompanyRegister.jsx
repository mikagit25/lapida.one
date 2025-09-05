import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const CompanyRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/company/register', {
        name,
        email,
        password,
        description,
      });
      navigate('/company/login');
    } catch (err) {
      setError(err?.response?.data?.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Регистрация компании</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Название компании"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Описание компании"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border rounded px-3 py-2"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default CompanyRegister;
