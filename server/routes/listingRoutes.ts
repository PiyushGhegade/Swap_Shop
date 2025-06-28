import express from "express";
import {
  getAllListings,
  getListingById,
  getListingsByCategory,
  createListing,
  deleteListing,
  getListingsBySearch,
} from "../controllers/listingController";
import protect from "../middleware/protect";

const router = express.Router();

router.get("/search", getListingsBySearch);         
router.get("/category/:categoryId", getListingsByCategory);
router.get("/", getAllListings);
router.get("/:id", getListingById);

router.post("/", protect, createListing);
router.delete("/:id", protect, deleteListing);

export default router;
