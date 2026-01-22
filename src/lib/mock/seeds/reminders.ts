import { createMockReminder } from "../mockDataFactory";
import { reminderSchema } from "@/lib/zod/schemas";

/**
 * Mock reminders data for reminders store
 */
export const mockReminders = [
  // High priority reminders
  reminderSchema.parse(
    createMockReminder({
      id: "rem-1",
      title: "Follow up with Savor Kitchen",
      description: "Send revised proposal with updated pricing",
      dueDate: new Date("2026-01-23T10:00:00Z"),
      completed: false,
      priority: "high",
      placeId: "place-1",
      contactId: "contact-1",
      dealId: "deal-confirmed-1",
      createdAt: new Date("2026-01-14T09:00:00Z"),
      updatedAt: new Date("2026-01-14T09:00:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-2",
      title: "Prepare invoice for Grand Opening campaign",
      description: "Final deliverables completed, send invoice",
      dueDate: new Date("2026-01-24T14:00:00Z"),
      completed: false,
      priority: "high",
      placeId: "place-6",
      dealId: "deal-delivered-1",
      createdAt: new Date("2026-01-14T10:30:00Z"),
      updatedAt: new Date("2026-01-14T10:30:00Z"),
    })
  ),
  // Medium priority reminders
  reminderSchema.parse(
    createMockReminder({
      id: "rem-3",
      title: "Monthly check-in with FitLife Gym",
      description: "See if they're interested in a spring campaign",
      dueDate: new Date("2026-01-25T11:00:00Z"),
      completed: false,
      priority: "medium",
      placeId: "place-2",
      contactId: "contact-2",
      createdAt: new Date("2026-01-15T08:00:00Z"),
      updatedAt: new Date("2026-01-15T08:00:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-4",
      title: "Schedule content creation day",
      description: "Block out time for next week's content",
      dueDate: new Date("2026-01-26T09:00:00Z"),
      completed: false,
      priority: "medium",
      createdAt: new Date("2026-01-15T12:00:00Z"),
      updatedAt: new Date("2026-01-15T12:00:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-5",
      title: "Send holiday package proposal",
      description: "For new restaurant client interested in Q2",
      dueDate: new Date("2026-01-27T15:00:00Z"),
      completed: false,
      priority: "medium",
      placeId: "place-3",
      contactId: "contact-3",
      dealId: "deal-lead-2",
      createdAt: new Date("2026-01-16T14:00:00Z"),
      updatedAt: new Date("2026-01-16T14:00:00Z"),
    })
  ),
  // Low priority reminders
  reminderSchema.parse(
    createMockReminder({
      id: "rem-6",
      title: "Update portfolio with recent work",
      description: "Add completed campaigns to website",
      dueDate: new Date("2026-01-30T10:00:00Z"),
      completed: false,
      priority: "low",
      createdAt: new Date("2026-01-14T16:00:00Z"),
      updatedAt: new Date("2026-01-14T16:00:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-7",
      title: "Research new trending content formats",
      description: "Stay ahead of social media trends",
      dueDate: new Date("2026-01-31T11:00:00Z"),
      completed: false,
      priority: "low",
      createdAt: new Date("2026-01-17T09:30:00Z"),
      updatedAt: new Date("2026-01-17T09:30:00Z"),
    })
  ),
  // Completed reminders
  reminderSchema.parse(
    createMockReminder({
      id: "rem-8",
      title: "Follow up on overdue payment",
      description: "Send reminder for Summer Fitness Challenge",
      dueDate: new Date("2026-01-18T10:00:00Z"),
      completed: true,
      completedDate: new Date("2026-01-18T14:30:00Z"),
      priority: "high",
      placeId: "place-2",
      dealId: "deal-delivered-1",
      createdAt: new Date("2026-01-16T09:00:00Z"),
      updatedAt: new Date("2026-01-18T14:30:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-9",
      title: "Resend contract for Monthly Content Package",
      description: "Client lost original email",
      dueDate: new Date("2026-01-17T11:00:00Z"),
      completed: true,
      completedDate: new Date("2026-01-17T13:20:00Z"),
      priority: "medium",
      placeId: "place-5",
      dealId: "deal-negotiation-1",
      createdAt: new Date("2026-01-15T10:00:00Z"),
      updatedAt: new Date("2026-01-17T13:20:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-10",
      title: "Send thank you note to Morning Brew Cafe",
      description: "Great collaboration on recent campaign",
      dueDate: new Date("2026-01-19T09:00:00Z"),
      completed: true,
      completedDate: new Date("2026-01-19T10:15:00Z"),
      priority: "low",
      placeId: "place-3",
      contactId: "contact-3",
      dealId: "deal-paid-2",
      createdAt: new Date("2026-01-14T15:00:00Z"),
      updatedAt: new Date("2026-01-19T10:15:00Z"),
    })
  ),
  // Future reminders (beyond 7 days)
  reminderSchema.parse(
    createMockReminder({
      id: "rem-11",
      title: "Q2 planning session",
      description: "Plan campaigns for second quarter",
      dueDate: new Date("2026-02-10T10:00:00Z"),
      completed: false,
      priority: "high",
      createdAt: new Date("2026-01-14T11:00:00Z"),
      updatedAt: new Date("2026-01-14T11:00:00Z"),
    })
  ),
  reminderSchema.parse(
    createMockReminder({
      id: "rem-12",
      title: "Annual client review meetings",
      description: "Schedule reviews with long-term clients",
      dueDate: new Date("2026-02-15T11:00:00Z"),
      completed: false,
      priority: "medium",
      createdAt: new Date("2026-01-15T13:00:00Z"),
      updatedAt: new Date("2026-01-15T13:00:00Z"),
    })
  ),
];
