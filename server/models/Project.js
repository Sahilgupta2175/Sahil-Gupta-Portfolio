const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String
  },
  technologies: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    default: ''
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  emoji: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'design', 'other'],
    default: 'web'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
