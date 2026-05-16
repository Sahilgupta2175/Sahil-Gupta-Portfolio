// One-off seed: inserts the original 5 portfolio projects directly into
// MongoDB and cleans up any test entries.
//
// Run with: node scripts/seedProjects.js
//
// Idempotent — projects are matched by title, so re-running won't create
// duplicates; it'll update existing rows.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Project = require('../models/Project');

const projects = [
  {
    title: 'Vehicle Rental Services Platform',
    description:
      'A comprehensive full-stack vehicle rental management system with multi-role authentication, real-time notifications, AI-powered chatbot, and integrated payment gateway for seamless rental operations.',
    longDescription:
      'Vehicle Rental Services is a secure, enterprise-grade web platform for managing end-to-end vehicle rental operations. It offers role-based dashboards for Users, Vendors, and Admins, enabling seamless vehicle booking with real-time availability, fleet and earnings management, and system-wide analytics. The platform includes JWT authentication with email verification, Razorpay payments, an AI-powered chatbot, real-time notifications, SMS and email alerts, and advanced booking management with reports and exports. Enhanced security, responsive design, automated processes, and comprehensive transaction and refund tracking ensure a reliable and scalable rental solution.',
    emoji: '🚗',
    image: '',
    imagePublicId: '',
    technologies: [
      'React 19.2.0', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'TailwindCSS', 'Vite',
      'Socket.IO', 'JWT', 'Razorpay', 'Google Gemini AI', 'Cloudinary', 'Twilio', 'SendGrid',
      'Nodemailer', 'React Router DOM', 'Zustand', 'React Hook Form', 'Axios', 'React Datepicker',
      'React Toastify', 'Bcrypt.js', 'Helmet', 'Express Validator', 'Multer', 'PDFKit',
      'CSV Writer', 'Node Cron', 'Morgan', 'Pino'
    ],
    category: 'web',
    liveUrl: 'https://vrs-frontend-sg.vercel.app',
    githubUrl: 'https://github.com/Sahilgupta2175/vehicle-rental-services',
    featured: true
  },
  {
    title: 'Zerodha - Stock Trading Platform',
    description:
      'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication.',
    longDescription:
      'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication. Features comprehensive dashboard for tracking holdings, positions, and market data with seamless buy/sell operations. Secure user authentication system with JWT tokens and cookie-based sessions.',
    emoji: '📈',
    image: '',
    imagePublicId: '',
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Axios'],
    category: 'web',
    liveUrl: 'https://zerodha-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Zerodha-project',
    featured: true
  },
  {
    title: 'Wanderlust - Property Rental Platform',
    description:
      'A full-stack property rental web application inspired by Airbnb with comprehensive property management and interactive maps.',
    longDescription:
      'A full-stack property rental web application inspired by Airbnb, built with Node.js and Express.js. Features comprehensive property management, real-time search functionality, interactive maps with Mapbox, secure user authentication with Passport.js, and cloud-based image storage with Cloudinary. Implements MVC architecture with MongoDB.',
    emoji: '🏠',
    image: '',
    imagePublicId: '',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Passport.js', 'Mapbox', 'Cloudinary'],
    category: 'web',
    liveUrl: 'https://wanderlust-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Wanderlust',
    featured: true
  },
  {
    title: 'InShare - File Sharing Application',
    description:
      'A secure file sharing web application that allows users to upload, share, and download files with temporary links.',
    longDescription:
      'A secure file sharing web application that allows users to upload, share, and download files with temporary links. Built with Node.js and Express, featuring real-time file management, UUID-based encrypted link generation with temporary storage, and files auto-delete after 24 hours or first download.',
    emoji: '📁',
    image: '',
    imagePublicId: '',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer', 'UUID', 'Crypto'],
    category: 'web',
    liveUrl: 'https://inshare-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/inshare-project',
    featured: true
  },
  {
    title: 'Netflix UI Clone',
    description:
      'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading using TMDB API.',
    longDescription:
      'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading. Features responsive design and smooth animations for an authentic user experience. Dynamic content loading using The Movie Database (TMDB) API with 95% visual accuracy.',
    emoji: '🎬',
    image: '',
    imagePublicId: '',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'TMDB API'],
    category: 'web',
    liveUrl: 'https://netflix-clone-ft.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Hunar-intern-project/tree/main/Netflix%20clone',
    featured: false
  }
];

// Anything I created while testing — wipe these by title so they don't linger.
const testTitlesToRemove = ['Test Project', 'Test With Image', 'TLS Fix Test', 'TLS Fix Test 2'];

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI missing in server/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // 1. Clean up test data
  const cleanup = await Project.deleteMany({ title: { $in: testTitlesToRemove } });
  if (cleanup.deletedCount) {
    console.log(`🧹 Removed ${cleanup.deletedCount} test project(s)`);
  }

  // 2. Upsert each project — match by title so re-runs update instead of duplicating
  let created = 0;
  let updated = 0;
  for (const p of projects) {
    const existing = await Project.findOne({ title: p.title });
    if (existing) {
      Object.assign(existing, p);
      await existing.save();
      updated++;
      console.log(`   ↻ updated: ${p.title}`);
    } else {
      await Project.create(p);
      created++;
      console.log(`   + created: ${p.title}`);
    }
  }

  console.log(`\n✨ Done. ${created} created, ${updated} updated. Total in DB:`,
    await Project.countDocuments());

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
