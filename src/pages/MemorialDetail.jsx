import React, { useState, useEffect } from 'react';
import { useAuth } from '../models/AuthContext.jsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QRCode from '../components/QRCode';

const MemorialDetail = () => {
  const { id, shareUrl } = useParams();
  const [deceased, setDeceased] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const memorialId = shareUrl || id;
    if (!memorialId) {
      setError('Некорректный идентификатор мемориала');
      return;
    }
    setLoading(true);
    setError('');
    
    // Определяем URL в зависимости от типа параметра
    const apiUrl = shareUrl 
      ? `/api/memorial/share/${shareUrl}`
      : `/api/deceased/${id}`;
    
    axios
      .get(apiUrl)
      .then((response) => {
        setDeceased(response.data);
        setPrivacy(response.data.privacy || 'public');
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setError('Страница мемориала закрыта владельцем');
        } else {
          setError('Ошибка загрузки мемориала');
        }
      })
      .finally(() => setLoading(false));

    // QR код только для старых роутов
    if (id) {
      axios
        .get(`/api/deceased/${id}/qr`)
        .then((response) => {
          setQrUrl(response.data.qr);
        })
        .catch(() => {});
    }
  }, [id, shareUrl]);

  const handlePrivacyChange = async (e) => {
    const newPrivacy = e.target.value;
    setPrivacy(newPrivacy);
    setLoading(true);
    setError('');
    try {
      await axios.patch(`/api/deceased/${deceased._id}/privacy`, { privacy: newPrivacy });
    } catch {
      setError('Ошибка изменения приватности');
    }
    setLoading(false);
  };

  if (error) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-red-500">{error}</div>;
  }
  if (!deceased) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Загрузка...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        <div className="mb-4">
          <label className="font-semibold mr-2">Приватность страницы:</label>
          {/* Только владелец может менять privacy, здесь user._id === deceased.owner (если поле owner есть) */}
          <select value={privacy} onChange={handlePrivacyChange} disabled={loading} className="border rounded px-2 py-1">
            <option value="public">Публичная</option>
            <option value="friends">Только для друзей</option>
            <option value="private">Закрытая</option>
          </select>
          {loading && <span className="ml-2 text-gray-400">Сохраняется...</span>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">{deceased.firstName} {deceased.lastName}</h1>
        <div className="mb-2 text-sm text-gray-500">Статус: {privacy === 'public' ? 'Публичная' : privacy === 'friends' ? 'Только для друзей' : 'Закрытая'}</div>
        <p className="text-gray-600 mb-4">{deceased.epitaph}</p>
        <div className="w-full space-y-4">
          <div className="bg-gray-50 rounded p-4">Фото и галерея</div>
          <div className="bg-gray-50 rounded p-4">Таймлайн событий</div>
          <div className="bg-gray-50 rounded p-4 flex gap-4">
            <span>Цветы</span>
            <span>Свечи</span>
          </div>
          <div className="bg-gray-50 rounded p-4">Комментарии</div>
          <div className="bg-gray-50 rounded p-4 flex items-center gap-2">
            <span>QR-код:</span>
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialDetail;
