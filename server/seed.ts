import { db } from "./db";
import { users, profiles, rooms, actions, streaks } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  try {
    // Create demo users
    const demoUsers = await db
      .insert(users)
      .values([
        {
          id: "user-1",
          email: "sarah@techcorp.com",
          displayName: "Sarah Chen",
          photoURL: null,
        },
        {
          id: "user-2",
          email: "alex@startupxyz.com",
          displayName: "Alex Rivera",
          photoURL: null,
        },
        {
          id: "user-3",
          email: "jordan@designco.com",
          displayName: "Jordan Kim",
          photoURL: null,
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${demoUsers.length} users`);

    // Create demo room
    const demoRooms = await db
      .insert(rooms)
      .values([
        {
          id: "room-1",
          name: "Tech Summit 2025",
          description: "Annual technology conference bringing together innovators and builders",
          location: "San Francisco, CA",
          eventDate: new Date("2025-03-15"),
          organizerId: "user-1",
          isActive: 1,
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${demoRooms.length} rooms`);

    // Create demo profiles
    const demoProfiles = await db
      .insert(profiles)
      .values([
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
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${demoProfiles.length} profiles`);

    // Create demo actions
    const demoActions = await db
      .insert(actions)
      .values([
        {
          id: "action-1",
          userId: "user-1",
          roomId: "room-1",
          content: "Just connected with 5 amazing founders!",
          actionType: "connection",
        },
        {
          id: "action-2",
          userId: "user-2",
          roomId: "room-1",
          content: "Gave a talk on scaling microservices",
          actionType: "contribution",
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${demoActions.length} actions`);

    // Create demo streaks
    const demoStreaks = await db
      .insert(streaks)
      .values([
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
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Created ${demoStreaks.length} streaks`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
