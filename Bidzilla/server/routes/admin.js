import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Admin dashboard stats
router.get("/stats", authMiddleware(["admin"]), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const bidCount = await Bid.countDocuments();
    res.json({ userCount, productCount, bidCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get("/users", authMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products (admin only)
router.get("/products", authMiddleware(["admin"]), async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bids (admin only)
router.get("/bids", authMiddleware(["admin"]), async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate("bidder", "name email")
      .populate("product", "title currentPrice")
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete("/users/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin only)
router.delete("/products/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete bid (admin only)
router.delete("/bids/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Bid.findByIdAndDelete(req.params.id);
    res.json({ message: "Bid deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
