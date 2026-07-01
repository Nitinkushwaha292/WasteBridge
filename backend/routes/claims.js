const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Listing = require('../models/Listing');
const { protect } = require('../middleware/auth');

// POST claim a listing
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'recycler' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only recycling companies can claim listings' });
    }
    const { listingId, message, offeredPrice } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'available') {
      return res.status(400).json({ message: 'Listing is no longer available' });
    }

    const existing = await Claim.findOne({ listing: listingId, claimedBy: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already claimed this listing' });

    const claim = await Claim.create({
      listing: listingId,
      claimedBy: req.user._id,
      postedBy: listing.postedBy,
      message,
      offeredPrice
    });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET claims for my listings (NGO)
router.get('/received', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ postedBy: req.user._id })
      .populate('listing', 'title wasteType quantity location status')
      .populate('claimedBy', 'name organization email phone verified')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET claims I sent (Recycler)
router.get('/sent', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate('listing', 'title wasteType quantity location status pricePerKg totalPrice')
      .populate('postedBy', 'name organization email verified')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT accept/reject claim
router.put('/:id', protect, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    claim.status = req.body.status;
    await claim.save();

    if (req.body.status === 'accepted') {
      await Listing.findByIdAndUpdate(claim.listing, {
        status: 'claimed',
        claimedBy: claim.claimedBy
      });
    }

    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
