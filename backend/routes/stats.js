const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');
const Claim = require('../models/Claim');

// GET platform-wide impact stats
router.get('/', async (req, res) => {
  try {
    const totalListings = await Listing.countDocuments();
    const completedListings = await Listing.find({ status: 'completed' });
    const availableListings = await Listing.countDocuments({ status: 'available' });
    const totalNGOs = await User.countDocuments({ role: 'ngo' });
    const totalRecyclers = await User.countDocuments({ role: 'recycler' });
    const totalClaims = await Claim.countDocuments({ status: 'accepted' });

    const totalWasteKg = completedListings.reduce((acc, l) => acc + l.quantity, 0);
    const co2Saved = totalWasteKg * 2.5; // ~2.5kg CO2 per kg plastic recycled

    const wasteByType = await Listing.aggregate([
      { $group: { _id: '$wasteType', total: { $sum: '$quantity' }, count: { $sum: 1 } } }
    ]);

    const wasteBySource = await Listing.aggregate([
      { $group: { _id: '$source', total: { $sum: '$quantity' }, count: { $sum: 1 } } }
    ]);

    const recentActivity = await Listing.find()
      .populate('postedBy', 'name organization')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title wasteType quantity location status createdAt');

    res.json({
      totalListings,
      availableListings,
      completedListings: completedListings.length,
      totalNGOs,
      totalRecyclers,
      totalClaims,
      totalWasteKg,
      co2Saved: Math.round(co2Saved),
      wasteByType,
      wasteBySource,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
