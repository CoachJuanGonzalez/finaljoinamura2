import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProfileSchema, 
  insertRoomSchema,
  insertActionSchema,
  insertConnectionSchema 
} from "@shared/schema";

// Extend Express Request to include session
interface AuthRequest extends Request {
  session: {
    userId?: string;
    destroy: (callback: (err?: Error) => void) => void;
  }
}

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req: AuthRequest, res) => {
    try {
      const { email, password, displayName } = req.body;
      
      if (!email || !password || !displayName) {
        return res.status(400).json({ message: "Email, password, and display name are required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser({ email, password, displayName, photoURL: null });
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req: AuthRequest, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Verify password with bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req: AuthRequest, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with this email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfileWithUser(req.params.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profiles/user/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfileByUserId(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/profiles", async (req, res) => {
    try {
      const { roomId } = req.query;
      
      if (roomId && typeof roomId === "string") {
        const profiles = await storage.getProfilesByRoom(roomId);
        return res.json(profiles);
      }
      
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.id, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Room routes
  app.get("/api/rooms", async (req, res) => {
    try {
      const { active } = req.query;
      
      if (active === "true") {
        const rooms = await storage.getActiveRooms();
        return res.json(rooms);
      }
      
      const rooms = await storage.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoomWithOrganizer(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.status(201).json(room);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.updateRoom(req.params.id, req.body);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Circle invitation routes
  app.get("/api/circles/slug/:slug", async (req, res) => {
    try {
      const room = await storage.getRoomBySlug(req.params.slug);
      if (!room) {
        return res.status(404).json({ message: "Circle not found" });
      }
      
      // Get room with organizer info
      const roomWithOrganizer = await storage.getRoomWithOrganizer(room.id);
      res.json(roomWithOrganizer);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/circles", async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { name, description, location, eventDate, capacity } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Circle name is required" });
      }
      
      // Generate unique slug
      let slug = generateSlug(name);
      let existingRoom = await storage.getRoomBySlug(slug);
      let counter = 1;
      
      while (existingRoom) {
        slug = `${generateSlug(name)}-${counter}`;
        existingRoom = await storage.getRoomBySlug(slug);
        counter++;
      }
      
      const room = await storage.createRoom({
        name,
        slug,
        description: description || null,
        location: location || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        capacity: capacity || null,
        organizerId: req.session.userId,
        isActive: 1,
      });
      
      // Automatically join the creator to the circle
      await storage.createMembership({
        userId: req.session.userId,
        roomId: room.id,
      });
      
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/circles/:id/join", async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Circle not found" });
      }
      
      // Check if already a member
      const existing = await storage.getUserMembershipForRoom(req.session.userId, req.params.id);
      if (existing) {
        return res.status(400).json({ message: "Already a member of this circle" });
      }
      
      // Check capacity if set
      if (room.capacity) {
        const memberships = await storage.getMembershipsByRoomId(req.params.id);
        if (memberships.length >= room.capacity) {
          return res.status(400).json({ message: "Circle is at full capacity" });
        }
      }
      
      const membership = await storage.createMembership({
        userId: req.session.userId,
        roomId: req.params.id,
      });
      
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Action routes
  app.get("/api/actions", async (req, res) => {
    try {
      const { roomId, userId, limit } = req.query;
      
      if (roomId && typeof roomId === "string") {
        const actions = await storage.getActionsByRoom(roomId);
        return res.json(actions);
      }
      
      if (userId && typeof userId === "string") {
        const actions = await storage.getActionsByUser(userId);
        return res.json(actions);
      }
      
      const limitNum = limit ? parseInt(limit as string) : 50;
      const actions = await storage.getRecentActions(limitNum);
      res.json(actions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/actions", async (req, res) => {
    try {
      const actionData = insertActionSchema.parse(req.body);
      const action = await storage.createAction(actionData);
      
      // Update user's streak
      const streak = await storage.getStreakByUser(actionData.userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (streak && streak.lastActionDate) {
        const lastActionDate = new Date(streak.lastActionDate);
        lastActionDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastActionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          const newStreak = streak.currentStreak + 1;
          await storage.updateStreak(actionData.userId, {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastActionDate: new Date(),
          });
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          await storage.updateStreak(actionData.userId, {
            currentStreak: 1,
            lastActionDate: new Date(),
          });
        }
        // Same day - no change to streak count
      } else {
        // First action - start streak
        await storage.updateStreak(actionData.userId, {
          currentStreak: 1,
          longestStreak: 1,
          lastActionDate: new Date(),
        });
      }
      
      res.status(201).json(action);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Connection routes
  app.get("/api/connections/:userId", async (req, res) => {
    try {
      const connections = await storage.getConnectionsByUser(req.params.userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      // Check if connection already exists
      const exists = await storage.checkConnection(
        connectionData.userId,
        connectionData.connectedUserId
      );
      
      if (exists) {
        return res.status(400).json({ message: "Connection already exists" });
      }
      
      const connection = await storage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Streak routes
  app.get("/api/streaks/:userId", async (req, res) => {
    try {
      const streak = await storage.getStreakByUser(req.params.userId);
      if (!streak) {
        return res.status(404).json({ message: "Streak not found" });
      }
      res.json(streak);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limitNum);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
