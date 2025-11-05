# ALIGN - Design Guidelines

## Design Approach: Reference-Based (Modern Social + Productivity Hybrid)

Drawing inspiration from **Linear** (clean, purposeful UI), **Notion** (intuitive information architecture), and **LinkedIn** (professional networking aesthetic). This creates a trustworthy, energetic platform that balances social connection with productivity-focused clarity.

**Core Principle:** Facilitate meaningful connections through clarity, not clutter. Every element should reduce friction in the networking process.

---

## Typography System

**Font Stack:** Inter (primary), system-ui fallback via Google Fonts CDN

**Hierarchy:**
- **Headlines (H1):** 4xl to 6xl, font-bold, tight leading (0.95-1.0) for impact
- **Subheadlines (H2):** 2xl to 3xl, font-semibold, standard leading
- **Section Headers (H3):** xl to 2xl, font-semibold
- **Body Text:** base to lg, font-normal, relaxed leading (1.6) for readability
- **Micro Copy (labels, tags):** sm to xs, font-medium, uppercase with tracking-wide for tags
- **CTAs:** base to lg, font-semibold

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
- Split layout: Left = headline + value prop + dual CTAs, Right = hero image showing people networking/connecting
- Headline dominates (text-5xl lg:text-6xl), subtext below (text-xl)
- Primary CTA: "Join Event Room" (prominent), Secondary: "Learn More"
- Include social proof badge beneath CTAs: "1,000+ connections made at 50+ events"

**2. How It Works (3-column grid lg:grid-cols-3)**
- Step-by-step visual cards with large numbers, icons, and descriptions
- Icons from Heroicons (outline style)

**3. Features Showcase (Alternating 2-column sections)**
- Feature 1: Profile & Offer/Ask (image left, text right)
- Feature 2: QR Connect (text left, image right)
- Feature 3: Daily Actions & Leaderboard (image left, text right)
- Each section includes screenshot/mockup placeholder

**4. Social Proof (3-column testimonial cards)**
- Avatar + quote + name/role format
- Subtle elevation with rounded-xl cards

**5. CTA Section (centered, py-20)**
- Reinforced value proposition + large primary button
- Include secondary link: "For Event Organizers →"

**6. Footer (multi-column grid-cols-4)**
- Column 1: Brand + tagline
- Column 2: Product links
- Column 3: Resources
- Column 4: Newsletter signup form + social icons

---

## Application Interface Components

**Navigation Bar:**
- Sticky top with backdrop-blur-lg
- Logo left, navigation center (Rooms, Profile, Connections), user avatar/menu right
- Mobile: Hamburger menu with slide-out drawer

**Room View:**
- Header: Room name + participant count + "Share Room" button
- Tabbed interface: "Participants" | "Activity Feed" | "Leaderboard"
- Participant grid: 2-column mobile, 3-4 column desktop card layout

**Profile Cards:**
- Compact card design with avatar, name, and role at top
- "Offer" and "Ask" sections clearly labeled with distinct styling
- Action buttons row at bottom: "Connect" | "View QR" | "View Full Profile"
- Hover state: subtle lift (shadow-lg transition)

**Profile Creation Form:**
- Single-column centered layout (max-w-2xl)
- Grouped sections with clear labels
- Large textarea fields for Offer/Ask (h-32)
- Links section with add/remove capability
- Progress indicator if multi-step

**QR Code Modal:**
- Centered overlay with backdrop-blur
- Large QR code display (w-64 h-64)
- User info below: name + offer snippet
- Download/Share buttons

**Activity Feed:**
- Timeline-style cards with avatar, name, timestamp
- Action text with emphasized keywords
- Like/comment interactions if applicable

**Leaderboard:**
- Ranked table with position numbers prominently displayed
- Columns: Rank | Avatar+Name | Streak Count | Actions This Week
- Top 3 highlighted with special treatment (subtle glow/border)

---

## Component Design Patterns

**Buttons:**
- Primary: Solid fill, rounded-lg, px-6 py-3, font-semibold
- Secondary: Outline style with border-2, same padding
- Tertiary: Text-only with subtle hover underline
- Icon buttons: Square or circle with p-2 to p-3

**Input Fields:**
- Rounded-lg borders, px-4 py-3, focus states with ring
- Labels above with text-sm font-medium, mb-2
- Helper text below in text-sm

**Cards:**
- Rounded-xl with subtle shadow (shadow-sm default, shadow-lg on hover)
- Padding: p-6 standard, p-4 compact
- Border or subtle background differentiation

**Badges/Tags:**
- Rounded-full px-3 py-1, text-xs font-medium uppercase
- Use for room types, user roles, streak indicators

---

## Images Strategy

**Landing Page Images:**
1. **Hero Image:** Professional networking scene - people genuinely connecting at an event (right side of hero split layout)
2. **Feature Screenshots:** Mockups of app interface showing profile view, QR scanner, and activity feed
3. **Testimonial Avatars:** Circular headshots (w-12 h-12 rounded-full)

**Application Images:**
- User avatars throughout (default placeholder if none provided)
- QR code generation (dynamic)

**Image Treatment:** All photos with subtle rounded corners (rounded-lg to rounded-xl), proper aspect ratios maintained

---

## Iconography

**Library:** Heroicons via CDN (outline style primary, solid for emphasis)

**Usage:**
- Navigation items
- Feature callouts
- Form field prefixes
- Action buttons (plus, share, edit icons)
- Social media links

---

## Responsive Behavior

**Breakpoints:**
- Mobile-first approach (base styles for mobile)
- md: 768px (tablets)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

**Key Adaptations:**
- Hero: Stack vertically on mobile, side-by-side lg+
- Navigation: Hamburger menu on mobile, full nav bar lg+
- Grids: Single column mobile → 2-3 columns tablet → 3-4 columns desktop
- Typography: Scale down one size on mobile (text-4xl → text-3xl)

---

## Interaction Patterns

**Minimal Animations:**
- Hover states: Subtle scale (scale-105) or shadow changes
- Transitions: transition-all duration-200 ease-in-out
- Page transitions: Fade or slide for route changes
- Loading states: Simple spinner or skeleton screens

**No Distracting Motion:** Focus on snappy, purposeful interactions

---

## Accessibility Standards

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support (focus states with ring-2)
- Sufficient contrast ratios
- Touch targets minimum 44x44px for mobile

This design creates a **modern, trustworthy networking platform** that feels both professional and approachable, optimized for the unique in-person event context while scaling for digital connection.