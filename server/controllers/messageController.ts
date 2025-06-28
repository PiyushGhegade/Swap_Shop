import { Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/Message";
import Conversation from "../models/Conversation";
import type { AuthenticatedRequest } from "../middleware/protect"; // ✅ if not imported yet

// ✅ POST /api/messages
export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      console.error("❌ req.user is missing in sendMessage");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { conversationId, content } = req.body;
    const senderId = req.user._id;

    if (!conversationId || !content) {
      console.warn("⚠️ Missing conversationId or content in request");
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    console.log("📨 Creating message:", {
      conversationId,
      senderId,
      content,
    });

    const newMessage = await Message.create({
      conversation: conversationId,
      content,
      sender: senderId,
      readBy: [senderId], // Sender has read it
    });

    console.log("✅ Message created:", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ GET /api/messages/:conversationId
export const getMessagesByConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: "Invalid conversation ID" });
  }

  try {
    const messages = await Message.find({ conversation: conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ PATCH /api/messages/mark-read/:conversationId
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("❌ Error marking messages as read:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET /api/messages/unread
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) 
      {
        console.warn("❌ User not attached or missing ID in getUnreadCount");
        return res.status(401).json({ message: "Unauthorized - user missing" });
    }

    const userId = req.user._id;

    if (!userId || typeof userId !== "string" || userId.length !== 24) {
      console.error("❌ Invalid user ID format for unread count:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

console.log("📨 [getUnreadCount] Checking unread for userId:", userId);


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ [getUnreadCount] Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID" }); // ✅ Corrected error
    }

    const unreadMessages = await Message.aggregate([
      {
        $match: {
          sender: { $ne: new mongoose.Types.ObjectId(userId) },
          readBy: { $ne: new mongoose.Types.ObjectId(userId) },
        },
      },
      {
        $group: {
          _id: "$conversation",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUnread = unreadMessages.reduce((acc, conv) => acc + conv.count, 0);

    console.log("📬 [getUnreadCount] Total unread messages:", totalUnread);
    res.status(200).json({ count: totalUnread });
  } catch (err) {
    console.error("❌ [getUnreadCount] Error:", err);
    res.status(500).json({ message: "Failed to fetch unread count", error: err });
  }
};