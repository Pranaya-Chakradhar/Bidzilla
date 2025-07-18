import express from "express";
import Listing from "../models/Listing.js";
import Bid from "../models/Bid.js"; // ✅ import Bid model
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all listings (public)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().populate("seller", "name");
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get listings created by the logged-in seller
router.get("/mine", authMiddleware(["seller"]), async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user.id });
    res.json(listings);
  } catch (err) {
    console.error("Error fetching seller listings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single listing by ID (must come AFTER /mine)
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "name");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error("Error fetching single listing:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new listing (only sellers)
router.post("/", authMiddleware(["seller"]), async (req, res) => {
  try {
    const { title, description, category, startingBid, image } = req.body;

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can create listings." });
    }

    const newListing = new Listing({
      title,
      description,
      category,
      startingBid,
      currentBid: startingBid,
      image,
      seller: req.user.id,
    });

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(400).json({ message: "Error creating listing" });
  }
});

// Update a listing (only the seller who created it)
router.put("/:id", authMiddleware(["seller"]), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this listing" });
    }

    listing.title = req.body.title || listing.title;
    listing.description = req.body.description || listing.description;
    listing.category = req.body.category || listing.category;
    listing.startingBid = req.body.startingBid || listing.startingBid;
    listing.image = req.body.image || listing.image;

    await listing.save();
    res.json({ message: "Listing updated successfully", listing });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error while updating listing" });
  }
});

// Delete a listing (only the seller who created it)
router.delete("/:id", authMiddleware(["seller"]), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error while deleting listing" });
  }
});

// ✅ Place a bid on a listing (only bidders)
router.put("/bid/:id", authMiddleware(["bidder"]), async (req, res) => {
  try {
    const listingId = req.params.id;
    const { bidAmount } = req.body;
    const userId = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Check if auction time has ended
    if (listing.endTime && new Date(listing.endTime) < new Date()) {
      return res.status(400).json({ message: "Bidding time is over" });
    }

    const minBid = (listing.currentBid || listing.startingBid) + 10;
    if (!bidAmount || bidAmount < minBid) {
      return res.status(400).json({ message: `Minimum next bid is Rs. ${minBid}` });
    }

    listing.currentBid = bidAmount;
    listing.currentWinner = userId;
    await listing.save();

    const bid = new Bid({
      product: listingId,
      bidder: userId,
      amount: bidAmount,
    });

    console.log("Saving bid:", bid); // ✅ Log before saving

    const savedBid = await bid.save();

    console.log("Bid saved successfully:", savedBid); // ✅ Log after saving

    res.json({ message: "Bid placed successfully", bid: savedBid });
  } catch (err) {
    console.error("Bid placement error:", err);
    res.status(500).json({ message: "Server error while placing bid" });
  }
});

export default router;
