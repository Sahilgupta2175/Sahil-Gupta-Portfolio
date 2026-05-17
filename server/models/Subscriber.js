const mongoose = require('mongoose');
const crypto = require('crypto');

// One person on the "Stay Updated" mailing list.
// We never hard-delete on unsubscribe — flipping `active` keeps history and
// prevents the same email from re-subscribing-then-unsubscribing repeatedly
// from looking like a fresh signup every time.
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  // Random opaque token included in every email's unsubscribe link.
  // Stored once at create time; clicking the link looks up the doc by token.
  unsubscribeToken: {
    type: String,
    required: true,
    index: true,
    default: () => crypto.randomBytes(24).toString('hex')
  },
  source: {
    type: String,
    default: 'footer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
});

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
