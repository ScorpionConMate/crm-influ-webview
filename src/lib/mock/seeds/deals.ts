import {
  createMockDeal,
  createMockDeliverable,
  createMockPayment,
} from "../mockDataFactory";
import { dealSchema, deliverableSchema, paymentInfoSchema } from "@/lib/zod/schemas";

/**
 * Mock deals data for deals store
 */
export const mockDeals = [
  // Lead deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-lead-1",
      title: "Social Media Campaign",
      status: "lead",
      estimatedValue: 8000,
      currency: "USD",
      startDate: new Date("2025-12-01T10:00:00Z"),
      endDate: new Date("2026-02-28T10:00:00Z"),
      notes: "Initial inquiry received via Instagram",
      createdAt: new Date("2025-11-28T09:00:00Z"),
      updatedAt: new Date("2026-01-05T14:30:00Z"),
    })
  ),
  dealSchema.parse(
    createMockDeal({
      id: "deal-lead-2",
      title: "Brand Ambassador Program",
      status: "lead",
      estimatedValue: 12000,
      currency: "USD",
      startDate: new Date("2025-12-10T11:00:00Z"),
      endDate: new Date("2026-06-30T11:00:00Z"),
      notes: "Long-term partnership opportunity",
      createdAt: new Date("2025-12-05T13:20:00Z"),
      updatedAt: new Date("2026-01-08T10:15:00Z"),
    })
  ),
  // Contacted deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-contacted-1",
      title: "Product Launch Campaign",
      status: "contacted",
      estimatedValue: 15000,
      currency: "USD",
      startDate: new Date("2025-11-15T09:30:00Z"),
      endDate: new Date("2026-03-15T09:30:00Z"),
      notes: "Initial meeting completed, sent proposal",
      createdAt: new Date("2025-11-10T14:00:00Z"),
      updatedAt: new Date("2026-01-10T16:45:00Z"),
    })
  ),
  // Negotiation deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-negotiation-1",
      title: "Monthly Content Package",
      status: "negotiation",
      estimatedValue: 6000,
      currency: "USD",
      startDate: new Date("2025-11-20T10:00:00Z"),
      endDate: new Date("2026-05-20T10:00:00Z"),
      notes: "Negotiating scope and deliverables",
      createdAt: new Date("2025-11-15T11:30:00Z"),
      updatedAt: new Date("2026-01-12T13:20:00Z"),
    })
  ),
  // Confirmed deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-confirmed-1",
      title: "Grand Opening Promotion",
      status: "confirmed",
      estimatedValue: 10000,
      actualValue: 9500,
      currency: "USD",
      startDate: new Date("2025-12-01T10:00:00Z"),
      endDate: new Date("2026-01-31T10:00:00Z"),
      notes: "Contract signed, awaiting kickoff",
      createdAt: new Date("2025-11-20T15:00:00Z"),
      updatedAt: new Date("2026-01-14T09:10:00Z"),
    })
  ),
  dealSchema.parse(
    createMockDeal({
      id: "deal-confirmed-2",
      title: "Holiday Season Campaign",
      status: "confirmed",
      estimatedValue: 7500,
      actualValue: 7200,
      currency: "USD",
      startDate: new Date("2025-12-15T10:00:00Z"),
      endDate: new Date("2026-01-15T10:00:00Z"),
      notes: "In progress, first deliverable scheduled",
      createdAt: new Date("2025-12-10T12:30:00Z"),
      updatedAt: new Date("2026-01-13T14:20:00Z"),
    })
  ),
  // Delivered deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-delivered-1",
      title: "Summer Fitness Challenge",
      status: "delivered",
      estimatedValue: 9000,
      actualValue: 8500,
      currency: "USD",
      startDate: new Date("2025-06-01T10:00:00Z"),
      endDate: new Date("2025-08-31T10:00:00Z"),
      notes: "All content delivered, awaiting payment",
      createdAt: new Date("2025-05-25T09:00:00Z"),
      updatedAt: new Date("2025-09-01T16:00:00Z"),
    })
  ),
  // Paid deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-paid-1",
      title: "Spring Restaurant Promo",
      status: "paid",
      estimatedValue: 5000,
      actualValue: 5000,
      currency: "USD",
      startDate: new Date("2025-03-01T10:00:00Z"),
      endDate: new Date("2025-05-31T10:00:00Z"),
      notes: "Completed successfully, client happy",
      createdAt: new Date("2025-02-25T11:15:00Z"),
      updatedAt: new Date("2025-06-15T10:30:00Z"),
    })
  ),
  dealSchema.parse(
    createMockDeal({
      id: "deal-paid-2",
      title: "Coffee Shop Rebrand",
      status: "paid",
      estimatedValue: 3500,
      actualValue: 3200,
      currency: "USD",
      startDate: new Date("2025-04-10T10:00:00Z"),
      endDate: new Date("2025-06-10T10:00:00Z"),
      notes: "Quick turnaround project",
      createdAt: new Date("2025-04-05T14:20:00Z"),
      updatedAt: new Date("2025-06-20T13:45:00Z"),
    })
  ),
  // Lost deals
  dealSchema.parse(
    createMockDeal({
      id: "deal-lost-1",
      title: "Tech Startup Launch",
      status: "lost",
      estimatedValue: 12000,
      lostReason: "Client went with competitor",
      currency: "USD",
      startDate: new Date("2025-09-01T10:00:00Z"),
      endDate: new Date("2025-11-30T10:00:00Z"),
      notes: "Good relationship maintained for future opportunities",
      createdAt: new Date("2025-08-25T09:30:00Z"),
      updatedAt: new Date("2025-11-15T15:20:00Z"),
    })
  ),
];

