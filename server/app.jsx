import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routers/auth.js';
import deceasedRoutes from './routers/deceased.js';
import QRCode from 'qrcode';

// Загрузка переменных окружения
dotenv.config();

// Создание приложения Express
const app = express();

// Подключение к MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lapida';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/deceased', deceasedRoutes);

// Health-check
app.get('/api', (_, res) => res.json({ message: 'Lapida API v1' }));

// QR-код
app.get('/api/deceased/:slug/qr', async (req, res) => {
  const { slug } = req.params;
  const url = `https://lapida.one/p/${slug}`;
  try {
    const qr = await QRCode.toDataURL(url, { width: 300 });
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));