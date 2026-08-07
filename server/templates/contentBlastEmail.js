// "New content just dropped" email sent to every active subscriber when
// the admin publishes a blog or project.
//
// Shares the card layout with autoReplyEmail via CARD_CSS. On top of it:
//   1. .feature-card replaces the .message-preview slot — new content has
//      a cover image + title + excerpt + chips, not a quoted user message.
//   2. .cta-row / .action-button for "Read the post" / "View the project".
//   3. @keyframes pop instead of wave, so the icon bobs rather than rotates.
//
// `kind` is 'blog' or 'project'. `item` is the saved Mongo doc.
const escapeHtml = require('../utils/escapeHtml');
const { CARD_CSS } = require('./emailShell');

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

  // Escape admin/RSS-sourced text before it goes into the email HTML.
  const safeTitle = escapeHtml(item.title);
  const safeExcerpt = escapeHtml(excerpt);
  const safeCover = escapeHtml(cover);
  const safeCtaUrl = escapeHtml(ctaUrl);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${headerTitle}</title>
    <style>${CARD_CSS}
    .icon {
        font-size: 64px;
        margin-bottom: 20px;
        animation: pop 2s ease-in-out infinite;
        display: inline-block;
      }
    @keyframes pop {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    .feature-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        margin: 30px 0;
      }
    .feature-cover {
        width: 100%;
        height: auto;
        display: block;
      }
    .feature-body {
        padding: 28px 26px;
      }
    .feature-title {
        font-size: 22px;
        color: #667eea;
        font-weight: 700;
        margin-bottom: 12px;
        line-height: 1.3;
      }
    .feature-excerpt {
        background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%);
        border-left: 4px solid #f472b6;
        padding: 18px 22px;
        border-radius: 8px;
        font-style: italic;
        color: #4b5563;
        line-height: 1.7;
        margin: 0 0 18px 0;
      }
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 14px;
      }
    .chip {
        display: inline-block;
        background: #f1f3ff;
        color: #667eea;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
      }
    .cta-row {
        text-align: center;
        margin: 32px 0 10px 0;
      }
    .action-button {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 36px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
      }
    /* Clean Mobile Query */
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
        .feature-body {
          padding: 22px 20px;
        }
        .feature-title {
          font-size: 20px;
        }
        .feature-excerpt {
          padding: 16px 18px;
          font-size: 14px;
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
        <div class="icon">${headerEmoji}</div>
        <h1>${headerTitle}</h1>
        <p>${headerSub}</p>
      </div>

      <div class="content">
        <div class="greeting">Hi there! ✨</div>

        <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px;">
          Just published something new and I wanted to make sure you saw it first.
          Hope it's useful — or at least an interesting read.
        </p>

        <div class="feature-card">
          ${cover ? `<img src="${safeCover}" alt="${safeTitle}" class="feature-cover" />` : ''}
          <div class="feature-body">
            <h2 class="feature-title">${safeTitle}</h2>
            ${excerpt ? `<div class="feature-excerpt">${safeExcerpt}</div>` : ''}
            ${chips.length ? `<div class="chips">${chips.map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join('')}</div>` : ''}
          </div>
        </div>

        <div class="cta-row">
          <a href="${safeCtaUrl}" class="action-button" style="color: #ffffff;">${ctaLabel} →</a>
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
      </div>

      <div class="footer">
        <div class="footer-signature">Cheers,<br/>Sahil Gupta</div>
        <p style="margin-top: 15px;">Full-Stack Developer | MERN Stack Specialist</p>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
          You're getting this because you subscribed at
          <a href="${portfolioUrl}" style="color: #667eea; text-decoration: none;">${portfolioUrl.replace(/^https?:\/\//, '')}</a>.
        </p>
        <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
          Don't want these emails? <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> in one click.
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

module.exports = getContentBlastEmailHTML;
