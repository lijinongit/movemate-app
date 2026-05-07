# Product Owner — Discovery Phase Deliverable
## Foundation User Stories & Acceptance Criteria (Sprint 1–2)

**Phase:** Discovery  
**Owner:** Product Owner (📋)  
**Scope:** Epic 1 — User Onboarding & Identity Verification (US-001 through US-006)  
**Sprint Timeline:** Weeks 1–4 of 12-week MVP  
**Format:** Gherkin-style BDD (Given/When/Then) with edge cases

---

## Overview

This document details the functional acceptance criteria for all Foundation user stories. Each story includes:
- **Primary scenario:** Happy path, outlined in Gherkin
- **Additional scenarios:** At least 2 edge cases per story (expired ID, network failure, invalid format, etc.)
- **Definition of Done checklist**

All acceptance criteria are written from the perspective of the end user (customer, trainer, parent, admin) and are technology-agnostic. Implementation details are deferred to the Technical Product Owner.

---

## US-001: Customer Registration (Email/Phone)

**User Story:**  
As a new customer, I want to register with my email or phone number so that I can create a Movemate account and begin discovering trainers.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Customer Registration with Email or Phone
  
  Scenario: Customer registers successfully with email
    Given the customer is on the registration screen
    And no account exists with email "ali@example.com"
    When the customer enters email "ali@example.com"
    And the customer enters password "SecurePass123!"
    And the customer enters first name "Ali"
    And the customer enters last name "Ahmad"
    And the customer selects "English" as preferred language
    And the customer taps "Create Account"
    Then an OTP is sent to "ali@example.com"
    And the customer is shown the OTP verification screen
    And an account is created with status "Pending Email Verification"
```

**Scenario 2: Customer registers with phone number**

```gherkin
  Scenario: Customer registers successfully with phone
    Given the customer is on the registration screen
    And no account exists with phone "971501234567"
    When the customer enters phone "971501234567" (international format)
    And the customer enters password "SecurePass123!"
    And the customer enters first name "Fatima"
    And the customer enters last name "Bin Falah"
    And the customer selects "Arabic" as preferred language
    And the customer taps "Create Account"
    Then an SMS OTP is sent to "971501234567"
    And the customer is shown the OTP verification screen
    And an account is created with status "Pending SMS Verification"
```

**Edge Case 1: Email Already Registered**

```gherkin
  Scenario: Customer attempts to register with existing email
    Given the customer is on the registration screen
    And an account exists with email "sara@example.com"
    When the customer enters email "sara@example.com"
    And the customer enters password "NewPassword123!"
    And the customer taps "Create Account"
    Then an error message is displayed: "This email is already registered. Please log in or use a different email."
    And no new account is created
    And the customer is offered a "Forgot Password?" link
```

**Edge Case 2: Invalid Email Format**

```gherkin
  Scenario: Customer enters invalid email format
    Given the customer is on the registration screen
    When the customer enters email "notanemail"
    And the customer taps "Create Account"
    Then a validation error is shown: "Please enter a valid email address."
    And the form is not submitted
    And the email field is highlighted in red
```

**Edge Case 3: Weak Password**

```gherkin
  Scenario: Customer enters weak password
    Given the customer is on the registration screen
    And the customer has entered valid email "john@example.com"
    When the customer enters password "123"
    And the customer taps "Create Account"
    Then a validation error is shown: "Password must be at least 8 characters and include a number, uppercase letter, and special character."
    And the form is not submitted
