// src/pages/Memorials.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Memorials = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold text-center mt-8">
        Список страниц памяти
      </h1>
      <div className="mt-8 text-center">
        <Link to="/memorial/1" className="text-blue-500">
          Память о человеке 1
        </Link>
      </div>
    </div>
  );
};

export default Memorials;
