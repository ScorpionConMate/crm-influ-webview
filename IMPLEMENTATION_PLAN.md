# Implementation Plan — CRM for Influencers (v2)

## Overview
This plan breaks down all remaining tasks into parallelizable work streams with clear dependencies.

---

## Phase 1: Authentication & User Management (Standalone)

### Tasks
- [ ] **Auth screens**: Login, magic link/OAuth (reference: none - follow auth pattern)
- [ ] **Session persistence**: Auth store setup, guarded routes
- [ ] **Logout flow**: Settings integration

### Dependencies
- None (can start immediately)

### Deliverables
- `src/components/auth/Login.tsx`
- `src/stores/authStore.ts` (partially exists)
- Route guards in `src/main.tsx` or router

### Artifacts
- No specific artifacts (use standard auth patterns)

---

## Phase 2: Core Features (Can Run in Parallel)

### Group A — Places & Contacts Module

Reference file: [GROUP_A_PLACES_CONTACTS.md](./GROUP_A_PLACES_CONTACTS.md)

#### Tasks
- [ ] **Add Place (2-step form)**
  - Step 1: Basic info (name, type, location)
  - Step 2: Details (contact links, category, notes)
  - Zod validation for both steps
  - Reference: `@artifacts/places/add_new_place_1`, `@artifacts/places/add_new_place_2`

- [ ] **Place detail & history timeline**
  - Show place info, linked contacts, deals, visits
  - Timeline view for history (deals, visits, notes, reminders)
  - Reference: `@artifacts/places/place_details_&_history`

- [ ] **Add Contact form**
  - Contact info + place(s) linking
  - Reference: `@artifacts/contact/add_new_contact`

- [ ] **Contact detail & history**
  - Contact info + linked places + deals + timeline
  - Reference: `@artifacts/contact/place_details_&_history`

#### Dependencies
- Mobile shell (✓ already exists)
- Zod schemas (✓ `src/lib/zod/schemas.ts` exists)

#### Deliverables
- `src/components/places/AddPlaceStep1.tsx`
- `src/components/places/AddPlaceStep2.tsx`
- `src/components/places/PlaceDetail.tsx`
- `src/components/contacts/AddContact.tsx`
- `src/components/contacts/ContactDetail.tsx`
- Update `src/stores/placesStore.ts` and `src/stores/contactsStore.ts`

---

### Group B — Pipeline & Deals Module

Reference file: [GROUP_B_PIPELINE_DEALS.md](./GROUP_B_PIPELINE_DEALS.md)


#### Tasks
- [ ] **Deal status management**
  - Change deal status (Lead → Contacted → ... → Paid/Lost)
  - Lost reason optional field
  - Reference: `@artifacts/pipelines/deal_status_management`

- [ ] **Deal detail view**
  - Deal summary + deliverables + payments + history
  - Timeline integration
  - Reference: Need to create from `@artifacts/pipelines/collaboration_pipeline`

#### Dependencies
- Zod schemas (✓ exists)
- `src/components/pipeline/Pipeline.tsx` (✓ exists - need to extend)

#### Deliverables
- `src/components/pipeline/DealDetail.tsx`
- `src/components/pipeline/DealStatusPicker.tsx`
- Update `src/stores/dealsStore.ts` (need to create)

---

### Group C — New Deal Wizard

Reference file: [GROUP_C_DEAL_WIZARD.md](./GROUP_C_DEAL_WIZARD.md)

#### Tasks
- [ ] **Step 1: General info**
  - Place/contact selection
  - Tentative dates, estimated value, notes
  - Reference: `@artifacts/new-deal/new_deal:_general_info`

- [ ] **Step 2: Deliverables CRUD**
  - List: type, quantity, due date, status
  - Add/edit/remove deliverables
  - Reference: `@artifacts/new-deal/new_deal:_deliverables`

- [ ] **Step 3: Payments & Legal**
  - Amount, currency, method, invoice?, terms
  - Reference: `@artifacts/new-deal/new_deal:_payments_&_legal`

- [ ] **Step 4: Review + create**
  - Summary display + create button
  - Reference: `@artifacts/new-deal/new_deal:_review`

- [ ] **Wizard draft persistence**
  - Store in zustand, recover if closed

#### Dependencies
- Places & contacts (from Group A)
- Zod schemas (✓ exists)

#### Deliverables
- `src/components/new-deal/DealWizard.tsx`
- `src/components/new-deal/step1-GeneralInfo.tsx`
- `src/components/new-deal/step2-Deliverables.tsx`
- `src/components/new-deal/step3-PaymentsLegal.tsx`
- `src/components/new-deal/step4-Review.tsx`
- `src/stores/dealWizardStore.ts`

---

### Group D — Calendar & Agenda

Reference file: [GROUP_D_CALENDAR_AGENDA.md](./GROUP_D_CALENDAR_AGENDA.md)

#### Tasks
- [ ] **Calendar + agenda view (toggle)**
  - Calendar month view → day detail
  - Agenda list view
  - Reference: `@artifacts/calendar/calendar_&_agenda_view_1`, `@artifacts/calendar/calendar_&_agenda_view_2`

- [ ] **Calendar empty state**
  - Reference: `@artifacts/calendar/calendar_empty_state`

- [ ] **Map internal events to calendar**
  - Reminders, deal dates, visits → calendar events
  - Reference: No specific artifact

- [ ] **Day detail / agenda interactions**
  - Open entity, create reminder from calendar
  - Reference: No specific artifact

#### Dependencies
- Reminders store (✓ exists - `src/stores/remindersStore.ts`)
- Visits store (✓ exists - `src/stores/visitsStore.ts`)
- Deals store (need to create)

