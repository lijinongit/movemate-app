# Business Owner — Discovery Phase Deliverable
## Movemate Foundation (Sprint 1–2 Slice)

**Phase:** Discovery  
**Owner:** Business Owner (🏢)  
**Scope:** User Onboarding & Identity Verification (Epic 1 — US-001 through US-006)  
**Sprint Timeline:** Weeks 1–4 of 12-week MVP  
**Target Market:** Dubai, UAE (MENA expansion Q3–Q4 2026)

---

## Executive Summary

This document establishes the business case, regulatory non-negotiables, and success metrics for the Foundation slice of Movemate's MVP — the customer and trainer onboarding system with Emirates ID identity verification. This is the critical trust infrastructure on which all downstream marketplace activity depends.

Movemate is a hyper-local, real-time marketplace connecting individuals with certified fitness trainers across all disciplines (gym, dance, swimming, football, cricket, and more). The Foundation slice delivers:

- **Customer registration** with Emirates ID verification
- **Trainer application workflow** with DSC credential validation
- **Parent/guardian onboarding** for under-18 users
- **Identity verification SLA** (4-hour target for admin approval)
- **Auth service** with Cognito integration
- **Document upload** (Emirates ID, DSC certs, trainer references) to encrypted S3

Why this matters: Without verified identities and trainer credentials, the platform cannot legally operate in Dubai or build user trust. The Foundation slice is the **supply-side gating mechanism** — customers will only join if they know trainers are certified; trainers will only commit if the vetting process feels legitimate.

---

## Commercial Rationale: Why This Slice First

### 1. Trust as a Moat
Movemate's primary value proposition is **risk reduction**: customers pay for the confidence that a stranger arriving at their gym is legitimate and qualified. Skipping identity verification would be a fundamental strategic error — it would:
- Expose the platform to liability (Dubai Sports Council, DFSA)
- Invite bad trainers and customers
- Destroy NPS before the product even launches

**Competitive Advantage:** By day 1, every trainer on Movemate has been ID-verified and DSC-checked. Competitors without this cannot claim the same. This becomes marketing copy: *"All trainers verified. All identities confirmed."*

### 2. Supply-Side Onboarding Is the Bottleneck
Customers are easy to acquire (advertising, influencers). Trainers are hard to recruit — they are skeptical of new platforms, protective of their existing client base, and require operational burden (certification uploads, approval waiting, etc.).

The Foundation slice addresses trainer friction directly:
- **Clear approval workflow** (not ambiguous "we'll get back to you")
- **Fast track** (4-hour SLA for admin review)
- **Transparency** (trainer sees their app status in real-time: "Pending Review → Approved → Live")
- **Founding Trainer badge** (social proof: "You're part of our first 100")

This is our lever to acquire 100 trainers in 8 weeks and go to market credibly.

### 3. Regulatory Non-Negotiables
Dubai operates within UAE Personal Data Protection Law (PDPL) and Dubai Sports Council (DSC) rules. Non-compliance is not a future problem — it is a **day-1 blocker**:

- **Emirates ID mandate:** All users must upload and verify Emirates ID before booking. No exceptions.
- **Trainer DSC certification:** No trainer without Dubai Sports Council approved certifications can be live.
- **Under-18 guardian consent:** Parents must upload Emirates ID + photo for any user under 18 and physically accompany them to sessions.
- **Data residency:** All PII must be stored in UAE-region AWS (Bahrain / me-south-1). Never leave the country.
- **Audit trail:** All identity verifications must be logged and auditable for 12 months.

If the Foundation slice does not enforce these rules, scaling will be impossible. We cannot patch compliance later.

---

## Success Criteria for Sprint 1–2 (Concrete, Measurable)

### Platform Capacity
- **100 trainers** can complete application workflow end-to-end (registration → cert upload → DSC reference → approval)
- **500 customers** can register with Emirates ID verification
- **Zero failed Emirates ID uploads** (validation UX is intuitive; compression works; S3 presigned URLs are reliable)
- **Zero data leaks** of PII (all documents encrypted at rest, never exposed via CDN, access logs clean)

### Approval SLA
- **Admin approval time: <4 hours** for trainer applications (mean)
- **>95% of trainers** receive approval or rejection decision within 8 hours
- **Under-18 parent consent** verified within 2 hours of initial customer registration

### User Experience
- **Registration-to-verification time: <5 minutes** (customer perspective: submit ID → within 4 hours approval arrives)
- **Trainer app completion rate: >80%** (trainer begins application → completes within one session)
- **Zero critical bugs** blocking registration in testing or production

### Regulatory & Compliance
- **0 compliance violations** in audit (DSC rules, PDPL data residency, parental consent logging all present)
- **12-month audit trail** in place (all verifications logged, immutable)
- **100% of trainers** have valid DSC cert attached to profile (manual verification Phase 1; API Phase 2)
- **100% of under-18 records** have parental consent document linked and auditable

