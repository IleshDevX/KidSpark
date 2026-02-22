# Database Schema Design
## KidSpark - Complete Data Model

**Version:** 1.0  
**Date:** February 18, 2026  
**Database:** PostgreSQL 15+

---

## Table of Contents
1. [Schema Overview](#1-schema-overview)
2. [User Management Tables](#2-user-management-tables)
3. [Academic Content Tables](#3-academic-content-tables)
4. [Engagement & Gamification Tables](#4-engagement--gamification-tables)
5. [Communication Tables](#5-communication-tables)
6. [AI & RAG Tables](#6-ai--rag-tables)
7. [Audit & Logging Tables](#7-audit--logging-tables)
8. [Indexes & Performance](#8-indexes--performance)
9. [Data Relationships (ERD)](#9-data-relationships-erd)
10. [Migration Strategy](#10-migration-strategy)

---

## 1. Schema Overview

### 1.1 Database Architecture

```
Database: kidspark_production
Schemas:
  - public (default)
  - audit (audit logs, immutable)
  - analytics (aggregated data, separate)

Backup Strategy:
  - Continuous WAL archiving
  - Daily full backup (retained 30 days)
  - Point-in-time recovery capability
  
Encryption:
  - pgcrypto extension for sensitive fields
  - AES-256 encryption at rest (AWS RDS)
  - TLS 1.3 for connections
```

### 1.2 Naming Conventions

```
Tables: snake_case (e.g., child_profiles)
Columns: snake_case (e.g., created_at)
Primary Keys: id (UUID)
Foreign Keys: {table_name}_id (e.g., parent_id)
Indexes: idx_{table}_{column(s)} (e.g., idx_homework_child_id)
Constraints: chk_{table}_{description} (e.g., chk_child_age)
```

---

## 2. User Management Tables

### 2.1 parents

**Purpose:** Parent accounts (account holders)

```sql
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    phone_country_code VARCHAR(5) DEFAULT '+91',
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    
    -- Authentication
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
    privacy_settings JSONB DEFAULT '{"ai_helper_enabled": false, "analytics": true}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_parent_contact CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT chk_parent_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_parents_email ON parents(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_parents_phone ON parents(phone, phone_country_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_parents_last_login ON parents(last_login_at);
```

### 2.2 child_profiles

**Purpose:** Student profiles under parent accounts

```sql
CREATE TABLE child_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    
    -- Basic Info
    first_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    pronouns VARCHAR(50),
    
    -- Academic Info
    grade VARCHAR(20) DEFAULT 'Std 1',
    school_id UUID REFERENCES schools(id),
    teacher_id UUID REFERENCES teachers(id),
    academic_year VARCHAR(10), -- e.g., '2026-27'
    
    -- Personalization
    avatar_id INT DEFAULT 1,
    mascot_variant VARCHAR(50) DEFAULT 'default',
    dashboard_theme VARCHAR(50) DEFAULT 'blue_white',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_child_age CHECK (
        date_of_birth <= CURRENT_DATE - INTERVAL '4 years' 
        AND date_of_birth >= CURRENT_DATE - INTERVAL '8 years'
    ),
    CONSTRAINT chk_child_max_per_parent CHECK (
        (SELECT COUNT(*) FROM child_profiles WHERE parent_id = child_profiles.parent_id AND deleted_at IS NULL) <= 3
    )
);

CREATE INDEX idx_child_parent_id ON child_profiles(parent_id);
CREATE INDEX idx_child_school_id ON child_profiles(school_id);
CREATE INDEX idx_child_teacher_id ON child_profiles(teacher_id);
CREATE INDEX idx_child_active ON child_profiles(is_active, deleted_at);
```

### 2.3 teachers

**Purpose:** Teacher accounts

```sql
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id),
    
    -- Basic Info
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    
    -- Professional Info
    teacher_code VARCHAR(50) UNIQUE,
    classes_taught VARCHAR(100)[], -- e.g., ['Std 1-A', 'Std 1-B']
    subjects_taught VARCHAR(50)[], -- e.g., ['English', 'Math']
    
    -- Authentication
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_teachers_email ON teachers(email) WHERE deleted_at IS NULL;
```

### 2.4 schools

**Purpose:** School entities (multi-tenancy)

```sql
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    board VARCHAR(100), -- e.g., 'CBSE', 'ICSE', 'State Board'
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    
    -- Configuration
    settings JSONB DEFAULT '{
        "attendance_locking_days": 7,
        "homework_archive_days": 90,
        "academic_year_start": "04-01",
        "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }'::jsonb,
    
    -- Subscription (if applicable)
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_valid_until DATE,
    max_students INT DEFAULT 500,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_schools_code ON schools(school_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_active ON schools(is_active, deleted_at);
```

---

## 3. Academic Content Tables

### 3.1 homework

**Purpose:** Homework assignments posted by teachers

```sql
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    school_id UUID NOT NULL REFERENCES schools(id),
    
    -- Content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(50) NOT NULL CHECK (subject IN ('English', 'Math', 'General')),
    instructions TEXT,
    
    -- Targeting
    grade VARCHAR(20) DEFAULT 'Std 1',
    class_section VARCHAR(50), -- e.g., 'Std 1-A'
    assigned_to_all BOOLEAN DEFAULT TRUE,
    
    -- Dates
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    
    -- Attachments
    attachment_urls TEXT[], -- Array of file URLs
    
    -- Metadata
    estimated_time_minutes INT, -- Teacher's estimate
    reference_pages VARCHAR(100), -- e.g., "Pages 23-25"
    
    -- Status
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_homework_dates CHECK (due_date >= assigned_date)
);

CREATE INDEX idx_homework_teacher_id ON homework(teacher_id);
CREATE INDEX idx_homework_school_id ON homework(school_id);
CREATE INDEX idx_homework_dates ON homework(assigned_date, due_date);
CREATE INDEX idx_homework_subject ON homework(subject);
CREATE INDEX idx_homework_active ON homework(is_archived, deleted_at);
```

### 3.2 homework_assignments

**Purpose:** Individual student assignments (many-to-many mapping)

```sql
CREATE TABLE homework_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
    marked_done_at TIMESTAMP WITH TIME ZONE,
    marked_done_by UUID REFERENCES parents(id), -- Which parent marked it
    
    -- Submission
    submission_files TEXT[], -- Array of uploaded file URLs
    parent_notes TEXT,
    
    -- Teacher Feedback
    teacher_feedback TEXT,
    teacher_feedback_at TIMESTAMP WITH TIME ZONE,
    feedback_emojis VARCHAR(50)[], -- e.g., ['⭐', '🎉']
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uq_homework_child UNIQUE (homework_id, child_id)
);

CREATE INDEX idx_hw_assign_homework_id ON homework_assignments(homework_id);
CREATE INDEX idx_hw_assign_child_id ON homework_assignments(child_id);
CREATE INDEX idx_hw_assign_status ON homework_assignments(status);
CREATE INDEX idx_hw_assign_teacher_feedback ON homework_assignments(teacher_feedback_at);
```

### 3.3 attendance

**Purpose:** Daily attendance records

```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    school_id UUID NOT NULL REFERENCES schools(id),
    
    -- Attendance Data
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'leave', 'holiday')),
    
    -- Notes
    teacher_notes TEXT,
    
    -- Lock Mechanism
    is_locked BOOLEAN DEFAULT FALSE,
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by UUID REFERENCES teachers(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uq_attendance_child_date UNIQUE (child_id, attendance_date),
    CONSTRAINT chk_attendance_date CHECK (attendance_date <= CURRENT_DATE)
);

CREATE INDEX idx_attendance_child_id ON attendance(child_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_school_date ON attendance(school_id, attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### 3.4 progress_reports

**Purpose:** Teacher qualitative progress assessments

```sql
CREATE TABLE progress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    
    -- Report Period
    report_type VARCHAR(50) CHECK (report_type IN ('weekly', 'monthly', 'term', 'annual')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Qualitative Feedback
    overall_remarks TEXT,
    
    -- Skill Indicators (JSON for flexibility)
    skills JSONB DEFAULT '{
        "reading": {"level": "emerging", "notes": ""},
        "writing": {"level": "emerging", "notes": ""},
        "math": {"level": "emerging", "notes": ""},
        "participation": {"level": "emerging", "notes": ""}
    }'::jsonb,
    -- Levels: emerging, developing, confident, flourishing
    
    -- Engagement Metrics (factual, not evaluative)
    attendance_percentage DECIMAL(5, 2),
    homework_completion_count INT,
    total_homework_assigned INT,
    
    -- Parent Visibility
    shared_with_parent BOOLEAN DEFAULT FALSE,
    shared_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_child_id ON progress_reports(child_id);
CREATE INDEX idx_progress_teacher_id ON progress_reports(teacher_id);
CREATE INDEX idx_progress_period ON progress_reports(period_start, period_end);
CREATE INDEX idx_progress_type ON progress_reports(report_type);
```

---

## 4. Engagement & Gamification Tables

### 4.1 star_transactions

**Purpose:** Record all star earnings (immutable ledger)

```sql
CREATE TABLE star_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    
    -- Transaction Details
    stars_earned INT NOT NULL CHECK (stars_earned > 0),
    reason VARCHAR(100) NOT NULL, -- 'homework_complete', 'daily_login', 'badge_earned', etc.
    reason_ref_id UUID, -- Reference to homework_id, badge_id, etc.
    
    -- Metadata
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_star_trans_child_id ON star_transactions(child_id);
CREATE INDEX idx_star_trans_reason ON star_transactions(reason);
CREATE INDEX idx_star_trans_earned_at ON star_transactions(earned_at);

-- Materialized view for current star balance
CREATE MATERIALIZED VIEW child_star_balances AS
SELECT 
    child_id,
    SUM(stars_earned) AS total_stars,
    MAX(earned_at) AS last_earned_at
FROM star_transactions
GROUP BY child_id;

CREATE UNIQUE INDEX idx_star_balance_child ON child_star_balances(child_id);
```

### 4.2 badges

**Purpose:** Badge definitions (master table)

```sql
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Badge Info
    badge_code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'week_warrior', 'reading_champ'
    name VARCHAR(100) NOT NULL, -- Display name
    description TEXT,
    icon_url VARCHAR(255), -- Badge image
    
    -- Earning Criteria (JSON for flexibility)
    criteria JSONB NOT NULL,
    -- Example: {"type": "streak", "days": 7}
    -- Example: {"type": "homework", "count": 10, "subject": "English"}
    
    -- Rewards
    star_reward INT DEFAULT 0,
    
    -- Badge Category
    category VARCHAR(50) CHECK (category IN ('consistency', 'activity', 'engagement', 'special', 'attendance')),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_active ON badges(is_active);
```

### 4.3 child_badges

**Purpose:** Badges earned by children

```sql
CREATE TABLE child_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id),
    
    -- Earning Context
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    earned_context JSONB, -- Additional metadata about how it was earned
    
    -- Display
    is_showcased BOOLEAN DEFAULT FALSE, -- Featured in profile
    
    -- Constraints
    CONSTRAINT uq_child_badge UNIQUE (child_id, badge_id)
);

CREATE INDEX idx_child_badges_child_id ON child_badges(child_id);
CREATE INDEX idx_child_badges_earned_at ON child_badges(earned_at);
```

### 4.4 levels

**Purpose:** Level progression definitions

```sql
CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Level Info
    level_number INT UNIQUE NOT NULL,
    level_name VARCHAR(100), -- e.g., "Spark Starter", "Bright Learner"
    stars_required INT NOT NULL,
    
    -- Rewards
    mascot_variant VARCHAR(100), -- New Sparky variant unlocked
    theme_unlocked VARCHAR(100), -- Dashboard theme
    avatar_accessories TEXT[], -- New avatar items
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_levels_number ON levels(level_number);

-- View to calculate current level for each child
CREATE VIEW child_current_levels AS
SELECT 
    cb.child_id,
    cb.total_stars,
    COALESCE(MAX(l.level_number), 1) AS current_level,
    l.level_name,
    COALESCE(
        (SELECT MIN(stars_required) FROM levels WHERE stars_required > cb.total_stars),
        (SELECT MAX(stars_required) FROM levels)
    ) AS next_level_stars
FROM child_star_balances cb
LEFT JOIN levels l ON cb.total_stars >= l.stars_required
GROUP BY cb.child_id, cb.total_stars, l.level_name;
```

### 4.5 streaks

**Purpose:** Login streak tracking

```sql
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    
    -- Streak Data
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_login_date DATE,
    streak_start_date DATE,
    
    -- Freeze Cards (grace mechanism)
    freeze_cards_remaining INT DEFAULT 0,
    freeze_card_last_earned DATE,
    
    -- Metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uq_streak_child_id UNIQUE (child_id)
);

CREATE INDEX idx_streaks_child_id ON streaks(child_id);
CREATE INDEX idx_streaks_last_login ON streaks(last_login_date);
```

---

## 5. Communication Tables

### 5.1 announcements

**Purpose:** Teacher/school announcements to parents

```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id),
    created_by UUID NOT NULL REFERENCES teachers(id),
    
    -- Content
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    announcement_type VARCHAR(50) CHECK (announcement_type IN ('general', 'important', 'celebration', 'academic')),
    
    -- Targeting
    grade_filter VARCHAR(20)[], -- e.g., ['Std 1', 'Std 2']
    class_filter VARCHAR(50)[], -- e.g., ['Std 1-A']
    specific_children UUID[], -- Array of child_ids (if targeted)
    
    -- Attachments
    attachment_urls TEXT[],
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'expired')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_published_at ON announcements(published_at);
CREATE INDEX idx_announcements_type ON announcements(announcement_type);
CREATE INDEX idx_announcements_status ON announcements(status);
```

### 5.2 announcement_reads

**Purpose:** Track which parents have read announcements

```sql
CREATE TABLE announcement_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    
    -- Read Data
    read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uq_announcement_read UNIQUE (announcement_id, parent_id)
);

CREATE INDEX idx_announcement_reads_parent ON announcement_reads(parent_id);
CREATE INDEX idx_announcement_reads_announcement ON announcement_reads(announcement_id);
```

### 5.3 messages

**Purpose:** Direct parent-teacher messaging

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL, -- Groups messages in thread
    
    -- Participants
    sender_id UUID NOT NULL, -- Can be parent_id or teacher_id
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('parent', 'teacher')),
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('parent', 'teacher')),
    
    -- Content
    message_text TEXT NOT NULL,
    attachment_urls TEXT[],
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 5.4 ptm_slots

**Purpose:** Parent-Teacher Meeting scheduling

```sql
CREATE TABLE ptm_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    
    -- Slot Info
    ptm_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    mode VARCHAR(50) CHECK (mode IN ('in_person', 'video_call', 'phone_call')),
    
    -- Booking
    booked_by_parent UUID REFERENCES parents(id),
    booked_for_child UUID REFERENCES child_profiles(id),
    booked_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'completed', 'cancelled')),
    
    -- Meeting Link (if video)
    meeting_link VARCHAR(255),
    
    -- Notes
    parent_notes TEXT,
    teacher_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ptm_school_id ON ptm_slots(school_id);
CREATE INDEX idx_ptm_teacher_id ON ptm_slots(teacher_id);
CREATE INDEX idx_ptm_date ON ptm_slots(ptm_date);
CREATE INDEX idx_ptm_status ON ptm_slots(status);
CREATE INDEX idx_ptm_parent ON ptm_slots(booked_by_parent);
```

---

## 6. AI & RAG Tables

### 6.1 ai_queries

**Purpose:** Log all AI helper queries (compliance & improvement)

```sql
CREATE TABLE ai_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User Context
    parent_id UUID NOT NULL REFERENCES parents(id),
    child_id UUID REFERENCES child_profiles(id),
    session_id UUID, -- Links queries in same session
    
    -- Query Data
    query_text TEXT NOT NULL,
    query_text_corrected TEXT, -- After spell check
    subject_classification VARCHAR(50), -- 'english', 'math', 'unclear'
    intent_classification VARCHAR(50), -- 'concept_explanation', 'homework_solution', etc.
    
    -- Safety
    safety_pre_check_status VARCHAR(50) DEFAULT 'passed' CHECK (
        safety_pre_check_status IN ('passed', 'blocked', 'flagged')
    ),
    safety_pre_check_reason TEXT,
    safety_post_check_status VARCHAR(50) DEFAULT 'passed',
    
    -- Retrieval (RAG)
    retrieved_chunks JSONB, -- Array of retrieved chunk metadata
    top_chunk_relevance_score DECIMAL(3, 2),
    avg_relevance_score DECIMAL(3, 2),
    
    -- Generation (LLM)
    model_name VARCHAR(100),
    model_temperature DECIMAL(3, 2),
    tokens_prompt INT,
    tokens_response INT,
    generation_latency_ms INT,
    
    -- Response
    response_text TEXT,
    response_confidence VARCHAR(20) CHECK (response_confidence IN ('high', 'medium', 'low', 'refused')),
    response_sources JSONB, -- Array of source citations
    
    -- User Feedback
    user_feedback VARCHAR(50) CHECK (user_feedback IN ('helpful', 'not_helpful', NULL)),
    user_feedback_text TEXT,
    user_feedback_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance
    total_latency_ms INT,
    cached BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_queries_parent_id ON ai_queries(parent_id);
CREATE INDEX idx_ai_queries_child_id ON ai_queries(child_id);
CREATE INDEX idx_ai_queries_created_at ON ai_queries(created_at);
CREATE INDEX idx_ai_queries_subject ON ai_queries(subject_classification);
CREATE INDEX idx_ai_queries_feedback ON ai_queries(user_feedback);
CREATE INDEX idx_ai_queries_safety ON ai_queries(safety_pre_check_status, safety_post_check_status);
```

### 6.2 rag_content

**Purpose:** Metadata about indexed RAG content (not full vectors)

```sql
CREATE TABLE rag_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content Identification
    book_title VARCHAR(255) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    page_number INT,
    chapter_number INT,
    chapter_title VARCHAR(255),
    
    -- Chunk Info
    chunk_type VARCHAR(50), -- 'page', 'concept', 'example'
    chunk_text TEXT NOT NULL,
    concept_keywords TEXT[],
    
    -- Versioning
    curriculum_version VARCHAR(50) NOT NULL,
    indexed_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Vector DB Reference
    vector_db_id VARCHAR(255) UNIQUE, -- ID in Weaviate/Pinecone
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rag_content_book ON rag_content(book_title);
CREATE INDEX idx_rag_content_subject ON rag_content(subject);
CREATE INDEX idx_rag_content_page ON rag_content(page_number);
CREATE INDEX idx_rag_content_version ON rag_content(curriculum_version, is_active);
```

---

## 7. Audit & Logging Tables

### 7.1 audit_logs

**Purpose:** Immutable audit trail (schema: audit)

```sql
CREATE TABLE audit.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who & When
    user_id UUID, -- Can be parent_id, teacher_id, admin_id
    user_type VARCHAR(50), -- 'parent', 'teacher', 'admin', 'system'
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- What
    action_type VARCHAR(100) NOT NULL, -- 'login', 'view', 'create', 'update', 'delete'
    entity_type VARCHAR(100) NOT NULL, -- 'homework', 'attendance', 'profile', etc.
    entity_id UUID,
    
    -- How
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    
    -- Details
    action_details JSONB, -- Flexible payload (before/after values, etc.)
    
    -- Result
    status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'failure', 'error')),
    error_message TEXT
);

