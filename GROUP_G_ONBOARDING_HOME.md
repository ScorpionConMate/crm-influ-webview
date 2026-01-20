# Group G: Onboarding / Home Features

## Overview
Dashboard with KPIs, upcoming reminders, plan limits, and user settings.

---

## Tasks

### 1. Dashboard KPIs

#### Pipeline Snapshot
- Deals by status (count)
- Visual representation (mini cards or chart)
- Total value of active deals
- Deals close to completion

#### Upcoming Reminders Preview
- Top 3-5 upcoming reminders
- Quick access to view all or complete
- Link to Calendar for full view

#### Quick Actions
- "Add Place"
- "Start Visit"
- "New Deal"
- "Add Reminder"

Reference:
- `@artifacts/onboarding/influencer_crm_dashboard_1`
- `@artifacts/onboarding/influencer_crm_dashboard_2`

File: Update `src/components/home/Home.tsx`

---

### 2. Upcoming Reminders List

#### Display
- List of upcoming reminders (sorted by due date)
- Each item shows:
  - Title
  - Due date/time
  - Priority badge
  - Linked entity (place/contact/deal)
  - "Complete" button

#### Actions
- Mark as complete (with toast + undo)
- Open linked entity
- Navigate to Calendar

Reference: `@artifacts/onboarding/upcoming_reminders_list`

File: `src/components/home/UpcomingReminders.tsx`

---

### 3. Plan Limits & Upgrade Status

#### Display
- Current plan (Free/Premium)
- Limits reached vs total:
  - Places
  - Contacts
  - Deals
  - Reminders
- Upgrade CTA button

#### Gating (Soft)
- Show warning when approaching limit
- Show paywall when limit exceeded (with cancel option)
- Allow viewing but not creating over limit

Reference: `@artifacts/onboarding/plan_limits_&_upgrade_status`

File: `src/components/settings/PlanLimits.tsx`

---

### 4. Subscription Plans & Limits Screen

#### Display
- Plan comparison table:
  - Free plan features + limits
  - Premium plan features + limits
- "Upgrade to Premium" button (UI-only for now)
- "Manage Subscription" link (placeholder)

Reference: `@artifacts/onboarding/subscription_plans_&_limits`

File: `src/components/settings/SubscriptionPlans.tsx`

---

### 5. User Profile & Settings

#### Profile Section
- User name
- Email
- Avatar (placeholder or initials)
- Edit profile button

#### Settings Section
- Theme toggle (light/dark - if implementing)
- Notifications toggle
- Language selector (placeholder)
- Logout button

#### Account Section
- Plan status link
- Delete account button (with confirmation)

Reference: `@artifacts/onboarding/user_profile_&_settings`

File: `src/components/settings/ProfileSettings.tsx`

---

## Zod Schemas

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatar: z.string().optional(),
  plan: z.enum(["free", "premium"]),
  createdAt: z.date(),
});

export const planLimitsSchema = z.object({
  plan: z.enum(["free", "premium"]),
  placesLimit: z.number(),
  contactsLimit: z.number(),
  dealsLimit: z.number(),
  remindersLimit: z.number(),
});

export const planLimits: Record<string, z.infer<typeof planLimitsSchema>> = {
  free: {
    plan: "free",
    placesLimit: 10,
    contactsLimit: 50,
    dealsLimit: 20,
    remindersLimit: 50,
  },
  premium: {
    plan: "premium",
    placesLimit: Infinity,
    contactsLimit: Infinity,
    dealsLimit: Infinity,
    remindersLimit: Infinity,
  },
};

