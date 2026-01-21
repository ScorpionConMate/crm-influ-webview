import { useEffect, useState } from "react";
import { useRemindersStore } from "@/stores/remindersStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { useDealsStore } from "@/stores/dealsStore";
import { useCalendarStore } from "@/stores/calendarStore";
import type { CalendarEvent } from "@/lib/calendar/eventTypes";
import {
  getAllEventsForDate,
  getAllEventsForMonth,
  sortEventsByTime,
} from "@/lib/calendar/eventMapper";

/**
 * Get sorted events for a specific date
 */
function getAllEventsForDateSorted(date: Date): CalendarEvent[] {
  const events = getAllEventsForDate(date);
  return sortEventsByTime(events);
}

/**
 * Get sorted events for a specific month
 */
function getAllEventsForMonthSorted(date: Date): CalendarEvent[] {
  const events = getAllEventsForMonth(date);
  return sortEventsByTime(events);
}

/**
 * Custom hook to get events for a specific date with reactive updates
 * Subscribes to stores and triggers re-renders when they change
 */
export function useCalendarEventsForDate(date: Date): CalendarEvent[] {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getAllEventsForDateSorted(date)
  );

  // Subscribe to store changes
  useEffect(() => {
    const stores = [
      useRemindersStore,
      useVisitsStore,
      useDealsStore,
    ];

    // Unsubscribe function
    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        setEvents(getAllEventsForDateSorted(date));
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [date]);

  return events;
}

/**
 * Custom hook to get events for a specific month with reactive updates
 */
export function useCalendarEventsForMonth(date: Date): CalendarEvent[] {
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getAllEventsForMonthSorted(date)
  );

  // Subscribe to store changes
  useEffect(() => {
    const stores = [
      useRemindersStore,
      useVisitsStore,
      useDealsStore,
    ];

    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        setEvents(getAllEventsForMonthSorted(date));
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [date]);

  return events;
}

/**
 * Custom hook to get events for multiple dates (week view)
 * Returns an array of events for each date
 */
export function useCalendarEventsForWeek(dates: Date[]): CalendarEvent[][] {
  const [events, setEvents] = useState<CalendarEvent[][]>(() =>
    dates.map((date) => getAllEventsForDateSorted(date))
  );

  // Subscribe to store changes
  useEffect(() => {
    const stores = [
      useRemindersStore,
      useVisitsStore,
      useDealsStore,
    ];

    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        setEvents(dates.map((date) => getAllEventsForDateSorted(date)));
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [dates]);

  return events;
}

/**
 * Hook to trigger re-renders when stores change
 * Used by components that don't need to actual events but need to update
 */
export function useCalendarStoreSubscription() {
  const calendarStore = useCalendarStore();

  useEffect(() => {
    const stores = [
      useRemindersStore,
      useVisitsStore,
      useDealsStore,
    ];

    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        calendarStore.incrementEventCounter();
      })
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [calendarStore]);
}