### Operational Readiness
- **Admin panel** for trainer approval (list → review docs → approve/reject with notes)
- **Monitoring dashboard** showing registration flow abandonment rates, approval queue depth, document upload success rate
- **Runbook** for handling edge cases: expired Emirates ID, DSC cert validation dispute, parent withdrawal of consent

---

## Regulatory & Compliance Deep Dive

### 1. Emirates ID Verification
**Rule:** All users (customers, trainers, studio admins) must upload and verify Emirates ID before any transaction.

**Implementation:**
- Uploaded to encrypted S3 (never stored locally, never exposed)
- Admin can manually review in the approvals dashboard
- Trainer/customer sees status: "Pending Verification" → "Verified" → (never "Rejected" for customer, but possible for trainer)
- If ID expired or invalid, user is notified and asked to resubmit
- For under-18 customers: parent's Emirates ID also required (separate upload flow)

**Data Handling:**
- Stored in AWS S3 `movemate-emiratesid-docs` bucket, encrypted with KMS
- Accessible only to admin role (API enforces: `if (user.role !== "admin") return 403`)
- Retention: 12 months after account deletion, then purged
- Never downloaded to local machine without audit log
- Never shared with third parties (except DSC for trainer verification, by consent)

### 2. Dubai Sports Council (DSC) Trainer Certification
**Rule:** All trainers must hold DSC-approved certification in at least one discipline.

**Approved Disciplines (Phase 1):**
- Personal Training (General Fitness)
- Dance/Movement
- Swimming
- Football (Soccer)
- Cricket
- Yoga/Wellness

**Implementation:**
- Trainer uploads certification image/PDF during registration
- Admin manually verifies against DSC registry (Phase 1; API integration Phase 2)
- Trainer profile shows badge: "✓ DSC Certified in Personal Training"
- If cert expired: trainer is warned and must renew to stay live
- If cert is invalid: trainer application is rejected with reason: "Certification not recognized by DSC"

**Reference Validation:**
- Trainer provides 2 reference contacts (existing clients, studio managers, coaches)
- Admin phones/emails references to confirm trainer competency and safety
- Reference feedback is logged in trainer profile (visible to admin, not public)

### 3. Under-18 User Protection
**Rule:** Users under 18 require parent/guardian Emirates ID and must be physically accompanied to sessions.

**Implementation — Registration:**
- Customer registers with their own Emirates ID (age auto-calculated)
- If age <18, system prompts: "Please have your parent/guardian upload their Emirates ID"
- Parent registration separate flow (email/phone, Emirates ID upload)
- Parental consent checkbox: "I confirm I will accompany my child to all sessions"
- Parental consent record created and linked to child's account

**Implementation — Session Flow:**
- Before trainer accepts a booking with a minor, trainer sees flag: "⚠️ This customer is under 18. Parent must accompany."
- Trainer must confirm they understand the requirement (acknowledged in app)
- Studio staff may ask parent to show ID at check-in (reference from system)

**Data Handling:**
- Under-18 status visible to trainer + studio (necessary for safety compliance)
- Do not show under-18 customer's DOB to other customers or public
- Parent's contact email stored securely; trainer cannot see it (admin mediates communication)

### 4. Personal Data Protection Law (PDPL) Compliance
**Rule:** UAE PDPL (2021) mandates data residency in UAE, purpose limitation, and right to erasure.

**Implementation:**
- All user data stored in AWS me-south-1 (Bahrain) — never replicated outside UAE
- RDS Aurora Serverless v2 in Bahrain, read-only replicas only in Bahrain (no cross-region)
- S3 buckets in me-south-1, CloudFront only serves within UAE (geo-restriction policy)
- Processing purpose: "Marketplace transactions, identity verification, compliance"
- Consent checkbox: "I consent to Movemate processing my data for the above purposes"
- Right to erasure: User can request account deletion; all PII purged within 30 days (automated job)
- Data retention: Deleted account data archived to S3 Glacier for 12 months (audit), then purged

### 5. Payment & PCI-DSS
**Rule:** No payment card data touches our servers.

**Implementation:**
- Payments via Stripe or Checkout.com (both PCI-DSS Level 1)
- Frontend tokenises card directly (Stripe.js); token sent to backend
- Backend sends token to Stripe, receives transaction_id
- Our DB stores: `{ booking_id, transaction_id, amount_aed, status }` — never card data
- Refunds triggered by Stripe API (not manual card handling)

---

## Monetisation Model (Foundation Slice)

The Foundation slice does not include booking or payment — that comes in Sprint 3–4. However, the architecture must be compatible with:

1. **Session Commission** (25% of session fee retained by Movemate)
2. **Studio B2B Revenue Share** (agreement during studio registration, implemented Sprint 4)
3. **Customer Subscriptions** (Phase 2 onwards)

