import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationById
} from "../controllers/conversationController";
import protect from "../middleware/protect";

const router = express.Router();

router.post("/", protect, getOrCreateConversation);
router.get("/", protect, getUserConversations);
router.get("/:id", protect, getConversationById);

export default router;
