
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Memorial from '../models/Memorial.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все мемориалы (публично)
router.get('/', async (req, res) => {
  try {
    const memorials = await Memorial.find().populate('createdBy', 'username email');
    res.json(memorials);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мемориалов', details: err.message });
  }
});

// Получить мемориал по shareUrl (публично)
router.get('/share/:shareUrl', async (req, res) => {
  try {
    const memorial = await Memorial.findOne({ shareUrl: req.params.shareUrl })
      .populate('createdBy', 'username email');
    if (!memorial) {
      return res.status(404).json({ error: 'Мемориал не найден' });
    }
    res.json(memorial);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мемориала', details: err.message });
  }
});

// Получить мемориалы пользователя
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Нет авторизации пользователя' });
    }
    const memorials = await Memorial.find({ createdBy: req.user.id });
    res.json(memorials);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мемориалов', details: err.message });
  }
});

// Создать мемориал
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, biography, imageUrl, birthDate, deathDate, location } = req.body;
    const memorial = await Memorial.create({
      name,
      biography,
      imageUrl,
      birthDate,
      deathDate,
      location,
      createdBy: req.user.id
    });
    res.json(memorial);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка создания мемориала' });
  }
});

// Изменить privacy мемориала
router.patch('/:id/privacy', authMiddleware, async (req, res) => {
  try {
    const { privacy } = req.body;
    if (!['public', 'friends', 'private'].includes(privacy)) {
      return res.status(400).json({ error: 'Некорректное значение privacy' });
    }
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { privacy },
      { new: true }
    );
    res.json({ privacy: memorial.privacy });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка изменения privacy' });
  }
});

// Настройка multer для загрузки файлов
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

// Получить мемориал по id (с полной инфой)
router.get('/:id', async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id)
      .populate('createdBy', 'username email');
    if (!memorial) return res.status(404).json({ error: 'Мемориал не найден' });
    // privacy check
    if (memorial.privacy === 'private') {
      // TODO: заменить на реальную проверку владельца
      // if (!req.user || req.user.id !== memorial.createdBy._id) {
      return res.status(403).json({ error: 'Страница мемориала закрыта владельцем' });
    }
    res.json({ memorial });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения мемориала' });
  }
});

// Загрузка фото
router.post('/:id/gallery', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: fileUrl } },
      { new: true }
    );
    res.json({ gallery: memorial.gallery, fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки фото' });
  }
});

// Загрузка видео
router.post('/:id/videos', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { videos: fileUrl } },
      { new: true }
    );
    res.json({ videos: memorial.videos, fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки видео' });
  }
});

// Добавить событие в таймлайн (с файлом)
router.post('/:id/timeline', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { date, text } = req.body;
    let media = req.body.media;
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { timeline: { date, text, media } } },
      { new: true }
    );
    res.json({ timeline: memorial.timeline });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления события' });
  }
});

// Возложить цветы
router.post('/:id/flowers', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { flowers: { user: req.user.id, date: new Date() } } },
      { new: true }
    );
    res.json({ flowers: memorial.flowers });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка возложения цветов' });
  }
});

// Зажечь свечу
router.post('/:id/candles', authMiddleware, async (req, res) => {
  try {
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { candles: { user: req.user.id, date: new Date() } } },
      { new: true }
    );
    res.json({ candles: memorial.candles });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка зажигания свечи' });
  }
});

// Добавить комментарий
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    const comment = {
      user: req.user.id,
      text,
      date: new Date()
    };
    const memorial = await Memorial.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    ).populate('comments.user', 'username');
    res.json({ comments: memorial.comments });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления комментария' });
  }
});

// Получить комментарии
router.get('/:id/comments', async (req, res) => {
  try {
    const memorial = await Memorial.findById(req.params.id)
      .populate('comments.user', 'username');
    res.json({ comments: memorial.comments });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения комментариев' });
  }
});

export default router;