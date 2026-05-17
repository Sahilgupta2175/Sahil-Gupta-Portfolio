// Welcome email sent to a brand-new subscriber.
//
// This is a *pure structural fork* of templates/autoReplyEmail.js — the
// same DOM tree, the same CSS classes, the same @keyframes wave, the
// same single 600px breakpoint, the same paddings, the same font sizes.
// Only the textual content and the footer's unsubscribe link differ.
//
// We do NOT add inline-style enhancements here. The existing
// autoReplyEmail.js renders correctly in the user's Gmail (desktop +
// mobile) — replicating its approach verbatim gives us the same
// rendering guarantees for free.

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
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .social-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
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
      .social-links {
        flex-direction: column;
      }
      .social-link {
        width: 100%;
        justify-content: center;
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