const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware - CORS must allow your frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sahilgupta-sg.vercel.app',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with retry logic
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    throw new Error('MongoDB URI is not configured');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
    throw error;
  }
};

// Connect to MongoDB on startup
connectDB().catch(err => console.error('Initial MongoDB connection failed:', err.message));

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// Health Check - Enhanced with system status
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'Server is running!',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
    }
  };
  
  res.status(200).json(healthCheck);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio Backend API',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact'
    }
  });
});

// Contact POST endpoint
app.post('/api/contact', async (req, res) => {
  try {
    await connectDB();
    
    const { name, email, subject, message } = req.body;

    // Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Email to you
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'guptasahil2175@gmail.com',
        subject: `Portfolio Contact: ${subject}`,
        text: `Hey Sahil,

You got a new message from your portfolio!

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Reply directly to ${email} to respond.`
      });

      // Auto-reply
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        text: `Hi ${name},

Thanks for getting in touch! I've received your message and will get back to you as soon as I can.

Here's what you sent:
"${message}"

In the meantime, feel free to check out my work:
- GitHub: https://github.com/Sahilgupta2175
- LinkedIn: https://linkedin.com/in/sahilgupta2175

Talk soon!

Best,
Sahil Gupta`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// Contact GET endpoint
app.get('/api/contact', async (req, res) => {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = app;
