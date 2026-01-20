# Group F: Quick Reminder

## Overview
Simple, fast reminder creation with entity linking from anywhere in the app.

---

## Tasks

### 1. Quick Reminder Screen/Sheet

#### Fields
- Title (required)
- Due date/time (default: tomorrow)
- Priority (low/medium/high - optional)
- Notes (optional)

#### Entity Linking
- Link to Place (optional)
- Link to Contact (optional)
- Link to Deal (optional)

#### Layout
- Sheet or modal presentation
- Minimal UI for speed
- "Create Reminder" button
- "Cancel" button

Reference: `@artifacts/quick-reminder/code.html` + `screen.png`

File: `src/components/reminders/QuickReminder.tsx`

---

### 2. Entity Selector

#### Purpose
- Allow user to link reminder to one or more entities
- Typeahead/combobox for selecting existing entities

#### Implementation
- Use existing Combobox UI component
- Filter by Place/Contact/Deal
- Show selected entities as tags/chips

File: `src/components/reminders/EntitySelector.tsx`

---

## Zod Schemas

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const reminderPrioritySchema = z.enum(["low", "medium", "high"]);

export const reminderSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  dueDate: z.date(),
  completed: z.boolean().default(false),
  priority: reminderPrioritySchema.optional(),
  notes: z.string().optional(),
  placeId: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reminder = z.infer<typeof reminderSchema>;
export type ReminderPriority = z.infer<typeof reminderPrioritySchema>;
```

---

## Store Update: `src/stores/remindersStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reminder } from '@/lib/zod/schemas';

interface RemindersState {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleComplete: (id: string) => void;
  getReminderById: (id: string) => Reminder | undefined;
  getRemindersByPlace: (placeId: string) => Reminder[];
  getRemindersByContact: (contactId: string) => Reminder[];
  getRemindersByDeal: (dealId: string) => Reminder[];
  getUpcomingReminders: (limit?: number) => Reminder[];
}

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, reminder]
      })),

      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
        )
      })),

      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id)
      })),

      toggleComplete: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, completed: !r.completed, updatedAt: new Date() } : r
        )
      })),

      getReminderById: (id) => get().reminders.find((r) => r.id === id),

      getRemindersByPlace: (placeId) => get().reminders.filter((r) => r.placeId === placeId),

      getRemindersByContact: (contactId) => get().reminders.filter((r) => r.contactId === contactId),

      getRemindersByDeal: (dealId) => get().reminders.filter((r) => r.dealId === dealId),

      getUpcomingReminders: (limit = 10) => {
        const now = new Date();
        return get().reminders
          .filter((r) => !r.completed && r.dueDate >= now)
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
          .slice(0, limit);
      },
    }),
    { name: 'reminders-storage' }
  )
);
```

---

## Quick Reminder Component

### `src/components/reminders/QuickReminder.tsx`

```typescript
import { useState } from 'react';
import { useRemindersStore } from '@/stores/remindersStore';
import { reminderSchema } from '@/lib/zod/schemas';
import { usePlacesStore } from '@/stores/placesStore';
import { useContactsStore } from '@/stores/contactsStore';
import { useDealsStore } from '@/stores/dealsStore';
import EntitySelector from './EntitySelector';

interface QuickReminderProps {
  prefillDate?: Date;
  prefillPlaceId?: string;
  prefillContactId?: string;
  prefillDealId?: string;
  onClose: () => void;
}

