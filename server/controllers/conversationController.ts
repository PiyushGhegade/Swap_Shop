import { Request, Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import User from "../models/User";
import Listing from "../models/Listing";

// ✅ Create or fetch a conversation between two users (based on listing)
export const getOrCreateConversation = async (req: Request, res: Response) => {
  const { userId, listingId } = req.body;
  const currentUserId = req.user._id;

  try {
    if (!userId || !listingId) {
      return res.status(400).json({ message: "User ID and Listing ID are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
      listing: listingId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
        listing: listingId,
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("❌ Error in getOrCreateConversation:", error);
    res.status(500).json({ message: "Failed to create or fetch conversation" });
  }
};

// ✅ Get all conversations for the current logged-in user
export const getUserConversations = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "-password")
      .populate("listing");

    const enriched = await Promise.all(
      conversations.map(async (convo) => {
        const lastMessage = await Message.findOne({ conversation: convo._id })
          .sort({ createdAt: -1 });

        const otherUser = convo.participants.find(
          (p: any) => String(p._id) !== String(userId)
        );

        return {
          _id: convo._id,
          id: convo._id,
          participants: convo.participants,
          otherUser,
          listing: convo.listing,
          lastMessageAt: lastMessage?.createdAt || convo.updatedAt,
          latestMessagePreview: lastMessage?.content || "",
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

// ✅ Get a single conversation by its ID
export const getConversationById = async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("participants", "-password")
      .populate("listing");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    console.error("❌ Failed to get conversation by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
