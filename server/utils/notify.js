// All outbound emails for the "Stay Updated" feature live here.
// Uses the same Gmail/Nodemailer setup as the contact form so we don't
// need any new credentials.
//
// HTML for each email lives in server/templates/* so it sits alongside
// the existing contact-form templates and uses the same visual language
// (light pastel background, white card, purple-gradient header, info-card
// blocks with colored left borders, pill-shaped social links, signature
// footer).
//
// Gmail caveats to keep in mind:
//   - Hard cap of ~500 sends/day per account
//   - Sending one email per subscriber (not BCC) for better deliverability
//   - 250ms delay between sends so we don't trip Gmail's burst limits
// If the subscriber list grows past ~50, consider switching to Resend.

const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');
const getSubscriberWelcomeEmailHTML = require('../templates/subscriberWelcomeEmail');
const getSubscriberNotificationEmailHTML = require('../templates/subscriberNotificationEmail');
const getContentBlastEmailHTML = require('../templates/contentBlastEmail');

// Resolve the backend URL once. Unsubscribe links must point at the API
// (the only host that can flip `active`). Falls back to localhost for dev.
const backendUrl = () =>
  process.env.BACKEND_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  'http://localhost:5000';

const frontendUrl = () =>
  process.env.FRONTEND_URL || 'http://localhost:3000';

const unsubscribeUrl = (token) =>
  `${backendUrl()}/api/subscribers/unsubscribe?token=${encodeURIComponent(token)}`;

// Lazy transporter so missing creds don't break server boot.
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  return _transporter;
};

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

const sendWelcomeAndNotify = async (subscriber) => {
  const portfolio = frontendUrl();
  const unsubUrl = unsubscribeUrl(subscriber.unsubscribeToken);

  // Welcome email to the subscriber
  try {
    await sendOne({
      to: subscriber.email,
      subject: "Welcome — you're subscribed! ✨",
      html: getSubscriberWelcomeEmailHTML(subscriber, unsubUrl, portfolio)
    });
  } catch (e) {
    console.error('Welcome email failed:', e.message);
  }

  // Notification to the admin
  try {
    const totalCount = await Subscriber.countDocuments({ active: true });
    const adminDashboardUrl = `${portfolio}/admin`;
    await sendOne({
      to: process.env.EMAIL_USER,
      subject: `🎉 New subscriber: ${subscriber.email}`,
      html: getSubscriberNotificationEmailHTML(subscriber, totalCount, adminDashboardUrl)
    });
  } catch (e) {
    console.error('Admin notify email failed:', e.message);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Blasts new content to every active subscriber. Fire-and-forget from the
// route handler — DO NOT await this, or admins will wait ~250ms × N for
// their "Add blog" save to return.
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
    // Be polite to Gmail's burst limits.
    await sleep(250);
  }
  console.log(`📣 Blast done. ok=${ok} failed=${failed}`);
};

module.exports = {
  sendWelcomeAndNotify,
  blastNewContent,
  unsubscribeUrl,
  frontendUrl,
  backendUrl
};