```

**Definition of Done:**
- [ ] Form validates email format (RFC 5322 compatible)
- [ ] Form validates phone format (accepts +971 and 00971 prefixes; validates UAE country code)
- [ ] OTP generated and stored securely (6 digits, 10-minute expiry)
- [ ] OTP sent via SES (email) and Twilio/SNS (SMS)
- [ ] Duplicate email/phone check performed before account creation
- [ ] Password meets security requirements (8+ chars, 1 uppercase, 1 number, 1 special char)
- [ ] Account created with status "Pending Email/SMS Verification"
- [ ] User language preference persisted and used for all future communications
- [ ] No PII logged in application logs (email/phone hashed before logging)
- [ ] Accessible: form labels associated with inputs, error messages linked to fields

---

## US-002: Customer Emirates ID Upload & Verification

**User Story:**  
As a customer, I want to upload my Emirates ID so that my identity is verified before I can book a session.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Customer Emirates ID Upload

  Scenario: Customer uploads valid Emirates ID and receives confirmation
    Given the customer has verified their email/phone (US-001)
    And the customer is on the "Add Identity" screen
    When the customer taps "Upload Emirates ID"
    And the customer selects a photo of their Emirates ID from their device
    And the image is between 1-5MB and in JPG/PNG format
    And the customer reviews the image (auto-cropped to show ID only)
    And the customer taps "Confirm and Upload"
    Then the image is encrypted and uploaded to S3
    And the customer is shown: "Your identity is being verified. This usually takes 2–4 hours."
    And the account status changes to "Pending ID Verification"
    And the customer receives an email confirmation: "We received your Emirates ID. We'll verify it shortly."
    And an admin is notified of a new pending verification in the approval dashboard
```

**Scenario 2: Customer uploads side-by-side dual-photo**

```gherkin
  Scenario: Customer uploads both sides of Emirates ID in one photo
    Given the customer has verified their email/phone
    And the customer is on the "Add Identity" screen
    When the customer uploads a single image showing both sides of the Emirates ID
    Then the system auto-detects both sides
    And both sides are extracted and stored separately
    And the verification process proceeds as normal
```

**Edge Case 1: Expired Emirates ID**

```gherkin
  Scenario: Admin flags customer's Emirates ID as expired
    Given the customer has uploaded an Emirates ID that expired 6 months ago
    When the admin reviews the ID in the approval dashboard
    Then the admin sees a warning: "This ID expired on [DATE]"
    And the admin clicks "Request Resubmission"
    Then the customer receives an email: "Your Emirates ID has expired. Please upload a renewed copy."
    And the account status remains "Pending ID Verification" (no rejection, just a request)
    And the customer can re-upload a new ID
```

**Edge Case 2: Unreadable/Blurry Image**

```gherkin
  Scenario: Customer uploads blurry or low-quality ID image
    Given the customer is on the "Add Identity" screen
    When the customer uploads an image with blur or severe lighting issues
    Then the system shows: "Image quality is too low. Please take a clearer photo."
    And the image is rejected before S3 upload
    And the customer is guided: "Tips: use good lighting, keep the ID flat, ensure all text is visible"
```

**Edge Case 3: Network Failure During Upload**

```gherkin
  Scenario: Upload fails due to network interruption
    Given the customer has selected their Emirates ID photo
    And the upload has started
    When the network connection drops at 60% upload progress
    Then the upload pauses
    And the customer is shown: "Connection lost. Tap to retry."
    And upon tapping retry, the upload resumes from the pause point (if possible) or restarts
```

**Edge Case 4: Image Contains PII Other Than ID**

```gherkin
  Scenario: Customer accidentally uploads a photo showing multiple people/personal details
    Given the customer selects a photo that contains more than just the Emirates ID
    When the system scans the image for unintended PII (faces, names, etc.)
    Then a warning is shown: "This photo contains additional personal information. We recommend cropping it first for your privacy."
    And the customer can choose to crop, re-take, or proceed anyway
```

**Definition of Done:**
- [ ] Image upload via presigned S3 URL (no server-side file receive)
- [ ] Client-side image compression (max 2MB, 1200x800px minimum)
- [ ] Image validation: JPEG/PNG only, size check, basic blur detection
- [ ] Encryption: AES-256 at rest using KMS; file path randomized
- [ ] Storage location: `s3://movemate-emiratesid-docs/[user_id]/[timestamp]/image.jpg`
- [ ] Only admin role can list/download images (API returns 403 for customer/trainer)
- [ ] Audit log entry: "Customer [ID] uploaded Emirates ID at [timestamp]"
- [ ] Email confirmation sent immediately upon successful upload
- [ ] Admin dashboard shows pending verifications in queue (FIFO order)
- [ ] Expiration date auto-extracted from ID image (if OCR available) or flagged for admin attention
- [ ] RTL layout: upload button and status messages support Arabic
- [ ] Accessible: file input has clear label; upload progress bar announced to screen readers

