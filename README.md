# KidSpark – Std 1 Digital Learning Experience

**Developed by Technetics IT Services**

**Tagline:** *"Igniting Curiosity, Guiding Growth."*

---

## 📘 Project Overview

KidSpark is a parent-assisted, gamified, foundation-level learning companion designed for Standard 1 students (ages 5–7). It prioritises child safety, parental control, and ethical AI usage while creating an engaging, non-competitive learning environment.

### Core Principles
- **Parent-Controlled**: All access through parent login with child profiles
- **Non-Competitive**: No rankings, no scores, no leaderboards
- **AI as Decision-Support Only**: RAG-based explanations from approved curriculum
- **Safety-First**: Complete audit-level logging, restricted permissions, PIN-protected parent portal
- **Engagement-Focused**: Gamification without comparison

---

## 🚀 Running the Application

KidSpark is a **pure HTML/CSS/JavaScript** application — no server or installation needed!

### Quick Start
1. Open `index.html` in any modern web browser (Chrome, Firefox, Edge)
2. Register as a new user (provide email, password, PIN, child name, time limit)
3. Start learning!

### File Structure
```
KidSpark/
├── index.html              ← Main application entry point
├── css/
│   └── styles.css          ← Complete design system (rem-only, KidSpark palette)
├── js/
│   ├── rag-data.js         ← RAG knowledge base (English + Maths Q&A chunks)
│   ├── crypto.js           ← XOR encryption utilities for local storage
│   ├── storage.js          ← localStorage manager (encrypted JSON)
│   ├── timer.js            ← Daily time limit countdown + lives recharge
│   ├── profile.js          ← EXP, levels, stars, lives management
│   ├── chatbot.js          ← AI chatbot with typing animation
│   ├── image-gen.js        ← Animal image generator (SVG art)
│   ├── games.js            ← 8 mini-games engine
│   ├── parents.js          ← Parents portal (PIN-gated)
│   └── app.js              ← Main app controller / navigation
└── SUBJECT PDF/
    ├── English Question Book.md    ← Source content for English RAG
    ├── Mathematics Question Book.md ← Source content for Maths RAG
    └── [PDF files]
```

---

## 🎨 Brand Identity & Colour Palette

| Variable      | Hex Code  | Usage                     |
|---------------|-----------|---------------------------|
| --c-dark      | `#3A3C42` | Primary text, sidebar bg  |
| --c-green     | `#9CCD62` | Accent, buttons, badges   |
| --c-cream     | `#F7F8E2` | App background            |
| --c-sand      | `#DFDECA` | Cards, panels             |
| --c-linen     | `#E8E3CC` | Secondary backgrounds     |
| --c-rust      | `#9C4A29` | Headings, highlights      |
| --c-maroon    | `#452B30` | Dark accents              |
| --c-plum      | `#74404C` | Body text variation       |
| --c-peach     | `#F3ECD8` | Tip boxes, rhyme cards    |
| --c-sage      | `#C7C79E` | Muted decorative          |
| --c-red       | `#D51D48` | Error states, danger      |
| --c-gold      | `#DABE85` | Warning, tip accents      |
| --c-blush     | `#FAEDE7` | Light backgrounds         |
| --c-apricot   | `#F7D3C3` | Gradient accents          |

All spacing uses **rem units only** (no px values).

---

## 📂 Application Modules

### 1. Registration & Login
- Collect: email, password, parent PIN (4 digits), child name, daily time limit
- Data saved encrypted in `localStorage` (XOR cipher + btoa)
- Auto-login via localStorage on revisit
- JSON structure: `{ email, passwordHash, pinHash, childName, timeLimit, stats, currentSection }`

### 2. Page Persistence
- Current section saved on every navigation
- Restored on page refresh
- Stats (EXP, lives, stars, login days, progress) persist across sessions

### 3. Sidebar Navigation
| Section        | Description                                |
|----------------|--------------------------------------------|
| 🏠 Home        | Dashboard with all feature cards + stats   |
| 🤖 AI Chatbot  | RAG-powered Q&A from subject books         |
| 🎨 Image Magic | Animal names → animated SVG illustrations  |
| 🎮 Games       | 8 educational mini-games                   |
| 👤 Profile     | EXP, level, stars, lives, progress bar     |
| 👨‍👩‍👧 Parents    | PIN-gated portal with stats + settings     |

