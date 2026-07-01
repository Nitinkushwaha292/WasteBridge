const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  wasteType: {
    type: String,
    enum: ['plastic', 'metal', 'glass', 'paper', 'electronic', 'organic', 'textile', 'mixed'],
    required: true
  },
  source: {
    type: String,
    enum: ['river', 'ocean', 'landfill', 'household', 'industrial', 'other'],
    required: true
  },
  quantity: { type: Number, required: true }, // in kg
  pricePerKg: { type: Number, required: true }, // in INR
  totalPrice: { type: Number },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['available', 'claimed', 'in-progress', 'completed', 'cancelled'],
    default: 'available'
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  availableTill: { type: Date },
  tags: [String],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

listingSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.pricePerKg;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
