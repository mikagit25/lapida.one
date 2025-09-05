
import express from 'express';
import User from '../models/user.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/profile/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    if (user.privacy === 'private' && req.user.id !== user.id) {
      return res.status(403).json({ error: 'Профиль закрыт владельцем' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка получения профиля' });
  }
});

// PATCH /api/profile/:id/privacy
router.patch('/:id/privacy', authMiddleware, async (req, res) => {
  try {
    const { privacy } = req.body;
    if (!['public', 'friends', 'private'].includes(privacy)) {
      return res.status(400).json({ error: 'Некорректное значение privacy' });
    }
    // Только владелец может менять privacy
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Нет прав' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { privacy },
      { new: true }
    );
    res.json({ privacy: user.privacy });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка изменения privacy' });
  }
});

export default router;
