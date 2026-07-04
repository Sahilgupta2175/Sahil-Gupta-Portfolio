const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');
const { upload, destroyImage } = require('../middleware/upload');

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const buildExpPayload = (body, file) => {
  const payload = {
    role: body.role,
    company: body.company,
    location: body.location || '',
    period: body.period,
    description: body.description || '',
    achievements: parseArrayField(body.achievements),
    technologies: parseArrayField(body.technologies),
    order: Number(body.order) || 0
  };
  if (file) {
    payload.logo = file.path;
    payload.logoPublicId = file.filename;
  }
  return payload;
};

// GET /api/experience — public, sorted by display order then newest first
router.get('/', async (req, res) => {
  try {
    // Newest first — most recent role at the top of the timeline.
    const items = await Experience.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Experience.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Experience not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const exp = new Experience(buildExpPayload(req.body, req.file));
    await exp.save();
    res.status(201).json(exp);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const existing = await Experience.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Experience not found' });

    const payload = buildExpPayload(req.body, req.file);

    if (req.file && existing.logoPublicId) {
      await destroyImage(existing.logoPublicId);
    }

    Object.assign(existing, payload);
    await existing.save();
    res.json(existing);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const existing = await Experience.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Experience not found' });
    if (existing.logoPublicId) await destroyImage(existing.logoPublicId);
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
