import { 
  type User, type InsertUser,
  type Profile, type InsertProfile, type ProfileWithUser,
  type Room, type InsertRoom, type RoomWithOrganizer,
  type Action, type InsertAction, type ActionWithUser,
  type Connection, type InsertConnection,
  type Streak, type InsertStreak, type LeaderboardEntry,
  type Membership, type InsertMembership
} from "@shared/schema";
import { randomUUID } from "crypto";
import { DbStorage } from "./db-storage";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Profiles
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  getProfileWithUser(id: string): Promise<ProfileWithUser | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile | undefined>;
  getProfilesByRoom(roomId: string): Promise<ProfileWithUser[]>;
  getAllProfiles(): Promise<ProfileWithUser[]>;
  
  // Rooms
  getRoom(id: string): Promise<Room | undefined>;
  getRoomWithOrganizer(id: string): Promise<RoomWithOrganizer | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<Room>): Promise<Room | undefined>;
  getAllRooms(): Promise<RoomWithOrganizer[]>;
  getActiveRooms(): Promise<RoomWithOrganizer[]>;
  
  // Actions
  getAction(id: string): Promise<Action | undefined>;
  createAction(action: InsertAction): Promise<Action>;
  getActionsByRoom(roomId: string): Promise<ActionWithUser[]>;
  getActionsByUser(userId: string): Promise<Action[]>;
  getRecentActions(limit: number): Promise<ActionWithUser[]>;
  getActionsThisWeek(userId: string): Promise<number>;
  
  // Connections
  getConnection(id: string): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsByUser(userId: string): Promise<Connection[]>;
  checkConnection(userId: string, connectedUserId: string): Promise<boolean>;
  
  // Streaks
  getStreakByUser(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, streak: Partial<Streak>): Promise<Streak>;
  getLeaderboard(limit: number): Promise<LeaderboardEntry[]>;
  
  // Memberships
  getRoomBySlug(slug: string): Promise<Room | undefined>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  getMembershipsByUserId(userId: string): Promise<Membership[]>;
  getMembershipsByRoomId(roomId: string): Promise<Membership[]>;
  getUserMembershipForRoom(userId: string, roomId: string): Promise<Membership | undefined>;
  deleteMembership(id: string): Promise<void>;
}

