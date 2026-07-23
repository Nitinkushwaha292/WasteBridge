const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wastebridge_secret_2024', { expiresIn: '30d' });
};

// ── Send OTP via Brevo HTTP API (no SMTP needed) ──────
const sendOTPEmail = async (email, name, otp, collectorType) => {
  if (!process.env.BREVO_API_KEY) {
    console.log(`⚠️ BREVO_API_KEY not set. OTP for ${email}: ${otp}`);
    return;
  }

  const roleLabel = collectorType === 'ngo' ? 'NGO / Organization'
    : collectorType === 'volunteer' ? 'Volunteer / Group'
    : collectorType === 'individual' ? 'Individual Collector'
    : 'Recycling Company';

  const emailData = JSON.stringify({
    sender: { name: 'WasteBridge', email: process.env.EMAIL_USER || 'noreply@wastebridge.com' },
    to: [{ email, name }],
    subject: '🔐 Your WasteBridge OTP Code',
    htmlContent: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:32px 28px;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">♻️</div>
          <h1 style="color:#ffffff;font-size:1.4rem;margin:0;">WasteBridge</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:0.875rem;">Email Verification</p>
        </div>
        <div style="padding:32px 28px;">
          <p style="color:#374151;margin:0 0 8px;">Hi <strong>${name}</strong>,</p>
          <p style="color:#6b7280;font-size:0.9rem;margin:0 0 24px;">
            You registered as <strong style="color:#16a34a;">${roleLabel}</strong> on WasteBridge.
            Use the OTP below to verify your email address.
          </p>
          <div style="background:#f4faf6;border:2px dashed #16a34a;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
            <div style="color:#6b7280;font-size:0.8rem;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.1em;">Your OTP Code</div>
            <div style="font-size:3rem;font-weight:800;color:#16a34a;letter-spacing:0.3em;">${otp}</div>
            <div style="color:#9ca3af;font-size:0.75rem;margin-top:10px;">Valid for 10 minutes only</div>
          </div>
          <p style="color:#9ca3af;font-size:0.8rem;margin:0;">If you didn't register on WasteBridge, ignore this email.</p>
        </div>
        <div style="background:#f9fafb;padding:16px 28px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:0.75rem;margin:0;">© 2024 WasteBridge · Built for a greener tomorrow 🌱</p>
        </div>
      </div>
    `
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(emailData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`✅ OTP email sent to ${email}`);
          resolve();
        } else {
          console.error(`❌ Brevo API error: ${data}`);
          reject(new Error(`Brevo API error: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Email send failed:', err.message);
      reject(err);
    });

    req.write(emailData);
    req.end();
  });
};

// ── REGISTER ──────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, collectorType, organization, phone, location } = req.body;

    if (role === 'collector' && !collectorType) {
      return res.status(400).json({ message: 'Please select your collector type' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({
      name, email, password, role,
      collectorType: role === 'collector' ? collectorType : null,
      organization, phone, location,
      isEmailVerified: false
    });

    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(email, name, otp, collectorType);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collectorType: user.collectorType,
      organization: user.organization,
      isEmailVerified: user.isEmailVerified,
      verified: user.verified,
      token: generateToken(user._id),
      message: 'Registration successful! Please verify your email.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── VERIFY EMAIL OTP ──────────────────────────────────
router.post('/verify-email', protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.emailOTP) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }
    if (new Date() > user.emailOTPExpiry) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (user.emailOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    user.isEmailVerified = true;
    user.emailOTP = null;
    user.emailOTPExpiry = null;
    await user.save();

    res.json({ message: 'Email verified successfully!', isEmailVerified: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── RESEND OTP ────────────────────────────────────────
router.post('/resend-otp', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(user.email, user.name, otp, user.collectorType);
      res.json({ message: 'OTP sent successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to send OTP email' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collectorType: user.collectorType,
      organization: user.organization,
      verified: user.verified,
      isEmailVerified: user.isEmailVerified,
      location: user.location,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET ME ────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;