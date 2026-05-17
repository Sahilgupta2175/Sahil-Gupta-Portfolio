const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env BEFORE requiring modules
// that read process.env at module load time (e.g. middleware/upload.js).
dotenv.config({ path: path.join(__dirname, '.env') });

const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const experienceRoutes = require('./routes/experience');
const currentWorkRoutes = require('./routes/currentWork');
const subscriberRoutes = require('./routes/subscribers');
const authRoutes = require('./routes/auth');

const app = express();

// CORS — allow local dev, deployed frontend, and any FRONTEND_URL override.
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sahilgupta-sg.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/current-work', currentWorkRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
