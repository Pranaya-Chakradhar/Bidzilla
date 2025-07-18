import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products created by the logged-in seller
router.get("/seller", authMiddleware(["seller"]), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (seller only)
router.post("/", authMiddleware(["seller"]), async (req, res) => {
  try {
    const { title, description, startingPrice, endTime, image } = req.body;
    const product = new Product({
      seller: req.user.id,
      title,
      description,
      startingPrice,
      currentBid: startingPrice,
      endTime,
      image,
      bids: [],
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (seller or admin only)
router.delete("/:id", authMiddleware(["seller", "admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    // Allow seller to delete only their products
    if (req.user.role === "seller" && product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this product" });
    }

    await product.remove();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
