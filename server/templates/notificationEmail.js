// Email template for admin notification when someone contacts you.
const escapeHtml = require('../utils/escapeHtml');
const { PANEL_CSS } = require('./emailShell');

const getNotificationEmailHTML = (name, email, subject, message) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>${PANEL_CSS}
    .message-box {
      background: #fff;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      font-size: 15px;
      line-height: 1.8;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="icon">📬</div>
      <h1>New Contact Message!</h1>
      <p>You've received a new message from your portfolio</p>
    </div>
    
    <div class="content">
      <div class="greeting">Hey Sahil! 👋</div>
      <p style="margin-bottom: 20px; color: #4b5563;">Great news! Someone wants to connect with you.</p>
      
      <div class="info-card">
        <div class="info-label">From</div>
        <div class="info-value"><strong>${safeName}</strong></div>
        
        <div class="info-label">Email</div>
        <div class="info-value">
          <a href="mailto:${safeEmail}" style="color: #667eea; text-decoration: none; font-weight: 500;">${safeEmail}</a>
        </div>
        
        <div class="info-label">Subject</div>
        <div class="info-value">${safeSubject}</div>
      </div>
      
      <div class="info-label" style="margin-top: 25px;">Message</div>
      <div class="message-box">${safeMessage}</div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" class="action-button" style="color: #ffffff;">
          Reply to ${safeName} →
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>This message was sent from your portfolio contact form</p>
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

module.exports = getNotificationEmailHTML;
