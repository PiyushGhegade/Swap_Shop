const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config();

const categories = [
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Other",
  "Transportation" // ✅ Add your new category here
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "campusmarket",
    });

    for (const name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`✅ Created category: ${name}`);
      } else {
        console.log(`⚠️ Category already exists: ${name}`);
      }
    }

    await mongoose.disconnect();
    console.log("🌱 Done seeding categories.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
};

seedCategories();
