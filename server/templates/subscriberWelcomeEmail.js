// Welcome email sent to a brand-new subscriber.
const { C, link, eyebrow, heading, para, button, bullets, layout } = require('./emailShell');

const getSubscriberWelcomeEmailHTML = (subscriber, unsubscribeUrl, portfolioUrl) => {
  const body = `
    ${eyebrow('Welcome', C.olive)}
    ${heading("You're on the list", '.')}
    ${para("Thanks for subscribing. You'll hear from me when I publish something new, and only then.")}
    ${bullets([
      '<strong style="color:' + C.ink + ';">New blog posts</strong> from Hashnode, the day they go live.',
      '<strong style="color:' + C.ink + ';">New projects</strong> as soon as they ship.',
      '<strong style="color:' + C.ink + ';">Nothing else.</strong> One email per new thing.'
    ])}
    ${para('Reply any time, I read every message. Adding this address to your contacts keeps future emails out of spam.', { size: 15 })}
    ${button(portfolioUrl, 'See the latest work')}
  `;

  return layout({
    title: "You're subscribed",
    preheader: "You'll hear from me when there's a new post or project.",
    label: 'Subscribed',
    siteUrl: portfolioUrl,
    body,
    footerNote: `Changed your mind? ${link(unsubscribeUrl, 'Unsubscribe', C.muted)} in one click.`
  });
};

module.exports = getSubscriberWelcomeEmailHTML;
