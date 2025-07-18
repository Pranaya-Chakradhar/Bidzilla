import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, enum: ["automobile", "electronics", "furniture"] },
  imageUrl: String,
  startingPrice: Number,
  currentBid: { type: Number, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  endTime: Date,
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

export default mongoose.model("Product", productSchema);
