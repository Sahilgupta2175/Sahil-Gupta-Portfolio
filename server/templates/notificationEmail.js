// Email template for admin notification when someone contacts you
const getNotificationEmailHTML = (name, email, subject, message) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }
    .email-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #667eea;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .info-card {
      background: #f8f9ff;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-label {
      font-size: 12px;
      text-transform: uppercase;
      color: #667eea;
      font-weight: 600;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 16px;
      color: #333;
      margin-bottom: 15px;
    }
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
    .action-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-links {
      margin-top: 15px;
    }
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
      font-weight: 500;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 10px;
      }
      .email-container {
        border-radius: 12px;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
      .action-button {
        display: block;
        text-align: center;
      }
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
        <div class="info-value"><strong>${name}</strong></div>
        
        <div class="info-label">Email</div>
        <div class="info-value">
          <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${email}</a>
        </div>
        
        <div class="info-label">Subject</div>
        <div class="info-value">${subject}</div>
      </div>
      
      <div class="info-label" style="margin-top: 25px;">Message</div>
      <div class="message-box">${message}</div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="action-button">
          Reply to ${name} →
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
