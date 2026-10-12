// Admin alert: someone joined the subscriber list.
// `subscribedAtIST` is pre-formatted in IST by utils/notify.js.
const escapeHtml = require('../utils/escapeHtml');
const { C, F, link, eyebrow, button, fields, layout } = require('./emailShell');

const getSubscriberNotificationEmailHTML = (subscriber, totalCount, adminDashboardUrl, subscribedAtIST) => {
  const safeEmail = escapeHtml(subscriber.email);

  const body = `
    ${eyebrow('New subscriber', C.olive)}
    <p class="em-h1" style="margin:0;font-family:${F.display};font-weight:800;font-size:72px;line-height:72px;letter-spacing:-3px;color:${C.ink};">${escapeHtml(totalCount)}</p>
    <p style="margin:6px 0 22px;font-family:${F.body};font-size:15px;line-height:22px;color:${C.ink2};">active subscribers on the list now</p>
    ${fields([
      ['Email', link(`mailto:${safeEmail}`, safeEmail)],
      ['Joined', `${escapeHtml(subscribedAtIST)} IST`],
      ['Source', escapeHtml(subscriber.source || 'site')]
    ])}
    ${button(adminDashboardUrl, 'Open the dashboard', 'ink')}
  `;

  return layout({
    title: 'New subscriber',
    preheader: `${safeEmail} subscribed. ${totalCount} active now.`,
    label: 'Subscribers',
    body,
    footerNote: 'Sent by your portfolio backend.'
  });
};

module.exports = getSubscriberNotificationEmailHTML;