-- Immutable: No updates or deletes allowed
CREATE RULE no_update_audit_logs AS ON UPDATE TO audit.audit_logs DO INSTEAD NOTHING;
CREATE RULE no_delete_audit_logs AS ON DELETE TO audit.audit_logs DO INSTEAD NOTHING;

CREATE INDEX idx_audit_logs_user ON audit.audit_logs(user_id, user_type);
CREATE INDEX idx_audit_logs_timestamp ON audit.audit_logs(action_timestamp);
CREATE INDEX idx_audit_logs_action_type ON audit.audit_logs(action_type);
CREATE INDEX idx_audit_logs_entity ON audit.audit_logs(entity_type, entity_id);

-- Partition by month for performance
CREATE TABLE audit.audit_logs_2026_02 PARTITION OF audit.audit_logs
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 7.2 parent_activity_logs

**Purpose:** Parent-specific activity tracking (separate for easy export)

```sql
CREATE TABLE parent_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    
    -- Activity
    activity_type VARCHAR(100) NOT NULL, -- 'login', 'view_dashboard', 'mark_homework', 'ai_query', etc.
    activity_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Context
    child_id UUID REFERENCES child_profiles(id),
    related_entity_type VARCHAR(100), -- 'homework', 'announcement', etc.
    related_entity_id UUID,
    
    -- Technical
    ip_address INET,
    device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
    
    -- Metadata
    details JSONB
);

CREATE INDEX idx_parent_activity_parent_id ON parent_activity_logs(parent_id);
CREATE INDEX idx_parent_activity_timestamp ON parent_activity_logs(activity_timestamp);
CREATE INDEX idx_parent_activity_type ON parent_activity_logs(activity_type);
```

