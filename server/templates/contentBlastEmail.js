// "New content just dropped" email sent to every active subscriber when
// the admin publishes a blog or project.
//
// Same friendly visual language as templates/autoReplyEmail.js — pastel
// body, white card, purple gradient header, message-preview block,
// social-link pills, signature footer.
//
// Every critical visual property is duplicated INLINE on the element
// (color, background, padding, display, width). The <style> block is
// kept only as progressive enhancement for animations and hover effects
// — Gmail's mobile app strips it entirely.
//
// `kind` is 'blog' or 'project'. `item` is the saved Mongo doc.
const getContentBlastEmailHTML = (kind, item, unsubscribeUrl, portfolioUrl) => {
  const isBlog = kind === 'blog';
  const headerEmoji = isBlog ? '📝' : '🚀';
  const headerTitle = isBlog ? 'New blog post!' : 'New project shipped!';
  const headerSub = isBlog ? 'Fresh from the blog' : 'Fresh from the portfolio';
  const ctaLabel = isBlog ? 'Read the post' : 'View the project';
  const ctaUrl = item.externalUrl || item.liveUrl || portfolioUrl;
  const cover = item.coverImage || item.image || '';
  const excerpt = (item.excerpt || item.description || '').trim();
  const technologies = Array.isArray(item.technologies) ? item.technologies : [];
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const chips = (isBlog ? tags : technologies).slice(0, 5);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px; }
    .email-container { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); }
    .icon { animation: pop 2s ease-in-out infinite; display: inline-block; }
    @keyframes pop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .social-link:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); }
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px !important; }
      .email-container { border-radius: 12px !important; }
      .header { padding: 40px 20px !important; }
      .header h1 { font-size: 26px !important; }
      .content { padding: 30px 20px !important; }
      .greeting { font-size: 20px !important; }
      .feature-body { padding: 22px 20px !important; }
      .feature-title { font-size: 20px !important; }
      .feature-excerpt { padding: 16px 18px !important; font-size: 14px !important; }
      .action-button { display: block !important; padding: 14px 20px !important; font-size: 15px !important; }
      .social-link {
        display: block !important;
        width: 100% !important;
        margin: 8px 0 !important;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
  <div class="email-container" style="max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);">

    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 50px 30px; text-align: center;">
      <div class="icon" style="font-size: 64px; margin-bottom: 20px; display: inline-block;">${headerEmoji}</div>
      <h1 style="font-size: 32px; margin: 0 0 10px 0; font-weight: 700; color: #ffffff;">${headerTitle}</h1>
      <p style="font-size: 16px; opacity: 0.95; color: #ffffff; margin: 0;">${headerSub}</p>
    </div>

    <!-- Content -->
    <div class="content" style="padding: 50px 40px;">
      <div class="greeting" style="font-size: 24px; color: #667eea; font-weight: 700; margin-bottom: 20px;">Hey there! ✨</div>

      <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px; line-height: 1.6;">
        Just published something new and I wanted to make sure you saw it first.
        Hope it's useful — or at least an interesting read.
      </p>

      <!-- Feature card -->
      <div class="feature-card" style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin: 30px 0;">
        ${cover ? `<img src="${cover}" alt="${item.title}" width="100%" style="width:100%;max-width:100%;height:auto;display:block;border:0;" />` : ''}
        <div class="feature-body" style="padding: 28px 26px;">
          <h2 class="feature-title" style="font-size: 22px; color: #667eea; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3;">${item.title}</h2>
          ${excerpt ? `<div class="feature-excerpt" style="background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%); border-left: 4px solid #f472b6; padding: 18px 22px; border-radius: 8px; color: #4b5563; line-height: 1.7; margin: 0 0 18px 0;">${excerpt}</div>` : ''}
          ${chips.length ? `<div style="margin-top: 14px; line-height: 1.8;">${chips.map((c) => `<span style="display: inline-block; background: #f1f3ff; color: #667eea; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin: 0 4px 4px 0;">${c}</span>`).join('')}</div>` : ''}
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 32px 0 10px 0;">
        <a href="${ctaUrl}" class="action-button" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          <span style="color: #ffffff;">${ctaLabel} →</span>
        </a>
      </div>

      <!-- Connect with me -->
      <div style="text-align: center; margin: 40px 0 0 0;">
        <p style="font-size: 16px; color: #667eea; font-weight: 600; margin: 0 0 20px 0;">
          🔗 Connect with me
        </p>
        <div style="text-align: center; font-size: 0;">
          <a href="https://github.com/Sahilgupta2175" class="social-link" style="display: inline-block; margin: 0 6px 12px 6px; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.2;">
            <span style="color: #ffffff;">⭐</span> <span style="color: #ffffff;">GitHub</span>
          </a><a href="https://linkedin.com/in/sahilgupta2175" class="social-link" style="display: inline-block; margin: 0 6px 12px 6px; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.2;">
            <span style="color: #ffffff;">💼</span> <span style="color: #ffffff;">LinkedIn</span>
          </a><a href="${portfolioUrl}" class="social-link" style="display: inline-block; margin: 0 6px 12px 6px; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.2;">
            <span style="color: #ffffff;">🌐</span> <span style="color: #ffffff;">Portfolio</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer" style="background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%); padding: 40px 30px; text-align: center; color: #6b7280; font-size: 14px; border-top: 3px solid #667eea;">
      <div style="font-size: 18px; color: #667eea; font-weight: 700; margin-bottom: 10px;">Cheers,<br/>Sahil Gupta</div>
      <p style="margin: 15px 0 0 0; color: #6b7280;">Full-Stack Developer | MERN Stack Specialist</p>
      <p style="margin: 18px 0 0 0; font-size: 12px; color: #9ca3af;">
        You're getting this because you subscribed at
        <a href="${portfolioUrl}" style="color: #667eea; text-decoration: none;">${portfolioUrl.replace(/^https?:\/\//, '')}</a>.<br/>
        Don't want these emails? <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> in one click.
      </p>
      <p style="margin: 14px 0 0 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Sahil Gupta. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = getContentBlastEmailHTML;
