const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const all = await Blog.find({}, 'title published externalUrl').lean();
  all.forEach((b) => console.log(' -', b.published ? '✓' : '✗ DRAFT', '|', b.title, '|', b.externalUrl || '(no url)'));
  console.log('Total:', all.length);
  await mongoose.disconnect();
})();
