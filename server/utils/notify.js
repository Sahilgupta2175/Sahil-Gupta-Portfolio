// All outbound emails for the "Stay Updated" feature live here.
// Uses the same Gmail/Nodemailer setup as the contact form so we don't
// need any new credentials.
//
// HTML for each email lives in server/templates/* so it sits alongside
// the existing contact-form templates and uses the same visual language.
//
// Send timing — IMPORTANT:
//   sendWelcomeAndNotify() MUST be awaited by callers. We do NOT use
//   setImmediate / fire-and-forget anymore because that broke in two
//   environments:
//     (1) Vercel serverless: after res.json() the function instance is
//         frozen until the next request, so deferred callbacks never
//         run until a new request wakes the instance up.
//     (2) Corporate proxies: SMTP handshake can take 10-30 seconds and
//         dropping the work into the void leaves it unobservable.
//   With connection pooling (pool: true), parallel sends (Promise.all)
//   and an eager pre-warm below, the awaited path is ~1-2 seconds.

const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');
const getSubscriberWelcomeEmailHTML = require('../templates/subscriberWelcomeEmail');
const getSubscriberNotificationEmailHTML = require('../templates/subscriberNotificationEmail');
const getContentBlastEmailHTML = require('../templates/contentBlastEmail');

// ---------- URL helpers ----------
const backendUrl = () =>
  process.env.BACKEND_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:5000';

const frontendUrl = () =>
  process.env.FRONTEND_URL || 'http://localhost:3000';

const unsubscribeUrl = (token) =>
  `${backendUrl()}/api/subscribers/unsubscribe?token=${encodeURIComponent(token)}`;

// ---------- Date helper ----------
// Always format dates in IST regardless of server timezone (Vercel runs in
// UTC). Without `timeZone: 'Asia/Kolkata'` the same .toLocaleString call
// shows 12:00 PM IST as 06:30 AM UTC in the admin notification email.
const formatIST = (date) =>
  new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

// ---------- Transporter ----------
// pool: true keeps a small SMTP connection pool open instead of doing a
// fresh TLS + AUTH handshake on every send. maxConnections=3 lets parallel
// sends actually run in parallel. The pool persists until the Node process
// dies (or the serverless instance is reclaimed).
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  _transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  return _transporter;
};

// Pre-warm the SMTP pool at module load — verify() opens a connection and
// performs the AUTH handshake immediately. Without this, the very first
// subscriber pays the full 1-3s connection cost on top of the actual send.
// Errors here are non-fatal: we'll retry lazily on the first real send.
const warmupTransporter = () => {
  const t = getTransporter();
  if (!t) return;
  t.verify()
    .then(() => console.log('📧 SMTP transporter ready (pool pre-warmed)'))
    .catch((e) => console.warn('⚠️  SMTP pre-warm failed (will retry on send):', e.message));
};
warmupTransporter();

// ---------- send helpers ----------
const sendOne = async (mail) => {
  const t = getTransporter();
  if (!t) {
    console.warn('📭 Skipping email — EMAIL_USER/EMAIL_PASS not configured');
    return false;
  }
  await t.sendMail({ from: `"Sahil Gupta" <${process.env.EMAIL_USER}>`, ...mail });
  return true;
};

// Sends both emails (welcome to the subscriber, notification to the admin)
// in parallel. Caller MUST await — see top-of-file note on why fire-and-
// forget is broken in our environments.
const sendWelcomeAndNotify = async (subscriber) => {
  const portfolio = frontendUrl();
  const unsubUrl = unsubscribeUrl(subscriber.unsubscribeToken);
  const adminDashboardUrl = `${portfolio}/admin`;

  const welcomeTask = sendOne({
    to: subscriber.email,
    subject: "Welcome — you're subscribed! ✨",
    html: getSubscriberWelcomeEmailHTML(subscriber, unsubUrl, portfolio)
  }).catch((e) => console.error('Welcome email failed:', e.message));

  const notifyTask = Subscriber.countDocuments({ active: true })
    .then((totalCount) =>
      sendOne({
        to: process.env.EMAIL_USER,
        subject: `🎉 New subscriber: ${subscriber.email}`,
        html: getSubscriberNotificationEmailHTML(
          subscriber,
          totalCount,
          adminDashboardUrl,
          formatIST(subscriber.createdAt)
        )
      })
    )
    .catch((e) => console.error('Admin notify email failed:', e.message));

  await Promise.all([welcomeTask, notifyTask]);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Blast helper for new blog / project. Iterates sequentially with a small
// gap between sends so Gmail doesn't flag bursty behavior. Subscribers
// each get their own unsubscribe token.
const blastNewContent = async (kind, item) => {
  if (!kind || !item) return;
  if (!getTransporter()) {
    console.warn('📭 Blast skipped — no email transporter');
    return;
  }

  const portfolio = frontendUrl();
  const subscribers = await Subscriber.find({ active: true });
  console.log(`📣 Blasting ${kind} "${item.title}" to ${subscribers.length} subscriber(s)`);

  const labelEmoji = kind === 'blog' ? '📝' : '🚀';
  const labelText = kind === 'blog' ? 'New blog post' : 'New project';

  let ok = 0;
  let failed = 0;
  for (const sub of subscribers) {
    const unsubUrl = unsubscribeUrl(sub.unsubscribeToken);
    try {
      await sendOne({
        to: sub.email,
        subject: `${labelEmoji} ${labelText}: ${item.title}`,
        html: getContentBlastEmailHTML(kind, item, unsubUrl, portfolio)
      });
      ok++;
    } catch (e) {
      failed++;
      console.error(`Blast to ${sub.email} failed:`, e.message);
    }
    await sleep(250);
  }
  console.log(`📣 Blast done. ok=${ok} failed=${failed}`);
};

module.exports = {
  sendWelcomeAndNotify,
  blastNewContent,
  unsubscribeUrl,
  frontendUrl,
  backendUrl,
  formatIST
};
