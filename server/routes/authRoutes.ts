import express from "express";
import { signup, login, getMe, logout } from "../controllers/authController";
import protect from "../middleware/protect";

import { verifyPassword } from "../controllers/authController";

const router = express.Router();

// ✅ Log each incoming auth route call
router.post("/signup", (req, res, next) => {
  console.log("📥 [POST] /api/auth/signup - Incoming signup request");
  next();
}, signup);

router.post("/login", (req, res, next) => {
  console.log("🔐 [POST] /api/auth/login - Incoming login request");
  next();
}, login);

router.post("/logout", (req, res, next) => {
  console.log("👋 [POST] /api/auth/logout - Logging out user");
  next();
}, logout);

router.get("/me", (req, res, next) => {
  console.log("📄 [GET] /api/auth/me - Checking current session");
  next();
}, protect, getMe);


router.post("/verify-password", protect, verifyPassword);

export default router;