---

## 8. Indexes & Performance

### 8.1 Query Optimization Indexes

**Most Frequen Queries & Their Optimizations:**

```sql
-- 1. Parent Dashboard (fetch all pending homework for child)
CREATE INDEX idx_homework_child_pending ON homework_assignments(child_id, status) 
WHERE status = 'pending';

-- 2. Teacher view (all submissions for a homework)
CREATE INDEX idx_homework_submissions ON homework_assignments(homework_id, status, marked_done_at);

-- 3. Streak calculation (login activity)
CREATE INDEX idx_streaks_active ON streaks(child_id, last_login_date)
WHERE current_streak_days > 0;

-- 4. AI query performance analysis
CREATE INDEX idx_ai_queries_latency ON ai_queries(created_at, total_latency_ms)
WHERE total_latency_ms > 5000; -- Slow queries only

-- 5. Unread announcements for parent
CREATE INDEX idx_unread_announcements ON announcement_reads(parent_id)
WHERE read_at IS NULL;
```

### 8.2 Partitioning Strategy

**Large Tables Candidates:**

```sql
-- audit_logs: Partition by month
CREATE TABLE audit.audit_logs (
    -- columns...
) PARTITION BY RANGE (action_timestamp);

-- ai_queries: Partition by quarter (high volume expected)
CREATE TABLE ai_queries_2026_q1 PARTITION OF ai_queries
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

-- star_transactions: Partition by year
CREATE TABLE star_transactions_2026 PARTITION OF star_transactions
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

---

## 9. Data Relationships (ERD)

**Core Entity Relationships:**

```
┌──────────────┐
│   Schools    │
└──────┬───────┘
       │
       ├──────┐
       │      │
       ▼      ▼
