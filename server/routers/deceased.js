import express from 'express';
import Deceased from '../models/Deceased.js';

const router = express.Router();

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

export default router;
