# Group C: New Deal Wizard

## Overview
4-step wizard for creating new deals with draft persistence and validation.

---

## Tasks

### 1. Step 1: General Info

#### Fields
- Deal title
- Select Place (from existing places or create new)
- Select Contact (from existing contacts or create new, optional)
- Estimated start date
- Estimated end date
- Estimated value
- Notes

#### Validation
- Title required
- At least one entity selected (place OR contact)
- Dates logical (end ≥ start)

Reference: `@artifacts/new-deal/new_deal:_general_info`

File: `src/components/new-deal/step1-GeneralInfo.tsx`

---

### 2. Step 2: Deliverables CRUD

#### Deliverable Item Fields
- Type (post/story/reel/video/custom)
- Description (optional)
- Quantity
- Due date
- Status (default: pending)

#### Actions
- Add new deliverable
- Edit existing deliverable
- Remove deliverable
- Reorder (optional)

#### Validation
- Type required
- Quantity positive number

Reference: `@artifacts/new-deal/new_deal:_deliverables`

File: `src/components/new-deal/step2-Deliverables.tsx`

---

### 3. Step 3: Payments & Legal

#### Fields
- Total amount
- Currency selector (USD, EUR, GBP, etc.)
- Payment method (cash, bank_transfer, paypal, other)
- Invoice required? (toggle)
- Payment terms (text)
- Additional legal notes

#### Validation
- Amount positive number
- Currency required

Reference: `@artifacts/new-deal/new_deal:_payments_&_legal`

File: `src/components/new-deal/step3-PaymentsLegal.tsx`

---

### 4. Step 4: Review + Create

#### Summary Display
- Deal title
- Status (default: Lead)
- Place & Contact
- Dates
- Estimated value
- Deliverables list
- Payment info
- Notes

#### Actions
- "Create Deal" button
- "Back" to edit steps

Reference: `@artifacts/new-deal/new_deal:_review`

File: `src/components/new-deal/step4-Review.tsx`

---

### 5. Wizard Draft Persistence

#### Behavior
- Save progress after each step
- Auto-save on unmount
- Restore draft on revisit
- Clear draft after successful creation
- "Discard" button to clear manually

Reference: No specific artifact

---

## Zod Schemas

Update `src/lib/zod/schemas.ts`:

```typescript
import { z } from "zod";

export const dealWizardStep1Schema = z.object({
  title: z.string().min(1, "Title is required"),
  placeId: z.string().optional(),
  contactId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  estimatedValue: z.number().positive().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => data.placeId || data.contactId,
  { message: "Select at least one place or contact" }
);

export const deliverableItemSchema = z.object({
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  quantity: z.number().int().positive(),
  dueDate: z.date().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
});

export const dealWizardStep2Schema = z.object({
  deliverables: z.array(deliverableItemSchema).default([]),
});

export const paymentInfoSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  method: z.enum(["cash", "bank_transfer", "paypal", "other"]),
  invoiceRequired: z.boolean().default(false),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

export const dealWizardStep3Schema = z.object({
  payments: paymentInfoSchema,
});

export const dealWizardDraftSchema = dealWizardStep1Schema
  .merge(dealWizardStep2Schema)
  .merge(dealWizardStep3Schema)
  .extend({
    currentStep: z.number().min(1).max(4).default(1),
    completed: z.array(z.number()).default([]),
  });

export type DealWizardDraft = z.infer<typeof dealWizardDraftSchema>;
export type DealWizardStep1 = z.infer<typeof dealWizardStep1Schema>;
export type DealWizardStep2 = z.infer<typeof dealWizardStep2Schema>;
export type DealWizardStep3 = z.infer<typeof dealWizardStep3Schema>;
```

---

## Store: `src/stores/dealWizardStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DealWizardDraft } from '@/lib/zod/schemas';

