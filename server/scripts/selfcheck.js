// Smallest thing that fails if the shared helpers break.
// Run: npm run selfcheck   (no DB, no network, no framework)
const assert = require('assert');
const parseArrayField = require('../utils/parseArrayField');
const { CARD_CSS, PANEL_CSS } = require('../templates/emailShell');
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

// --- templates: each still emits its shared CSS plus its own rules ---
const cases = [
  ['autoReplyEmail', ['Ada', 'hi'], CARD_CSS, '.message-preview'],
  ['subscriberWelcomeEmail', [{ email: 'a@b.co' }, 'https://u', 'https://p'], CARD_CSS, '.info-box'],
  ['contentBlastEmail', ['blog', { title: 'T', excerpt: 'E', tags: ['x'] }, 'https://u', 'https://p'], CARD_CSS, '.feature-card'],
  ['notificationEmail', ['Ada', 'a@b.co', 'S', 'm'], PANEL_CSS, '.message-box'],
  ['subscriberNotificationEmail', [{ email: 'a@b.co' }, 3, 'https://d', 'now'], PANEL_CSS, '.count-pill']
];
for (const [name, args, shared, ownRule] of cases) {
  const html = require(`../templates/${name}`)(...args);
  assert.ok(html.includes(shared.trim().split('\n')[0].trim()), `${name}: shared CSS missing`);
  assert.ok(html.includes('.email-container'), `${name}: shared container rule missing`);
  assert.ok(html.includes(ownRule), `${name}: own rule ${ownRule} missing`);
  assert.ok(/<\/html>/.test(html), `${name}: truncated output`);
}

// Escaping actually reaches the rendered email.
assert.ok(
  require('../templates/notificationEmail')('<b>x</b>', 'a@b.co', 'S', 'm').includes('&lt;b&gt;x&lt;/b&gt;'),
  'notificationEmail must escape the submitted name'
);

console.log('selfcheck OK');
