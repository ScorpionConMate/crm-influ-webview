# Group E: Check-in / Visit Flow

## Overview
Visit session management with notes, voice memos, reference history, and session summary.

---

## Tasks

### 1. Start a Visit

#### Fields
- Select Place (required)
- Select associated Deal (optional)
- Date/time (default: now)
- Purpose of visit (optional, free text)

#### Actions
- "Start Visit" button → create active visit session
- Navigate to Visit Notes

Reference: `@artifacts/check-in/start_a_visit_check-in`

File: `src/components/checkin/StartVisit.tsx`

---

### 2. Visit Notes + Voice Memo

#### Notes Section
- Large text area for quick notes
- Auto-save after each change
- Timestamp on each note

#### Voice Memo Section
- Record button
- Recording duration display
- Stop/Save
- Play back recorded memo
- Delete memo
- Storage: Base64 string or local file URL

#### Actions
- Add new note
- Record voice memo
- View all notes in chronological order

Reference:
- `@artifacts/check-in/visit_notes_&_voice_memo_1`
- `@artifacts/check-in/visit_notes_&_voice_memo_2`

File: `src/components/checkin/VisitNotes.tsx`

---

### 3. Visit Reference History

#### Timeline Display
- Show previous visits to this place
- Show previous deals with this place
- Show notes from previous visits
- Show reminders related to this place/deal

#### Purpose
- Context for current visit
- "What happened last time?"
- Quick reference while taking notes

Reference: `@artifacts/check-in/visit_reference_history`

File: `src/components/checkin/VisitHistory.tsx`

---

### 4. Visit Session Summary

#### Summary Display
- Place visited
- Deal (if linked)
- Date/time of visit
- Number of notes taken
- Number of voice memos

#### Next Steps Section
- Text area for action items
- Checkbox: "Create reminder for follow-up"

#### Actions
- "Complete Visit" button
  - Marks visit as completed
  - Creates reminder if checkbox checked
  - Navigates to Place detail or Calendar

Reference: `@artifacts/check-in/visit_session_summary`

File: `src/components/checkin/VisitSummary.tsx`

---

## Zod Schemas

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const visitNoteSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Note cannot be empty"),
  timestamp: z.date(),
});

export const voiceMemoSchema = z.object({
  id: z.string(),
  url: z.string(), // Base64 or file URL
  duration: z.number(), // in seconds
  timestamp: z.date(),
});

