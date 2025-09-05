import React, { useState, useRef } from 'react';
import axios from '../utils/axios';

export default function UserGallery({ gallery = [], personId, onChange, demoMode }) {
  const [images, setImages] = useState(gallery);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (demoMode) {
      const url = URL.createObjectURL(file);
      const newGallery = [...images, url];
      setImages(newGallery);
      onChange && onChange({ gallery: newGallery });
      e.target.value = '';
      return;
    }
    if (!personId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const url = `/api/deceased/${personId}/gallery`;
      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages(res.data.gallery);
      onChange && onChange({ gallery: res.data.gallery });
    } catch (err) {
      alert('Ошибка загрузки файла');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (fileUrl) => {
    if (demoMode) {
      const newGallery = images.filter((img) => img !== fileUrl);
      setImages(newGallery);
      onChange && onChange({ gallery: newGallery });
      return;
    }
    if (!personId) return;
    setLoading(true);
    try {
      const url = `/api/deceased/${personId}/gallery`;
      await axios.delete(url, { data: { fileUrl } });
      const newGallery = images.filter((img) => img !== fileUrl);
      setImages(newGallery);
      onChange && onChange({ gallery: newGallery });
    } catch (err) {
      alert('Ошибка удаления файла');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Галерея</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {images.map((img) => (
          <div key={img} style={{ position: 'relative' }}>
            <img src={img} alt="memorial" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
            <button onClick={() => handleDelete(img)} style={{ position: 'absolute', top: 2, right: 2 }}>✕</button>
          </div>
        ))}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInput}
          onChange={handleUpload}
        />
        <button onClick={() => fileInput.current.click()} disabled={loading}>Добавить фото</button>
      </div>
      {loading && <div>Загрузка...</div>}
    </div>
  );
}
