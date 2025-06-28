import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { insertListingSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by ID
  app.get("/api/categories/:id", async (req, res) => {
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

  // Get all listings
  app.get("/api/listings", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const search = req.query.search as string | undefined;
      
      let listings;
      
      if (categoryId) {
        listings = await storage.getListingsByCategory(categoryId);
      } else if (userId) {
        listings = await storage.getListingsByUser(userId);
      } else if (search) {
        listings = await storage.searchListings(search);
      } else {
        listings = await storage.getListings();
      }
      
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  // Get listing by ID
  app.get("/api/listings/:id", async (req, res) => {
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

  // Create a new listing
  app.post("/api/listings", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const userId = req.user.id;
      const listingData = { ...req.body, userId };
      
      // Validate listing data
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

  // Update a listing
  app.patch("/api/listings/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if listing exists and belongs to the user
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

  // Delete a listing
  app.delete("/api/listings/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if listing exists and belongs to the user
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

  // Get user's conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const userId = req.user.id;
      const conversations = await storage.getConversations(userId);
      
      // Enrich conversations with user and listing details
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation) => {
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

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if conversation exists and user is a participant
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
        return res.status(403).json({ error: "Not authorized to view this conversation" });
      }
      
      const messages = await storage.getMessages(conversationId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(conversationId, userId);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send a message
  app.post("/api/messages", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const senderId = req.user.id;
      const messageData = { ...req.body, senderId };
      
      // Validate message data
      const validatedData = insertMessageSchema.parse(messageData);
      
      // Check if the listing exists
      const listing = await storage.getListing(validatedData.listingId);
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      
      // Check if sender and receiver exist
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

  // Get unread message count
  app.get("/api/messages/unread", async (req: Request, res: Response) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
