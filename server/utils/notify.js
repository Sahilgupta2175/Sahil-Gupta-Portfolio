// All outbound emails for the "Stay Updated" feature live here.
// Uses the same Gmail/Nodemailer setup as the contact form so we don't
// need any new credentials.
//
// Gmail caveats to keep in mind:
//   - Hard cap of ~500 sends/day per account
//   - Sending one email per subscriber (not BCC) for better deliverability
//   - 250ms delay between sends so we don't trip Gmail's burst limits
// If the subscriber list grows past ~50, consider switching to Resend.

const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

// Resolve the backend URL once. Unsubscribe links must point at the API
// (the only host that can flip `active`). Falls back to localhost for dev.
const backendUrl = () =>
  process.env.BACKEND_URL ||
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
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

// Shared email shell — gradient header + content + unsubscribe footer.
// Inline styles only (email clients ignore <style> blocks).
const shell = ({ headerEmoji, headerTitle, headerSub, bodyHtml, unsubUrl }) => `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#0a0a0f 0%,#1a1a2e 100%);padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#12121a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);padding:36px 30px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">${headerEmoji}</div>
          <h1 style="color:#ffffff;font-size:26px;margin:0 0 6px 0;font-weight:700;">${headerTitle}</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">${headerSub}</p>
        </td></tr>
        <tr><td style="padding:36px 30px;color:#e4e4e7;font-size:15px;line-height:1.7;">${bodyHtml}</td></tr>
        <tr><td style="background:#0a0a0f;padding:22px 30px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="color:#71717a;font-size:12px;margin:0 0 8px 0;">
            You're receiving this because you subscribed at <a href="${frontendUrl()}" style="color:#a5b4fc;text-decoration:none;">sahilgupta-sg.vercel.app</a>
          </p>
          ${unsubUrl ? `<p style="margin:0;"><a href="${unsubUrl}" style="color:#71717a;font-size:12px;text-decoration:underline;">Unsubscribe</a></p>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

// Sent to a brand-new subscriber so they know it worked.
const welcomeEmail = (subscriber) => ({
  to: subscriber.email,
  subject: 'Welcome — you\'re subscribed!',
  html: shell({
    headerEmoji: '✨',
    headerTitle: 'You\'re in!',
    headerSub: 'Thanks for subscribing to Sahil\'s updates',
    unsubUrl: unsubscribeUrl(subscriber.unsubscribeToken),
    bodyHtml: `
      <p style="margin:0 0 18px 0;">Hey 👋</p>
      <p style="margin:0 0 18px 0;">Thanks for subscribing! You\'ll get a short email from me whenever I:</p>
      <ul style="margin:0 0 18px 20px;padding:0;color:#a1a1aa;">
        <li style="margin-bottom:8px;">Publish a new blog post</li>
        <li style="margin-bottom:8px;">Ship a new project</li>
      </ul>
      <p style="margin:0 0 18px 0;color:#a1a1aa;">No spam, no fluff — only when there\'s something worth sharing.</p>
      <div style="text-align:center;margin-top:28px;">
        <a href="${frontendUrl()}" style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:24px;font-weight:600;font-size:14px;">Visit my portfolio</a>
      </div>
    `
  })
});

// Heads-up to the admin when someone subscribes.
const adminNotifyEmail = (subscriber, totalCount) => ({
  to: process.env.EMAIL_USER,
  subject: `🎉 New subscriber: ${subscriber.email}`,
  html: shell({
    headerEmoji: '🎉',
    headerTitle: 'New subscriber!',
    headerSub: 'Someone just joined your update list',
    unsubUrl: '',
    bodyHtml: `
      <p style="margin:0 0 18px 0;">A new person subscribed to your "Stay Updated" list:</p>
      <div style="background:rgba(99,102,241,0.08);border-left:3px solid #6366f1;padding:16px 18px;border-radius:8px;margin:0 0 18px 0;">
        <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;color:#a5b4fc;letter-spacing:1px;">Email</p>
        <p style="margin:0;font-size:16px;color:#e4e4e7;"><strong>${subscriber.email}</strong></p>
      </div>
      <p style="margin:0;color:#a1a1aa;font-size:13px;">Total active subscribers: <strong style="color:#e4e4e7;">${totalCount}</strong></p>
    `
  })
});

// One blast email tailored to a single subscriber (so each gets its own
// unsubscribe link). `item` carries the title/excerpt/url of the new content.
const contentBlastEmail = (subscriber, kind, item) => {
  const isBlog = kind === 'blog';
  const url = item.externalUrl || item.liveUrl || frontendUrl();
  const cover = item.coverImage || item.image || '';
  const excerpt = item.excerpt || item.description || '';
  const labelEmoji = isBlog ? '📝' : '🚀';
  const labelText = isBlog ? 'New blog post' : 'New project';

  return {
    to: subscriber.email,
    subject: `${labelEmoji} ${labelText}: ${item.title}`,
    html: shell({
      headerEmoji: labelEmoji,
      headerTitle: labelText,
      headerSub: 'Fresh from the portfolio',
      unsubUrl: unsubscribeUrl(subscriber.unsubscribeToken),
      bodyHtml: `
        ${cover ? `<img src="${cover}" alt="" style="width:100%;border-radius:10px;margin:0 0 22px 0;display:block;" />` : ''}
        <h2 style="font-size:22px;margin:0 0 12px 0;color:#ffffff;">${item.title}</h2>
        <p style="margin:0 0 22px 0;color:#a1a1aa;">${excerpt}</p>
        <div style="text-align:center;margin-top:6px;">
          <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;padding:14px 30px;text-decoration:none;border-radius:24px;font-weight:600;font-size:14px;">${isBlog ? 'Read the post' : 'View the project'} →</a>
        </div>
      `
    })
  };
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
  try {
    await sendOne(welcomeEmail(subscriber));
  } catch (e) {
    console.error('Welcome email failed:', e.message);
  }
  try {
    const totalCount = await Subscriber.countDocuments({ active: true });
    await sendOne(adminNotifyEmail(subscriber, totalCount));
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
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('📭 Blast skipped — no email transporter');
    return;
  }

  const subscribers = await Subscriber.find({ active: true });
  console.log(`📣 Blasting ${kind} "${item.title}" to ${subscribers.length} subscriber(s)`);

  let ok = 0;
  let failed = 0;
  for (const sub of subscribers) {
    try {
      await sendOne(contentBlastEmail(sub, kind, item));
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
  frontendUrl
};
