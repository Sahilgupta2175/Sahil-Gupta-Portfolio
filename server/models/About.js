const mongoose = require('mongoose');

// Singleton: exactly one About document ever exists. The route upserts with an
// empty filter rather than tracking an id, so there's nothing to keep in sync.
// Icons for the highlights stay hardcoded in the React component (they're
// design, not content) — only the label/value text is editable here.
const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  paragraphs: [{ type: String }],
  highlights: [{
    _id: false,
    label: { type: String, default: '' },
    value: { type: String, default: '' }
  }],
  badgeNumber: {
    type: String,
    default: ''
  },
  badgeText: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.About || mongoose.model('About', aboutSchema);
