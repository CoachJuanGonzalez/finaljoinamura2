import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import {
  users,
  profiles,
  rooms,
  actions,
  connections,
  streaks,
  memberships,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type ProfileWithUser,
  type Room,
  type InsertRoom,
  type RoomWithOrganizer,
  type Action,
  type InsertAction,
  type ActionWithUser,
  type Connection,
  type InsertConnection,
  type Streak,
  type InsertStreak,
  type Membership,
  type InsertMembership,
  type LeaderboardEntry,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    // Filter out undefined and null values to prevent overwriting NOT NULL columns
    const validData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined && v !== null)
    );
    
    if (Object.keys(validData).length === 0) {
      return this.getUser(id);
    }

    const [user] = await db
      .update(users)
      .set(validData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Profiles
  async getProfile(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async getProfileWithUser(id: string): Promise<ProfileWithUser | undefined> {
    const [result] = await db
      .select()
      .from(profiles)
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.id, id));

    if (!result || !result.users) return undefined;

    return {
      ...result.profiles,
      user: result.users,
    };
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(id: string, updateData: Partial<Profile>): Promise<Profile | undefined> {
    // Filter out undefined and null values to prevent overwriting NOT NULL columns
    const validData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined && v !== null)
    );
    
    if (Object.keys(validData).length === 0) {
      return this.getProfile(id);
    }

    const [profile] = await db
      .update(profiles)
      .set({ ...validData, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return profile;
  }

  async getProfilesByRoom(roomId: string): Promise<ProfileWithUser[]> {
    const results = await db
      .select({
        profile: profiles,
        user: users,
      })
      .from(memberships)
      .innerJoin(profiles, eq(memberships.userId, profiles.userId))
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(memberships.roomId, roomId));

    return results.map((r) => ({
      ...r.profile,
      user: r.user,
    }));
  }

  async getAllProfiles(): Promise<ProfileWithUser[]> {
    const results = await db
      .select()
      .from(profiles)
      .leftJoin(users, eq(profiles.userId, users.id));

    return results
      .filter((r) => r.users !== null)
      .map((r) => ({
        ...r.profiles,
        user: r.users!,
      }));
  }

  // Rooms
  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async getRoomWithOrganizer(id: string): Promise<RoomWithOrganizer | undefined> {
    const [result] = await db
      .select({
        room: rooms,
        organizer: users,
        participantCount: sql<number>`COALESCE(COUNT(DISTINCT ${memberships.id}), 0)`,
      })
      .from(rooms)
      .leftJoin(users, eq(rooms.organizerId, users.id))
      .leftJoin(memberships, eq(memberships.roomId, rooms.id))
      .where(eq(rooms.id, id))
      .groupBy(rooms.id, users.id);

    if (!result || !result.organizer) return undefined;

    return {
      ...result.room,
      organizer: result.organizer,
      participantCount: Number(result.participantCount),
    };
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async updateRoom(id: string, updateData: Partial<Room>): Promise<Room | undefined> {
    // Filter out undefined and null values to prevent overwriting NOT NULL columns
    const validData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined && v !== null)
    );
    
    if (Object.keys(validData).length === 0) {
      return this.getRoom(id);
    }

    const [room] = await db
      .update(rooms)
      .set(validData)
      .where(eq(rooms.id, id))
      .returning();
    return room;
  }

  async getAllRooms(): Promise<RoomWithOrganizer[]> {
    const results = await db
      .select({
        room: rooms,
        organizer: users,
        participantCount: sql<number>`COALESCE(COUNT(DISTINCT ${memberships.id}), 0)`,
      })
      .from(rooms)
      .leftJoin(users, eq(rooms.organizerId, users.id))
      .leftJoin(memberships, eq(memberships.roomId, rooms.id))
      .groupBy(rooms.id, users.id);

    return results
      .filter((r) => r.organizer !== null)
      .map((r) => ({
        ...r.room,
        organizer: r.organizer!,
        participantCount: Number(r.participantCount),
      }));
  }

  async getActiveRooms(): Promise<RoomWithOrganizer[]> {
    const results = await db
      .select({
        room: rooms,
        organizer: users,
        participantCount: sql<number>`COALESCE(COUNT(${profiles.id}), 0)`,
      })
      .from(rooms)
      .leftJoin(users, eq(rooms.organizerId, users.id))
      .leftJoin(profiles, eq(profiles.roomId, rooms.id))
      .where(eq(rooms.isActive, 1))
      .groupBy(rooms.id, users.id);

    return results
      .filter((r) => r.organizer !== null)
      .map((r) => ({
        ...r.room,
        organizer: r.organizer!,
        participantCount: Number(r.participantCount),
      }));
  }

  // Actions
  async getAction(id: string): Promise<Action | undefined> {
    const [action] = await db.select().from(actions).where(eq(actions.id, id));
    return action;
  }

  async createAction(insertAction: InsertAction): Promise<Action> {
    const [action] = await db.insert(actions).values(insertAction).returning();
    return action;
  }

  async getActionsByRoom(roomId: string): Promise<ActionWithUser[]> {
    const results = await db
      .select()
      .from(actions)
      .leftJoin(users, eq(actions.userId, users.id))
      .where(eq(actions.roomId, roomId))
      .orderBy(desc(actions.createdAt));

    return results
      .filter((r) => r.users !== null)
      .map((r) => ({
        ...r.actions,
        user: r.users!,
      }));
  }

  async getActionsByUser(userId: string): Promise<Action[]> {
    return await db.select().from(actions).where(eq(actions.userId, userId));
  }

  async getRecentActions(limit: number): Promise<ActionWithUser[]> {
    const results = await db
      .select()
      .from(actions)
      .leftJoin(users, eq(actions.userId, users.id))
      .orderBy(desc(actions.createdAt))
      .limit(limit);

    return results
      .filter((r) => r.users !== null)
      .map((r) => ({
        ...r.actions,
        user: r.users!,
      }));
  }

  async getActionsThisWeek(userId: string): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(actions)
      .where(
        and(
          eq(actions.userId, userId),
          sql`${actions.createdAt} >= ${oneWeekAgo}`
        )
      );

    return Number(result[0]?.count || 0);
  }

  // Connections
  async getConnection(id: string): Promise<Connection | undefined> {
    const [connection] = await db.select().from(connections).where(eq(connections.id, id));
    return connection;
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const [connection] = await db.insert(connections).values(insertConnection).returning();
    return connection;
  }

  async getConnectionsByUser(userId: string): Promise<Connection[]> {
    return await db.select().from(connections).where(eq(connections.userId, userId));
  }

  async checkConnection(userId: string, connectedUserId: string): Promise<boolean> {
    const [connection] = await db
      .select()
      .from(connections)
      .where(
        and(
          eq(connections.userId, userId),
          eq(connections.connectedUserId, connectedUserId)
        )
      );

    return !!connection;
  }

  // Streaks
  async getStreakByUser(userId: string): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak;
  }

  async updateStreak(userId: string, updateData: Partial<Streak>): Promise<Streak> {
    // Try to update existing streak
    const [streak] = await db
      .update(streaks)
      .set(updateData)
      .where(eq(streaks.userId, userId))
      .returning();

    // If no streak exists, create one
    if (!streak) {
      const [newStreak] = await db
        .insert(streaks)
        .values({
          userId,
          currentStreak: updateData.currentStreak || 0,
          longestStreak: updateData.longestStreak || 0,
          lastActionDate: updateData.lastActionDate || null,
        })
        .returning();
      return newStreak;
    }

    return streak;
  }

  async getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get all users with their streaks and weekly actions count
    const results = await db
      .select({
        userId: users.id,
        displayName: users.displayName,
        photoURL: users.photoURL,
        currentStreak: sql<number>`COALESCE(${streaks.currentStreak}, 0)`,
        longestStreak: sql<number>`COALESCE(${streaks.longestStreak}, 0)`,
        actionsThisWeek: sql<number>`
          COALESCE(
            (SELECT COUNT(*) FROM ${actions} 
             WHERE ${actions.userId} = ${users.id} 
             AND ${actions.createdAt} >= ${oneWeekAgo}),
            0
          )
        `,
      })
      .from(users)
      .leftJoin(streaks, eq(users.id, streaks.userId))
      .orderBy(
        desc(sql`COALESCE(${streaks.currentStreak}, 0)`),
        desc(sql`
          COALESCE(
            (SELECT COUNT(*) FROM ${actions} 
             WHERE ${actions.userId} = ${users.id} 
             AND ${actions.createdAt} >= ${oneWeekAgo}),
            0
          )
        `),
        users.displayName
      )
      .limit(limit);

    // Assign ranks
    return results.map((r, index) => ({
      userId: r.userId,
      displayName: r.displayName,
      photoURL: r.photoURL,
      currentStreak: Number(r.currentStreak),
      actionsThisWeek: Number(r.actionsThisWeek),
      rank: index + 1,
    }));
  }

  // Memberships
  async getRoomBySlug(slug: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.slug, slug));
    return room;
  }

  async createMembership(insertMembership: InsertMembership): Promise<Membership> {
    const [membership] = await db.insert(memberships).values(insertMembership).returning();
    return membership;
  }

  async getMembershipsByUserId(userId: string): Promise<Membership[]> {
    return await db.select().from(memberships).where(eq(memberships.userId, userId));
  }

  async getMembershipsByRoomId(roomId: string): Promise<Membership[]> {
    return await db.select().from(memberships).where(eq(memberships.roomId, roomId));
  }

  async getUserMembershipForRoom(userId: string, roomId: string): Promise<Membership | undefined> {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, userId), eq(memberships.roomId, roomId)));
    return membership;
  }

  async deleteMembership(id: string): Promise<void> {
    await db.delete(memberships).where(eq(memberships.id, id));
  }
}