This sprint establishes the **identity layer** on which commerce depends.

---

## Go-to-Market Strategy (Foundation Impact)

### Trainer Acquisition (Weeks 1–8)
1. **Pre-launch outreach** to Dubai PT Academy, Les Mills MENA, independent gyms (JLT, Marina, DIFC)
2. **Pitch deck & demo:** Show them the trainer onboarding flow — simple, fast, transparent approval
3. **Founding Trainer Programme:** First 100 trainers get:
   - Founding Trainer badge (lifetime)
   - Zero commission for 30 days (post-launch)
   - Priority support + dedicated onboarding manager
4. **Referral bonus:** Once live, existing trainers earn session credits for referring new trainers (incentivises network growth)
5. **Pressure point:** "You need to be live when customers launch in Month 2. Registration closes 2 weeks before."

**Success Metric for Foundation:** 100 trainers complete applications → >95% approved by launch day

### Studio Acquisition (Weeks 2–8)
1. **In-person meetings** with studio owners (revenue guarantee pitch: "We'll fill your idle slots; if not, no fee")
2. **Show occupancy data** (if partnering with existing gyms: "Here's your slot utilization before Movemate")
3. **Studio portal demo** (available in Sprint 2): "You see all bookings, manage your slots, earn revenue share"
4. **Anchor strategy:** Land 1 major brand (Fitness First, GymNation) for credibility; use as reference for other deals

**Success Metric for Foundation:** 20 studios pre-signed for launch

### Customer Acquisition (Weeks 4–12)
- Begins Week 4 (after Foundation slice is stable)
- Instagram/TikTok influencer partnerships with Dubai fitness creators
- Referral credits: "Invite a friend, both get session discounts"
- Launch event at anchor studio (Week 12, linked to live platform)

**Success Metric for Foundation:** 500 customers pre-registered by end of Week 4; queued to book in Week 5–6 (Sprint 3)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Emirates ID upload fails at scale** (network, S3 quota, compression) | Trainers cannot register; launch delayed | Load test 500 concurrent uploads Week 3; use S3 multipart upload; implement circuit breaker for S3 API |
| **Admin approval queue backs up** (not enough hours to manually verify 100 trainers) | Trainers frustrated, drop out; negative NPS | Pre-recruit 2 admins for verification duty (dedicated 40 hrs/week); set up fast-track for first 50 (1 reference call each, not full background check) |
| **DSC cert validation is ambiguous** (no clear rule on accepted formats/issuers) | Some trainers rejected unfairly; legal dispute | Pre-validate against DSC website; create FAQ showing accepted cert types; escalate disputed certs to DSC liaison (partner) |
| **Under-18 parent consent UX is confusing** (parent doesn't understand flow) | Minors cannot register; customer acquisition blocked | A/B test consent flow; use progressive disclosure (not one long form); provide video walkthrough for parents |
| **PDPL audit fails pre-launch** (data stored outside UAE by accident) | Launch blocked; regulatory fine | Infrastructure audit Week 2 (ensure all DB/S3 in Bahrain); automated check in CI/CD (reject deployment if region != me-south-1) |
| **Trainer reference contacts give bad feedback** (legitimate trainer rejected due to outdated reference) | Trainer disputes rejection; churn | Trainer can appeal with new references; admin has override ability (escalation to leadership); document decision in system |

---

## Success Metrics Summary

### Quantitative
- **100 trainers** onboarded and approved (mean approval time <4 hours)
- **500 customers** registered with verified Emirates ID
- **100% compliance** with PDPL, DSC, under-18 rules
- **>95% approval SLA** met (80% within 4 hours, 95% within 8 hours)
- **<2% data loss/corruption** in ID uploads
- **Zero security incidents** (no PII leaks, no unauthorized access logs)

### Qualitative
- **Trainer satisfaction:** NPS >40 on onboarding experience (survey post-approval)
- **Admin experience:** Approval workflow is intuitive, no manual data entry (all pulled from app submission)
- **Regulatory stakeholder alignment:** Dubai Sports Council confirmed rules are met; DFSA/DFSA auditor approves architecture
- **Team alignment:** Engineering, Compliance, Legal all sign off on launch checklist

---

## Post-Sprint Handoff (Definition Phase)

Once Foundation is approved (end of Week 4), the **Product Owner** will detail acceptance criteria for all remaining Epics, and the **Technical Product Owner** will hand off to the Solution Architect with the mandate:

> Build a system that can scale from 500 customers and 100 trainers to 500,000 users across MENA, with the identity and compliance rules locked in this Foundation slice baked into every service, every API, every query.

The Foundation slice is immovable. Treat it as load-bearing.

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-03  
**Approval:** Pending BO review & Compliance sign-off
