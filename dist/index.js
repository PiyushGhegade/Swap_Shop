// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var defaultCategories = [
  { name: "Textbooks", icon: "book-open" },
  { name: "Electronics", icon: "computer" },
  { name: "Furniture", icon: "sofa" },
  { name: "Clothing", icon: "t-shirt" },
  { name: "Transportation", icon: "bike" },
  { name: "Other", icon: "more-2" }
];
var MemStorage = class {
  users;
  categories;
  listings;
  messages;
  conversations;
  sessionStore;
  userIdCounter;
  categoryIdCounter;
  listingIdCounter;
  messageIdCounter;
  conversationIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.listings = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.conversations = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.listingIdCounter = 1;
    this.messageIdCounter = 1;
    this.conversationIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // 24 hours
    });
    this.initializeCategories();
  }
  initializeCategories() {
    defaultCategories.forEach((cat) => {
      this.createCategory({
        name: cat.name,
        icon: cat.icon
      });
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updatedFields) {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return void 0;
    }
    const updatedUser = {
      ...existingUser,
      ...updatedFields
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategory(id) {
    return this.categories.get(id);
  }
  async createCategory(category) {
    const id = this.categoryIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newCategory = {
      ...category,
      id,
      createdAt: now
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  // Listing methods
  async getListings() {
    return Array.from(this.listings.values());
  }
  async getListing(id) {
    return this.listings.get(id);
  }
  async getListingsByUser(userId) {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.userId === userId
    );
  }
  async getListingsByCategory(categoryId) {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.categoryId === categoryId
    );
  }
  async createListing(listing) {
    const id = this.listingIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newListing = {
      ...listing,
      id,
      status: "active",
      createdAt: now
    };
    this.listings.set(id, newListing);
    return newListing;
  }
  async updateListing(id, updatedFields) {
    const existingListing = this.listings.get(id);
    if (!existingListing) {
      return void 0;
    }
    const updatedListing = {
      ...existingListing,
      ...updatedFields
    };
    this.listings.set(id, updatedListing);
    return updatedListing;
  }
  async deleteListing(id) {
    return this.listings.delete(id);
  }
  async searchListings(query) {
    const searchTerms = query.toLowerCase().split(" ");
    return Array.from(this.listings.values()).filter((listing) => {
      const searchText = `${listing.title.toLowerCase()} ${listing.description.toLowerCase()}`;
      return searchTerms.some((term) => searchText.includes(term));
    });
  }
  // Message methods
  async getMessages(conversationId) {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return [];
    return Array.from(this.messages.values()).filter(
      (message) => message.senderId === conversation.user1Id && message.receiverId === conversation.user2Id || message.senderId === conversation.user2Id && message.receiverId === conversation.user1Id
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  async createMessage(message) {
    const id = this.messageIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newMessage = {
      ...message,
      id,
      read: false,
      createdAt: now
    };
    this.messages.set(id, newMessage);
    const conversation = await this.getConversationByUsers(
      message.senderId,
      message.receiverId,
      message.listingId
    );
    if (conversation) {
      await this.updateConversation(conversation.id, { lastMessageAt: now });
    } else {
      await this.createConversation({
        user1Id: message.senderId,
        user2Id: message.receiverId,
        listingId: message.listingId
      });
    }
    return newMessage;
  }
  async markMessagesAsRead(conversationId, userId) {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return false;
    let updated = false;
    for (const [id, message] of this.messages.entries()) {
      if (message.receiverId === userId && !message.read) {
        message.read = true;
        this.messages.set(id, message);
        updated = true;
      }
    }
    return updated;
  }
  async getUnreadMessageCount(userId) {
    return Array.from(this.messages.values()).filter(
      (message) => message.receiverId === userId && !message.read
    ).length;
  }
  // Conversation methods
  async getConversations(userId) {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.user1Id === userId || conversation.user2Id === userId
    ).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
  }
  async getConversation(id) {
    return this.conversations.get(id);
  }
  async getConversationByUsers(user1Id, user2Id, listingId) {
    return Array.from(this.conversations.values()).find(
      (conversation) => (conversation.user1Id === user1Id && conversation.user2Id === user2Id || conversation.user1Id === user2Id && conversation.user2Id === user1Id) && conversation.listingId === listingId
    );
  }
  async createConversation(conversation) {
    const id = this.conversationIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newConversation = {
      ...conversation,
      id,
      lastMessageAt: now,
      createdAt: now
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
  async updateConversation(id, updatedFields) {
    const existingConversation = this.conversations.get(id);
    if (!existingConversation) {
      return void 0;
    }
    const updatedConversation = {
      ...existingConversation,
      ...updatedFields
    };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "campus-marketplace-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3,
      // 30 days
      secure: process.env.NODE_ENV === "production"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUserByEmail = await storage.getUserByEmail(req.body.email);
      if (existingUserByEmail) {
        return res.status(400).send("Email already exists");
      }
      const existingUserByUsername = await storage.getUserByUsername(req.body.username);
      if (existingUserByUsername) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      const { password, ...userWithoutPassword } = user;
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send("Invalid email or password");
      }
      req.login(user, (err2) => {
        if (err2) {
          return next(err2);
        }
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  displayName: true,
  avatar: true,
  location: true
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true
});
var listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  images: text("images").array().notNull(),
  location: text("location"),
  status: text("status").notNull().default("active"),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertListingSchema = createInsertSchema(listings).pick({
  title: true,
  description: true,
  price: true,
  images: true,
  location: true,
  userId: true,
  categoryId: true
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  listingId: integer("listing_id").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  senderId: true,
  receiverId: true,
  listingId: true
});
var conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull(),
  user2Id: integer("user2_id").notNull(),
  listingId: integer("listing_id").notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertConversationSchema = createInsertSchema(conversations).pick({
  user1Id: true,
  user2Id: true,
  listingId: true
});

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  app2.get("/api/listings", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const search = req.query.search;
      let listings2;
      if (categoryId) {
        listings2 = await storage.getListingsByCategory(categoryId);
      } else if (userId) {
        listings2 = await storage.getListingsByUser(userId);
      } else if (search) {
        listings2 = await storage.searchListings(search);
      } else {
        listings2 = await storage.getListings();
      }
      res.json(listings2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });
  app2.get("/api/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getListing(id);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });
  app2.post("/api/listings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const userId = req.user.id;
      const listingData = { ...req.body, userId };
      const validatedData = insertListingSchema.parse(listingData);
      const listing = await storage.createListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create listing" });
    }
  });
  app2.patch("/api/listings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const existingListing = await storage.getListing(id);
      if (!existingListing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      if (existingListing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to update this listing" });
      }
      const updatedListing = await storage.updateListing(id, req.body);
      res.json(updatedListing);
    } catch (error) {
      res.status(500).json({ error: "Failed to update listing" });
    }
  });
  app2.delete("/api/listings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const existingListing = await storage.getListing(id);
      if (!existingListing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      if (existingListing.userId !== userId) {
        return res.status(403).json({ error: "Not authorized to delete this listing" });
      }
      await storage.deleteListing(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });
  app2.get("/api/conversations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const userId = req.user.id;
      const conversations2 = await storage.getConversations(userId);
      const enrichedConversations = await Promise.all(
        conversations2.map(async (conversation) => {
          const otherUserId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
          const otherUser = await storage.getUser(otherUserId);
          const listing = await storage.getListing(conversation.listingId);
          return {
            ...conversation,
            otherUser: otherUser ? {
              id: otherUser.id,
              username: otherUser.username,
              displayName: otherUser.displayName,
              avatar: otherUser.avatar
            } : null,
            listing: listing ? {
              id: listing.id,
              title: listing.title,
              price: listing.price
            } : null
          };
        })
      );
      res.json(enrichedConversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });
  app2.get("/api/conversations/:id/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.id;
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
        return res.status(403).json({ error: "Not authorized to view this conversation" });
      }
      const messages2 = await storage.getMessages(conversationId);
      await storage.markMessagesAsRead(conversationId, userId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const senderId = req.user.id;
      const messageData = { ...req.body, senderId };
      const validatedData = insertMessageSchema.parse(messageData);
      const listing = await storage.getListing(validatedData.listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      const receiver = await storage.getUser(validatedData.receiverId);
      if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
      }
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  app2.get("/api/messages/unread", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    try {
      const userId = req.user.id;
      const count = await storage.getUnreadMessageCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread message count" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
