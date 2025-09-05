import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserGallery from '../components/UserGallery';
import UserTimeline from '../components/UserTimeline';
import FlowersCandles from '../components/FlowersCandles';
import CommentSection from '../components/CommentSection';
import QRCode from '../components/QRCode';
import axios from '../utils/axios';

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [candles, setCandles] = useState([]);
  const [comments, setComments] = useState([]);
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    setError('');
    setPerson(null);
    axios.get(`/api/deceased/id/${id}`)
      .then(res => {
        setPerson(res.data);
        setGallery(res.data.gallery || []);
        setTimeline(res.data.timeline || []);
        setFlowers(res.data.flowers || []);
        setCandles(res.data.candles || []);
        setComments(res.data.comments || []);
      })
      .catch(() => {
        // DEMO DATA fallback
        setError('Человек не найден или id некорректен. Показан тестовый шаблон.');
        setPerson({
          firstName: 'Иван',
          lastName: 'Иванов',
          epitaph: 'Светлая память!',
          birthDate: '1950-01-01',
          deathDate: '2020-01-01',
          gallery: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400'
          ],
          timeline: [
            { _id: '1', date: '1950-01-01', text: 'Рождение' },
            { _id: '2', date: '1970-01-01', text: 'Окончил университет' }
          ],
          flowers: [{ date: '2024-07-01' }],
          candles: [{ date: '2024-07-01' }],
          comments: [
            { text: 'Светлая память!', date: '2024-07-01' },
            { text: 'Очень хороший человек.', date: '2024-07-02' }
          ]
        });
        setGallery([
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400'
        ]);
        setTimeline([
          { _id: '1', date: '1950-01-01', text: 'Рождение' },
          { _id: '2', date: '1970-01-01', text: 'Окончил университет' }
        ]);
        setFlowers([{ date: '2024-07-01' }]);
        setCandles([{ date: '2024-07-01' }]);
        setComments([
          { text: 'Светлая память!', date: '2024-07-01' },
          { text: 'Очень хороший человек.', date: '2024-07-02' }
        ]);
      });
    axios.get(`/api/deceased/${id}/qrcode`)
      .then(r => setQrUrl(r.data.qrUrl))
      .catch(() => setQrUrl('https://lapida.one/person/demo-id'));
  }, [id]);

  if (error) {
    // DEMO: интерактивные блоки с тестовыми данными
    const demoPerson = {
      firstName: 'Иван',
      lastName: 'Иванов',
      epitaph: 'Светлая память!',
      birthDate: '1950-01-01',
      deathDate: '2020-01-01',
      gallery: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400'
      ],
      timeline: [
        { _id: '1', date: '1950-01-01', text: 'Рождение' },
        { _id: '2', date: '1970-01-01', text: 'Окончил университет' }
      ],
      flowers: [{ date: '2024-07-01' }],
      candles: [{ date: '2024-07-01' }],
      comments: [
        { text: 'Светлая память!', date: '2024-07-01' },
        { text: 'Очень хороший человек.', date: '2024-07-02' }
      ]
    };
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <img src={demoPerson.gallery[0]} alt={demoPerson.firstName} className="w-28 h-28 rounded-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{demoPerson.firstName} {demoPerson.lastName}</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="w-full space-y-4">
            <div className="bg-gray-50 rounded p-4">
              <span className="font-semibold">Эпитафия:</span> <span className="text-gray-700">{demoPerson.epitaph}</span>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <span className="font-semibold">Дата рождения:</span> <span className="text-gray-700">{new Date(demoPerson.birthDate).toLocaleDateString()}</span><br />
              <span className="font-semibold">Дата смерти:</span> <span className="text-gray-700">{new Date(demoPerson.deathDate).toLocaleDateString()}</span>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <UserGallery gallery={demoPerson.gallery} demoMode={true} />
            </div>
            <div className="bg-gray-50 rounded p-4">
              <UserTimeline timeline={demoPerson.timeline} demoMode={true} />
            </div>
            <div className="bg-gray-50 rounded p-4">
              <FlowersCandles flowers={demoPerson.flowers} candles={demoPerson.candles} demoMode={true} />
            </div>
            <div className="bg-gray-50 rounded p-4">
              <CommentSection comments={demoPerson.comments} demoMode={true} />
            </div>
            <div className="bg-gray-50 rounded p-4 flex items-center gap-2">
              <span className="font-semibold">QR-код:</span>
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                <QRCode qrUrl={'https://lapida.one/person/demo-id'} />
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-6 text-sm">Это пример публичной страницы. Здесь пользователь может протестировать весь функционал.</p>
        </div>
      </div>
    );
  }
  if (!person) return <div className="text-center py-12 text-gray-500">Загрузка...</div>;

  // ...existing code...

  // demoMode: включается при ошибке загрузки или статусе 500
  const demoMode = !!error || (person && person.status === 500);

  // Demo-режим: интерактивные обработчики для таймлайна
  const handleDemoTimelineAdd = (event) => {
    setTimeline((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        date: event.date,
        text: event.text,
        media: event.media || ''
      }
    ]);
  };
  const handleDemoTimelineDelete = (eventId) => {
    setTimeline((prev) => prev.filter(ev => ev._id !== eventId));
  };

  // Demo-режим: интерактивные обработчики для галереи
  const handleDemoGalleryAdd = (imgUrl) => {
    setGallery((prev) => [...prev, imgUrl]);
  };
  const handleDemoGalleryDelete = (imgUrl) => {
    setGallery((prev) => prev.filter(img => img !== imgUrl));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>{person.firstName} {person.lastName}</h1>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {/* Фото, если есть */}
        {person.gallery && person.gallery[0] && (
          <img src={person.gallery[0]} alt={person.firstName} width={120} style={{ borderRadius: 12 }} />
        )}
        <div>
          <p>{person.epitaph}</p>
          <p><b>Дата рождения:</b> {person.birthDate && new Date(person.birthDate).toLocaleDateString()}</p>
          <p><b>Дата смерти:</b> {person.deathDate && new Date(person.deathDate).toLocaleDateString()}</p>
        </div>
        {qrUrl && <QRCode qrUrl={qrUrl} />}
      </div>
      <div style={{ marginTop: 32 }}>
        <UserGallery
          gallery={gallery}
          personId={id}
          onChange={({ gallery }) => setGallery(gallery)}
          onDemoAdd={demoMode ? handleDemoGalleryAdd : undefined}
          onDemoDelete={demoMode ? handleDemoGalleryDelete : undefined}
        />
      </div>
      <div style={{ marginTop: 32 }}>
        <UserTimeline
          timeline={timeline}
          personId={id}
          onChange={demoMode ? (t) => setTimeline(t) : setTimeline}
          onDemoAdd={demoMode ? handleDemoTimelineAdd : undefined}
          onDemoDelete={demoMode ? handleDemoTimelineDelete : undefined}
        />
      </div>
      <div style={{ marginTop: 32 }}>
        <FlowersCandles flowers={flowers} candles={candles} personId={id} onChange={({ flowers, candles }) => { setFlowers(flowers); setCandles(candles); }} />
      </div>
      <div style={{ marginTop: 32 }}>
        <CommentSection comments={comments} personId={id} onChange={setComments} />
      </div>
    </div>
  );
};

export default PersonDetail;
