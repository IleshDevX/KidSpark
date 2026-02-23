# Wireframes & UI Specifications
## KidSpark - Complete Interface Design

**Version:** 1.0  
**Date:** February 18, 2026  
**Platform:** Mobile-first (iOS/Android), Web Portal

---

## Table of Contents
1. [Design System Foundation](#1-design-system-foundation)
2. [Information Architecture](#2-information-architecture)
3. [Parent Mobile App](#3-parent-mobile-app)
4. [Child View (Parent Mediated)](#4-child-view-parent-mediated)
5. [Teacher Web Portal](#5-teacher-web-portal)
6. [Admin Portal](#6-admin-portal)
7. [Component Library](#7-component-library)
8. [Responsive Breakpoints](#8-responsive-breakpoints)
9. [Accessibility Patterns](#9-accessibility-patterns)
10. [Animation & Transitions](#10-animation--transitions)

---

## 1. Design System Foundation

### 1.1 Color Palette

**Primary Colors:**
```
Brand Colors:
  - Spark Yellow: #FFC94D (primary brand color)
  - Bright Orange: #FF8A3D (accent, CTAs)
  - Warm Red: #FF6B6B (alerts, celebration)
  
Trust Colors:
  - Deep Blue: #2E5BFF (parent-facing UI, trust)
  - Sky Blue: #6BC5F7 (backgrounds, calm)
  
Growth Colors:
  - Leaf Green: #51CF66 (success, growth indicators)
  - Mint Green: #96F2D7 (subtle backgrounds)
  
Neutral Palette:
  - Charcoal: #2C3E50 (primary text)
  - Slate Gray: #718096 (secondary text)
  - Light Gray: #E2E8F0 (borders, dividers)
  - Soft White: #F7FAFC (backgrounds)
  - Pure White: #FFFFFF (cards, surfaces)
```

**Semantic Colors:**
```
Status Colors:
  - Success: #51CF66
  - Warning: #FFD93D
  - Error: #FF6B6B
  - Info: #6BC5F7
  
Engagement Colors:
  - Streak Gold: #FFD700
  - Badge Bronze: #CD7F32
  - Badge Silver: #C0C0C0
  - Badge Gold: #FFD700
```

### 1.2 Typography

**Font Families:**
```
Primary Font (Body): 'Inter', system-ui, sans-serif
  - Clean, readable, excellent for UI
  - Variable font support (weight 400-700)
  
Child-Friendly Font: 'Nunito', 'Comic Sans MS', cursive
  - Rounded, playful, dyslexia-friendly
  - Used in child-facing views
  
Monospace (Code/Data): 'JetBrains Mono', monospace
  - Used for IDs, technical info in admin
```

**Type Scale:**
```
h1: 32px / 2rem (Mobile), 48px / 3rem (Desktop)
    Weight: 700 (Bold), Line-height: 1.2
    Use: Page titles
    
h2: 24px / 1.5rem (Mobile), 32px / 2rem (Desktop)
    Weight: 600 (Semi-bold), Line-height: 1.3
    Use: Section headers
    
h3: 20px / 1.25rem (Mobile), 24px / 1.5rem (Desktop)
    Weight: 600, Line-height: 1.4
    Use: Card titles, subsections
    
Body Large: 18px / 1.125rem
    Weight: 400, Line-height: 1.6
    Use: Important body text, CTAs
    
Body Regular: 16px / 1rem
    Weight: 400, Line-height: 1.6
    Use: Standard body text
    
Body Small: 14px / 0.875rem
    Weight: 400, Line-height: 1.5
    Use: Supporting text, metadata
    
Caption: 12px / 0.75rem
    Weight: 400, Line-height: 1.4
    Use: Timestamps, helper text
```

### 1.3 Spacing System

**8px Base Grid:**
```
Spacing Scale (Multiples of 8):
  - xs: 4px   (tight spacing, icon padding)
  - sm: 8px   (component internal spacing)
  - md: 16px  (card padding, vertical rhythm)
  - lg: 24px  (section spacing)
  - xl: 32px  (major section breaks)
  - 2xl: 48px (page-level spacing)
  - 3xl: 64px (hero sections)

Layout Containers:
  - Mobile: 16px horizontal padding
  - Tablet: 24px horizontal padding
  - Desktop: 32px horizontal padding (max 1200px width)
```

### 1.4 Elevation & Shadows

**Shadow Levels:**
```
Level 0 (Flat): No shadow
  Use: Background elements

Level 1 (Subtle):
  box-shadow: 0 1px 3px rgba(0,0,0,0.1)
  Use: Cards resting on surface

Level 2 (Raised):
  box-shadow: 0 4px 12px rgba(0,0,0,0.1)
  Use: Interactive cards, hover states

Level 3 (Floating):
  box-shadow: 0 8px 24px rgba(0,0,0,0.12)
  Use: Modals, dropdowns, active states

Level 4 (High):
  box-shadow: 0 16px 48px rgba(0,0,0,0.15)
  Use: Dialogs, tooltips, critical notifications
```

### 1.5 Border Radius

```
Border Radius Scale:
  - none: 0px (data tables, strict layouts)
  - sm: 4px (buttons, inputs)
  - md: 8px (cards, containers)
  - lg: 12px (prominent cards, modals)
  - xl: 16px (hero cards, featured content)
  - full: 9999px (pills, avatars, badges)
```

### 1.6 Iconography

**Icon Library:** Lucide Icons (or Feather Icons)
- Size: 16px, 20px, 24px, 32px, 48px
- Stroke width: 2px
- Style: Outline (consistent with clean aesthetic)

**Custom Icons:**
- Sparky mascot (various states)
- Badge icons (25+ unique designs)
- Subject icons (book, calculator, palette)
- Star/constellation graphics

---

## 2. Information Architecture

### 2.1 Parent App Navigation

```
Bottom Tab Navigation (5 tabs):

[Home] [Homework] [Calendar] [Messages] [More]
  📱      ✏️        📅         💬         ☰

1. Home (Dashboard)
   - Child selector (if multiple)
   - Quick stats cards
   - Recent activity
   - Announcements
   
2. Homework
   - Pending homework list
   - Completed homework archive
   - Filter by subject/date
   
3. Calendar
   - Monthly view with attendance
   - Homework due dates
   - School events
   
4. Messages
   - Conversations with teachers
   - Announcement inbox
   
5. More
   - Profile settings
   - Child profile management
   - AI Helper (if enabled)
   - Settings & Support
```

### 2.2 Teacher Portal Navigation

```
Sidebar Navigation (Desktop):

┌─────────────────┐
│ 🏫 KidSpark     │
├─────────────────┤
│ 📊 Dashboard    │
│ 📝 Homework     │
│ 👥 Students     │
│ 📅 Attendance   │
│ 📢 Announcements│
│ 💬 Messages     │
│ 📈 Reports      │
│ ⚙️  Settings    │
└─────────────────┘

Mobile: Hamburger menu with same structure
```

### 2.3 User Flows

**Flow 1: Parent Onboarding**
```
1. Splash Screen → 2. Welcome Carousel → 3. Sign Up (OTP)
   ↓
4. Parent Profile → 5. Add Child → 6. School Selection
   ↓
7. Enable Features (AI, Notifications) → 8. Home Dashboard
```

**Flow 2: Daily Homework Completion**
```
1. Parent Dashboard → 2. Tap Homework Card → 3. Homework Detail
   ↓
4. Review Details → 5. Upload Work (Optional) → 6. Mark as Done
   ↓
7. Celebrate! (Sparky animation) → 8. Star earned → 9. Return to Dashboard
```

**Flow 3: Teacher Posting Homework**
```
1. Teacher Dashboard → 2. Homework Tab → 3. "+ New Homework" Button
   ↓
4. Fill Form (Title, Description, Subject) → 5. Select Students/Class
   ↓
6. Set Due Date → 7. Attach Resources → 8. Preview & Publish
   ↓
9. Confirmation Toast → 10. Parents notified automatically
```

---

## 3. Parent Mobile App

### 3.1 Splash Screen & Onboarding

**SCREEN: Splash Screen**
```
┌─────────────────────────┐
│                         │
│                         │
│        🌟 ✨            │
│       KIDSPARK          │
│   "Igniting Curiosity,  │
│    Guiding Growth"      │
│                         │
│                         │
│   [Loading indicator]   │
│                         │
└─────────────────────────┘

Duration: 2 seconds (only on cold start)
Animation: Sparky mascot hops in, stars twinkle
```

**SCREEN: Welcome Carousel (3 slides)**
```
Slide 1:
┌─────────────────────────┐
│  [Illustration: Parent  │
│   & child with book]    │
│                         │
│  Stay Connected with    │
│  Your Child's Learning  │
│                         │
│  Get homework updates,  │
│  track attendance, and  │
│  celebrate growth       │
│                         │
│  • • • [Skip] [Next]    │
└─────────────────────────┘

Slide 2:
┌─────────────────────────┐
│  [Illustration: Sparky  │
│   mascot with stars]    │
│                         │
│  Gamified Progress      │
│  (Not Competition!)     │
│                         │
│  Earn badges & stars to │
│  unlock fun surprises   │
│                         │
│  • • • [Skip] [Next]    │
└─────────────────────────┘

Slide 3:
┌─────────────────────────┐
│  [Illustration: Shield  │
│    with checkmark]      │
│                         │
│  Safe & Private         │
│                         │
│  COPPA compliant. You   │
│  control all AI features│
│  & data sharing         │
│                         │
│  • • • [Skip] [Start]   │
└─────────────────────────┘
```

### 3.2 Authentication Screens

**SCREEN: Sign Up / Login**
```
┌─────────────────────────┐
│    [Back]               │
│                         │
│  Welcome to KidSpark 🌟 │
│                         │
│  ┌────────────────────┐ │
│  │ Phone Number       │ │
│  │ +91 |_____________ │ │
│  └────────────────────┘ │
│                         │
│  [ ] I agree to Terms & │
│      Privacy Policy     │
│                         │
│  ┌────────────────────┐ │
│  │  Send OTP Code     │ │ ← Primary button
│  └────────────────────┘ │
│                         │
│  Or sign up with email  │ ← Link
│                         │
│  Already have account?  │
│  Login →                │
└─────────────────────────┘

Validation:
- Phone format check (country code + 10 digits)
- Terms checkbox required
- Accessible labels & error messages
```

**SCREEN: OTP Verification**
```
┌─────────────────────────┐
│    [Back]               │
│                         │
│  Enter OTP              │
│                         │
│  Code sent to           │
│  +91 98765 43210        │
│                         │
│  ┌───┐┌───┐┌───┐┌───┐  │
│  │ 4 ││ 7 ││ 2 ││ _ │  │ ← Individual input boxes
│  └───┘└───┘└───┘└───┘  │
│                         │
│  Didn't receive?        │
│  Resend OTP (30s)       │ ← Countdown timer
│                         │
│  ┌────────────────────┐ │
│  │      Verify        │ │
│  └────────────────────┘ │
│                         │
└─────────────────────────┘

Behavior:
- Auto-advance between input boxes
- Auto-submit when 4 digits entered
- Resend button disabled for 30 seconds
```

### 3.3 Parent Profile Setup

**SCREEN: Parent Profile**
```
┌─────────────────────────┐
│  [Back]      Step 1 of 3│
│                         │
│  Tell us about yourself │
│                         │
│       [Camera icon]     │ ← Avatar upload (optional)
│       Add Photo         │
│                         │
│  ┌────────────────────┐ │
│  │ First Name*        │ │
│  │ Priya______________│ │
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │ Last Name          │ │
│  │ Sharma_____________│ │
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │ Email (Optional)   │ │
│  │ priya@example.com__│ │
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │  Continue          │ │
│  └────────────────────┘ │
└─────────────────────────┘
```

**SCREEN: Add Child Profile**
```
┌─────────────────────────┐
│  [Back]      Step 2 of 3│
│                         │
│  Add your child         │
│                         │
│    [ Avatar selector ]  │ ← 12 child-friendly avatars
│    🦁 🐼 🐰 🦊 🐸 🦄    │
│                         │
│  ┌────────────────────┐ │
│  │ Child's Name*      │ │
│  │ Riya_______________│ │
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │ Date of Birth*     │ │
│  │ 15 / Jan / 2020    │ │ ← Date picker
│  └────────────────────┘ │
│                         │
│  ┌────────────────────┐ │
│  │ School Name        │ │
│  │ Little Flowers___  │ │ ← Search/Autocomplete
│  └────────────────────┘ │
│                         │
│  + Add another child    │ ← Link (max 3)
│                         │
│  ┌────────────────────┐ │
│  │  Continue          │ │
│  └────────────────────┘ │
└─────────────────────────┘
```

### 3.4 Parent Dashboard (Home)

**SCREEN: Parent Home Dashboard**
```
┌─────────────────────────────────────┐
│ 🌟 KidSpark        [Notifications] ● │ ← Header (sticky)
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [🦁 Riya]  ▼                    │ │ ← Child selector (dropdown)
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ ← Scroll container starts
│ │ 🎉 Welcome Back, Riya!          │ │
│ │                                 │ │ CARD: Welcome
│ │ ✨ 3-day streak going!          │ │ (Sparky animated illustration)
│ │ Keep the learning spark alive!  │ │
│ │                                 │ │
│ │      [Meet Sparky →]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✏️ Homework (2 pending)         │ │ CARD: Homework Summary
│ │                                 │ │
│ │ • Math - Page 23                │ │ (Yellow alert dot for pending)
│ │   Due: Tomorrow                 │ │
│ │                                 │ │
│ │ • English - Story Writing       │ │
│ │   Due: Feb 20                   │ │
│ │                                 │ │
│ │      [View All →]               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌───────────┬───────────┬─────────┐ │
│ │  📅 10/12 │ ⭐ 450   │ 🏆 12   │ │ CARD: Quick Stats (3-column)
│ │ Attendance│ Stars    │ Badges  │ │
│ └───────────┴───────────┴─────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📢 Announcements                │ │ CARD: Latest Announcement
│ │                                 │ │
│ │ 🎪 Annual Day on March 5th      │ │ (Truncated preview)
│ │ Mrs. Sharma • 2 days ago        │ │
│ │                                 │ │
│ │      [Read More →]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🌱 Recent Activity              │ │ CARD: Activity Feed
│ │                                 │ │
│ │ ✅ Riya earned "Week Warrior"   │ │
│ │    badge! • 1 hour ago          │ │
│ │                                 │ │
│ │ ⭐ +10 stars for homework       │ │
│ │    completion • 3 hours ago     │ │
│ │                                 │ │
│ │      [See All →]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│          [Scroll indicator]         │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Homework] [Calendar] [More] │ ← Bottom Navigation
└─────────────────────────────────────┘

Interactions:
- Pull-to-refresh on dashboard
- Cards have subtle hover/tap animations
- Child selector opens bottom sheet with all children
- Notification bell shows unread count badge
```

### 3.5 Homework Detail Screen

**SCREEN: Homework Detail View**
```
┌─────────────────────────────────────┐
│ ← Back          Homework    [ ⋮ ]   │ ← Header with menu
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📐 Mathematics                  │ │ Subject badge
│ └─────────────────────────────────┘ │
│                                     │
│ Complete Exercise 2.3               │ ← H1 Title
│                                     │
│ Posted by: Mrs. Sharma              │
│ Assigned: Feb 18 • Due: Feb 20      │ ← Metadata
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← Divider
│                                     │
│ Instructions                        │ ← H3
│ Complete all questions from         │
│ pages 23-25 in your textbook.       │
│ Show all working steps.             │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 📄 Reference Page (PDF)       │   │ ← Attachment card
│ │                         Download│  │
│ └───────────────────────────────┘   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Submission                          │ ← H3
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 📷 Upload Photo of Work       │   │ ← Upload button (dashed border)
│ │                               │   │
│ │      Tap to add photos        │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌────────────────────────────────┐  │
│ │ Notes for Teacher (Optional)  │  │ ← Text area
│ │ ________________________      │  │
│ │ ________________________      │  │
│ └────────────────────────────────┘  │
│                                     │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    ✅ Mark as Completed         │ │ ← Primary CTA (fixed at bottom)
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘

States:
1. Pending (shown above)
2. Done (shows completion timestamp, disables editing)
3. Overdue (red warning banner at top)

If already completed:
┌─────────────────────────────────┐
│ ✅ Completed on Feb 19, 8:30 PM │ ← Success banner
│                                 │
│ [Submitted Photos]              │ ← Gallery view
│ [Your Notes]                    │
│                                 │
│ Teacher Feedback:               │
│ "Great work, Riya! ⭐"          │ ← Card with teacher message
└─────────────────────────────────┘
```

### 3.6 Calendar View

**SCREEN: Calendar (Monthly View)**
```
┌─────────────────────────────────────┐
│ ← February 2026  →   [Today] [List] │ ← Month navigation
├─────────────────────────────────────┤
│                                     │
│  Su  Mo  Tu  We  Th  Fr  Sa         │
│                                     │
│             1✅  2✅  3✅  4         │
│  5✅  6✅  7❌  8✅  9✅ 10✅ 11     │ ← Attendance indicators
│ 12⭐ 13⭐ 14✅ 15✅ 16✅ 17✅ 18●    │    ✅ Present
│ 19   20🎯 21   22   23   24   25    │    ❌ Absent
│ 26   27   28                        │    ⭐ Homework due
│                                     │    🎯 Event
│                                     │    ● Today
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Today's Details (Feb 18)            │ ← Bottom sheet (scrollable)
│                                     │
│ ✅ Present                          │
│                                     │
│ 📝 Homework Due:                    │
│ • Math - Exercise 2.3               │
│ • English - Story Writing           │
│                                     │
│ 📢 Events:                          │
│ • No events today                   │
│                                     │
└─────────────────────────────────────┘

Toggle View:
[List] button switches to agenda view:
┌─────────────────────────────────────┐
│ This Week                           │
│                                     │
│ Monday, Feb 19                      │
│ • Homework due: Math                │
│                                     │
│ Wednesday, Feb 20                   │
│ • Homework due: English             │
│ • Event: Sports Day                 │
│                                     │
│ Friday, Feb 22                      │
│ • Holiday (State Holiday)           │
└─────────────────────────────────────┘
```

### 3.7 AI Helper (Parent-Mediated)

**SCREEN: AI Helper Chat**
```
┌─────────────────────────────────────┐
│ ← AI Helper           [⚙️ Settings] │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────┐         │
│     │  🤖 Sparky's Study  │         │ ← Header card (info)
│     │      Helper         │         │
│     │                     │         │
│     │ I can help explain  │         │
│     │ concepts from Std 1 │         │
│     │ textbooks. Parents, │         │
│     │ use me to help your │         │
│     │ child understand!   │         │
│     └─────────────────────┘         │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ [Parent's message bubble]           │
│ ┌──────────────────────────┐        │
│ │ Can you explain what     │        │ ← User message (right-aligned)
│ │ "carrying over" means    │        │   Blue background
│ │ in addition?             │        │
│ │             3:45 PM      │        │
│ └──────────────────────────┘        │
│                                     │
│ [AI response bubble]                │
│   ┌────────────────────────────┐    │
│   │ 🌟 Great question!        │    │ ← AI message (left-aligned)
│   │                           │    │   Light gray background
│   │ "Carrying over" is when   │    │
│   │ adding two numbers makes  │    │
│   │ a digit greater than 9.   │    │
│   │                           │    │
│   │ Example:                  │    │
│   │   17 + 48                 │    │ ← Formatted math
│   │                           │    │
│   │ 7 + 8 = 15                │    │
│   │ We write 5 and "carry"    │    │
│   │ the 1 to the tens place!  │    │
│   │                           │    │
│   │ 📖 From: Math Textbook    │    │ ← Source citation
│   │     Page 23               │    │
│   │             3:45 PM       │    │
│   └────────────────────────────┘    │
│                                     │
│   [👍 Helpful]  [👎 Not Helpful]   │ ← Feedback buttons
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ┌──────────────────────────────┐ [↑]│ ← Input area (bottom fixed)
│ │ Ask Sparky...                │    │
│ └──────────────────────────────┘    │
└─────────────────────────────────────┘

Safety Features:
- "AI is helping parents, not doing homework" banner
- Clear source attribution on every response
- No response if query is off-topic (with explanation)
- Parent can disable feature in settings

If AI is disabled:
┌─────────────────────────────────┐
│  🔒 AI Helper is Turned Off     │
│                                 │
│  You can enable it in Settings  │
│  to get curriculum-grounded     │
│  explanations.                  │
│                                 │
│  [Go to Settings]               │
└─────────────────────────────────┘
```

### 3.8 Messages & Notifications

**SCREEN: Messages Inbox**
```
┌─────────────────────────────────────┐
│ Messages            [Compose] [⋮]   │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Teacher Avatar]                │ │ ← Conversation preview card
│ │ 👩‍🏫 Mrs. Sharma                 │ │
│ │                                 │ │
│ │ Great progress on homework!     │ │ ← Last message preview
│ │                                 │ │
│ │                      2 hours ago│ │
│ │                               ● │ │ ← Unread indicator
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📢 School Announcements         │ │ ← System message
│ │                                 │ │
│ │ Annual Day invitation sent      │ │
│ │                                 │ │
│ │                      1 day ago  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Teacher Avatar]                │ │
│ │ 👨‍🏫 Mr. Kumar                   │ │
│ │                                 │ │
│ │ Thank you for attending PTM     │ │
│ │                                 │ │
│ │                      3 days ago │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘

Empty state:
┌─────────────────────────────────┐
│          💬                     │
│                                 │
│  No messages yet                │
│                                 │
│  You'll see messages from       │
│  teachers here                  │
└─────────────────────────────────┘
```

**SCREEN: Conversation Thread**
```
┌─────────────────────────────────────┐
│ ← Mrs. Sharma        [Call] [Info]  │ ← Header with actions
├─────────────────────────────────────┤
│                                     │
│   Today                             │ ← Date divider
│                                     │
│   ┌────────────────────────────┐    │
│   │ Hi Mrs. Sharma, I wanted  │    │ ← Parent message
│   │ to discuss Riya's math    │    │
│   │ progress.                 │    │
│   │             3:30 PM       │    │
│   └────────────────────────────┘    │
│                                     │
│ ┌──────────────────────────┐        │
│ │ Hello! Riya is doing     │        │ ← Teacher reply
│ │ wonderfully. She's very  │        │
│ │ engaged in class.        │        │
│ │             3:35 PM      │        │
│ └──────────────────────────┘        │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ ┌──────────────────────────────┐ [↑]│ ← Message input
│ │ Type a message...            │    │
│ └──────────────────────────────┘    │
│  [📎] [📷]                          │ ← Attachment options
└─────────────────────────────────────┘
```

---

## 4. Child View (Parent Mediated)

### 4.1 Child Dashboard

**SCREEN: Child Dashboard (Parent supervises)**
```
┌─────────────────────────────────────┐
│  🦁 Hi Riya!           [◀ Parent]   │ ← Exit to parent view
├─────────────────────────────────────┤
│                                     │
│    ┌───────────────────────────┐    │
│    │      🌟✨                 │    │ ← Sparky Welcome Card
│    │                           │    │   (Large, playful illustration)
│    │   Sparky is so proud      │    │
│    │   of you! Let's see       │    │
│    │   what you earned!        │    │
│    │                           │    │
│    └───────────────────────────┘    │
│                                     │
│ ┌───────────────────────────────┐   │
│ │  ⭐ Your Stars                │   │ ← Star Count Card
│ │                               │   │   (Big, centered number)
│ │         450 ⭐                │   │
│ │                               │   │
│ │  Level 3: Growing Learner     │   │ ← Progress bar to next level
│ │  ▓▓▓▓▓▓▓░░░ (70%)            │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │  🏆 Your Badges (12)          │   │ ← Badge Showcase
│ │                               │   │   (Horizontal scroll)
│ │  [🔥][📚][⭐][🎯][💯][✨]    │   │
│ │                               │   │
│ │       [See All →]             │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │  🔥 Streak Superstar!         │   │ ← Streak Card
│ │                               │   │   (Fire animation)
│ │      3 Days in a row! 🎉      │   │
│ │                               │   │
│ │  Come back tomorrow to keep   │   │
│ │  your streak going!           │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │  🌱 Your Garden               │   │ ← Learning Garden Visual
│ │                               │   │   (Gamification feature)
│ │  [Illustration: small plants, │   │
│ │   flowers growing]            │   │
│ │                               │   │
│ │  Do activities to help your   │   │
│ │  garden grow!                 │   │
│ └───────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

Design Notes:
- Large touch targets (minimum 56x56px)
- Rounded corners everywhere (16px radius)
- Nunito font (child-friendly)
- Bright, saturated colors
- Lots of visual feedback (animations, sounds)
- No text-heavy content
```

### 4.2 Badge Collection

**SCREEN: Badges Gallery**
```
┌─────────────────────────────────────┐
│ ← Your Badges       🏆 12 Earned    │
├─────────────────────────────────────┤
│                                     │
│ [All] [Consistency] [Activity]      │ ← Filter tabs
│                                     │
│ ┌──────┐  ┌──────┐  ┌──────┐       │
│ │  🔥  │  │  📚  │  │  ⭐  │       │ ← Badge cards (grid)
│ │      │  │      │  │      │       │
│ │Week  │  │Reading│  │Star  │       │
│ │Warrior│ │Champ │  │Collector│     │
│ └──────┘  └──────┘  └──────┘       │
│                                     │
│ ┌──────┐  ┌──────┐  ┌──────┐       │
│ │  🎯  │  │  💯  │  │  ✨  │       │
│ │      │  │      │  │      │       │
│ │Homework││Perfect│ │Daily │       │
│ │ Hero  │ │ Score│  │ Spark│       │
│ └──────┘  └──────┘  └──────┘       │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Not Earned Yet (Locked)             │
│                                     │
│ ┌──────┐  ┌──────┐  ┌──────┐       │
│ │  🔒  │  │  🔒  │  │  🔒  │       │ ← Grayed out, locked
│ │      │  │      │  │      │       │
│ │Month │  │Early │  │Super │       │
│ │Master│  │ Bird │  │Streak│       │
│ │ ???  │  │ ???  │  │ ???  │       │
│ └──────┘  └──────┘  └──────┘       │
│                                     │
└─────────────────────────────────────┘

Interaction:
- Tap badge → Opens modal with:
  * Badge name & description
  * How it was earned (date/context)
  * Star reward received
  * Share button (screenshot for family)
```

---

## 5. Teacher Web Portal

### 5.1 Teacher Dashboard

**SCREEN: Teacher Dashboard (Desktop)**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 🏫 Teacher Dashboard         [Profile ▼]    │
│ KidSpark  ├─────────────────────────────────────────────┤
│           │                                             │
│ ──────    │ Good morning, Mrs. Sharma! 👩‍🏫              │
│           │                                             │
│ 📊 Dash   │ ┌──────────┬──────────┬──────────┬────────┐│
│ 📝 Home   │ │ 👥 28    │ 📝 12    │ ✅ 85%   │ 💬 3   ││ ← Quick stats
│ 👥 Stud   │ │ Students │ Pending  │ Homework │ Unread ││   (4 cards)
│ 📅 Atten  │ │          │ Reviews  │ Rate     │Messages││
│ 📢 Anno   │ └──────────┴──────────┴──────────┴────────┘│
│ 💬 Mess   │                                             │
│ 📈 Repo   │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ ⚙️  Sett   │                                             │
│           │ Recent Submissions (12 new)                 │
│           │                                             │
│           │ Student     Homework          Submitted     │
│           │ ──────────────────────────────────────────  │
│           │ 🦁 Riya     Math Ex. 2.3     2 hours ago  →││ ← Table row
│           │ 🐼 Aarav    English Story    5 hours ago  →││   (clickable)
│           │ 🦊 Neha     Math Ex. 2.3     1 day ago    →││
│           │                                             │
│           │ [View All Submissions →]                    │
│           │                                             │
│           │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│           │                                             │
│           │ Upcoming Deadlines                          │
│           │                                             │
│           │ • English Story Writing - Due Tomorrow      │
│           │   (15 / 28 submitted)                       │
│           │                                             │
│           │ • Math Exercise 2.4 - Due Feb 22            │
│           │   (Not yet assigned)                        │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Sidebar: Fixed, collapsible on mobile
Content Area: Scrollable, responsive grid
```

### 5.2 Homework Management

**SCREEN: Homework List (Teacher)**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 📝 Homework Management                      │
│ KidSpark  ├─────────────────────────────────────────────┤
│           │                                             │
│ Sidebar   │ [+ New Homework]  [Templates] [Archive]    │ ← Action buttons
│           │                                             │
│           │ [All] [Pending] [Completed] [Overdue]      │ ← Filter tabs
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │ 📐 Math - Exercise 2.3                  ││ ← Homework card
│           │ │ Std 1-A • Assigned: Feb 18 • Due: Feb 20││
│           │ │                                         ││
│           │ │ Progress: 18 / 28 submitted (64%)       ││ ← Progress bar
│           │ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 64%                  ││
│           │ │                                         ││
│           │ │ [Review Submissions]  [Edit]  [Delete]  ││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │ 📖 English - Story Writing              ││
│           │ │ Std 1-A, B • Assigned: Feb 17 • Due: Feb││
│           │ │                                         ││
│           │ │ Progress: 32 / 56 submitted (57%)       ││
│           │ │ ▓▓▓▓▓▓▓▓▓▓░░░░░░ 57% • 2 overdue       ││
│           │ │                                         ││
│           │ │ [Review Submissions]  [Remind Students] ││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

**SCREEN: New Homework Form**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ ← Back to Homework    Create New Homework   │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ Basic Details                               │
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │ Title*                                  ││
│           │ │ Complete Exercise 2.3__________________││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │ Subject*                                ││
│           │ │ [Math ▼]                                ││ ← Dropdown
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │ Description / Instructions*             ││
│           │ │ Complete all questions from pages 23-25 ││ ← Text area
│           │ │ in your textbook. Show all working___   ││   (Rich text editor)
│           │ │                                         ││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ Assignment Details                          │
│           │                                             │
│           │ ┌──────────────┐  ┌──────────────┐         │
│           │ │ Due Date*    │  │ Estimated    │         │
│           │ │ Feb 20, 2026 │  │ Time         │         │
│           │ │ [Calendar]   │  │ 30 mins [▼] │         │
│           │ └──────────────┘  └──────────────┘         │
│           │                                             │
│           │ Assign To                                   │
│           │                                             │
│           │ ( ) All my students                         │ ← Radio buttons
│           │ ( ) Specific class: [Std 1-A ▼]            │
│           │ ( ) Specific students: [Select...]          │
│           │                                             │
│           │ Attachments                                 │
│           │                                             │
│           │ ┌──────────────────────────────┐            │
│           │ │ 📄 Reference_Page_23.pdf     │ [✖]       │ ← Uploaded files
│           │ └──────────────────────────────┘            │
│           │ [+ Upload File]                             │
│           │                                             │
│           │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│           │                                             │
│           │        [Cancel]  [Save Draft]  [Publish]   │ ← Footer actions
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Validation:
- Title, subject, description, due date are required
- Due date must be future date
- At least one student/class must be selected
- Save draft allows incomplete form
```

**SCREEN: Review Submissions**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ ← Back   Math - Exercise 2.3   Submissions  │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ [All] [Pending] [Done] [Overdue]            │ ← Filter tabs
│           │                                             │
│           │ Student              Status      Actions    │
│           │ ──────────────────────────────────────────  │
│           │                                             │
│           │ 🦁 Riya Sharma       ✅ Done    [View]     ││ ← Row (done)
│           │   Submitted: Feb 19, 8:30 PM   ⭐ Feedback   ││   Badge: green
│           │                                             │
│           │ 🐼 Aarav Patel       ✅ Done    [View]     ││
│           │   Submitted: Feb 19, 10:15 AM  ⭐ Feedback  ││
│           │                                             │
│           │ 🦊 Neha Gupta        ⏳ Pending [Remind]  ││ ← Row (pending)
│           │   Due: Tomorrow                             ││   Badge: yellow
│           │                                             │
│           │ 🐸 Arjun Singh       ⚠️ Overdue [Remind]  ││ ← Row (overdue)
│           │   Due: Yesterday                            ││   Badge: red
│           │                                             │
│           │ ...                                         │
│           │                                             │
│           │ [Export to Excel] [Send Reminder to All]   │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

**SCREEN: Give Feedback (Modal)**
```
┌─────────────────────────────────────────────────────────┐
│ Feedback for Riya Sharma                          [✖]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Homework: Math - Exercise 2.3                           │
│ Submitted: Feb 19, 2026 at 8:30 PM                      │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│ Submitted Photos:                                       │
│                                                         │
│ ┌────────┐ ┌────────┐ ┌────────┐                       │
│ │ [IMG1] │ │ [IMG2] │ │ [IMG3] │                       │ ← Image gallery
│ │        │ │        │ │        │                       │   (click to enlarge)
│ └────────┘ └────────┘ └────────┘                       │
│                                                         │
│ Parent's Notes:                                         │
│ "Riya worked hard on this!"                             │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│ Your Feedback (visible to parents)                      │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Great work, Riya! I can see you followed all the   ││ ← Text area
│ │ steps carefully. Keep it up! ⭐____________________││   (with emoji picker)
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Quick Phrases:                                          │
│ [Excellent work!] [Good effort!] [Keep practicing!]    │ ← Pre-made phrases
│ [Well done!] [Needs improvement]                        │   (click to insert)
│                                                         │
│ Add Emojis:                                             │
│ [⭐] [🎉] [👏] [💯] [🌟] [More...]                      │
│                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                         │
│           [Cancel]            [Submit Feedback]         │
│                                                         │
└─────────────────────────────────────────────────────────┘

Features:
- Quick phrase library (customizable in settings)
- Emoji support for warmth
- Auto-saves draft
- Sends notification to parent when submitted
```

### 5.3 Attendance Marking

**SCREEN: Attendance Sheet**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 📅 Attendance         [Date: Feb 18, 2026]  │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ Class: [Std 1-A ▼]     [◀ Feb 17 | Feb 19 ▶]│ ← Navigation
│           │                                             │
│           │ [Mark All Present] [Save] [Lock Sheet]     │ ← Bulk actions
│           │                                             │
│           │ Student           P   A   L   H   Notes     │ ← Legend:
│           │ ────────────────────────────────────────     │   P=Present
│           │                                             │   A=Absent
│           │ 🦁 Riya Sharma    (•) ( ) ( ) ( ) _____    ││   L=Leave
│           │ 🐼 Aarav Patel    (•) ( ) ( ) ( ) _____    ││   H=Holiday
│           │ 🦊 Neha Gupta     ( ) (•) ( ) ( ) Sick     ││
│           │ 🐸 Arjun Singh    (•) ( ) ( ) ( ) _____    ││
│           │ 🐰 Diya Verma     (•) ( ) ( ) ( ) _____    ││
│           │ ...                                         │
│           │                                             │
│           │ Summary: 24 Present | 2 Absent | 2 Leave    │
│           │                                             │
│           │ ⚠️ Reminder: Attendance will be locked after │
│           │ 7 days and cannot be edited.                │
│           │                                             │
│           │                    [Save Attendance]        │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Features:
- Radio button selection (keyboard navigation supported)
- Quick "Mark All Present" for efficiency
- Notes field for context (illness, etc.)
- Lock mechanism after 7 days (school policy)
- Visual indicator if already locked
```

### 5.4 Student Progress View

**SCREEN: Individual Student Profile (Teacher View)**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ ← Back to Students    Riya Sharma           │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ ┌─────────────────────────────────────────┐│
│           │ │  🦁                                     ││ ← Student header
│           │ │  Riya Sharma                            ││
│           │ │  Std 1-A • Age: 6 years                 ││
│           │ │                                         ││
│           │ │  Parent: Priya Sharma                   ││
│           │ │  Phone: +91 98765 43210  [Message]      ││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ [Overview] [Homework] [Attendance] [Reports]│ ← Tabs
│           │                                             │
│           │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│           │                                             │
│           │ Engagement Snapshot (This Month)            │
│           │                                             │
│           │ ┌──────────┬──────────┬──────────┐         │
│           │ │ 📝 10/12 │ 📅 18/20 │ ⭐ 450   │         │ ← Quick stats
│           │ │ Homework │ Attendance│ Stars   │         │
│           │ │ Complete │ Present   │ Earned  │         │
│           │ └──────────┴──────────┴──────────┘         │
│           │                                             │
│           │ Homework Performance (Last 10)              │
│           │                                             │
│           │ Subject              Completion  Timeliness │
│           │ ──────────────────────────────────────────  │
│           │ Math                 ✅ Done     On time   │
│           │ English              ✅ Done     On time   │
│           │ Math                 ✅ Done     1 day late│
│           │ ...                                         │
│           │                                             │
│           │ Recent Activity                             │
│           │                                             │
│           │ • Earned "Week Warrior" badge (3 days ago)  │
│           │ • Completed Math homework (1 day ago)       │
│           │ • Login streak: 5 days                      │
│           │                                             │
│           │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│           │                                             │
│           │ [Create Progress Report]  [Message Parent]  │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Tabs:
- Overview: Summary stats and activity
- Homework: Full homework history
- Attendance: Monthly calendar view
- Reports: Access to qualitative progress reports
```

---

## 6. Admin Portal

### 6.1 Admin Dashboard

**SCREEN: Admin Dashboard**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 🔧 Admin Dashboard            [Profile ▼]   │
│ KidSpark  ├─────────────────────────────────────────────┤
│   Admin   │                                             │
│           │ ┌────────┬────────┬────────┬────────┐       │
│ ──────    │ │ 🏫 5   │ 👨‍🏫 28  │ 👥 450 │ 👨‍👩‍👧 380│       │ ← Platform stats
│           │ │Schools │Teachers│Studens │Parents │       │
│ 📊 Dash   │ └────────┴────────┴────────┴────────┘       │
│ 🏫 School │                                             │
│ 👨‍🏫 Teach │ System Health                               │
│ 📈 Analy  │                                             │
│ 🤖 AI Log │ ┌─────────────────────────────────────────┐│
│ ⚙️  Setti │ │ API Latency: 342ms (Good)               ││ ← System metrics
│           │ │ Database: 72% capacity                  ││
│           │ │ AI Queries: 1,247 today                 ││
│           │ │ Cache Hit Rate: 48%                     ││
│           │ └─────────────────────────────────────────┘│
│           │                                             │
│           │ Recent Activity                             │
│           │                                             │
│           │ • New school registered: "Little Flowers"   │
│           │ • 5 teachers added to "ABC School"          │
│           │ • AI safety flag: 2 queries reviewed        │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

### 6.2 School Management

**SCREEN: Schools List**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 🏫 Schools                [+ Add School]    │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ [Search schools...]           [Filters ▼]  │
│           │                                             │
│           │ School Name      Teachers  Students  Status │
│           │ ──────────────────────────────────────────  │
│           │                                             │
│           │ Little Flowers      8       120      Active││ ← Row (clickable)
│           │ ABC Public          12      250      Active││
│           │ Green Valley        5       80       Active││
│           │ ...                                         │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Click → Opens school detail page with:
- School info (name, code, board, contact)
- Teacher list
- Student count
- Subscription details
- Settings override
- Activity log
```

### 6.3 AI Query Logs

**SCREEN: AI Query Monitoring**
```
┌───────────┬─────────────────────────────────────────────┐
│           │ 🤖 AI Query Logs        [Export] [Filters]  │
│           ├─────────────────────────────────────────────┤
│           │                                             │
│           │ [All] [Flagged] [Blocked] [Helpful]         │ ← Filter tabs
│           │                                             │
│           │ Time      User        Query          Safety │
│           │ ──────────────────────────────────────────  │
│           │                                             │
│           │ 2:30 PM  Parent_124  "explain carrying"  ✅││ ← Row
│           │                      over in addition"      │
│           │           Response: High confidence (347ms) │
│           │           Feedback: Helpful ⭐              │
│           │                                      [View] │
│           │                                             │
│           │ 2:15 PM  Parent_089  "how to solve..."   ✅││
│           │           Response: Medium confidence       │
│           │           Feedback: Not helpful 👎          │
│           │                                      [View] │
│           │                                             │
│           │ 1:45 PM  Parent_256  "tell me the answer"⚠️││ ← Flagged
│           │           Response: REFUSED (off-limits)    │
│           │           Safety: Post-check flagged        │
│           │                                    [Review] │
│           │                                             │
│           │ ...                                         │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘

Features:
- Real-time monitoring
- Safety flag indicators
- Performance metrics (latency)
- User feedback tracking
- Drill-down to full query details
- Export for audit/analysis
```

---

## 7. Component Library

### 7.1 Buttons

**Primary Button:**
```
┌──────────────────────┐
│  Continue            │  ← Solid fill (#FF8A3D), white text
└──────────────────────┘     Border radius: 8px, Height: 48px
                             Font: 16px, Semi-bold

States:
- Default: Solid color
- Hover: 10% darker
- Active: 15% darker, slight scale down (98%)
- Disabled: 40% opacity, no cursor
```

**Secondary Button:**
```
┌──────────────────────┐
│  Cancel              │  ← Outline (#718096), gray text
└──────────────────────┘     Border: 2px, Transparent bg

States:
- Hover: Light gray background
- Active: Darker gray background
```

**Ghost Button:**
```
  See All →                 ← No border, text only with icon
                               Color: #2E5BFF (link color)
States:
- Hover: Underline
- Active: Darker blue
```

### 7.2 Cards

**Standard Card:**
```
┌─────────────────────────┐
│                         │  ← White background
│  [Card Title]           │     Border radius: 12px
│                         │     Shadow: Level 1
│  [Content area]         │     Padding: 16px
│                         │
│  [Optional action]      │
└─────────────────────────┘

States:
- Default: Shadow Level 1
- Hover (if clickable): Shadow Level 2, slight lift
- Active: Shadow Level 1, scale 98%
```

**Hero Card (Child View):**
```
┌─────────────────────────┐
│                         │  ← Gradient background
│  [Large illustration]   │     Border radius: 16px
│                         │     Shadow: Level 2
│  [Large centered text]  │     Padding: 24px
│                         │
└─────────────────────────┘
```

### 7.3 Form Inputs

**Text Input:**
```
┌────────────────────────┐
│ First Name*            │  ← Label (12px, gray, semi-bold)
│ ┌────────────────────┐ │
│ │ Priya_____________ │ │  ← Input field
│ └────────────────────┘ │     Border: 1px solid #E2E8F0
│ 👤 Helper text         │     Border radius: 8px
└────────────────────────┘     Height: 48px
                               Padding: 12px 16px

States:
- Default: Light gray border
- Focus: Blue border (#2E5BFF), shadow glow
- Error: Red border (#FF6B6B), error message below
- Disabled: Gray background, no cursor
```

**Dropdown/Select:**
```
┌────────────────────────┐
│ Subject*               │
│ ┌────────────────────┐ │
│ │ Math            ▼  │ │  ← Select dropdown
│ └────────────────────┘ │     Chevron icon on right
└────────────────────────┘     Same styling as text input

Opens dropdown menu:
┌────────────────────┐
│ Math            ✓  │  ← Selected (checkmark)
│ English            │
│ General            │
└────────────────────┘
```

**Checkbox:**
```
☑ I agree to Terms & Privacy Policy

States:
- Unchecked: [ ] Empty square
- Checked: [✓] Filled square (blue)
- Disabled: Gray color, no cursor
- Minimum tap target: 48x48px (accessibility)
```

**Radio Button:**
```
(•) Present    ( ) Absent    ( ) Leave

States:
- Selected: (•) Filled circle (blue)
- Unselected: ( ) Empty circle
- Minimum tap target: 48x48px
```

### 7.4 Alerts & Toasts

**Toast Notification:**
```
┌─────────────────────────────────┐
│ ✅ Homework marked as done!     │  ← Appears top center or bottom
└─────────────────────────────────┘     Auto-dismisses in 3s
                                        Slide-in animation

Variants:
- Success: Green background, checkmark icon
- Warning: Yellow background, warning icon
- Error: Red background, X icon
- Info: Blue background, info icon
```

**Banner Alert:**
```
┌───────────────────────────────────────┐
│ ⚠️ Homework overdue! Submit today.    │ ← Full-width bar at top
└───────────────────────────────────────┘     Persistent until dismissed

Colors match toast variants
```

### 7.5 Loading States

**Spinner:**
```
    ⏳  Loading...

Circular spinner (24px diameter)
Color: Brand color (#FF8A3D)
Animation: Rotate 360° in 1 second
```

**Skeleton Loading:**
```
┌─────────────────────────┐
│ ▒▒▒▒▒▒▒▒                │  ← Gray animated shimmer
│                         │     Placeholder for card content
│ ▒▒▒▒▒▒▒▒▒▒▒▒            │     Fades in when content loads
│ ▒▒▒▒                    │
└─────────────────────────┘
```

### 7.6 Avatars

**Parent Avatar:**
```
┌────┐
│ PS │  ← Initials in circle (48x48px)
└────┘     Background: Deterministic color from name
           Text: White, centered
```

**Child Avatar:**
```
  🦁    ← Icon avatar (custom illustrations)
        56x56px circle
        12 options (lion, panda, fox, etc.)
```

**Sparky Mascot:**
```
Multiple states:
- Default: Happy, waving
- Celebrating: Confetti, stars
- Encouraging: Thumbs up, smile
- Sleeping: Zzz (for inactive days)

Animated SVG/Lottie files
```

---

## 8. Responsive Breakpoints

**Breakpoint System:**
```
Mobile (xs):    320px - 479px   (1 column layout)
Mobile (sm):    480px - 767px   (1 column, larger touch targets)
Tablet (md):    768px - 1023px  (2 column layout, sidebar collapses)
Desktop (lg):   1024px - 1439px (Fixed sidebar, 2-3 columns)
Desktop (xl):   1440px+         (Max-width container: 1200px)
```

**Layout Patterns:**

**Mobile:**
```
┌─────────────┐
│   Header    │  ← Sticky header (56px)
├─────────────┤
│             │
│   Content   │  ← Single column, scrollable
│   (Stack)   │
│             │
├─────────────┤
│  Bottom Nav │  ← Fixed bottom (64px)
└─────────────┘
```

**Tablet:**
```
┌───────┬──────────────┐
│ Side  │   Header     │  ← Header spans content area
│ bar   ├──────────────┤
│ (Nav) │              │
│       │   Content    │  ← 2-column grid or single
│       │   (2-col)    │
│       │              │
└───────┴──────────────┘
```

**Desktop:**
```
┌──────┬────────────────────┐
│ Side │     Header         │  ← Full navigation visible
│ bar  ├────────────────────┤
│(240px)│                    │
│      │   Content Grid     │  ← 2-3 column layout
│      │   (Multi-column)   │
│      │                    │
└──────┴────────────────────┘
```

---

## 9. Accessibility Patterns

### 9.1 WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1
- Interactive elements: 3:1 against adjacent colors

**Test Examples:**
```
✅ PASS: Charcoal (#2C3E50) on White (#FFFFFF) = 12.6:1
✅ PASS: Orange (#FF8A3D) on White = 3.2:1 (large text only)
❌ FAIL: Light Gray (#E2E8F0) on White = 1.3:1 (insufficient)
```

**Touch Targets:**
- Minimum size: 48x48px (Apple), 44x44dp (Google)
- Spacing: 8px minimum between targets
- Exception: Inline text links (use underline + color)

**Keyboard Navigation:**
```
Tab Order:
1. Header actions
2. Main content (cards, forms)
3. Bottom navigation

Focus Indicators:
- Visible outline: 2px solid #2E5BFF
- Offset: 2px
- Border radius matches element

Skip Links:
[Skip to main content] → Hidden, appears on Tab focus
```

**Screen Reader Support:**

```html
<!-- Semantic HTML -->
<nav aria-label="Primary navigation">...</nav>
<main>...</main>
<aside aria-label="Quick stats">...</aside>

<!-- ARIA Labels -->
<button aria-label="Mark homework as done">✅</button>
<div role="status" aria-live="polite">Homework saved!</div>

<!-- Alt Text -->
<img src="sparky.svg" alt="Sparky mascot celebrating with stars" />
```

**Inclusive Features:**
- Read-aloud mode (text-to-speech)
- High contrast mode toggle
- Font size adjustment (Small/Medium/Large)
- Reduced motion preference (respects `prefers-reduced-motion`)
- Dyslexia-friendly font option (OpenDyslexic)

---

## 10. Animation & Transitions

### 10.1 Micro-interactions

**Button Press:**
```
- Duration: 150ms
- Easing: ease-out
- Transform: scale(0.98)
- Effect: Slight shrink on tap
```

**Card Hover:**
```
- Duration: 200ms
- Easing: ease-in-out
- Shadow: Level 1 → Level 2
- Transform: translateY(-2px)
```

**Page Transitions:**
```
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)
- Effect: Slide in from right (mobile), fade (desktop)
```

### 10.2 Celebratory Animations

**Homework Completion:**
```
1. Confetti burst (2s, Lottie animation)
2. "+10 stars" badge flies to star counter (1s)
3. Sparky hops with joy (1.5s loop, once)
4. Success toast appears (3s auto-dismiss)
```

**Badge Earned:**
```
1. Modal appears with scale-up animation (300ms)
2. Badge spins and grows (1s)
3. Sparkle particles around badge (2s)
4. "Share with family" CTA fades in (500ms delay)
```

**Streak Milestone:**
```
1. Fire emoji grows and pulses (1s)
2. Flame trail animation (2s, particle effect)
3. "3 Days!" text fades in with bounce (800ms)
```

### 10.3 Loading Animations

**Pull-to-Refresh:**
```
1. User pulls down (custom scroller)
2. Sparky icon rotates (spinner)
3. Content refreshes
4. Sparky checks content, then disappears
```

**Skeleton Loading:**
```
- Shimmer effect: Left-to-right gradient sweep
- Duration: 1.5s infinite loop
- Colors: #E2E8F0 → #F7FAFC → #E2E8F0
```

---

## Appendix: Figma Design Handoff

**Design Files Structure:**
```
KidSpark_Designs/
├── 01_Design_System/
│   ├── Colors
│   ├── Typography
│   ├── Components
│   └── Icons
├── 02_Parent_App/
│   ├── Onboarding
│   ├── Dashboard
│   ├── Homework
│   ├── Calendar
│   └── Settings
├── 03_Child_View/
│   ├── Dashboard
│   ├── Badges
│   └── Celebration_Screens
├── 04_Teacher_Portal/
│   ├── Dashboard
│   ├── Homework
│   ├── Attendance
│   └── Student_Profiles
└── 05_Admin_Portal/
    ├── Dashboard
    ├── School_Management
    └── AI_Logs
```

**Developer Handoff Notes:**
- All spacing uses 8px grid
- Export assets as @1x, @2x, @3x (iOS) and ldpi/mdpi/hdpi/xhdpi (Android)
- SVG for icons (scalable, small file size)
- Lottie JSON for complex animations
- Design tokens exported as JSON (colors, typography, spacing)

---

**Document Status:** Wireframes & UI Specifications v1.0  
**Last Updated:** February 18, 2026  
**Design Tool:** Figma  
**UI Framework Target:** React Native / Flutter  
**Maintained by:** Product Design Team