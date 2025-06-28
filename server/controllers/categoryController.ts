import { Request, Response } from "express";
import Category from "../models/Category";

// ✅ POST /api/categories - Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    console.log("📥 [POST] /api/categories called with:", req.body);

    // Check if name is provided
    if (!name) {
      console.warn("⚠️ No category name provided");
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      console.warn("⚠️ Category already exists:", name);
      return res.status(409).json({ message: "Category already exists" });
    }

    // Create new category
    const category = await Category.create({ name });
    console.log("✅ Category created:", category);

    return res.status(201).json(category);
  } catch (err) {
    console.error("❌ Error in createCategory:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/categories - Fetch all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    console.log("📥 [GET] /api/categories request received");

    const categories = await Category.find().sort("name");
    console.log(`✅ ${categories.length} categories fetched from DB`);
    if (categories.length === 0) {
      console.warn("⚠️ No categories found in DB");
    }

    return res.status(200).json(categories);
  } catch (err) {
    console.error("❌ Error in getCategories:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};
