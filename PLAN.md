# PLAN — Redesign + PWA (Light Theme, Mobile, Letterboxed)

## Goals

- Redesign UI to match `artifacts/` references.
- Mobile-first PWA; keep letterboxed mode.
- Light theme only (no dark mode).
- Keep Lucide React icons.
- Mock-first validation via `src/lib/mock/`.
- Onboarding is a separate required flow (no bottom tabs).

## Non-Goals (for now)

- No backend push notifications (client-side permission + local notifications only).
- No complex filtering state management.

---

## Source of Truth (Mappings)

### Artifacts → Features/Screens

- Onboarding flow
  - `artifacts/onboarding/influencer_crm_dashboard_1/`
  - `artifacts/onboarding/influencer_crm_dashboard_2/`
  - `artifacts/onboarding/upcoming_reminders_list/`
  - `artifacts/onboarding/subscription_plans_&_limits/`
  - `artifacts/onboarding/plan_limits_&_upgrade_status/`
  - `artifacts/onboarding/user_profile_&_settings/`
- Quick reminder bottom sheet
  - `artifacts/quick-reminder/`
- Main app areas (later phases, not first priority)
  - Calendar: `artifacts/calendar/*`
  - Check-in: `artifacts/check-in/*`
  - Contacts: `artifacts/contact/*`
  - Places: `artifacts/places/*`
  - Pipelines: `artifacts/pipelines/*`
  - New Deal: `artifacts/new-deal/*`

### Mock Data → UI Validation

Mock system root: `src/lib/mock/`

Seed files used to validate redesigned UI:

- Auth/user: `src/lib/mock/seeds/auth.ts`
- Reminders/tasks: `src/lib/mock/seeds/reminders.ts`
- Deals/pipeline counts: `src/lib/mock/seeds/deals.ts`
- Contacts: `src/lib/mock/seeds/contacts.ts`
- Places: `src/lib/mock/seeds/places.ts`
- Links: `src/lib/mock/seeds/placeContactLinks.ts`
- Visits/check-in: `src/lib/mock/seeds/visits.ts`

Seeding entrypoints:

- `src/lib/mock/seedStores.ts`
- `src/lib/mock/index.ts`
- `src/lib/mock/demo.ts`

Acceptance for mocks:

- Dashboard shows non-empty stats + priorities when seeded.
- Reminders list (onboarding step) shows grouped items (Today/Tomorrow/This Week).
- Plan screens can be demonstrated with simple constants (no billing backend).

---

## Design Constraints

- Letterboxed: content centered, max-width container; full-height mobile viewport.
- Bottom tabs fixed (main app only), safe-area aware.
- Light-only palette (no `.dark` classes, no dark tokens in final touched screens).
- Motion:
  - Bottom sheets: overlay fade + sheet slide up.
  - Press feedback: subtle scale on buttons.

Primary colors (light system):

- Primary cyan: `#13c8ec`
- Background: off-white (`#f6f8f8` feel)
- Cards: white with subtle borders/shadows

---

## Wireframes (Markdown)

### 0) App Shell (Main App Only)

```text
┌──────────────────────────────────────────────┐
│ [Safe Area Top]                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Top Bar (optional)                        │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Scrollable Content Area                   │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Bottom Tabs (fixed) + Center FAB          │
│ │ Pipeline Directory [FAB Home] Calendar Profile │
│ └──────────────────────────────────────────┘ │
│ [Safe Area Bottom]                           │
└──────────────────────────────────────────────┘
```

### 1) Dashboard (Home)

```text
┌──────────────────────────────────────────────┐
│ Greeting + Date                     (Bell •) │
│ Stat Cards (horizontal scroll)               │
│  Confirmed (gradient) | Prospect | Negotiating
│ Quick Actions (2x2)                          │
│  Check-In | New Deal | Add Place | Reminder  │
│ Today's Priorities (list + checkbox + due)   │
└──────────────────────────────────────────────┘
```

### 2) Quick Reminder (Bottom Sheet: bottom→mid + fade)

Animation spec:

- Overlay: opacity 0→1 (fade)
- Sheet: translateY(100%)→0 (slide)
- Height: ~50–60vh

