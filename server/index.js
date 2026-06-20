// ---------------------------------------------------------------------------
// Single Express entry point for the portfolio backend.
//
// This one file is used in BOTH environments:
//   • Local:   `npm start` (nodemon index.js) -> it listens on PORT.
//   • Vercel:  @vercel/node imports it         -> it just exports the app.
// The require.main check at the bottom is what switches between the two.
//
// There used to be a second, diverging copy at api/index.js. Keeping two
// hand-maintained entry points is what let a bad merge ship broken code, so
// every endpoint now lives in exactly one place: the route modules below.
// ---------------------------------------------------------------------------

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server/.env BEFORE requiring modules that read process.env at
// load time (e.g. middleware/upload.js, utils/notify.js). On Vercel there is
// no .env file — vars come from the dashboard — so this is a harmless no-op.
dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const experienceRoutes = require('./routes/experience');
const currentWorkRoutes = require('./routes/currentWork');
const subscriberRoutes = require('./routes/subscribers');

const app = express();

// ---------------------------------------------------------------------------
// CORS — local dev, both deployed frontends, and any FRONTEND_URL override.
// ---------------------------------------------------------------------------
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sahilgupta-sg.vercel.app',
    'https://sahilgupta.tech',
    'https://www.sahilgupta.tech',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// ---------------------------------------------------------------------------
// MongoDB — serverless-friendly. Connect lazily and cache the connection
// across invocations (Vercel reuses the module between requests, so we must
// not open a fresh socket every time).
// ---------------------------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4
  });
  isConnected = true;
  console.log('✅ MongoDB Connected Successfully');
};

// Warm the connection on cold start. Errors are logged, not thrown, so the
// function still boots and /api/health can report the DB state.
connectDB().catch((err) => console.error('❌ Initial MongoDB connection failed:', err.message));

// ---------------------------------------------------------------------------
// Health + root — defined BEFORE the DB gate so they always respond, even
// when Mongo is unreachable (handy for "is it up?" checks).
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Server is running!',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    endpoints: { health: '/api/health', contact: '/api/contact' }
  });
});

// ---------------------------------------------------------------------------
// Ensure a DB connection before any data route runs. /api/auth/login is
// env-var driven and never touches Mongo, so it skips the wait to stay snappy.
// ---------------------------------------------------------------------------
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api/auth')) return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/current-work', currentWorkRoutes);
app.use('/api/subscribers', subscriberRoutes);

// ---------------------------------------------------------------------------
// Fallback error handler — always returns JSON (never an HTML stack trace) and
// keeps the serverless function from crashing on an unhandled route error.
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ success: false, message: 'Server error' });
});

// ---------------------------------------------------------------------------
// Local server vs. serverless export (see file header).
// ---------------------------------------------------------------------------
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
