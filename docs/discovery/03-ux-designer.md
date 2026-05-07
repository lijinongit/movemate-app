# UX Designer — Discovery Phase Deliverable
## Foundation Flow Wireframes & Design System (Sprint 1–2)

**Phase:** Discovery  
**Owner:** UX Designer (🎨)  
**Scope:** Customer & Trainer Onboarding Screens (Epic 1 — US-001 through US-006)  
**Sprint Timeline:** Weeks 1–4 of 12-week MVP  
**Design System:** Speed First, Trust Signals, Inclusive Design, Calm Complexity

---

## Design Principles

### 1. Speed First
On-demand means every tap is friction. Users should reach a verified account in under 5 minutes. No unnecessary fields, no multi-step wizards without progress indication.

**In Practice:**
- Registration: email → OTP → Emirates ID upload = 3 screens, <3 minutes for customer
- Trainer onboarding: profile → certs → references → submit = 4 screens, <8 minutes
- Progress bar on long forms (always show where you are)

### 2. Trust Signals
Users are meeting strangers; trainers are betting their reputation. Certification badges, Emirates ID verification status, reference validation, and intro videos must be **immediately visible** and prominent.

**In Practice:**
- Trainer profile: "DSC Verified" badge (green checkmark + certification detail)
- Customer status: "ID Verified" visible in trainer's pre-booking confirmation
- Admin approval: give trainers a real-time status: "Pending → Reviewing → Approved" (not a black box)
- Transparency: show admin approval time ("Approved in 2 hours")

### 3. Inclusive Design
All ages use this app. 16-year-old customers, 60-year-old trainers, studio owners with visual impairments. Design for the edges.

**In Practice:**
- Font sizes: minimum 16px for body text (mobile), 18px+ for form inputs
- Contrast ratios: WCAG 2.1 AA (4.5:1 for text on backgrounds)
- Touch targets: 48x48px minimum (button, input, icon)
- RTL native: don't mirror English; design for Arabic from the start
- Keyboard navigation: every interactive element accessible via Tab
- Screen readers: all images have alt text; forms have associated labels; buttons announce state

### 4. Calm Complexity
Three user types (Customer, Trainer, Studio) see different flows. A trainer should never see studio slot management; a customer should never see trainer earnings. Each user gets a tailored, focused experience. No cognitive overload.

**In Practice:**
- Role-based navigation (Tab bar shows only relevant screens)
- Context-aware copy (trainers see "sessions", customers see "bookings")
- Feature gates: under-18 content hidden from adults; adult-only disciplines hidden from minors
- Progressive disclosure: show basics first, advanced settings only if user seeks them

---

## Screen Map: Foundation Flow

```
WELCOME / ROLE SELECT
    ↓
CUSTOMER PATH              TRAINER PATH              STUDIO PATH
    ↓                          ↓                         ↓
Registration (Email/Phone)  Registration (Email/Phone)  Registration (Email/Business)
    ↓                          ↓                         ↓
OTP Verification           OTP Verification            OTP Verification
    ↓                          ↓                         ↓
Emirates ID Upload         Emirates ID Upload          Address Verification
    ↓                          ↓                         ↓
Age Check                   DSC Cert Upload            Contract Review & Sign
    ↓                          ↓                         ↓
(If <18) Parent Consent     References Contact          Studio Portal Home
    ↓                          ↓
Home Stub                   Intro Video (Optional)
(Profile, Discovery)           ↓
                            Rate Setting
                               ↓
                            Application Status
                            (Pending → Approved → Home)
```

---

## Screen-by-Screen Specifications

### SCREEN 1: Welcome / Role Select

**Purpose:** User specifies whether they are a customer, trainer, or studio owner.

**Layout (Top-to-Bottom):**

```
┌─────────────────────────────────────┐
│                                     │
│   [MOVEMATE LOGO]                   │
│                                     │
│   Find Your Perfect Coach            │ ← Headline (24px, bold)
│   Real-time, certified trainers      │ ← Subheading (14px, gray)
│
│   [                                ] │ ← Card 1: "I'm Looking for a Coach"
│   👤                                 │
│   Customer                           │
│   Browse & book sessions            │ 
│
│   [                                ] │ ← Card 2: "I'm a Trainer"
│   🏋️                                 │
│   Trainer                           │
│   Share your expertise              │
│
│   [                                ] │ ← Card 3: "I Own a Studio"
│   🏢                                 │
│   Studio                            │
│   Manage your space                 │
│
│   Already have an account?          │ ← Footer link
│   Log in                            │
│
└─────────────────────────────────────┘
```

**Copy:**

| Language | Headline | Subheading | Customer CTA | Trainer CTA | Studio CTA |
|----------|----------|------------|-------------|------------|-----------|
| English | Find Your Perfect Coach | Real-time, certified trainers | I'm Looking for a Coach | I'm a Trainer | I Own a Studio |
| Arabic | ابحث عن مدربك المثالي | مدربون معتمدون في الوقت الفعلي | أنا أبحث عن مدرب | أنا مدرب | أمتلك استوديو |

