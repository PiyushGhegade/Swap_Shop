import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js"; // ✅ if using ES modules

dotenv.config();

const categories = [
  { name: "Textbooks" },
  { name: "Electronics" },
  { name: "Furniture" },
  { name: "Clothing" },
  { name: "Other" },
  { name: "Transportation" }, // ✅ new category
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: "swapshop", // ✅ your existing DB
    });

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`⚠️ Category already exists: ${cat.name}`);
      }
    }

    await mongoose.disconnect();
    console.log("🌱 Seeding completed successfully.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
};

seedCategories();