---

## US-003: Parent/Guardian Registration (Under-18 Users)

**User Story:**  
As a parent, I want to register my child (under 18) and upload both our Emirates IDs so that my child can safely use the platform.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Parent/Guardian Onboarding for Minors

  Scenario: Parent completes registration for a child
    Given a parent is on the registration screen
    When the parent enters their own email "parent@example.com"
    And the parent enters password and basic info (name, age, etc.)
    And the parent taps "I am registering for a child under 18"
    Then the flow transitions to child details collection
    And the parent enters the child's name "Zainab Ahmad"
    And the parent enters the child's date of birth "2010-03-15" (14 years old)
    And the parent confirms: "I am the legal parent/guardian"
    And the system calculates age: 14 (minor confirmed)
    Then the parent is prompted to upload both IDs:
      1. Parent's Emirates ID (same as US-002)
      2. Child's Emirates ID (same as US-002)
    And the parent reviews both uploads
    And the parent accepts the terms: "I will accompany my child to all training sessions"
    And the parent taps "Complete Registration"
    Then both accounts are created:
      - Parent account with status "Verified" (parent ID auto-approved)
      - Child account with status "Pending ID Verification" (child ID sent to admin review)
    And the child account is linked to the parent account (parental_guardian_id = parent_user_id)
    And the parent receives an email confirming both registrations
```

**Scenario 2: Parent registers existing adult as guardian for child**

```gherkin
  Scenario: Parent invites another adult to be co-guardian
    Given the parent has completed child registration
    And the parent is on the "Family" or "Guardians" screen
    When the parent taps "Add Another Guardian"
    And enters email "grandparent@example.com"
    Then an invitation link is sent to that email
    And the guardian must upload their Emirates ID
    And upon ID verification, they are added as a secondary guardian
    And both guardians can view the child's booking history and session details
```

**Edge Case 1: Parent Provides Wrong Child DOB (False Age Declaration)**

```gherkin
  Scenario: Parent mistakenly enters child's DOB as adult age
    Given the parent enters DOB "1995-03-15" (making the child appear 30+ years old)
    And the parent taps "Continue"
    Then the system recognizes the age as >18
    And prompts: "You entered a date that would make them an adult. Are you sure this is correct?"
    And the parent is shown a warning about the legal implications of age misrepresentation
```

**Edge Case 2: Child's Emirates ID Is Expired**

```gherkin
  Scenario: Admin reviews child's Emirates ID and finds it expired
    Given the child's Emirates ID expired 8 months ago
    When the admin reviews in the approval dashboard
    Then the admin sees a status flag: "Child's ID expired [DATE]"
    And the admin can request resubmission from the parent
    And the parent receives an email: "Your child's Emirates ID has expired. Please upload a renewed copy."
```

**Edge Case 3: Parent Age < 18 (Invalid)**

```gherkin
  Scenario: System detects parent's age is under 18
    Given the parent enters their own DOB as "2010-05-20" (14 years old)
    And the parent taps "Continue"
    Then the system shows an error: "Only adults (18+) can register a child account. Please check your date of birth."
    And the form rejects the submission
```

**Edge Case 4: Parent Tries to Register Multiple Children (Limits)**

```gherkin
  Scenario: Parent registers a second child
    Given the parent has already registered one child
    When the parent attempts to register a second child
    Then the system allows it (no limit in Phase 1)
    And the system displays: "[Parent Name] is guardian for 2 children"
    And the parent can toggle between children on the home screen
