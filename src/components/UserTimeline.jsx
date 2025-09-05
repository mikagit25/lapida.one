import React, { useState, useRef } from 'react';
import axios from '../utils/axios';

export default function UserTimeline({ timeline = [], personId, onChange }) {
  const [events, setEvents] = useState(timeline);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ date: '', text: '', file: null });
  const fileInput = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!personId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('date', form.date);
    formData.append('text', form.text);
    if (form.file) formData.append('file', form.file);
    try {
      const res = await axios.post(`/api/deceased/${personId}/timeline`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEvents(res.data.timeline);
      onChange && onChange(res.data.timeline);
      setForm({ date: '', text: '', file: null });
      if (fileInput.current) fileInput.current.value = '';
    } catch (err) {
      alert('Ошибка добавления события');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!personId) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/deceased/${personId}/timeline`, { data: { eventId } });
      setEvents(res.data.timeline);
      onChange && onChange(res.data.timeline);
    } catch (err) {
      alert('Ошибка удаления события');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Таймлайн жизни</h3>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Описание события"
          required
        />
        <input
          type="file"
          name="file"
          accept="image/*,video/*"
          ref={fileInput}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>Добавить</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((ev) => (
          <li key={ev._id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div><b>{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</b></div>
            <div>{ev.text}</div>
            {ev.media && (ev.media.endsWith('.mp4') ? (
              <video src={ev.media} controls style={{ width: 180, marginTop: 4 }} />
            ) : (
              <img src={ev.media} alt="media" style={{ width: 120, marginTop: 4, borderRadius: 6 }} />
            ))}
            <button onClick={() => handleDelete(ev._id)} disabled={loading} style={{ marginTop: 4 }}>Удалить</button>
          </li>
        ))}
      </ul>
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