export type User = z.infer<typeof userSchema>;
export type PlanType = "free" | "premium";
```

---

## Store Update: `src/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PlanType } from '@/lib/zod/schemas';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  checkLimit: (entity: 'places' | 'contacts' | 'deals' | 'reminders', count: number) => boolean;
  getCurrentPlan: () => PlanType;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      checkLimit: (entity, count) => {
        const user = get().user;
        if (!user) return false;

        const limits = {
          free: {
            places: 10,
            contacts: 50,
            deals: 20,
            reminders: 50,
          },
          premium: {
            places: Infinity,
            contacts: Infinity,
            deals: Infinity,
            reminders: Infinity,
          },
        };

        return count < limits[user.plan][entity];
      },

      getCurrentPlan: () => get().user?.plan || 'free',
    }),
    { name: 'auth-storage' }
  )
);
```

---

## Dashboard Component

### `src/components/home/Home.tsx`

```typescript
import { useDealsStore } from '@/stores/dealsStore';
import { useRemindersStore } from '@/stores/remindersStore';
import { useAuthStore } from '@/stores/authStore';
import UpcomingReminders from './UpcomingReminders';

export function Home() {
  const deals = useDealsStore((state) => state.deals);
  const upcomingReminders = useRemindersStore((state) => state.getUpcomingReminders(5));
  const user = useAuthStore((state) => state.user);

  const dealsByStatus = deals.reduce((acc, deal) => {
    acc[deal.status] = (acc[deal.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeDealsValue = deals
    .filter((d) => d.status !== 'lost' && d.estimatedValue)
    .reduce((sum, d) => sum + (d.estimatedValue || 0), 0);

  return (
    <div className="home-dashboard">
      <h1>Welcome, {user?.name}</h1>

      {/* Pipeline Snapshot */}
      <section className="pipeline-snapshot">
        <h2>Deals by Status</h2>
        <div className="status-cards">
          <div className="card">
            <span className="count">{dealsByStatus.lead || 0}</span>
            <span className="label">Leads</span>
          </div>
          <div className="card">
            <span className="count">{dealsByStatus.negotiation || 0}</span>
            <span className="label">Negotiation</span>
          </div>
          <div className="card">
            <span className="count">{dealsByStatus.confirmed || 0}</span>
            <span className="label">Confirmed</span>
          </div>
          <div className="card">
            <span className="count">${activeDealsValue}</span>
            <span className="label">Pipeline Value</span>
          </div>
        </div>
      </section>

      {/* Upcoming Reminders */}
      <section className="upcoming-reminders">
        <h2>Upcoming Reminders</h2>
        <UpcomingReminders reminders={upcomingReminders} />
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {/* FAB-like action buttons */}
        </div>
      </section>
    </div>
  );
}
```

---

## Upcoming Reminders Component

### `src/components/home/UpcomingReminders.tsx`

```typescript
import { Reminder } from '@/lib/zod/schemas';
import { useRemindersStore } from '@/stores/remindersStore';
import { format } from 'date-fns';

interface UpcomingRemindersProps {
  reminders: Reminder[];
}

export function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  const { toggleComplete } = useRemindersStore();

  const handleComplete = (reminderId: string) => {
    toggleComplete(reminderId);
    // Show toast with undo option
  };

  if (reminders.length === 0) {
    return <p>No upcoming reminders</p>;
  }

  return (
    <div className="reminders-list">
      {reminders.map((reminder) => (
        <div key={reminder.id} className="reminder-card">
          <div className="reminder-info">
            <h3>{reminder.title}</h3>
            <p>{format(reminder.dueDate, 'MMM d, h:mm a')}</p>
            {reminder.priority && (
              <span className={`priority-${reminder.priority}`}>{reminder.priority}</span>
            )}
          </div>
          <button onClick={() => handleComplete(reminder.id)}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Plan Limits Component

### `src/components/settings/PlanLimits.tsx`

```typescript
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/placesStore';
import { useContactsStore } from '@/stores/contactsStore';
import { useDealsStore } from '@/stores/dealsStore';
import { useRemindersStore } from '@/stores/remindersStore';

export function PlanLimits() {
  const { user, checkLimit, getCurrentPlan } = useAuthStore();
  const places = usePlacesStore((state) => state.places);
  const contacts = useContactsStore((state) => state.contacts);
  const deals = useDealsStore((state) => state.deals);
  const reminders = useRemindersStore((state) => state.reminders);

  const plan = getCurrentPlan();
  const limits = {
    free: { places: 10, contacts: 50, deals: 20, reminders: 50 },
    premium: { places: Infinity, contacts: Infinity, deals: Infinity, reminders: Infinity },
  };

  const usage = {
    places: places.length,
    contacts: contacts.length,
    deals: deals.length,
    reminders: reminders.length,
  };

  const renderUsageBar = (entity: string, used: number, limit: number) => {
    const percentage = limit === Infinity ? 0 : (used / limit) * 100;
    const isOverLimit = limit !== Infinity && used >= limit;

    return (
      <div key={entity} className="usage-bar">
        <div className="usage-info">
          <span>{entity.charAt(0).toUpperCase() + entity.slice(1)}</span>
          <span>{used} / {limit === Infinity ? '∞' : limit}</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress ${isOverLimit ? 'over-limit' : ''}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isOverLimit && <span className="warning">Limit reached</span>}
      </div>
    );
  };

  return (
    <div className="plan-limits">
      <h2>Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</h2>

      {Object.entries(usage).map(([entity, used]) =>
        renderUsageBar(entity, used, limits[plan][entity as keyof typeof limits[plan]])
      )}

      {plan === 'free' && (
        <button className="upgrade-btn">Upgrade to Premium</button>
      )}
    </div>
  );
}
```

---

## Profile Settings Component

### `src/components/settings/ProfileSettings.tsx`

```typescript
import { useAuthStore } from '@/stores/authStore';

export function ProfileSettings() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Navigate to login
  };

  return (
    <div className="profile-settings">
      <h2>Profile</h2>

      <div className="user-info">
        <div className="avatar">
          {user?.name.charAt(0)}
        </div>
        <div className="details">
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="settings-sections">
        <section>
          <h3>Preferences</h3>
          {/* Theme toggle, notifications, etc. */}
        </section>

        <section>
          <h3>Account</h3>
          <button>Plan & Limits</button>
          <button>Manage Subscription</button>
          <button className="danger">Delete Account</button>
        </section>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

---

## Component Structure

```
src/components/
├── home/
│   ├── Home.tsx (main dashboard)
│   └── UpcomingReminders.tsx
└── settings/
    ├── ProfileSettings.tsx
    ├── PlanLimits.tsx
    └── SubscriptionPlans.tsx
```

---

## Navigation Integration

- `/` → Home Dashboard
- `/settings` → Profile Settings
- `/settings/plan` → Plan Limits
- `/settings/subscription` → Subscription Plans

Bottom tab "Home" → Dashboard
Bottom tab "More" → Settings

---

## Dependencies
- remindersStore (✓ exists)
- dealsStore (from Group B)
- placesStore (from Group A)
- contactsStore (from Group A)
- authStore (✓ exists, needs extension)

---

## Integration Points

### Global FAB
- Show Quick Reminder dialog

### Pipeline
- Update deals in pipeline snapshot

### Calendar
- Update upcoming reminders

### Place/Contact/Deal creation
- Check limits before creating
- Show paywall if over limit

---

## Testing Checklist
- [ ] Dashboard shows correct deal counts by status
- [ ] Pipeline value calculates correctly
- [ ] Upcoming reminders list shows correct order
- [ ] Can complete reminder from list
- [ ] Complete shows toast with undo
- [ ] Plan limits show correct usage
- [ ] Progress bars display correctly
- [ ] Over limit shows warning
- [ ] Upgrade button appears for free plan
- [ ] Profile shows user info
- [ ] Logout button clears auth state
- [ ] Settings sections navigate correctly
- [ ] Subscription plans show comparison

---

## Estimated Time
- Dashboard KPIs: 0.5 day
- Upcoming reminders: 0.25 day
- Plan limits: 0.5 day
- Subscription plans: 0.25 day
- Profile settings: 0.5 day
- **Total: 2 days**
