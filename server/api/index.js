const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// HTML Email Template for Admin Notification
const getNotificationEmailHTML = (name, email, subject, message) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #a8edea;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 15px;">📬</div>
              <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">New Contact Message!</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: 16px; margin: 0;">You've received a new message from your portfolio</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="font-size: 18px; color: #667eea; font-weight: 600; margin: 0 0 20px 0;">Hey Sahil! 👋</p>
              <p style="margin-bottom: 20px; color: #4b5563;">Great news! Someone wants to connect with you.</p>
              
              <!-- Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8f9ff; border-left: 4px solid #667eea; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin: 0 0 5px 0; letter-spacing: 0.5px;">From</p>
                    <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;"><strong>${name}</strong></p>
                    
                    <p style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin: 0 0 5px 0; letter-spacing: 0.5px;">Email</p>
                    <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">
                      <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${email}</a>
                    </p>
                    
                    <p style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin: 0 0 5px 0; letter-spacing: 0.5px;">Subject</p>
                    <p style="font-size: 16px; color: #333; margin: 0;">${subject}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              <p style="font-size: 12px; text-transform: uppercase; color: #667eea; font-weight: 600; margin: 25px 0 10px 0; letter-spacing: 0.5px;">Message</p>
              <div style="background: #fff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.8; color: #4b5563;">
                ${message}
              </div>
              
              <!-- Reply Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Reply to ${name} →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">This message was sent from your portfolio contact form</p>
              <p style="margin: 0;">
                <a href="https://github.com/Sahilgupta2175" style="color: #667eea; text-decoration: none; font-weight: 500;">GitHub</a>
                <span style="color: #6b7280; margin: 0 10px;">|</span>
                <a href="https://linkedin.com/in/sahilgupta2175" style="color: #667eea; text-decoration: none; font-weight: 500;">LinkedIn</a>
              </p>
              <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Sahil Gupta. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// HTML Email Template for Auto-Reply
const getAutoReplyEmailHTML = (name, message) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #667eea;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">👋</div>
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: 700;">Thanks for reaching out!</h1>
              <p style="color: rgba(255,255,255,0.95); font-size: 16px; margin: 0;">Your message has been received</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <p style="font-size: 24px; color: #667eea; font-weight: 700; margin: 0 0 20px 0;">Hi ${name}! ✨</p>
              
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 25px; line-height: 1.6;">
                Thank you so much for getting in touch! I really appreciate you taking the time to reach out. 
                I've received your message and will get back to you as soon as possible.
              </p>
              
              <!-- Message Preview -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%); border-left: 4px solid #f472b6; padding: 25px; margin: 30px 0; border-radius: 12px; font-style: italic; color: #4b5563; line-height: 1.8;">
                "${message}"
              </div>
              
              <!-- What's Next -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; margin: 30px 0;">
                <tr>
                  <td style="padding: 30px;">
                    <p style="color: #667eea; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">⏱️ What happens next?</p>
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 15px;">• I typically respond within 24-48 hours</p>
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 15px;">• I'll review your message carefully and get back to you via email</p>
                    <p style="color: #6b7280; margin: 0; font-size: 15px;">• Feel free to check out my work in the meantime!</p>
                  </td>
                </tr>
              </table>
              
              <!-- Social Links -->
              <div style="text-align: center; margin: 40px 0;">
                <p style="font-size: 16px; color: #667eea; font-weight: 600; margin-bottom: 20px;">🔗 Connect with me</p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="padding: 0 8px;">
                      <a href="https://github.com/Sahilgupta2175" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">⭐ GitHub</a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://linkedin.com/in/sahilgupta2175" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">💼 LinkedIn</a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://sahilgupta-sg.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">🌐 Portfolio</a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Tip Box -->
              <div style="background: linear-gradient(135deg, #fff5f7 0%, #f8f9ff 100%); padding: 25px; border-radius: 12px; text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">💡 In the meantime, check out my latest projects and contributions</p>
                <p style="color: #667eea; font-weight: 600; margin: 0;">Talk soon!</p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%); padding: 40px 30px; text-align: center; border-top: 3px solid #667eea;">
              <p style="font-size: 18px; color: #667eea; font-weight: 700; margin: 0 0 10px 0;">Best regards,<br/>Sahil Gupta</p>
              <p style="color: #6b7280; font-size: 14px; margin: 15px 0 0 0;">Full-Stack Developer | MERN Stack Specialist</p>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">This is an automated response. I'll personally reply to your message soon!</p>
              <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Sahil Gupta. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

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
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
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

      // Email to you (HTML)
      await transporter.sendMail({
        from: `"Sahil Gupta Portfolio" <${process.env.EMAIL_USER}>`,
        to: 'guptasahil2175@gmail.com',
        subject: `Portfolio Contact: ${subject}`,
        html: getNotificationEmailHTML(name, email, subject, message)
      });

      // Auto-reply (HTML)
      await transporter.sendMail({
        from: `"Sahil Gupta" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: getAutoReplyEmailHTML(name, message)
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
