const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { protect } = require('../middleware/auth');
const parseArrayField = require('../utils/parseArrayField');

const buildPayload = (body) => ({
  title: body.title || '',
  paragraphs: parseArrayField(body.paragraphs).filter(Boolean),
  // Drop rows where both fields are blank, so an empty form row never renders
  // as an empty card on the site.
  highlights: parseArrayField(body.highlights)
    .filter((h) => h && (h.label || h.value))
    .map((h) => ({ label: String(h.label || ''), value: String(h.value || '') })),
  badgeNumber: body.badgeNumber || '',
  badgeText: body.badgeText || '',
  updatedAt: new Date()
});

// GET /api/about — public. Returns null when the admin hasn't saved anything
// yet; the React component then keeps its bundled default copy.
router.get('/', async (req, res) => {
  try {
    res.json(await About.findOne());
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/about — admin only. Upserts the single document.
router.put('/', protect, async (req, res) => {
  try {
    const about = await About.findOneAndUpdate({}, buildPayload(req.body), {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
    res.json(about);
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
