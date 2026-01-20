# Group A: Places & Contacts Module

## Overview
Unified places and contacts management with filtering, detailed views, and history timeline.

---

## Tasks

### 1. Add Place (2-step form)

#### Step 1: Basic Info
- Fields: name, type (restaurant/cafe/hotel/event), location (address)
- Zod schema: `placeBasicInfoSchema`
- Reference: `@artifacts/places/add_new_place_1`
- File: `src/components/places/AddPlaceStep1.tsx`

#### Step 2: Details
- Fields: contact person, phone, email, category, notes
- Link existing contacts
- Zod schema: `placeDetailsSchema`
- Reference: `@artifacts/places/add_new_place_2`
- File: `src/components/places/AddPlaceStep2.tsx`

---

### 2. Place Detail & History

#### Place Info Display
- Name, type, location, contact info
- Linked contacts list
- Associated deals (count + list)
- Visit history

#### History Timeline
- Deals created/updated
- Visits completed
- Notes added
- Reminders associated

Reference: `@artifacts/places/place_details_&_history`

File: `src/components/places/PlaceDetail.tsx`

---

### 3. Add Contact Form

#### Contact Info
- Name, role, email, phone
- Link to one or more existing places
- Notes

Zod schema: `contactSchema`

Reference: `@artifacts/contact/add_new_contact`

File: `src/components/contacts/AddContact.tsx`

---

### 4. Contact Detail & History

#### Contact Info Display
- Name, role, contact details
- Linked places list
- Associated deals (count + list)

#### History Timeline
- Deals created/updated
- Notes added
- Reminders associated

Reference: `@artifacts/contact/place_details_&_history`

File: `src/components/contacts/ContactDetail.tsx`

---

## Zod Schemas to Add/Extend

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const placeBasicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["restaurant", "cafe", "hotel", "event", "other"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  notes: z.string().optional(),
});

export const placeDetailsSchema = z.object({
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  category: z.string().optional(),
  linkedContactIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  linkedPlaceIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const placeSchema = placeBasicInfoSchema.merge(placeDetailsSchema);

export type Place = z.infer<typeof placeSchema>;
export type Contact = z.infer<typeof contactSchema>;
```

---

## Store Updates

### `src/stores/placesStore.ts`

Add CRUD operations:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Place } from '@/lib/zod/schemas';

interface PlacesState {
  places: Place[];
  activePlace: Place | null;
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  getPlaceById: (id: string) => Place | undefined;
  setActivePlace: (place: Place | null) => void;
}

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      places: [],
      activePlace: null,
      addPlace: (place) => set((state) => ({
        places: [...state.places, { ...place, id: crypto.randomUUID() }]
      })),
      updatePlace: (id, updates) => set((state) => ({
        places: state.places.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      deletePlace: (id) => set((state) => ({
        places: state.places.filter((p) => p.id !== id)
      })),
      getPlaceById: (id) => get().places.find((p) => p.id === id),
      setActivePlace: (place) => set({ activePlace: place }),
    }),
    { name: 'places-storage' }
  )
);
```

### `src/stores/contactsStore.ts`

Add CRUD operations (similar pattern to placesStore).

---

## Component Structure

```
src/components/
├── places/
│   ├── AddPlaceStep1.tsx
│   ├── AddPlaceStep2.tsx
│   ├── PlaceDetail.tsx
│   ├── PlaceCard.tsx (for list view)
│   └── PlaceTimeline.tsx (history component)
├── contacts/
│   ├── AddContact.tsx
│   ├── ContactDetail.tsx
│   ├── ContactCard.tsx
│   └── ContactTimeline.tsx
```

---

## Navigation Integration

Update routing to include:
- `/places` → unified list (Places & Contacts with filter tabs)
- `/places/add` → Add Place wizard
- `/places/:id` → Place detail
- `/contacts/add` → Add Contact
- `/contacts/:id` → Contact detail

---

## Dependencies
- Mobile shell (✓ exists)
- Zod schemas (✓ needs update)
- Existing UI components (✓ button, input, card, etc.)

---

## Testing Checklist
- [ ] Can add place with step 1 only (draft saved)
- [ ] Can complete both steps and create place
- [ ] Place detail shows all info
- [ ] Timeline displays history correctly
- [ ] Can add contact and link to places
- [ ] Contact detail shows linked places
- [ ] Can edit existing place/contact
- [ ] Can delete place/contact with soft delete

---

## Estimated Time
- Add Place form: 0.5-1 day
- Place detail + timeline: 0.5-1 day
- Add Contact: 0.5 day
- Contact detail + timeline: 0.5 day
- **Total: 2-3 days**
