import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserAccount = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setMemorials(res.data.user.memorials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Мои мемориалы</h1>
      <Link to="/memorial/new">Добавить мемориал</Link>
      <ul>
        {memorials.length === 0 && <li>У вас пока нет мемориалов.</li>}
        {memorials.map(m => (
          <li key={m._id}>
            <Link to={`/memorial/${m._id}`}>{m.name}</Link>
            {' '}
            <Link to={`/memorial/${m._id}/edit`}>Редактировать</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAccount;