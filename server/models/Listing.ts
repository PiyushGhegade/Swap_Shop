import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String], // base64 strings or URLs
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError during dev with hot-reload
const Listing =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;
