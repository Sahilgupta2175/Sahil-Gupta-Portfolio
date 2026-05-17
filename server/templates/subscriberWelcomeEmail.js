// Welcome email sent to a new subscriber. Mirrors the look of
// autoReplyEmail.js — pastel background, animated wave icon, friendly
// pink message-preview block, social-link pills, signature footer.
const getSubscriberWelcomeEmailHTML = (subscriber, unsubscribeUrl, portfolioUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're subscribed!</title>
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
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: sparkle 2s ease-in-out infinite;
      display: inline-block;
    }
    @keyframes sparkle {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.15) rotate(15deg); }
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 16px;
      opacity: 0.95;
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
    .lead {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 25px;
    }
    .perks-preview {
      background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%);
      border-left: 4px solid #f472b6;
      padding: 25px;
      margin: 30px 0;
      border-radius: 12px;
      color: #4b5563;
      line-height: 1.9;
    }
    .perks-preview strong {
      color: #667eea;
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
    }
    .info-box p {
      color: #6b7280;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
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
    .unsub {
      margin-top: 18px;
      font-size: 12px;
      color: #9ca3af;
    }
    .unsub a {
      color: #9ca3af;
      text-decoration: underline;
    }
    /* Tablet + small laptop */
    @media only screen and (max-width: 768px) {
      .email-container { max-width: 100%; }
    }
    /* Phones */
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px; }
      .email-container { border-radius: 12px; }
      .header { padding: 40px 20px; }
      .icon { font-size: 52px; margin-bottom: 14px; }
      .header h1 { font-size: 26px; }
      .header p { font-size: 14px; }
      .content { padding: 32px 22px; }
      .greeting { font-size: 20px; }
      .lead { font-size: 15px; }
      .perks-preview { padding: 20px; }
      .info-box { padding: 22px; }
      .info-box h3 { font-size: 16px; }
      .info-box p { font-size: 14px; }
      .social-links { flex-direction: column; }
      .social-link { width: 100%; justify-content: center; }
      .footer { padding: 30px 22px; }
      .footer-signature { font-size: 16px; }
    }
    /* Tiny phones */
    @media only screen and (max-width: 420px) {
      body { padding: 12px 6px; }
      .header { padding: 32px 16px; }
      .icon { font-size: 44px; }
      .header h1 { font-size: 22px; }
      .content { padding: 24px 16px; }
      .greeting { font-size: 18px; }
      .perks-preview { padding: 16px; font-size: 14px; }
      .info-box { padding: 18px; }
      .footer { padding: 26px 16px; }
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
      <div class="greeting">Hey there! 👋</div>

      <p class="lead">
        Thanks for subscribing to my updates! I'm thrilled to have you along
        for the ride. From now on, you'll be the first to hear when I ship
        something new.
      </p>

      <div class="perks-preview">
        Here's what you can expect in your inbox:<br/><br/>
        ✍️ &nbsp; <strong>New blog posts</strong> — when I publish on Hashnode<br/>
        🚀 &nbsp; <strong>New projects</strong> — the moment they go live<br/>
        🚫 &nbsp; <strong>No spam, ever</strong> — only when there's something worth sharing
      </div>

      <div class="info-box">
        <h3>💡 What to do now?</h3>
        <p>• Reply to this email and say hi — I read every reply</p>
        <p>• Check out the latest projects on my portfolio</p>
        <p>• Add my email address to your contacts so updates don't land in spam</p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <p style="font-size: 16px; color: #667eea; font-weight: 600; margin-bottom: 20px;">
          🔗 Connect with me
        </p>
        <div class="social-links">
          <a href="https://github.com/Sahilgupta2175" class="social-link">
            <span>⭐</span> GitHub
          </a>
          <a href="https://linkedin.com/in/sahilgupta2175" class="social-link">
            <span>💼</span> LinkedIn
          </a>
          <a href="${portfolioUrl}" class="social-link">
            <span>🌐</span> Portfolio
          </a>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, #fff5f7 0%, #f8f9ff 100%); padding: 25px; border-radius: 12px; text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
          🙌 Thanks again — your support means the world.
        </p>
        <p style="color: #667eea; font-weight: 600;">Talk soon!</p>
      </div>
    </div>

    <div class="footer">
      <div class="footer-signature">Cheers,<br/>Sahil Gupta</div>
      <p style="margin-top: 15px;">Full-Stack Developer | MERN Stack Specialist</p>
      <p class="unsub">
        You're receiving this because you subscribed at
        <a href="${portfolioUrl}" style="color: #667eea;">${portfolioUrl.replace(/^https?:\/\//, '')}</a>.<br/>
        Changed your mind? <a href="${unsubscribeUrl}">Unsubscribe</a> any time.
      </p>
      <p style="margin-top: 14px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Sahil Gupta. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getSubscriberWelcomeEmailHTML;
