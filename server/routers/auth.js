
// DEBUG: Вывести значение JWT_SECRET в консоль
console.log('DEBUG JWT_SECRET:', process.env.JWT_SECRET);

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Настройка multer для загрузки файлов пользователя
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve('uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});
const upload = multer({ storage });

const router = express.Router();

// Добавить комментарий к профилю пользователя
router.post('/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Текст комментария обязателен' });
    const comment = {
      user: req.user.id,
      text,
      date: new Date()
    };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { comments: comment } },
      { new: true }
    ).populate('comments.user', 'username');
    res.json({ comments: user.comments });
  } catch {
    res.status(500).json({ error: 'Ошибка добавления комментария' });
  }
});

// Получить комментарии к профилю пользователя
router.get('/comments', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('comments.user', 'username');
    res.json({ comments: user.comments });
  } catch {
    res.status(500).json({ error: 'Ошибка получения комментариев' });
  }
});
// Возложить цветы пользователю
router.post('/flowers', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { flowers: { user: req.user.id, date: new Date() } } },
      { new: true }
    );
    res.json({ flowers: user.flowers });
  } catch {
    res.status(500).json({ error: 'Ошибка возложения цветов' });
  }
});

// Удалить цветы (последнее действие)
router.delete('/flowers', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pop: { flowers: 1 } },
      { new: true }
    );
    res.json({ flowers: user.flowers });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления цветов' });
  }
});

// Зажечь свечу пользователю
router.post('/candles', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { candles: { user: req.user.id, date: new Date() } } },
      { new: true }
    );
    res.json({ candles: user.candles });
  } catch {
    res.status(500).json({ error: 'Ошибка зажигания свечи' });
  }
});

// Удалить свечу (последнее действие)
router.delete('/candles', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pop: { candles: 1 } },
      { new: true }
    );
    res.json({ candles: user.candles });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления свечи' });
  }
});
// Добавить событие в таймлайн пользователя (с файлом)
router.post('/timeline', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { date, text } = req.body;
    let media = req.body.media;
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }
    const event = { date, text, media };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { timeline: event } },
      { new: true }
    );
    res.json({ timeline: user.timeline });
  } catch {
    res.status(500).json({ error: 'Ошибка добавления события' });
  }
});

// Удалить событие из таймлайна пользователя
router.delete('/timeline', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { timeline: { _id: eventId } } },
      { new: true }
    );
    res.json({ timeline: user.timeline });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления события' });
  }
});

// Removed duplicate imports and router declaration

// Проверка наличия JWT_SECRET при запуске
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET не найден! Устанавливаю временное значение.');
  process.env.JWT_SECRET = 'supersecretkey123'; // временно для теста
}




// Загрузка фото в галерею пользователя
router.post('/gallery', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { gallery: fileUrl } },
      { new: true }
    );
    res.json({ gallery: user.gallery, fileUrl });
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки фото' });
  }
});

// Загрузка видео в галерею пользователя
router.post('/videos', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { videos: fileUrl } },
      { new: true }
    );
    res.json({ videos: user.videos, fileUrl });
  } catch {
    res.status(500).json({ error: 'Ошибка загрузки видео' });
  }
});

// Удаление фото из галереи пользователя
router.delete('/gallery', authMiddleware, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { gallery: fileUrl } },
      { new: true }
    );
    // Физически удалить файл (опционально)
    if (fileUrl && fileUrl.startsWith('/uploads/')) {
      const filePath = path.resolve('.' + fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ gallery: user.gallery });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления фото' });
  }
});

// Удаление видео из галереи пользователя
router.delete('/videos', authMiddleware, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { videos: fileUrl } },
      { new: true }
    );
    // Физически удалить файл (опционально)
    if (fileUrl && fileUrl.startsWith('/uploads/')) {
      const filePath = path.resolve('.' + fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ videos: user.videos });
  } catch {
    res.status(500).json({ error: 'Ошибка удаления видео' });
  }
});
router.post('/register', async (req, res) => {
  try {
    let { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    // Простая валидация email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный email' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('DEBUG JWT TOKEN:', token);
    res.json({ user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    username = username.trim().toLowerCase();
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

// Middleware для проверки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Нет токена' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error('Ошибка JWT:', err);
    res.status(401).json({ error: 'Неверный токен' });
  }
}

// Обновление профиля
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// Смена пароля
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Старый пароль неверен' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Пароль обновлен' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка смены пароля' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('memorials')
      .populate('subscriptions')
      .populate('companies')
      .populate('recommendedCompanies')
      .populate('religiousOrgs')
      .populate('recommendedReligiousOrgs');
    res.json({ user });
  } catch (err) {
    console.error('Ошибка в /api/auth/me:', err);
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
});

export default router;

// Создать тестового пользователя (только для разработки) - GET запрос
router.get('/create-test-user', async (req, res) => {
  try {
    // Проверить, есть ли уже тестовый пользователь
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      return res.json({ 
        message: 'Тестовый пользователь уже существует', 
        user: { username: existingUser.username, email: existingUser.email },
        canLogin: true
      });
    }

    // Создать тестового пользователя
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = new User({ 
      username: 'testuser', 
      password: hashedPassword, 
      email: 'test@example.com' 
    });
    await user.save();
    
    res.json({ 
      message: 'Тестовый пользователь создан успешно!', 
      user: { username: user.username, email: user.email },
      credentials: { username: 'testuser', password: 'testpass' },
      canLogin: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания тестового пользователя' });
  }
});

// Создать тестового пользователя (только для разработки) - POST запрос
router.post('/create-test-user', async (req, res) => {
  try {
    // Проверить, есть ли уже тестовый пользователь
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      return res.json({ message: 'Тестовый пользователь уже существует', user: { username: existingUser.username, email: existingUser.email } });
    }

    // Создать тестового пользователя
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = new User({ 
      username: 'testuser', 
      password: hashedPassword, 
      email: 'test@example.com' 
    });
    await user.save();
    
    res.json({ message: 'Тестовый пользователь создан', user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания тестового пользователя' });
  }
});