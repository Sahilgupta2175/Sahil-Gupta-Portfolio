// Force an immediate Hashnode -> MongoDB sync and print what changed.
//
// Run with: npm run sync-blogs   (or: node scripts/seedBlogs.js [feedUrl])
//
// The site no longer depends on this: GET /api/blogs syncs on its own (see
// utils/hashnodeFeed.js). This is just the manual, verbose, un-throttled
// version for when you want the new post live *right now*.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Corporate-network escape hatch for proxies that intercept TLS, which would
// otherwise fail with "unable to get local issuer certificate".
// Opt-in via INSECURE_TLS=true in server/.env. NEVER set in production.
if (process.env.INSECURE_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('⚠️  INSECURE_TLS=true — outbound TLS verification disabled.');
}

const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { syncBlogs, FEED_URL } = require('../utils/hashnodeFeed');

const feedUrl = process.argv[2] || FEED_URL;

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI missing in server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  console.log('📡 Fetching RSS from', feedUrl);

  const { created, updated, total } = await syncBlogs(feedUrl);
  console.log(`   Found ${total} post(s) in the feed`);
  console.log(`\n✨ Done. ${created} created, ${updated} updated. Total in DB:`,
    await Blog.countDocuments());

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Sync failed:', err.message || err);
  process.exit(1);
});
