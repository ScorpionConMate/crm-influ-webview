# Group B: Pipeline & Deals Module

## Overview
Deal status management and detailed deal views with deliverables and payments.

---

## Tasks

### 1. Deal Status Management

#### Status Change Flow
- Tap deal → open status picker
- Select new status from dropdown
- Optional: lost reason (if status = "Lost")
- Update store and reflect in Pipeline

#### Status Options
- Lead
- Contacted
- Negotiation
- Confirmed
- Delivered
- Paid
- Lost

Reference: `@artifacts/pipelines/deal_status_management`

File: `src/components/pipeline/DealStatusPicker.tsx`

---

### 2. Deal Detail View

#### Deal Summary Section
- Deal title/name
- Status badge
- Associated place/contact
- Value (amount)
- Dates (created, estimated delivery, actual delivery)
- Notes

#### Deliverables Section
- List of deliverables with status
- Type, quantity, due date, status

#### Payments Section
- Total amount
- Currency
- Payment method
- Invoice status (pending/sent/paid)
- Payment terms

#### History Timeline
- Status changes with timestamps
- Deliverable updates
- Payment milestones
- Notes added
- Related reminders

#### Actions
- Edit deal
- Delete deal (soft delete)
- Add note
- Create reminder

File: `src/components/pipeline/DealDetail.tsx`

---

## Zod Schemas to Add

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const dealStatusSchema = z.enum([
  "lead",
  "contacted",
  "negotiation",
  "confirmed",
  "delivered",
  "paid",
  "lost"
]);

export const deliverableSchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(1),
  dueDate: z.date().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
});

export const paymentInfoSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  method: z.enum(["cash", "bank_transfer", "paypal", "other"]),
  invoiceSent: z.boolean().default(false),
  invoicePaid: z.boolean().default(false),
  invoiceDate: z.date().optional(),
  terms: z.string().optional(),
});

export const dealSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  status: dealStatusSchema,
  placeId: z.string().optional(),
  contactId: z.string().optional(),
  estimatedValue: z.number().positive().optional(),
  actualValue: z.number().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  deliverables: z.array(deliverableSchema).default([]),
  payments: paymentInfoSchema.optional(),
  lostReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Deal = z.infer<typeof dealSchema>;
export type DealStatus = z.infer<typeof dealStatusSchema>;
export type Deliverable = z.infer<typeof deliverableSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
```

---

## Store: `src/stores/dealsStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deal, DealStatus } from '@/lib/zod/schemas';

interface DealsState {
  deals: Deal[];
  activeDeal: Deal | null;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDealById: (id: string) => Deal | undefined;
  getDealsByStatus: (status: DealStatus) => Deal[];
  getDealsByPlace: (placeId: string) => Deal[];
  setActiveDeal: (deal: Deal | null) => void;
}

export const useDealsStore = create<DealsState>()(
  persist(
    (set, get) => ({
      deals: [],
      activeDeal: null,
      addDeal: (deal) => set((state) => ({
        deals: [...state.deals, deal]
      })),
      updateDeal: (id, updates) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
        )
      })),
      deleteDeal: (id) => set((state) => ({
        deals: state.deals.filter((d) => d.id !== id)
      })),
      getDealById: (id) => get().deals.find((d) => d.id === id),
      getDealsByStatus: (status) => get().deals.filter((d) => d.status === status),
      getDealsByPlace: (placeId) => get().deals.filter((d) => d.placeId === placeId),
      setActiveDeal: (deal) => set({ activeDeal: deal }),
    }),
    { name: 'deals-storage' }
  )
);
```

---

## Component Structure

```
src/components/pipeline/
├── Pipeline.tsx (exists - extend)
├── DealCard.tsx (for pipeline view)
├── DealDetail.tsx
├── DealStatusPicker.tsx
├── DealSummary.tsx (section in detail)
├── DeliverablesList.tsx
└── PaymentsSection.tsx
```

---

## Navigation Integration

Update routing to include:
- `/pipeline` → existing Pipeline component
- `/pipeline/:id` → Deal detail

---

## Dependencies
- Mobile shell (✓ exists)
- Zod schemas (✓ needs update)
- Existing UI components (✓ badge, card, button, etc.)
- Places/Contacts (from Group A) - for linking

---

## Integration Points

### Update `src/components/pipeline/Pipeline.tsx`
- Group deals by status
- Render DealCard for each deal
- Click → navigate to DealDetail

### Update `src/components/places/PlaceDetail.tsx`
- Show associated deals
- Link to DealDetail

### Update `src/components/contacts/ContactDetail.tsx`
- Show associated deals
- Link to DealDetail

---

## Testing Checklist
- [ ] Can view deal detail from Pipeline
- [ ] Status picker shows all statuses
- [ ] Can change deal status
- [ ] Lost reason appears when status = Lost
- [ ] Deal detail shows all sections
- [ ] Deliverables list displays correctly
- [ ] Payment info shows correctly
- [ ] Timeline shows status changes
- [ ] Can edit deal
- [ ] Can delete deal

---

## Estimated Time
- Deal status management: 0.5-1 day
- Deal detail view: 0.5-1 day
- Store setup: 0.5 day
- **Total: 1.5-2 days**
