// server/utils/config.ts

import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "defaultfallbacksecret";
export const MONGO_URI = process.env.MONGO_URI || "";
export const PORT = process.env.PORT || 5000;
