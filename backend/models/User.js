const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },

  // Main role
  role: {
    type: String,
    enum: ['collector', 'recycler', 'admin'],
    required: true
  },

  // Sub-type only for collectors
  collectorType: {
    type: String,
    enum: ['ngo', 'volunteer', 'individual', null],
    default: null
  },

  organization: { type: String, required: true },
  phone: { type: String },

  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },

  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailOTP: { type: String, default: null },
  emailOTPExpiry: { type: Date, default: null },

  // Admin verification (for NGOs)
  verified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationNote: { type: String, default: '' },

  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },

  totalImpact: {
    wasteCollected: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 }
  },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailOTP = otp;
  this.emailOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return otp;
};

module.exports = mongoose.model('User', userSchema);