# AMURA - Flow-Driven Connection Platform

## Overview
AMURA is a Progressive Web App that transforms connection into continuity. Users create profiles with "Offer" and "Ask" frameworks, enter circles (event spaces), connect via QR codes, track daily promises, and compete on the flowboard. Inspired by "Amaru," the Inca serpent representing wisdom and connection between worlds.

**Tagline:** Keep the flow alive.

**Mission:** Transform networking into flow — where promises become progress and connections become continuity.

## Recent Changes (Nov 2025)
- **Authentication System**: Fully functional session-based auth with bcrypt password hashing, signup/login flows, and protected routes
- **Circle Invitation System**: Shareable invitation links with auto-generated slugs, public preview pages, and one-click join flow
- **Membership Tracking**: Database-backed membership system replacing profile-based participant counting
- **Brand Transformation**: Complete rebrand from ALIGN to AMURA with cosmic black theme, indigo→teal gradient, and flow-driven language
- **PostgreSQL Migration**: Migrated from in-memory storage to PostgreSQL database with Drizzle ORM
- **Database Optimizations**: Fixed leaderboard ordering, participant counting with GROUP BY, null-safe updates
- **Complete Frontend**: Landing page, auth UI, profile management (Your Field), circle system, QR code generation, promise feed, and flowboard
- **Design System**: AMURA brand colors (cosmic black #0B0E12, indigo #3F00FF, teal #00E8C2, gold #E2B857), Inter font, premium aesthetic

## Project Architecture

### Frontend (React + TypeScript + Tailwind)
- **Pages**:
  - `/` - Landing page with "Keep the flow alive" hero, AMURA branding, flow-driven features
  - `/auth` - Email/password authentication with toggle between login and signup
  - `/invite/:slug` - Public circle invitation page with preview and join functionality
  - `/app/rooms` - Amura Circles directory with "Open Circle" creation modal
  - `/app/rooms/:id` - Circle details with participants, promise feed, flowboard
  - `/app/profile` - Your Field (profile creation and editing)
  - `/app/qr` - QR code generation and sharing

- **Components**:
  - `AppLayout` - Navigation header with AMURA branding, authenticated user menu with logout
  - `AuthContext` - React context provider for authentication state management
  - `CreateCircleModal` - Dialog form for creating new circles with auto-generated slugs
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
  - `/api/auth/signup` - Create account with email, password (bcrypt hashed), displayName
  - `/api/auth/login` - Authenticate with email/password, starts session
  - `/api/auth/me` - Get current authenticated user
  - `/api/auth/logout` - End session
  - `/api/circles` - Create circle (POST, requires auth), auto-generates unique slug
  - `/api/circles/slug/:slug` - Get circle by slug for public invitation preview
  - `/api/circles/:id/join` - Join circle (POST, requires auth), creates membership
  - `/api/users` - User management
  - `/api/profiles` - Profile CRUD and listing
  - `/api/rooms` - Circle (event room) management with participant counts
  - `/api/rooms/:id` - Get circle details with organizer info
  - `/api/actions` - Promise logging (activity tracking)
  - `/api/connections` - User connections
  - `/api/streaks` - Flow streak tracking
  - `/api/leaderboard` - Flowboard rankings by streak and promises kept

- **Features**:
  - Session-based authentication with express-session (1-week cookie expiry)
  - Bcrypt password hashing (10 salt rounds) for security
  - Auto-generated slugs from circle names for clean shareable URLs
  - Membership-based participant tracking (replaces profile roomId)
  - Automatic flow streak tracking on daily promises
  - Flowboard ranking logic (streak → actionsThisWeek → displayName)
  - Connection validation (no duplicates)
  - Null-safe update methods for all entities

### Data Models
- **User**: email, password (bcrypt hashed), displayName, photoURL
- **Profile**: user info, offer, ask, links, bio, role, company (roomId field deprecated)
- **Room** (Circle): name, description, location, eventDate, capacity, organizerId, slug (unique), isActive, participant count
- **Membership**: userId, roomId, joinedAt (tracks circle participation)
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
✅ **Session-based authentication system** (signup, login, logout, protected routes)
✅ **Bcrypt password hashing** for secure credential storage
✅ **Circle invitation system** with shareable slug-based URLs (/invite/:slug)
✅ **Membership tracking** replacing profile-based participant counting
✅ **CreateCircleModal** component for organizers to open new circles
✅ **AuthContext** provider for global authentication state
✅ PostgreSQL database with production-ready queries
✅ Profile creation (Your Field) with Offer/Ask framework
✅ Circle directory and detail views
✅ QR code generation and download
✅ Promise feed display
✅ Flowboard with rankings
✅ Complete REST API with PostgreSQL storage
✅ React Query integration with loading states
✅ **End-to-end authentication & invitation flow tested successfully** (2 users, 2 memberships)
✅ Database queries optimized and architect-approved
⏳ Pending: Production session store (currently in-memory for dev)
⏳ Pending: Environment-specific SESSION_SECRET configuration
⏳ Pending: Production deployment

## Authentication & Invitation Flow
**How it works:**
1. **Organizer creates circle** → System auto-generates unique slug (e.g., "billionaire-bootcamp-2025")
2. **Share invitation link** → `/invite/billionaire-bootcamp-2025`
3. **Guest visits link** → Sees circle preview with name, location, description, participant count
4. **Guest clicks "Enter Flow"** → If not authenticated, redirects to `/auth`
5. **Guest signs up/logs in** → Returns to invitation page automatically
6. **Guest joins circle** → Creates membership record, redirects to circle detail page
7. **Both users see each other** → Participant count updates, both listed as members

**Security:**
- Passwords hashed with bcrypt (10 salt rounds) before database storage
- Session cookies with 1-week expiry, httpOnly flag
- No passwords ever sent in API responses
- Protected routes check session authentication
