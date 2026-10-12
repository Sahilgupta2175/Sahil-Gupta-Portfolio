// Shared building blocks for every HTML email in this folder.
//
// Look: the portfolio's v3 style on a light page (ivory paper, ink text,
// hairline borders, one lime accent, mono labels). Light only, because mail
// apps that force a dark mode invert light designs far more gracefully.
//
// Built for real inboxes: table layout and inline styles everywhere (Gmail
// apps drop <style> for some accounts), fonts fall back to Helvetica/Arial,
// and every <a> carries its own inline colour (Gmail injects `a { color }`).
// The one <style> block holds only progressive extras: web fonts and the
// phone breakpoint.
//
// Text from users / admin / RSS must be escaped by the caller (escapeHtml)
// before it reaches these helpers.

const SITE_URL = process.env.FRONTEND_URL || 'https://sahilgupta-sg.vercel.app';

const C = {
  page: '#F3F2EC',
  card: '#FBFAF6',
  soft: '#ECEBE4',
  line: '#D9D7CD',
  ink: '#0B0C09',
  ink2: '#3A3C33',
  muted: '#5E6055',
  accent: '#C8F169',
  olive: '#4F6128'
};

const F = {
  display: "'Bricolage Grotesque','Helvetica Neue',Helvetica,Arial,sans-serif",
  body: "'Hanken Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",
  mono: "'JetBrains Mono',SFMono-Regular,Menlo,Consolas,monospace"
};

const SOCIALS = [
  ['GitHub', 'https://github.com/Sahilgupta2175'],
  ['LinkedIn', 'https://linkedin.com/in/sahilgupta2175']
];

const link = (href, text, color = C.olive) =>
  `<a href="${href}" style="color:${color};text-decoration:underline;text-underline-offset:3px;">${text}</a>`;

// Small uppercase mono label.
const eyebrow = (text, color = C.muted) =>
  `<p style="margin:0 0 12px;font-family:${F.mono};font-size:11px;line-height:16px;letter-spacing:1.2px;text-transform:uppercase;color:${color};">${text}</p>`;

// Big display headline. `accentTail` is appended in olive (e.g. a trailing ".").
const heading = (html, accentTail = '') =>
  `<h1 class="em-h1" style="margin:0 0 18px;font-family:${F.display};font-weight:800;font-size:44px;line-height:46px;letter-spacing:-1.5px;color:${C.ink};">${html}${accentTail ? `<span style="color:${C.olive};">${accentTail}</span>` : ''}</h1>`;

const para = (html, { size = 16, color = C.ink2, margin = '0 0 16px' } = {}) =>
  `<p style="margin:${margin};font-family:${F.body};font-size:${size}px;line-height:${Math.round(size * 1.6)}px;color:${color};">${html}</p>`;

// Bulletproof pill button. `accent` = lime fill, `ink` = black fill.
const button = (href, label, variant = 'accent') => {
  const bg = variant === 'ink' ? C.ink : C.accent;
  const fg = variant === 'ink' ? C.page : C.ink;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="em-btn" style="margin:8px 0 4px;"><tr>
  <td align="center" bgcolor="${bg}" style="border-radius:999px;background:${bg};">
    <a href="${href}" style="display:inline-block;padding:15px 28px;font-family:${F.body};font-size:15px;line-height:18px;font-weight:700;color:${fg};text-decoration:none;border-radius:999px;">${label} &rarr;</a>
  </td></tr></table>`;
};

// Label / value rows split by hairlines (contact + subscriber details).
const fields = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border-top:1px solid ${C.line};">${rows
    .map(([label, value]) => `<tr>
    <td valign="top" style="padding:14px 12px 14px 0;width:120px;border-bottom:1px solid ${C.line};font-family:${F.mono};font-size:11px;line-height:20px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${label}</td>
    <td valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};font-family:${F.body};font-size:15px;line-height:20px;color:${C.ink};word-break:break-word;">${value}</td>
  </tr>`)
    .join('')}</table>`;