// Use database storage in production
export const storage: IStorage = new DbStorage();

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private rooms: Map<string, Room>;
  private actions: Map<string, Action>;
  private connections: Map<string, Connection>;
  private streaks: Map<string, Streak>;
  private memberships: Map<string, Membership>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.rooms = new Map();
    this.actions = new Map();
    this.connections = new Map();
    this.streaks = new Map();
    this.memberships = new Map();
    
    // Seed with demo data
    this.seedDemoData();
  }

  private seedDemoData() {
    // Create demo users
    const demoUsers: User[] = [
      {
        id: "user-1",
        email: "sarah@techcorp.com",
        displayName: "Sarah Chen",
        photoURL: null,
        createdAt: new Date(),
      },
      {
        id: "user-2",
        email: "alex@startupxyz.com",
        displayName: "Alex Rivera",
        photoURL: null,
        createdAt: new Date(),
      },
      {
        id: "user-3",
        email: "jordan@designco.com",
        displayName: "Jordan Kim",
        photoURL: null,
        createdAt: new Date(),
      },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Create demo profiles
    const demoProfiles: Profile[] = [
      {
        id: "profile-1",
        userId: "user-1",
        offer: "Product strategy advice, intro to Silicon Valley VCs, user research insights",
        ask: "Looking for experienced mobile developers, seeking beta users for B2B SaaS",
        links: ["https://linkedin.com/in/sarahchen"],
        roomId: "room-1",
        bio: "Building products that make a difference",
        role: "Product Manager",
        company: "TechCorp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "profile-2",
        userId: "user-2",
        offer: "Technical architecture advice, code reviews, mentorship for junior devs",
        ask: "Seeking co-founder for AI startup, looking for design feedback",
        links: ["https://github.com/alexrivera"],
        roomId: "room-1",
        bio: "Full-stack developer passionate about AI and ML",
        role: "Software Engineer",
        company: "StartupXYZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "profile-3",
        userId: "user-3",
        offer: "UI/UX design feedback, Figma tips and tricks, portfolio reviews",
        ask: "Looking for front-end developers to collaborate with",
        links: ["https://dribbble.com/jordankim"],
        roomId: "room-1",
        bio: "Crafting beautiful user experiences",
        role: "Designer",
        company: "DesignCo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    demoProfiles.forEach(profile => this.profiles.set(profile.id, profile));

    // Create demo room
    const demoRoom: Room = {
      id: "room-1",
      name: "Tech Summit 2025",
      description: "Annual technology conference bringing together innovators and builders",
      location: "San Francisco, CA",
      eventDate: new Date("2025-03-15"),
      organizerId: "user-1",
      isActive: 1,
      createdAt: new Date(),
    };

    this.rooms.set(demoRoom.id, demoRoom);

    // Create demo actions
    const demoActions: Action[] = [
      {
        id: "action-1",
        userId: "user-1",
        roomId: "room-1",
        content: "Just connected with 5 amazing founders!",
        actionType: "connection",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: "action-2",
        userId: "user-2",
        roomId: "room-1",
        content: "Gave a talk on scaling microservices",
        actionType: "contribution",
        createdAt: new Date(Date.now() - 1000 * 60 * 90),
      },
    ];

    demoActions.forEach(action => this.actions.set(action.id, action));

    // Create demo streaks
    const demoStreaks: Streak[] = [
      {
        id: "streak-1",
        userId: "user-1",
        currentStreak: 15,
        longestStreak: 20,
        lastActionDate: new Date(),
      },
      {
        id: "streak-2",
        userId: "user-2",
        currentStreak: 12,
        longestStreak: 15,
        lastActionDate: new Date(),
      },
      {
        id: "streak-3",
        userId: "user-3",
        currentStreak: 10,
        longestStreak: 12,
        lastActionDate: new Date(),
      },
    ];

    demoStreaks.forEach(streak => this.streaks.set(streak.id, streak));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Profiles
  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async getProfileWithUser(id: string): Promise<ProfileWithUser | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    
    const user = await this.getUser(profile.userId);
    if (!user) return undefined;
    
    return { ...profile, user };
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = {
      ...insertProfile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { 
      ...profile, 
      ...updates,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getProfilesByRoom(roomId: string): Promise<ProfileWithUser[]> {
    const profilesInRoom = Array.from(this.profiles.values())
      .filter(profile => profile.roomId === roomId);
    
    const profilesWithUsers: ProfileWithUser[] = [];
    for (const profile of profilesInRoom) {
      const user = await this.getUser(profile.userId);
      if (user) {
        profilesWithUsers.push({ ...profile, user });
      }
    }
    
    return profilesWithUsers;
  }

  async getAllProfiles(): Promise<ProfileWithUser[]> {
    const profiles = Array.from(this.profiles.values());
    const profilesWithUsers: ProfileWithUser[] = [];
    
    for (const profile of profiles) {
      const user = await this.getUser(profile.userId);
      if (user) {
        profilesWithUsers.push({ ...profile, user });
      }
    }
    
    return profilesWithUsers;
  }

  // Rooms
  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRoomWithOrganizer(id: string): Promise<RoomWithOrganizer | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const organizer = await this.getUser(room.organizerId);
    if (!organizer) return undefined;
    
    const participantCount = Array.from(this.profiles.values())
      .filter(profile => profile.roomId === id).length;
    
    return { ...room, organizer, participantCount };
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = {
      ...insertRoom,
      id,
      createdAt: new Date(),
    };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  async getAllRooms(): Promise<RoomWithOrganizer[]> {
    const rooms = Array.from(this.rooms.values());
    const roomsWithOrganizers: RoomWithOrganizer[] = [];
    
    for (const room of rooms) {
      const organizer = await this.getUser(room.organizerId);
      if (organizer) {
        const participantCount = Array.from(this.profiles.values())
          .filter(profile => profile.roomId === room.id).length;
        roomsWithOrganizers.push({ ...room, organizer, participantCount });
      }
    }
    
    return roomsWithOrganizers;
  }

  async getActiveRooms(): Promise<RoomWithOrganizer[]> {
    const allRooms = await this.getAllRooms();
    return allRooms.filter(room => room.isActive === 1);
  }

  // Actions
  async getAction(id: string): Promise<Action | undefined> {
    return this.actions.get(id);
  }

  async createAction(insertAction: InsertAction): Promise<Action> {
    const id = randomUUID();
    const action: Action = {
      ...insertAction,
      id,
      createdAt: new Date(),
    };
    this.actions.set(id, action);
    return action;
  }

  async getActionsByRoom(roomId: string): Promise<ActionWithUser[]> {
    const roomActions = Array.from(this.actions.values())
      .filter(action => action.roomId === roomId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const actionsWithUsers: ActionWithUser[] = [];
    for (const action of roomActions) {
      const user = await this.getUser(action.userId);
      if (user) {
        actionsWithUsers.push({ ...action, user });
      }
    }
    
    return actionsWithUsers;
  }

  async getActionsByUser(userId: string): Promise<Action[]> {
    return Array.from(this.actions.values())
      .filter(action => action.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentActions(limit: number): Promise<ActionWithUser[]> {
    const allActions = Array.from(this.actions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    const actionsWithUsers: ActionWithUser[] = [];
    for (const action of allActions) {
      const user = await this.getUser(action.userId);
      if (user) {
        actionsWithUsers.push({ ...action, user });
      }
    }
    
    return actionsWithUsers;
  }

  async getActionsThisWeek(userId: string): Promise<number> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return Array.from(this.actions.values())
      .filter(action => 
        action.userId === userId && 
        action.createdAt >= oneWeekAgo
      ).length;
  }

  // Connections
  async getConnection(id: string): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = randomUUID();
    const connection: Connection = {
      ...insertConnection,
      id,
      createdAt: new Date(),
    };
    this.connections.set(id, connection);
    return connection;
  }

  async getConnectionsByUser(userId: string): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter(conn => 
        conn.userId === userId || conn.connectedUserId === userId
      );
  }

  async checkConnection(userId: string, connectedUserId: string): Promise<boolean> {
    return Array.from(this.connections.values()).some(conn =>
      (conn.userId === userId && conn.connectedUserId === connectedUserId) ||
      (conn.userId === connectedUserId && conn.connectedUserId === userId)
    );
  }

  // Streaks
  async getStreakByUser(userId: string): Promise<Streak | undefined> {
    return Array.from(this.streaks.values()).find(
      streak => streak.userId === userId
    );
  }

  async updateStreak(userId: string, updates: Partial<Streak>): Promise<Streak> {
    let streak = await this.getStreakByUser(userId);
    
    if (!streak) {
      const id = randomUUID();
      streak = {
        id,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActionDate: null,
      };
      this.streaks.set(id, streak);
    }
    
    const updatedStreak = { ...streak, ...updates };
    this.streaks.set(updatedStreak.id, updatedStreak);
    return updatedStreak;
  }

  async getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
    const entries: LeaderboardEntry[] = [];
    
    for (const [, streak] of this.streaks) {
      const user = await this.getUser(streak.userId);
      if (!user) continue;
      
      const actionsThisWeek = await this.getActionsThisWeek(streak.userId);
      
      entries.push({
        userId: user.id,
        displayName: user.displayName,
        photoURL: user.photoURL,
        currentStreak: streak.currentStreak,
        actionsThisWeek,
        rank: 0, // Will be set after sorting
      });
    }
    
    // Sort by current streak, then by actions this week
    entries.sort((a, b) => {
      if (b.currentStreak !== a.currentStreak) {
        return b.currentStreak - a.currentStreak;
      }
      return b.actionsThisWeek - a.actionsThisWeek;
    });
    
    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    return entries.slice(0, limit);
  }

  // Memberships
  async getRoomBySlug(slug: string): Promise<Room | undefined> {
    return Array.from(this.rooms.values()).find(room => room.slug === slug);
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const id = randomUUID();
    const membership: Membership = {
      id,
      ...insertMembership,
      joinedAt: new Date(),
    };
    this.memberships.set(id, membership);
    return membership;
  }

  async getMembershipsByUserId(userId: string): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(
      membership => membership.userId === userId
    );
  }

  async getMembershipsByRoomId(roomId: string): Promise<Membership[]> {
    return Array.from(this.memberships.values()).filter(
      membership => membership.roomId === roomId
    );
  }

  async getUserMembershipForRoom(userId: string, roomId: string): Promise<Membership | undefined> {
    return Array.from(this.memberships.values()).find(
      membership => membership.userId === userId && membership.roomId === roomId
    );
  }

  async deleteMembership(id: string): Promise<void> {
    this.memberships.delete(id);
  }
}