### 4. AI Chatbot (RAG)
- Subject PDFs chunked into 50+ Q&A blocks
- English: 10 units (Body, Family, Animals, Food, Seasons, Letters, Numbers, Rhymes, Habits, Play)
- Maths: 13 chapters (Position, Shapes, Numbers 1-99, Addition, Subtraction, Measurement, Patterns, Time, Groups, Money, Data)
- Click any question → direct answer with typing animation + read-aloud

### 5. Image Generator
- 16 animals available (Lion, Elephant, Giraffe, Tiger, Zebra, Parrot, etc.)
- Click animal → 1.2s generation effect → animated SVG illustration + fun fact
- Lion and Elephant have custom detailed SVG art

### 6. Games (8 Mini-Games)
| Game             | Topic                    | Adaptive |
|------------------|--------------------------|----------|
| 🔤 ABC Adventure | Alphabet sequence        | ✅        |
| 🔢 Number Fun    | Number counting          | ✅        |
| ➕ Addition Quest | 1-digit addition         | ✅        |
| ➖ Subtraction Star | 1-digit subtraction   | ✅        |
| 🔷 Shape Safari  | Shapes & properties      | ✅        |
| 🧒 Body Parts    | Body part functions      | ✅        |
| 🧩 Word Puzzle   | 3-letter word unscramble | ✅        |
| 🎵 Sing & Rhyme  | Nursery rhymes + TTS     | ✅        |

- +15 EXP per completed game
- -1 life per wrong answer
- Questions scale with EXP level (adaptive difficulty)

### 7. Profile System
- 7 Levels: Little Spark → Brain Hero → Knowledge King
- 20 max lives, -1 per wrong answer, +1 auto-recharge per minute
- Login streak tracking
- EXP progress bar with level indicators

### 8. Parents Portal (PIN-Protected)
- 4-digit PIN required every time (cannot bypass)
- View child stats: EXP, level, stars, days, games, time used
- Change PIN and daily time limit
- Download progress report (txt file)
- Lock portal button

### 9. Daily Time Limit
- Countdown displayed in sidebar
- Red warning when < 5 minutes remain
- Game section locked + overlay shown when time expires
- Timer resets each day; usage saved every 30 seconds

---

## 📂 PDF Folder Usage

The `/SUBJECT PDF/` folder contains:
- `English Question Book.md` — 10 units, 200+ questions
- `Mathematics Question Book.md` — 13 chapters, 300+ questions

These are **pre-chunked and embedded** in `js/rag-data.js` as the RAG knowledge base. The system uses keyword-based retrieval to find the best matching answer chunk for any query.

### Adding New Content
1. Add new Q&A entries to `js/rag-data.js` in the `RAG_DATA.english` or `RAG_DATA.maths` arrays
2. Follow the chunk structure: `{ id, subject, unit, title, question, answer }`
3. The keyword index is automatically rebuilt on page load

---

## 🔐 Security

- **Encryption**: XOR cipher + Base64 for all localStorage values
- **PIN Hashing**: FNV-1a-inspired hash for PIN and password storage
- **No plaintext storage**: Passwords and PINs are never stored as-is
- **Parent Portal**: Re-locks on every navigation away
- **Time Limit**: Enforced client-side with daily reset

---

## 🛡️ Governance & Safety

- No automated academic decisions
- All AI responses are sourced from pre-approved curriculum books only
- No internet connectivity required
- No third-party tracking or analytics
- Parent mediation through PIN portal

---

## 📊 Technology Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | HTML5, Vanilla CSS, Vanilla JavaScript |
| Styling    | CSS Custom Properties, rem units, animations |
| AI (RAG)   | In-browser keyword search on chunked Q&A data |
| Storage    | localStorage (encrypted) |
| Images     | Inline SVG (no external APIs) |
| Voice      | Web Speech API (SpeechSynthesis) |
| Fonts      | Google Fonts (Baloo 2, Nunito) |

---

## 📈 Version History

- **v1.0** — Initial design documentation (February 2026)
- **v2.0** — Full implementation: RAG chatbot, 8 games, image generator, parents portal, adaptive learning (February 2026)

---

## 🌟 Vision Statement

KidSpark aims to transform early education by creating a safe, joyful, parent-controlled digital environment where young learners develop curiosity and confidence without the pressure of competition or automated judgment.

---

**Next Steps:** Open `index.html` in a browser to start using KidSpark!
# KidSpark
# KidSpark
# KidSpark
# KidSpark
