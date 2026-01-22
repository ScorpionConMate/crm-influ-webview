# Mock Data System

Comprehensive mock data for testing all CRM flows without backend connection.

## Quick Start

```typescript
import { seedAllStores } from "@/lib/mock";

// Seed all stores with one function call
seedAllStores();
```

## Usage Examples

### Seed All Stores

```typescript
import { seedAllStores } from "@/lib/mock";

seedAllStores();
// All stores now populated with realistic mock data
```

### Seed Individual Stores

```typescript
import {
  seedContactsStore,
  seedDealsStore,
  seedPlacesStore,
} from "@/lib/mock";

// Seed specific stores only
seedContactsStore();
seedPlacesStore();
seedDealsStore();
```

### Create Custom Mock Data

```typescript
import {
  createMockContact,
  createMockDeal,
  createMockPlace,
} from "@/lib/mock";

// Create a custom contact
const customContact = createMockContact({
  name: "John Smith",
  role: "CEO",
  email: "john.smith@example.com",
});

// Create a custom deal
const customDeal = createMockDeal({
  title: "Custom Campaign",
  status: "confirmed",
  estimatedValue: 10000,
});

// Create a custom place
const customPlace = createMockPlace({
  name: "My Business",
  city: "San Francisco",
  category: "Restaurant",
});

// Add to store
import { useContactsStore } from "@/stores/contactsStore";
useContactsStore.getState().addContact(customContact);
```

### Access Mock Data Directly

```typescript
import { mockData } from "@/lib/mock";

// Access any mock data array
console.log(mockData.contacts);      // All mock contacts
console.log(mockData.deals);         // All mock deals
console.log(mockData.places);        // All mock places
console.log(mockData.visits);        // All mock visits
console.log(mockData.reminders);     // All mock reminders
```

### Clear/Reset Stores

```typescript
import {
  clearAllStores,
  resetAllStores,
  clearContactsStore,
} from "@/lib/mock";

// Clear all stores (reset to empty)
clearAllStores();

// Reset all stores (clear and re-seed)
resetAllStores();

// Clear specific store
clearContactsStore();
```

### Create Test Scenarios

```typescript
import {
  createMockContact,
  createMockDeal,
  createMockReminder,
} from "@/lib/mock";
import { useContactsStore, useDealsStore, useRemindersStore } from "@/stores";

// Test scenario: Urgent deadline
const urgentContact = createMockContact({
  name: "Urgent Client",
});

const urgentDeal = createMockDeal({
  title: "Urgent Campaign",
  status: "negotiation",
  estimatedValue: 15000,
});

const urgentReminder = createMockReminder({
  title: "Follow up urgently",
  priority: "high",
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  contactId: urgentContact.id,
  dealId: urgentDeal.id,
});

useContactsStore.getState().addContact(urgentContact);
useDealsStore.getState().addDeal(urgentDeal);
useRemindersStore.getState().addReminder(urgentReminder);
```

## Available Functions

### Seeding Functions

- `seedAllStores()` - Seed all stores at once
- `seedAuthStore()` - Seed auth store
- `seedContactsStore()` - Seed contacts store
- `seedPlacesStore()` - Seed places store
- `seedDealsStore()` - Seed deals store
- `seedDealDetailsStore()` - Seed deliverables and payments
- `seedVisitsStore()` - Seed visits (including photos & voice memos)
- `seedRemindersStore()` - Seed reminders store
- `seedPlaceContactLinks()` - Seed place-contact links

### Clearing Functions

- `clearAllStores()` - Clear all stores
- `clearAuthStore()` - Clear auth store
- `clearContactsStore()` - Clear contacts store
- `clearPlacesStore()` - Clear places store
- `clearDealsStore()` - Clear deals store
- `clearDealDetailsStore()` - Clear deal details store
- `clearVisitsStore()` - Clear visits store
- `clearRemindersStore()` - Clear reminders store

### Reset Functions

- `resetAllStores()` - Clear and re-seed all stores

### Factory Functions

- `createMockUser(overrides?)` - Create mock user
- `createMockContact(overrides?)` - Create mock contact
- `createMockPlace(overrides?)` - Create mock place
- `createMockDeal(overrides?)` - Create mock deal
- `createMockDeliverable(overrides?)` - Create mock deliverable
- `createMockPayment(overrides?)` - Create mock payment
- `createMockReminder(overrides?)` - Create mock reminder
- `createMockVisit(overrides?)` - Create mock visit
- `createMockVoiceMemo(overrides?)` - Create mock voice memo
- `createMockPhoto(overrides?)` - Create mock photo
- `createMockPlaceContactLink(overrides?)` - Create mock place-contact link

## Mock Data Summary

| Entity | Count | Status Coverage | Notes |
|--------|-------|-----------------|-------|
| Users | 3 | free, pro, enterprise | Demo, free, enterprise users |
| Contacts | 10 | - | Various roles and contact info |
| Places | 8 | 8 categories | Restaurant, Gym, Cafe, Retail, Tech, Hotel, Bar, Wellness |
| Deals | 10 | All 7 statuses | lead, contacted, negotiation, confirmed, delivered, paid, lost |
| Deliverables | 5 | post, story, reel, video | Various statuses |
| Payments | 4 | pending, paid, overdue | Different methods and statuses |
| Visits | 7 | Completed visits | With notes, photos, voice memos |
| Voice Memos | 2 | - | Attached to visits |
| Photos | 5 | - | Attached to visits |
| Reminders | 12 | High, Medium, Low | Completed and pending, various due dates |

## Data Relationships

All mock data maintains realistic relationships:
- Deals reference places and contacts
- Deliverables reference deals
- Payments reference deals
- Visits reference places and optionally deals
- Reminders reference places, contacts, deals, or visits
- Place-contact links connect contacts to places

## Testing Scenarios

The mock data includes test scenarios for:
- ✅ Complete deal lifecycle (lead → paid)
- ✅ Different deal statuses (all 7 statuses)
- ✅ Active negotiations and follow-ups
- ✅ Overdue payments
- ✅ Completed and pending reminders
- ✅ Visit history with various outcomes
- ✅ Multi-contact places
- ✅ Urgent deadlines

## Development

To add new mock data:

1. Create factory function in `mockDataFactory.ts`
2. Add seed data to appropriate file in `seeds/`
3. Update `seedStores.ts` to include new data
4. Update this README with new entity info

## Type Safety

All mock data is validated against Zod schemas, ensuring type safety and data integrity.
