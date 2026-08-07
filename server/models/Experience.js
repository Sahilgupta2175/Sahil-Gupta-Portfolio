const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: ''
  },
  period: {
    type: String,
    required: true
  },
  // Drives the Internship / Full-time toggle on the public Experience section.
  // Existing docs predate this field, so the default backfills them as
  // Internship rather than leaving them out of both tabs.
  employmentType: {
    type: String,
    enum: ['Internship', 'Full-time'],
    default: 'Internship'
  },
  description: {
    type: String,
    default: ''
  },
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  logo: {
    type: String,
    default: ''
  },
  logoPublicId: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
