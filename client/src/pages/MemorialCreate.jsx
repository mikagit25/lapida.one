import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MemorialCreate = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/memorial', { name }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    navigate('/user/account');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Создать мемориал</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя" required />
      <button type="submit">Создать</button>
    </form>
  );
};

export default MemorialCreate;