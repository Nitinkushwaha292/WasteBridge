const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['ngo', 'recycler', 'admin'],
    required: true
  },
  organization: { type: String, required: true },
  phone: { type: String },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  verified: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  totalImpact: {
    wasteCollected: { type: Number, default: 0 }, // in kg
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

module.exports = mongoose.model('User', userSchema);
