import { Request, Response } from "express";
import User from "../models/User";

import Listing from "../models/Listing";
import Conversation from "../models/Conversation";
import Message from "../models/Message";


// 🔍 Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    console.log(`👥 All users fetched (${users.length})`);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 👤 Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      console.warn(`⚠️ User with ID ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`✅ User fetched by ID: ${id}`);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ✏️ Update a user by ID
// ✏️ Update a user by ID (safe fields only)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("🛠️ [updateUser] PATCH request for user ID:", id);
  console.log("📨 [updateUser] Incoming body:", req.body);

  const allowedFields = ["displayName", "avatar", "phone", "hostel", "roomNumber"];
  const updates: Record<string, any> = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      console.warn(`⚠️ Cannot update user; ID ${id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✏️ User updated: ${id}`);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};






export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all listings by user
    await Listing.deleteMany({ seller: id });

    // Delete conversations involving the user
    await Conversation.deleteMany({
      $or: [{ buyer: id }, { seller: id }],
    });

    // Delete messages sent by user
    await Message.deleteMany({ sender: id });

    console.log(`🗑️ Deleted user, listings, messages & conversations for: ${id}`);
    res.status(200).json({ message: "Account and all related data deleted" });
  } catch (error) {
    console.error("❌ Error deleting user account:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};