// Rate limiters for the public POST endpoints (login brute-force, contact +
// subscribe spam). express-rate-limit keeps counters in memory, so on Vercel
// these are per-warm-instance and therefore approximate — good enough to blunt
// abuse for a personal site without standing up a shared Redis store.
const rateLimit = require('express-rate-limit');

const base = {
  standardHeaders: true,
  legacyHeaders: false
};

// Login: tight window keyed on IP to slow brute-forcing the single admin.
const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts. Please try again in a few minutes.' }
});

// Contact: each request fires two outbound emails, so cap aggressively.
const contactLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 5,
  message: { success: false, message: 'Too many messages sent. Please wait a minute and try again.' }
});

// Subscribe: one doc write + welcome/notify emails per request.
const subscribeLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 5,
  message: { success: false, message: 'Too many requests. Please wait a minute and try again.' }
});

module.exports = { loginLimiter, contactLimiter, subscribeLimiter };
