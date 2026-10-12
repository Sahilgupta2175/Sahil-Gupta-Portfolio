const mongoose = require('mongoose');

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  excerpt: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  coverImagePublicId: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: String,
    default: '5 min read'
  },
  externalUrl: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    default: true
  },
  // Subscriber email queue. A post is flagged when it's created (admin form or
  // Hashnode sync); utils/notify.sendPendingBlogBlasts() claims the flag and
  // stamps notifiedAt, so each post is emailed at most once per request to send.
  notifyPending: {
    type: Boolean,
    default: false
  },
  notifiedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

blogSchema.pre('validate', function (next) {
  // Generate the slug ONCE (on create / when missing). We deliberately do NOT
  // regenerate it when the title later changes, so already-shared /blogs/:slug
  // links and sitemap entries keep working.
  if (this.title && !this.slug) {
    this.slug = slugify(this.title) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
