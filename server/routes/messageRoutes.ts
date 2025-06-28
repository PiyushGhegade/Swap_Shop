import express from "express";
import {
  sendMessage,
  getMessagesByConversation,
  markMessagesAsRead,
  getUnreadCount,
} from "../controllers/messageController";
import protect from "../middleware/protect";

const router = express.Router();

// ✅ Correct order: static routes first
router.get("/unread", protect, getUnreadCount); // move this BEFORE
router.post("/", protect, sendMessage);
router.patch("/mark-read/:conversationId", protect, markMessagesAsRead);
router.get("/:conversationId", protect, getMessagesByConversation); // dynamic route last

export default router;
