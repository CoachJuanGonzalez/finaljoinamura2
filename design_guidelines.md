# AMURA - Design Guidelines

## Brand Identity

**Name:** AMURA  
**Tagline:** Keep the flow alive.  
**Essence:** Connection, continuity, integrity, evolution.  
**Mission:** Transform networking into flow — where promises become progress and connections become continuity.  
**Symbolism:** Inspired by "Amaru," the Inca serpent representing wisdom and connection between worlds.  
**Tone:** Premium, conscious, minimalist, warm, futuristic.

**Design Approach:** Modern luxury meets ancient wisdom. Drawing inspiration from **Notion** (clarity), **Tesla** (premium minimalism), and **Calm** (warmth + purpose). This creates a high-end, flow-driven platform that transforms connection into continuity.

**Core Principle:** Facilitate meaningful flow through elegance, not excess. Every element should amplify the journey from promise to progress.

---

## Color System

**Primary Palette:**
- **Cosmic Black:** `#0B0E12` (primary background)
- **Indigo:** `#3F00FF` (gradient start, primary actions)
- **Teal:** `#00E8C2` (gradient end, vitality)
- **Accent Gold:** `#E2B857` (subtle highlights, premium touches)

**Text Colors:**
- **Light:** `#EAEAEA` (primary text)
- **Muted:** `#8A8F98` (secondary text)
- **Bright:** `#FFFFFF` (emphasis)

**Gradient System:**
- **Primary Gradient:** `linear-gradient(135deg, #3F00FF 0%, #00E8C2 100%)` (indigo → teal)
- **Gold Accent Gradient:** `linear-gradient(135deg, #E2B857 0%, #FFD700 100%)` (subtle vitality)
- **Button Hover Glow:** Combine teal + gold with blur for premium feel

**Usage:**
- Backgrounds: Cosmic black base
- Primary CTAs: Indigo→Teal gradient
- Accents: Gold for highlights, badges, streaks
- Cards: Subtle elevation with gradient borders

---

## Typography System

**Font Stack:** Inter (primary), Satoshi (alternate), system-ui fallback via Google Fonts CDN

**Brand Wordmark:** AMURA (always ALL CAPS for brand name)

**Hierarchy:**
- **Headlines (H1):** 4xl to 6xl, font-bold (700-800), tight leading (0.95-1.0), letter-spacing: 0.5-1px
- **Subheadlines (H2):** 2xl to 3xl, font-semibold, standard leading
- **Section Headers (H3):** xl to 2xl, font-semibold, letter-spacing: 0.5px
- **Body Text:** base to lg, font-normal (400-500), relaxed leading (1.6)
- **Micro Copy:** sm to xs, font-medium, uppercase with tracking-wide for labels
- **CTAs:** base to lg, font-semibold (600)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Tight spacing: p-2, gap-4 (within components)
- Standard spacing: p-6, p-8, gap-6 (between elements)
- Section spacing: py-16, py-20, py-24 (vertical sections)

**Container Strategy:**
- Full-width sections with inner max-w-7xl mx-auto px-6
- Content blocks: max-w-4xl for optimal reading
- Profile cards: max-w-sm to max-w-md

---

## Landing Page Structure

**1. Hero Section (80vh)**
- Headline: "Keep the flow alive."
- Subtitle: "AMURA turns connection into continuity — where promises become progress, and every encounter fuels your evolution."
- Primary CTA: "Join AMURA" (gradient button with glow)
- Secondary CTA: "Host with AMURA" (outline with blur background)
- Background: Subtle particle/light-flow animation behind text
- Include social proof: "Keeping flow alive at 50+ events"

**2. How It Works (3-column grid)**
- Step cards with gradient borders
- Flow-driven language throughout
- Icons: Lucide React (consistent with app)

**3. Features Showcase (Alternating 2-column sections)**
- Feature 1: "Flow Instantly" (instant connection via QR)
- Feature 2: "Amura Circles" (event spaces reimagined)
- Feature 3: "Promise Tracker" (momentum through action)
- Feature 4: "Flow Streaks" (gamified continuity)
- Each with gradient accent on image side

**4. About Section**
- "Amura is the bridge between action and intention."
- "Inspired by ancient wisdom and modern design, it transforms how we connect, follow through, and grow together."
- "Every promise kept. Every connection alive."

**5. CTA Section**
- Reinforced mission + large gradient CTA
- Link: "For Circle Organizers →"

**6. Footer**
- "© 2025 AMURA. Keep the flow alive."
- Navigation: Home | Features | Circles | Organizers | Login

---

## Application Interface Components

**Navigation Bar:**
- Sticky top with backdrop-blur-lg
- Logo left (AMURA wordmark), navigation center (Circles, Your Field, Flowboard)
- User avatar/menu right
- Mobile: Hamburger menu with slide-out drawer

**Circle View (formerly Room):**
- Header: Circle name + flow count (participants) + "Share Circle" button
- Tabbed interface: "Flow" | "Activity" | "Flowboard"
- Participant grid: 2-column mobile, 3-4 column desktop