```

**Definition of Done:**
- [ ] Child DOB input with age auto-calculation (flag if <18)
- [ ] Both parent and child Emirates ID uploads required (separate S3 paths)
- [ ] Parental consent checkbox mandatory (terms: "I will accompany my child")
- [ ] Parent account verified immediately upon email confirmation (parent ID auto-approved)
- [ ] Child account flagged in system (under_18 = true, parental_guardian_id set)
- [ ] Child's profile shows under-18 badge to trainers/studios
- [ ] Parental consent record immutable and auditable (logged with timestamp)
- [ ] Audit log entry: "Child [ID] registered under parent [ID] at [timestamp]"
- [ ] Email sent to parent confirming both registrations
- [ ] RTL support: all prompts and consent text available in Arabic
- [ ] Accessible: checkbox + consent terms paired; form clearly indicates which fields are mandatory

---

## US-004: Trainer Application & Certification Upload

**User Story:**  
As a trainer, I want to submit my certifications, reference contacts, and DSC credentials so that I can be reviewed and approved to train on the platform.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Trainer Application Submission

  Scenario: Trainer completes full application
    Given the trainer has registered (phone/email via US-001)
    And the trainer is on the "Complete Your Profile" screen
    When the trainer uploads their Emirates ID (US-002 flow)
    And the trainer taps "Add Certification"
    And the trainer selects discipline "Personal Training"
    And the trainer uploads their DSC certification image/PDF
    And the trainer enters certification expiry date "2026-12-31"
    And the trainer adds a second discipline "Swimming" with cert
    Then the trainer is prompted for reference contacts
    And the trainer enters reference 1:
      - Name: "Gym Manager Dubai"
      - Email: "manager@gym.ae"
      - Relationship: "Current employer"
    And the trainer enters reference 2:
      - Name: "Sports Director"
      - Email: "director@sports.ae"
      - Relationship: "Previous client (5+ years)"
    And the trainer enters their hourly rate: "200 AED"
    And the trainer optionally uploads a short intro video (30-60 seconds)
    And the trainer reviews their full application
    And the trainer taps "Submit for Approval"
    Then the application is saved with status "Pending Review"
    And the trainer receives an email: "We received your application. A member of our team will review it within 4 hours."
    And an admin is notified in the approval dashboard
    And the admin sees all the trainer's docs (ID, certs, video, references)
```

**Scenario 2: Trainer registers for a discipline they're already certified in**

```gherkin
  Scenario: Trainer adds multiple disciplines
    Given the trainer has already added "Personal Training" certification
    When the trainer taps "Add Another Discipline"
    And selects "Yoga & Wellness"
    And uploads the corresponding DSC cert
    Then the trainer is listed as "DSC Certified in: Personal Training, Yoga & Wellness"
```

**Edge Case 1: DSC Certification Expired**

```gherkin
  Scenario: Trainer attempts to upload an expired DSC cert
    Given the trainer uploads a DSC certification that expired 3 months ago
    When the admin reviews the application
    Then the admin sees a warning: "Certification expired [DATE]. Trainer cannot be approved until renewed."
    And the admin can click "Request Resubmission" or "Reject Application"
    And if "Request Resubmission", the trainer receives an email: "Your DSC certification has expired. Please upload a current one."
    And the trainer can update the application with a new cert
```

**Edge Case 2: Reference Contact Unreachable**

```gherkin
  Scenario: Admin attempts to reach reference contact, but email bounces
    Given the trainer has provided reference "manager@oldgym.ae"
    When the admin's verification email bounces back
    Then the admin can flag this in the system
    And the admin can either:
      a) Request the trainer to provide a different reference contact
      b) Mark the reference as "Unverifiable - requires escalation"
    And the trainer is notified to provide an alternative reference
```

**Edge Case 3: No DSC Certifications Provided**

```gherkin
  Scenario: Trainer submits application without any DSC certification
    Given the trainer completes all other profile fields (ID, rate, references)
    And the trainer has not uploaded any DSC certification
    When the trainer taps "Submit for Approval"
    Then the form validation shows: "At least one DSC-approved discipline certification is required."
    And the form blocks submission
    And the trainer is prompted: "Which discipline do you want to teach? Upload your DSC cert."
```

**Edge Case 4: Intro Video Too Long or Wrong Format**

