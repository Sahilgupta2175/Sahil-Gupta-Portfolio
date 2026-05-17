const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { protect } = require('../middleware/auth');
const { sendWelcomeAndNotify, frontendUrl } = require('../utils/notify');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/subscribers — public sign-up from the footer form.
router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber && subscriber.active) {
      // Already on the list — friendly response, no duplicate welcome.
      return res.json({ success: true, message: "You're already subscribed!" });
    }

    if (subscriber && !subscriber.active) {
      // Re-activate a previously-unsubscribed entry.
      subscriber.active = true;
      subscriber.unsubscribedAt = undefined;
      await subscriber.save();
    } else {
      subscriber = await Subscriber.create({ email, source: req.body.source || 'footer' });
    }

    // Fire-and-forget so the response is fast even if Gmail is slow.
    sendWelcomeAndNotify(subscriber).catch((e) =>
      console.error('sendWelcomeAndNotify error:', e.message)
    );

    res.status(201).json({ success: true, message: 'Subscribed! Check your inbox for a confirmation.' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// GET /api/subscribers/unsubscribe?token=xxx
// Linked from every email. Returns a small HTML page (not JSON) so the
// click experience works in a browser.
router.get('/unsubscribe', async (req, res) => {
  const token = (req.query.token || '').toString();
  const renderPage = (title, body) => `
<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0f;color:#e4e4e7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
    .card{background:#12121a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px;text-align:center;max-width:480px;}
    h1{font-size:24px;margin:0 0 12px 0;background:linear-gradient(135deg,#6366f1,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
    p{color:#a1a1aa;line-height:1.6;margin:0 0 20px 0;}
    a{display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:12px 28px;text-decoration:none;border-radius:24px;font-weight:600;font-size:14px;}
  </style>
</head><body><div class="card">${body}<p style="margin-top:24px;"><a href="${frontendUrl()}">Back to portfolio</a></p></div></body></html>`;

  if (!token) {
    return res.status(400).send(renderPage('Invalid link',
      '<h1>Invalid unsubscribe link</h1><p>The link is missing a token. Please use the unsubscribe link from a recent email.</p>'));
  }

  try {
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    if (!subscriber) {
      return res.status(404).send(renderPage('Not found',
        '<h1>We couldn\'t find your subscription</h1><p>This unsubscribe link may have expired or already been used.</p>'));
    }

    if (!subscriber.active) {
      return res.send(renderPage('Already unsubscribed',
        `<h1>You're already unsubscribed</h1><p>The email <strong>${subscriber.email}</strong> is no longer receiving updates.</p>`));
    }

    subscriber.active = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.send(renderPage('Unsubscribed',
      `<h1>You're unsubscribed</h1><p>Sorry to see you go, <strong>${subscriber.email}</strong>. You won't receive any more updates. You can resubscribe any time from the portfolio.</p>`));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send(renderPage('Error',
      '<h1>Something went wrong</h1><p>Please try again in a moment.</p>'));
  }
});

// ---------- admin endpoints ----------

// GET /api/subscribers/admin — full list (admin only)
router.get('/admin', protect, async (req, res) => {
  try {
    const all = await Subscriber.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// DELETE /api/subscribers/:id — admin hard-delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const existing = await Subscriber.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
