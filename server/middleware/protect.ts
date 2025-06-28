import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/config";

// Extend Express Request for TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: { _id: string };
    }
  }
}

interface JwtPayload {
  userId: string;
}

// ✅ Reusable typed request for controllers
export type AuthenticatedRequest = Request & {
  user?: { _id: string };
};

const protect = (req: Request, res: Response, next: NextFunction) => {
  console.log("🛡️ [protect] Middleware activated");

  if (!req.cookies) {
    console.warn("⚠️ [protect] No cookies found on request");
  }

  const token = req.cookies?.token;

  if (!token) {
    console.warn("❌ [protect] No token provided in cookie");
    return res.status(401).json({ message: "Not authorized - token missing" });
  }

  console.log("🔑 [protect] Token received:", token.slice(0, 10) + "...");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      console.error("❌ [protect] Invalid JWT payload:", decoded);
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { _id: decoded.userId };

    console.log("✅ [protect] Token decoded successfully:", decoded);
    console.log("👤 [protect] Attached user to req.user:", req.user);

    next();
  } catch (err) {
    console.error("❌ [protect] Error verifying token:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
