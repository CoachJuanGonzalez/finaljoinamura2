# ALIGN - Event Networking Platform

## Overview
ALIGN is a Progressive Web App designed to transform event networking. Users can create profiles with "Offer" and "Ask" frameworks, join event rooms, connect via QR codes, track daily networking actions, and compete on leaderboards.

## Recent Changes (Nov 2025)
- **Complete Frontend Build**: Landing page, auth UI, profile management, room system, QR code generation, activity feeds, and leaderboards
- **Backend API**: Full REST API with in-memory storage for all features
- **Data Integration**: Connected frontend to backend with React Query
- **Design System**: Implemented Inter font, custom color tokens, responsive layouts

## Project Architecture

### Frontend (React + TypeScript + Tailwind)
- **Pages**:
  - `/` - Landing page with hero, features, how it works sections
  - `/auth` - Authentication (ready for Firebase integration)
  - `/app/rooms` - Event room directory
  - `/app/rooms/:id` - Room details with participants, activity feed, leaderboard
  - `/app/profile` - Profile creation and editing
  - `/app/qr` - QR code generation and sharing

- **Components**:
  - `AppLayout` - Navigation header with user menu
  - `UserProfileCard` - Reusable profile display card
  - Shadcn UI components for consistent design

- **Design Principles**:
  - Clean, modern aesthetic inspired by Linear/Notion
  - Inter font for professional typography
  - Responsive mobile-first design
  - Hover/active state elevations for interactions
  - Beautiful loading states with skeletons

### Backend (Express + TypeScript)
- **Storage**: In-memory storage (MemStorage) with demo seed data
- **API Endpoints**:
  - `/api/users` - User management
  - `/api/profiles` - Profile CRUD and listing
  - `/api/rooms` - Event room management
  - `/api/actions` - Activity logging
  - `/api/connections` - User connections
  - `/api/streaks` - Streak tracking
  - `/api/leaderboard` - Rankings by streak and activity

- **Features**:
  - Automatic streak tracking on daily actions
  - Participant counting per room
  - Leaderboard ranking logic
  - Connection validation (no duplicates)

### Data Models
- **User**: email, displayName, photoURL
- **Profile**: user info, offer, ask, links, room assignment, bio, role, company
- **Room**: name, description, location, eventDate, organizer, participant count
- **Action**: user actions with type and content, room association
- **Connection**: user-to-user connections, room context
- **Streak**: current/longest streak tracking, last action date

## User Preferences
- Clean, professional design
- Mobile-optimized for in-person events
- Fast QR code generation for quick networking
- Simple Offer/Ask framework for intentional connections

## Future Enhancements
- Firebase Authentication integration (credentials ready to be added)
- Stripe payment processing for event organizers ($99/event tier)
- Real-time notifications
- Direct messaging between connections
- Analytics dashboard for organizers
- PWA installation prompts
- Custom domain support

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Future**: Firebase Auth & Firestore (infrastructure ready)
- **QR Codes**: qrcode library for generation
- **Icons**: Lucide React

## Running the Project
The workflow "Start application" runs `npm run dev` which starts both the Express server and Vite dev server on the same port. The app auto-restarts on file changes.

## Firebase Integration (When Ready)
To enable authentication:
1. Add secrets: `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_API_KEY`
2. Firebase config code is ready in auth.tsx
3. Backend can be migrated to Firestore if needed

## Project Status
✅ Complete landing page with generated images
✅ Full authentication UI (ready for Firebase)
✅ Profile creation with Offer/Ask framework
✅ Room directory and detail views
✅ QR code generation and download
✅ Activity feed display
✅ Leaderboard with rankings
✅ Complete REST API with seed data
✅ React Query integration with loading states
⏳ Pending: Firebase auth integration
⏳ Pending: End-to-end testing
⏳ Pending: Production deployment
