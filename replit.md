# AMURA - Flow-Driven Connection Platform

## Overview
AMURA is a Progressive Web App that transforms connection into continuity. Users create profiles with "Offer" and "Ask" frameworks, enter circles (event spaces), connect via QR codes, track daily promises, and compete on the flowboard. Inspired by "Amaru," the Inca serpent representing wisdom and connection between worlds.

**Tagline:** Keep the flow alive.

**Mission:** Transform networking into flow — where promises become progress and connections become continuity.

## Recent Changes (Nov 2025)
- **Brand Transformation**: Complete rebrand from ALIGN to AMURA with cosmic black theme, indigo→teal gradient, and flow-driven language
- **PostgreSQL Migration**: Migrated from in-memory storage to PostgreSQL database with Drizzle ORM
- **Database Optimizations**: Fixed leaderboard ordering, participant counting with GROUP BY, null-safe updates
- **Complete Frontend**: Landing page, auth UI, profile management (Your Field), circle system, QR code generation, promise feed, and flowboard
- **Design System**: AMURA brand colors (cosmic black #0B0E12, indigo #3F00FF, teal #00E8C2, gold #E2B857), Inter font, premium aesthetic

## Project Architecture

### Frontend (React + TypeScript + Tailwind)
- **Pages**:
  - `/` - Landing page with "Keep the flow alive" hero, AMURA branding, flow-driven features
  - `/auth` - Authentication (ready for Firebase integration)
  - `/app/rooms` - Amura Circles directory (event spaces)
  - `/app/rooms/:id` - Circle details with participants, promise feed, flowboard
  - `/app/profile` - Your Field (profile creation and editing)
  - `/app/qr` - QR code generation and sharing

- **Components**:
  - `AppLayout` - Navigation header with AMURA branding and user menu
  - `UserProfileCard` - Reusable profile display card
  - Shadcn UI components with AMURA color scheme

- **Design Principles**:
  - Premium, flow-driven aesthetic inspired by Notion/Tesla/Calm
  - Cosmic black background with indigo→teal gradient accents
  - Gold highlights for achievements and streaks
  - Inter font for professional typography
  - Responsive mobile-first design
  - Rounded-full pill buttons for CTAs
  - Hover/active state elevations with teal/gold glow
  - Beautiful loading states with skeletons

### Backend (Express + TypeScript + PostgreSQL)
- **Storage**: PostgreSQL database with Drizzle ORM (DbStorage)
- **API Endpoints**:
  - `/api/users` - User management
  - `/api/profiles` - Profile CRUD and listing
  - `/api/rooms` - Circle (event room) management
  - `/api/actions` - Promise logging (activity tracking)
  - `/api/connections` - User connections
  - `/api/streaks` - Flow streak tracking
  - `/api/leaderboard` - Flowboard rankings by streak and promises kept

- **Features**:
  - Automatic flow streak tracking on daily promises
  - Participant counting per circle (optimized with GROUP BY)
  - Flowboard ranking logic (streak → actionsThisWeek → displayName)
  - Connection validation (no duplicates)
  - Null-safe update methods for all entities

### Data Models
- **User**: email, displayName, photoURL
- **Profile**: user info, offer, ask, links, circle assignment, bio, role, company
- **Room** (Circle): name, description, location, eventDate, organizer, participant count
- **Action** (Promise): user promises with type and content, circle association
- **Connection**: user-to-user connections, circle context
- **Streak**: current/longest flow streak tracking, last action date

## Brand Philosophy
- **Connection → Continuity**: Relationships don't end after events, they evolve
- **Promises → Progress**: Daily actions create momentum
- **Flow State**: Networking becomes effortless when intentions align
- **Ancient Wisdom**: Inspired by Amaru serpent symbolism (transformation, connection)
- **Premium Feel**: High-end design that respects users' time and attention

## Terminology
- **Circles** (not "rooms"): Event spaces where flow happens
- **Promises** (not "actions"): Daily commitments that build continuity
- **Flow Streaks** (not "streaks"): Consistency metrics
- **Flowboard** (not "leaderboard"): Community rankings
- **Your Field** (not "profile"): Personal space defining offer/ask
- **Enter Flow** (not "join"): Active participation verb
- **Open Circle** (not "create room"): Circle creation action

## User Preferences
- Premium, conscious design
- Mobile-optimized for in-person events
- Fast QR code generation for instant connection
- Simple Offer/Ask framework for intentional flow
- Flow-driven language that feels human and warm

## Future Enhancements
- Firebase Authentication integration (credentials ready to be added)
- Stripe payment processing for circle organizers ($99/event tier)
- Real-time notifications with WebSocket
- Direct messaging between connections
- Analytics dashboard for organizers
- PWA installation prompts
- Custom domain support

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript, PostgreSQL, Drizzle ORM
- **Database**: Neon PostgreSQL with WebSocket support
- **Future**: Firebase Auth (infrastructure ready)
- **QR Codes**: qrcode library for generation
- **Icons**: Lucide React

## Running the Project
The workflow "Start application" runs `npm run dev` which starts both the Express server and Vite dev server on the same port. The app auto-restarts on file changes.

## Database Management
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Push changes: `npm run db:push` (or `npm run db:push --force` if data loss warning)
- Seed data: `npm run db:seed`
- Never manually write SQL migrations - use Drizzle push

## Firebase Integration (When Ready)
To enable authentication:
1. Add secrets: `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_API_KEY`
2. Firebase config code is ready in auth.tsx
3. Backend uses PostgreSQL (Firestore not needed)

## Project Status
✅ Complete AMURA brand transformation (colors, copy, philosophy)
✅ Landing page with "Keep the flow alive" hero
✅ PostgreSQL database with production-ready queries
✅ Profile creation (Your Field) with Offer/Ask framework
✅ Circle directory and detail views
✅ QR code generation and download
✅ Promise feed display
✅ Flowboard with rankings
✅ Complete REST API with PostgreSQL storage
✅ React Query integration with loading states
✅ End-to-end testing completed successfully
✅ Database queries optimized and architect-approved
⏳ Pending: Firebase auth integration (when ready)
⏳ Pending: Room detail page terminology updates
⏳ Pending: Profile setup page terminology updates
⏳ Pending: Production deployment
