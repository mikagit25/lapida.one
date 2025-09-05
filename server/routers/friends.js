import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();


// Получить список друзей пользователя
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Нет авторизации пользователя' });
    }
    // Для простоты: друзья — все пользователи кроме себя
    const users = await User.find({ _id: { $ne: req.user._id } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения друзей', details: err.message });
  }
});

export default router;
