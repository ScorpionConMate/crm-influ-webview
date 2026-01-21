import { isToday, isPast } from "date-fns";

/**
 * Calendar event types representing different kinds of scheduled items
 */
export const EventType = {
  MEETING: "meeting",
  DELIVERABLE: "deliverable",
  REMINDER: "reminder",
  VISIT: "visit",
  ADMIN: "admin",
  DEAL: "deal",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

/**
 * Event status based on date completion state
 */
export const EventStatus = {
  UPCOMING: "upcoming",
  TODAY: "today",
  PAST: "past",
  COMPLETED: "completed",
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time?: Date | string; // Specific time if applicable
  status: EventStatus;
  entityId: string;
  entityType: "reminder" | "visit" | "deal" | "deliverable" | "payment";
  priority?: "low" | "medium" | "high";
  metadata?: Record<string, unknown>;
}

/**
 * Color mapping for event types (matches artifact design)
 */
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  [EventType.MEETING]: "primary", // Blue/primary color
  [EventType.DELIVERABLE]: "orange", // Orange for deliverables
  [EventType.REMINDER]: "purple", // Purple for reminders
  [EventType.VISIT]: "primary", // Blue/primary for visits
  [EventType.ADMIN]: "gray", // Gray for admin tasks
  [EventType.DEAL]: "primary", // Blue/primary for deals
};

/**
 * Priority order for sorting (higher = more important)
 */
export const EVENT_PRIORITY_ORDER: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
  undefined: 0,
};

/**
 * Determine event status based on date and completion state
 */
export function getEventStatus(date: Date, isCompleted: boolean): EventStatus {
  if (isCompleted) {
    return EventStatus.COMPLETED;
  }
  if (isToday(date)) {
    return EventStatus.TODAY;
  }
  if (isPast(date)) {
    return EventStatus.PAST;
  }
  return EventStatus.UPCOMING;
}

/**
 * Format time for display
 */
export function formatEventTime(time?: Date | string): string | undefined {
  if (!time) {
    return undefined;
  }
  if (typeof time === "string") {
    return time;
  }
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
