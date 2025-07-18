const express = require("express");
const router = express.Router();
const Bid = require("../models/Bid");
const Listing = require("../models/Listing");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/bids — Place a bid
router.post("/", verifyToken, async (req, res) => {
  try {
    const { listingId, amount } = req.body;

    if (!listingId || !amount) {
      return res.status(400).json({ message: "Listing ID and bid amount are required." });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Check if bid amount is higher than current price
    if (amount <= listing.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than current price." });
    }

    // Create new bid
    const bid = new Bid({
      listing: listingId,
      bidder: req.user.id,
      amount,
    });

    await bid.save();

    // Update listing current price and bidder
    listing.currentBid = amount;
    listing.highestBidder = req.user.id;
    await listing.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
