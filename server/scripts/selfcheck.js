// Smallest thing that fails if the shared helpers break.
// Run: npm run selfcheck   (no DB, no network, no framework)
const assert = require('assert');
const parseArrayField = require('../utils/parseArrayField');
const escapeHtml = require('../utils/escapeHtml');

// --- parseArrayField: every branch the admin forms actually hit ---
assert.deepStrictEqual(parseArrayField(['a', 'b']), ['a', 'b'], 'array passes through');
assert.deepStrictEqual(parseArrayField('["a","b"]'), ['a', 'b'], 'JSON array (multipart path)');
assert.deepStrictEqual(parseArrayField('a, b ,'), ['a', 'b'], 'comma split, trimmed, no blanks');
assert.deepStrictEqual(parseArrayField('"unclosed'), ['"unclosed'], 'bad JSON falls back to split');
assert.deepStrictEqual(parseArrayField('{"a":1}'), ['{"a":1}'], 'JSON object is not an array');
assert.deepStrictEqual(parseArrayField(''), [], 'empty string');
assert.deepStrictEqual(parseArrayField(undefined), [], 'missing field');

// --- escapeHtml: the guard between user input and our email HTML ---
assert.strictEqual(escapeHtml('<script>&"\'') , '&lt;script&gt;&amp;&quot;&#39;');
assert.strictEqual(escapeHtml(null), '', 'null renders empty, not "null"');

// --- templates: every email renders a complete, inbox-safe document ---
const cases = [
  ['autoReplyEmail', ['Ada', 'hi']],
  ['subscriberWelcomeEmail', [{ email: 'a@b.co' }, 'https://u', 'https://p']],
  ['contentBlastEmail', ['blog', { title: 'T', excerpt: 'E', tags: ['x'], externalUrl: 'https://post' }, 'https://u', 'https://p']],
  ['contentBlastEmail', ['project', { title: 'T', description: 'D', technologies: ['React'] }, 'https://u', 'https://p']],
  ['notificationEmail', ['Ada', 'a@b.co', 'S', 'm']],
  ['subscriberNotificationEmail', [{ email: 'a@b.co' }, 3, 'https://d', 'now']]
];
for (const [name, args] of cases) {
  const html = require(`../templates/${name}`)(...args);
  assert.ok(/^<!DOCTYPE html>/.test(html) && /<\/html>$/.test(html), `${name}: incomplete document`);
  assert.ok(html.includes('sahil.gupta'), `${name}: shared header missing`);
  // Gmail injects its own `a { color }`, which beats class rules: every link
  // needs an inline colour or it renders as default blue.
  for (const tag of html.match(/<a[^>]*>/g) || []) {
    assert.ok(/style="[^"]*color:/.test(tag), `${name}: link needs an inline color -> ${tag}`);
  }
}
// The unsubscribe link must reach every subscriber-facing email.
assert.ok(require('../templates/contentBlastEmail')('blog', { title: 'T' }, 'https://unsub/x', 'https://p').includes('https://unsub/x'));
assert.ok(require('../templates/subscriberWelcomeEmail')({}, 'https://unsub/y', 'https://p').includes('https://unsub/y'));
// The blast CTA points at the post itself.
assert.ok(require('../templates/contentBlastEmail')('blog', { title: 'T', externalUrl: 'https://post' }, 'u', 'p').includes('href="https://post"'));

// --- Experience employmentType: only the two tabs are ever stored ---
const Experience = require('../models/Experience');
const expType = (v) => new Experience({ role: 'r', company: 'c', period: 'p', employmentType: v }).employmentType;
assert.strictEqual(expType('Full-time'), 'Full-time');
assert.strictEqual(expType('Internship'), 'Internship');
assert.strictEqual(expType(undefined), 'Internship', 'legacy docs default into the Internship tab');

// --- Hashnode RSS parser: the fields the blog cards actually render ---
const { parseRss } = require('../utils/hashnodeFeed');
const feed = `<rss><channel>
<item>
  <title><![CDATA[Hello World]]></title>
  <link>https://blog.example.com/hello</link>
  <description><![CDATA[Short excerpt.]]></description>
  <pubDate>Mon, 05 May 2025 10:00:00 GMT</pubDate>
  <category><![CDATA[react]]></category>
  <category><![CDATA[node]]></category>
  <enclosure url="https://cdn.example.com/cover.png" type="image/png"/>
  <content:encoded><![CDATA[<p>${'word '.repeat(400)}</p>]]></content:encoded>
</item>
</channel></rss>`;
const [post] = parseRss(feed);
assert.strictEqual(post.title, 'Hello World', 'CDATA title unwrapped');
assert.strictEqual(post.externalUrl, 'https://blog.example.com/hello');
assert.deepStrictEqual(post.tags, ['react', 'node'], 'every <category> becomes a tag');
assert.strictEqual(post.coverImage, 'https://cdn.example.com/cover.png', 'cover from enclosure url');
assert.strictEqual(post.readTime, '2 min read', '400 words at ~200wpm');
assert.strictEqual(post.createdAt.getUTCFullYear(), 2025, 'pubDate parsed');
assert.strictEqual(parseRss('<rss></rss>').length, 0, 'empty feed yields no posts');

// A 300-char description is truncated to fit the card.
const long = parseRss(`<rss><item><title>t</title><link>u</link><description>${'x'.repeat(300)}</description></item></rss>`)[0];
assert.strictEqual(long.excerpt.length, 280, 'excerpt capped at 280 chars');
assert.ok(long.excerpt.endsWith('...'), 'truncated excerpt is elided');

// Escaping actually reaches the rendered email.
assert.ok(
  require('../templates/notificationEmail')('<b>x</b>', 'a@b.co', 'S', 'm').includes('&lt;b&gt;x&lt;/b&gt;'),
  'notificationEmail must escape the submitted name'
);
const blastHtml = require('../templates/contentBlastEmail')('blog', { title: '<img onerror=x>', excerpt: '"><script>' }, 'u', 'p');
assert.ok(!blastHtml.includes('<img onerror') && !blastHtml.includes('<script>'), 'blast email must escape RSS/admin text');

// --- Subscriber email queue: only recent Hashnode posts are flagged ---
const { NOTIFY_WINDOW_MS } = require('../utils/hashnodeFeed');
assert.strictEqual(NOTIFY_WINDOW_MS, 7 * 24 * 60 * 60 * 1000, 'notify window is one week');
const Blog = require('../models/Blog');
assert.strictEqual(new Blog({ title: 't', excerpt: 'e', externalUrl: 'u' }).notifyPending, false,
  'existing/legacy posts are never queued by default');

console.log('selfcheck OK');
