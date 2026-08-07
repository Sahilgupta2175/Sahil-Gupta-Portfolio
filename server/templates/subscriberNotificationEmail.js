// Admin alert when a new subscriber joins.
//
// Shares the admin panel layout with notificationEmail via PANEL_CSS. It
// adds a .count-pill badge for the active-subscriber total and drops the
// .message-box section (a subscriber has no message to show).
//
// `subscribedAtIST` is a pre-formatted string from notify.js, produced
// with timeZone: 'Asia/Kolkata' so the timestamp reflects IST regardless
// of the server's process timezone.

const escapeHtml = require('../utils/escapeHtml');
const { PANEL_CSS } = require('./emailShell');

const getSubscriberNotificationEmailHTML = (subscriber, totalCount, adminDashboardUrl, subscribedAtIST) => {
  const safeEmail = escapeHtml(subscriber.email);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Subscriber</title>
  <style>${PANEL_CSS}
    .count-pill {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="icon">🎉</div>
      <h1>New Subscriber!</h1>
      <p>Someone just joined your update list</p>
    </div>

    <div class="content">
      <div class="greeting">Hey Sahil! 👋</div>
      <p style="margin-bottom: 20px; color: #4b5563;">Great news — your mailing list just grew. Here are the details:</p>

      <div class="info-card">
        <div class="info-label">Email</div>
        <div class="info-value">
          <a href="mailto:${safeEmail}" style="color: #667eea; text-decoration: none; font-weight: 500;">${safeEmail}</a>
        </div>

        <div class="info-label">Subscribed at (IST)</div>
        <div class="info-value">${subscribedAtIST}</div>

        <div class="info-label">Total active subscribers</div>
        <div class="info-value"><span class="count-pill">${totalCount}</span></div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${adminDashboardUrl}" class="action-button">
          Open subscribers dashboard →
        </a>
      </div>
    </div>

    <div class="footer">
      <p>This alert was sent from your portfolio backend</p>
      <div class="footer-links">
        <a href="https://github.com/Sahilgupta2175">GitHub</a> |
        <a href="https://linkedin.com/in/sahilgupta2175">LinkedIn</a>
      </div>
      <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Sahil Gupta. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getSubscriberNotificationEmailHTML;