```text
Underlying screen dimmed

┌──────────────────────────────────────────────┐
│ Overlay (fade)                               │
│   ┌──────────────────────────────────────┐   │
│   │  (handle)  New Reminder          [X] │   │
│   │  Textarea: "What to remind about...?"│   │
│   │  [Due Date]  [Time]                   │   │
│   │  Notify via: Push / WhatsApp / Email  │   │
│   │  Urgent toggle                         │   │
│   │  [ Save Reminder ]                     │   │
│   └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### Onboarding (Separate Flow, No Bottom Tabs)

Flow:

1. Welcome / Setup Overview
2. Dashboard Preview + Quick Actions
3. Reminders Overview (Upcoming Reminders List)
4. Plans (Choose Plan)
5. Usage & Billing (Plan Limits)
6. Profile & Settings (Finish + notifications enable)

Global onboarding rules:

- Top bar: Back + “Step X/6” + Skip (optional).
- Skip behavior (final): Skip jumps to Step 6 (Profile). Completion only on “Finish Setup”.

#### Step 1: Welcome / Setup Overview

```text
Top: [Back] Step 1/6 [Skip]
Card: "Complete your setup" 0/3 + progress bar
Checklist:
- Add a place
- Create your first deal
- Upload a contract
Bottom CTA: [Continue]
```

#### Step 2: Dashboard Preview + Quick Actions

```text
Top: [Back] Step 2/6 [Skip]
Preview header (avatar/name/date) + 4 quick actions
Preview empty-state cards (Upcoming Tasks / Active Deals)
Bottom CTA: [Next: Reminders]
```

#### Step 3: Reminders Overview (Upcoming Reminders List)

```text
Top: [Back] Step 3/6 [Skip]
"Reminders" + optional [+]
Groups: Today (count), Tomorrow, This Week
Cards: checkbox + title + campaign tag + menu
Bottom CTA: [Next: Choose Plan]
```

#### Step 4: Plans (Choose Plan)

```text
Top: [Back] Step 4/6 [Skip]
Optional limit warning card
Billing toggle: Monthly / Yearly
Plan stack: Starter, Pro (highlight), Creator+, Agency
Bottom CTA: [Next: Usage & Billing]
```

#### Step 5: Usage & Billing (Plan Limits + Upgrade)

```text
Top: [Back] Step 5/6 [Skip]
Hero usage card: plan + progress bars (places/storage)
Locked feature list
Bottom CTA: [Continue] + optional [Upgrade]
```

#### Step 6: Profile & Settings (Finish)

```text
Top: [Back] Step 6/6
Profile summary + compact plan card
Notifications section: "Enable Push" (prompts permission)
Bottom CTA: [Finish Setup]
```

---

## Lucide Icon Policy (Keep Lucide)

Artifacts use Material Symbols; implementation uses Lucide equivalents.

Common mappings:

- notifications → `Bell`
- calendar_month → `Calendar`
- note_add / add → `FilePlus` or `Plus`
- add_location_alt / map → `MapPin` / `MapPinPlus`
- handshake → `Handshake`
- dashboard/home → `Home` / `LayoutDashboard`
- person → `User`
- chevron/arrow → `ChevronLeft`, `ChevronRight`, `ArrowLeft`
- close → `X`
- more_horiz → `MoreHorizontal`
- check_circle → `CheckCircle2`

---

## Feature Specs

### A) Onboarding Gate + Skip Rule

- Storage key: `onboardingComplete` (boolean) in localStorage (or a tiny wrapper).
- Routing:
  - If `onboardingComplete !== true`, redirect any main-app route to `/onboarding/welcome`.
  - If `onboardingComplete === true`, redirect `/onboarding/*` to `/`.
- Skip:
  - Pressing Skip routes to `/onboarding/profile`.
  - Only “Finish Setup” sets `onboardingComplete=true`.

### B) Dashboard Data Requirements (from mocks)

Uses seeded stores:

- Deals stats:
  - Confirmed: statuses `confirmed` + `paid`
  - Prospect: statuses `lead` + `contacted`
  - Negotiating: status `negotiation`
  Source: `src/lib/mock/seeds/deals.ts`
- Today’s Priorities:
  - Take upcoming reminders, sort by dueDate, show up to 5
  - Use “urgent” style if due within 2 hours
  Source: `src/lib/mock/seeds/reminders.ts`

### C) Reminders List (Onboarding Step 3) Grouping

- Groups:
  - Today
  - Tomorrow
  - This Week
- Backed by: `src/lib/mock/seeds/reminders.ts`
- Ensure seed includes at least:
  - 2 reminders due today
  - 1 due tomorrow
  - 2 later in the week
  - 1 completed reminder (to show completed styling)

### D) Quick Reminder Bottom Sheet

- Visual:
  - Half-height sheet, rounded top, overlay fade.
- Behavior:
  - Save → writes reminder to reminders store.
  - Close → X or overlay tap.
- Push permission:
  - “Push” toggle attempts `Notification.requestPermission()` if not granted.
  - Client-side only; no backend subscription management.

---

## PWA Specs (Client-side)

- Manifest: `public/manifest.json`
- Placeholder icons: `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`
- `index.html`:
  - `<link rel="manifest" href="/manifest.json">`
  - theme-color meta
  - apple touch icon meta/link
- Service worker:
  - Basic offline caching for app shell assets.
- Notifications:
  - Client-side permission prompt + optional local notifications helper.

---

## Implementation Order (Recommended)

1. Onboarding routes + gating + Skip-to-last behavior (skeleton UI)
2. Light-only theme cleanup in touched files (remove dark dependencies)
3. Mobile shell + bottom tabs + centered FAB
4. Dashboard redesign (stats + actions + priorities)
5. Quick reminder bottom sheet (fade + slide) + save to store
6. Mock seed adjustments for the above screens
7. PWA manifest + placeholder icons + SW + notifications utility
8. Verify: `npm run lint` and `npm run build`

---

## Verification Checklist

- Fresh run:
  - Redirects to onboarding step 1.
  - Skip → step 6 only.
  - Finish Setup → enters main app; onboarding no longer accessible.
- Dashboard:
  - Stat cards match expected counts from seeded deals.
  - Priorities list shows seeded reminders with due badges.
- Quick reminder:
  - Overlay fade + sheet slide; half-height; save works.
  - Notification permission request works client-side.
- PWA:
  - Manifest valid; icons load; installable on mobile.

---

## Per-Artifact Implementation Checklist

### Onboarding (`artifacts/onboarding/`)

- [ ] `artifacts/onboarding/influencer_crm_dashboard_1/` — Onboarding Step 2 (dashboard preview state)
- [ ] `artifacts/onboarding/influencer_crm_dashboard_2/` — Onboarding Step 1/2 (setup card + quick actions direction)
- [ ] `artifacts/onboarding/upcoming_reminders_list/` — Onboarding Step 3 (reminders list grouping + cards)
- [ ] `artifacts/onboarding/subscription_plans_&_limits/` — Onboarding Step 4 (choose plan)
- [ ] `artifacts/onboarding/plan_limits_&_upgrade_status/` — Onboarding Step 5 (usage & billing)
- [ ] `artifacts/onboarding/user_profile_&_settings/` — Onboarding Step 6 (profile + notifications enable)

### Quick Reminder (`artifacts/quick-reminder/`)

- [ ] `artifacts/quick-reminder/` — Quick reminder bottom sheet (fade overlay + slide to mid)

### Calendar (`artifacts/calendar/`)

- [ ] `artifacts/calendar/calendar_&_agenda_view_1/` — Calendar agenda layout v1
- [ ] `artifacts/calendar/calendar_&_agenda_view_2/` — Calendar agenda layout v2
- [ ] `artifacts/calendar/calendar_empty_state/` — Calendar empty state

### Check-In (`artifacts/check-in/`)

- [ ] `artifacts/check-in/start_a_visit_check-in/` — Start visit (check-in entry)
- [ ] `artifacts/check-in/visit_notes_&_voice_memo_1/` — Visit notes + voice memo v1
- [ ] `artifacts/check-in/visit_notes_&_voice_memo_2/` — Visit notes + voice memo v2
- [ ] `artifacts/check-in/visit_reference_history/` — Visit reference history
- [ ] `artifacts/check-in/visit_session_summary/` — Visit session summary

### Contact (`artifacts/contact/`)

- [ ] `artifacts/contact/add_new_contact/` — Add contact
- [ ] `artifacts/contact/filtered_places_list_view/` — Filtered list view (contact)
- [ ] `artifacts/contact/place_details_&_history/` — Place details & history (contact context)
- [ ] `artifacts/contact/places_&_contacts_unified_list/` — Unified places/contacts list (contact context)
- [ ] `artifacts/contact/places_empty_state/` — Empty state (contact)

### Places (`artifacts/places/`)

- [ ] `artifacts/places/add_new_place_1/` — Add place v1
- [ ] `artifacts/places/add_new_place_2/` — Add place v2
- [ ] `artifacts/places/filtered_places_list_view/` — Filtered list view (places)
- [ ] `artifacts/places/place_details_&_history/` — Place details & history (places context)
- [ ] `artifacts/places/places_&_contacts_unified_list/` — Unified places/contacts list (places context)
- [ ] `artifacts/places/places_empty_state/` — Empty state (places)

### Pipelines (`artifacts/pipelines/`)

- [ ] `artifacts/pipelines/collaboration_pipeline/` — Pipeline main view (columns + cards)
- [ ] `artifacts/pipelines/deal_status_management/` — Deal status management UI
- [ ] `artifacts/pipelines/pipeline_empty_state/` — Pipeline empty state

### New Deal (`artifacts/new-deal/`)

- [ ] `artifacts/new-deal/new_deal:_general_info/` — New deal step 1 (general info)
- [ ] `artifacts/new-deal/new_deal:_deliverables/` — New deal step 2 (deliverables)
- [ ] `artifacts/new-deal/new_deal:_payments_&_legal/` — New deal step 3 (payments & legal)
- [ ] `artifacts/new-deal/new_deal:_review/` — New deal step 4 (review)

---

## Mock Seed Coverage Checklist (Per Artifact)

Goal: every implemented artifact screen can be demonstrated using seeded data from `src/lib/mock/`.

Legend:

- `auth.ts` user + plan fields
- `reminders.ts` tasks/reminders + due dates + completed
- `deals.ts` deals + statuses + values + dates
- `places.ts` places + categories + addresses
- `contacts.ts` contacts + roles + channels
- `placeContactLinks.ts` relationships between places and contacts
- `visits.ts` visit sessions + notes + media refs

### Onboarding (`artifacts/onboarding/`)

- [ ] `artifacts/onboarding/influencer_crm_dashboard_1/`
  - [ ] `src/lib/mock/seeds/auth.ts` (user greeting/avatar)
  - [ ] `src/lib/mock/seeds/reminders.ts` (upcoming tasks preview)
  - [ ] `src/lib/mock/seeds/deals.ts` (active deals preview)
- [ ] `artifacts/onboarding/influencer_crm_dashboard_2/`
  - [ ] `src/lib/mock/seeds/auth.ts` (user greeting/avatar)
  - [ ] `src/lib/mock/seeds/places.ts` (drives “Add a place” setup completion)
  - [ ] `src/lib/mock/seeds/deals.ts` (drives “Create first deal” setup completion)
  - [ ] `src/lib/mock/seeds/deals.ts` (or a simple local mock) for “Upload contract” completion flag
- [ ] `artifacts/onboarding/upcoming_reminders_list/`
  - [ ] `src/lib/mock/seeds/reminders.ts` (Today/Tomorrow/This Week groups + one completed)
  - [ ] `src/lib/mock/seeds/deals.ts` (campaign tags, optional)
  - [ ] `src/lib/mock/seeds/places.ts` / `src/lib/mock/seeds/contacts.ts` (optional linking for labels)
- [ ] `artifacts/onboarding/subscription_plans_&_limits/`
  - [ ] `src/lib/mock/seeds/auth.ts` (current plan label)
  - [ ] `src/lib/mock/seeds/contacts.ts` (for “contacts used” number if you choose to compute it)
  - [ ] Or: define local constants for usage/limits (acceptable in onboarding)
- [ ] `artifacts/onboarding/plan_limits_&_upgrade_status/`
  - [ ] `src/lib/mock/seeds/auth.ts` (current plan label)
  - [ ] `src/lib/mock/seeds/places.ts` (places used count)
  - [ ] Or: define local constants for storage usage/limits (acceptable)
- [ ] `artifacts/onboarding/user_profile_&_settings/`
  - [ ] `src/lib/mock/seeds/auth.ts` (profile identity + plan)
  - [ ] Client-side only: Notification permission state (no seed required)

### Quick Reminder (`artifacts/quick-reminder/`)

- [ ] `artifacts/quick-reminder/`
  - [ ] `src/lib/mock/seeds/reminders.ts` (must support create/add flows)
  - [ ] `src/lib/mock/seeds/deals.ts` (optional link reminder to a deal)
  - [ ] `src/lib/mock/seeds/contacts.ts` / `src/lib/mock/seeds/places.ts` (optional link reminder to entity)

### Calendar (`artifacts/calendar/`)

- [ ] `artifacts/calendar/calendar_&_agenda_view_1/`
  - [ ] `src/lib/mock/seeds/reminders.ts` (events/tasks mapped into agenda)
  - [ ] `src/lib/mock/seeds/deals.ts` (deliverable dates mapped into agenda)
  - [ ] `src/lib/mock/seeds/visits.ts` (check-ins appear on calendar, optional)
- [ ] `artifacts/calendar/calendar_&_agenda_view_2/`
  - [ ] Same as above
- [ ] `artifacts/calendar/calendar_empty_state/`
  - [ ] Ensure a scenario where reminders/deals/visits produce no items

### Check-In (`artifacts/check-in/`)

- [ ] `artifacts/check-in/start_a_visit_check-in/`
  - [ ] `src/lib/mock/seeds/places.ts` (places to visit)
  - [ ] `src/lib/mock/seeds/visits.ts` (create active visit)
- [ ] `artifacts/check-in/visit_notes_&_voice_memo_1/`
  - [ ] `src/lib/mock/seeds/visits.ts` (notes + voice memo metadata)
- [ ] `artifacts/check-in/visit_notes_&_voice_memo_2/`
  - [ ] `src/lib/mock/seeds/visits.ts`
- [ ] `artifacts/check-in/visit_reference_history/`
  - [ ] `src/lib/mock/seeds/visits.ts` (multiple completed visits)
  - [ ] `src/lib/mock/seeds/places.ts` (visit-to-place mapping)
- [ ] `artifacts/check-in/visit_session_summary/`
  - [ ] `src/lib/mock/seeds/visits.ts` (summary fields)

### Contact (`artifacts/contact/`)

- [ ] `artifacts/contact/add_new_contact/`
  - [ ] `src/lib/mock/seeds/contacts.ts` (create/add flow)
- [ ] `artifacts/contact/filtered_places_list_view/`
  - [ ] `src/lib/mock/seeds/places.ts`
  - [ ] `src/lib/mock/seeds/placeContactLinks.ts` (optional filtering by linked contacts)
- [ ] `artifacts/contact/place_details_&_history/`
  - [ ] `src/lib/mock/seeds/places.ts`
  - [ ] `src/lib/mock/seeds/visits.ts` (history)
  - [ ] `src/lib/mock/seeds/deals.ts` (deal history, optional)
- [ ] `artifacts/contact/places_&_contacts_unified_list/`
  - [ ] `src/lib/mock/seeds/places.ts`
  - [ ] `src/lib/mock/seeds/contacts.ts`
  - [ ] `src/lib/mock/seeds/placeContactLinks.ts`
- [ ] `artifacts/contact/places_empty_state/`
  - [ ] Ensure a scenario with zero places/links

### Places (`artifacts/places/`)

- [ ] `artifacts/places/add_new_place_1/`
  - [ ] `src/lib/mock/seeds/places.ts` (create/add flow)
- [ ] `artifacts/places/add_new_place_2/`
  - [ ] `src/lib/mock/seeds/places.ts`
- [ ] `artifacts/places/filtered_places_list_view/`
  - [ ] `src/lib/mock/seeds/places.ts`
- [ ] `artifacts/places/place_details_&_history/`
  - [ ] `src/lib/mock/seeds/places.ts`
  - [ ] `src/lib/mock/seeds/visits.ts`
  - [ ] `src/lib/mock/seeds/deals.ts` (optional)
- [ ] `artifacts/places/places_&_contacts_unified_list/`
  - [ ] `src/lib/mock/seeds/places.ts`
  - [ ] `src/lib/mock/seeds/contacts.ts`
  - [ ] `src/lib/mock/seeds/placeContactLinks.ts`
- [ ] `artifacts/places/places_empty_state/`
  - [ ] Ensure a scenario with zero places

### Pipelines (`artifacts/pipelines/`)

- [ ] `artifacts/pipelines/collaboration_pipeline/`
  - [ ] `src/lib/mock/seeds/deals.ts` (cards per status)
  - [ ] `src/lib/mock/seeds/places.ts` / `src/lib/mock/seeds/contacts.ts` (deal associations, optional)
- [ ] `artifacts/pipelines/deal_status_management/`
  - [ ] `src/lib/mock/seeds/deals.ts` (status transitions)
- [ ] `artifacts/pipelines/pipeline_empty_state/`
  - [ ] Ensure a scenario with zero deals

### New Deal (`artifacts/new-deal/`)

- [ ] `artifacts/new-deal/new_deal:_general_info/`
  - [ ] `src/lib/mock/seeds/deals.ts` (create flow; can start empty)
  - [ ] `src/lib/mock/seeds/places.ts` + `src/lib/mock/seeds/contacts.ts` (selection)
- [ ] `artifacts/new-deal/new_deal:_deliverables/`
  - [ ] `src/lib/mock/seeds/deals.ts` (deal created)
  - [ ] (If deliverables are stored separately in app) ensure mock support exists
- [ ] `artifacts/new-deal/new_deal:_payments_&_legal/`
  - [ ] `src/lib/mock/seeds/deals.ts`
  - [ ] (If payments stored separately) ensure mock support exists
- [ ] `artifacts/new-deal/new_deal:_review/`
  - [ ] `src/lib/mock/seeds/deals.ts` (summary + final submit)

---

## Demo Scenarios (Mock-Driven)

Goal: quickly validate each screen state by seeding predictable mock datasets. These scenarios should be implemented as helpers in `src/lib/mock/demo.ts` (or exported from there), using existing seed factories and store seed/reset utilities from `src/lib/mock/seedStores.ts`.

### Scenario 1: First Run (Onboarding Required)

Purpose:

- Validate onboarding gate + full onboarding flow.

Setup:

- Ensure `localStorage.onboardingComplete` is unset/false.
- Seed stores normally (`seedAllStores()`) OR seed minimal data for onboarding preview screens.

Expected:

- Redirect to `/onboarding/welcome`.
- Skip → `/onboarding/profile`.
- Finish Setup sets `onboardingComplete=true` and routes to `/`.

Maps to:

- `artifacts/onboarding/*`

### Scenario 2: Empty Dashboard (New User, No Work Yet)

Purpose:

- Validate empty states on onboarding/dashboard preview and home.

Setup (preferred):

- Seed auth only.
- Clear deals + reminders + visits + places/contacts if needed.

Mock touchpoints:

- `src/lib/mock/seeds/auth.ts`
- Use store clear utilities from `src/lib/mock/seedStores.ts`

Expected:

- Setup checklist reads 0/3.
- “Upcoming Tasks” and “Active Deals” show empty-state cards.

Maps to:

- `artifacts/onboarding/influencer_crm_dashboard_2/`

### Scenario 3: Dashboard With Activity (Primary Demo)

Purpose:

- Validate main home dashboard layout: stat cards + priorities list.

Setup:

- Seed all stores (`seedAllStores()`).
- Ensure reminders include at least:
  - 2 due today (one urgent within 2 hours)
  - 1 completed

Mock touchpoints:

- `src/lib/mock/seeds/deals.ts` (confirmed/prospect/negotiation counts)
- `src/lib/mock/seeds/reminders.ts` (today’s priorities)

Expected:

- Stat cards show correct values/counts.
- “Today’s Priorities” shows up to 5 upcoming reminders.

Maps to:

- `artifacts/onboarding/influencer_crm_dashboard_1/` (direction)
- Dashboard wireframe

### Scenario 4: Reminders Grouping (Today / Tomorrow / This Week)

Purpose:

- Validate onboarding reminders list grouping and card visuals.

Setup:

- Seed reminders with due dates distributed:
  - Today: 2
  - Tomorrow: 1
  - This week: 2
  - Completed: 1 (any day)

Mock touchpoints:

- `src/lib/mock/seeds/reminders.ts`

Expected:

- Correct group headers + counts.
- Completed item renders in completed style.

Maps to:

- `artifacts/onboarding/upcoming_reminders_list/`

### Scenario 5: Pipeline Empty State

Purpose:

- Validate pipeline empty UI.

Setup:

- Seed auth + places/contacts (optional).
- Clear deals store.

Mock touchpoints:

- `src/lib/mock/seeds/deals.ts` (intentionally not seeded)

Expected:

- Pipeline shows empty state screen.

Maps to:

- `artifacts/pipelines/pipeline_empty_state/`

### Scenario 6: Usage Near Limits (Plan/Upgrade Screens)

Purpose:

- Validate plan/limits UI messaging.

Setup options:

- Option A (simple): define local constants in onboarding for limits/usage.
- Option B (computed): derive “places used” from `places.ts` and “contacts used” from `contacts.ts`.

Mock touchpoints:

- `src/lib/mock/seeds/places.ts` (raise count near limit)
- `src/lib/mock/seeds/contacts.ts` (raise count near limit)
- `src/lib/mock/seeds/auth.ts` (plan label)

Expected:

- Usage bars show ~90% and warning hint.
- Plan cards render with “Pro” highlighted.

Maps to:

- `artifacts/onboarding/plan_limits_&_upgrade_status/`
- `artifacts/onboarding/subscription_plans_&_limits/`

### Scenario 7: Quick Reminder Creation

Purpose:

- Validate bottom sheet animation + creation flow.

Setup:

- Seed reminders store.
- Open quick reminder from Dashboard action.
- Save reminder; verify it appears in reminders list and on dashboard priorities.

Mock touchpoints:

- `src/lib/mock/seeds/reminders.ts` + store add action

Expected:

- Overlay fades + sheet slides to mid-screen.
- New reminder saved and visible immediately.

Maps to:

- `artifacts/quick-reminder/`

---

## How to Switch Scenarios (Operational Notes)

Recommended approach:

- Implement scenario runners in `src/lib/mock/demo.ts` that:
  - clear/reset stores via `src/lib/mock/seedStores.ts`
  - seed the exact data needed for the scenario
  - optionally set/unset `localStorage.onboardingComplete`

### Suggested API (in `src/lib/mock/demo.ts`)

```ts
export const DEMO_SCENARIOS = [
  "firstRun",
  "emptyDashboard",
  "dashboardWithActivity",
  "remindersGrouping",
  "pipelineEmpty",
  "usageNearLimits",
  "quickReminderCreation",
] as const;

export type DemoScenario = (typeof DEMO_SCENARIOS)[number];

export function runDemoScenario(scenario: DemoScenario): void;
```

### Suggested behavior per scenario

- `firstRun`
  - `localStorage.removeItem("onboardingComplete")`
  - seed minimal or full data (either is fine)
- `emptyDashboard`
  - `seedAuthStore()` then clear deals/reminders/visits/places/contacts as needed
- `dashboardWithActivity`
  - `seedAllStores()` but ensure reminders include “today” + “urgent”
- `remindersGrouping`
  - seed reminders with controlled due dates across groups
- `pipelineEmpty`
  - seed auth, clear deals
- `usageNearLimits`
  - seed many contacts/places or use constants
- `quickReminderCreation`
  - seed reminders + open sheet manually; saving validates

### Where to invoke it (Option B: Developer-only UI)

Create a dev-only scenario switcher UI that is:

- compiled only in dev (`import.meta.env.DEV`)
- hidden by default
- persists selection in localStorage so refresh keeps the scenario

Suggested components/paths:

- `src/lib/mock/demo.ts`
  - `runDemoScenario(scenario)`
  - `DEMO_SCENARIOS` + `DemoScenario` type
- `src/components/dev/DemoScenarioSwitcher.tsx`
  - small floating panel with:
    - current scenario label
    - dropdown/select of scenarios
    - buttons: `Apply`, `Reset to normal`
- Mount point (dev only):
  - `src/App.tsx` or shell component
  - Render `<DemoScenarioSwitcher />` only when `import.meta.env.DEV`

Open/close behavior (final):

- Mobile (dev only): tap the Home FAB 7 times to toggle the panel.
- Desktop (dev only): press `Ctrl+K` to toggle the panel.

Notes:

- The tap counter resets after ~2 seconds of inactivity (prevents accidental opens).

Apply behavior:

- On “Apply”:
  - `localStorage.setItem("demoScenario", scenario)`
  - call `runDemoScenario(scenario)`
- On “Reset to normal”:
  - `localStorage.removeItem("demoScenario")`
  - clear/reset stores and seed defaults (or `resetAllStores()`)

Boot behavior:

- On initial load (dev only):
  - if `localStorage.demoScenario` exists, auto-apply it once.
