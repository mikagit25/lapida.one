// src/pages/CompanyAccount.jsx
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import OrderServiceForm from '../components/OrderServiceForm';
import OrderRequests from '../components/OrderRequests';
import CompanyPublic from './CompanyPublic';
import { useAuth } from '../models/AuthContext';

const CompanyAccount = () => {
  const [company, setCompany] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [comments, setComments] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '', price: '' });
  const [editIdx, setEditIdx] = useState(null);
  const [editService, setEditService] = useState({ name: '', description: '', price: '' });
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/company/login');
      return;
    }
    setCompany(user);
    axios.get('/api/company/account')
      .then(res => {
        setCompany(res.data);
        setGallery(res.data.gallery || []);
        setComments(res.data.comments || []);
      });
    axios.get('/api/company/account/services')
      .then(res => setServices(res.data.services || []));
  }, [navigate, user]);

  // Добавить услугу
  const handleAddService = async e => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    try {
      const res = await axios.post('/api/company/account/services', {
        name: newService.name,
        description: newService.description,
        price: Number(newService.price) || 0
      });
      setServices(res.data.services);
      setNewService({ name: '', description: '', price: '' });
      showToast('Услуга добавлена');
    } catch {
      showToast('Ошибка добавления услуги');
    }
  };

  // Удалить услугу
  const handleDeleteService = async idx => {
    try {
      const res = await axios.delete(`/api/company/account/services/${idx}`);
      setServices(res.data.services);
      showToast('Услуга удалена');
    } catch {
      showToast('Ошибка удаления услуги');
    }
  };

  // Начать редактирование
  const startEditService = idx => {
    setEditIdx(idx);
    setEditService({ ...services[idx], price: services[idx].price || '' });
  };

  // Сохранить редактирование
  const handleEditService = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/company/account/services/${editIdx}`, {
        name: editService.name,
        description: editService.description,
        price: Number(editService.price) || 0
      });
      setServices(res.data.services);
      setEditIdx(null);
      setEditService({ name: '', description: '', price: '' });
      showToast('Услуга обновлена');
    } catch {
      showToast('Ошибка обновления услуги');
    }
  };

  // Загрузка фото компании
  const handlePhotoUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await axios.post('/api/company/account/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCompany({ ...company, photo: res.data.photo });
      showToast('Фото компании обновлено');
    } catch {
      showToast('Ошибка загрузки фото');
    }
  };

  // Загрузка фото в галерею
  const handleGalleryUpload = async e => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
    const formData = new FormData();
    files.forEach(f => formData.append('gallery', f));
    try {
      const res = await axios.post('/api/company/account/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setGallery(res.data.gallery);
      showToast('Галерея обновлена');
    } catch {
      showToast('Ошибка загрузки галереи');
    }
  };

  // Удаление фото из галереи
  const handleDeleteGalleryPhoto = async idx => {
    try {
      const newGallery = gallery.filter((_, i) => i !== idx);
      setGallery(newGallery);
      await axios.put('/api/company/account/gallery', { gallery: newGallery });
      showToast('Фото удалено из галереи');
    } catch {
      showToast('Ошибка удаления фото');
    }
  };

  if (!company) return <div>Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Личный кабинет компании</h1>
      <div className="flex flex-col items-center mb-6">
        <form
          className="flex flex-col items-center gap-2 w-full"
          onSubmit={async e => {
            e.preventDefault();
            try {
              await axios.put('/api/company/account', {
                name: company.name,
                email: company.email,
                description: company.description,
                photo: company.photo,
              });
              showToast('Данные компании обновлены');
            } catch (err) {
              showToast('Ошибка обновления данных');
            }
          }}
        >
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
            {company.photo ? (
              <img src={company.photo} alt="Фото компании" className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center h-full text-gray-400">Нет фото</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="mb-2" />
          <input
            type="text"
            className="border rounded px-2 py-1 text-lg font-semibold text-center"
            value={company.name || ''}
            onChange={e => setCompany({ ...company, name: e.target.value })}
            placeholder="Название компании"
            required
          />
          <input
            type="email"
            className="border rounded px-2 py-1 text-gray-600 text-center"
            value={company.email || ''}
            onChange={e => setCompany({ ...company, email: e.target.value })}
            placeholder="Email"
            required
          />
          <textarea
            className="border rounded px-2 py-1 mt-2 text-sm text-gray-700 w-full"
            value={company.description || ''}
            onChange={e => setCompany({ ...company, description: e.target.value })}
            placeholder="Описание компании"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-2"
          >Сохранить изменения</button>
        </form>
      {/* Галерея компании */}
      <div className="w-full mt-4">
        <h2 className="text-lg font-bold mb-2">Галерея компании</h2>
        <div className="flex gap-2 flex-wrap mb-2">
          {gallery.length === 0 && <span className="text-gray-400">Нет фото</span>}
          {gallery.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt="Фото галереи" className="w-20 h-20 object-cover rounded" />
              <button
                className="absolute top-0 right-0 bg-white bg-opacity-70 text-red-500 rounded-full px-1 py-0.5 text-xs"
                onClick={() => handleDeleteGalleryPhoto(idx)}
                title="Удалить фото"
              >✕</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
      </div>
      </div>

      {/* Блок: услуги компании (только просмотр и редактирование) */}
      {/* Предпросмотр публичной страницы компании */}
      <div className="w-full mt-8">
        <h2 className="text-lg font-bold mb-2">Как видит вашу страницу пользователь</h2>
        <button
          className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPreviewMode(!previewMode)}
        >{previewMode ? 'Скрыть предпросмотр' : 'Показать предпросмотр'}</button>
        {previewMode && (
          <div className="border rounded-xl shadow p-4">
            <CompanyPublic id={company._id} />
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Услуги компании</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {services.length === 0 && <span className="text-gray-400">Нет услуг</span>}
          {services.map((service, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-gray-50 relative">
              {editIdx === idx ? (
                <form onSubmit={handleEditService} className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={editService.name}
                    onChange={e => setEditService(s => ({ ...s, name: e.target.value }))}
                    placeholder="Название услуги"
                    required
                  />
                  <textarea
                    className="border rounded px-2 py-1"
                    value={editService.description}
                    onChange={e => setEditService(s => ({ ...s, description: e.target.value }))}
                    placeholder="Описание"
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1"
                    value={editService.price}
                    onChange={e => setEditService(s => ({ ...s, price: e.target.value }))}
                    placeholder="Цена"
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Сохранить</button>
                    <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditIdx(null)}>Отмена</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="font-bold text-lg">{service.name}</div>
                  <div className="text-gray-700 text-sm mb-1">{service.description}</div>
                  <div className="text-blue-600 font-semibold">{service.price ? `${service.price} ₽` : 'Цена не указана'}</div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="text-xs text-blue-500 hover:underline" onClick={() => startEditService(idx)}>Редактировать</button>
                    <button className="text-xs text-red-500 hover:underline" onClick={() => handleDeleteService(idx)}>Удалить</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleAddService} className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-2">
          <div className="font-bold">Добавить услугу</div>
          <input
            type="text"
            className="border rounded px-2 py-1"
            value={newService.name}
            onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
            placeholder="Название услуги"
            required
          />
          <textarea
            className="border rounded px-2 py-1"
            value={newService.description}
            onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
            placeholder="Описание"
          />
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={newService.price}
            onChange={e => setNewService(s => ({ ...s, price: e.target.value }))}
            placeholder="Цена"
          />
          <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded mt-2">Добавить услугу</button>
        </form>
      </div>

      {/* Блок: заявки на услуги или товары */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">Заявки на услуги/товары</h2>
        <OrderRequests companyId={company._id} />
      </div>

      {/* ...другие блоки: мемориалы, галерея, отзывы... */}
    </div>
  );
};

export default CompanyAccount;
