// Welcome email sent to a brand-new subscriber.
//
// Shares the card layout with autoReplyEmail via CARD_CSS; only the text
// and the footer's unsubscribe link differ. Keep any new styling in plain
// <style> rules like the ones below — that's what renders correctly in
// Gmail desktop + mobile today.

const { CARD_CSS } = require('./emailShell');

const getSubscriberWelcomeEmailHTML = (subscriber, unsubscribeUrl, portfolioUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're subscribed!</title>
  <style>${CARD_CSS}
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: wave 2s ease-in-out infinite;
      display: inline-block;
    }
    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(20deg); }
      75% { transform: rotate(-20deg); }
    }
    .message-preview {
      background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%);
      border-left: 4px solid #f472b6;
      padding: 25px;
      margin: 30px 0;
      border-radius: 12px;
      color: #4b5563;
      line-height: 1.8;
    }
    .info-box {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }
    .info-box h3 {
      color: #667eea;
      font-size: 18px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .info-box p {
      color: #6b7280;
      margin-bottom: 10px;
      font-size: 15px;
    }
    /* Consolidated and corrected mobile media query */
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 10px;
      }
      .email-container {
        border-radius: 12px;
      }
      .header {
        padding: 40px 20px;
      }
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 30px 20px;
      }
      .greeting {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="icon">✨</div>
      <h1>You're subscribed!</h1>
      <p>Welcome to the inner circle</p>
    </div>

    <div class="content">
      <div class="greeting">Hi there! 👋</div>

      <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px;">
        Thank you so much for subscribing! I really appreciate you wanting to follow along.
        From now on you'll hear from me whenever I publish something new — and only then.
      </p>

      <div class="message-preview">
        Here's what to expect in your inbox:<br/><br/>
        ✍️ &nbsp; <strong style="color:#667eea;">New blog posts</strong> the moment I publish on Hashnode<br/>
        🚀 &nbsp; <strong style="color:#667eea;">New projects</strong> the moment they go live<br/>
        🚫 &nbsp; <strong style="color:#667eea;">No spam</strong> — only when there's something worth sharing
      </div>

      <div class="info-box">
        <h3>💡 What you can do now</h3>
        <p>• Reply to this email and say hi — I read every reply</p>
        <p>• Add my email address to your contacts so future updates don't land in spam</p>
        <p>• Check out the latest projects on my portfolio</p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <p style="font-size: 16px; color: #667eea; font-weight: 600; margin-bottom: 12px;">
          🔗 Connect with me
        </p>
        <p style="font-size: 15px; color: #9ca3af;">
          <a href="https://github.com/Sahilgupta2175" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 10px;">GitHub</a> |
          <a href="https://linkedin.com/in/sahilgupta2175" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 10px;">LinkedIn</a> |
          <a href="${portfolioUrl}" style="color: #667eea; text-decoration: none; font-weight: 500; margin: 0 10px;">Portfolio</a>
        </p>
      </div>

      <div style="background: linear-gradient(135deg, #fff5f7 0%, #f8f9ff 100%); padding: 25px; border-radius: 12px; text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
          🙌 Thanks again — your support means a lot.
        </p>
        <p style="color: #667eea; font-weight: 600;">Talk soon!</p>
      </div>
    </div>

    <div class="footer">
      <div class="footer-signature">Cheers,<br/>Sahil Gupta</div>
      <p style="margin-top: 15px;">Full-Stack Developer | MERN Stack Specialist</p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        This is an automated welcome message. You can reply directly any time.
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
        Changed your mind? <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> in one click.
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Sahil Gupta. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getSubscriberWelcomeEmailHTML;