┌──────────┐ ┌──────────────┐
│ Teachers │ │Child Profiles│◄───┐
└────┬─────┘ └──────┬───────┘    │
     │              │             │
     │              ▼             │
     │        ┌──────────────┐   │
     │        │   Parents    │───┘
     │        └──────────────┘
     │
     ├───────┬────────┬─────────────┬──────────────┐
     │       │        │             │              │
     ▼       ▼        ▼             ▼              ▼
┌────────┐ ┌────────┐ ┌─────────┐ ┌────────────┐ ┌────────┐
│Homework│ │Progress│ │Attendance│ │Announcements│ │Messages│
│        │ │Reports │ │          │ │            │ │        │
└───┬────┘ └────────┘ └──────────┘ └────────────┘ └────────┘
    │
    ▼
┌────────────────────┐
│Homework Assignments│◄──────────┐
└────────────────────┘           │
                                 │
┌─────────────────────────────┐  │
│   Engagement Tables         │  │
├─────────────────────────────┤  │
│ • star_transactions         │──┘
│ • child_badges              │
│ • streaks                   │
│ • levels                    │
└─────────────────────────────┘

┌─────────────────────────────┐
│   AI Tables                 │
├─────────────────────────────┤
│ • ai_queries                │
│ • rag_content               │
└─────────────────────────────┘
```

---

## 10. Migration Strategy

### 10.1 Initial Schema Setup

```sql
-- Step 1: Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create schemas
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Step 3: Create tables in order (respecting foreign keys)
-- Order: schools → teachers → parents → child_profiles → rest

