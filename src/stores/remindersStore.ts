import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Reminder } from "@/lib/zod/schemas";

interface RemindersStore {
  reminders: Reminder[];
  selectedReminder: Reminder | null;
  filter: "all" | "pending" | "completed";
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  setSelectedReminder: (reminder: Reminder | null) => void;
  setFilter: (filter: "all" | "pending" | "completed") => void;
  markAsCompleted: (id: string) => void;
  markAsPending: (id: string) => void;
  getUpcomingReminders: (days?: number) => Reminder[];
  getRemindersByPlace: (placeId: string) => Reminder[];
  getRemindersByContact: (contactId: string) => Reminder[];
  getRemindersByDeal: (dealId: string) => Reminder[];
  filteredReminders: () => Reminder[];
}

export const useRemindersStore = create<RemindersStore>()(
  persist(
    (set, get) => ({
      reminders: [],
      selectedReminder: null,
      filter: "pending",
      setReminders: (reminders) => set({ reminders }),
      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r)),
      })),
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
        selectedReminder: state.selectedReminder?.id === id ? null : state.selectedReminder,
      })),
      setSelectedReminder: (reminder) => set({ selectedReminder: reminder }),
      setFilter: (filter) => set({ filter }),
      markAsCompleted: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, completed: true, completedDate: new Date() } : r
        ),
      })),
      markAsPending: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, completed: false, completedDate: undefined } : r
        ),
      })),
      getUpcomingReminders: (days = 7) => {
        const { reminders } = get();
        const now = new Date();
        const future = new Date();
        future.setDate(future.getDate() + days);
        return reminders
          .filter((r) => !r.completed && r.dueDate >= now && r.dueDate <= future)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      },
      getRemindersByPlace: (placeId) => {
        const { reminders } = get();
        return reminders.filter((r) => r.placeId === placeId);
      },
      getRemindersByContact: (contactId) => {
        const { reminders } = get();
        return reminders.filter((r) => r.contactId === contactId);
      },
      getRemindersByDeal: (dealId) => {
        const { reminders } = get();
        return reminders.filter((r) => r.dealId === dealId);
      },
      filteredReminders: () => {
        const { reminders, filter } = get();
        if (filter === "all") return reminders;
        if (filter === "pending") return reminders.filter((r) => !r.completed);
        return reminders.filter((r) => r.completed);
      },
    }),
    {
      name: "reminders-storage",
    }
  )
);
