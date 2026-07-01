const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// GET all listings with filters
router.get('/', async (req, res) => {
  try {
    const { wasteType, source, status, city, minQty, maxQty, urgency, search } = req.query;
    let query = {};

    if (wasteType) query.wasteType = wasteType;
    if (source) query.source = source;
    if (status) query.status = status;
    else query.status = 'available';
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (urgency) query.urgency = urgency;
    if (minQty || maxQty) {
      query.quantity = {};
      if (minQty) query.quantity.$gte = Number(minQty);
      if (maxQty) query.quantity.$lte = Number(maxQty);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const listings = await Listing.find(query)
      .populate('postedBy', 'name organization verified role location')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('postedBy', 'name organization verified role phone email location bio')
      .populate('claimedBy', 'name organization');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create listing (NGO only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ngo' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only NGOs can post waste listings' });
    }
    const listing = await Listing.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update listing
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await listing.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my listings
router.get('/user/mine', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
