import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_SECRET } from "../utils/config";

// Extend Express Request type for user property
interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

// Utility: Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Signup Controller
export const signup = async (req: Request, res: Response) => {
  try {
    const {
      name,
      username,
      email,
      rollno,
      password,
      avatar,
      displayName,
      phone,
      hostel,
      roomNumber,
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { rollno }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or roll number already in use" });
    }

    if (!email.endsWith("@iitp.ac.in")) {
      return res.status(400).json({ message: "Only IITP email addresses are allowed" });
    }

    const rollRegex = /^[0-9]{4}[A-Z]{2}[0-9]{2}$/;
    if (!rollRegex.test(rollno)) {
      return res.status(400).json({ message: "Invalid roll number format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      rollno,
      password: hashedPassword,
      avatar,
      displayName,
      phone,
      hostel,
      roomNumber,
    });

    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        rollno: newUser.rollno,
        avatar: newUser.avatar || "",
        displayName: newUser.displayName || "",
        phone: newUser.phone || "",
        hostel: newUser.hostel || "",
        roomNumber: newUser.roomNumber || "",
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ✅ Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          rollno: user.rollno,
          avatar: user.avatar || "",
          displayName: user.displayName || "",
          phone: user.phone || "",
          hostel: user.hostel || "",
          roomNumber: user.roomNumber || "",
          createdAt: user.createdAt,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Logout Controller
export const logout = async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Successfully logged out" });
};

// ✅ Get Current User Controller
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        rollno: user.rollno,
        avatar: user.avatar || "",
        displayName: user.displayName || "",
        phone: user.phone || "",
        hostel: user.hostel || "",
        roomNumber: user.roomNumber || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
export const verifyPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const userId = req.user?._id;

  if (!userId || !password) {
    return res.status(400).json({ message: "Missing user or password" });
  }

  const user = await User.findById(userId).select("+password");

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ message: "Incorrect password" });

  res.status(200).json({ message: "Password verified" });
};
