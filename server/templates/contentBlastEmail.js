// "New post / new project" email sent to every active subscriber.
// `kind` is 'blog' or 'project'; `item` is the saved Mongo doc.
const escapeHtml = require('../utils/escapeHtml');
const { C, link, eyebrow, heading, para, button, quote, tags, layout } = require('./emailShell');

const getContentBlastEmailHTML = (kind, item, unsubscribeUrl, portfolioUrl) => {
  const isBlog = kind === 'blog';
  const title = escapeHtml(item.title);
  const rawExcerpt = (item.excerpt || item.description || '').trim().replace(/\s+/g, ' ');
  const excerpt = escapeHtml(rawExcerpt);
  const cover = escapeHtml(item.coverImage || item.image || '');
  const ctaUrl = escapeHtml(item.externalUrl || item.liveUrl || portfolioUrl);
  const chips = isBlog
    ? (item.tags || []).slice(0, 4).map((t) => `#${escapeHtml(t)}`)
    : (item.technologies || []).slice(0, 6).map(escapeHtml);
  const meta = isBlog
    ? `Fresh on the blog${item.readTime ? ` &middot; ${escapeHtml(item.readTime)}` : ''}`
    : 'Just shipped';

  const body = `
    ${eyebrow(meta, C.olive)}
    ${cover ? `<img src="${cover}" alt="${title}" width="518" style="display:block;width:100%;max-width:518px;height:auto;margin:0 0 26px;border:1px solid ${C.line};border-radius:14px;">` : ''}
    ${heading(title)}
    ${excerpt ? quote(excerpt) : ''}
    ${tags(chips)}
    ${button(ctaUrl, isBlog ? 'Read the post' : 'View the project')}
    ${para(`Or browse everything on ${link(portfolioUrl, 'the portfolio')}.`, { size: 14, color: C.muted, margin: '18px 0 0' })}
  `;

  return layout({
    title: `${isBlog ? 'New post' : 'New project'}: ${title}`,
    preheader: escapeHtml(rawExcerpt.slice(0, 140)),
    label: isBlog ? 'New post' : 'New project',
    siteUrl: portfolioUrl,
    body,
    footerNote: `You're getting this because you subscribed at ${link(portfolioUrl, portfolioUrl.replace(/^https?:\/\//, ''), C.muted)}. ${link(unsubscribeUrl, 'Unsubscribe', C.muted)} in one click.`
  });
};

module.exports = getContentBlastEmailHTML;