#### Deliverables
- `src/components/calendar/CalendarView.tsx`
- `src/components/calendar/AgendaView.tsx`
- `src/components/calendar/DayDetail.tsx`
- Update `src/components/calendar/Calendar.tsx` (exists - extend)
- `src/stores/calendarStore.ts`

---

### Group E — Check-in / Visit Flow

Reference file: [GROUP_E_CHECKIN_VISIT.md](./GROUP_E_CHECKIN_VISIT.md)

#### Tasks
- [ ] **Start a visit**
  - Select place, optional deal
  - Reference: `@artifacts/check-in/start_a_visit_check-in`

- [ ] **Visit notes + voice memo**
  - Notes input + voice memo recording
  - Storage adapter for audio files
  - Reference: `@artifacts/check-in/visit_notes_&_voice_memo_1`, `@artifacts/check-in/visit_notes_&_voice_memo_2`

- [ ] **Visit reference history**
  - Timeline view during visit
  - Reference: `@artifacts/check-in/visit_reference_history`

- [ ] **Visit session summary**
  - Summary display + next steps + create reminder CTA
  - Reference: `@artifacts/check-in/visit_session_summary`

#### Dependencies
- Places module (from Group A)
- Visits store (✓ exists)

#### Deliverables
- `src/components/checkin/StartVisit.tsx`
- `src/components/checkin/VisitNotes.tsx`
- `src/components/checkin/VisitHistory.tsx`
- `src/components/checkin/VisitSummary.tsx`
- Update `src/stores/visitsStore.ts`
- Storage adapter for voice memos

---

### Group F — Quick Reminder

Reference file: [GROUP_F_QUICK_REMINDER.md](./GROUP_F_QUICK_REMINDER.md)

#### Tasks
- [ ] **Quick reminder screen/sheet**
  - Simple form for quick reminder creation
  - Reference: `@artifacts/quick-reminder/code.html` + `screen.png`

- [ ] **Link reminder to place/contact/deal**
  - Entity selector

#### Dependencies
- Reminders store (✓ exists)
- Places, contacts modules (from Group A)

#### Deliverables
- `src/components/reminders/QuickReminder.tsx`
- Update `src/stores/remindersStore.ts`

---

### Group G — Onboarding / Home Features

Reference file: [GROUP_G_ONBOARDING_HOME.md](./GROUP_G_ONBOARDING_HOME.md)

#### Tasks
- [ ] **Dashboard KPIs**
  - Deals by status + upcoming reminders
  - Reference: `@artifacts/onboarding/influencer_crm_pipeline_dashboard_1`, `@artifacts/onboarding/influencer_crm_pipeline_dashboard_2`

- [ ] **Upcoming reminders list**
  - Mark done + open entity
  - Reference: `@artifacts/onboarding/upcoming_reminders_list`

- [ ] **Plan limits & upgrade status**
  - UI + gating
  - Reference: `@artifacts/onboarding/plan_limits_&_upgrade_status`

- [ ] **Subscription plans & limits screen**
  - UI-only for now
  - Reference: `@artifacts/onboarding/subscription_plans_&_limits`

- [ ] **User profile & settings**
  - Reference: `@artifacts/onboarding/user_profile_&_settings`

#### Dependencies
- Reminders store (✓ exists)
- Deals store (need to create)
- Auth store (need to complete)

#### Deliverables
- Update `src/components/home/Home.tsx` (exists)
- `src/components/home/UpcomingReminders.tsx`
- `src/components/settings/ProfileSettings.tsx`
- `src/components/settings/PlanLimits.tsx`
- `src/components/settings/SubscriptionPlans.tsx`

---

## Parallel Execution Strategy

### Can run in parallel (no dependencies between them):
- **Group A**: Places & Contacts
- **Group B**: Deal Status & Details
- **Group D**: Calendar & Agenda
- **Group E**: Check-in / Visit Flow
- **Group F**: Quick Reminder

### Sequential dependencies:
- **Group C** (New Deal Wizard) → depends on **Group A** (Places/Contacts complete)
- **Group G** (Onboarding/Home) → depends on Group A, B, D (partial integration)

---

## Suggested Execution Order

### Wave 1 (Parallel - 5 streams)
1. Group A: Places & Contacts (~2-3 days)
2. Group B: Deal Status & Details (~1-2 days)
3. Group D: Calendar & Agenda (~2 days)
4. Group E: Check-in Flow (~2 days)
5. Group F: Quick Reminder (~1 day)

### Wave 2 (Sequential)
1. Group C: New Deal Wizard (~2 days) - after Group A
2. Group G: Onboarding/Home (~1-2 days) - after Groups A, B, D

### Wave 3
- Auth & User Management (~1-2 days) - can be done anytime after Wave 1

---

## Missing Stores to Create

- `src/stores/dealsStore.ts`
- `src/stores/dealWizardStore.ts`
- `src/stores/calendarStore.ts`

## Existing Stores (to extend)
- `src/stores/authStore.ts` (exists, needs session persistence)
- `src/stores/placesStore.ts` (exists, needs CRUD operations)
- `src/stores/contactsStore.ts` (exists, needs CRUD operations)
- `src/stores/remindersStore.ts` (exists, may need extension)
- `src/stores/visitsStore.ts` (exists, may need extension)

---

## Testing Strategy
- Use Playwright E2E tests for critical flows:
  - Add Place → Create Deal → Change Status
  - Start Visit → Add Notes → Complete
  - Quick Reminder → Appears in Home/Calendar

---

## Next Immediate Action
Start with **Group A (Places & Contacts)** as it's foundational for multiple other features (Groups C, E, F).