-- Step 4: Seed master data
INSERT INTO badges (badge_code, name, description, criteria, star_reward, category)
VALUES 
    ('week_warrior', 'Week Warrior', '7-day login streak', '{"type":"streak","days":7}'::jsonb, 50, 'consistency'),
    ('homework_hero', 'Homework Hero', 'Complete 10 homework', '{"type":"homework","count":10}'::jsonb, 100, 'activity'),
    -- ... more badges

INSERT INTO levels (level_number, level_name, stars_required, mascot_variant)
VALUES 
    (1, 'Spark Starter', 0, 'default'),
    (2, 'Bright Beginner', 50, 'blue'),
    (3, 'Growing Learner', 150, 'green'),
    -- ... more levels
```

### 10.2 Data Migration (If from existing system)

```sql
-- Example: Migrate from legacy system

-- Mapping old IDs to new UUIDs
CREATE TEMP TABLE id_mappings (
    old_student_id INT,
    new_child_id UUID
);

-- Migrate in transaction
BEGIN;

-- Import students
INSERT INTO child_profiles (id, first_name, date_of_birth, parent_id)
SELECT 
    uuid_generate_v4(),
    old_first_name,
    old_dob,
    get_or_create_parent(old_parent_email)
FROM legacy_students
RETURNING id, legacy_id INTO id_mappings;

