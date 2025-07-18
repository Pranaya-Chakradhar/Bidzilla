import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  image: String,
  postedAt: { type: Date, default: Date.now },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Listing", listingSchema);
