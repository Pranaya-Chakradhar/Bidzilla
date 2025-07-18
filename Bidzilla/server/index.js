import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import productRoutes from "./routes/products.js";
import bidRoutes from "./routes/bids.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Register API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/listings", listingRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/bids", bidRoutes);
    app.use("/api/admin", adminRoutes);

    // Register root test route here
    app.get("/", (req, res) => {
      res.send("Welcome to Bidzilla API!");
    });

    // Register 404 handler last
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
