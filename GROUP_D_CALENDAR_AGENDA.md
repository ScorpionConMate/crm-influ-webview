# Group D: Calendar & Agenda

## Overview
Calendar and agenda views for managing reminders, deal milestones, and visit sessions.

---

## Tasks

### 1. Calendar + Agenda View (Toggle)

#### Calendar View
- Month grid view
- Day cells show indicator dots for events
- Tap day → navigate to DayDetail
- Navigate between months

#### Agenda View
- List of upcoming events grouped by date
- Shows: reminder title, deal name (if linked), visit name
- Tap event → open entity

#### Toggle
- Switch between Calendar and Agenda views
- Persist user preference

Reference:
- `@artifacts/calendar/calendar_&_agenda_view_1`
- `@artifacts/calendar/calendar_&_agenda_view_2`

Files:
- `src/components/calendar/CalendarView.tsx`
- `src/components/calendar/AgendaView.tsx`
- Update `src/components/calendar/Calendar.tsx`

---

### 2. Calendar Empty State

#### Display when no events
- Friendly message
- "Create Reminder" button
- Reference: `@artifacts/calendar/calendar_empty_state`

File: `src/components/calendar/CalendarEmptyState.tsx`

---

### 3. Map Internal Events to Calendar

#### Event Types
- **Reminders** → Calendar events
  - Title = reminder title
  - Date = reminder due date
  - Link to reminder detail

- **Deal milestones** → Calendar events (optional)
  - Start date
  - End date
  - Deliverable due dates
  - Link to deal detail

- **Visits** → Calendar events
  - Visit date
  - Place name
  - Link to visit detail

#### Store Integration
- CalendarStore aggregates events from:
  - remindersStore
  - dealsStore
  - visitsStore

File: `src/stores/calendarStore.ts`

---

### 4. Day Detail / Agenda Interactions

#### Day Detail View
- List all events for selected day
- Group by event type (reminder, deal, visit)
- For each event:
  - Show title, time, linked entity
  - Actions:
    - Open entity (navigate to detail)
    - For reminders: mark done
    - Create quick action (e.g., create reminder from deal)

#### Create Reminder from Day Detail
- Quick reminder button
- Pre-fill date with selected day
- Reference: Group F (Quick Reminder)

File: `src/components/calendar/DayDetail.tsx`

---

## Zod Schemas

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const calendarEventType = z.enum([
  "reminder",
  "deal_start",
  "deal_end",
  "deliverable_due",
  "visit",
]);

export const calendarEventSchema = z.object({
  id: z.string(),
  type: calendarEventType,
  title: z.string(),
  date: z.date(),
  time: z.string().optional(),
  entityId: z.string(), // ID of linked entity
  entityType: z.enum(["reminder", "deal", "visit", "deliverable"]),
  completed: z.boolean().default(false),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarEventType = z.infer<typeof calendarEventType>;
```

---

## Store: `src/stores/calendarStore.ts`

```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CalendarEvent } from '@/lib/zod/schemas';
import { useRemindersStore } from './remindersStore';
import { useDealsStore } from './dealsStore';
import { useVisitsStore } from './visitsStore';
import { startOfDay, isSameDay, format } from 'date-fns';

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: Date;
  viewMode: 'calendar' | 'agenda';
  setViewMode: (mode: 'calendar' | 'agenda') => void;
  setSelectedDate: (date: Date) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForMonth: (year: number, month: number) => CalendarEvent[];
  refreshEvents: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  subscribeWithSelector((set, get) => ({
    events: [],
    selectedDate: new Date(),
    viewMode: 'calendar',

    setViewMode: (mode) => set({ viewMode: mode }),
    setSelectedDate: (date) => set({ selectedDate: date }),

    refreshEvents: () => {
      const reminders = useRemindersStore.getState().reminders;
      const deals = useDealsStore.getState().deals;
      const visits = useVisitsStore.getState().visits;

      const events: CalendarEvent[] = [];

      // Map reminders
      reminders.forEach(reminder => {
        events.push({
          id: `reminder-${reminder.id}`,
          type: 'reminder',
          title: reminder.title,
          date: reminder.dueDate,
          entityId: reminder.id,
          entityType: 'reminder',
          completed: reminder.completed,
        });
      });

      // Map deal dates
      deals.forEach(deal => {
        if (deal.startDate) {
          events.push({
            id: `deal-start-${deal.id}`,
            type: 'deal_start',
            title: `${deal.title} starts`,
            date: deal.startDate,
            entityId: deal.id,
            entityType: 'deal',
            completed: false,
          });
        }
        if (deal.endDate) {
          events.push({
            id: `deal-end-${deal.id}`,
            type: 'deal_end',
            title: `${deal.title} ends`,
            date: deal.endDate,
            entityId: deal.id,
            entityType: 'deal',
            completed: false,
          });
        }
        // Map deliverables
        deal.deliverables.forEach((deliverable, idx) => {
          if (deliverable.dueDate) {
            events.push({
              id: `deliverable-${deal.id}-${idx}`,
              type: 'deliverable_due',
              title: `${deliverable.type} due`,
              date: deliverable.dueDate,
              entityId: deal.id,
              entityType: 'deliverable',
              completed: deliverable.status === 'completed',
            });
          }
        });
      });

      // Map visits
      visits.forEach(visit => {
        events.push({
          id: `visit-${visit.id}`,
          type: 'visit',
          title: `Visit to ${visit.placeName}`,
          date: visit.date,
          entityId: visit.id,
          entityType: 'visit',
          completed: visit.completed,
        });
      });

      set({ events });
    },

    getEventsForDate: (date) => {
      const events = get().events;
      return events.filter(event => isSameDay(event.date, date));
    },

    getEventsForMonth: (year, month) => {
      const events = get().events;
      return events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month;
      });
    },
  }))
);