**Profile Cards:**
- Compact design with avatar, name, role
- "Offer" and "Ask" sections with gradient dividers
- Action buttons: "Connect" | "View QR" | "Your Field"
- Hover: gradient glow effect (teal + gold)

**Profile Creation (Your Field):**
- Single-column centered (max-w-2xl)
- Grouped sections with premium feel
- Large textareas for Offer/Ask
- Gold accents on focus states

**QR Code Modal:**
- Centered overlay with gradient border
- Large QR display
- User info with gradient text treatment
- Download/Share buttons with glow

**Promise Feed (Activity):**
- Timeline cards with gradient left border
- Avatar + name + timestamp
- Promise text with emphasized keywords
- Subtle hover elevation

**Flowboard (Leaderboard):**
- Ranked table with gradient position badges
- Columns: Rank | Avatar+Name | Flow Streak | Promises This Week
- Top 3: Special gold/teal gradient highlights
- Premium card treatment

---

## Component Design Patterns

**Buttons:**
- Primary: Gradient fill (indigo→teal), rounded-full (pill shape), px-6 py-3, font-semibold, hover glow
- Secondary: Outline with gradient border, backdrop-blur, same padding
- Tertiary: Text with gradient on hover
- Icon buttons: Circular with gradient on hover

**Input Fields:**
- Rounded-lg borders, px-4 py-3
- Focus: Gradient ring effect
- Labels: text-sm font-medium with gold accent
- Placeholder: Muted text

**Cards:**
- Rounded-xl with subtle gradient border or shadow
- Padding: p-6 standard, p-4 compact
- Hover: Teal/gold glow (subtle)
- Background: Slightly elevated from cosmic black

**Badges/Tags:**
- Rounded-full px-3 py-1, text-xs font-medium uppercase
- Gradient backgrounds for streaks, gold for achievements
- Use for circle types, flow streaks, promise counts

---

## UX Tone & Microcopy

**Flow-Driven Language:**
- "Join Room" → "Enter Flow"
- "Create Event" → "Open Circle"
- "Add Action" → "Log Promise"
- "Leaderboard" → "Flowboard"
- "Profile" → "Your Field"
- "Event Rooms" → "Amura Circles"
- "Participants" → "Flow" (as in "45 in flow")
- "Actions This Week" → "Promises Kept"

**Copy Tone:**
- Human, warm, conscious
- Slightly poetic but never pretentious
- Focus on continuity, flow, integrity
- Avoid corporate/robotic language

---

## Images Strategy

**Landing Page:**
1. Hero: People in genuine flow/connection (soft gradient overlay)
2. Feature mockups: App interface with gradient accents
3. Testimonial avatars: Circular with gradient rings

**Application:**
- User avatars with subtle gradient borders
- QR codes with AMURA branding
- Default placeholders with gradient backgrounds

**Image Treatment:** Rounded corners, gradient overlays where needed, premium feel throughout

---

## Iconography

**Library:** Lucide React (consistent, modern, clean)

**Usage:**
- Navigation (Home, Compass for Circles, User for Field)
- Features (Zap, Users, Target, TrendingUp)
- Actions (Plus, Share2, Edit, Download)
- Premium: Sparkles for achievements, Crown for top streaks

---

## Animation & Polish

**Gradient Shimmer:**
- Subtle animation on CTA buttons
- Use on hover states for premium feel

**Hover Effects:**
- Soft glow (teal + gold blur)
- Subtle scale (scale-105)
- Gradient border reveal

**Loading States:**
- Skeleton screens with gradient animation
- Smooth transitions (duration-200 ease-in-out)

**Optional Premium Touches:**
- Particle/light-flow animation on hero
- Energy pulse on AMURA logo load
- Smooth gradient transitions on interactions

---

## Responsive Behavior

**Breakpoints:**
- Mobile-first (base for mobile)
- md: 768px (tablets)
- lg: 1024px (desktop)
- xl: 1280px (large screens)

**Key Adaptations:**
- Hero: Stack vertically on mobile, side-by-side lg+
- Navigation: Hamburger mobile, full nav lg+
- Grids: Single column → 2-3 → 3-4 columns
- Typography: Scale appropriately per breakpoint

---

## Accessibility

- Semantic HTML
- ARIA labels on all interactive elements
- Keyboard navigation (focus states with gradient rings)
- High contrast ratios (WCAG AA minimum)
- Touch targets: 44x44px minimum
- Reduced motion support

---

## Meta & SEO

- **Title:** AMURA – Keep the flow alive
- **Description:** AMURA is the modern connection platform for creators, leaders, and visionaries. Keep promises visible, relationships alive, and your flow in motion.
- **Favicon:** AMURA symbol (loop A mark)

---

This design creates a **premium, flow-driven networking platform** that feels both ancient and futuristic — where connection becomes continuity and every promise becomes progress.