interface DealWizardState {
  draft: DealWizardDraft | null;
  setDraft: (draft: DealWizardDraft) => void;
  updateStep1: (data: Partial<DealWizardDraft>) => void;
  updateStep2: (deliverables: any[]) => void;
  updateStep3: (payments: any) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  clearDraft: () => void;
}

export const useDealWizardStore = create<DealWizardState>()(
  persist(
    (set, get) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      updateStep1: (data) => set((state) => ({
        draft: state.draft ? { ...state.draft, ...data } : null
      })),
      updateStep2: (deliverables) => set((state) => ({
        draft: state.draft ? { ...state.draft, deliverables } : null
      })),
      updateStep3: (payments) => set((state) => ({
        draft: state.draft ? { ...state.draft, payments } : null
      })),
      setCurrentStep: (step) => set((state) => ({
        draft: state.draft ? { ...state.draft, currentStep: step } : null
      })),
      markStepComplete: (step) => set((state) => ({
        draft: state.draft ? {
          ...state.draft,
          completed: [...state.draft.completed, step]
        } : null
      })),
      clearDraft: () => set({ draft: null }),
    }),
    { name: 'deal-wizard-storage' }
  )
);
```

---

## Main Wizard Component

### `src/components/new-deal/DealWizard.tsx`

```typescript
import { useDealWizardStore } from '@/stores/dealWizardStore';
import Step1 from './step1-GeneralInfo';
import Step2 from './step2-Deliverables';
import Step3 from './step3-PaymentsLegal';
import Step4 from './step4-Review';
import { useDealsStore } from '@/stores/dealsStore';
import { dealSchema } from '@/lib/zod/schemas';

export function DealWizard() {
  const { draft, clearDraft } = useDealWizardStore();
  const { addDeal } = useDealsStore();

  const handleCreate = () => {
    const newDeal = {
      ...draft,
      id: crypto.randomUUID(),
      status: 'lead',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dealSchema.parse(newDeal); // Validate final deal
    addDeal(newDeal as any);
    clearDraft();
    // Navigate to Pipeline or DealDetail
  };

  return (
    <div className="wizard-container">
      {/* Step indicator */}
      {/* Current step component */}
      {/* Navigation buttons */}
    </div>
  );
}
```

---

## Component Structure

```
src/components/new-deal/
├── DealWizard.tsx (main container)
├── step1-GeneralInfo.tsx
├── step2-Deliverables.tsx
├── step3-PaymentsLegal.tsx
├── step4-Review.tsx
└── DeliverableItem.tsx (reusable)
```

---

## Navigation Integration

- `/deals/new` → New Deal Wizard
- FAB on Pipeline → Navigate to wizard
- "New Deal" button on Place/Contact detail → Navigate to wizard with pre-filled place/contact

---

## Dependencies
- Group A: Places & Contacts (for linking)
- Group B: Deals store (for creating deal)
- Zod schemas (✓ needs update)

---

## Integration Points

### Pre-fill Place/Contact
When creating deal from Place detail:
```typescript
// PlaceDetail.tsx
const navigate = useNavigate();
const handleNewDeal = (placeId: string) => {
  useDealWizardStore.getState().setDraft({
    placeId,
    currentStep: 1,
    completed: [],
    // other empty fields
  });
  navigate('/deals/new');
};
```

---

## Testing Checklist
- [ ] Wizard starts at step 1
- [ ] Each step validates correctly
- [ ] Can navigate back and forth
- [ ] Draft is saved after each step
- [ ] Draft is restored on revisit
- [ ] Can discard draft
- [ ] Step 2: Can add/edit/remove deliverables
- [ ] Step 3: Can input payment info
- [ ] Step 4: Shows correct summary
- [ ] Create button creates valid deal
- [ ] After creation, draft is cleared
- [ ] Pre-fill from Place/Contact works

---

## Estimated Time
- Step 1: 0.5 day
- Step 2: 0.5-1 day (CRUD complexity)
- Step 3: 0.25 day
- Step 4: 0.25 day
- Wizard container + draft persistence: 0.5 day
- **Total: 2 days**
