# Governance & Compliance Mapping
## KidSpark - Regulatory and Ethical Compliance Framework

**Version:** 1.0  
**Date:** February 18, 2026  
**Purpose:** Compliance with global regulations and ethical AI standards

---

## Table of Contents
1. [Compliance Overview](#1-compliance-overview)
2. [COPPA Compliance (USA)](#2-coppa-compliance-usa)
3. [GDPR Compliance (EU)](#3-gdpr-compliance-eu)
4. [India Data Protection Laws](#4-india-data-protection-laws)
5. [Educational Data Privacy](#5-educational-data-privacy)
6. [Ethical AI Framework](#6-ethical-ai-framework)
7. [Child Safety Standards](#7-child-safety-standards)
8. [Accessibility Compliance](#8-accessibility-compliance)
9. [Audit & Accountability](#9-audit--accountability)
10. [Incident Response](#10-incident-response)

---

## 1. Compliance Overview

### 1.1 Applicable Regulations & Standards

| Regulation/Standard | Jurisdiction | Applicability | Status |
|---------------------|--------------|---------------|--------|
| **COPPA** | USA | Children under 13 | ✓ Compliant |
| **GDPR** | EU | Data privacy | ✓ Compliant |
| **Digital Personal Data Protection Act 2023** | India | Data protection | ✓ Compliant |
| **FERPA** | USA | Educational records | ⚠️ Partial (if US expansion) |
| **WCAG 2.1 Level AA** | Global | Accessibility | ✓ Compliant |
| **ISO 27001** | Global | Information security | 🔄 In Progress |
| **UNESCO AI Ethics** | Global | Ethical AI | ✓ Aligned |

### 1.2 Compliance by Design Principles

1. **Privacy by Default**: Minimal data collection, max privacy settings
2. **Transparency**: Clear communication about data usage
3. **Parental Control**: Parents as gatekeepers of child data
4. **Purpose Limitation**: Data used only for stated educational purposes
5. **Data Minimization**: Collect only what's necessary
6. **Right to be Forgotten**: Easy data deletion mechanisms

---

## 2. COPPA Compliance (USA)

### 2.1 COPPA Requirements Overview

**Children's Online Privacy Protection Act** applies to children under 13.

**Key Requirements:**
1. Verifiable parental consent before collecting child data
2. Clear privacy policy
3. No conditioning participation on excessive information disclosure
4. Right to review and delete child's information
5. Secure data storage

### 2.2 KidSpark COPPA Implementation

#### 2.2.1 Verifiable Parental Consent

**Mechanism:** Parent creates account first, then child profile

```
Compliance Mapping:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPPA Requirement: Verifiable parental consent

KidSpark Implementation:
✓ Parent registers with email/phone OTP verification
✓ Parent explicitly creates child profile (consent implied)
✓ Consent dated and logged
✓ Parent can revoke consent by deleting profile

Evidence:
- Parent account creation timestamp
- IP address and device info logged
- Consent checkbox: "I am the parent/guardian and consent
  to my child's information being used for educational purposes"
```

#### 2.2.2 Privacy Policy Accessibility

```
Compliance Mapping:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPPA Requirement: Clear privacy policy accessible to parents

KidSpark Implementation:
✓ Privacy policy linked on registration page
✓ Plain language summary (no legalese)
✓ Available in multiple languages
✓ Version tracking (parents notified of changes)

Location:
- Registration screen: "Privacy Policy" link
- Settings > Privacy
- Footer of every page
```

#### 2.2.3 Data Collection Disclosure

**What We Collect:**
```
From Children (via parent):
- First name only (no last name required)
- Age/date of birth
- Grade level (Std 1)
- Avatar selection

From Parents:
- Email/phone (authentication)
- Parent name (optional)

Activity Data:
- Homework completion timestamps
- Login activity
- Badge/star progress
- AI query history (parent-initiated)

What We DON'T Collect:
✗ Child's photograph
✗ Child's precise geolocation
✗ Child's contact details
✗ Biometric data
✗ Social security numbers
✗ Home address
```

#### 2.2.4 Parental Rights

```
Compliance Mapping:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPPA Requirement: Parents can review, delete, refuse further collection

KidSpark Implementation:
✓ Settings > Download My Data (JSON export)
✓ Settings > Delete Child Profile (7-day grace, then permanent)
✓ Settings > Privacy Controls (pause data collection)
✓ Support email for manual requests

Process:
1. Parent navigates to Settings
2. Selects "Download Data" or "Delete Profile"
3. Confirmation dialog with consequences explained
4. Action executed within 24 hours
5. Email confirmation sent
```

#### 2.2.5 Security Safeguards

```
Compliance Mapping:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPPA Requirement: Reasonable security procedures

KidSpark Implementation:
✓ AES-256 encryption at rest
✓ TLS 1.3 in transit
✓ Regular security audits
✓ Penetration testing (annual)
✓ Access controls (role-based)
✓ Audit logging (immutable)

Certifications:
- SOC 2 Type II (target within 12 months)
- ISO 27001 (target within 18 months)
```

---

## 3. GDPR Compliance (EU)

### 3.1 GDPR Principles & KidSpark Alignment

#### 3.1.1 Lawful Basis for Processing

**GDPR Article 6:** Lawful basis required

**KidSpark Basis:** 
- **Consent** (parental consent for child data)
- **Legitimate Interest** (educational progress reporting)

```
Data Processing Record:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Purpose: Track homework completion
Lawful Basis: Parental consent
Data: Homework status, timestamps
Retention: Duration of account + 90 days
Recipients: Parent, teacher

Purpose: AI query processing
Lawful Basis: Parental consent (explicit opt-in)
Data: Query text, response, logs
Retention: 1 year
Recipients: Parent only (not shared)
```

#### 3.1.2 Data Subject Rights

| GDPR Right | KidSpark Implementation | Access Method |
|------------|------------------------|---------------|
| **Right to Access** | Download all data in JSON/PDF | Settings > Download Data |
| **Right to Rectification** | Edit child profile anytime | Settings > Edit Profile |
| **Right to Erasure** | Delete profile (30-day grace) | Settings > Delete Account |
| **Right to Data Portability** | Export in machine-readable format | Settings > Download Data (JSON) |
| **Right to Object** | Opt-out of optional features | Settings > Privacy Preferences |
| **Right to Restrict Processing** | Pause account (data retained, no active use) | Settings > Pause Account |

#### 3.1.3 Privacy by Design

**GDPR Article 25:** Data protection by design and default

```
KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design Phase:
✓ Data minimization in every feature design
✓ Privacy impact assessments (PIAs) for new features
✓ Security architecture review before development

Default Settings:
✓ Most restrictive privacy settings by default
✓ Optional features opt-in (not opt-out)
✓ Notifications minimized by default
✓ Data sharing: Off by default

Examples:
- AI Helper: Disabled until parent explicitly enables
- Analytics: Anonymized by default
- Grandparent view: Invite-only, not automatic
```

#### 3.1.4 Data Breach Notification

**GDPR Article 33 & 34:** Notify within 72 hours

```
KidSpark Breach Response Plan:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Detection → Containment → Assessment → Notification

Timeline:
< 1 hour:   Detection via monitoring systems
< 4 hours:  Containment and impact assessment
< 24 hours: Internal reporting to DPO and management
< 72 hours: Notification to supervisory authority (if high risk)
< 72 hours: Notification to affected parents (if high risk)

Notification Content:
- Nature of breach
- Data categories affected
- Likely consequences
- Measures taken to mitigate
- Contact point for queries
```

#### 3.1.5 Data Protection Officer (DPO)

**GDPR Article 37:** Appoint DPO if processing children's data

```
KidSpark DPO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role: Data Protection Officer
Contact: dpo@kidspark.com
Responsibilities:
- Monitor GDPR compliance
- Conduct privacy impact assessments
- Train staff on data protection
- Liaison with supervisory authorities
- Handle data subject requests
```

---

## 4. India Data Protection Laws

### 4.1 Digital Personal Data Protection Act 2023

**Key Provisions:**
1. Consent-based data processing
2. Purpose limitation
3. Data minimization
4. Right to correction and erasure
5. Enhanced protections for children

### 4.2 Compliance Mapping

#### 4.2.1 Parental Consent (Section 9)

**Law:** Verifiable parental consent required for children

```
KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Parent registers first (OTP-verified)
✓ Explicit consent during child profile creation:
  
  Consent Text:
  "I, [Parent Name], am the parent/legal guardian of
  [Child Name] and provide consent for KidSpark to
  process their educational data as described in the
  Privacy Policy."
  
  [✓] I have read and accept the Privacy Policy
  [✓] I consent to data processing for educational purposes
  
  [Create Child Profile]

✓ Consent logged with timestamp and IP
✓ Parent can withdraw consent (delete profile)
```

#### 4.2.2 Data Localization

**Law:** Certain data categories must be stored in India

```
KidSpark Data Storage:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Database: AWS Mumbai Region (ap-south-1)
Vector Database: Self-hosted in Indian data center
Backups: AWS Mumbai + AWS Hyderabad (multi-AZ)

Cross-Border Transfers: None
- All processing within India
- LLM self-hosted (no API calls to foreign services)
- No CDN for user data (only public assets)

Contractual Safeguards:
- DPA (Data Processing Agreement) with AWS
- Standard Contractual Clauses for backups
```

#### 4.2.3 Data Principal Rights

| Right | Implementation | Timeline |
|-------|----------------|----------|
| **Right to Access** | Self-service download | Immediate |
| **Right to Correction** | Edit profile | Immediate |
| **Right to Erasure** | Delete account | Within 30 days |
| **Right to Grievance Redressal** | Email support | Response within 7 days |
| **Nomination Facility** | Designate heir for data (future) | Planned v2.0 |

---

## 5. Educational Data Privacy

### 5.1 FERPA Alignment (If USA Expansion)

**Family Educational Rights and Privacy Act**

Though KidSpark is not directly covered (parents manage data), we align with FERPA principles:

```
FERPA Principle → KidSpark Practice
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Parental Access to Records
   → Parents can download all data anytime

2. Consent for Disclosure
   → Teacher feedback shared only with parent
   → No third-party data sharing

3. Directory Information Opt-Out
   → Child's name never visible to other parents
   → No public profiles or directories

4. School Official Exception
   → Teacher sees only their own students' data
   → School admin sees aggregated data only
```

### 5.2 Student Privacy Pledge (USA)

KidSpark commits to principles modeled on the Student Privacy Pledge:

```
Commitments:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ No selling of student data
✓ No behavioral advertising targeted at students
✓ No building profiles beyond educational purpose
✓ Encryption of data in transit and at rest
✓ User-friendly mechanisms to access and correct data
✓ Comprehensive security standards
✓ Privacy policy transparency
✓ Notice and consent for material changes
✓ Contractual requirements for third parties
✓ No amassing student information beyond immediate educational purpose
```

---

## 6. Ethical AI Framework

### 6.1 UNESCO AI Ethics Recommendations

**UNESCO Principles → KidSpark Implementation**

#### 6.1.1 Human Rights and Human Dignity

```
Principle: AI systems should respect human rights and dignity

KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ No automated decision-making about child's academic future
✓ AI as decision-support only (parent decides)
✓ No profiling or predictive analytics
✓ Age-appropriate interactions (parent-mediated)
✓ Culturally sensitive content (diverse representation)
✓ No discrimination in AI responses
```

#### 6.1.2 Transparency and Explainability

```
Principle: AI systems should be transparent and explainable

KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Every AI response cites source (book, page)
✓ RAG process documented and auditable
✓ Parent can view AI query logs
✓ Clear disclosure: "This answer is from your textbook"
✓ Confidence levels shown (high/medium/low)
✓ Model limitations communicated

UI Example:
"🤖 AI Helper used pages 23-24 from the English textbook
to answer your question. Confidence: High"
```

#### 6.1.3 Accountability

```
Principle: Humans must remain accountable for AI decisions

KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Parent-in-the-loop (reviews AI answers)
✓ Teacher provides feedback (not AI)
✓ No AI grading or assessment
✓ AI logs auditable by humans
✓ Clear escalation path (report AI issues)

Accountability Chain:
AI Response → Parent Reviews → Parent Explains to Child
                    ↓
             (if incorrect/concerning)
                    ↓
             Report to KidSpark Team
                    ↓
             Manual Review & Correction
```

#### 6.1.4 Fairness and Non-Discrimination

```
Principle: AI should not discriminate

KidSpark Implementation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Content review for bias (textbooks neutral)
✓ No personalization beyond subject (no profiling)
✓ Same answers for same questions (consistency)
✓ No preference for high-performing students
✓ Inclusive language in Sparky messages

Bias Testing:
- Quarterly audits of AI responses for neutral tone
- Diverse test cases (different query phrasings)
- No gender/caste/religion-specific variations
```

### 6.2 IEEE Ethically Aligned Design

**Focus Areas:**

1. **Human Well-Being**: Prioritize child's emotional well-being over engagement metrics
2. **Algorithmic Bias**: Regular testing for biased responses
3. **Transparency**: Explainable AI architecture (RAG with citations)
4. **Accountability**: Human oversight, parent control
5. **Privacy**: Minimal data, maximum protection

---

## 7. Child Safety Standards

### 7.1 Online Safety Principles

**NSPCC (UK) & NCMEC (USA) Guidelines Alignment**

```
Principle → KidSpark Implementation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No Direct Communication Between Children
   → No student-to-student messaging
   → No comments or social features

2. No Public Profiles
   → Child's name never visible to others
   → No usernames, no avatars visible to peers

3. No Inappropriate Content
   → Content moderation on uploads (images)
   → Teacher content review before posting
   → Automated filters for inappropriate language

4. No External Links Without Guard
   → All external links require parent confirmation
   → No ads, no third-party content

5. No Location Tracking
   → No GPS, no geolocation use
   → IP address logged for security only (not shared)

6. Parental Oversight
   → Parent sees everything child sees
   → Parent controls all actions
   → Activity logs accessible to parent
```

### 7.2 Content Moderation

```
Multi-Layer Moderation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layer 1: Teacher Upload Filters
- Automated image scanning (Azure Content Moderator)
- Text profanity filter
- Malware/virus scanning on files

Layer 2: Human Review (if flagged)
- School admin reviews flagged content
- Approval required for posting

Layer 3: Parent Upload Filters
- Same automated checks
- Visible only to teacher (not other parents)

Layer 4: AI Response Filters
- Post-generation safety check
- Block prohibited patterns
- Manual review queue for edge cases

Incident Response:
- Inappropriate content flagging mechanism
- 24-hour review by safety team
- Content removal + user notification
- Escalation to authorities if required (abuse/exploitation)
```

### 7.3 Anti-Bullying & Harassment

**Not applicable** (no peer-to-peer interaction), but:

```
Preventive Measures:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ No student can see others' progress
✓ No leaderboards or rankings
✓ No comments or reactions
✓ Teacher feedback is private (only parent sees)

If Bullying Occurs External to App:
- Parents can report incidents via support
- Account can be suspended pending investigation
- Cooperation with school administration
```

---

## 8. Accessibility Compliance

### 8.1 WCAG 2.1 Level AA Compliance

**Web Content Accessibility Guidelines**

| Principle | Guideline | KidSpark Implementation |
|-----------|-----------|------------------------|
| **Perceivable** | Alt text for images | All icons, badges, Sparky have descriptive alt text |
| | Color contrast | Minimum 4.5:1 ratio for text |
| | Text resizing | Font size adjustable 100%-150% |
| | Non-text content | Captions for any audio/video |
| **Operable** | Keyboard navigation | Full app navigable without mouse |
| | Touch target size | Minimum 44x44 pixels |
| | No time limits | No forced timeouts on readings |
| **Understandable** | Consistent navigation | Same layout across screens |
| | Error prevention | Confirmation dialogs for critical actions |
| | Simple language | Reading level Grade 2-3 maximum |
| **Robust** | Assistive tech | Screen reader tested (VoiceOver, TalkBack) |
| | Semantic HTML | Proper heading hierarchy, ARIA labels |

### 8.2 Assistive Technology Support

```
Tested With:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ VoiceOver (iOS)
✓ TalkBack (Android)
✓ Voice Access (Android voice navigation)
✓ Switch Control (for motor impairments)
✓ High Contrast Mode
✓ Large Text Mode

Features:
- All interactive elements labeled
- Screen reader announces state changes
- Focus indicators visible
- Skip navigation links
```

### 8.3 Inclusive Design

```
Considerations:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Dyslexia-friendly font option (OpenDyslexic)
✓ Color-blind safe palette (tested with simulators)
✓ Low-vision mode (high contrast, large text)
✓ Reduced motion option (for vestibular disorders)
✓ Multilingual support (English, Hindi, regional)
✓ Right-to-left (RTL) layout for applicable languages
```

---

## 9. Audit & Accountability

### 9.1 Regular Audits

```
Audit Schedule:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Monthly:
- Security vulnerability scanning
- Log review for anomalies
- AI response quality sampling

Quarterly:
- Privacy compliance review
- WCAG accessibility testing
- AI bias testing
- Content moderation effectiveness

Annually:
- Third-party security audit (penetration testing)
- GDPR compliance audit (if EU users)
- SOC 2 examination
- Privacy impact assessment (PIA)
```

### 9.2 Compliance Documentation

```
Maintained Documents:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Privacy Policy (version controlled)
✓ Terms of Service
✓ Cookie Policy
✓ Data Processing Agreement (DPA)
✓ Security Whitepaper
✓ Accessibility Statement (VPAT)
✓ AI Ethics Guidelines
✓ Incident Response Plan
✓ Data Retention Policy
✓ Third-Party Risk Assessment

Review Cycle: Annual (or on material change)
Approval: Legal counsel + DPO
Publication: Public website + in-app
```

### 9.3 Third-Party Risk Management

```
Vendor Assessment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before Onboarding Any Third-Party Service:

1. Data Processing Agreement (DPA) required
2. Security questionnaire completion
3. Privacy policy review
4. Sub-processor disclosure
5. Data residency confirmation
6. Insurance verification (cyber liability)
7. Contractual liability clauses

Current Third-Parties:
- AWS (hosting): DPA ✓, ISO 27001 ✓, SOC 2 ✓
- Twilio (SMS OTP): DPA ✓, GDPR compliant ✓
- Sentry (error logging): Anonymous data only ✓
```

---

## 10. Incident Response

### 10.1 Data Breach Response Plan

**Phases:**

```
1. DETECTION (< 1 hour)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   - Automated monitoring alerts
   - Manual report from user/staff
   - Third-party notification (AWS, etc.)
   
   Actions:
   → Activate Incident Response Team
   → Preserve evidence (logs, artifacts)
   → Isolate affected systems

2. CONTAINMENT (< 4 hours)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   - Stop ongoing breach
   - Patch vulnerability
   - Revoke compromised credentials
   
   Actions:
   → Implement emergency firewall rules
   → Force password reset (if credentials leaked)
   → Take affected systems offline if necessary

3. ASSESSMENT (< 24 hours)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   - Determine scope (which users, what data)
   - Classify severity (high/medium/low)
   - Identify root cause
   
   Actions:
   → Forensic analysis of logs
   → Determine legal notification obligations
   → Prepare communication materials

4. NOTIFICATION (< 72 hours)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GDPR/DPDP: Notify authorities within 72 hours
   COPPA: Notify FTC if high risk
   Users: Notify affected parents immediately
   
   Notification Template:
   -----
   Subject: Important Security Notice
   
   Dear [Parent Name],
   
   We are writing to inform you of a security incident
   involving KidSpark. On [date], we discovered [brief description].
   
   Data Affected:
   - [List data categories]
   
   What We've Done:
   - [Containment actions]
   - [Security improvements]
   
   What You Should Do:
   - [Recommendations, e.g., change password]
   
   We take this very seriously and apologize for any concern.
   
   Contact: security@kidspark.com
   -----

5. RECOVERY & REMEDIATION (Ongoing)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   - Restore services securely
   - Monitor for recurrence
   - Implement lessons learned
   
   Actions:
   → Code/infrastructure fixes
   → Enhanced monitoring
   → Staff training on new procedures

6. POST-MORTEM (Within 2 weeks)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   - Root cause analysis document
   - Timeline of events
   - Effectiveness review
   - Prevention recommendations
   
   Actions:
   → Share findings with team
   → Update incident response plan
   → Implement preventive measures
```

### 10.2 AI Safety Incident Response

**For AI-related issues (hallucination, inappropriate response, etc.):**

```
Incident Types:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type 1: Hallucination (false information provided)
Type 2: Inappropriate content (despite filters)
Type 3: Bias/discrimination in response
Type 4: Privacy leak (RAG retrieves wrong data)
Type 5: Safety bypass (prohibited query not blocked)

Response Protocol:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. User reports issue OR automated detection
2. AI team reviews within 24 hours
3. Severity classification:
   - Critical: Immediate RAG/LLM service pause
   - High: Flag affected responses, notify users
   - Medium: Add to review queue
   - Low: Log for pattern analysis

4. Root cause analysis:
   - Was query classification wrong?
   - Did retrieval fail?
   - Did LLM ignore instructions?
   - Is prompt engineering insufficient?

5. Remediation:
   - Update safety filters
   - Improve prompt engineering
   - Retrain classifiers if needed
   - Add new test cases

6. User communication:
   - Apologize for error
   - Provide correct information
   - Explain what happened (transparency)
   - Note improvements made
```

### 10.3 Compliance Violation Response

**If regulatory violation occurs:**

```
Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Self-identify violation (internal audit or user report)
2. Immediate containment (stop violating practice)
3. Notify DPO and legal counsel
4. Assess if self-reporting required to authorities
5. Voluntary disclosure (demonstrates good faith)
6. Implement corrective actions
7. Track until resolution
8. Update policies to prevent recurrence

Example: Data Retention Violation
- Issue: Discovered logs retained beyond 3 years
- Action: Immediate deletion of old logs
- Notification: DPO informed, no user harm
- Correction: Automated deletion script implemented
- Prevention: Monthly retention audit added
```

---

## Appendix A: Privacy Policy Summary

**For Parents (Plain Language):**

```
What We Collect:
- Your child's first name, age, and grade
- Your email or phone number
- Homework completion records
- Stars and badges earned
- Questions you ask the AI helper

Why We Collect It:
- To show your child's progress
- To let teachers give feedback
- To answer your questions about the curriculum
- To make the app fun and engaging

What We Don't Do:
❌ We don't sell your data
❌ We don't show ads
❌ We don't share data with other companies
❌ We don't predict your child's future
❌ We don't compare your child to others

Your Rights:
✓ See all your data (download it)
✓ Fix mistakes (edit profile)
✓ Delete everything (close account)
✓ Ask questions (support@kidspark.com)

Who Can See Your Child's Data:
- You (parent) - everything
- Your child's teacher - homework and progress
- No one else

How Long We Keep It:
- As long as your account is active
- Deleted 30 days after you close account
- Some logs kept 3 years for safety (required by law)
```

---

## Appendix B: Compliance Checklist

**Pre-Launch Checklist:**

```
Legal & Compliance:
☑ Privacy policy drafted and reviewed by counsel
☑ Terms of service finalized
☑ Data Processing Agreements with vendors
☑ DPO appointed and contact info published
☑ Consent mechanisms implemented and tested
☑ Data subject rights workflows tested (access, delete)
☑ Cookie consent banner (if applicable)
☑ Age verification (parent account) implemented

Security:
☑ Encryption at rest (AES-256)
☑ Encryption in transit (TLS 1.3)
☑ Penetration testing completed
☑ Vulnerability scanning automated
☑ Security incident response plan documented
☑ Backup and recovery tested
☑ Access controls implemented (RBAC)

AI Safety:
☑ RAG safety filters tested (100+ test cases)
☑ LLM prompt engineering finalized
☑ Confidence thresholds calibrated
☑ AI audit logs functional
☑ Parent feedback mechanism tested
☑ "I don't know" responses working correctly

Accessibility:
☑ WCAG 2.1 AA compliance verified
☑ Screen reader testing (VoiceOver, TalkBack)
☑ Color contrast validated
☑ Keyboard navigation tested
☑ Dyslexia-friendly mode functional

Child Safety:
☑ No student-to-student interaction possible
☑ Content moderation active
☑ Parental controls functional
☑ Upload filters (image, text) tested
☑ No external links without confirmation
☑ Activity logging complete

Operational:
☑ Monitoring and alerting configured
☑ Support email active (support@kidspark.com)
☑ DPO email active (dpo@kidspark.com)
☑ Security email active (security@kidspark.com)
☑ Incident response team identified and trained
```

---

**Document Status:** Governance & Compliance Mapping v1.0  
**Last Updated:** February 18, 2026  
**Review Cycle:** Quarterly  
**Owner:** Chief Compliance Officer + Data Protection Officer

---

## 11. v2.0 Client-Side Compliance Status

KidSpark v2.0 is a fully self-contained browser application. This section maps the compliance principles to the v2.0 implementation.

### 11.1 Data Minimization (COPPA/GDPR/DPDP)

**Status: ✅ Implemented**

The v2.0 app collects **only**:
- Parent email (login only)
- Parent-set password (hashed, never plaintext)
- 4-digit Parent PIN (hashed)
- Child's first name
- Daily time limit preference
- gameplay statistics (EXP, stars, lives, streaks)

**Not collected:**
- ❌ Location data
- ❌ Photos or biometrics
- ❌ Device identifiers
- ❌ Third-party analytics
- ❌ Advertising identifiers

### 11.2 Local-Only Data Storage

**Status: ✅ Implemented**

All v2.0 data stays on-device:
- Stored in `localStorage` under key `ks_user_v1`
- Encrypted with XOR cipher + Base64 before storage
- Passwords/PINs hashed with FNV-1a-inspired hash — never stored in plaintext
- No internet required for any feature
- No data ever leaves the device

### 11.3 Parent Control (COPPA §312.4)

**Status: ✅ Implemented**

- Parent registers first, creates child settings
- PIN-gated Parents Portal (4-digit code required)
- Portal relocks on every navigation away
- Parents can change time limit and PIN at any time
- Parents can download a text progress report
- No child access to parent portal

### 11.4 Daily Time Limit Enforcement

**Status: ✅ Implemented**

- Countdown shown in sidebar at all times
- Games section locked + overlay shown when time expires
- Usage tracked per calendar day (resets at midnight)
- Saved every 30 seconds (persists if browser closes)
- Parent can adjust daily limit (takes effect immediately)

### 11.5 No Internet Required / No Third-Party Dependencies

**Status: ✅ Implemented**

- App runs from local file (`index.html`)
- Google Fonts loaded from CDN (graceful fallback to system fonts)
- All AI responses sourced from built-in `rag-data.js`
- No API calls, no tracking pixels, no analytics
- Works offline once page is loaded

### 11.6 Encryption Summary

| Data | Method | Strength |
|------|--------|----------|
| Full user record | XOR + Base64 | Obfuscation |
| Password | FNV-1a-like hash (base36) | One-way hash |
| Parent PIN | Same hash | One-way hash |
| Game stats | Same encryption as user record | Obfuscation |

> Note: The XOR cipher is for obfuscation, not cryptographic security. For production server deployment, bcrypt/Argon2 for passwords and AES-256 for data storage is recommended as documented in the main compliance policy.

---

**Document Status:** Governance & Compliance Mapping v2.0 (updated with v2 implementation)  
**Last Updated:** February 22, 2026  
**Review Cycle:** Quarterly  
**Owner:** Technetics IT Services + Data Protection Officer
