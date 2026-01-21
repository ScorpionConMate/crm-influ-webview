import { isSameDay, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { useRemindersStore } from "@/stores/remindersStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { useDealsStore } from "@/stores/dealsStore";
import { type Reminder, type Visit, type Deal, type Deliverable, type PaymentInfo } from "@/lib/zod/schemas";
import {
  type CalendarEvent,
  EventType,
  getEventStatus,
  EVENT_PRIORITY_ORDER,
} from "./eventTypes";

/**
 * Map a Reminder entity to a CalendarEvent
 */
export function mapReminderToEvent(reminder: Reminder): CalendarEvent {
  return {
    id: reminder.id,
    title: reminder.title,
    type: EventType.REMINDER,
    date: reminder.dueDate,
    time: reminder.dueDate,
    status: getEventStatus(reminder.dueDate, reminder.completed),
    entityId: reminder.id,
    entityType: "reminder",
    priority: reminder.priority,
    metadata: {
      description: reminder.description,
      placeId: reminder.placeId,
      contactId: reminder.contactId,
      dealId: reminder.dealId,
      visitId: reminder.visitId,
    },
  };
}

/**
 * Map a Visit entity to a CalendarEvent
 */
export function mapVisitToEvent(visit: Visit): CalendarEvent {
  return {
    id: visit.id,
    title: "Visit",
    type: EventType.VISIT,
    date: visit.startTime,
    time: visit.startTime,
    status: getEventStatus(visit.startTime, visit.endTime !== undefined),
    entityId: visit.id,
    entityType: "visit",
    metadata: {
      placeId: visit.placeId,
      dealId: visit.dealId,
      endTime: visit.endTime,
      notesCount: visit.notes.length,
      summary: visit.summary,
    },
  };
}

/**
 * Map a Deliverable entity to a CalendarEvent
 */
export function mapDeliverableToEvent(deliverable: Deliverable, dealTitle?: string): CalendarEvent {
  const title = dealTitle ? `${deliverable.type} - ${dealTitle}` : deliverable.type;
  return {
    id: deliverable.id,
    title: deliverable.description || title,
    type: EventType.DELIVERABLE,
    date: deliverable.dueDate || new Date(), // Fallback to today if no due date
    time: deliverable.dueDate,
    status: getEventStatus(deliverable.dueDate || new Date(), deliverable.completedDate !== undefined),
    entityId: deliverable.id,
    entityType: "deliverable",
    priority: "medium", // Default priority for deliverables
    metadata: {
      dealId: deliverable.dealId,
      deliverableType: deliverable.type,
      quantity: deliverable.quantity,
      dealTitle,
    },
  };
}

/**
 * Map a Deal entity to a CalendarEvent (uses startDate as the event date)
 */
export function mapDealToEvent(deal: Deal): CalendarEvent {
  return {
    id: deal.id,
    title: deal.title,
    type: EventType.DEAL,
    date: deal.startDate || new Date(),
    time: deal.startDate,
    status: getEventStatus(deal.startDate || new Date(), false),
    entityId: deal.id,
    entityType: "deal",
    metadata: {
      status: deal.status,
      placeId: deal.placeId,
      contactId: deal.contactId,
      estimatedValue: deal.estimatedValue,
      endDate: deal.endDate,
    },
  };
}

/**
 * Map a PaymentInfo entity to a CalendarEvent
 */
export function mapPaymentToEvent(payment: PaymentInfo, dealTitle?: string): CalendarEvent {
  const title = dealTitle ? `Payment - ${dealTitle}` : "Payment";
  return {
    id: payment.id,
    title: `${title} (${payment.currency}${payment.amount})`,
    type: EventType.ADMIN,
    date: payment.dueDate || new Date(),
    time: payment.dueDate,
    status: getEventStatus(
      payment.dueDate || new Date(),
      payment.status === "paid"
    ),
    entityId: payment.id,
    entityType: "payment",
    priority: payment.status === "overdue" ? "high" : "medium",
    metadata: {
      dealId: payment.dealId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      invoiceNumber: payment.invoiceNumber,
      dealTitle,
    },
  };
}

/**
 * Get all events for a specific date by querying all stores
 */
export function getAllEventsForDate(date: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Get reminders for the date
  const remindersStore = useRemindersStore.getState();
  const reminders = remindersStore.reminders.filter((reminder) =>
    isSameDay(reminder.dueDate, date)
  );
  reminders.forEach((reminder) => {
    events.push(mapReminderToEvent(reminder));
  });

  // Get visits for the date
  const visitsStore = useVisitsStore.getState();
  const visits = visitsStore.visits.filter((visit) =>
    isSameDay(visit.startTime, date)
  );
  visits.forEach((visit) => {
    events.push(mapVisitToEvent(visit));
  });

  // Get deals for the date (by startDate)
  const dealsStore = useDealsStore.getState();
  const deals = dealsStore.deals.filter((deal) =>
    deal.startDate ? isSameDay(deal.startDate, date) : false
  );
  deals.forEach((deal) => {
    events.push(mapDealToEvent(deal));
  });

  // Get deliverables for the date (nested in deals)
  dealsStore.deals.forEach((deal) => {
    const dealDeliverables = deal.deliverables.filter((deliverable) =>
      deliverable.dueDate ? isSameDay(deliverable.dueDate, date) : false
    );
    dealDeliverables.forEach((deliverable) => {
      events.push(mapDeliverableToEvent(deliverable, deal.title));
    });
  });

  // Get payments for the date (nested in deals)
  dealsStore.deals.forEach((deal) => {
    const dealPayments = deal.payments.filter((payment) =>
      payment.dueDate ? isSameDay(payment.dueDate, date) : false
    );
    dealPayments.forEach((payment) => {
      events.push(mapPaymentToEvent(payment, deal.title));
    });
  });

  return events;
}

/**
 * Get all events for a specific month
 */
export function getAllEventsForMonth(date: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  // Get reminders for the month
  const remindersStore = useRemindersStore.getState();
  const reminders = remindersStore.reminders.filter((reminder) =>
    isWithinInterval(reminder.dueDate, { start: monthStart, end: monthEnd })
  );
  reminders.forEach((reminder) => {
    events.push(mapReminderToEvent(reminder));
  });

  // Get visits for the month
  const visitsStore = useVisitsStore.getState();
  const visits = visitsStore.visits.filter((visit) =>
    isWithinInterval(visit.startTime, { start: monthStart, end: monthEnd })
  );
  visits.forEach((visit) => {
    events.push(mapVisitToEvent(visit));
  });

  // Get deals for the month
  const dealsStore = useDealsStore.getState();
  const deals = dealsStore.deals.filter((deal) =>
    deal.startDate ? isWithinInterval(deal.startDate, { start: monthStart, end: monthEnd }) : false
  );
  deals.forEach((deal) => {
    events.push(mapDealToEvent(deal));
  });

  // Get deliverables for the month
  dealsStore.deals.forEach((deal) => {
    const dealDeliverables = deal.deliverables.filter((deliverable) =>
      deliverable.dueDate
        ? isWithinInterval(deliverable.dueDate, { start: monthStart, end: monthEnd })
        : false
    );
    dealDeliverables.forEach((deliverable) => {
      events.push(mapDeliverableToEvent(deliverable, deal.title));
    });
  });

  // Get payments for the month
  dealsStore.deals.forEach((deal) => {
    const dealPayments = deal.payments.filter((payment) =>
      payment.dueDate
        ? isWithinInterval(payment.dueDate, { start: monthStart, end: monthEnd })
        : false
    );
    dealPayments.forEach((payment) => {
      events.push(mapPaymentToEvent(payment, deal.title));
    });
  });

  return events;
}

/**
 * Sort events by time, then by priority
 */
export function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    // First, compare dates
    const aTime = typeof a.time === "string" ? new Date(a.time) : a.time || a.date;
    const bTime = typeof b.time === "string" ? new Date(b.time) : b.time || b.date;

    const timeDiff = aTime.getTime() - bTime.getTime();
    if (timeDiff !== 0) {
      return timeDiff;
    }

    // If times are equal, compare by priority
    const aPriority = EVENT_PRIORITY_ORDER[a.priority || "undefined"];
    const bPriority = EVENT_PRIORITY_ORDER[b.priority || "undefined"];
    return bPriority - aPriority; // Higher priority first
  });
}

/**
 * Get all events for a date and sort them
 */
export function getAllEventsForDateSorted(date: Date): CalendarEvent[] {
  const events = getAllEventsForDate(date);
  return sortEventsByTime(events);
}

/**
 * Get all events for a month and sort them
 */
export function getAllEventsForMonthSorted(date: Date): CalendarEvent[] {
  const events = getAllEventsForMonth(date);
  return sortEventsByTime(events);
}
