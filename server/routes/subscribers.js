const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { protect } = require('../middleware/auth');
const { subscribeLimiter } = require('../middleware/rateLimit');
const escapeHtml = require('../utils/escapeHtml');
const { sendWelcomeAndNotify, frontendUrl } = require('../utils/notify');

// Disallow HTML metacharacters (< > " ') in addition to whitespace/@, so a
// crafted address can't carry markup into the unsubscribe page or admin email.
const EMAIL_REGEX = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

// POST /api/subscribers — public sign-up from the footer form.
router.post('/', subscribeLimiter, async (req, res) => {
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

    // Send both emails BEFORE responding. Fire-and-forget (setImmediate)
    // turned out to be broken in two ways:
    //  - On Vercel the serverless instance freezes after res.json(),
    //    so the deferred callback never ran until the next request woke
    //    the instance back up — that's why the email only arrived when
    //    you opened the admin dashboard.
    //  - On a corporate proxy the SMTP handshake is so slow that
    //    "deferred" effectively means "ten seconds from now, maybe".
    // Awaiting guarantees delivery. With pool: true, parallel sends and
    // an eagerly pre-warmed SMTP connection this typically completes in
    // 1-2 seconds, which is acceptable for a subscribe action.
    try {
      await sendWelcomeAndNotify(subscriber);
    } catch (e) {
      // Already logged internally; never fail the request over email.
      console.error('sendWelcomeAndNotify error:', e.message);
    }

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
<html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=Hanken+Grotesk:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body{margin:0;font-family:'Hanken Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif;background:#F3F2EC;color:#0B0C09;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 16px;box-sizing:border-box;}
    .card{background:#FBFAF6;border:1px solid #D9D7CD;border-radius:22px;padding:40px 32px;max-width:480px;width:100%;box-sizing:border-box;}
    .mark{display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;border-radius:8px;background:#C8F169;font-weight:800;margin-bottom:24px;}
    h1{font-family:'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:32px;line-height:1.05;letter-spacing:-1px;font-weight:800;margin:0 0 14px;}
    p{color:#3A3C33;line-height:1.6;margin:0 0 20px;}
    a{display:inline-block;background:#0B0C09;color:#F3F2EC;padding:14px 26px;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;}
  </style>
</head><body><div class="card"><div class="mark">S</div>${body}<p style="margin:28px 0 0;"><a href="${frontendUrl()}">Back to the portfolio &rarr;</a></p></div></body></html>`;

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
        `<h1>You're already unsubscribed</h1><p>The email <strong>${escapeHtml(subscriber.email)}</strong> is no longer receiving updates.</p>`));
    }

    subscriber.active = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.send(renderPage('Unsubscribed',
      `<h1>You're unsubscribed</h1><p>Sorry to see you go, <strong>${escapeHtml(subscriber.email)}</strong>. You won't receive any more updates. You can resubscribe any time from the portfolio.</p>`));
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
