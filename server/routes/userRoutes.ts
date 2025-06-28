import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import protect from "../middleware/protect";

const router = express.Router();

// All routes protected
router.get("/", protect, getAllUsers); // GET /api/users
router.get("/:id", protect, getUserById); // GET /api/users/:id
router.patch("/:id", protect, updateUser); // ✅ fix method mismatch

router.delete("/:id", protect, deleteUser); // DELETE /api/users/:id

export default router;
