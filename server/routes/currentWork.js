const express = require('express');
const router = express.Router();
const CurrentWork = require('../models/CurrentWork');
const { protect } = require('../middleware/auth');

const buildPayload = (body) => ({
  title: body.title,
  description: body.description,
  emoji: body.emoji || '🚀',
  status: body.status || 'Building',
  link: body.link || '',
  active: body.active === 'false' || body.active === false ? false : true
});

// GET /api/current-work — public list (only active entries, newest first)
router.get('/', async (req, res) => {
  try {
    const items = await CurrentWork.find({ active: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// Admin-only: list ALL (including hidden) so the dashboard can show drafts.
router.get('/all', protect, async (req, res) => {
  try {
    const items = await CurrentWork.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const item = new CurrentWork(buildPayload(req.body));
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Create current-work error:', error);
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const existing = await CurrentWork.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    Object.assign(existing, buildPayload(req.body));
    await existing.save();
    res.json(existing);
  } catch (error) {
    console.error('Update current-work error:', error);
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const existing = await CurrentWork.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

module.exports = router;
