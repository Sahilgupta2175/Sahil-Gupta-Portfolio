// Fetches all posts from a Hashnode publication's RSS feed and seeds them
// into MongoDB as Blog documents pointing back to the originals.
//
// Run with: node scripts/seedBlogs.js
//
// Idempotent — blogs are matched by externalUrl, so re-running this after
// publishing a new post just adds the new ones (and updates anything that
// changed on Hashnode).

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Same corporate-network escape hatch as server/index.js. The script makes
// an outbound HTTPS call to Hashnode, so on a proxy that intercepts TLS
// we'd otherwise fail with "unable to get local issuer certificate".
// Opt-in via INSECURE_TLS=true in server/.env. NEVER set in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if (process.env.INSECURE_TLS === 'true') {
  console.warn('⚠️  INSECURE_TLS=true — outbound TLS verification disabled.');
}

const https = require('https');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const FEED_URL = process.argv[2] || 'https://sahil-blog.hashnode.dev/rss.xml';

// ---------- tiny RSS parser ----------
// Just enough regex to read the fields Hashnode emits. No external deps.
const get = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      // Follow one redirect hop if needed
      return get(res.headers.location).then(resolve, reject);
    }
    if (res.statusCode !== 200) {
      return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
    }
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  }).on('error', reject);
});

const stripCdata = (s) => (s || '').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();

const matchOne = (item, tag) => {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? stripCdata(m[1]) : '';
};

const matchAll = (item, tag) => {
  const out = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
  let m;
  while ((m = re.exec(item)) !== null) out.push(stripCdata(m[1]));
  return out;
};

const matchAttr = (item, tag, attr) => {
  const m = item.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`));
  return m ? m[1] : '';
};

const parseRss = (xml) => {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) items.push(m[1]);

  return items.map((item) => {
    const title = matchOne(item, 'title');
    const link = matchOne(item, 'link');
    const description = matchOne(item, 'description');
    const pubDate = matchOne(item, 'pubDate');
    const categories = matchAll(item, 'category');
    const cover = matchAttr(item, 'enclosure', 'url');
    const content = matchOne(item, 'content:encoded');

    // Estimate read time from the rendered HTML content (~200 wpm).
    const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plain ? plain.split(' ').length : 0;
    const minutes = Math.max(1, Math.round(words / 200));

    return {
      title,
      externalUrl: link,
      excerpt: description.length > 280 ? description.slice(0, 277) + '...' : description,
      tags: categories,
      coverImage: cover,
      readTime: `${minutes} min read`,
      published: true,
      createdAt: pubDate ? new Date(pubDate) : new Date()
    };
  });
};

// ---------- main ----------
const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI missing in server/.env');
    process.exit(1);
  }

  console.log('📡 Fetching RSS from', FEED_URL);
  const xml = await get(FEED_URL);
  const posts = parseRss(xml);
  console.log(`   Found ${posts.length} post(s)\n`);

  if (posts.length === 0) {
    console.log('Nothing to seed.');
    process.exit(0);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  let created = 0;
  let updated = 0;
  for (const p of posts) {
    if (!p.title || !p.externalUrl) {
      console.warn('   ⚠ skipping post with missing title/url:', p);
      continue;
    }
    const existing = await Blog.findOne({ externalUrl: p.externalUrl });
    if (existing) {
      // Update fields that may have changed on Hashnode; keep our slug stable.
      existing.title = p.title;
      existing.excerpt = p.excerpt;
      existing.tags = p.tags;
      existing.coverImage = p.coverImage;
      existing.coverImagePublicId = ''; // not in our Cloudinary
      existing.readTime = p.readTime;
      existing.published = true;
      await existing.save();
      updated++;
      console.log(`   ↻ updated: ${p.title}`);
    } else {
      // pre-validate hook in Blog model auto-generates the slug from title.
      await Blog.create(p);
      created++;
      console.log(`   + created: ${p.title}`);
    }
  }

  console.log(`\n✨ Done. ${created} created, ${updated} updated. Total in DB:`,
    await Blog.countDocuments());

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err.message || err);
  process.exit(1);
});
