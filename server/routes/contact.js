const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimit');
const { sendOne } = require('../utils/notify');
const getNotificationEmailHTML = require('../templates/notificationEmail');
const getAutoReplyEmailHTML = require('../templates/autoReplyEmail');

// Submit contact form
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    // Validate + cap lengths before any DB/email work. The email templates
    // additionally HTML-escape these values before rendering.
    const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (!EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (String(name).length > 200 || String(subject).length > 200 || String(message).length > 5000) {
      return res.status(400).json({ success: false, message: 'One or more fields exceed the allowed length.' });
    }

    // Save to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    // Notification to me + auto-reply to the sender, in parallel over the
    // pooled transporter shared with the subscriber emails (utils/notify).
    await Promise.all([
      sendOne({
        from: `"Sahil Gupta Portfolio" <${process.env.EMAIL_USER}>`,
        to: 'guptasahil2175@gmail.com', // Your email where you want to receive messages
        subject: `Portfolio Contact: ${subject}`,
        html: getNotificationEmailHTML(name, email, subject, message)
      }),
      sendOne({
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: getAutoReplyEmailHTML(name, message)
      })
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// Get all contacts (admin only — exposes submitter PII).
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
