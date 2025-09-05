import React, { useState } from 'react';
import axios from '../utils/axios';

const OrderServiceForm = ({ companyId, services }) => {
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!selectedService || !name || !phone) {
      setError('Заполните все обязательные поля');
      return;
    }
    try {
      await axios.post('/api/company/order', {
        companyId,
        service: selectedService,
        name,
        phone,
        comment,
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setComment('');
      setSelectedService('');
    } catch (err) {
      setError('Ошибка отправки заявки');
    }
  };

  return (
    <form className="bg-gray-50 rounded-xl shadow p-4" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-1">Выберите услугу *</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
        >
          <option value="">-- Выберите --</option>
          {services.map((s, idx) => (
            <option key={idx} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-1">Ваше имя *</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-1">Телефон *</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-semibold mb-1">Комментарий</label>
        <textarea
          className="border rounded px-2 py-1 w-full"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition" type="submit">
        Отправить заявку
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      {success && <div className="text-green-500 mt-2 text-sm">Заявка отправлена!</div>}
    </form>
  );
};

export default OrderServiceForm;
