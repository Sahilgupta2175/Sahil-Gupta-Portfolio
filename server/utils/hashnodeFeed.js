// Live Hashnode sync for the blog section.
//
// Previously this logic lived only in scripts/seedBlogs.js, so new posts only
// showed up on the site after someone ran that script by hand. GET /api/blogs
// now calls syncIfStale() first, which means publishing on Hashnode is enough.
//
// The seed script still exists and now just calls syncBlogs() directly for a
// forced, verbose run.

const https = require('https');
const Blog = require('../models/Blog');

const FEED_URL = process.env.HASHNODE_FEED_URL || 'https://sahilxdev.hashnode.dev/rss.xml';

// How long a sync is considered fresh. Serverless instances each keep their
// own timer, so the real-world refresh rate is "at most this often per warm
// instance" — good enough for a blog, and it keeps us off Hashnode's rate limit.
// ponytail: per-instance in-memory throttle; move the timestamp into Mongo if
// you ever need a single global refresh cadence.
const SYNC_TTL_MS = 5 * 60 * 1000;

// Outbound fetch with one redirect hop and a hard timeout, so a slow or hanging
// Hashnode can never wedge an API request.
const fetchFeed = (url, redirectsLeft = 1) => new Promise((resolve, reject) => {
  const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume();
      if (!redirectsLeft) return reject(new Error(`Too many redirects from ${url}`));
      return fetchFeed(res.headers.location, redirectsLeft - 1).then(resolve, reject);
    }
    if (res.statusCode !== 200) {
      res.resume();
      return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
    }
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
  req.setTimeout(8000, () => req.destroy(new Error(`Timed out fetching ${url}`)));
  req.on('error', reject);
});

// ---------- tiny RSS parser (just the fields Hashnode emits) ----------
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
    const description = matchOne(item, 'description');
    const pubDate = matchOne(item, 'pubDate');
    const content = matchOne(item, 'content:encoded');

    // Estimate read time from the rendered HTML content (~200 wpm).
    const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plain ? plain.split(' ').length : 0;
    const minutes = Math.max(1, Math.round(words / 200));

    return {
      title: matchOne(item, 'title'),
      externalUrl: matchOne(item, 'link'),
      excerpt: description.length > 280 ? description.slice(0, 277) + '...' : description,
      tags: matchAll(item, 'category'),
      coverImage: matchAttr(item, 'enclosure', 'url'),
      readTime: `${minutes} min read`,
      createdAt: pubDate ? new Date(pubDate) : new Date()
    };
  });
};

// Matches on externalUrl, so re-running only adds what's new.
// Deliberately does NOT touch `published` on posts we already have: if you
// unpublished one from the admin panel, a sync must not resurrect it.
const syncBlogs = async (feedUrl = FEED_URL) => {
  const posts = parseRss(await fetchFeed(feedUrl));
  let created = 0;
  let updated = 0;

  for (const p of posts) {
    if (!p.title || !p.externalUrl) continue;
    const existing = await Blog.findOne({ externalUrl: p.externalUrl });
    if (existing) {
      existing.title = p.title;
      existing.excerpt = p.excerpt;
      existing.tags = p.tags;
      existing.coverImage = p.coverImage;
      existing.coverImagePublicId = ''; // Hashnode's CDN, not our Cloudinary
      existing.readTime = p.readTime;
      await existing.save();
      updated++;
    } else {
      await Blog.create({ ...p, published: true });
      created++;
    }
  }
  return { created, updated, total: posts.length };
};

let lastSyncAt = 0;

// Stamped before awaiting so concurrent requests don't all fire a sync. A
// failed sync keeps the stamp too, so a Hashnode outage is retried at the
// normal cadence instead of on every single request.
const syncIfStale = async () => {
  if (Date.now() - lastSyncAt < SYNC_TTL_MS) return null;
  lastSyncAt = Date.now();
  return syncBlogs();
};

module.exports = { syncBlogs, syncIfStale, parseRss, FEED_URL, SYNC_TTL_MS };
