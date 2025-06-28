// server/seedCategories.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "CampusMarket",
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    await connectDB();

    const categories = [
      { name: "Books" },
      { name: "Electronics" },
      { name: "Clothing" },
      { name: "Furniture" },
      { name: "Bicycles" },
      { name: "Stationery" },
      { name: "Appliances" },
      { name: "Others" },
    ];

    // Remove existing ones
    await Category.deleteMany({});
    console.log("🗑️ Existing categories deleted");

    // Insert new
    await Category.insertMany(categories);
    console.log("✅ Categories seeded");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

seedCategories();
