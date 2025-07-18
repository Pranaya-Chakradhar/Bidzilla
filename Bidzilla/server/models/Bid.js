import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true } // <-- Important to enable createdAt/updatedAt fields
);

export default mongoose.model("Bid", bidSchema);
