import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Setup middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "6mb" })); // 6MB buffer for safety

app.use(cookieParser());

// Health check
app.get("/api/ping", (_req, res) => {
  res.send("pong 🏓");
});

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import listingRoutes from "./routes/listingRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP server for Express + Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("sendMessage", (message) => {
    const { receiver } = message;
    socket.to(receiver).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