-- Import historical homework
INSERT INTO homework_assignments (homework_id, child_id, status, marked_done_at)
SELECT 
    h.id,
    m.new_child_id,
    CASE WHEN l.completed THEN 'done' ELSE 'pending' END,
    l.completed_date
FROM legacy_homework l
JOIN homework h ON h.legacy_id = l.homework_id
JOIN id_mappings m ON m.old_student_id = l.student_id;

COMMIT;
```

### 10.3 Version Control

```sql
-- Migration tracking table
CREATE TABLE schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example migration
-- V001__initial_schema.sql
-- V002__add_ai_tables.sql
-- V003__add_partitioning.sql

-- Track migrations
INSERT INTO schema_migrations (version, description)
VALUES ('V001', 'Initial schema setup');
```

---

## Appendix A: Sample Queries

### Common Operations

```sql
-- 1. Fetch parent dashboard data (all pending homework for child)
SELECT 
    h.id,
    h.title,
    h.subject,
    h.due_date,
    ha.status,
    t.first_name AS teacher_name
FROM homework_assignments ha
JOIN homework h ON ha.homework_id = h.id
LEFT JOIN teachers t ON h.teacher_id = t.id
WHERE ha.child_id = 'child-uuid'
  AND ha.status = 'pending'
  AND h.deleted_at IS NULL
