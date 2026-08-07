// Shared CSS for the HTML email templates in this folder.
//
// The templates come in two visual families and each family's common rules
// live here once instead of being copy-pasted per template:
//
//   CARD_CSS  — the pastel "card" emails sent to a person:
//               autoReplyEmail, subscriberWelcomeEmail, contentBlastEmail
//   PANEL_CSS — the purple "panel" emails sent to the admin:
//               notificationEmail, subscriberNotificationEmail
//
// Each template emits `<style>${CARD_CSS}${ownRules}</style>`. Its own rules
// come AFTER the shared ones, so anything a template needs to override
// (a gradient, a padding, a breakpoint) still wins on cascade order.

const CARD_CSS = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      padding: 40px 20px;
    }
    .email-container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 50px 30px;
      text-align: center;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>');
      opacity: 0.3;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
      position: relative;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
      position: relative;
    }
    .content {
      padding: 50px 40px;
    }
    .greeting {
      font-size: 24px;
      color: #667eea;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .footer {
      background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%);
      padding: 40px 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 3px solid #667eea;
    }
    .footer-signature {
      font-size: 18px;
      color: #667eea;
      font-weight: 700;
      margin-bottom: 10px;
    }
`;

const PANEL_CSS = `
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
`;

module.exports = { CARD_CSS, PANEL_CSS };
