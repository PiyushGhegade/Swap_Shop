import { Request, Response } from "express";
import Listing from "../models/Listing";
import mongoose from "mongoose"; // ⬅️ Make sure this is at the top
// 🔍 Get all listings
// 🔍 Get all listings (or listings by user if ?userId is provided)
export const getAllListings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { seller: userId } : {};

    const listings = await Listing.find(filter).populate("seller", "-password");
    console.log(
      `📦 Listings fetched: ${listings.length} ${
        userId ? `(filtered by user ${userId})` : "(all listings)"
      }`
    );

    res.status(200).json(listings);
  } catch (error) {
    console.error("❌ Failed to fetch listings:", error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};


// 📦 Get a listing by ID
export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate("seller", "-password");
    if (!listing) {
      console.warn(`⚠️ Listing with ID ${id} not found`);
      return res.status(404).json({ message: "Listing not found" });
    }
    console.log(`✅ Listing fetched by ID: ${id}`);
    res.json(listing);
  } catch (err) {
    console.error("❌ Error fetching listing:", err);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
};

// 🗂️ Get listings by category
// 🗂️ Get listings by category


// 🗂️ Get listings by category
export const getListingsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  console.log("🧭 [getListingsByCategory] categoryId:", categoryId);

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    console.warn("❌ Invalid categoryId:", categoryId);
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const listings = await Listing.find({ category: categoryId }).populate("seller", "-password");
    console.log(`📁 Listings fetched for category ${categoryId}:`, listings.length);
    return res.status(200).json(listings);
  } catch (error) {
    console.error("❌ Failed to fetch listings by category:", error);
    return res.status(500).json({ message: "Failed to fetch listings by category" });
  }
};



// ✏️ Create a new listing
export const createListing = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, images, location } = req.body;

    if (!req.user) {
      console.warn("⛔ Unauthorized listing creation attempt: no user found in request");
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    const newListing = await Listing.create({
      title,
      description,
      price,
      category,
      seller: req.user._id,
      images,
      location,
    });

    console.log(`✅ Listing created: ${newListing._id} by user ${req.user._id}`);
    res.status(201).json(newListing);
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
};

// 🗑️ Delete a listing
export const deleteListing = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      console.warn(`⚠️ Listing not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      console.warn(`⛔ User ${req.user._id} tried to delete listing ${listing._id} not owned by them`);
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    await listing.deleteOne();
    console.log(`🗑️ Listing deleted: ${listing._id}`);
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getListingsBySearch = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  console.log("🔎 [getListingsBySearch] query param received:", query);

  if (!query) {
    console.warn("⚠️ No query parameter provided");
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const regex = new RegExp(query, "i");
    console.log("🔎 [getListingsBySearch] regex constructed:", regex);

    const listings = await Listing.find({ title: regex }).populate("seller", "-password");
    console.log(`✅ Listings found with query "${query}":`, listings.length);

    res.status(200).json(listings);
  } catch (error) {
    console.error("❌ Error searching listings:", error);
    res.status(500).json({ message: "Failed to search listings" });
  }
};