/**
 * Mock deliverables data
 */
export const mockDeliverables = [
  deliverableSchema.parse(
    createMockDeliverable({
      id: "deliv-1",
      dealId: "deal-confirmed-1",
      type: "post",
      description: "Instagram carousel showcasing restaurant dishes",
      quantity: 3,
      dueDate: new Date("2026-01-20T10:00:00Z"),
      completedDate: undefined,
      notes: "High-quality food photography required",
      createdAt: new Date("2025-12-15T10:00:00Z"),
    })
  ),
  deliverableSchema.parse(
    createMockDeliverable({
      id: "deliv-2",
      dealId: "deal-confirmed-1",
      type: "story",
      description: "Instagram stories from grand opening event",
      quantity: 5,
      dueDate: new Date("2026-01-25T10:00:00Z"),
      completedDate: undefined,
      notes: "Include behind-the-scenes content",
      createdAt: new Date("2025-12-15T10:00:00Z"),
    })
  ),
  deliverableSchema.parse(
    createMockDeliverable({
      id: "deliv-3",
      dealId: "deal-confirmed-1",
      type: "reel",
      description: "Short-form video content for TikTok and Reels",
      quantity: 2,
      dueDate: new Date("2026-01-30T10:00:00Z"),
      completedDate: undefined,
      notes: "Trending audio, 15-30 seconds each",
      createdAt: new Date("2025-12-15T10:00:00Z"),
    })
  ),
  deliverableSchema.parse(
    createMockDeliverable({
      id: "deliv-4",
      dealId: "deal-paid-1",
      type: "post",
      description: "Spring menu announcement post",
      quantity: 1,
      dueDate: new Date("2025-03-15T10:00:00Z"),
      completedDate: new Date("2025-03-14T10:00:00Z"),
      notes: "Completed on schedule",
      createdAt: new Date("2025-02-28T10:00:00Z"),
    })
  ),
  deliverableSchema.parse(
    createMockDeliverable({
      id: "deliv-5",
      dealId: "deal-paid-1",
      type: "video",
      description: "Behind-the-scenes kitchen tour",
      quantity: 1,
      dueDate: new Date("2025-04-01T10:00:00Z"),
      completedDate: new Date("2025-04-02T10:00:00Z"),
      notes: "YouTube format, 3-5 minutes",
      createdAt: new Date("2025-02-28T10:00:00Z"),
    })
  ),
];

/**
 * Mock payments data
 */
export const mockPayments = [
  paymentInfoSchema.parse(
    createMockPayment({
      id: "pay-1",
      dealId: "deal-confirmed-1",
      amount: 4750,
      currency: "USD",
      method: "transfer",
      status: "pending",
      dueDate: new Date("2026-02-01T10:00:00Z"),
      paidDate: undefined,
      invoiceNumber: "INV-2026-001",
      terms: "50% upfront, 50% on completion",
      createdAt: new Date("2025-12-20T10:00:00Z"),
    })
  ),
  paymentInfoSchema.parse(
    createMockPayment({
      id: "pay-2",
      dealId: "deal-paid-1",
      amount: 2500,
      currency: "USD",
      method: "stripe",
      status: "paid",
      dueDate: new Date("2025-04-01T10:00:00Z"),
      paidDate: new Date("2025-04-01T14:30:00Z"),
      invoiceNumber: "INV-2025-005",
      terms: "Net 15",
      createdAt: new Date("2025-03-01T10:00:00Z"),
    })
  ),
  paymentInfoSchema.parse(
    createMockPayment({
      id: "pay-3",
      dealId: "deal-paid-1",
      amount: 2500,
      currency: "USD",
      method: "stripe",
      status: "paid",
      dueDate: new Date("2025-06-15T10:00:00Z"),
      paidDate: new Date("2025-06-14T16:20:00Z"),
      invoiceNumber: "INV-2025-008",
      terms: "Net 30",
      createdAt: new Date("2025-05-01T10:00:00Z"),
    })
  ),
  paymentInfoSchema.parse(
    createMockPayment({
      id: "pay-4",
      dealId: "deal-delivered-1",
      amount: 4250,
      currency: "USD",
      method: "transfer",
      status: "overdue",
      dueDate: new Date("2025-09-15T10:00:00Z"),
      paidDate: undefined,
      invoiceNumber: "INV-2025-012",
      terms: "Net 15",
      createdAt: new Date("2025-09-01T10:00:00Z"),
    })
  ),
];
