import express from 'express';
import multer from 'multer';
import path from 'path';
import Company from '../models/Company.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Получить список всех компаний
router.get('/', async (req, res) => {
  try {
    console.log('Запрос на /api/company');
    const companies = await Company.find();
    console.log('Компании:', companies);
    res.json(companies);
  } catch (err) {
    console.error('Ошибка получения компаний:', err);
    res.status(500).json({ error: 'Ошибка получения списка компаний' });
  }
});
// Получить публичные данные компании по id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Компания не найдена' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения компании' });
  }
});

// Настройка хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'upload/company'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Загрузка изображения для услуги
router.post('/account/service-image/:idx', upload.single('image'), async (req, res) => {
  const idx = parseInt(req.params.idx);
  const company = await Company.findOne();
  if (!company || !company.services[idx]) return res.status(404).json({ error: 'Услуга не найдена' });
  if (!req.file) return res.status(400).json({ error: 'Нет файла' });
  const imageUrl = '/upload/company/' + req.file.filename;
  company.services[idx].image = imageUrl;
  await company.save();
  res.json({ image: imageUrl });
});

// Загрузка фото компании (аватар)
router.post('/account/photo', upload.single('photo'), async (req, res) => {
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  if (!req.file) return res.status(400).json({ error: 'Нет файла' });
  const photoUrl = '/upload/company/' + req.file.filename;
  company.photo = photoUrl;
  await company.save();
  res.json({ photo: photoUrl });
});

// Загрузка фото в галерею
router.post('/account/gallery', upload.array('gallery', 10), async (req, res) => {
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'Нет файлов' });
  const urls = req.files.map(f => '/upload/company/' + f.filename);
  company.gallery = [...(company.gallery || []), ...urls];
  await company.save();
  res.json({ gallery: company.gallery });
});

// Удаление фото из галереи (обновление массива)
router.put('/account/gallery', async (req, res) => {
  // TODO: заменить на реальную авторизацию
  const { gallery } = req.body;
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  company.gallery = gallery;
  await company.save();
  res.json({ gallery });
});

// Регистрация компании
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }
    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Компания с таким email уже существует' });
    }
    const hash = await bcrypt.hash(password, 10);
    const company = await Company.create({ name, email, password: hash, description });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Вход компании
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ error: 'Компания не найдена' });
    const valid = await bcrypt.compare(password, company.password);
    if (!valid) return res.status(400).json({ error: 'Неверный пароль' });
    const token = jwt.sign({ id: company._id, role: 'company' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

// Получить данные компании (личный кабинет)
router.get('/account', async (req, res) => {
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  res.json(company);
});

// Обновить услуги компании

// Получить услуги компании
router.get('/account/services', async (req, res) => {
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  res.json({ services: company.services || [] });
});

// Добавить услугу
router.post('/account/services', async (req, res) => {
  const { name, description, price } = req.body;
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company) return res.status(404).json({ error: 'Компания не найдена' });
  const newService = { name, description, price };
  company.services.push(newService);
  await company.save();
  res.json({ services: company.services });
});

// Редактировать услугу
router.put('/account/services/:idx', async (req, res) => {
  const { name, description, price } = req.body;
  const idx = parseInt(req.params.idx);
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company || !company.services[idx]) return res.status(404).json({ error: 'Услуга не найдена' });
  company.services[idx] = { name, description, price };
  await company.save();
  res.json({ services: company.services });
});

// Удалить услугу
router.delete('/account/services/:idx', async (req, res) => {
  const idx = parseInt(req.params.idx);
  // TODO: заменить на реальную авторизацию
  const company = await Company.findOne();
  if (!company || !company.services[idx]) return res.status(404).json({ error: 'Услуга не найдена' });
  company.services.splice(idx, 1);
  await company.save();
  res.json({ services: company.services });
});

export default router;
