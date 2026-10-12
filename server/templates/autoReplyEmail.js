// Auto-reply sent to someone who used the contact form.
const escapeHtml = require('../utils/escapeHtml');
const { SITE_URL, C, eyebrow, heading, para, button, quote, layout } = require('./emailShell');

const getAutoReplyEmailHTML = (name, message) => {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const body = `
    ${eyebrow('Message received', C.olive)}
    ${heading(`Thanks, ${safeName}`, '.')}
    ${para("Your message reached me. I usually reply within 24 to 48 hours, straight from this address.")}
    ${eyebrow('You wrote')}
    ${quote(safeMessage)}
    ${para('While you wait, the latest projects and posts are on the portfolio.', { size: 15 })}
    ${button(SITE_URL, 'Look around')}
  `;

  return layout({
    title: 'Thanks for reaching out',
    preheader: "Got your message. I'll reply within a day or two.",
    label: 'Auto-reply',
    body,
    footerNote: "This is an automatic confirmation. I'll reply to you personally soon."
  });
};

module.exports = getAutoReplyEmailHTML;
