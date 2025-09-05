import React, { useState } from 'react';
import QRCode from '../components/QRCode';
import UserGallery from '../components/UserGallery';
import CommentSection from '../components/CommentSection';

const demoCompany = {
  name: 'Demo Company',
  email: 'company@demo.com',
  description: 'Это демо-страница компании. Здесь можно протестировать все функции.',
  photo: '',
  gallery: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400'
  ],
  memorials: [
    {
      id: 1,
      name: 'Памятник Ивану Иванову',
      description: 'Память о великом человеке.',
      photo: 'https://picsum.photos/150',
      url: 'https://lapida.one/memorial/1'
    },
    {
      id: 2,
      name: 'Памятник Марии Петровой',
      description: 'Любящая мать и жена.',
      photo: 'https://picsum.photos/150',
      url: 'https://lapida.one/memorial/2'
    }
  ],
  services: [
    'Изготовление памятников',
    'Установка оград',
    'Благоустройство могил',
    'Гравировка',
  ],
  comments: [
    { text: 'Спасибо за работу!', date: '2024-07-01' },
    { text: 'Очень достойно!', date: '2024-07-02' }
  ]
};

const CompanyDemoAccount = () => {
  const [gallery, setGallery] = useState(demoCompany.gallery);
  const [comments, setComments] = useState(demoCompany.comments);
  const [services, setServices] = useState(demoCompany.services);
  const [serviceInput, setServiceInput] = useState('');

  const handleAddService = () => {
    if (!serviceInput.trim()) return;
    setServices([...services, serviceInput.trim()]);
    setServiceInput('');
  };
  const handleDeleteService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Демо личный кабинет компании</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
          {demoCompany.photo ? (
            <img src={demoCompany.photo} alt="Фото компании" className="w-full h-full object-cover" />
          ) : (
            <span className="flex items-center justify-center h-full text-gray-400">Нет фото</span>
          )}
        </div>
        <div className="text-lg font-semibold">{demoCompany.name}</div>
        <div className="text-gray-600">{demoCompany.email}</div>
        <div className="mt-2 text-sm text-gray-700">{demoCompany.description}</div>
      </div>

      {/* Новый блок: услуги компании */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Услуги компании</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm flex-1"
            placeholder="Добавить услугу..."
            value={serviceInput}
            onChange={e => setServiceInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            onClick={handleAddService}
          >Добавить</button>
        </div>
        <ul className="list-disc pl-6">
          {services.map((service, idx) => (
            <li key={idx} className="flex items-center justify-between mb-1">
              <span>{service}</span>
              <button
                className="ml-2 text-xs text-red-500 hover:text-red-700"
                onClick={() => handleDeleteService(idx)}
                title="Удалить услугу"
              >✕</button>
            </li>
          ))}
        </ul>
        <div className="text-sm text-gray-500 mt-2">Добавьте или удалите услуги для теста</div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Мемориальные страницы компании</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoCompany.memorials.map(memorial => (
            <div key={memorial.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col items-center">
              <img src={memorial.photo} alt={memorial.name} className="w-20 h-20 rounded-full mb-2 object-cover" />
              <div className="font-semibold text-lg">{memorial.name}</div>
              <div className="text-sm text-gray-600 mb-2 text-center">{memorial.description}</div>
              <a href={memorial.url} className="text-blue-600 underline mb-2" target="_blank" rel="noopener noreferrer">Перейти на страницу</a>
              <div className="w-full flex justify-center">
                <div className="w-28">
                  <QRCode qrUrl={memorial.url} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Галерея компании</h2>
        <UserGallery gallery={gallery} demoMode={true} onChange={({ gallery }) => setGallery(gallery)} />
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Отзывы о компании</h2>
        <CommentSection comments={comments} demoMode={true} onChange={setComments} />
      </div>
    </div>
  );
};

export default CompanyDemoAccount;