```gherkin
  Scenario: Trainer uploads a 2-minute intro video (exceeds 60-second limit)
    Given the trainer uploads a video file that is 120 seconds long
    When the client-side validator checks the duration
    Then an error is shown: "Intro video must be 60 seconds or less. Yours is 120 seconds."
    And the upload is rejected
    And the trainer is guided to edit or re-record
```

**Definition of Done:**
- [ ] Emirates ID upload required before certifications (US-002 applies)
- [ ] Certification upload accepts images (JPG/PNG, <5MB) and PDFs (<10MB)
- [ ] DSC certification OCR or manual review: discipline name extracted
- [ ] Expiry date mandatory; system flags if <3 months remaining
- [ ] At least 1 DSC-approved discipline required; can add up to 6 (Phase 1 limit)
- [ ] 2 reference contacts required; email validation on submission
- [ ] Hourly rate (50-500 AED range, configurable by admin)
- [ ] Intro video: max 60 seconds, MP4 or WebM, <50MB file size
- [ ] Application status workflow: Pending Review → Approved / Rejected / Request Resubmission
- [ ] All documents stored in trainer-specific S3 path: `movemate-trainer-docs/[trainer_id]/`
- [ ] Audit log: "Trainer [ID] submitted application at [timestamp]"
- [ ] Admin approval email template with decision notes
- [ ] RTL support: all prompts and certifications labels in Arabic
- [ ] Accessible: file inputs labeled; reference form fields clearly marked

---

## US-005: Studio Registration & B2B Contract

**User Story:**  
As a studio owner, I want to register my studio and sign a digital B2B contract so that my venue appears on the platform.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Studio Owner Registration & Contract Signing

  Scenario: Studio owner completes registration and accepts B2B contract
    Given the studio owner is on the registration screen
    When the studio owner enters their business email "owner@studiodubai.ae"
    And the studio owner enters their business phone "97143334444"
    And the studio owner enters studio name "FitZone Dubai Marina"
    And the studio owner enters physical address "Marina Mall, Level 2, Dubai"
    And the studio owner enters coordinates (lat: 25.0800, lng: 55.1348) via map picker
    And the studio owner selects facilities: "Gym", "Studio Rooms", "Lounge"
    And the studio owner uploads studio photos (up to 5 images)
    And the studio owner enters contract start date "2026-06-01"
    And the studio owner enters preferred revenue share: "30%" (Movemate retains 25%, remaining 45% to studio)
    Then the system shows the B2B contract summary:
      - Studio name: FitZone Dubai Marina
      - Comemat share: 30%
      - Start date: 2026-06-01
      - Auto-renewal: Monthly (no long-term lock-in Phase 1)
    And the studio owner is prompted to digitally sign the contract (name + date)
    And the studio owner sees: "By signing, you agree to Movemate's terms of service"
    And the studio owner enters password for digital signature authentication
    And the studio owner taps "Accept & Sign"
    Then the contract is recorded in the system with timestamp
    And the studio admin account is created with status "Active"
    And the studio appears on the map in the customer app
    And the studio owner receives an email with:
      - Signed contract PDF download
      - Studio portal access link
      - Onboarding guide (slot management, booking reviews, analytics)
```

**Scenario 2: Studio with Pre-Existing Tenant Trainers**

```gherkin
  Scenario: Studio owner registers with several in-house trainers already on Movemate
    Given studio owner "ZenFlow Yoga" is registering
    And trainers Trainer A, Trainer B, and Trainer C are already on Movemate and work at ZenFlow
    When the studio owner completes registration
    Then the system identifies these trainers as "Studio-Affiliated"
    And the studio owner sees a list: "3 of your trainers are already verified on Movemate. Link them to this studio?"
    And the owner can click "Link" for each trainer
    Then those trainers' profiles show studio affiliation: "Based at: ZenFlow Yoga"
```

**Edge Case 1: Studio Owner Attempts to Sign Contract Twice**

```gherkin
  Scenario: Studio owner clicks "Accept & Sign" twice due to loading delay
    Given the contract signing screen
    When the owner clicks "Accept & Sign" twice in quick succession
    Then the first click is processed; the second is ignored (idempotent)
    And the contract is recorded only once
    And no duplicate contract record exists
