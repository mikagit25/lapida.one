
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const FlowersCandles = ({ flowers = [], candles = [], personId, onChange, demoMode }) => {
  // demoMode: если true, работаем только с локальным состоянием
  const [localFlowers, setLocalFlowers] = useState(flowers);
  const [localCandles, setLocalCandles] = useState(candles);
  const [loading, setLoading] = useState(false);
  const [privacyError, setPrivacyError] = useState(null);
  const [privacyStatus, setPrivacyStatus] = useState(null);

  // Загрузка данных с сервера при инициализации (если не demoMode)
  useEffect(() => {
    if (!demoMode && !personId) {
      setLocalFlowers([]);
      setLocalCandles([]);
      setPrivacyError(null);
      setPrivacyStatus(null);
      return;
    }
    if (!demoMode && personId) {
      setLoading(true);
      axios.get(`/api/deceased/${personId}/flowers-candles`)
        .then(res => {
          setLocalFlowers(res.data.flowers || []);
          setLocalCandles(res.data.candles || []);
          setPrivacyError(null);
        })
        .catch(err => {
          if (err?.response?.status === 403) {
            setPrivacyError('Доступ ограничен владельцем');
            setLocalFlowers([]);
            setLocalCandles([]);
          } else {
            setPrivacyError('Ошибка загрузки данных');
          }
        })
        .finally(() => setLoading(false));
      // Получаем статус privacy
      axios.get(`/api/deceased/${personId}/privacy`)
        .then(res => {
          setPrivacyStatus(res.data.privacy || null);
        })
        .catch(() => setPrivacyStatus(null));
    } else {
      setLocalFlowers(flowers);
      setLocalCandles(candles);
      setPrivacyError(null);
      setPrivacyStatus(null);
    }
    // eslint-disable-next-line
  }, [personId, demoMode]);

  // Обновление данных на сервере
  const updateServer = async (newFlowers, newCandles) => {
    if (!personId) return;
    setLoading(true);
    try {
      await axios.post(`/api/deceased/${personId}/flowers-candles`, {
        flowers: newFlowers,
        candles: newCandles,
      });
    } catch (e) {}
    setLoading(false);
  };

  const handleAddFlower = async () => {
    const newFlowers = [...localFlowers, { date: new Date() }];
    setLocalFlowers(newFlowers);
    if (demoMode) return;
    await updateServer(newFlowers, localCandles);
    if (onChange) onChange({ flowers: newFlowers, candles: localCandles });
  };
  const handleAddCandle = async () => {
    const newCandles = [...localCandles, { date: new Date() }];
    setLocalCandles(newCandles);
    if (demoMode) return;
    await updateServer(localFlowers, newCandles);
    if (onChange) onChange({ flowers: localFlowers, candles: newCandles });
  };

  const handleDeleteFlower = async (idx) => {
    const newFlowers = localFlowers.filter((_, i) => i !== idx);
    setLocalFlowers(newFlowers);
    if (demoMode) return;
    await updateServer(newFlowers, localCandles);
    if (onChange) onChange({ flowers: newFlowers, candles: localCandles });
  };
  const handleDeleteCandle = async (idx) => {
    const newCandles = localCandles.filter((_, i) => i !== idx);
    setLocalCandles(newCandles);
    if (demoMode) return;
    await updateServer(localFlowers, newCandles);
    if (onChange) onChange({ flowers: localFlowers, candles: newCandles });
  };

  if (!personId && !demoMode) {
    return <div className="text-red-500">Ошибка: personId не задан</div>;
  }

  if (privacyError) {
    return (
      <div className="text-red-500 text-center py-4">
        {privacyError}
        {privacyStatus && (
          <div className="mt-2 text-gray-500">Статус приватности: <span className="font-semibold">{privacyStatus}</span></div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-8 justify-center items-center py-4 relative">
      {privacyStatus && (
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 shadow">
          Приватность: <span className="font-semibold">{privacyStatus}</span>
        </div>
      )}
      {loading && <div className="text-gray-400">Загрузка...</div>}
      <div className="flex flex-col items-center">
        <button
          className="bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full p-4 shadow transition"
          onClick={handleAddFlower}
          disabled={loading}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 0a4 4 0 014 4v2a4 4 0 01-4 4 4 4 0 01-4-4V8a4 4 0 014-4zm0 0v2m0 0a4 4 0 014 4v2a4 4 0 01-4 4 4 4 0 01-4-4V8a4 4 0 014-4z" />
          </svg>
        </button>
        <span className="mt-2 text-pink-700 font-semibold">Цветы: {localFlowers.length}</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {localFlowers.map((flower, idx) => (
            <span key={idx} className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-xs flex items-center">
              {flower.date ? new Date(flower.date).toLocaleDateString() : '—'}
              {demoMode && (
                <button className="ml-1 text-xs text-red-500" onClick={() => handleDeleteFlower(idx)} title="Удалить">✕</button>
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full p-4 shadow transition"
          onClick={handleAddCandle}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v6m0 0a2 2 0 012 2v6a2 2 0 01-2 2 2 2 0 01-2-2V10a2 2 0 012-2zm0 0v6" />
          </svg>
        </button>
        <span className="mt-2 text-yellow-700 font-semibold">Свечи: {localCandles.length}</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {localCandles.map((candle, idx) => (
            <span key={idx} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs flex items-center">
              {candle.date ? new Date(candle.date).toLocaleDateString() : '—'}
              {demoMode && (
                <button className="ml-1 text-xs text-red-500" onClick={() => handleDeleteCandle(idx)} title="Удалить">✕</button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowersCandles;