// Quoted block (their message, a post excerpt).
const quote = (html) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;"><tr>
  <td style="padding:18px 20px;background:${C.soft};border-radius:14px;font-family:${F.body};font-size:15px;line-height:24px;color:${C.ink2};word-break:break-word;">${html}</td>
</tr></table>`;

// Rows with a lime marker, for short "what to expect" lists.
const bullets = (items) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;">${items
    .map((html) => `<tr>
    <td valign="top" style="width:22px;padding:7px 0;"><div style="width:10px;height:10px;margin-top:5px;border-radius:3px;background:${C.accent};border:1px solid ${C.olive};"></div></td>
    <td valign="top" style="padding:6px 0;font-family:${F.body};font-size:15px;line-height:22px;color:${C.ink2};">${html}</td>
  </tr>`)
    .join('')}</table>`;

// Mono #tags / tech names in a wrapping line.
const tags = (list) =>
  list.length
    ? `<p style="margin:0 0 18px;font-family:${F.mono};font-size:12px;line-height:20px;color:${C.olive};">${list.join('&nbsp;&nbsp; ')}</p>`
    : '';

// Full email document. `body` is the HTML that goes inside the card;
// `footerNote` sits under the signature (e.g. the unsubscribe line).
const layout = ({ title, preheader = '', label = '', body, footerNote = '', siteUrl = SITE_URL }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Hanken+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 620px) {
      .em-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .em-h1 { font-size: 34px !important; line-height: 37px !important; }
      .em-btn, .em-btn td, .em-btn a { display: block !important; width: 100% !important; box-sizing: border-box; text-align: center; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
    <tr><td align="center" style="padding:28px 12px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

        <tr><td style="padding:0 6px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle">
              <a href="${siteUrl}" style="text-decoration:none;color:${C.ink};">
                <span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:7px;background:${C.accent};font-family:${F.display};font-weight:800;font-size:15px;color:${C.ink};vertical-align:middle;">S</span>
                <span style="font-family:${F.mono};font-size:13px;color:${C.ink};vertical-align:middle;padding-left:8px;">sahil.gupta</span>
              </a>
            </td>
            <td align="right" valign="middle" style="font-family:${F.mono};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${C.muted};">${label}</td>
          </tr></table>
        </td></tr>

        <tr><td bgcolor="${C.card}" class="em-pad" style="background:${C.card};border:1px solid ${C.line};border-radius:22px;padding:40px 40px 32px;">
          ${body}
        </td></tr>

        <tr><td class="em-pad" style="padding:24px 26px 0;">
          <p style="margin:0 0 4px;font-family:${F.display};font-weight:800;font-size:18px;line-height:22px;color:${C.ink};">Sahil Gupta<span style="color:${C.olive};">.</span></p>
          <p style="margin:0 0 14px;font-family:${F.body};font-size:13px;line-height:20px;color:${C.muted};">Full-stack developer &middot; Orai, Uttar Pradesh, IN</p>
          <p style="margin:0 0 14px;font-family:${F.mono};font-size:12px;line-height:20px;color:${C.muted};">
            ${SOCIALS.map(([name, url]) => link(url, name, C.ink)).join(' &nbsp;&middot;&nbsp; ')} &nbsp;&middot;&nbsp; ${link(siteUrl, 'Portfolio', C.ink)}
          </p>
          ${footerNote ? `<p style="margin:0 0 8px;font-family:${F.body};font-size:12px;line-height:18px;color:${C.muted};">${footerNote}</p>` : ''}
          <p style="margin:0;font-family:${F.body};font-size:12px;line-height:18px;color:${C.muted};">&copy; ${new Date().getFullYear()} Sahil Gupta</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

module.exports = { SITE_URL, C, F, link, eyebrow, heading, para, button, fields, quote, bullets, tags, layout };
