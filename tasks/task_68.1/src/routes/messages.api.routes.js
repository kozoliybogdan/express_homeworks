const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// GET /api/messages - list last 50
router.get('/', async (req, res, next) => {
  try {
    const items = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
});

// POST /api/messages - create { text }
router.post('/', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Field "text" is required and must be a string' });
    }

    const item = await Message.create({ text });
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
