import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().min(1),
  plan: z.enum(["free", "pro", "enterprise"]),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const placeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  category: z.string().min(1).optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Place = z.infer<typeof placeSchema>;

export const contactSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Contact = z.infer<typeof contactSchema>;

export const dealStatusSchema = z.enum([
  "lead",
  "contacted",
  "negotiation",
  "confirmed",
  "delivered",
  "paid",
  "lost",
]);

export type DealStatus = z.infer<typeof dealStatusSchema>;

export const deliverableSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  type: z.enum(["post", "story", "reel", "video", "other"]),
  description: z.string().min(1),
  quantity: z.number().min(1).default(1),
  dueDate: z.date().optional(),
  completedDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
});

export type Deliverable = z.infer<typeof deliverableSchema>;

export const paymentInfoSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  amount: z.number().min(0),
  currency: z.string().default("USD"),
  method: z.enum(["cash", "transfer", "paypal", "stripe", "other"]),
  status: z.enum(["pending", "paid", "overdue"]),
  dueDate: z.date().optional(),
  paidDate: z.date().optional(),
  invoiceNumber: z.string().optional(),
  terms: z.string().optional(),
  createdAt: z.date(),
});

export type PaymentInfo = z.infer<typeof paymentInfoSchema>;

export const dealSchema = z.object({
  id: z.string(),
  placeId: z.string().optional(),
  contactId: z.string().optional(),
  title: z.string().min(1),
  status: dealStatusSchema,
  estimatedValue: z.number().min(0).optional(),
  actualValue: z.number().min(0).optional(),
  currency: z.string().default("USD"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  lostReason: z.string().optional(),
  notes: z.string().optional(),
  deliverables: z.array(deliverableSchema).default([]),
  payments: z.array(paymentInfoSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Deal = z.infer<typeof dealSchema>;

export const reminderSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.date(),
  completed: z.boolean().default(false),
  completedDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  placeId: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  visitId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reminder = z.infer<typeof reminderSchema>;

export const voiceMemoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  duration: z.number().min(0),
  timestamp: z.date(),
  visitId: z.string().optional(),
});

export type VoiceMemo = z.infer<typeof voiceMemoSchema>;

export const photoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  timestamp: z.date(),
});

export type Photo = z.infer<typeof photoSchema>;

export const visitSchema = z.object({
  id: z.string(),
  placeId: z.string(),
  dealId: z.string().optional(),
  startTime: z.date(),
  endTime: z.date().optional(),
  notes: z.array(z.string()).default([]),
  voiceMemos: z.array(voiceMemoSchema).default([]),
  photos: z.array(photoSchema).default([]),
  summary: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Visit = z.infer<typeof visitSchema>;

export const timelineEventTypeSchema = z.enum([
  "deal_created",
  "deal_status_changed",
  "reminder_created",
  "reminder_completed",
  "visit_started",
  "visit_ended",
  "deliverable_added",
  "deliverable_completed",
  "payment_added",
  "payment_completed",
  "note_added",
]);

export const timelineEventSchema = z.object({
  id: z.string(),
  type: timelineEventTypeSchema,
  entityId: z.string(),
  entityType: z.enum(["deal", "place", "contact", "reminder", "visit"]),
  title: z.string().min(1),
  description: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type TimelineEventType = z.infer<typeof timelineEventTypeSchema>;

export const placeContactLinkSchema = z.object({
  placeId: z.string(),
  contactId: z.string(),
  role: z.string().optional(),
  createdAt: z.date(),
});

export type PlaceContactLink = z.infer<typeof placeContactLinkSchema>;
