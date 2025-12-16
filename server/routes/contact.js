const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// Create email transporter
const createTransporter = () => {
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    // Send email notification to you
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'guptasahil2175@gmail.com', // Your email where you want to receive messages
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
    };

    // Send auto-reply to the person who contacted
    const autoReplyOptions = {
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
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

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

// Get all contacts (for admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