ORDER BY h.due_date ASC;

-- 2. Calculate child's current level
SELECT 
    cp.id,
    cp.first_name,
    csb.total_stars,
    ccl.current_level,
    ccl.level_name,
    ccl.next_level_stars
FROM child_profiles cp
JOIN child_star_balances csb ON cp.id = csb.child_id
JOIN child_current_levels ccl ON cp.id = ccl.child_id
WHERE cp.id = 'child-uuid';

-- 3. Monthly attendance percentage
SELECT 
    child_id,
    DATE_TRUNC('month', attendance_date) AS month,
    COUNT(*) FILTER (WHERE status = 'present') AS present_days,
    COUNT(*) AS total_days,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'present')::NUMERIC / 
        COUNT(*)::NUMERIC * 100, 
        2
    ) AS attendance_percentage
FROM attendance
WHERE child_id = 'child-uuid'
  AND attendance_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND status != 'holiday'
GROUP BY child_id, DATE_TRUNC('month', attendance_date);

-- 4. AI helper usage statistics (monthly)
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_queries,
    COUNT(*) FILTER (WHERE response_confidence = 'high') AS high_confidence,
    COUNT(*) FILTER (WHERE user_feedback = 'helpful') AS helpful_responses,
    ROUND(AVG(total_latency_ms), 0) AS avg_latency_ms
FROM ai_queries
WHERE parent_id = 'parent-uuid'
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 5. Teacher's class engagement summary
SELECT 
    cp.id,
    cp.first_name,
    COUNT(DISTINCT ha.id) FILTER (WHERE ha.status = 'done') AS homework_completed,
    COUNT(DISTINCT ha.id) AS homework_assigned,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'present') AS days_present,
    COUNT(DISTINCT a.id) AS total_days,
    COALESCE(csb.total_stars, 0) AS total_stars