```

**Edge Case 2: Invalid or Incomplete Address**

```gherkin
  Scenario: Studio owner enters a vague or incomplete address
    Given the studio owner enters address "Downtown Dubai" (no street address)
    When the owner taps "Verify Address"
    Then the system attempts geocoding via Google Maps API
    And if geocoding fails or returns multiple results, shows: "Please enter a more specific address (e.g., Building name, Street, Mall)"
    And the owner must refine before proceeding
```

**Edge Case 3: Studio Photos Upload Fails**

```gherkin
  Scenario: Internet cuts out during photo upload
    Given the studio owner is uploading 5 studio photos
    And the upload reaches 80% before network drops
    When the network reconnects
    Then the upload can resume from the interruption point
    And the owner is shown which photos successfully uploaded (3/5) and which failed
    And the owner can re-upload just the failed ones
```

**Definition of Done:**
- [ ] Studio registration form: name, address (geocoded), phone, email, facilities (checkboxes)
- [ ] Photos: up to 5 images, JPG/PNG, <2MB each, optional in Phase 1
- [ ] Studio location on map visible to customers (lat/lng stored)
- [ ] Revenue share percentage configurable (default 30%, range 20-50% in Phase 1)
- [ ] Contract PDF generated dynamically (name, terms, revenue share, dates)
- [ ] Digital signature: studio owner password required; signature timestamp recorded
- [ ] Contract stored in `movemate-studio-docs/[studio_id]/contract_signed_[date].pdf`
- [ ] Studio status: "Active" upon signing (no manual approval required)
- [ ] Studio admin receives portal login credentials via email
- [ ] Audit log entry: "Studio [ID] signed contract at [timestamp] with revenue share [X]%"
- [ ] Studio appears on customer map within 1 minute of contract signing
- [ ] RTL support: contract text, terms, facility labels available in Arabic
- [ ] Accessible: form fields labeled; photos upload with alt text fields

---

## US-006: Admin Trainer Approval Workflow

**User Story:**  
As an admin, I want to review and approve/reject trainer applications with notes so that only verified trainers are live on the platform.

**Acceptance Criteria — Primary Scenario:**

```gherkin
Feature: Admin Trainer Application Review & Approval

  Scenario: Admin approves a trainer application
    Given the admin logs into the admin panel
    And the admin navigates to "Trainer Applications" > "Pending Review"
    And there are 5 pending applications in the queue (FIFO order by submission time)
    When the admin clicks on trainer "Ahmed Al-Mansouri" application
    Then the admin sees the full profile in a detail view:
      - Emirates ID (image preview)
      - DSC Certifications (2 disciplines shown, expiry dates visible)
      - Reference contacts (names, emails shown; admin can see "Reference contacted on [date]" if already verified)
      - Intro video (playable)
      - Hourly rate: 200 AED
      - Trainer intro text
    And the admin can click "View Original ID" to see full-size Emirates ID image
    And the admin reviews all documents
    And the admin checks that:
      - Emirates ID is valid and not expired
      - DSC certs are recognized and current
      - At least 1 reference has been successfully contacted
      - Rate is reasonable (>0 AED, <500 AED)
    And the admin is satisfied with all criteria
    And the admin taps "Approve"
    Then the admin is prompted to optionally add approval notes: "Fast approval: excellent credentials"
    And the admin taps "Confirm"
    Then the trainer's status changes to "Approved"
    And the trainer is notified via email:
      "Congratulations! Your application has been approved. Your profile is now live on Movemate. You can start accepting bookings immediately."
    And the trainer sees their profile go live in the app with a "Founding Trainer" badge
    And the admin sees: "Trainer approved by [admin_name] on [timestamp]"
    And the application is moved to "Approved" archive
