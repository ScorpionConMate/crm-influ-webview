import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
} from "date-fns";
import type { CalendarEvent } from "@/lib/calendar/eventTypes";
import { getAllEventsForDate, getAllEventsForMonth } from "@/lib/calendar/eventMapper";

type ViewMode = "month" | "agenda" | "day-detail";

interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  viewMode: ViewMode;
  // Force update counter to trigger re-renders when stores change
  _eventUpdateCounter: number;
}

interface CalendarActions {
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date | null) => void;
  setViewMode: (mode: ViewMode) => void;
  navigateMonth: (offset: number) => void;
  goToToday: () => void;
  getMonthDays: () => Date[];
  getWeekDays: (date: Date) => Date[];
  // Event-related actions
  incrementEventCounter: () => void;
  getDayEvents: (date: Date) => CalendarEvent[];
  getMonthEvents: (date: Date) => CalendarEvent[];
}

type CalendarStore = CalendarState & CalendarActions;

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      currentDate: new Date(),
      selectedDate: null,
      viewMode: "month",
      _eventUpdateCounter: 0,

      setCurrentDate: (date) => set({ currentDate: date }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      navigateMonth: (offset) =>
        set((state) => ({
          currentDate: addMonths(state.currentDate, offset),
        })),
      goToToday: () => set({ currentDate: new Date() }),

      incrementEventCounter: () =>
        set((state) => ({ _eventUpdateCounter: state._eventUpdateCounter + 1 })),

      getMonthDays: () => {
        const { currentDate } = get();
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
      },

      getWeekDays: (date) => {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      },

      getDayEvents: (date) => {
        // Use eventMapper to get events for the date
        return getAllEventsForDate(date);
      },

      getMonthEvents: (date) => {
        // Use eventMapper to get events for the month
        return getAllEventsForMonth(date);
      },
    }),
    {
      name: "calendar-storage",
      partialize: (state) => ({
        currentDate: state.currentDate,
        viewMode: state.viewMode,
        // Don't persist selectedDate or _eventUpdateCounter
      }),
    }
  )
);
