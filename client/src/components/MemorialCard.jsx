import React from 'react';
import { Link } from 'react-router-dom';

const MemorialCard = ({ memorial }) => (
  <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
    <h3>
      <Link to={`/memorial/${memorial._id}`}>{memorial.name}</Link>
    </h3>
    <div>Дата рождения: {memorial.birthDate && new Date(memorial.birthDate).toLocaleDateString()}</div>
    <div>Дата смерти: {memorial.deathDate && new Date(memorial.deathDate).toLocaleDateString()}</div>
    <Link to={`/memorial/${memorial._id}/edit`}>Редактировать</Link>
  </div>
);

export default MemorialCard;