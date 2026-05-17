// Admin alert when a new subscriber joins.
//
// Faithful mirror of templates/notificationEmail.js — same DOM, same
// pixel measurements, same 600px breakpoint, same .info-card pattern.
//
// Like the welcome template, every critical visual property is duplicated
// INLINE on the element. The action button specifically gets inline
// color: #ffffff because Gmail dark mode and the mobile app were
// rendering it with dark text (see user screenshot 3).
//
// `subscribedAtIST` is a pre-formatted string passed in from notify.js,
// produced with timeZone: 'Asia/Kolkata' so it shows the correct local
// time regardless of the server's process timezone.

const getSubscriberNotificationEmailHTML = (subscriber, totalCount, adminDashboardUrl, subscribedAtIST) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Subscriber</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; }
    .email-container { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 15px; }
    .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: 700; }
    .header p { font-size: 16px; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #667eea; font-weight: 600; margin-bottom: 20px; }
    .info-card { background: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .info-label { font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.5px; }
    .info-value { font-size: 16px; color: #333; margin-bottom: 15px; }
    .action-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px; }
    .footer-links a { color: #667eea; text-decoration: none; margin: 0 10px; font-weight: 500; }
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px !important; }
      .email-container { border-radius: 12px !important; }
      .header { padding: 30px 20px !important; }
      .header h1 { font-size: 24px !important; }
      .content { padding: 30px 20px !important; }
      .action-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div class="email-container" style="max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">

    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
      <div class="icon" style="font-size: 48px; margin-bottom: 15px;">🎉</div>
      <h1 style="font-size: 28px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff;">New Subscriber!</h1>
      <p style="font-size: 16px; opacity: 0.95; color: #ffffff; margin: 0;">Someone just joined your update list</p>
    </div>

    <!-- Content -->
    <div class="content" style="padding: 40px 30px;">
      <div class="greeting" style="font-size: 18px; color: #667eea; font-weight: 600; margin-bottom: 20px;">Hey Sahil! 👋</div>
      <p style="margin: 0 0 20px 0; color: #4b5563;">
        Great news — your mailing list just grew. Here are the details:
      </p>

      <div class="info-card" style="background: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <div style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.5px;">Email</div>
        <div style="font-size: 16px; color: #333333; margin-bottom: 15px;">
          <a href="mailto:${subscriber.email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${subscriber.email}</a>
        </div>

        <div style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.5px;">Source</div>
        <div style="font-size: 16px; color: #333333; margin-bottom: 15px;">${subscriber.source || 'footer'}</div>

        <div style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.5px;">Subscribed at (IST)</div>
        <div style="font-size: 16px; color: #333333; margin-bottom: 15px;">${subscribedAtIST}</div>

        <div style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.5px;">Total active subscribers</div>
        <div style="font-size: 16px; color: #333333; margin: 0;">
          <span style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 4px 14px; border-radius: 999px; font-weight: 700; font-size: 14px;">${totalCount}</span>
        </div>
      </div>

      <!-- Action button — inline white color so Gmail dark mode + mobile app render it correctly -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${adminDashboardUrl}" class="action-button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; font-size: 16px;">
          <span style="color: #ffffff;">Open subscribers dashboard →</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer" style="background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0;">This alert was sent from your portfolio backend</p>
      <div class="footer-links" style="margin-top: 15px;">
        <a href="https://github.com/Sahilgupta2175" style="color: #667eea; text-decoration: none; margin: 0 10px; font-weight: 500;">GitHub</a> |
        <a href="https://linkedin.com/in/sahilgupta2175" style="color: #667eea; text-decoration: none; margin: 0 10px; font-weight: 500;">LinkedIn</a>
      </div>
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Sahil Gupta. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getSubscriberNotificationEmailHTML;