FROM child_profiles cp
LEFT JOIN homework_assignments ha ON cp.id = ha.child_id
LEFT JOIN attendance a ON cp.id = a.child_id
LEFT JOIN child_star_balances csb ON cp.id = csb.child_id
WHERE cp.teacher_id = 'teacher-uuid'
  AND cp.is_active = TRUE
  AND cp.deleted_at IS NULL
GROUP BY cp.id, cp.first_name, csb.total_stars
ORDER BY cp.first_name;
```

---

## Appendix B: Backup & Recovery

```sql
-- Full backup (daily)
pg_dump -h localhost -U kidspark_user -Fc kidspark_production > backup_$(date +%Y%m%d).dump

-- Restore from backup
pg_restore -h localhost -U kidspark_user -d kidspark_production backup_20260218.dump

-- Point-in-time recovery (using WAL archives)
SELECT pg_create_restore_point('before_data_migration');

-- If issue occurs, restore to point
-- (requires WAL archiving enabled)
```

---

**Document Status:** Database Schema v1.0  
**Last Updated:** February 18, 2026  
**Database Version:** PostgreSQL 15.4  
**Schema Maintainer:** Backend Engineering Team

---

## 11. v2.0 Client-Side Data Model (localStorage)

> **Implementation Note:** KidSpark v2.0 is a standalone frontend application. All data is stored in the browser's `localStorage` as a single encrypted JSON object under the key `ks_user_v1`.

### 11.1 User Record Structure

```json
{
  "email": "parent@example.com",
  "passwordHash": "fnv1a fingerprint (base36)",
  "pinHash": "fnv1a fingerprint (base36)",
  "childName": "Riya",
  "timeLimit": 60,
  "currentSection": "home",
  "stats": {
    "exp": 150,
    "stars": 10,
    "lives": 18,
    "loginDays": 5,
    "loginStreak": 3,
    "lastLogin": "Mon Feb 22 2026",
    "gamesPlayed": 7,
    "timeUsedToday": 1200,
    "lastTimerDate": "Mon Feb 22 2026"
  }
}
```

### 11.2 Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Parent email (unique identifier) |
| `passwordHash` | string | FNV-1a hash of password (never plaintext) |
| `pinHash` | string | FNV-1a hash of 4-digit parent PIN |
| `childName` | string | Child's first name for personalization |
| `timeLimit` | integer | Daily time limit in minutes |
| `currentSection` | string | Last visited section (for page persistence) |
| `stats.exp` | integer | Total Experience Points (starts at 0) |
| `stats.stars` | integer | Total stars earned (+1 per game completed) |
| `stats.lives` | integer | Current lives (0-20, auto-recharge) |
| `stats.loginDays` | integer | Total days app was opened |
| `stats.loginStreak` | integer | Consecutive days streak |
| `stats.lastLogin` | string | Date string of last login |
| `stats.gamesPlayed` | integer | Total games completed |
| `stats.timeUsedToday` | integer | Seconds used today |
| `stats.lastTimerDate` | string | Date string of last timer reset |

### 11.3 Encryption

The entire JSON is encrypted using XOR cipher + Base64 before storage:

```javascript
encrypt(text) {
  const key = 'KidSpark_2026_SecureKey!';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
}
```

### 11.4 RAG Data Store

The `js/rag-data.js` file exports:
- `RAG_DATA.english` — array of ~50 Q&A chunks from English Question Book
- `RAG_DATA.maths` — array of ~50 Q&A chunks from Mathematics Question Book
- `DAILY_TIPS` — array of 10 motivational tips
- `ragSearch(query, subject)` — keyword-based search function

Each chunk structure:
```json
{
  "id": "en-unit1-q1",
  "subject": "english",
  "unit": "Unit 1",
  "title": "My Body",
  "question": "What do we see with?",
  "answer": "We SEE with our EYES...",
  "keywords": ["see", "eyes", "body"]
}
```

---

**Document Status:** Database Schema v2.0 (updated with localStorage model)  
**Last Updated:** February 22, 2026  
**Implementation:** Client-side localStorage (encrypted JSON)  
**Schema Maintainer:** Technetics IT Services
