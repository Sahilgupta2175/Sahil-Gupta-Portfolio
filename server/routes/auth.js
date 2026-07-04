const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// POST /api/auth/login
// Body: { email, password } — single-admin model driven by env vars.
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Admin auth not configured (ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET)'
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, email: ADMIN_EMAIL });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

module.exports = router;
