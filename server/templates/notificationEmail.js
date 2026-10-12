// Admin alert: someone used the contact form.
const escapeHtml = require('../utils/escapeHtml');
const { C, link, eyebrow, heading, button, fields, quote, layout } = require('./emailShell');

const getNotificationEmailHTML = (name, email, subject, message) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const body = `
    ${eyebrow('New message', C.olive)}
    ${heading(safeSubject)}
    ${fields([
      ['From', `<strong>${safeName}</strong>`],
      ['Email', link(`mailto:${safeEmail}`, safeEmail)],
      ['Subject', safeSubject]
    ])}
    ${eyebrow('Message')}
    ${quote(safeMessage)}
    ${button(`mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}`, `Reply to ${safeName}`, 'ink')}
  `;

  return layout({
    title: 'New contact message',
    preheader: `${safeName}: ${escapeHtml(String(message).replace(/\s+/g, ' ').slice(0, 120))}`,
    label: 'Contact form',
    body,
    footerNote: 'Sent from the contact form on your portfolio.'
  });
};

module.exports = getNotificationEmailHTML;
