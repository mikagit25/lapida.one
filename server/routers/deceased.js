
import express from 'express';
import Deceased from '../models/Deceased.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Изменить privacy deceased
router.patch('/:id/privacy', async (req, res) => {
  try {
    const { privacy } = req.body;
    if (!['public', 'friends', 'private'].includes(privacy)) {
      return res.status(400).json({ error: 'Некорректное значение privacy' });
    }
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { privacy },
      { new: true }
    );
    res.json({ privacy: person.privacy });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка изменения privacy' });
  }
});
// --- Flowers & Candles (bulk) ---
// GET /api/deceased/:id/flowers-candles
router.get('/:id/flowers-candles', async (req, res) => {
  try {
    const person = await Deceased.findById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Not found' });
    res.json({ flowers: person.flowers || [], candles: person.candles || [] });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения цветов и свечей' });
  }
});

// POST /api/deceased/:id/flowers-candles
router.post('/:id/flowers-candles', async (req, res) => {
  try {
    const { flowers, candles } = req.body;
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { flowers: flowers || [], candles: candles || [] },
      { new: true }
    );
    res.json({ flowers: person.flowers, candles: person.candles });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка обновления цветов и свечей' });
  }
});

// GET /api/deceased/id/:id
router.get('/id/:id', async (req, res) => {
  if (req.params.id === 'demo') {
    // Тестовые данные для демо-страницы
    return res.json({
      firstName: 'Иван',
      lastName: 'Иванов',
      birthDate: '1950-01-01',
      deathDate: '2020-01-01',
      epitaph: 'Светлая память!',
      slug: 'demo',
      gallery: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400'
      ],
      timeline: [
        { date: '1950-01-01', text: 'Рождение', media: '' },
        { date: '2020-01-01', text: 'Скончался', media: '' }
      ],
      flowers: [ { date: '2024-07-01' }, { date: '2024-07-02' } ],
      candles: [ { date: '2024-07-01' } ],
      comments: [
        { text: 'Светлая память!', date: '2024-07-01' },
        { text: 'Очень хороший человек.', date: '2024-07-02' }
      ],
      privacy: 'public'
    });
  }
  try {
    const doc = await Deceased.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    // privacy check
    if (doc.privacy === 'private') {
      // TODO: заменить на реальную проверку владельца
      // if (!req.user || req.user.id !== doc.owner) {
      return res.status(403).json({ error: 'Страница закрыта владельцем' });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve('uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});
const upload = multer({ storage });

// POST /api/deceased
router.post('/', async (req, res) => {
  try {
    const doc = await Deceased.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/deceased/:slug
router.get('/:slug', async (req, res) => {
  try {
    const doc = await Deceased.findOne({ slug: req.params.slug });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add photo to gallery
router.post('/:id/gallery', upload.single('file'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: fileUrl } },
      { new: true }
    );
    res.json({ gallery: person.gallery, fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки фото' });
  }
});

// Remove photo from gallery
router.delete('/:id/gallery', async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $pull: { gallery: fileUrl } },
      { new: true }
    );
    if (fileUrl && fileUrl.startsWith('/uploads/')) {
      const filePath = path.resolve('.' + fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ gallery: person.gallery });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления фото' });
  }
});


// --- Timeline ---
router.post('/:id/timeline', upload.single('file'), async (req, res) => {
  try {
    const { date, text } = req.body;
    let media = req.body.media;
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }
    const event = { date, text, media };
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $push: { timeline: event } },
      { new: true }
    );
    res.json({ timeline: person.timeline });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления события' });
  }
});

router.delete('/:id/timeline', async (req, res) => {
  try {
    const { eventId } = req.body;
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $pull: { timeline: { _id: eventId } } },
      { new: true }
    );
    res.json({ timeline: person.timeline });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления события' });
  }
});

// --- Flowers ---
router.post('/:id/flowers', async (req, res) => {
  try {
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $push: { flowers: { date: new Date() } } },
      { new: true }
    );
    res.json({ flowers: person.flowers });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка возложения цветов' });
  }
});

router.delete('/:id/flowers', async (req, res) => {
  try {
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $pop: { flowers: 1 } },
      { new: true }
    );
    res.json({ flowers: person.flowers });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления цветов' });
  }
});

// --- Candles ---
router.post('/:id/candles', async (req, res) => {
  try {
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $push: { candles: { date: new Date() } } },
      { new: true }
    );
    res.json({ candles: person.candles });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка зажигания свечи' });
  }
});

router.delete('/:id/candles', async (req, res) => {
  try {
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $pop: { candles: 1 } },
      { new: true }
    );
    res.json({ candles: person.candles });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления свечи' });
  }
});

// --- Comments ---
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Текст комментария обязателен' });
    const comment = {
      text,
      date: new Date()
    };
    const person = await Deceased.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );
    res.json({ comments: person.comments });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка добавления комментария' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const person = await Deceased.findById(req.params.id);
    res.json({ comments: person.comments });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения комментариев' });
  }
});

// --- QR code (заглушка, возвращает ссылку) ---
router.get('/:id/qrcode', async (req, res) => {
  try {
    // Здесь можно интегрировать генерацию QR-кода
    const url = `https://lapida.one/person/${req.params.id}`;
    res.json({ qrUrl: url });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка генерации QR-кода' });
  }
});

export default router;