**Interaction States:**
- **Default:** Card background light gray, icon centered, text black
- **Hover (Desktop):** Card background light brand color, icon slightly scaled (1.05x)
- **Pressed (Mobile):** Card background brand color (30% opacity), text bold
- **Loading:** Card shows spinner, text grayed out, not clickable

**RTL Considerations:**
- Cards laid out vertically in both LTR and RTL (no mirroring needed)
- Text aligns right in Arabic, left in English (natural for each language)
- Logo stays centered (language-agnostic)

**Accessibility:**
- Headline: `<h1>`, 24px bold, #000
- Subheading: `<p>`, 14px, #666
- Cards: `<button>` elements (not `<div>`); each has `aria-label="I'm Looking for a Coach"` (narrated by screen readers)
- Touch target: each card 64px minimum height
- Color contrast: Cards have border (1px solid #ccc) for visual definition, not relying on color alone

**Mobile Responsiveness:**
- Width: 100% (full screen)
- Padding: 16px left/right (16px gutters on small screens)
- Cards: 100% width, stacked vertically
- Font sizes: same as desktop (16px+ body, 24px headline maintained even on small screens)

---

### SCREEN 2: Registration (Email or Phone)

**Purpose:** Create account. User enters email/phone, password, name, and language preference.

**Layout (Top-to-Bottom):**

```
┌─────────────────────────────────────┐
│ ← Back          Register       ?    │ ← Header: back button, title, help icon
│
│ Step 1 of 3 ████░░░░░░░░░░        │ ← Progress bar (visual + text)
│
│ What's your name?                  │
│ ┌─────────────────────────────────┐│ 
│ │ First Name                  (16) ││ ← Text input, 16px font, placeholder text light gray
│ └─────────────────────────────────┘│
│
│ ┌─────────────────────────────────┐│
│ │ Last Name                   (16) ││
│ └─────────────────────────────────┘│
│
│ How do you want to sign in?        │
│ ◉ Email     ◯ Phone              │ ← Radio button group, icons for visual clarity
│
│ ┌─────────────────────────────────┐│
│ │ ali@example.com            (14) ││ ← Email input or phone input (conditional)
│ └─────────────────────────────────┘│
│
│ Create a password                  │
│ ┌─────────────────────────────────┐│
│ │ ••••••••••••••             👁    ││ ← Password input with show/hide toggle
│ └─────────────────────────────────┘│
│ Min. 8 characters, uppercase, number, symbol │ ← Requirements text (12px, #666)
│
│ Preferred language                 │
│ ┌─────────────────────────────────┐│
│ │ English              ▼           ││ ← Dropdown (English / العربية)
│ └─────────────────────────────────┘│
│
│ ☐ I agree to Terms of Service   │ ← Checkbox with link
│
│ [         Continue        ]         │ ← CTA button, disabled until form valid
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | What's your name? | ما اسمك؟ |
| Sign-in | Email / Phone | البريد الإلكتروني / الهاتف |
| Password | Create a password | إنشاء كلمة مرور |
| Requirements | Min. 8 characters, uppercase, number, symbol | 8 أحرف على الأقل، أحرف كبيرة، أرقام، رموز |
| Language | Preferred language | اللغة المفضلة |
| Terms | I agree to Terms of Service | أوافق على شروط الخدمة |
| CTA | Continue | متابعة |

**Validation & Error States:**

| Field | Error Message | Visual Cue |
|-------|---------------|-----------|
| First Name (empty) | Please enter your first name | Red border, red text below field |
| Email (invalid format) | Please enter a valid email address | Red border, inline icon |
| Password (weak) | Password must include: 8+ chars, 1 uppercase, 1 number, 1 symbol | Red border, checklist appears below field (✓/✗ for each requirement) |
| Terms (unchecked) | You must accept the Terms of Service to continue | Checkbox highlighted, hint text appears |

**Interaction States:**
- **Empty field:** border #ddd, placeholder visible
- **Focused field:** border #FF6B35 (brand color), blue shadow (4px glow)
- **Invalid field:** border #EF476F (red), background #FFF5F5, error message in red 12px below
- **Valid field:** green checkmark icon appears on the right (optional, for positive feedback)
- **CTA button (disabled):** gray background, opacity 0.5, cursor not-allowed
- **CTA button (enabled):** brand color (#FF6B35), white text, shadow on press
- **Loading state:** button shows spinner inside, text hidden, button disabled

**RTL Considerations:**
- Input labels right-aligned in Arabic, left-aligned in English
- Checkboxes: checkbox on the left in LTR, right in RTL
- Password show/hide icon: on the right in LTR, left in RTL
- Dropdown arrow: on the right in LTR, left in RTL (native HTML dropdown handles this)
- Progress bar: left-to-right fill in both LTR and RTL (progress is progress)

**Accessibility:**
- Labels: `<label for="firstName">` + `<input id="firstName">` (associated)
- Error messages: `aria-live="polite"` region; announced when validation fails
- Password strength: checklist has `aria-checked` state for each requirement
- Radio buttons: grouped with `<fieldset>` + `<legend>`
- Dropdown: native `<select>` (or accessible custom select via ARIA)
- CTA button: `aria-disabled="true"` when validation fails

**Mobile Responsiveness:**
- Full width, 16px padding
- Input heights: 48px (larger for thumb tap accuracy)
- Font size: 16px (prevents auto-zoom on iOS)
- Spacing between inputs: 12px (comfortable for touch)

---

### SCREEN 3: OTP Verification

**Purpose:** Verify email or phone by entering 6-digit OTP.

**Layout:**

```
┌─────────────────────────────────────┐
│         OTP Verification            │ ← Title, centered
│                                     │
│ We sent a code to:                 │
│ ali@example.com (or +971501234567) │ ← Display masked identifier
│                                     │
│ Enter the code:                     │
│ [_][_][_][_][_][_]                │ ← 6 input boxes, auto-advance on digit entry
│
│ Didn't receive the code?           │
│ Resend (00:45 remaining)           │ ← Countdown timer, resend link disabled during timer
│
│ [        Verify & Continue        ]│ ← CTA, disabled until all 6 digits filled
│
│ ← Back                             │ ← Secondary action
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Title | OTP Verification | التحقق من رمز OTP |
| Instruction | We sent a code to | أرسلنا رمزًا إلى |
| Resend | Didn't receive the code? Resend | لم تتلقَّ الرمز؟ إعادة الإرسال |
| Timer | remaining | متبقي |
| CTA | Verify & Continue | تحقق و استمرار |
| Error | Invalid code. Please try again. | رمز غير صحيح. حاول مجددًا |

**Interaction States:**
- **OTP input boxes:** 
  - Empty: border #ddd, background white
  - Focused: border brand color, blue glow, cursor active
  - Filled (valid digit): background brand color (20% opacity), text bold
  - Invalid code entered: all boxes shake animation (CSS animation), red border, error message appears below
- **Resend button:**
  - During countdown: gray, cursor not-allowed, text shows remaining time (00:45)
  - After countdown: brand color, clickable
- **CTA button:**
  - While filling digits: disabled (gray, opacity 0.5)
  - All 6 digits filled: enabled (brand color)
  - On click (loading): spinner inside, text hidden
  - After verification: fade out, home screen slides in

**RTL Considerations:**
- Input boxes: still left-to-right (users type left-to-right regardless of language)
- Text: right-aligned in Arabic, left-aligned in English
- Timer: countdown is language-neutral (numbers)

**Accessibility:**
- OTP inputs: `<input type="text" inputmode="numeric" maxlength="1">` (6 separate inputs)
- Inputs automatically advance to next field on digit entry (keyboard event handler)
- Error message: `aria-live="assertive"` (priority announcement)
- Resend button: announces remaining time every 10 seconds or on focus
- CTA button: `aria-disabled="true"` until ready

**Mobile Responsiveness:**
- Full width
- OTP input boxes: 40x40px each, 8px spacing between
- Larger font (18px) for OTP digits (easier to read)

---

### SCREEN 4: Emirates ID Upload

**Purpose:** Customer or trainer uploads a photo of their Emirates ID for identity verification.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back      Add Identity       ?    │
│
│ Step 2 of 3 ████████░░░░░░░░      │
│
│ Add Your Emirates ID                │ ← Headline
│ We need this to verify your         │
│ identity and keep everyone safe     │ ← Reassurance copy
│
│ ┌─────────────────────────────────┐│
│ │  📸                             ││ ← Large icon (camera, centered)
│ │                                 ││
│ │  Tap to upload a photo of      ││
│ │  your Emirates ID              ││ ← CTA text
│ │                                 ││
│ │  JPG or PNG, max 5MB           ││ ← Guidance (12px, gray)
│ └─────────────────────────────────┘│
│
│ Tips for a clear photo:            │ ← Expandable section
│ ▼                                  │
│ • Keep the ID flat and well-lit   │
│ • Ensure text is readable         │
│ • Avoid shadows or reflections    │
│
│ [     Uploading... 60%        ]    │ ← Progress bar during upload
│
│ Your identity will be verified     │
│ within 2–4 hours.                  │ ← Expected timeline
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | Add Your Emirates ID | أضف هويتك الإماراتية |
| Subheading | We need this to verify your identity and keep everyone safe | نحتاج هذا للتحقق من هويتك وضمان السلامة |
| CTA | Tap to upload a photo of your Emirates ID | اضغط لتحميل صورة بطاقتك |
| Format | JPG or PNG, max 5MB | JPG أو PNG، الحد الأقصى 5 ميجابايت |
| Tips | Keep the ID flat and well-lit / Ensure text is readable / Avoid shadows | ابق البطاقة مسطحة وموضحة / تأكد من قراءة النص / تجنب الظلال |
| Status | Your identity will be verified within 2–4 hours. | سيتم التحقق من هويتك خلال 2-4 ساعات |

**Interaction States:**
- **Upload box (idle):** border #ddd (dashed), background light gray, camera icon centered
- **Upload box (hover):** background brand color (10% opacity), border brand color, cursor pointer
- **During upload:** 
  - File input hidden (native file picker opens on tap)
  - Progress bar appears below box (0–100%), blue background
  - Text: "Uploading... X%"
  - Cancel button appears next to progress bar (if upload >2 seconds)
- **Upload success:**
  - Image preview shows (auto-cropped to ID area if possible)
  - File size and name shown below
  - "Edit" and "Confirm" buttons appear
  - Edit: allows user to re-crop or upload a different image
  - Confirm: proceeds to next screen, image sent to admin queue
- **Upload failure:**
  - Error message: "Upload failed. Please check your connection and try again." (red text)
  - Retry button appears
  - Original upload box reappears

**Image Validation (Client-Side):**
- File format: JPEG, PNG only (reject BMP, WebP, GIF, etc.)
- File size: reject if >5MB
- Image dimensions: minimum 400x300px (too small = unreadable)
- Blur detection: if image is very blurry (via client-side ML or visual heuristic), warn user

**RTL Considerations:**
- Headline: right-aligned in Arabic
- Tips list: bullets on the right in RTL
- Progress bar: left-to-right fill in both LTR and RTL
- Buttons (Edit/Confirm): order same in both languages

**Accessibility:**
- File input: `<label>` associated with file input, click label to open file picker
- Error messages: `aria-live="polite"`
- Image preview: `<img alt="Your Emirates ID preview">`
- Progress bar: `<progress max="100" value="60">` or `aria-valuenow="60"`

**Mobile Responsiveness:**
- Full-width upload box (100% - 32px padding)
- Large tap target: upload box height 120px minimum
- Camera icon: 48px
- Text: 16px body, 14px guidance

---

### SCREEN 5: Age Check (Customer Only)

**Purpose:** Determine if user is under 18. If yes, redirect to parent/guardian consent flow.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    Age Verification      ?   │
│
│ Step 3 of 3 ████████████░░░░░░     │
│
│ Are you 18 or older?                │
│
│ We need to know to ensure we        │
│ follow local safety rules.          │
│
│ ◯ Yes, I'm 18 or older           │
│ ◯ No, I'm under 18               │ ← Radio buttons, large touch targets
│
│ [         Continue           ]      │ ← CTA (disabled until selected)
│
│ ← Back                             │
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | Are you 18 or older? | هل تبلغ من العمر 18 سنة أو أكثر؟ |
| Explanation | We need to know to ensure we follow local safety rules. | نحتاج إلى معرفة ذلك لضمان اتباع قواعد السلامة المحلية |
| Option 1 | Yes, I'm 18 or older | نعم، أنا بعمر 18 سنة أو أكثر |
| Option 2 | No, I'm under 18 | لا، أنا أقل من 18 سنة |

**Interaction States:**
- **Radio button (unselected):** circle border #ddd, background white
- **Radio button (hover):** border brand color
- **Radio button (selected):** filled circle (brand color), white background
- **CTA button (no selection):** disabled, gray, opacity 0.5
- **CTA button (selected):** brand color, clickable

**Navigation:**
- If "Yes, I'm 18+": Proceed to Home Stub (registration complete)
- If "No, I'm under 18": Proceed to Screen 6 (Parent/Guardian Consent)

**Accessibility:**
- Radio buttons: `<fieldset>` + `<legend>` for grouping
- Each radio: associated `<label>` for large click target
- Radio value announced by screen reader

---

### SCREEN 6: Parent/Guardian Consent (Under-18 Only)

**Purpose:** Collect parent/guardian info and consent for under-18 users.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    Parent Consent        ?   │
│
│ Your parent or guardian             │ ← Headline (18px bold)
│ must verify their identity.         │
│
│ What is your parent/guardian's      │ ← Section 1: Parent info
│ email address?                      │
│ ┌─────────────────────────────────┐│
│ │ parent@example.com          (14)││
│ └─────────────────────────────────┘│
│
│ We'll send them a verification link.│ ← Explanation
│
│ [      Send Verification Link     ]│ ← CTA
│
│ OR                                  │ ← Divider
│
│ Your parent/guardian can upload     │ ← Section 2: Alternate path
│ their Emirates ID using this link:  │
│ [Copy Link]                        │
│
│ Share this link with your parent:   │
│ [https://movemate.app/join/guardian│ ← Shareable link (can copy to clipboard)
│  ?ref=CHILD123]                     │
│
│ Share via:  [WhatsApp] [Email]     │ ← Quick share buttons
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | Your parent or guardian must verify their identity. | يجب على والدك أو وصيك التحقق من هويته |
| Question | What is your parent/guardian's email address? | ما هو بريد والدك أو وصيك الإلكتروني؟ |
| CTA 1 | Send Verification Link | إرسال رابط التحقق |
| Divider | OR | أو |
| CTA 2 | Share this link with your parent | شارك هذا الرابط مع والدك |

**Interaction States:**
- **Email input:** standard input, validation same as Screen 2
- **"Send Link" button:** on click, shows confirmation "Email sent to parent@example.com"
- **"Copy Link" button:** on click, copies link to clipboard, shows "Copied!" tooltip (2 sec)
- **Share buttons:** 
  - WhatsApp: opens WhatsApp share dialog (if on mobile) with pre-filled message
  - Email: opens mailto: with pre-filled subject and body

**After Parent Verification:**
- Parent receives email with link to guardian verification flow
- Parent registers and uploads their Emirates ID
- System links parent account to child account
- Child is notified: "Your parent has verified their identity. You're all set!"
- Child proceeds to Home Stub (registration complete)

**Accessibility:**
- Email input: labeled with `<label>`
- Share buttons: clear icons + text labels
- Copy link button: announces "Copied!" state to screen readers

---

### SCREEN 7: Home Stub (Customer Registration Complete)

**Purpose:** Onboarding complete; customer can now explore trainers (Phase 2) or view profile.

**Layout:**

```
┌─────────────────────────────────────┐
│ ✓                                   │ ← Checkmark or celebration animation
│
│ Welcome to Movemate, Ali!           │ ← Personalized greeting
│
│ Your account is verified.           │ ← Confirmation message
│ You're all set to book.             │
│
│ [         Start Exploring        ]  │ ← CTA: goes to Discovery flow (US-007+)
│
│ ── What happens next? ──            │ ← Informational section
│ 1. Find a trainer                   │
│ 2. Book a session                   │
│ 3. Train & improve                  │
│
│ ← View Profile                      │ ← Secondary navigation
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Greeting | Welcome to Movemate, [Name]! | مرحبا بك في Movemate، [الاسم]! |
| Confirmation | Your account is verified. You're all set to book. | تم التحقق من حسابك. أنت جاهز للحجز. |
| CTA | Start Exploring | ابدأ الاستكشاف |
| Step 1 | Find a trainer | ابحث عن مدرب |
| Step 2 | Book a session | احجز جلسة |
| Step 3 | Train & improve | تدرب وتحسن |

**Interaction States:**
- **Celebration animation:** 2-3 second confetti or checkmark animation on entry
- **"Start Exploring" button:** navigates to Discovery flow (deferred to Sprint 3)
- **"View Profile" link:** shows customer profile (editable name, email, language, notifications)

**Accessibility:**
- Success message: `aria-live="polite"` announces to screen reader
- Checkmark: decorative (has `role="presentation"` and `aria-hidden="true"`)

---

### SCREEN 8: Trainer Application Form (Part 1: Emirates ID + Profile)

**Purpose:** Trainer registration: collect basic info, Emirates ID, rate.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    Complete Your Profile  ?  │
│
│ Step 1 of 4 ████░░░░░░░░░░░░       │ ← Progress bar
│
│ First, let's verify who you are.   │
│ (Upload Emirates ID — same as      │
│ customers, US-002 flow)            │
│
│ [     Add Your Emirates ID    ]     │
│ (See Screen 4 layout above)         │
│
│ Next, tell us about your skills.   │
│
│ What's your hourly rate? (AED)     │
│ ┌─────────────────────────────────┐│
│ │ 200                         (18)││ ← Number input with currency symbol
│ └─────────────────────────────────┘│
│
│ [         Next: Certifications   ]  │ ← CTA
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline 1 | First, let's verify who you are. | أولاً، دعنا نتحقق من هويتك |
| Headline 2 | Next, tell us about your skills. | بعد ذلك، أخبرنا عن مهاراتك |
| Rate Label | What's your hourly rate? (AED) | ما هو سعرك بالساعة؟ (د.إ) |

**Interaction States:**
- **Rate input:**
  - Empty: placeholder "e.g., 200"
  - Focused: border brand color
  - Invalid (<50 or >500): error "Rate must be between 50 and 500 AED"
  - Valid: green checkmark appears

**Accessibility:**
- Rate input: `<input type="number" min="50" max="500">`
- Label: associated with input

---

### SCREEN 9: Trainer Application Form (Part 2: Certifications)

**Purpose:** Upload DSC certifications for one or more disciplines.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    Certifications         ?  │
│
│ Step 2 of 4 ████████░░░░░░░░░      │
│
│ Which disciplines do you teach?    │ ← Headline
│ (Select at least one, up to 6)     │
│
│ ☐ Personal Training               │ ← Discipline checkbox
│   Upload cert: [  Choose File  ]   │ ← File input (appears when checked)
│   Expires: [Date picker]           │ ← Expiry date picker
│   Status: ✓ Valid (updated)        │ ← OCR-extracted or manually entered
│
│ ☐ Dance / Movement                │
│
│ ☐ Swimming                        │
│
│ ☐ Football (Soccer)              │
│
│ ☐ Cricket                        │
│
│ ☐ Yoga & Wellness               │
│
│ [           Next: References       ] │ ← CTA (enabled when ≥1 cert uploaded)
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | Which disciplines do you teach? (Select at least one, up to 6) | ما هي التخصصات التي تدرسها؟ (اختر واحدًا على الأقل، حتى 6) |
| Personal Training | Personal Training | التدريب الشخصي |
| Dance | Dance / Movement | الرقص / الحركة |
| Swimming | Swimming | السباحة |
| Football | Football (Soccer) | كرة القدم |
| Cricket | Cricket | الكريكيت |
| Yoga | Yoga & Wellness | اليوغا والعافية |
| File Input | Choose File | اختر ملف |
| Expires | Expires | تنتهي الصلاحية |
| Status | Valid | صحيح |

**Interaction States:**
- **Unchecked discipline:** light gray background, checkbox unchecked
- **Checked discipline:** light brand color background, file input + date picker appear (animated slide-down)
- **File input:** after file selected, shows file name and size
- **Expiry date:** date picker (datepicker UI or native HTML5 `<input type="date">`)
- **Status badge:** green checkmark if cert detected as valid; yellow warning if expiry is <3 months; red X if expired or unrecognized
- **CTA button:** disabled until ≥1 valid cert uploaded

**Accessibility:**
- Discipline checkboxes: `<label>` wraps checkbox + text
- File inputs: `<input type="file" accept=".jpg,.png,.pdf">`
- Date picker: native `<input type="date">` (accessible by default)

---

### SCREEN 10: Trainer Application Form (Part 3: References)

**Purpose:** Collect 2 reference contacts for background check.

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    References              ? │
│
│ Step 3 of 4 ████████████░░░░░      │
│
│ We'll reach out to your references  │ ← Explanation
│ to confirm your experience.         │
│
│ Reference 1                         │ ← Card 1
│ ┌─────────────────────────────────┐│
│ │ Full Name                   (16)││
│ │ ___________________________     │
│ │                             │
│ │ Email Address               │
│ │ ___________________________     │
│ │                             │
│ │ Relationship                ▼   │ ← Dropdown: "Gym Manager", "Client", "Coach", "Other"
│ │ ___________________________     │
│ └─────────────────────────────────┘│
│
│ Reference 2                         │ ← Card 2 (identical)
│ ┌─────────────────────────────────┐│
│ │ Full Name                       │
│ │ ___________________________     │
│ │                             │
│ │ Email Address               │
│ │ ___________________________     │
│ │                             │
│ │ Relationship                ▼   │
│ │ ___________________________     │
│ └─────────────────────────────────┘│
│
│ [        Next: Intro Video        ]│ ← CTA
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Explanation | We'll reach out to your references to confirm your experience. | سنتواصل مع مراجعك للتأكد من خبرتك |
| Name | Full Name | الاسم الكامل |
| Email | Email Address | عنوان البريد الإلكتروني |
| Relationship | Relationship | العلاقة |
| CTA | Next: Intro Video | التالي: فيديو تعريفي |
| Relationship Options | Gym Manager / Current Client / Previous Client / Coach / Studio Owner / Other | مدير الصالة / عميل حالي / عميل سابق / مدرب / صاحب استوديو / آخر |

**Interaction States:**
- **Text inputs (Name, Email):** standard, validation as in Screen 2
- **Relationship dropdown:** shows options, user can select
- **CTA button:** disabled until both references have name + email + relationship filled

**Accessibility:**
- Text inputs: `<label>` associated with each `<input>`
- Dropdown: `<select>` (native, accessible)
- Error messages: `aria-live="polite"`

---

### SCREEN 11: Trainer Application Form (Part 4: Intro Video)

**Purpose:** Record optional intro video (30–60 seconds).

**Layout:**

```
┌─────────────────────────────────────┐
│ ← Back    Introduce Yourself      ? │
│
│ Step 4 of 4 ████████████████░░░    │
│
│ Record a short intro video          │ ← Headline
│ (30–60 seconds, optional)           │ ← Subheading (optional note)
│
│ Customers love seeing you! Share:  │ ← Motivation copy
│ • Your training style              │
│ • Your background                  │
│ • What you love about coaching     │
│
│ ┌─────────────────────────────────┐│
│ │           📹                    ││ ← Large camera icon
│ │                                 ││
│ │  Tap to Start Recording         ││ ← CTA text
│ │                                 ││
│ │  (You'll need camera permission)││ ← Guidance
│ └─────────────────────────────────┘│
│
│ OR                                  │ ← Divider
│
│ [  Upload Existing Video  ]         │ ← File picker for pre-recorded video
│
│ [    Submit Application    ]        │ ← Final CTA (skips video if not recorded)
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Headline | Record a short intro video | اسجل فيديو تعريفي قصير |
| Duration | (30–60 seconds, optional) | (30-60 ثانية، اختياري) |
| Motivation | Customers love seeing you! Share: / Your training style / Your background / What you love about coaching | يحب العملاء رؤيتك! شارك: / أسلوب تدريبك / خلفيتك / ما تحب فيه التدريب |
| CTA 1 | Tap to Start Recording | اضغط لبدء التسجيل |
| CTA 2 | Upload Existing Video | رفع فيديو موجود |
| Final CTA | Submit Application | إرسال الطلب |

**Recording States:**
- **Pre-recording:** large camera icon, "Tap to Start Recording" button
- **Recording active:** 
  - Video preview from device camera (portrait mode)
  - Red circle "Stop Recording" button (large, thumb-friendly)
  - Timer counting up: 0:00 → 1:00 (label turns red if >60 seconds)
  - Guidance text: "Keep it between 30–60 seconds"
- **Recording finished:**
  - Preview of recorded video (thumbnail or short preview)
  - "Retake" button (deletes recording, starts over)
  - "Use This Video" button (saves to app state)
  - File size shown below

**Upload States:**
- If user chooses "Upload Existing Video":
  - File picker opens (MP4, WebM accepted)
  - Max file size: 50MB
  - After selection, shows preview as above

**Accessibility:**
- Camera permission prompt: clear explanation before requesting (iOS)
- Recording button: large (48px+), clear state (red = recording)
- Timer: announced every 10 seconds ("You've recorded 30 seconds")
- Video preview: has alt text describing content

---

### SCREEN 12: Application Status (Pending Review)

**Purpose:** Trainer sees their application status in real-time.

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│ ✉️  Application Submitted           │ ← Icon + status
│
│ We're reviewing your application.   │ ← Message
│ This usually takes 2–4 hours.       │
│
│ ┌─────────────────────────────────┐│
│ │  Status Timeline                ││ ← Expandable section
│ │  ▼                              ││
│ │  ✓ Documents Received (now)     ││ ← Step 1: completed
│ │  ⧖ Under Review (2–4 hours)    ││ ← Step 2: in progress (spinner)
│ │  ◯ Decision Sent (pending)      ││ ← Step 3: pending (empty circle)
│ └─────────────────────────────────┘│
│
│ [     Check Status Again    ]      │ ← Button to manually refresh
│
│ In the meantime:                   │
│ • Complete your profile photo      │
│ • Write your trainer bio            │ ← Secondary tasks
│ • Set your availability             │
│
│ Questions?                         │
│ Contact us: support@movemate.app   │
│
└─────────────────────────────────────┘
```

**Copy:**

| Element | English | Arabic |
|---------|---------|--------|
| Status | Application Submitted | تم تقديم الطلب |
| Message | We're reviewing your application. This usually takes 2–4 hours. | نحن نراجع طلبك. عادةً ما يستغرق هذا ساعتين إلى أربع ساعات |
| Timeline Header | Status Timeline | خط الحالة |
| Step 1 | Documents Received (now) | تم استقبال المستندات (الآن) |
| Step 2 | Under Review (2–4 hours) | قيد المراجعة (2-4 ساعات) |
| Step 3 | Decision Sent (pending) | تم إرسال القرار (قيد الانتظار) |
| Refresh | Check Status Again | تحقق من الحالة مرة أخرى |
| Secondary | Complete your profile photo / Write your trainer bio / Set your availability | أكمل صورة ملفك الشخصي / اكتب سيرتك الذاتية / حدد توفرك |
| Support | Contact us: support@movemate.app | اتصل بنا: support@movemate.app |

**Polling/Real-Time Updates:**
- Status updates via WebSocket (if real-time available) or polling every 30 seconds
- When status changes to "Approved": 
  - Screen animates to show success (confetti or checkmark)
  - Notification sent
  - "Go to Profile" button appears
  - Trainer navigates to Home (can now accept bookings in Sprint 3)
- When status changes to "Rejected":
  - Reason displayed with empathy
  - "Reapply" button appears (creates new application with form pre-filled)

**Accessibility:**
- Timeline: semantic HTML `<ol>` or `<ul>` with `aria-current="step"` on active step
- Spinner on "Under Review": `aria-label="Reviewing your application"`

---

## Interaction States & Loading States

### Global Loading States

**API Call in Progress (any screen):**
- Button shows spinner icon + text changes to "Loading..." (if applicable)
- Button is disabled (cursor not-allowed)
- Timeout after 10s: error message appears, button re-enables "Retry"

**Image/Video Upload in Progress:**
- Progress bar visible (0–100%)
- Text: "Uploading... 45%"
- Cancel button appears (if upload >2 seconds)

**Network Offline:**
- Notification banner at top: "You're offline. Some features unavailable." (yellow background)
- Form inputs remain visible but CTA buttons disabled
- Error message if user tries to submit: "Please check your connection and try again."
- Automatic retry when connection restored

### Error States (General)

**Validation Error:**
- Field border turns red (#EF476F)
- Background light red (#FFF5F5)
- Error message in red text below field (12px)
- Message is `aria-live="polite"` (announced to screen readers)

**Network Error:**
- Toast notification: "Connection lost. Tap to retry." (2s auto-dismiss)
- or inline error in form: "Failed to upload. Please try again."

**Server Error (5xx):**
- Modal dialog: "Something went wrong. Please try again later." (friendly messaging)
- Error ID provided for support: "Error #abc123"

---

## Accessibility Features (WCAG 2.1 AA Compliance)

### Color & Contrast
- **Foreground/Background contrast:** minimum 4.5:1 for text, 3:1 for large text (18px+)
- **Non-text contrast:** 3:1 for UI components and graphical objects
- **Color not sole identifier:** errors communicated with icon + text, not color alone

### Typography
- **Font sizes:**
  - Headline: 24px (mobile), 28px (desktop)
  - Body: 16px minimum
  - Labels: 14px
  - Help text / hints: 12px
  - All with line-height 1.5 (for dyslexic readers)

### Keyboard Navigation
- **Tab order:** logical (left-to-right, top-to-bottom)
- **Skip link:** "Skip to main content" link at top of each screen
- **Focus visible:** blue ring (2px, 4px offset) around focused element
- **No keyboard traps:** all interactive elements reachable without mouse

### Screen Reader Support
- **Labels:** all form inputs have associated `<label>`
- **Landmark regions:** `<nav>`, `<main>`, `<form>`, `<section>` semantic HTML
- **Alt text:** all images have descriptive alt text (decorative images have `alt=""`)
- **Live regions:** status updates use `aria-live="polite"` or `aria-live="assertive"`
- **Error association:** error messages use `aria-describedby="field-error"` (linked to field)

### Touch Targets
- **Minimum size:** 48x48px for all interactive elements (buttons, links, checkboxes, radio buttons)
- **Spacing:** 8px minimum between touch targets (prevents accidental taps)

### Mobile & Responsive
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Font size:** 16px minimum on text inputs (prevents auto-zoom on iOS)
- **Orientation:** app works in both portrait and landscape (gracefully reflows)

### RTL Support
- **Logical properties:** use `start`/`end` instead of `left`/`right` in CSS
- **Margin/padding:** `margin-inline-start` instead of `margin-left`
- **Text direction:** `dir="rtl"` on `<html>` when Arabic is active
- **Layout:** flexbox and grid reflow automatically with `dir` attribute
- **Icons:** directional icons (arrows, back buttons) are mirrored in RTL

---

## Copy Tone & Voice

**For All Users:**
- Warm, encouraging, human (not corporate)
- Clear and direct (no jargon)
- Respectful of time (concise)

**Example Copy Patterns:**

| Scenario | Tone |
|----------|------|
| Success | "You're all set!" / "Welcome to Movemate!" |
| Waiting | "We're on it. Usually takes 2–4 hours." |
| Error | "That didn't work. Let's try again." |
| Reassurance | "Your identity is safe with us." / "Only verified trainers." |
| Call-to-Action | "Let's go" / "Discover trainers" / "Get verified" |

**Localization Notes:**
- Arabic translation by native speaker (not machine translation)
- Terms like "Emirates ID" and "DSC" not translated (official names)
- Emoji used consistently across languages (universal understanding)

---

## File Structure & Deliverables

| Artifact | Format | Status |
|----------|--------|--------|
| Wireframes (12 screens) | This document + Figma link (TBD) | Complete |
| Design system | Zeplin / Figma (colors, typography, components) | TBD (Sprint 1 Week 2) |
| Prototype (interactive) | Figma prototype or React Native Expo | TBD (Sprint 2) |
| Accessibility audit | WCAG 2.1 AA checklist | TBD (Sprint 2 Week 4) |
| Copy / Microcopy | Spreadsheet with all UI strings (EN + AR) | TBD (Sprint 1 Week 2) |

---

## Design Handoff Checklist

Before handing off to Frontend Dev:

- [ ] All 12 screens designed in Figma
- [ ] Component library created (buttons, inputs, cards, modals)
- [ ] Color palette + typography specs finalized
- [ ] Spacing system (8px grid) documented
- [ ] All copy (EN + AR) finalized and reviewed
- [ ] Accessibility spec reviewed by QA
- [ ] Responsive breakpoints tested (375px, 414px, 768px, 1024px)
- [ ] RTL layout tested in Figma
- [ ] Interaction spec (hover, active, disabled, loading states) documented
- [ ] Dark mode spec (if applicable — Phase 2)
- [ ] High-fidelity mockups ready for developer review

---

## Phase 2 Considerations (Deferred)

- **Dark mode:** design spec ready by end of Sprint 5
- **Animations:** micro-interactions (loading spinners, swipes, transitions) spec'd in Lottie JSON
- **Customization:** white-label studio portal (phase 2 for studios)
- **Onboarding carousel:** animated intro sequence (deferred if launch dependent on speed)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-03  
**Next Review:** Week 2 of Sprint 1 (component library handoff)  
**Approval:** Pending Design Lead & Accessibility Audit
