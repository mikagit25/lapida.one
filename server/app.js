import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
console.log('DEBUG JWT_SECRET:', process.env.JWT_SECRET);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import connectDB from './config/db.js';

// Импорт моделей
import User from './models/user.js';
import Memorial from './models/Memorial.js';
import Company from './models/Company.js';
import './models/Subscription.js';
import './models/ReligiousOrg.js';

// Импорт роутеров
import authRoutes from './routers/auth.js';
import deceasedRoutes from './routers/deceased.js';
import companyRoutes from './routers/company.js';
import memorialRoutes from './routers/memorial.js';
import friendsRoutes from './routers/friends.js';
import profileRoutes from './routers/profile.js';

// Подключение к базе данных
connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5180', 'http://localhost:5181', 'http://localhost:5182'],
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Тестовый роут для диагностики Express
app.get('/api/company-test', (req, res) => {
  res.json([{ name: 'Тестовая компания', email: 'test@company.com' }]);
});

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/deceased', deceasedRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/memorial', memorialRoutes);
app.use('/api/friends', friendsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/uploads', express.static(path.resolve('uploads')));

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

// Инициализация тестовых данных после запуска сервера
const initTestData = async () => {
  try {
    // Обновляем существующие мемориалы без shareUrl
    const memorialsWithoutShareUrl = await Memorial.find({ shareUrl: { $exists: false } });
    for (const memorial of memorialsWithoutShareUrl) {
      const shareUrl = memorial.name
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const uniqueShareUrl = `${shareUrl}-${memorial.birthDate ? memorial.birthDate.getFullYear() : 'unknown'}-${memorial.deathDate ? memorial.deathDate.getFullYear() : 'unknown'}`;
      memorial.shareUrl = uniqueShareUrl;
      await memorial.save();
      console.log(`Обновлен shareUrl для мемориала: ${memorial.name} -> ${uniqueShareUrl}`);
    }

    // Добавить тестовый мемориал, если мемориалов нет
    const memorialCount = await Memorial.countDocuments();
    if (memorialCount === 0) {
      const demoUser = await User.findOne({ username: 'demo' });
      if (demoUser) {
        await Memorial.create({
          name: 'Иван Иванов',
          birthDate: '1950-01-01',
          deathDate: '2020-01-01',
          shareUrl: 'ivan-ivanov-1950-2020',
          description: 'Пример мемориала для теста',
          photos: [],
          candles: [],
          flowers: [],
          timeline: [],
          createdBy: demoUser._id
        });
        console.log('Тестовый мемориал создан');
      }
    }

    // Добавить тестовую компанию, если компаний нет
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      await Company.create({
        name: 'Lapida Demo',
        email: 'demo@lapida.one',
        password: 'demo123',
        description: 'Демо-компания для теста API',
        services: []
      });
      console.log('Тестовая компания создана');
    }
  } catch (error) {
    console.error('Ошибка инициализации тестовых данных:', error);
  }
};

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Health-check endpoint: http://localhost:' + PORT + '/api/health');
  
  // Инициализация тестовых данных через несколько секунд после запуска
  setTimeout(initTestData, 2000);
});