```

**Scenario 2: Admin Rejects a Trainer Application**

```gherkin
  Scenario: Admin rejects a trainer due to missing or invalid certification
    Given the admin is reviewing trainer "Fatima Al-Naqbi" application
    And the admin notices the DSC certification uploaded is for a discipline not in the approved list
    When the admin taps "Reject"
    Then the admin is prompted to select a reason (dropdown):
      - "Invalid or unrecognized DSC certification"
      - "Reference contact unresponsive"
      - "Credential conflict or duplicate account"
      - "Other (please specify)"
    And the admin selects "Invalid or unrecognized DSC certification"
    And the admin optionally adds detailed notes: "The 'Zumba Instructor' cert is not an approved DSC category. Please apply with a recognized discipline."
    And the admin taps "Send Rejection"
    Then the trainer's status changes to "Rejected"
    And the trainer receives an email:
      "Your application could not be approved at this time. Reason: [selected reason]. Details: [admin notes]. You may reapply with updated credentials."
    And the trainer sees option to "Reapply" in the app (creates a new application with previous data pre-filled)
    And the application is archived under "Rejected"
```

**Edge Case 1: Reference Contact Unresponsive**

```gherkin
  Scenario: Admin has sent 2 emails to reference contact with no response
    Given the trainer provided reference "trainer_buddy@email.com"
    When the admin has attempted contact on [date1] and [date2] with no response
    And the admin is reviewing the trainer's application
    Then the admin sees a note: "Reference contact unresponsive (attempts on [date1], [date2])"
    And the admin has 3 options:
      1. "Request Trainer to Provide Different Reference"
      2. "Request Trainer to Have Reference Contact Us Directly"
      3. "Approve Trainer Pending Reference" (with a caution flag)
    And the admin can choose option 1
    Then the trainer is sent: "One of your references is not responding. Please provide an alternative contact."
    And the application status returns to "Pending Resubmission"
```

**Edge Case 2: Admin Notices Duplicate Account**

```gherkin
  Scenario: Admin detects trainer has submitted 2 applications from different emails
    Given trainer "Mohammed Ahmed" has 2 pending applications:
      - App 1: email "mohammed@email.com", phone "9715551111"
      - App 2: email "mohammed.a@email.com", phone "9715551111"
    When the admin searches by phone "9715551111"
    Then the system flags: "Multiple applications from same phone number detected"
    And the admin sees both applications side-by-side
    And the admin can merge them or reject duplicates
```

**Edge Case 3: Trainer Reapplies After Rejection**

```gherkin
  Scenario: Trainer reapplies after rejection and provides valid certification
    Given trainer "Fatima" was rejected for invalid cert
    And the trainer receives the rejection email
    And the trainer taps "Reapply" in the app
    Then the reapplication form is pre-filled with her previous data (name, phone, rate, etc.)
    And the trainer can update just the certification field
    And the trainer taps "Submit Updated Application"
    Then a new application is created (separate from the rejected one)
    And the admin sees this as a "Reapplication from Rejected Trainer"
    And the admin can review the updated cert
    And if valid, approves immediately
