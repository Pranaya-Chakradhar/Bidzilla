import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Helper to safely get user ID from token payload
function getUserId(user) {
  return user._id || user.id || user.userId || null;
}

// 1. Get all bids placed by the logged-in bidder (bid history) with debug logs
router.get("/my", authMiddleware(["bidder"]), async (req, res) => {
  try {
    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID in token" });
    }

    const bids = await Bid.find({ bidder: new mongoose.Types.ObjectId(userId) })
      .populate("product", "title image currentBid endTime")
      .sort({ createdAt: -1 });

    // Debug log to check currentBid is populated
    console.log("Bids with currentBid info:");
    bids.forEach(bid => {
      console.log(`Your bid: ${bid.amount}, Current highest bid: ${bid.product ? bid.product.currentBid : "No product or no currentBid"}`);
    });

    res.json(bids);
  } catch (err) {
    console.error("Error fetching user bids:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Place a bid on a product (bidder only)
router.post("/", authMiddleware(["bidder"]), async (req, res) => {
  try {
    const { productId, amount } = req.body;
    console.log("Bid request received:", req.body);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (new Date() > new Date(product.endTime)) {
      return res.status(400).json({ error: "Bidding time is over" });
    }

    const minBid = (product.currentBid || product.startingPrice) + 10;
    if (amount < minBid) {
      return res.status(400).json({ error: `Bid must be at least Rs ${minBid}` });
    }

    const userId = getUserId(req.user);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID in token" });
    }

    const bid = new Bid({
      bidder: new mongoose.Types.ObjectId(userId),
      product: new mongoose.Types.ObjectId(productId),
      amount,
      time: new Date(),
    });

    console.log("Saving bid:", bid);
    const savedBid = await bid.save();
    console.log("Bid saved successfully:", savedBid);

    // Update the product currentBid and bids array
    product.currentBid = amount;
    product.bids.push(savedBid._id);
    await product.save();

    res.status(201).json({ message: "Bid placed successfully", bid: savedBid });
  } catch (err) {
    console.error("Error placing bid:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Get all bids for a specific product (any logged-in user)
router.get("/:productId", authMiddleware(), async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const bids = await Bid.find({ product: productId })
      .populate("bidder", "name email")
      .sort({ amount: -1 });

    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
