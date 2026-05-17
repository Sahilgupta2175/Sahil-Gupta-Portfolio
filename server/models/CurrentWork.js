const mongoose = require('mongoose');

// A small "currently working on" entry shown near the top of the homepage.
// Multiple entries are allowed so you can list parallel efforts (e.g. shipping
// a new product + learning a new framework). Hide rather than delete via
// `active: false` if you want to keep the history but not show it.
const currentWorkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '🚀'
  },
  // Short label shown as a colored badge. Free-form so you can add new ones
  // without code changes, but keep it short (one or two words).
  status: {
    type: String,
    default: 'Building',
    trim: true
  },
  link: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.CurrentWork || mongoose.model('CurrentWork', currentWorkSchema);
