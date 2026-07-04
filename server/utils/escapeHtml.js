// Escape HTML special characters so user-supplied values (contact form,
// subscriber email, admin-entered blog/project fields) can't inject markup
// when interpolated into our HTML email templates / server-rendered pages.
const escapeHtml = (value) =>
  String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = escapeHtml;