export function QuickReminder({
  prefillDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
  prefillPlaceId,
  prefillContactId,
  prefillDealId,
  onClose,
}: QuickReminderProps) {
  const { addReminder } = useRemindersStore();
  const places = usePlacesStore((state) => state.places);
  const contacts = useContactsStore((state) => state.contacts);
  const deals = useDealsStore((state) => state.deals);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(prefillDate);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const [selectedPlaceId, setSelectedPlaceId] = useState(prefillPlaceId);
  const [selectedContactId, setSelectedContactId] = useState(prefillContactId);
  const [selectedDealId, setSelectedDealId] = useState(prefillDealId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reminder: Reminder = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      completed: false,
      priority,
      notes,
      placeId: selectedPlaceId,
      contactId: selectedContactId,
      dealId: selectedDealId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    reminderSchema.parse(reminder);
    addReminder(reminder);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="quick-reminder">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Reminder title"
        required
      />

      <input
        type="datetime-local"
        value={dueDate.toISOString().slice(0, 16)}
        onChange={(e) => setDueDate(new Date(e.target.value))}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
      />

      <EntitySelector
        places={places}
        contacts={contacts}
        deals={deals}
        selectedPlaceId={selectedPlaceId}
        selectedContactId={selectedContactId}
        selectedDealId={selectedDealId}
        onSelectPlace={setSelectedPlaceId}
        onSelectContact={setSelectedContactId}
        onSelectDeal={setSelectedDealId}
      />

      <div className="actions">
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit">Create Reminder</button>
      </div>
    </form>
  );
}
```

---

## Entity Selector Component

### `src/components/reminders/EntitySelector.tsx`

```typescript
import { Place, Contact, Deal } from '@/lib/zod/schemas';

interface EntitySelectorProps {
  places: Place[];
  contacts: Contact[];
  deals: Deal[];
  selectedPlaceId?: string;
  selectedContactId?: string;
  selectedDealId?: string;
  onSelectPlace: (id: string | undefined) => void;
  onSelectContact: (id: string | undefined) => void;
  onSelectDeal: (id: string | undefined) => void;
}

export function EntitySelector({
  places,
  contacts,
  deals,
  selectedPlaceId,
  selectedContactId,
  selectedDealId,
  onSelectPlace,
  onSelectContact,
  onSelectDeal,
}: EntitySelectorProps) {
  return (
    <div className="entity-selector">
      {/* Place Selector */}
      <select
        value={selectedPlaceId || ''}
        onChange={(e) => onSelectPlace(e.target.value || undefined)}
      >
        <option value="">Select Place (optional)</option>
        {places.map((place) => (
          <option key={place.id} value={place.id}>
            {place.name}
          </option>
        ))}
      </select>

      {/* Contact Selector */}
      <select
        value={selectedContactId || ''}
        onChange={(e) => onSelectContact(e.target.value || undefined)}
      >
        <option value="">Select Contact (optional)</option>
        {contacts.map((contact) => (
          <option key={contact.id} value={contact.id}>
            {contact.name}
          </option>
        ))}
      </select>

      {/* Deal Selector */}
      <select
        value={selectedDealId || ''}
        onChange={(e) => onSelectDeal(e.target.value || undefined)}
      >
        <option value="">Select Deal (optional)</option>
        {deals.map((deal) => (
          <option key={deal.id} value={deal.id}>
            {deal.title}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## Component Structure

```
src/components/reminders/
├── QuickReminder.tsx
├── EntitySelector.tsx
└── ReminderCard.tsx (for display)
```

---

## Navigation Integration

- `/reminders/new` → Quick Reminder
- FAB (global) → Quick Reminder
- Calendar Day Detail → Quick Reminder (pre-fill date)
- Visit Summary → Quick Reminder (pre-fill place/deal)

---

## Dependencies
- remindersStore (✓ exists, needs extension)
- Group A: Places & Contacts (for entity linking)
- Group B: Deals (for entity linking)

---

## Integration Points

### Home Dashboard
- FAB → Quick Reminder
- Upcoming reminders list → Quick Reminder (for new)

### Calendar
- Day Detail → Quick Reminder (pre-fill date)

### Place/Contact/Deal Details
- "Add Reminder" button → Quick Reminder (pre-fill entity)

### Visit Summary
- "Create reminder" checkbox → Quick Reminder (pre-fill place/deal)

---

## Testing Checklist
- [ ] Quick Reminder opens from FAB
- [ ] Title is required
- [ ] Due date defaults to tomorrow
- [ ] Can change due date
- [ ] Can set priority
- [ ] Can add notes
- [ ] Can select Place (optional)
- [ ] Can select Contact (optional)
- [ ] Can select Deal (optional)
- [ ] Create button creates reminder
- [ ] Reminder appears in upcoming list
- [ ] Pre-fill from place works
- [ ] Pre-fill from date works
- [ ] Cancel button closes without creating

---

## Estimated Time
- Quick Reminder screen: 0.5 day
- Entity Selector: 0.25 day
- Store updates: 0.25 day
- **Total: 1 day**