```

**Definition of Done:**
- [ ] Admin panel: "Trainer Applications" section with tabs (Pending Review, Approved, Rejected, Pending Resubmission)
- [ ] Pending queue sorted by submission timestamp (oldest first — FIFO fairness)
- [ ] Detail view shows all documents: ID (image), certs (images/PDFs), intro video (player), references
- [ ] Admin can download documents individually or all-in-one ZIP
- [ ] Admin can mark references as "Contacted" with optional date picker (prevents duplicate outreach)
- [ ] Approval: status → "Approved", email sent to trainer, trainer becomes searchable in app, Founding Trainer badge assigned
- [ ] Rejection: status → "Rejected", rejection reason + notes emailed to trainer, Reapply button enabled in trainer app
- [ ] Reapplication request: status → "Pending Resubmission", trainer notified, allowed to update application
- [ ] Audit log: all decisions recorded with admin name, timestamp, reason (if rejection), notes
- [ ] No email sent until admin explicitly clicks "Confirm" (safety check against accidental approvals)
- [ ] Reference tracking: admin can see history of contact attempts (date, method, response status)
- [ ] Duplicate detection: flag if same phone/email used in multiple applications
- [ ] Bulk actions disabled in Phase 1 (all approvals/rejections are individual)
- [ ] RTL support: all reasons, notes, and email templates support Arabic
- [ ] Accessible: document previews properly sized; button states (disabled, loading) clearly indicated

---

## Out-of-Scope for Foundation (Sprint 1–2)

The following user stories are explicitly **NOT included** in the Foundation slice and are deferred to Sprint 3–6:

### Booking & Payment (Sprint 3–4)
- US-013: Customer booking + payment
- US-014: Cost breakdown display
- US-015: Booking confirmation + map
- US-016: Trainer booking notification
- US-017: Cancellation + refund UI
- US-018: Admin cancellation dispute review

### Chat & Session Experience (Sprint 5–6)
- US-019: Chat between customer and trainer
- US-020: Trainer views customer history
- US-021: Post-session rating & review
- US-022: Subscription upsell prompt
- US-023: Trainer rating updates

### Discovery (Sprint 3–4)
- US-007: Activity type selection
- US-008: Map view of studios
- US-009: Trainer availability at studio
- US-010: Trainer profile cards
- US-011: Trainer filtering
- US-012: Studio slot management

### Subscriptions (Sprint 5–6)
- US-024 through US-028: All subscription types

### Progress Tracking & Admin (Sprint 5–6)
- US-029 through US-036: Progress tracking, admin dashboard, penalties

---

## Definition of Done — All Foundation Stories

Every story is DONE when:

1. **Functional Requirements Met**
   - [ ] All primary scenario acceptance criteria passed
   - [ ] All edge cases handled (error messages, validation, retry logic)
   - [ ] No data loss on network failures (uploads resumable; forms auto-save)

2. **Technical Requirements**
   - [ ] TypeScript strict mode (no `any`, no implicit `unknown`)
   - [ ] All API responses validated against Zod schema
   - [ ] Error handling: 403/401/400/429 status codes mapped to user-friendly messages
   - [ ] No PII in application logs (emails, phone numbers, IDs hashed before logging)

3. **Security & Compliance**
   - [ ] All PII encrypted at rest (AES-256) and in transit (TLS 1.3)
   - [ ] Document uploads use presigned S3 URLs (never via API server)
   - [ ] Admin access requires MFA (Cognito)
   - [ ] Audit trail recorded for all sensitive actions (approval, rejection, document access)

4. **Localization & Accessibility**
   - [ ] All user-facing text in English + Arabic
   - [ ] RTL layout applied (not just text direction; layout flows right-to-left)
   - [ ] WCAG 2.1 AA compliance: contrast ratio 4.5:1, touch targets 48x48px, labels associated with form fields
   - [ ] Screen reader tested (form labels, error messages, button states announced)

5. **Testing**
   - [ ] Unit tests: >80% code coverage (Jest, `npm run test:coverage`)
   - [ ] Integration tests: at least 1 integration test per API endpoint (Supertest)
   - [ ] E2E test (Detox for mobile, Playwright for web): happy path scenario for each story
   - [ ] Regression suite: added to CI/CD gate (must pass before merge to main)

6. **Code Quality**
   - [ ] PR reviewed by Tech Lead (all feedback addressed before merge)
   - [ ] No console.logs or debug code in production branch
   - [ ] No hardcoded secrets or API keys (all in AWS Secrets Manager)
   - [ ] Prettier formatted; ESLint passing

7. **Documentation**
   - [ ] API endpoints documented in OpenAPI spec (auto-generated from Fastify)
   - [ ] Database schema migrations documented (Prisma migration files)
   - [ ] Known limitations or assumptions noted (e.g., "Intro video OCR not implemented")

8. **QA Sign-Off**
   - [ ] QA functional testing passed (all acceptance criteria verified)
   - [ ] QA security testing passed (input validation, injection testing)
   - [ ] QA accessibility testing passed (screen reader, keyboard nav, color contrast)
   - [ ] No P1/P2 bugs open (P3/P4 can defer to future sprints)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-03  
**Approval:** Pending PO review & Design sync
