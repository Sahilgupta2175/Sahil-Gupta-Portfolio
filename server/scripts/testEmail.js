// End-to-end email test with dummy content, sent to your own inbox.
//
// Run:  npm run test-email                      -> sends to EMAIL_USER
//       npm run test-email -- a@x.com b@y.com   -> those addresses act as subscribers
//
// Every email goes through the live code (utils/notify + templates) and the real
// Gmail account in server/.env. The database is NOT touched: the subscribers and
// the dummy post/project live in memory, so real subscribers never get test mail.
// Unsubscribe links point at the real backend with throwaway tokens, so clicking
// one just shows "We couldn't find your subscription".

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog');
const { sendWelcomeAndNotify, sendPendingBlogBlasts, blastNewContent } = require('../utils/notify');

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;
const recipients = process.argv.slice(2).length ? process.argv.slice(2) : [process.env.EMAIL_USER];

// In-memory stand-ins for the two queries notify.js makes.
const subscribers = recipients.map((email) => new Subscriber({ email, source: 'test-email' }));
Subscriber.find = async () => subscribers;
Subscriber.countDocuments = async () => subscribers.length;

const post = new Blog({
  title: '[TEST] Building a rate limiter in Express from scratch',
  excerpt: 'Why does your login route need a speed bump? A dummy post to check the subscriber email: what a rate limiter is, where it sits in the middleware chain, and how to build one in about 30 lines.',
  tags: ['Node.js', 'Express', 'Security', 'Middleware'],
  readTime: '6 min read',
  externalUrl: 'https://sahilxdev.hashnode.dev',
  coverImage: 'https://cdn.hashnode.com/uploads/covers/69413d2ffd5a397514bc42f5/28983e85-c165-4e2d-a959-d25a43e2dc19.png',
  published: true,
  notifyPending: true
});
// Same claim-once behaviour as the real findOneAndUpdate.
Blog.findOneAndUpdate = async () => {
  if (!post.notifyPending) return null;
  post.notifyPending = false;
  post.notifiedAt = new Date();
  return post;
};

const project = {
  title: '[TEST] Splitwise-style expense splitter',
  description: 'A dummy project to check the subscriber email: groups, shared expenses, live balances over Socket.IO and one-tap settle-up via Razorpay.',
  technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Razorpay'],
  liveUrl: 'https://sahilgupta-sg.vercel.app',
  githubUrl: 'https://github.com/Sahilgupta2175'
};

const run = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER / EMAIL_PASS missing in server/.env');
  }
  const bad = recipients.filter((e) => !EMAIL_RE.test(e || ''));
  if (bad.length) throw new Error(`Not an email address: ${bad.join(', ')}`);

  console.log(`\n1) Welcome email (+ admin "new subscriber" alert) to ${recipients.length} address(es)`);
  for (const sub of subscribers) await sendWelcomeAndNotify(sub);

  console.log('\n2) New blog post, through the same queue the live site uses');
  const [blog] = await sendPendingBlogBlasts();
  if (!blog) throw new Error('The dummy post was not sent (no transporter?)');
  console.log(`   sent ${blog.ok}/${blog.total}${blog.failed ? `, ${blog.failed} failed` : ''}`);
  const again = await sendPendingBlogBlasts();
  console.log(`   second run sent ${again.length} post(s) (expected 0: no duplicates)`);

  console.log('\n3) New project');
  const proj = await blastNewContent('project', project);
  console.log(`   sent ${proj.ok}/${proj.total}${proj.failed ? `, ${proj.failed} failed` : ''}`);

  console.log('\nDone. Check the inbox (and spam) of each address for 3 emails; the admin inbox also gets the alert.');
};

// Exit explicitly: the pooled SMTP transporter would otherwise keep the process alive.
run().then(() => process.exit(0)).catch((err) => {
  console.error('❌ Test email failed:', err.message || err);
  process.exit(1);
});
