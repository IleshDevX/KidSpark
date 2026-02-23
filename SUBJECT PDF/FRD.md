# Functional Requirements Document (FRD)
## KidSpark - Std 1 Digital Learning Experience

**Version:** 1.0  
**Date:** February 18, 2026  
**Prepared by:** Technetics IT Services

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Access & Safety](#2-access--safety)
3. [Gamified Dashboard](#3-gamified-dashboard)
4. [Homework & Activities](#4-homework--activities)
5. [Engagement Mechanics](#5-engagement-mechanics)
6. [Attendance Management](#6-attendance-management)
7. [Progress Overview](#7-progress-overview)
8. [Parent Communication](#8-parent-communication)
9. [AI Boundaries & RAG](#9-ai-boundaries--rag)
10. [Non-Functional Requirements](#10-non-functional-requirements)

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional requirements for KidSpark, a parent-assisted digital learning platform for Standard 1 students. It serves as a comprehensive guide for development, testing, and validation.

### 1.2 Scope
KidSpark covers:
- Parent-controlled access and child profile management
- Gamified learning dashboard with engagement mechanics
- Homework tracking and activity management
- Attendance monitoring
- Qualitative progress tracking
- Parent-teacher communication
- RAG-based AI assistance with strict boundaries

### 1.3 Core Constraints
- **No competitive features**: No ranking, leaderboards, or student comparisons
- **No automated grading**: No marks, percentages, or automated academic decisions
- **No direct AI-child interaction**: All AI usage parent-mediated
- **Content scope limitation**: AI answers only from Std 1 English & Math books

---

## 2. Access & Safety

### 2.1 Authentication System

#### 2.1.1 Parent Registration
**Requirement ID:** FR-AUTH-001  
**Priority:** Critical

**Functionality:**
- Parent registers using email/phone number
- OTP-based verification (mobile SMS or email)
- Password requirements: min 8 characters, alphanumeric, special character
- Optional biometric login (fingerprint/face ID) after initial setup
- Two-factor authentication (2FA) recommended for enhanced security

**User Flow:**
```
1. Parent enters email/phone
2. System sends OTP
3. Parent enters OTP and creates password
4. System creates parent account
5. Parent proceeds to child profile creation
```

**Validation Rules:**
- Email format validation
- Phone number format (10 digits for India)
- Password strength meter
- Duplicate account prevention

#### 2.1.2 Child Profile Management
**Requirement ID:** FR-AUTH-002  
**Priority:** Critical

**Functionality:**
- Parent creates child profile(s) under their account
- Each profile includes:
  - Child's first name (required)
  - Age/date of birth (required)
  - Grade/standard (auto-set to Std 1)
  - School name (optional)
  - Teacher name (optional)
  - Profile avatar selection (kid-friendly options)
  - Preferred pronouns (optional, for personalization)

**Data Fields:**
```json
{
  "childId": "UUID",
  "firstName": "string (required)",
  "dateOfBirth": "date (required)",
  "grade": "Std 1 (fixed)",
  "schoolName": "string (optional)",
  "teacherName": "string (optional)",
  "avatarId": "integer (required)",
  "pronouns": "string (optional)",
  "parentId": "UUID (foreign key)",
  "createdAt": "timestamp",
  "isActive": "boolean"
}
```

**Business Rules:**
- Maximum 3 child profiles per parent account
- Child name cannot be changed after 7 days (prevents confusion)
- Avatar can be changed anytime

#### 2.1.3 Role-Based Access Control
**Requirement ID:** FR-AUTH-003  
**Priority:** Critical

**User Roles:**

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Parent** | Full access to own child's data, mark homework done, view reports, request AI explanations, upload files | Complete control |
| **Teacher** | View student dashboard, post homework, mark attendance, provide feedback, post announcements | Read/Write (assigned students) |
| **School Admin** | Manage teacher accounts, view analytics (aggregated), configure school settings | Administrative |
| **System Admin** | Platform management, user support, audit log access | Full system access |

**Permission Matrix:**
```
Feature               | Parent | Teacher | School Admin | System Admin
---------------------|--------|---------|--------------|-------------
View Child Dashboard | ✓      | ✓       | ✗            | ✓
Mark Homework        | ✓      | ✗       | ✗            | ✗
Upload Homework      | ✓      | ✗       | ✗            | ✗
Assign Homework      | ✗      | ✓       | ✗            | ✗
Mark Attendance      | ✗      | ✓       | ✗            | ✗
Post Announcements   | ✗      | ✓       | ✓            | ✓
View AI Logs         | ✓      | ✗       | ✗            | ✓
Generate Reports     | ✓      | ✓       | ✓            | ✓
```

#### 2.1.4 Session Management
**Requirement ID:** FR-AUTH-004  
**Priority:** High

**Functionality:**
- Session timeout: 30 minutes of inactivity
- Auto-logout warning: 2 minutes before timeout
- "Remember Me" option: 30-day token (device-specific)
- Concurrent session limit: 2 devices per parent account
- Force logout on password change

### 2.2 Audit Logging

#### 2.2.1 Activity Logging
**Requirement ID:** FR-SEC-001  
**Priority:** Critical

**Logged Events:**
- All login/logout events (success and failures)
- Child profile views and switches
- Homework submissions
- File uploads/downloads
- AI query submissions and responses
- Teacher feedback additions
- Attendance updates
- Setting changes

**Log Structure:**
```json
{
  "logId": "UUID",
  "timestamp": "ISO 8601",
  "userId": "UUID",
  "userRole": "parent|teacher|admin",
  "actionType": "login|view|edit|delete|upload|query",
  "entityType": "homework|attendance|profile|ai_query",
  "entityId": "UUID",
  "ipAddress": "string",
  "deviceInfo": "string",
  "actionDetails": "JSON object",
  "status": "success|failure",
  "errorMessage": "string (if failed)"
}
```

**Retention Policy:**
- Audit logs retained for 3 years
- Exportable by parent on request (GDPR compliance)

#### 2.2.2 Parent Access Transparency
**Requirement ID:** FR-SEC-002  
**Priority:** Medium

**Functionality:**
- Parents can view their own activity log
- Filter by date range, action type
- Download activity report (CSV/PDF)
- Notifications for new device login

---

## 3. Gamified Dashboard

### 3.1 Dashboard Layout

#### 3.1.1 Welcome Card
**Requirement ID:** FR-DASH-001  
**Priority:** Critical

**Functionality:**
- Displays personalized greeting with child's name
- Shows current day and date in kid-friendly format
- Displays class/grade
- Shows Sparky mascot with random encouraging message
- Time-based greetings: "Good Morning!", "Good Afternoon!", "Good Evening!"

**UI Specifications:**
- Card position: Top of screen
- Height: 20% of viewport
- Background: Gradient blue (light to medium)
- Font: Rounded, child-friendly (e.g., Quicksand, Poppins)
- Text size: Large for child name (24px), medium for date (16px)

**Example Display:**
```
🌟 Good Morning, Riya!
📅 Tuesday, February 18, 2026
📚 Standard 1

[Sparky character]: "Ready to learn something new today?"
```

#### 3.1.2 Homework Card
**Requirement ID:** FR-DASH-002  
**Priority:** Critical

**Functionality:**
- Shows number of pending homework items
- Visual indicator: Badge with count
- Quick view: Today's homework list (collapsed)
- Tap to expand and see full homework module
- Color coding:
  - Green: All homework done
  - Yellow: Some pending
  - Red: Overdue items

**UI Specifications:**
- Card size: Medium (1/3 of dashboard width on tablet, full row on mobile)
- Icon: Backpack or notebook
- Animated badge when new homework added

**Data Display:**
```
📝 Homework
━━━━━━━━━━━━━━
[3] Pending
[2] Completed Today

→ Tap to view all
```

#### 3.1.3 Attendance Card
**Requirement ID:** FR-DASH-003  
**Priority:** High

**Functionality:**
- Shows current month attendance summary
- Present days count
- Visual calendar preview (last 7 days)
- Attendance percentage displayed as circular progress
- Color indicators: Green (Present), Red (Absent), Gray (Holiday)

**UI Specifications:**
- Card size: Medium
- Icon: Calendar or checkmark
- Circular progress ring animation

**Data Display:**
```
✓ Attendance
━━━━━━━━━━━━━━
This Month: 15/18 days
   
[Circular progress: 83%]

Last 7 days: ✓✓✓✗✓✓✓
```

#### 3.1.4 Announcements Card
**Requirement ID:** FR-DASH-004  
**Priority:** Medium

**Functionality:**
- Shows latest teacher announcement (title only)
- Unread badge indicator
- Tap to view all announcements
- Auto-refresh every 5 minutes
- Important announcements highlighted

**UI Specifications:**
- Card size: Medium to large
- Icon: Megaphone or bell
- Priority color coding (red for urgent)

**Data Display:**
```
📢 Announcements
━━━━━━━━━━━━━━
[New] School Picnic Next Week
[New] Parent-Teacher Meeting

→ View all messages
```

#### 3.1.5 Star & Badge Progress Card
**Requirement ID:** FR-DASH-005  
**Priority:** High

**Functionality:**
- Shows current star count
- Displays earned badges (icon grid)
- Progress bar to next level
- Recent badge showcase
- Sparkle animation when viewing

**UI Specifications:**
- Card size: Large (prominent position)
- Background: Starry gradient
- Animated star counter
- Trophy case style layout

**Data Display:**
```
⭐ Your Progress
━━━━━━━━━━━━━━
Stars: 127 ⭐

Latest Badges:
🏆 Week Warrior  🎯 Focus Friend
📚 Reading Champ

Level 3 [████████░░] 80%
20 stars to Level 4!
```

#### 3.1.6 Streak Counter
**Requirement ID:** FR-DASH-006  
**Priority:** Medium

**Functionality:**
- Shows current login streak (consecutive days)
- Longest streak ever achieved
- Visual flame/fire icon that grows with streak
- Milestone celebrations (7 days, 30 days, 100 days)
- Gentle reminder if streak at risk

**UI Specifications:**
- Card size: Small to medium
- Icon: Fire emoji or flame graphic
- Animation: Flickering flame effect

**Data Display:**
```
🔥 Daily Streak
━━━━━━━━━━━━━━
Current: 12 days
Best Ever: 45 days

Keep it going! 💪
```

### 3.2 Dashboard Interactions

#### 3.2.1 Card Navigation
**Requirement ID:** FR-DASH-007  
**Priority:** Medium

**Functionality:**
- Tap any card to view detailed section
- Smooth transition animations
- Breadcrumb navigation to return
- Swipe gestures for card scrolling (mobile)

#### 3.2.2 Refresh Mechanism
**Requirement ID:** FR-DASH-008  
**Priority:** Low

**Functionality:**
- Pull-to-refresh gesture
- Auto-refresh on app open
- Loading indicators during data fetch
- Offline mode: Show cached data with indicator

---

## 4. Homework & Activities

### 4.1 Homework Display

#### 4.1.1 Daily Homework Checklist
**Requirement ID:** FR-HW-001  
**Priority:** Critical

**Functionality:**
- Lists all assigned homework for the day
- Each item shows:
  - Subject (English/Math with icon)
  - Assignment title/description
  - Date assigned and due date
  - Status: Pending / In Progress / Done
  - Teacher's instructions (text/image)
  - Optional: Reference page numbers

**UI Specifications:**
- List view with clear separators
- Subject color coding (English: Blue, Math: Green)
- Checkboxes disabled (only parent can mark)
- Expandable sections for detailed instructions

**Example Entry:**
```
□ English - Reading Practice
   Assigned: Feb 17 | Due: Feb 19
   
   📖 Read Chapter 2 "The Rainbow"
   Practice phonics sounds: /ch/, /sh/
   
   [View Teacher's Notes]
   [Mark as Done] [Upload Work]
```

#### 4.1.2 Parent-Controlled Completion
**Requirement ID:** FR-HW-002  
**Priority:** Critical

**Functionality:**
- Only parent can mark homework as "Done"
- Confirmation dialog before marking complete
- Option to add parent notes (optional)
- Timestamp recorded for completion
- Cannot undo after 24 hours

**User Flow:**
```
1. Parent reviews child's completed work
2. Parent taps "Mark as Done"
3. System shows confirmation: "Mark English homework as complete?"
4. Parent confirms
5. System updates status, awards stars
6. Optional: Upload photo/file of work
```

**Business Rules:**
- Homework can be marked done after due date (no penalty)
- Teacher can see completion timestamps
- Parent notes visible only to teacher

#### 4.1.3 File Upload System
**Requirement ID:** FR-HW-003  
**Priority:** High

**Functionality:**
- Upload photos of handwritten work
- PDF upload support for printables
- Audio recording for reading assignments
- Multiple files per homework (max 5)
- File size limit: 10MB per file
- Supported formats: JPG, PNG, PDF, MP3, MP4 (video)

**Technical Specifications:**
- Image compression before upload
- Progress indicator during upload
- Retry mechanism for failed uploads
- Cloud storage integration (AWS S3 / Google Cloud Storage)

**UI Flow:**
```
[Upload Work] button
  → Opens picker:
     📸 Take Photo
     🖼️ Choose from Gallery
     🎤 Record Audio
     📄 Upload Document
  → File preview before submission
  → [Submit] button
```

#### 4.1.4 Activity Tracking
**Requirement ID:** FR-HW-004  
**Priority:** Medium

**Functionality:**
- System tracks time spent on each homework view
- Tracks number of times activity opened
- Records completion patterns (day of week, time)
- Data used for parent insights only (not for grading)

**Tracked Metrics:**
```json
{
  "homeworkId": "UUID",
  "viewCount": "integer",
  "totalTimeSpent": "seconds",
  "completionDate": "timestamp",
  "uploadedFiles": "integer count",
  "parentNotes": "boolean"
}
```

### 4.2 Teacher Feedback

#### 4.2.1 Qualitative Feedback System
**Requirement ID:** FR-HW-005  
**Priority:** Critical

**Functionality:**
- Teacher provides text feedback on submitted work
- Predefined positive phrases (quick select):
  - "Great effort!"
  - "Well done!"
  - "Keep practicing!"
  - "Wonderful work!"
  - "Improving every day!"
- Custom feedback text option
- Emoji reactions (⭐ 🎉 👏 💯 ❤️)
- No numeric marks, grades, or scores

**UI for Teacher:**
```
Feedback for Riya's English Homework

Quick Phrases:
[Great effort!] [Well done!] [Keep practicing!]

Custom Message:
[Text area]

Emoji Reactions:
⭐ 🎉 👏 💯 ❤️

[Submit Feedback]
```

**Restrictions:**
- Cannot include comparative language ("better than", "top of class")
- Cannot include numeric scores
- Cannot include negative feedback (system suggests rephrasing)
- Must include at least one positive element

#### 4.2.2 Feedback Display (Parent View)
**Requirement ID:** FR-HW-006  
**Priority:** High

**Functionality:**
- Feedback displayed on homework item after teacher reviews
- Notification sent when feedback added
- Feedback grouped by date
- Feedback filtering: By subject, date range

**Parent View:**
```
English - Reading Practice ✓
Completed on: Feb 18, 2:30 PM

Teacher's Feedback:
⭐ "Great effort on phonics! Riya's pronunciation 
is improving. Keep up the daily practice!"

- Mrs. Sharma, Feb 19
```

### 4.3 No Grading Automation

#### 4.3.1 System Restrictions
**Requirement ID:** FR-HW-007  
**Priority:** Critical

**Hard Constraints:**
- No automatic grading of uploaded work
- No AI-based assessment of homework correctness
- No score calculation or percentage generation
- No performance predictions or trends
- No automated report cards

**System Design:**
- Homework status: Binary (Done/Pending)
- Teacher feedback: Text-only, qualitative
- No "correct/incorrect" marking in system
- No comparative analytics between students

---

## 5. Engagement Mechanics

### 5.1 Streak System

#### 5.1.1 Login Streak Tracking
**Requirement ID:** FR-ENG-001  
**Priority:** High

**Functionality:**
- Tracks consecutive days of login
- Resets if missed a full day (24-hour window)
- Grace period: 1 "freeze" card per month (can skip 1 day without breaking streak)
- Visual indicator: Flame icon that grows
- Milestone rewards at 7, 30, 60, 100 days

**Streak Rules:**
- Login must occur between 12:00 AM and 11:59 PM
- Parent login counts for child profile
- Minimum engagement: View dashboard for 30 seconds
- System sends gentle reminder if streak at risk (8 PM notification)

**Reward Structure:**
```
7 days  → "Week Warrior" badge + 50 stars
30 days → "Month Master" badge + 200 stars + Freeze card
60 days → "Dedication Champion" badge + 500 stars
100 days → "Century Club" badge + Special mascot variant
```

### 5.2 Badge System

#### 5.2.1 Badge Categories
**Requirement ID:** FR-ENG-002  
**Priority:** High

**Badge Types:**

**Consistency Badges:**
- Week Warrior (7-day streak)
- Month Master (30-day streak)
- Dedication Champion (60-day streak)
- Century Club (100-day streak)

**Activity Badges:**
- Homework Hero (Complete 10 homework tasks)
- Activity Ace (Complete 25 homework tasks)
- Task Titan (Complete 50 homework tasks)
- Reading Champ (Complete 10 reading activities)
- Math Magician (Complete 10 math activities)

**Engagement Badges:**
- Early Bird (Login before 8 AM five times)
- Night Owl Helper (Complete homework after 7 PM five times)
- Weekend Warrior (Active on 4 consecutive weekends)
- Curiosity Star (Use AI helper 20 times)

**Special Badges:**
- First Day Friend (Complete profile setup)
- First Success (Complete first homework)
- Star Collector (Earn 100 stars)
- Triple Threat (3 badges in one week)
- Parent Partner (Parent adds notes 10 times)

#### 5.2.2 Badge Display and Earning
**Requirement ID:** FR-ENG-003  
**Priority:** Medium

**Functionality:**
- Badge showcase on dashboard (trophy case)
- Badge earned animation with confetti
- Progress bars showing path to next badge
- Badge collection page with descriptions
- Locked badges show requirements

**UI Design:**
```
🏆 Badge Collection
━━━━━━━━━━━━━━━━━━━━

Earned (8):
[■ Week Warrior] [■ First Success] [■ Reading Champ]
[■ Homework Hero] [■ Early Bird] [■ Star Collector]
[■ First Day Friend] [■ Parent Partner]

In Progress (3):
[□ Month Master] ██████░░░░ 20/30 days
[□ Math Magician] ████░░░░░░ 7/10 tasks
[□ Activity Ace] ████████░░ 18/25 tasks

Locked (15):
[🔒 Dedication Champion] Complete 60-day streak
[🔒 Century Club] Complete 100-day streak
...
```

### 5.3 Level Progression System

#### 5.3.1 Level Structure
**Requirement ID:** FR-ENG-004  
**Priority:** High

**Functionality:**
- 10 levels in total (Level 1-10)
- Each level requires increasing star count
- Level-up triggers celebration animation
- Each level unlocks new mascot variant
- Level tied to star accumulation, not performance

**Level Requirements:**
```
Level 1: 0 stars (Starting level)
Level 2: 50 stars
Level 3: 150 stars
Level 4: 300 stars
Level 5: 500 stars
Level 6: 750 stars
Level 7: 1,050 stars
Level 8: 1,400 stars
Level 9: 1,800 stars
Level 10: 2,500 stars (Max level)
```

**Star Earning Opportunities:**
```
Daily login: 5 stars
Homework completion: 10-20 stars (based on length)
Badge earned: 25-500 stars (varies)
Streak milestones: 50-500 stars
Teacher special star: 30 stars (teacher awarded)
```

#### 5.3.2 Level Benefits (Non-Competitive)
**Requirement ID:** FR-ENG-005  
**Priority:** Low

**Benefits:**
- New Sparky variants (color/accessories)
- Dashboard theme customization
- Additional avatar options
- Special badge frames
- Confetti color change

**Important:** Benefits are aesthetic only, no academic advantages

### 5.4 Mascot System (Sparky)

#### 5.4.1 Sparky Character Design
**Requirement ID:** FR-ENG-006  
**Priority:** Medium

**Character Specifications:**
- Name: Sparky
- Design: Friendly spark/lightning bolt character
- Expressions: Happy, curious, encouraging, celebrating
- Variants: Different colors and accessories at each level
- Animations: Waving, jumping, thumbs up, confetti throw

**Personality Traits:**
- Always encouraging, never judgmental
- Gender-neutral
- Child-friendly language
- Curiosity-driven messaging

#### 5.4.2 Sparky Messages
**Requirement ID:** FR-ENG-007  
**Priority:** Low

**Functionality:**
- Rotates through predefined encouraging messages
- Context-aware (time of day, streak status, recent activity)
- No reminders about incomplete homework (parent's role)
- Positive reinforcement only

**Sample Messages:**
```
"Every day is a new adventure!"
"I love learning with you!"
"You're doing amazing!"
"Let's explore something fun today!"
"What will you discover today?"
"Your curiosity makes you special!"
"Learning is a superpower!"
```

**Message Triggers:**
- Login: Welcome message
- Homework done: Celebration message
- Badge earned: Achievement message
- Level up: Congratulations message
- Streak milestone: Persistence message

### 5.5 Non-Scored Quizzes

#### 5.5.1 Practice Quiz System
**Requirement ID:** FR-ENG-008  
**Priority:** Low

**Functionality:**
- Fun practice activities, not assessments
- Questions from English/Math curriculum
- Interactive format (multiple choice, drag-drop, audio)
- Instant feedback: "Let's try another way!" instead of "wrong"
- No score display, no percentage
- Parent-mediated only

**Quiz Structure:**
```
Practice Activity: Phonics Sounds

Question 1 of 5:
Which picture starts with the sound /ch/?

[Image: Chair] [Image: Ball] [Image: Cat]

[Child selects Chair]
System: "Yes! Chair starts with /ch/! 🎉"

[Child selects Ball]
System: "Let's think about the sound... /ch/ like in 'cheese'. Try again!"
```

**Important Rules:**
- No quiz scores stored
- No quiz comparisons
- No time limits
- Can retry unlimited times
- Purely for practice and engagement

---

## 6. Attendance Management

### 6.1 Attendance Recording

#### 6.1.1 Teacher Attendance Entry
**Requirement ID:** FR-ATT-001  
**Priority:** Critical

**Functionality:**
- Teacher marks attendance daily for each student
- Status options: Present / Absent / Holiday / Leave
- Bulk selection for holidays (all students)
- Date range selection for retroactive entry
- Attendance locked after 7 days (admin override only)

**UI for Teacher:**
```
Attendance - Standard 1A - Feb 18, 2026

Status: [All Present] [All Absent] [Holiday]

Student List:
□ Riya Sharma      [Present ✓] [Absent] [Leave]
□ Aarav Patel      [Present ✓] [Absent] [Leave]
□ Ananya Gupta     [Present ✓] [Absent] [Leave]
...

Notes (optional):
[Text area for general notes]

[Save Attendance]
```

**Validation:**
- Cannot mark future dates
- Cannot mark attendance twice for same date (update only)
- Holiday status applies to all students

#### 6.1.2 Attendance Notifications
**Requirement ID:** FR-ATT-002  
**Priority:** High

**Functionality:**
- Push notification sent to parent by 11 AM if marked absent
- Daily attendance summary at end of school day
- Weekly attendance summary every Sunday
- Alert if attendance drops below 75% for the month

**Notification Examples:**
```
📅 Attendance Alert
Riya was marked absent today (Feb 18).
If this is incorrect, please contact the teacher.

━━━━━━━━━━━━━━━━━━━━

📅 Weekly Summary
This week: 4/5 days present
This month: 15/18 days (83%)
```

### 6.2 Attendance Visualization

#### 6.2.1 Monthly Calendar View
**Requirement ID:** FR-ATT-003  
**Priority:** High

**Functionality:**
- Calendar grid showing entire month
- Color-coded dates:
  - Green: Present
  - Red: Absent
  - Blue: Holiday/Leave
  - Gray: Future dates / Weekends
- Tap date to see details
- Previous month navigation

**Calendar UI:**
```
Attendance - February 2026

Mo Tu We Th Fr Sa Su
31  1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28  1  2  3  4  5  6

Legend:
● Present   ● Absent   ● Holiday   ○ Weekend

This month: 15/18 days present (83%)
```

#### 6.2.2 Attendance Statistics
**Requirement ID:** FR-ATT-004  
**Priority:** Medium

**Functionality:**
- Monthly attendance percentage
- Term-wise attendance summary
- Attendance graph (line chart by month)
- Comparison with minimum requirement (if applicable)

**Statistics Display:**
```
📊 Attendance Summary

Current Month (Feb):
Present: 15 days
Absent: 3 days
Attendance: 83%

This Term:
Total Days: 45
Present: 42 days (93%)

[View Detailed Report]
```

### 6.3 Attendance Badge

#### 6.3.1 Attendance Achievement
**Requirement ID:** FR-ATT-005  
**Priority:** Low

**Functionality:**
- Badge awarded for perfect attendance (month)
- Badge awarded for 95%+ attendance (month)
- Badge awarded for full term perfection
- Displayed in badge collection

**Badge Criteria:**
```
📅 Perfect Month: 100% attendance in a month
📆 Almost Perfect: 95-99% attendance in a month
📚 Term Superstar: 100% attendance for full term
🌟 Year Champion: 95%+ attendance for full year
```

---

## 7. Progress Overview

### 7.1 Qualitative Progress Tracking

#### 7.1.1 Smile Scale Feedback
**Requirement ID:** FR-PROG-001  
**Priority:** High

**Functionality:**
- Visual emotion scale for progress (not performance)
- 5-point smile scale:
  - 😊😊😊😊😊 Excellent Progress
  - 😊😊😊😊 Good Progress
  - 😊😊😊 Satisfactory
  - 😊😊 Needs Support
  - 😊 Extra Support Needed
- Teacher selects appropriate scale weekly
- Tied to engagement, not marks
- Parent-friendly language

**Criteria for Smile Scale:**
- Participation level in activities
- Engagement with homework
- Parent involvement
- Regularity and consistency
- NOT based on right/wrong answers

**Display:**
```
This Week's Progress

Participation: 😊😊😊😊 Good Progress
Homework: 😊😊😊😊😊 Excellent Progress
Engagement: 😊😊😊😊 Good Progress

Teacher's Note:
"Riya has shown wonderful curiosity in 
learning activities this week!"
```

#### 7.1.2 Teacher Remarks System
**Requirement ID:** FR-PROG-002  
**Priority:** High

**Functionality:**
- Weekly qualitative remarks by teacher
- Monthly summary remarks
- Predefined positive phrase library
- Custom text entry option
- Character limit: 500 characters
- Supports emojis

**Remark Categories:**
```
Participation:
- "Actively participates in activities"
- "Shows enthusiasm during circle time"
- "Asks thoughtful questions"

Homework:
- "Completes homework regularly"
- "Shows creativity in assignments"
- "Parent support is evident"

Social Skills:
- "Plays well with classmates"
- "Shares materials kindly"
- "Listens attentively"

Areas for Growth (supportive language):
- "Would benefit from more reading practice"
- "Encouraging more independent work"
- "Building confidence in math activities"
```

**Example Remark:**
```
📝 Teacher's Remarks - Week of Feb 12-16

Mrs. Sharma's Notes:
"Riya has shown excellent progress this week! She 
actively participated in our phonics games and 
completed all homework on time. Her enthusiasm 
during story time is wonderful! Keep encouraging 
her reading practice at home. 😊"

Date: Feb 16, 2026
```

### 7.2 Skill Indicators

#### 7.2.1 Skill Development Tracking
**Requirement ID:** FR-PROG-003  
**Priority:** Medium

**Functionality:**
- Visual indicators for key Std 1 skills
- 3 skill categories: Reading, Writing, Participation
- Progress shown as developing stages (not grades):
  - 🌱 Emerging
  - 🌿 Developing
  - 🌳 Confident
  - 🌟 Flourishing
- Updated monthly by teacher
- Qualitative, not quantitative

**Skill Breakdown:**

**Reading Skills:**
- Letter recognition
- Phonics awareness
- Simple word reading
- Listening comprehension

**Writing Skills:**
- Letter formation
- Pencil grip
- Simple word writing
- Creative expression

**Participation Skills:**
- Classroom engagement
- Following instructions
- Asking questions
- Group activities

**Display:**
```
📈 Skill Development (February 2026)

Reading:
🌳 Confident
"Recognizes most letters and blends simple sounds"

Writing:
🌿 Developing
"Forming letters well, building word writing"

Participation:
🌟 Flourishing
"Enthusiastic and engaged in all activities"

Last updated: Feb 15 by Mrs. Sharma
```

#### 7.2.2 Progress Timeline
**Requirement ID:** FR-PROG-004  
**Priority:** Low

**Functionality:**
- Visual timeline of skill progression
- Month-by-month view
- Shows growth journey
- Can compare current month with previous months
- Export progress report

**Timeline View:**
```
Skill Development Journey

Reading:
Jul  Aug  Sep  Oct  Nov  Dec  Jan  Feb
🌱 → 🌱 → 🌿 → 🌿 → 🌳 → 🌳 → 🌳 → 🌟

Writing:
Jul  Aug  Sep  Oct  Nov  Dec  Jan  Feb
🌱 → 🌱 → 🌱 → 🌿 → 🌿 → 🌿 → 🌿 → 🌳

Participation:
Jul  Aug  Sep  Oct  Nov  Dec  Jan  Feb
🌿 → 🌳 → 🌳 → 🌳 → 🌟 → 🌟 → 🌟 → 🌟
```

### 7.3 Report Generation

#### 7.3.1 Monthly Progress Report
**Requirement ID:** FR-PROG-005  
**Priority:** Medium

**Functionality:**
- Auto-generated monthly summary
- Includes: Attendance, homework completion rate, teacher remarks, skill indicators
- Available for download (PDF)
- Shareable with external users (grandparents, tutors)
- Data visualization with charts

**Report Structure:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KidSpark - Monthly Progress Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Student: Riya Sharma
Class: Standard 1
Month: February 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ATTENDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Present: 15/18 days (83%)
[Calendar visualization]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOMEWORK & ACTIVITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Assigned: 24
Completed: 22 (92%)
[Bar chart by subject]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKILL DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reading: 🌳 Confident
Writing: 🌿 Developing
Participation: 🌟 Flourishing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEACHER'S REMARKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Riya has made wonderful progress this month..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENGAGEMENT HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Badges Earned: 2
Current Streak: 12 days
Stars Earned: 156

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated on: Feb 28, 2026
Teacher: Mrs. Sharma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 8. Parent Communication

### 8.1 Announcement System

#### 8.1.1 Teacher Announcements
**Requirement ID:** FR-COMM-001  
**Priority:** High

**Functionality:**
- Teacher posts announcements to class
- Announcement types:
  - 📢 General (homework reminder, class activity)
  - ⚠️ Important (PTM, school event)
  - 🎉 Celebration (achievement, festival)
  - 📚 Academic (syllabus update, book requirement)
- Rich text support (bold, lists)
- Image/PDF attachment support
- Scheduled posting option
- Target audience: Specific students or entire class

**Teacher UI:**
```
Create Announcement

Title: [Text field]

Type: [General ▼] [Important] [Celebration] [Academic]

Message:
[Rich text editor]

Attach File: [Browse...]

Audience:
○ Entire Class
○ Selected Students: [Multi-select dropdown]

Post: 
○ Now
○ Schedule: [Date & Time picker]

[Preview] [Post Announcement]
```

#### 8.1.2 Announcement Display (Parent)
**Requirement ID:** FR-COMM-002  
**Priority:** High

**Functionality:**
- Chronological list (latest first)
- Unread badge on dashboard
- Push notification for important announcements
- Filter by type and date
- Mark as read
- Save announcement for later

**Parent View:**
```
📢 Announcements

[Filter: All Types ▼] [This Month ▼]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT
Parent-Teacher Meeting
Posted Feb 17, 2026

Dear Parents,
Our PTM is scheduled for Feb 25...

[Read More] [Save] [Mark as Read]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 GENERAL
Holiday Homework
Posted Feb 15, 2026

Please find the holiday homework list...

[Read More]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.2 Parent-Teacher Communication

#### 8.2.1 Direct Messaging
**Requirement ID:** FR-COMM-003  
**Priority:** Medium

**Functionality:**
- Private messaging between parent and teacher
- Threaded conversations
- Read receipts
- File attachment support
- Response within 24-48 hours expected
- System-generated conversation starters

**Message Interface:**
```
💬 Messages with Mrs. Sharma

[New Message ✏️]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feb 17, 2:30 PM - You:
"Hi Mrs. Sharma, Riya enjoyed the story 
time session today! She's been asking about 
the rainbow book."

Feb 17, 5:15 PM - Mrs. Sharma:
"Thank you for sharing! It's wonderful to 
see her enthusiasm. The book is 'Rainbow 
Colors' by [author]. You can find it in the 
school library."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Type your message...]
[Attach 📎]    [Send →]
```

**System Conversation Starters:**
- "I have a question about today's homework..."
- "Request for feedback on..."
- "Concern about attendance..."
- "Request to schedule a call..."

#### 8.2.2 PTM Scheduling
**Requirement ID:** FR-COMM-004  
**Priority:** Medium

**Functionality:**
- View upcoming PTM dates
- Request specific time slot
- Confirmation notification
- Calendar integration (Add to calendar)
- Reschedule request option

**PTM Interface:**
```
📅 Parent-Teacher Meeting

Next PTM: Saturday, Feb 25, 2026

Available Slots:
○ 9:00 AM - 9:20 AM
○ 9:20 AM - 9:40 AM
● 10:00 AM - 10:20 AM (Selected)
○ 10:20 AM - 10:40 AM

Mode:
○ In-Person
● Video Call
○ Phone Call

[Request Slot] [Add to Calendar]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Confirmed Slot:
Feb 25, 10:00 AM - 10:20 AM
Mode: Video Call

[Join Meeting] [Reschedule] [Cancel]
```

### 8.3 Circular & Resources

#### 8.3.1 Circular Downloads
**Requirement ID:** FR-COMM-005  
**Priority:** Low

**Functionality:**
- School circulars available for download
- Category-wise organization:
  - Academic (syllabus, exam schedules)
  - Events (picnics, celebrations)
  - Administrative (fee structure, policies)
- PDF format
- Search functionality
- Notification when new circular posted

**Circular List:**
```
📄 School Circulars

[Search...]
[Category: All ▼] [Date: Recent First ▼]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Annual Day Celebration
Category: Events
Date: Feb 15, 2026
[Download PDF 📥] [View]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Term-wise Syllabus Std 1
Category: Academic
Date: Jan 10, 2026
[Download PDF 📥] [View]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 8.3.2 Event Notifications
**Requirement ID:** FR-COMM-006  
**Priority:** Medium

**Functionality:**
- Calendar of upcoming school events
- RSVP for events (where applicable)
- Reminder notifications (1 week, 1 day before)
- Event details: Date, time, venue, dress code, requirements

**Event Calendar:**
```
📅 Upcoming Events

February 2026

25 - Parent-Teacher Meeting
    9:00 AM - 12:00 PM
    [RSVP Required] [Confirmed ✓]

28 - School Picnic
    7:00 AM - 3:00 PM
    Location: City Park
    [Details] [RSVP]

March 2026

5  - Sports Day
15 - Annual Day

[View All Events]
```

---

## 9. AI Boundaries & RAG

### 9.1 AI Interaction Rules

#### 9.1.1 Parent-Mediated AI Only
**Requirement ID:** FR-AI-001  
**Priority:** Critical

**Restrictions:**
- No direct AI chat interface for children
- AI helper accessible only through parent login
- Parent reviews AI responses before sharing with child
- AI interactions logged separately

**Access Flow:**
```
Child has question
  ↓
Parent logs in
  ↓
Parent navigates to "AI Helper" section
  ↓
Parent types/speaks question
  ↓
System: RAG-based answer generated
  ↓
Parent reviews answer
  ↓
Parent explains to child in their own words
```

#### 9.1.2 RAG-Based Responses
**Requirement ID:** FR-AI-002  
**Priority:** Critical

**Functionality:**
- AI answers ONLY from indexed content:
  - Std 1 English textbook
  - Std 1 Mathematics textbook
  - Teacher-provided supplementary materials
  - Approved children's dictionary
- No internet search
- No general knowledge beyond curriculum
- Source citation mandatory in every response

**Example Interaction:**
```
Parent Query: "What is the phonics sound for 'sh'?"

AI Response:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The phonics sound for 'sh' is /ʃ/ (like a 
"shhh" sound asking someone to be quiet).

Example words from your book:
- Shell
- Fish
- Brush

📚 Source: English Book, Chapter 4 "Sounds 
We Know", Page 23

Practice sentence: "She sells seashells."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Helpful] [Not Helpful] [Ask Follow-up]
```

**Response Format Rules:**
- Simple language (parent explains to child)
- Include page reference always
- Provide examples from the book
- Suggest practice activity when relevant
- "I don't have information about that" if not in curriculum

#### 9.1.3 Forbidden AI Behaviors
**Requirement ID:** FR-AI-003  
**Priority:** Critical

**Hard Restrictions:**
- ❌ No grading or assessment of child's work
- ❌ No performance predictions
- ❌ No comparisons with other students
- ❌ No internet-based answers
- ❌ No advice on non-academic topics
- ❌ No responses to questions outside Std 1 curriculum scope
- ❌ No answers to homework questions (explain concepts only)
- ❌ No personal data collection beyond query logging

**Safety Guardrails:**
```python
# Example policy enforcement
if query_classification == "homework_solution":
    return "I can explain the concept, but I can't solve 
            the homework for you. Let me explain how to 
            approach this type of question instead."

if query_classification == "outside_curriculum":
    return "This topic is not in the Std 1 curriculum. 
            I can only help with English and Math topics 
            from your textbooks."

if query_classification == "assessment_request":
    return "I cannot grade or assess work. Please share 
            the completed homework with your teacher for 
            feedback."
```

### 9.2 AI Logging & Transparency

#### 9.2.1 Query Logging
**Requirement ID:** FR-AI-004  
**Priority:** Critical

**Logged Data:**
```json
{
  "queryId": "UUID",
  "timestamp": "ISO 8601",
  "parentId": "UUID",
  "childId": "UUID",
  "queryText": "original question",
  "queryClassification": "concept|homework|general",
  "ragSources": ["book_page_refs"],
  "responseText": "AI response",
  "responseTime": "milliseconds",
  "parentFeedback": "helpful|not_helpful|null",
  "followUpQueries": ["UUID list"]
}
```

**Retention:** All AI queries retained for 1 year for audit

#### 9.2.2 Parent AI Usage Dashboard
**Requirement ID:** FR-AI-005  
**Priority:** Medium

**Functionality:**
- Parent can view all their AI queries
- Filter by date, subject
- See response sources
- Re-read past responses
- Export AI interaction history

**Dashboard View:**
```
🤖 AI Helper History

Total Queries: 32
English: 18 | Math: 14

Recent Queries:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feb 17, 2026 - 3:45 PM
Q: "What is the phonics sound for 'sh'?"
Subject: English | Source: Chapter 4, Page 23
[View Response]

Feb 16, 2026 - 5:20 PM
Q: "How to explain addition with objects?"
Subject: Math | Source: Chapter 2, Page 15
[View Response]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Export History] [Clear History]
```

### 9.3 explainability Requirements

#### 9.3.1 Source Attribution
**Requirement ID:** FR-AI-006  
**Priority:** Critical

**Functionality:**
- Every AI response must include source reference
- Source format: Book name, chapter, page number
- Clickable source to view actual textbook page (if digitized)
- Multiple sources ranked by relevance

**Source Display:**
```
AI Response: [Answer text]

📚 Sources:
1. English Textbook, Chapter 4 "Sounds We Know", 
   Page 23 [View Page]
2. Practice Workbook, Exercise 8, Page 31

Confidence: High (Direct match from curriculum)
```

#### 9.3.2 RAG Confidence Levels
**Requirement ID:** FR-AI-007  
**Priority:** Medium

**Functionality:**
- System indicates confidence in answer
- Confidence levels:
  - ✅ High: Direct match from textbook
  - ⚠️ Medium: Inferred from related content
  - ❓ Low: Limited information available

**Low Confidence Response:**
```
❓ Limited Information

I found related information, but I'm not 
completely certain this answers your question.

Based on Chapter 3, Page 18:
[Partial information]

💡 Suggestion: This might be a good question 
to ask Mrs. Sharma directly!

📚 Source: Math Book, Chapter 3, Page 18
Confidence: Low
```

---

## 10. Non-Functional Requirements

### 10.1 Performance

#### 10.1.1 Response Time
**Requirement ID:** NFR-PERF-001  
**Priority:** High

**Requirements:**
- Dashboard load: < 2 seconds
- Homework list load: < 1.5 seconds
- File upload: < 5 seconds (2MB image)
- AI response: < 5 seconds (RAG query)
- Navigation transitions: < 500ms

#### 10.1.2 Scalability
**Requirement ID:** NFR-PERF-002  
**Priority:** Medium

**Requirements:**
- Support 10,000 concurrent users
- Handle 50,000 students per school
- Support multiple schools (multi-tenancy)
- Auto-scaling based on load

### 10.2 Security

#### 10.2.1 Data Encryption
**Requirement ID:** NFR-SEC-001  
**Priority:** Critical

**Requirements:**
- Data at rest: AES-256 encryption
- Data in transit: TLS 1.3
- Password storage: bcrypt with salt
- Session tokens: JWT with short expiry

#### 10.2.2 Privacy Compliance
**Requirement ID:** NFR-SEC-002  
**Priority:** Critical

**Requirements:**
- GDPR compliance (right to erasure, data export)
- COPPA compliance (parental consent for children)
- Minimal data collection principle
- Anonymous usage analytics only
- No third-party tracking

### 10.3 Accessibility

#### 10.3.1 UI Accessibility
**Requirement ID:** NFR-ACC-001  
**Priority:** High

**Requirements:**
- WCAG 2.1 Level AA compliance
- Screen reader support
- High contrast mode option
- Font size adjustment
- Color-blind friendly palette

#### 10.3.2 Multi-Language Support
**Requirement ID:** NFR-ACC-002  
**Priority:** Medium

**Requirements:**
- UI language selection (English, Hindi, regional languages)
- Content remains in curriculum language
- Right-to-left (RTL) support for applicable languages

### 10.4 Device Compatibility

#### 10.4.1 Platform Support
**Requirement ID:** NFR-PLAT-001  
**Priority:** Critical

**Requirements:**
- iOS (14+)
- Android (10+)
- Responsive web (desktop browsers)
- Tablet-optimized layouts

#### 10.4.2 Offline Capability
**Requirement ID:** NFR-PLAT-002  
**Priority:** Medium

**Requirements:**
- View cached dashboard data offline
- Mark homework as done offline (syncs when online)
- View downloaded circulars offline
- AI helper requires internet

### 10.5 Reliability

#### 10.5.1 Uptime
**Requirement ID:** NFR-REL-001  
**Priority:** High

**Requirements:**
- 99.5% uptime SLA
- Scheduled maintenance windows (weekends)
- Graceful degradation if AI service unavailable

#### 10.5.2 Data Backup
**Requirement ID:** NFR-REL-002  
**Priority:** Critical

**Requirements:**
- Automated daily backups
- 30-day backup retention
- Point-in-time recovery capability
- Multi-region backup storage

---

## Appendix A: Glossary

- **RAG (Retrieval-Augmented Generation)**: AI technique that generates responses based on retrieved documents rather than general knowledge
- **Parent-Mediated**: All interactions filtered through parent, no direct child-AI chat
- **Non-Competitive**: No rankings, comparisons, or leaderboards between students
- **Qualitative Feedback**: Descriptive, text-based feedback without numeric scores

---

## Appendix B: Future Enhancements (Out of Scope for v1.0)

- Video lessons library
- Interactive games for math/phonics
- Voice-based homework submission
- Parent community forum
- Multilingual AI responses
- Integration with school ERP systems
- Sibling profile linking

---

**Document Status:** Draft v1.0  
**Last Updated:** February 18, 2026  
**Next Review:** Upon development team feedback
