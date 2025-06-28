import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController";
import Category from "../models/Category";

const router = express.Router();

// ✅ POST /api/categories - Create category
router.post("/", (req, res, next) => {
  console.log("📥 Received request to create category with body:", req.body);
  return createCategory(req, res, next);
});

// ✅ GET /api/categories - Get all categories
router.get("/", async (req, res, next) => {
  console.log("🌐 GET /api/categories called");
  try {
    const response = await getCategories(req, res, next);
    console.log("✅ Categories successfully sent to client.");
    return response;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// ✅ TEMP: POST /api/categories/seed - Insert default categories
router.post("/seed", async (req, res) => {
  console.log("🚀 Seeding default categories...");
  try {
    const categories = [
      { name: "Textbooks" },
      { name: "Electronics" },
      { name: "Furniture" },
      { name: "Clothing" },
      { name: "Other" },
    ];

    const inserted = await Category.insertMany(categories, { ordered: false });
    console.log(`✅ ${inserted.length} categories inserted.`);
    return res.status(201).json({ message: "Categories seeded successfully", inserted });
  } catch (err: any) {
    console.error("⚠️ Seeding categories failed (some may already exist):", err.message);
    return res.status(500).json({ message: "Seeding error", error: err.message });
  }
});

// ✅ SEED route: GET /api/categories/seed - Insert 5 default categories
router.get("/seed", async (req, res) => {
  console.log("🌱 [GET] /api/categories/seed called");

  const defaultCategories = [
    { name: "Textbooks" },
    { name: "Electronics" },
    { name: "Furniture" },
    { name: "Clothing" },
    { name: "Other" },
  ];

  try {
    const inserted = await Category.insertMany(defaultCategories, { ordered: false });
    console.log(`✅ ${inserted.length} categories seeded`);
    return res.status(201).json({
      message: "Categories seeded successfully",
      inserted,
    });
  } catch (error: any) {
    console.error("❌ Seeding error:", error.message);
    return res.status(500).json({
      message: "Seeding error",
      error: error.message,
    });
  }
});


export default router;
