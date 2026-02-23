# API Specifications
## KidSpark - Complete REST API Documentation

**Version:** v1.0  
**Base URL:** `https://api.kidspark.app/v1`  
**Date:** February 18, 2026  
**Protocol:** HTTPS only (TLS 1.3)

---

## Table of Contents
1. [API Overview](#1-api-overview)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Parent API Endpoints](#3-parent-api-endpoints)
4. [Teacher API Endpoints](#4-teacher-api-endpoints)
5. [Admin API Endpoints](#5-admin-api-endpoints)
6. [AI Helper API](#6-ai-helper-api)
7. [File Upload API](#7-file-upload-api)
8. [Webhook & Notifications](#8-webhook--notifications)
9. [Error Handling](#9-error-handling)
10. [Rate Limiting & Quotas](#10-rate-limiting--quotas)

---

## 1. API Overview

### 1.1 Architecture

```
Client (Mobile/Web)
       ↓
   API Gateway (AWS API Gateway / Kong)
       ↓
   Load Balancer (AWS ALB)
       ↓
   Application Server (Node.js / FastAPI)
       ├→ PostgreSQL (Primary DB)
       ├→ Redis (Cache + Session)
       ├→ Weaviate (Vector DB for RAG)
       ├→ S3 (File Storage)
       └→ SQS/SNS (Async Jobs)
```

### 1.2 API Design Principles

- **RESTful:** Resource-oriented design
- **JSON:** All request/response bodies in JSON
- **Versioning:** URL-based (`/v1`, `/v2`)
- **Idempotency:** POST/PUT/PATCH/DELETE support idempotency keys
- **Pagination:** Cursor-based for large collections
- **Filtering:** Query parameters for resource filtering
- **Partial Responses:** `fields` parameter to select specific fields

### 1.3 HTTP Status Codes

```
2xx Success:
  200 OK                 - Request succeeded
  201 Created            - Resource created
  202 Accepted           - Async request accepted
  204 No Content         - Success with no response body

4xx Client Errors:
  400 Bad Request        - Invalid request format/validation error
  401 Unauthorized       - Missing or invalid authentication
  403 Forbidden          - Authenticated but not authorized
  404 Not Found          - Resource doesn't exist
  409 Conflict           - Resource conflict (duplicate, state)
  422 Unprocessable      - Valid format, semantic error
  429 Too Many Requests  - Rate limit exceeded

5xx Server Errors:
  500 Internal Server Error - Unexpected server error
  502 Bad Gateway           - Upstream service failure
  503 Service Unavailable   - Temporary maintenance/overload
  504 Gateway Timeout       - Upstream service timeout
```

### 1.4 Common Headers

**Request Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Request-ID: {uuid}                 (Optional: for tracing)
X-Idempotency-Key: {uuid}            (Optional: for idempotent operations)
Accept-Language: en-US               (Optional: i18n)
```

**Response Headers:**
```
Content-Type: application/json
X-Request-ID: {uuid}
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
```

---

## 2. Authentication & Authorization

### 2.1 Authentication Flow

**Phone-based OTP Authentication:**

```
Step 1: Request OTP
POST /auth/otp/request

Step 2: Verify OTP
POST /auth/otp/verify

Step 3: Use JWT for subsequent requests
Authorization: Bearer {jwt_token}
```

**JWT Token Structure:**

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "parent_uuid",
    "user_type": "parent",
    "iat": 1614556800,
    "exp": 1614560400,
    "jti": "unique_token_id"
  }
}
```

### 2.2 Endpoints: Authentication

#### 2.2.1 Request OTP

```
POST /auth/otp/request
```

**Request Body:**
```json
{
  "phone": "+919876543210",
  "country_code": "+91"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "session_id": "sess_abc123xyz",
  "expires_in": 300
}
```

**Response (429 Too Many Requests):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many OTP requests. Try again in 60 seconds.",
    "retry_after": 60
  }
}
```

---

#### 2.2.2 Verify OTP

```
POST /auth/otp/verify
```

**Request Body:**
```json
{
  "session_id": "sess_abc123xyz",
  "otp": "4725"
}
```

**Response (200 OK - Existing User):**
```json
{
  "success": true,
  "user": {
    "id": "parent_uuid_001",
    "first_name": "Priya",
    "last_name": "Sharma",
    "phone": "+919876543210",
    "user_type": "parent"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_abc123xyz",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

**Response (201 Created - New User):**
```json
{
  "success": true,
  "is_new_user": true,
  "user": {
    "id": "parent_uuid_002",
    "phone": "+919876543210",
    "user_type": "parent"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_def456uvw",
    "expires_in": 3600,
    "token_type": "Bearer"
  },
  "next_step": "/api/v1/parents/profile"
}
```

**Response (400 Bad Request - Invalid OTP):**
```json
{
  "error": {
    "code": "INVALID_OTP",
    "message": "The OTP code you entered is incorrect",
    "attempts_remaining": 2
  }
}
```

---

#### 2.2.3 Refresh Token

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "refresh_abc123xyz"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

#### 2.2.4 Logout

```
POST /auth/logout
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "refresh_token": "refresh_abc123xyz"
}
```

**Response (204 No Content)**

---

### 2.3 Role-Based Access Control (RBAC)

**User Roles:**
- `parent` - Access to own children and homework
- `teacher` - Access to assigned classes and students
- `admin` - Full system access
- `system` - Internal service-to-service

**Permission Model:**
```
Resource: homework_assignments
  - parent: read (own child only)
  - teacher: read, write (assigned students)
  - admin: read, write, delete (all)

Resource: ai_queries
  - parent: create, read (own only)
  - teacher: none
  - admin: read (all, for monitoring)
```

---

## 3. Parent API Endpoints

### 3.1 Parent Profile

#### 3.1.1 Get Parent Profile

```
GET /parents/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "parent_uuid_001",
  "first_name": "Priya",
  "last_name": "Sharma",
  "email": "priya@example.com",
  "phone": "+919876543210",
  "phone_verified": true,
  "email_verified": false,
  "preferred_language": "en",
  "created_at": "2026-01-15T10:30:00Z",
  "notification_preferences": {
    "email": true,
    "push": true,
    "sms": false
  },
  "privacy_settings": {
    "ai_helper_enabled": false,
    "analytics": true
  }
}
```

---

#### 3.1.2 Update Parent Profile

```
PATCH /parents/me
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "Priya",
  "last_name": "Sharma",
  "email": "priya.new@example.com",
  "preferred_language": "hi",
  "notification_preferences": {
    "email": true,
    "push": true,
    "sms": true
  }
}
```

**Response (200 OK):**
```json
{
  "id": "parent_uuid_001",
  "first_name": "Priya",
  "last_name": "Sharma",
  "email": "priya.new@example.com",
  "email_verified": false,
  "updated_at": "2026-02-18T14:20:00Z"
}
```

---

### 3.2 Child Management

#### 3.2.1 List Children

```
GET /parents/me/children
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "children": [
    {
      "id": "child_uuid_001",
      "first_name": "Riya",
      "date_of_birth": "2020-01-15",
      "age": 6,
      "grade": "Std 1",
      "school": {
        "id": "school_uuid_001",
        "name": "Little Flowers Public School"
      },
      "teacher": {
        "id": "teacher_uuid_001",
        "name": "Mrs. Sharma"
      },
      "avatar_id": 1,
      "is_active": true,
      "created_at": "2026-01-15T11:00:00Z"
    }
  ],
  "total": 1,
  "limit": 3
}
```

---

#### 3.2.2 Create Child Profile

```
POST /parents/me/children
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "Aarav",
  "date_of_birth": "2020-05-20",
  "grade": "Std 1",
  "school_id": "school_uuid_002",
  "teacher_id": "teacher_uuid_005",
  "avatar_id": 2,
  "pronouns": "he/him"
}
```

**Response (201 Created):**
```json
{
  "id": "child_uuid_002",
  "first_name": "Aarav",
  "date_of_birth": "2020-05-20",
  "age": 5,
  "grade": "Std 1",
  "avatar_id": 2,
  "is_active": true,
  "created_at": "2026-02-18T15:00:00Z"
}
```

**Response (422 Unprocessable Entity - Max Children Reached):**
```json
{
  "error": {
    "code": "MAX_CHILDREN_EXCEEDED",
    "message": "You can only add up to 3 children",
    "current_count": 3
  }
}
```

---

#### 3.2.3 Update Child Profile

```
PATCH /children/{child_id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "first_name": "Riya",
  "avatar_id": 5,
  "dashboard_theme": "green_white"
}
```

**Response (200 OK):**
```json
{
  "id": "child_uuid_001",
  "first_name": "Riya",
  "avatar_id": 5,
  "dashboard_theme": "green_white",
  "updated_at": "2026-02-18T15:30:00Z"
}
```

---

### 3.3 Dashboard & Activity

#### 3.3.1 Get Child Dashboard

```
GET /children/{child_id}/dashboard
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "child": {
    "id": "child_uuid_001",
    "first_name": "Riya",
    "avatar_id": 1
  },
  "quick_stats": {
    "stars_total": 450,
    "current_level": 3,
    "current_level_name": "Growing Learner",
    "badges_earned": 12,
    "current_streak_days": 3,
    "homework_pending": 2,
    "attendance_percentage_month": 95.0
  },
  "homework_summary": {
    "pending": [
      {
        "id": "hw_uuid_001",
        "title": "Math - Page 23",
        "subject": "Math",
        "due_date": "2026-02-19",
        "is_overdue": false
      },
      {
        "id": "hw_uuid_002",
        "title": "English - Story Writing",
        "subject": "English",
        "due_date": "2026-02-20",
        "is_overdue": false
      }
    ],
    "total_pending": 2
  },
  "recent_activity": [
    {
      "type": "badge_earned",
      "badge_name": "Week Warrior",
      "timestamp": "2026-02-18T10:00:00Z"
    },
    {
      "type": "homework_completed",
      "homework_title": "Math - Exercise 2.2",
      "stars_earned": 10,
      "timestamp": "2026-02-17T20:30:00Z"
    }
  ],
  "latest_announcement": {
    "id": "ann_uuid_001",
    "title": "Annual Day on March 5th",
    "preview": "We are excited to invite all parents to our Annual Day celebration...",
    "created_at": "2026-02-16T09:00:00Z",
    "is_read": false
  }
}
```

---

### 3.4 Homework

#### 3.4.1 List Homework for Child

```
GET /children/{child_id}/homework
Authorization: Bearer {token}

Query Parameters:
  - status: pending | done (optional)
  - subject: Math | English | General (optional)
  - limit: 20 (default: 20, max: 100)
  - cursor: {pagination_cursor} (optional)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hw_assign_uuid_001",
      "homework": {
        "id": "hw_uuid_001",
        "title": "Complete Exercise 2.3",
        "description": "Complete all questions from pages 23-25 in your textbook.",
        "subject": "Math",
        "assigned_date": "2026-02-18",
        "due_date": "2026-02-20",
        "attachment_urls": [
          "https://cdn.kidspark.app/hw/ref_page_23.pdf"
        ],
        "teacher": {
          "id": "teacher_uuid_001",
          "name": "Mrs. Sharma"
        }
      },
      "status": "pending",
      "marked_done_at": null,
      "submission_files": [],
      "teacher_feedback": null
    }
  ],
  "pagination": {
    "next_cursor": "cursor_abc123",
    "has_more": true
  }
}
```

---

#### 3.4.2 Get Homework Detail

```
GET /homework-assignments/{assignment_id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "hw_assign_uuid_001",
  "homework": {
    "id": "hw_uuid_001",
    "title": "Complete Exercise 2.3",
    "description": "Complete all questions from pages 23-25 in your textbook. Show all working steps clearly.",
    "instructions": "Use pencil and eraser. Double-check your answers.",
    "subject": "Math",
    "assigned_date": "2026-02-18",
    "due_date": "2026-02-20",
    "estimated_time_minutes": 30,
    "reference_pages": "Pages 23-25",
    "attachment_urls": [
      "https://cdn.kidspark.app/hw/ref_page_23.pdf"
    ],
    "teacher": {
      "id": "teacher_uuid_001",
      "name": "Mrs. Sharma",
      "email": "sharma@school.edu"
    }
  },
  "status": "pending",
  "marked_done_at": null,
  "marked_done_by": null,
  "submission_files": [],
  "parent_notes": null,
  "teacher_feedback": null,
  "teacher_feedback_at": null,
  "created_at": "2026-02-18T09:00:00Z"
}
```

---

#### 3.4.3 Mark Homework as Done

```
POST /homework-assignments/{assignment_id}/complete
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "submission_files": [
    "https://cdn.kidspark.app/uploads/child_001_homework_001_page1.jpg",
    "https://cdn.kidspark.app/uploads/child_001_homework_001_page2.jpg"
  ],
  "parent_notes": "Riya worked very hard on this homework!"
}
```

**Response (200 OK):**
```json
{
  "id": "hw_assign_uuid_001",
  "status": "done",
  "marked_done_at": "2026-02-18T20:30:00Z",
  "marked_done_by": "parent_uuid_001",
  "submission_files": [
    "https://cdn.kidspark.app/uploads/child_001_homework_001_page1.jpg",
    "https://cdn.kidspark.app/uploads/child_001_homework_001_page2.jpg"
  ],
  "parent_notes": "Riya worked very hard on this homework!",
  "stars_earned": 10,
  "celebration": {
    "type": "homework_complete",
    "message": "Great job, Riya! You earned 10 stars! ⭐",
    "animation_url": "https://cdn.kidspark.app/animations/star_burst.json"
  }
}
```

**Response (409 Conflict - Already Marked):**
```json
{
  "error": {
    "code": "ALREADY_COMPLETED",
    "message": "This homework is already marked as done",
    "completed_at": "2026-02-18T18:00:00Z"
  }
}
```

---

#### 3.4.4 Undo Homework Completion

```
POST /homework-assignments/{assignment_id}/undo
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "hw_assign_uuid_001",
  "status": "pending",
  "marked_done_at": null,
  "teacher_feedback": null
}
```

---

### 3.5 Attendance

#### 3.5.1 Get Attendance Calendar

```
GET /children/{child_id}/attendance
Authorization: Bearer {token}

Query Parameters:
  - start_date: 2026-02-01 (required)
  - end_date: 2026-02-28 (required)
```

**Response (200 OK):**
```json
{
  "child_id": "child_uuid_001",
  "period": {
    "start_date": "2026-02-01",
    "end_date": "2026-02-28"
  },
  "attendance_records": [
    {
      "date": "2026-02-01",
      "status": "present",
      "notes": null
    },
    {
      "date": "2026-02-02",
      "status": "present",
      "notes": null
    },
    {
      "date": "2026-02-03",
      "status": "present",
      "notes": null
    },
    {
      "date": "2026-02-04",
      "status": "absent",
      "notes": "Sick leave"
    },
    {
      "date": "2026-02-05",
      "status": "leave",
      "notes": "Family function"
    },
    {
      "date": "2026-02-06",
      "status": "holiday",
      "notes": "Weekend"
    }
  ],
  "summary": {
    "total_days": 20,
    "present": 18,
    "absent": 1,
    "leave": 1,
    "holiday": 4,
    "percentage": 95.0
  }
}
```

---

### 3.6 Engagement (Stars, Badges, Streaks)

#### 3.6.1 Get Star Balance

```
GET /children/{child_id}/stars
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "child_id": "child_uuid_001",
  "total_stars": 450,
  "current_level": {
    "level_number": 3,
    "level_name": "Growing Learner",
    "stars_required": 150,
    "next_level_stars": 300,
    "progress_percentage": 70
  },
  "recent_transactions": [
    {
      "stars_earned": 10,
      "reason": "homework_complete",
      "reason_ref_id": "hw_uuid_001",
      "earned_at": "2026-02-18T20:30:00Z"
    },
    {
      "stars_earned": 20,
      "reason": "badge_earned",
      "reason_ref_id": "badge_uuid_005",
      "earned_at": "2026-02-18T10:00:00Z"
    }
  ]
}
```

---

#### 3.6.2 Get Badges

```
GET /children/{child_id}/badges
Authorization: Bearer {token}

Query Parameters:
  - category: consistency | activity | engagement | special (optional)
```

**Response (200 OK):**
```json
{
  "badges_earned": [
    {
      "id": "badge_award_uuid_001",
      "badge": {
        "id": "badge_uuid_001",
        "code": "week_warrior",
        "name": "Week Warrior",
        "description": "Login for 7 days in a row",
        "icon_url": "https://cdn.kidspark.app/badges/week_warrior.svg",
        "category": "consistency",
        "star_reward": 50
      },
      "earned_at": "2026-02-18T10:00:00Z",
      "is_showcased": true
    }
  ],
  "total_earned": 12,
  "badges_available": [
    {
      "id": "badge_uuid_010",
      "code": "month_master",
      "name": "Month Master",
      "description": "Login for 30 days in a row",
      "icon_url": "https://cdn.kidspark.app/badges/month_master_locked.svg",
      "category": "consistency",
      "star_reward": 200,
      "is_locked": true
    }
  ]
}
```

---

#### 3.6.3 Get Streak Status

```
GET /children/{child_id}/streak
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "child_id": "child_uuid_001",
  "current_streak_days": 3,
  "longest_streak_days": 12,
  "last_login_date": "2026-02-18",
  "streak_start_date": "2026-02-16",
  "freeze_cards_remaining": 1,
  "next_milestone": {
    "days": 7,
    "reward": "Week Warrior badge + 50 stars"
  }
}
```

---

### 3.7 Announcements & Messages

#### 3.7.1 List Announcements

```
GET /children/{child_id}/announcements
Authorization: Bearer {token}

Query Parameters:
  - limit: 20 (default: 20, max: 100)
  - cursor: {pagination_cursor} (optional)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "ann_uuid_001",
      "title": "Annual Day Invitation",
      "body": "We are excited to invite all parents to our Annual Day celebration on March 5th at 4 PM...",
      "announcement_type": "celebration",
      "published_at": "2026-02-16T09:00:00Z",
      "attachment_urls": [
        "https://cdn.kidspark.app/announcements/annual_day_invite.pdf"
      ],
      "created_by": {
        "id": "teacher_uuid_001",
        "name": "Mrs. Sharma"
      },
      "is_read": false
    }
  ],
  "unread_count": 3,
  "pagination": {
    "next_cursor": "cursor_xyz789",
    "has_more": false
  }
}
```

---

#### 3.7.2 Mark Announcement as Read

```
POST /announcements/{announcement_id}/read
Authorization: Bearer {token}
```

**Response (204 No Content)**

---

#### 3.7.3 List Messages (Parent-Teacher)

```
GET /children/{child_id}/messages
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "conversations": [
    {
      "conversation_id": "conv_uuid_001",
      "teacher": {
        "id": "teacher_uuid_001",
        "name": "Mrs. Sharma",
        "avatar_url": "https://cdn.kidspark.app/avatars/teacher_001.jpg"
      },
      "last_message": {
        "id": "msg_uuid_045",
        "text": "Great progress on homework!",
        "sender_type": "teacher",
        "created_at": "2026-02-18T15:00:00Z",
        "is_read": false
      },
      "unread_count": 1
    }
  ]
}
```

---

#### 3.7.4 Get Conversation

```
GET /conversations/{conversation_id}
Authorization: Bearer {token}

Query Parameters:
  - limit: 50 (default: 50)
  - cursor: {pagination_cursor} (optional)
```

**Response (200 OK):**
```json
{
  "conversation_id": "conv_uuid_001",
  "participants": [
    {
      "id": "parent_uuid_001",
      "type": "parent",
      "name": "Priya Sharma"
    },
    {
      "id": "teacher_uuid_001",
      "type": "teacher",
      "name": "Mrs. Sharma"
    }
  ],
  "messages": [
    {
      "id": "msg_uuid_045",
      "sender_id": "teacher_uuid_001",
      "sender_type": "teacher",
      "text": "Great progress on homework!",
      "attachment_urls": [],
      "is_read": false,
      "created_at": "2026-02-18T15:00:00Z"
    },
    {
      "id": "msg_uuid_044",
      "sender_id": "parent_uuid_001",
      "sender_type": "parent",
      "text": "Thank you for the feedback!",
      "attachment_urls": [],
      "is_read": true,
      "read_at": "2026-02-18T15:05:00Z",
      "created_at": "2026-02-18T14:30:00Z"
    }
  ],
  "pagination": {
    "next_cursor": null,
    "has_more": false
  }
}
```

---

#### 3.7.5 Send Message

```
POST /conversations/{conversation_id}/messages
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "text": "Hi Mrs. Sharma, I wanted to discuss Riya's math progress.",
  "attachment_urls": []
}
```

**Response (201 Created):**
```json
{
  "id": "msg_uuid_046",
  "conversation_id": "conv_uuid_001",
  "sender_id": "parent_uuid_001",
  "sender_type": "parent",
  "text": "Hi Mrs. Sharma, I wanted to discuss Riya's math progress.",
  "attachment_urls": [],
  "is_read": false,
  "created_at": "2026-02-18T16:00:00Z"
}
```

---

## 4. Teacher API Endpoints

### 4.1 Teacher Dashboard

#### 4.1.1 Get Teacher Dashboard

```
GET /teachers/me/dashboard
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "teacher": {
    "id": "teacher_uuid_001",
    "name": "Mrs. Sharma",
    "classes_taught": ["Std 1-A", "Std 1-B"]
  },
  "quick_stats": {
    "total_students": 56,
    "pending_submissions": 12,
    "homework_completion_rate": 85.5,
    "unread_messages": 3
  },
  "recent_submissions": [
    {
      "id": "hw_assign_uuid_023",
      "student": {
        "id": "child_uuid_001",
        "name": "Riya Sharma",
        "avatar_id": 1
      },
      "homework": {
        "id": "hw_uuid_001",
        "title": "Math - Exercise 2.3"
      },
      "submitted_at": "2026-02-18T20:30:00Z",
      "needs_review": true
    }
  ],
  "upcoming_deadlines": [
    {
      "homework": {
        "id": "hw_uuid_002",
        "title": "English - Story Writing",
        "due_date": "2026-02-19"
      },
      "submissions": {
        "done": 15,
        "total": 28
      }
    }
  ]
}
```

---

### 4.2 Homework Management (Teacher)

#### 4.2.1 Create Homework

```
POST /teachers/me/homework
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Complete Exercise 2.4",
  "description": "Solve all questions from Exercise 2.4 on pages 28-30.",
  "subject": "Math",
  "instructions": "Show all working steps. Use pencil and eraser.",
  "due_date": "2026-02-22",
  "estimated_time_minutes": 45,
  "reference_pages": "Pages 28-30",
  "attachment_urls": [
    "https://cdn.kidspark.app/uploads/teacher_001_ref_ex24.pdf"
  ],
  "assigned_to": {
    "type": "class",
    "class_section": "Std 1-A"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "hw_uuid_005",
  "title": "Complete Exercise 2.4",
  "description": "Solve all questions from Exercise 2.4 on pages 28-30.",
  "subject": "Math",
  "due_date": "2026-02-22",
  "assigned_date": "2026-02-18",
  "assigned_to_count": 28,
  "created_at": "2026-02-18T16:30:00Z"
}
```

---

#### 4.2.2 List Homework (Teacher View)

```
GET /teachers/me/homework
Authorization: Bearer {token}

Query Parameters:
  - status: pending | completed | overdue (optional)
  - subject: Math | English | General (optional)
  - limit: 20 (default: 20)
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hw_uuid_001",
      "title": "Complete Exercise 2.3",
      "subject": "Math",
      "assigned_date": "2026-02-18",
      "due_date": "2026-02-20",
      "assigned_to_count": 28,
      "submissions": {
        "done": 18,
        "pending": 10,
        "overdue": 0
      },
      "completion_percentage": 64.3
    }
  ],
  "pagination": {
    "next_cursor": null,
    "has_more": false
  }
}
```

---

#### 4.2.3 Get Homework Submissions

```
GET /homework/{homework_id}/submissions
Authorization: Bearer {token}

Query Parameters:
  - status: pending | done | overdue (optional)
```

**Response (200 OK):**
```json
{
  "homework": {
    "id": "hw_uuid_001",
    "title": "Complete Exercise 2.3",
    "due_date": "2026-02-20"
  },
  "submissions": [
    {
      "id": "hw_assign_uuid_001",
      "student": {
        "id": "child_uuid_001",
        "name": "Riya Sharma",
        "avatar_id": 1
      },
      "status": "done",
      "submitted_at": "2026-02-19T20:30:00Z",
      "submission_files": [
        "https://cdn.kidspark.app/uploads/child_001_homework_001_page1.jpg"
      ],
      "parent_notes": "Riya worked very hard!",
      "teacher_feedback": "Great work, Riya! ⭐",
      "teacher_feedback_at": "2026-02-20T10:00:00Z"
    }
  ],
  "summary": {
    "total": 28,
    "done": 18,
    "pending": 10,
    "overdue": 0
  }
}
```

---

#### 4.2.4 Give Feedback on Submission

```
POST /homework-assignments/{assignment_id}/feedback
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "feedback": "Excellent work, Riya! You followed all the steps carefully. Keep it up! ⭐",
  "emojis": ["⭐", "🎉"]
}
```

**Response (200 OK):**
```json
{
  "id": "hw_assign_uuid_001",
  "teacher_feedback": "Excellent work, Riya! You followed all the steps carefully. Keep it up! ⭐",
  "feedback_emojis": ["⭐", "🎉"],
  "teacher_feedback_at": "2026-02-20T10:15:00Z"
}
```

---

### 4.3 Attendance (Teacher)

#### 4.3.1 Mark Attendance

```
POST /teachers/me/attendance
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "attendance_date": "2026-02-18",
  "class_section": "Std 1-A",
  "records": [
    {
      "child_id": "child_uuid_001",
      "status": "present",
      "notes": null
    },
    {
      "child_id": "child_uuid_002",
      "status": "absent",
      "notes": "Sick leave"
    },
    {
      "child_id": "child_uuid_003",
      "status": "leave",
      "notes": "Family function"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "attendance_date": "2026-02-18",
  "class_section": "Std 1-A",
  "records_created": 28,
  "summary": {
    "present": 24,
    "absent": 2,
    "leave": 2
  }
}
```

---

#### 4.3.2 Get Class Attendance

```
GET /teachers/me/attendance
Authorization: Bearer {token}

Query Parameters:
  - attendance_date: 2026-02-18 (required)
  - class_section: Std 1-A (required)
```

**Response (200 OK):**
```json
{
  "attendance_date": "2026-02-18",
  "class_section": "Std 1-A",
  "is_locked": false,
  "records": [
    {
      "child_id": "child_uuid_001",
      "child_name": "Riya Sharma",
      "status": "present",
      "notes": null
    },
    {
      "child_id": "child_uuid_002",
      "child_name": "Aarav Patel",
      "status": "absent",
      "notes": "Sick leave"
    }
  ],
  "summary": {
    "present": 24,
    "absent": 2,
    "leave": 2
  }
}
```

---

### 4.4 Student Progress

#### 4.4.1 List Students

```
GET /teachers/me/students
Authorization: Bearer {token}

Query Parameters:
  - class_section: Std 1-A (optional)
  - limit: 50 (default: 50)
```

**Response (200 OK):**
```json
{
  "students": [
    {
      "id": "child_uuid_001",
      "first_name": "Riya",
      "last_name": "Sharma",
      "grade": "Std 1",
      "class_section": "Std 1-A",
      "avatar_id": 1,
      "parent": {
        "id": "parent_uuid_001",
        "name": "Priya Sharma",
        "phone": "+919876543210"
      },
      "quick_stats": {
        "homework_completion_rate": 90.0,
        "attendance_percentage": 95.0,
        "stars_earned": 450
      }
    }
  ],
  "total": 28
}
```

---

#### 4.4.2 Get Student Detail

```
GET /students/{child_id}
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "child_uuid_001",
  "first_name": "Riya",
  "last_name": "Sharma",
  "date_of_birth": "2020-01-15",
  "age": 6,
  "grade": "Std 1",
  "class_section": "Std 1-A",
  "avatar_id": 1,
  "parent": {
    "id": "parent_uuid_001",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+919876543210"
  },
  "engagement_stats": {
    "total_stars": 450,
    "current_level": 3,
    "badges_earned": 12,
    "current_streak_days": 3
  },
  "academic_stats": {
    "homework_assigned": 12,
    "homework_completed": 10,
    "homework_completion_rate": 83.3,
    "attendance_days": 18,
    "total_school_days": 20,
    "attendance_percentage": 90.0
  },
  "recent_activity": [
    {
      "type": "homework_completed",
      "homework_title": "Math - Exercise 2.3",
      "timestamp": "2026-02-18T20:30:00Z"
    }
  ]
}
```

---

#### 4.4.3 Create Progress Report

```
POST /students/{child_id}/progress-reports
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "report_type": "monthly",
  "period_start": "2026-02-01",
  "period_end": "2026-02-28",
  "overall_remarks": "Riya has shown excellent progress this month. She is engaged and participates actively in class.",
  "skills": {
    "reading": {
      "level": "confident",
      "notes": "Reading fluency improving steadily"
    },
    "writing": {
      "level": "developing",
      "notes": "Handwriting is getting neater"
    },
    "math": {
      "level": "confident",
      "notes": "Strong understanding of addition concepts"
    },
    "participation": {
      "level": "flourishing",
      "notes": "Always eager to answer questions"
    }
  },
  "shared_with_parent": true
}
```

**Response (201 Created):**
```json
{
  "id": "report_uuid_001",
  "child_id": "child_uuid_001",
  "report_type": "monthly",
  "period_start": "2026-02-01",
  "period_end": "2026-02-28",
  "overall_remarks": "Riya has shown excellent progress this month...",
  "skills": {
    "reading": {
      "level": "confident",
      "notes": "Reading fluency improving steadily"
    }
  },
  "shared_with_parent": true,
  "shared_at": "2026-02-28T16:00:00Z",
  "created_at": "2026-02-28T16:00:00Z"
}
```

---

### 4.5 Announcements (Teacher)

#### 4.5.1 Create Announcement

```
POST /teachers/me/announcements
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Annual Day Invitation",
  "body": "We are excited to invite all parents to our Annual Day celebration on March 5th at 4 PM in the school auditorium.",
  "announcement_type": "celebration",
  "grade_filter": ["Std 1"],
  "class_filter": ["Std 1-A"],
  "attachment_urls": [
    "https://cdn.kidspark.app/uploads/teacher_001_annual_day_invite.pdf"
  ],
  "scheduled_for": "2026-02-20T09:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "id": "ann_uuid_005",
  "title": "Annual Day Invitation",
  "body": "We are excited to invite all parents...",
  "announcement_type": "celebration",
  "status": "scheduled",
  "scheduled_for": "2026-02-20T09:00:00Z",
  "target_audience_count": 28,
  "created_at": "2026-02-18T17:00:00Z"
}
```

---

## 5. Admin API Endpoints

### 5.1 School Management

#### 5.1.1 Create School

```
POST /admin/schools
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Little Flowers Public School",
  "school_code": "LFPS2026",
  "board": "CBSE",
  "email": "admin@littleflowers.edu",
  "phone": "+919876500000",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "max_students": 500
}
```

**Response (201 Created):**
```json
{
  "id": "school_uuid_005",
  "name": "Little Flowers Public School",
  "school_code": "LFPS2026",
  "is_active": true,
  "created_at": "2026-02-18T18:00:00Z"
}
```

---

### 5.2 Analytics

#### 5.2.1 Get Platform Analytics

```
GET /admin/analytics
Authorization: Bearer {token}

Query Parameters:
  - start_date: 2026-02-01 (required)
  - end_date: 2026-02-28 (required)
```

**Response (200 OK):**
```json
{
  "period": {
    "start_date": "2026-02-01",
    "end_date": "2026-02-28"
  },
  "user_stats": {
    "total_parents": 380,
    "total_teachers": 28,
    "total_students": 450,
    "new_parents": 15,
    "active_parents": 320
  },
  "engagement_stats": {
    "homework_assigned": 245,
    "homework_completed": 210,
    "completion_rate": 85.7,
    "total_logins": 1850,
    "avg_session_duration_minutes": 8.5
  },
  "ai_stats": {
    "total_queries": 1247,
    "helpful_responses": 1050,
    "helpful_rate": 84.2,
    "avg_latency_ms": 3420,
    "flagged_queries": 2
  },
  "system_health": {
    "api_uptime_percentage": 99.97,
    "avg_response_time_ms": 342,
    "error_rate_percentage": 0.12
  }
}
```

---

## 6. AI Helper API

### 6.1 Query AI Helper

```
POST /ai/query
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "child_id": "child_uuid_001",
  "query_text": "Can you explain what carrying over means in addition?",
  "session_id": "ai_session_uuid_001"
}
```

**Response (200 OK - Successful Query):**
```json
{
  "query_id": "ai_query_uuid_001",
  "query_text": "Can you explain what carrying over means in addition?",
  "response": {
    "text": "Great question! 'Carrying over' is when adding two numbers makes a digit greater than 9. Example: 17 + 48. When we add 7 + 8 = 15, we write 5 and 'carry' the 1 to the tens place!",
    "confidence": "high",
    "sources": [
      {
        "book_title": "Mathematics Textbook - Std 1",
        "page_number": 23,
        "chapter": "Addition with Carrying"
      }
    ]
  },
  "safety_status": "passed",
  "latency_ms": 3450,
  "created_at": "2026-02-18T19:00:00Z"
}
```

**Response (200 OK - Query Refused):**
```json
{
  "query_id": "ai_query_uuid_002",
  "query_text": "What is the answer to question 5?",
  "response": {
    "text": "I can't provide direct answers to homework questions. Instead, I can help you understand the concept! Would you like me to explain how to solve this type of problem?",
    "confidence": "refused",
    "sources": []
  },
  "safety_status": "blocked",
  "safety_reason": "Direct homework solution request",
  "latency_ms": 1200,
  "created_at": "2026-02-18T19:05:00Z"
}
```

---

### 6.2 Submit AI Feedback

```
POST /ai/queries/{query_id}/feedback
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "feedback": "helpful",
  "feedback_text": "This explanation was very clear and helped my child understand!"
}
```

**Response (204 No Content)**

---

## 7. File Upload API

### 7.1 Get Upload URL (Pre-signed)

```
POST /uploads/request
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "file_name": "homework_page1.jpg",
  "file_type": "image/jpeg",
  "file_size": 2048576,
  "upload_context": "homework_submission"
}
```

**Response (200 OK):**
```json
{
  "upload_id": "upload_uuid_001",
  "upload_url": "https://kidspark-uploads.s3.amazonaws.com/...",
  "expires_in": 300,
  "max_file_size": 10485760,
  "allowed_types": ["image/jpeg", "image/png", "application/pdf"]
}
```

---

### 7.2 Confirm Upload

```
POST /uploads/{upload_id}/confirm
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "file_url": "https://cdn.kidspark.app/uploads/child_001_homework_001_page1.jpg"
}
```

**Response (200 OK):**
```json
{
  "file_url": "https://cdn.kidspark.app/uploads/child_001_homework_001_page1.jpg",
  "file_size": 2048576,
  "content_type": "image/jpeg",
  "uploaded_at": "2026-02-18T20:00:00Z"
}
```

---

## 8. Webhook & Notifications

### 8.1 Webhook Events

**Available Events:**
```
homework.created
homework.completed
homework.overdue
announcement.published
message.received
attendance.marked
badge.earned
streak.achieved
ai_query.flagged
```

**Webhook Payload Format:**
```json
{
  "event_id": "event_uuid_001",
  "event_type": "homework.completed",
  "timestamp": "2026-02-18T20:30:00Z",
  "data": {
    "homework_assignment_id": "hw_assign_uuid_001",
    "child_id": "child_uuid_001",
    "homework_id": "hw_uuid_001",
    "completed_at": "2026-02-18T20:30:00Z"
  }
}
```

---

### 8.2 Push Notifications

#### 8.2.1 Register Device Token

```
POST /notifications/devices
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "device_token": "fcm_token_abc123xyz",
  "platform": "ios",
  "device_model": "iPhone 13",
  "os_version": "16.2"
}
```

**Response (201 Created):**
```json
{
  "device_id": "device_uuid_001",
  "registered_at": "2026-02-18T21:00:00Z"
}
```

---

#### 8.2.2 Update Notification Preferences

```
PATCH /parents/me/notification-preferences
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "email": true,
  "push": true,
  "sms": false,
  "channels": {
    "homework_assigned": ["email", "push"],
    "homework_overdue": ["email", "push", "sms"],
    "announcement": ["push"],
    "message_received": ["push"],
    "badge_earned": ["push"]
  }
}
```

**Response (200 OK):**
```json
{
  "notification_preferences": {
    "email": true,
    "push": true,
    "sms": false
  },
  "updated_at": "2026-02-18T21:15:00Z"
}
```

---

## 9. Error Handling

### 9.1 Error Response Format

**Standard Error Structure:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "additional_context"
    },
    "request_id": "req_uuid_001",
    "timestamp": "2026-02-18T22:00:00Z"
  }
}
```

### 9.2 Common Error Codes

```
Authentication Errors:
  - INVALID_TOKEN: JWT token invalid or expired
  - TOKEN_EXPIRED: JWT token expired (use refresh token)
  - UNAUTHORIZED: No authentication provided
  - FORBIDDEN: Authenticated but not authorized

Validation Errors:
  - VALIDATION_ERROR: Request body validation failed
  - INVALID_FIELD: Specific field validation error
  - MISSING_REQUIRED_FIELD: Required field missing
  - INVALID_FORMAT: Field format incorrect

Resource Errors:
  - NOT_FOUND: Resource doesn't exist
  - ALREADY_EXISTS: Duplicate resource
  - CONFLICT: Resource state conflict

Business Logic Errors:
  - MAX_CHILDREN_EXCEEDED: Parent has 3 children already
  - ALREADY_COMPLETED: Homework already marked done
  - ATTENDANCE_LOCKED: Attendance sheet locked (>7 days)
  - AI_QUERY_BLOCKED: AI query blocked by safety filter

Rate Limit Errors:
  - RATE_LIMIT_EXCEEDED: Too many requests
  - QUOTA_EXCEEDED: API quota exceeded

System Errors:
  - INTERNAL_ERROR: Unexpected server error
  - SERVICE_UNAVAILABLE: Temporary service outage
  - UPSTREAM_TIMEOUT: Upstream service timeout
```

---

## 10. Rate Limiting & Quotas

### 10.1 Rate Limits

**Default Rate Limits (per user):**
```
Standard Endpoints:
  - Rate: 100 requests per minute
  - Burst: 20 requests per 10 seconds

File Upload:
  - Rate: 10 uploads per minute
  - Max file size: 10 MB per file

AI Query:
  - Rate: 10 queries per hour (per parent)
  - Daily limit: 50 queries

Authentication:
  - OTP Request: 3 per hour (per phone number)
  - Login Attempts: 5 per 15 minutes
```

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
Retry-After: 60
```

---

## Appendix A: API Client Examples

### Curl Example: Login Flow

```bash
# Step 1: Request OTP
curl -X POST https://api.kidspark.app/v1/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "country_code": "+91"
  }'

# Response: {"success": true, "session_id": "sess_abc123"}

# Step 2: Verify OTP
curl -X POST https://api.kidspark.app/v1/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "sess_abc123",
    "otp": "4725"
  }'

# Response: {"access_token": "eyJhbGc...", ...}

# Step 3: Use token for authenticated requests
curl -X GET https://api.kidspark.app/v1/parents/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

### JavaScript Example: Fetch Child Dashboard

```javascript
const API_BASE_URL = 'https://api.kidspark.app/v1';
const ACCESS_TOKEN = 'eyJhbGc...';

async function getChildDashboard(childId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/children/${childId}/dashboard`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
    throw error;
  }
}

// Usage
getChildDashboard('child_uuid_001')
  .then(dashboard => console.log(dashboard))
  .catch(error => console.error(error));
```

---

### Python Example: Mark Homework as Done

```python
import requests

API_BASE_URL = "https://api.kidspark.app/v1"
ACCESS_TOKEN = "eyJhbGc..."

def mark_homework_done(assignment_id, submission_files, notes):
    url = f"{API_BASE_URL}/homework-assignments/{assignment_id}/complete"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "submission_files": submission_files,
        "parent_notes": notes
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        error = response.json()
        raise Exception(error["error"]["message"])

# Usage
result = mark_homework_done(
    assignment_id="hw_assign_uuid_001",
    submission_files=[
        "https://cdn.kidspark.app/uploads/child_001_hw_page1.jpg"
    ],
    notes="Riya worked hard on this!"
)

print(f"Stars earned: {result['stars_earned']}")
```

---

## Appendix B: Postman Collection

**Available at:** `https://api.kidspark.app/v1/docs/postman.json`

Import this collection into Postman for easy API testing with pre-configured:
- Environment variables
- Authentication flows
- Sample requests
- Test scripts

---

**Document Status:** API Specifications v1.0  
**Last Updated:** February 18, 2026  
**API Status:** Development (pending launch)  
**Maintained by:** Backend Engineering Team  
**Support:** api-support@kidspark.app

---

## 11. v2.0 Implementation-Specific APIs (Client-Side)

> **Note (v2.0):** The current implementation is a fully client-side application using `localStorage`. The following documents the *logical* API contracts for the in-browser modules, which matches the REST spec above for future server migration.

### 11.1 RAG Q&A Endpoint (In-Browser)

**Function:** `ragSearch(query, subject)`  
**Module:** `js/rag-data.js`

```
Input:
  query   : string  — natural language question
  subject : string  — 'english' | 'maths' | null (search both)

Output:
  chunk object: { id, subject, unit, title, question, answer }
  OR null if no match found

Algorithm:
  1. Tokenise query into keywords
  2. Score each chunk by keyword overlap via keyword index
  3. Return highest-scoring chunk
  4. Answer rendered with typing animation (40ms/char avg)
```

**Hover Effect API Contract:**
```
Trigger: .chatbot-q:hover
Effect:  translateX(0.25rem) + border-color: --c-green
Timing:  0.18s ease (--tr-fast)
```

**Typing Animation Contract:**
```
speed = max(15ms, min(45ms, 1500ms / plainText.length))
cursor: <span class="cursor"> blinking at 0.8s
Formats: **bold** → <strong>, \n → <br>
```

### 11.2 Time-Limit Lock Endpoint (In-Browser)

**Function:** `KSTimer.onTimeUp()`  
**Module:** `js/timer.js`

```
Trigger: remainingSeconds === 0
Actions:
  1. clearInterval(intervalId)
  2. Save used time to localStorage
  3. Show #time-limit-overlay (full-screen)
  4. Set #section-games: pointer-events=none, opacity=0.5
  5. Display locked state message

Unlock conditions:
  - Parent changes daily time limit via PIN portal
  - New calendar day (auto-reset at midnight)
  - Manual override via Parent Portal settings
```

**Time-Limit Log Structure (localStorage):**
```json
{
  "stats": {
    "timeUsedToday": 2400,
    "lastTimerDate": "Sun Feb 22 2026"
  }
}
```

### 11.3 Parent PIN Verification API (In-Browser)

**Function:** `KSStorage.verifyPin(pin)`  
**Module:** `js/storage.js`

```
Input:  pin : string (4 digits)
Output: boolean

Process:
  1. Load encrypted localStorage data
  2. Compute FNV-1a hash of input PIN
  3. Compare with stored pinHash
  4. Return true if match, false otherwise

Security:
  - PINs never stored in plaintext
  - 3-attempt visual feedback (shake animation)
  - Portal re-locks on navigation away
```

### 11.4 Hover Effects Specification

All interactive element hover effects use CSS transitions with `--tr-fast` (0.18s ease):

| Element | Hover Effect |
|---------|-------------|
| `.home-card` | translateY(-0.4rem) scale(1.03) + shadow-glow |
| `.game-card` | translateY(-0.4rem) scale(1.04) + shadow-glow |
| `.animal-chip` | translateY(-0.3rem) scale(1.06) + border-color:green |
| `.chatbot-q` | translateX(0.25rem) + bg:rgba(green,0.18) |
| `.nav-item` | bg:rgba(cream,0.08) + color:cream |
| `.game-option` | scale(1.02) + border-color:green |
| `.btn-primary` | translateY(-0.125rem) scale(1.02) + shadow boost |

### 11.5 EXP & Gamification API (In-Browser)

**Function:** `KSProfile.awardExp(amount)`

```
Default amount: 15 EXP per completed game
Side effects:
  - Increment stats.exp
  - Increment stats.stars (+1)
  - Check level threshold → show "Level Up!" toast
  - Re-render all profile displays
  - Persist to localStorage (encrypted)

Level thresholds:
  Level 1: 0 EXP    — Little Spark    🌟
  Level 2: 100 EXP  — Curious Mind    🧠
  Level 3: 250 EXP  — Star Reader     📚
  Level 4: 500 EXP  — Math Wizard     🧙
  Level 5: 800 EXP  — Super Spark     ⚡
  Level 6: 1200 EXP — Brain Hero      🦸
  Level 7: 1800 EXP — Knowledge King  👑
```

---

**Document Status:** API Specifications v2.0 (updated with implementation details)  
**Last Updated:** February 22, 2026  
**Implementation:** Client-side HTML/CSS/JavaScript (index.html)  
**Maintained by:** Technetics IT Services  
**Support:** api-support@kidspark.app