export const visitSessionSchema = z.object({
  id: z.string(),
  placeId: z.string(),
  placeName: z.string(),
  dealId: z.string().optional(),
  date: z.date(),
  purpose: z.string().optional(),
  notes: z.array(visitNoteSchema).default([]),
  voiceMemos: z.array(voiceMemoSchema).default([]),
  completed: z.boolean().default(false),
  nextSteps: z.string().optional(),
  createReminder: z.boolean().default(false),
  reminderTitle: z.string().optional(),
  reminderDueDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type VisitNote = z.infer<typeof visitNoteSchema>;
export type VoiceMemo = z.infer<typeof voiceMemoSchema>;
export type VisitSession = z.infer<typeof visitSessionSchema>;
```

---

## Store Update: `src/stores/visitsStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VisitSession, VisitNote, VoiceMemo } from '@/lib/zod/schemas';

interface VisitsState {
  visits: VisitSession[];
  activeVisit: VisitSession | null;
  startVisit: (visit: Omit<VisitSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addNote: (visitId: string, note: VisitNote) => void;
  addVoiceMemo: (visitId: string, memo: VoiceMemo) => void;
  updateNextSteps: (visitId: string, nextSteps: string) => void;
  setReminderInfo: (visitId: string, createReminder: boolean, title?: string, dueDate?: Date) => void;
  completeVisit: (visitId: string) => void;
  getVisitsByPlace: (placeId: string) => VisitSession[];
  setActiveVisit: (visit: VisitSession | null) => void;
  clearActiveVisit: () => void;
}

export const useVisitsStore = create<VisitsState>()(
  persist(
    (set, get) => ({
      visits: [],
      activeVisit: null,

      startVisit: (visit) => set((state) => {
        const newVisit: VisitSession = {
          ...visit,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return {
          visits: [...state.visits, newVisit],
          activeVisit: newVisit,
        };
      }),

      addNote: (visitId, note) => set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                notes: [...visit.notes, note],
                updatedAt: new Date(),
              }
            : visit
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? {
              ...state.activeVisit,
              notes: [...state.activeVisit.notes, note],
              updatedAt: new Date(),
            }
          : state.activeVisit,
      })),

      addVoiceMemo: (visitId, memo) => set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                voiceMemos: [...visit.voiceMemos, memo],
                updatedAt: new Date(),
              }
            : visit
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? {
              ...state.activeVisit,
              voiceMemos: [...state.activeVisit.voiceMemos, memo],
              updatedAt: new Date(),
            }
          : state.activeVisit,
      })),

      updateNextSteps: (visitId, nextSteps) => set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === visitId
            ? { ...visit, nextSteps, updatedAt: new Date() }
            : visit
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? { ...state.activeVisit, nextSteps, updatedAt: new Date() }
          : state.activeVisit,
      })),

      setReminderInfo: (visitId, createReminder, title, dueDate) => set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                createReminder,
                reminderTitle: title,
                reminderDueDate: dueDate,
                updatedAt: new Date(),
              }
            : visit
        ),
      })),

      completeVisit: (visitId) => set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === visitId
            ? { ...visit, completed: true, updatedAt: new Date() }
            : visit
        ),
        activeVisit: null,
      })),

      getVisitsByPlace: (placeId) => get().visits.filter((v) => v.placeId === placeId),

      setActiveVisit: (visit) => set({ activeVisit: visit }),
      clearActiveVisit: () => set({ activeVisit: null }),
    }),
    { name: 'visits-storage' }
  )
);
```

---

## Voice Memo Storage Adapter

Create `src/lib/storage/voiceMemoAdapter.ts`:

```typescript
export class VoiceMemoStorage {
  static async save(audioBlob: Blob): Promise<string> {
    // Convert to Base64 for local storage (limit size)
    // For production, use Supabase Storage or similar
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(audioBlob);
    });
  }

  static async get(base64: string): Promise<Blob> {
    const response = await fetch(base64);
    return response.blob();
  }

  static getDuration(base64: string): number {
    // Estimate from file size or parse audio metadata
    // For now, return placeholder
    return 0;
  }
}
```

---

## Component Structure

```
src/components/checkin/
├── StartVisit.tsx
├── VisitNotes.tsx
├── VisitHistory.tsx
├── VisitSummary.tsx
├── VisitNoteItem.tsx
├── VoiceMemoPlayer.tsx
└── VoiceMemoRecorder.tsx
```

---

## Voice Memo Recorder Component

### `src/components/checkin/VoiceMemoRecorder.tsx`

```typescript
import { useState, useRef } from 'react';
import { VoiceMemoStorage } from '@/lib/storage/voiceMemoAdapter';

export function VoiceMemoRecorder({ onMemoSaved }: { onMemoSaved: (memo: any) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = await VoiceMemoStorage.save(audioBlob);

        onMemoSaved({
          id: crypto.randomUUID(),
          url,
          duration,
          timestamp: new Date(),
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? `Stop (${duration}s)` : 'Record'}
      </button>
    </div>
  );
}
```

---

## Navigation Integration

- `/visits/start` → Start Visit (select place)
- `/visits/:id/notes` → Visit Notes (active visit)
- `/visits/:id/history` → Visit History
- `/visits/:id/summary` → Visit Summary

FAB on Places → "Start Visit" (pre-fill place)

---

## Dependencies
- Group A: Places (for linking)
- Group B: Deals (optional linking)
- visitsStore (✓ exists, needs extension)
- remindersStore (✓ exists, for creating reminder on complete)

---

## Integration Points

### Place Detail
- "Start Visit" button → pre-fill place, navigate to StartVisit

### Calendar
- Show visits as events → link to visit detail

### Place History Timeline
- Show past visits with notes count

---

## Testing Checklist
- [ ] Can start visit with place selection
- [ ] Can optionally link deal
- [ ] Visit Notes page shows active visit
- [ ] Can add text notes
- [ ] Notes auto-save
- [ ] Can record voice memo
- [ ] Can play back voice memo
- [ ] Can delete voice memo
- [ ] Visit History shows previous visits
- [ ] Can view notes from previous visits
- [ ] Visit Summary shows visit details
- [ ] Can enter next steps
- [ ] Can check "create reminder" box
- [ ] Complete visit marks it as completed
- [ ] Reminder is created if checkbox checked
- [ ] After complete, navigate to correct page

---

## Estimated Time
- Start Visit: 0.25 day
- Visit Notes: 0.5 day
- Voice Memo: 0.5-1 day (recording complexity)
- Visit History: 0.5 day
- Visit Summary: 0.25 day
- Store updates: 0.5 day
- **Total: 2 days**
