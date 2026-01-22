import {
  type User,
  type Contact,
  type Place,
  type Deal,
  type DealStatus,
  type Deliverable,
  type PaymentInfo,
  type Reminder,
  type Visit,
  type VoiceMemo,
  type Photo,
  type PlaceContactLink,
} from "@/lib/zod/schemas";

// Helper functions
function generateId(): string {
  return crypto.randomUUID();
}

function generateDate(daysOffset = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
}

function generateFutureDate(daysFromNow: number): Date {
  return generateDate(daysFromNow);
}

function generatePastDate(daysAgo: number): Date {
  return generateDate(-daysAgo);
}

// ============================================================================
// MOCK DATA FACTORY FUNCTIONS
// ============================================================================

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: generateId(),
    email: "john.doe@example.com",
    name: "John Doe",
    plan: "pro",
    avatarUrl: "https://i.pravatar.cc/150?u=johndoe",
    createdAt: generatePastDate(365),
    ...overrides,
  };
}

export function createMockContact(overrides: Partial<Contact> = {}): Contact {
  const roles = ["Manager", "Owner", "Marketing", "Sales", "HR", "Coordinator"];
  return {
    id: generateId(),
    name: "Jane Smith",
    role: roles[Math.floor(Math.random() * roles.length)],
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    instagram: "@janesmith",
    notes: "",
    createdAt: generatePastDate(180),
    updatedAt: generateDate(-7),
    ...overrides,
  };
}

export function createMockPlace(overrides: Partial<Place> = {}): Place {
  const categories = ["Restaurant", "Retail", "Gym", "Cafe", "Hotel", "Bar", "Wellness", "Tech"];
  const cities = ["San Francisco", "New York", "Los Angeles", "Chicago", "Miami"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  return {
    id: generateId(),
    name: `${category} ${Math.floor(Math.random() * 100) + 1}`,
    address: `${Math.floor(Math.random() * 900) + 100} Main Street`,
    city,
    category,
    website: `https://example.com`,
    phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    instagram: `@${category.toLowerCase().replace(/\s/g, "")}`,
    notes: "",
    createdAt: generatePastDate(200),
    updatedAt: generateDate(-14),
    ...overrides,
  };
}

export function createMockDeal(overrides: Partial<Deal> = {}): Deal {
  const statuses: DealStatus[] = ["lead", "contacted", "negotiation", "confirmed", "delivered", "paid", "lost"];
  const status = overrides.status ?? statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: generateId(),
    placeId: overrides.placeId ?? generateId(),
    contactId: overrides.contactId ?? generateId(),
    title: "Sponsored Content Campaign",
    status,
    estimatedValue: 5000 + Math.floor(Math.random() * 10000),
    actualValue: status === "paid" ? 5000 + Math.floor(Math.random() * 10000) : undefined,
    currency: "USD",
    startDate: generatePastDate(30),
    endDate: generateFutureDate(30),
    lostReason: status === "lost" ? "Budget constraints" : undefined,
    notes: "",
    deliverables: [],
    payments: [],
    createdAt: generatePastDate(45),
    updatedAt: generateDate(-3),
    ...overrides,
  };
}

export function createMockDeliverable(overrides: Partial<Deliverable> = {}): Deliverable {
  const types = ["post", "story", "reel", "video", "other"] as const;
  return {
    id: generateId(),
    dealId: overrides.dealId ?? generateId(),
    type: types[Math.floor(Math.random() * types.length)],
    description: "Instagram post with product feature",
    quantity: 1,
    dueDate: generateFutureDate(7),
    completedDate: undefined,
    notes: "",
    createdAt: generateDate(-5),
    ...overrides,
  };
}

export function createMockPayment(overrides: Partial<PaymentInfo> = {}): PaymentInfo {
  const methods = ["cash", "transfer", "paypal", "stripe", "other"] as const;
  const statuses = ["pending", "paid", "overdue"] as const;
  return {
    id: generateId(),
    dealId: overrides.dealId ?? generateId(),
    amount: 1000 + Math.floor(Math.random() * 5000),
    currency: "USD",
    method: methods[Math.floor(Math.random() * methods.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dueDate: generateFutureDate(14),
    paidDate: undefined,
    invoiceNumber: `INV-${Date.now()}`,
    terms: "Net 30",
    createdAt: generateDate(-10),
    ...overrides,
  };
}

export function createMockReminder(overrides: Partial<Reminder> = {}): Reminder {
  const priorities = ["low", "medium", "high"] as const;
  return {
    id: generateId(),
    title: "Follow up with client",
    description: "Send proposal and schedule meeting",
    dueDate: generateFutureDate(7),
    completed: false,
    completedDate: undefined,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    placeId: overrides.placeId ?? generateId(),
    contactId: overrides.contactId ?? generateId(),
    dealId: overrides.dealId ?? generateId(),
    visitId: undefined,
    createdAt: generateDate(-2),
    updatedAt: generateDate(-1),
    ...overrides,
  };
}

export function createMockVisit(overrides: Partial<Visit> = {}): Visit {
  const startTime = generatePastDate(5);
  return {
    id: generateId(),
    placeId: overrides.placeId ?? generateId(),
    dealId: overrides.dealId ?? generateId(),
    startTime,
    endTime: overrides.endTime ?? new Date(startTime.getTime() + 3600000), // 1 hour later
    notes: [],
    voiceMemos: [],
    photos: [],
    summary: "",
    createdAt: startTime,
    updatedAt: startTime,
    ...overrides,
  };
}

export function createMockVoiceMemo(overrides: Partial<VoiceMemo> = {}): VoiceMemo {
  return {
    id: generateId(),
    url: "https://example.com/audio/memo.mp3",
    duration: 60,
    timestamp: new Date(),
    visitId: overrides.visitId ?? generateId(),
    ...overrides,
  };
}

export function createMockPhoto(overrides: Partial<Photo> = {}): Photo {
  return {
    id: generateId(),
    url: "https://example.com/images/photo.jpg",
    timestamp: new Date(),
    ...overrides,
  };
}

export function createMockPlaceContactLink(overrides: Partial<PlaceContactLink> = {}): PlaceContactLink {
  return {
    placeId: overrides.placeId ?? generateId(),
    contactId: overrides.contactId ?? generateId(),
    role: "Manager",
    createdAt: generatePastDate(90),
    ...overrides,
  };
}