// Subscribe to stores and auto-refresh events
useRemindersStore.subscribe(() => useCalendarStore.getState().refreshEvents());
useDealsStore.subscribe(() => useCalendarStore.getState().refreshEvents());
useVisitsStore.subscribe(() => useCalendarStore.getState().refreshEvents());
```

---

## Component Structure

```
src/components/calendar/
├── Calendar.tsx (main container - exists, extend)
├── CalendarView.tsx (month grid)
├── AgendaView.tsx (list view)
├── DayDetail.tsx
├── CalendarEmptyState.tsx
├── CalendarDay.tsx (individual day cell)
└── EventItem.tsx (reusable event display)
```

---

## Calendar View Component

### `src/components/calendar/CalendarView.tsx`

```typescript
import { useCalendarStore } from '@/stores/calendarStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { CalendarDay } from './CalendarDay';

export function CalendarView() {
  const { selectedDate, setSelectedDate, getEventsForMonth } = useCalendarStore();
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const events = getEventsForMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  const hasEventsOnDay = (day: Date) => {
    return events.some(event => isSameDay(event.date, day));
  };

  return (
    <div className="calendar-grid">
      {/* Month navigation */}
      {/* Day headers */}
      <div className="days-grid">
        {days.map(day => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            isCurrentMonth={isSameMonth(day, selectedDate)}
            isSelected={isSameDay(day, selectedDate)}
            hasEvents={hasEventsOnDay(day)}
            onPress={() => setSelectedDate(day)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Day Detail Component

### `src/components/calendar/DayDetail.tsx`

```typescript
import { useCalendarStore } from '@/stores/calendarStore';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';

export function DayDetail() {
  const { selectedDate, getEventsForDate } = useCalendarStore();
  const events = getEventsForDate(selectedDate);
  const navigate = useNavigate();

  const handleEventPress = (event: CalendarEvent) => {
    switch (event.entityType) {
      case 'reminder':
        navigate(`/reminders/${event.entityId}`);
        break;
      case 'deal':
        navigate(`/pipeline/${event.entityId}`);
        break;
      case 'visit':
        navigate(`/visits/${event.entityId}`);
        break;
    }
  };

  return (
    <div className="day-detail">
      <h2>{format(selectedDate, 'MMMM d, yyyy')}</h2>
      {events.length === 0 ? (
        <CalendarEmptyState />
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} onClick={() => handleEventPress(event)}>
              <EventItem event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Navigation Integration

- `/calendar` → Calendar view (toggle between calendar/agenda)
- `/calendar/day/:date` → Day detail
- FAB → Quick Reminder

---

## Dependencies
- remindersStore (✓ exists)
- visitsStore (✓ exists)
- dealsStore (from Group B)
- date-fns (✓ installed)

---

## Integration Points

### Home Dashboard
Show upcoming reminders → link to calendar

### Place/Contact/Deal Details
Show linked reminders → link to calendar

---

## Testing Checklist
- [ ] Calendar view shows correct month
- [ ] Can navigate between months
- [ ] Days with events show indicators
- [ ] Tap day → navigate to DayDetail
- [ ] Agenda view shows all upcoming events
- [ ] Can toggle between Calendar and Agenda views
- [ ] DayDetail shows all events for selected day
- [ ] Events link to correct entities
- [ ] Can create reminder from DayDetail
- [ ] Calendar events update when reminders/deals/visits change
- [ ] Empty state shows correctly

---

## Estimated Time
- Calendar view: 0.5-1 day
- Agenda view: 0.25 day
- Calendar store + event mapping: 0.5 day
- Day detail + interactions: 0.5 day
- Empty state: 0.25 day
- **Total: 2 days**
