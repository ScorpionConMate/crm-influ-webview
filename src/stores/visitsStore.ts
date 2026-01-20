import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Visit } from "@/lib/zod/schemas";

interface VisitsStore {
  visits: Visit[];
  activeVisit: Visit | null;
  setVisits: (visits: Visit[]) => void;
  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  setActiveVisit: (visit: Visit | null) => void;
  startVisit: (placeId: string, dealId?: string) => Visit;
  endVisit: (visitId: string) => void;
  addNoteToVisit: (visitId: string, note: string) => void;
  getVisitsByPlace: (placeId: string) => Visit[];
}

export const useVisitsStore = create<VisitsStore>()(
  persist(
    (set, get) => ({
      visits: [],
      activeVisit: null,
      setVisits: (visits) => set({ visits }),
      addVisit: (visit) => set((state) => ({ visits: [...state.visits, visit] })),
      updateVisit: (id, updates) => set((state) => ({
        visits: state.visits.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date() } : v)),
      })),
      deleteVisit: (id) => set((state) => ({
        visits: state.visits.filter((v) => v.id !== id),
        activeVisit: state.activeVisit?.id === id ? null : state.activeVisit,
      })),
      setActiveVisit: (visit) => set({ activeVisit: visit }),
      startVisit: (placeId, dealId) => {
        const visit: Visit = {
          id: crypto.randomUUID(),
          placeId,
          dealId,
          startTime: new Date(),
          notes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ activeVisit: visit });
        get().addVisit(visit);
        return visit;
      },
      endVisit: (visitId) => set((state) => ({
        visits: state.visits.map((v) =>
          v.id === visitId ? { ...v, endTime: new Date(), updatedAt: new Date() } : v
        ),
        activeVisit: state.activeVisit?.id === visitId ? null : state.activeVisit,
      })),
      addNoteToVisit: (visitId, note) => set((state) => ({
        visits: state.visits.map((v) =>
          v.id === visitId ? { ...v, notes: [...v.notes, note], updatedAt: new Date() } : v
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? { ...state.activeVisit, notes: [...state.activeVisit.notes, note], updatedAt: new Date() }
          : state.activeVisit,
      })),
      getVisitsByPlace: (placeId) => {
        const { visits } = get();
        return visits.filter((v) => v.placeId === placeId);
      },
    }),
    {
      name: "visits-storage",
    }
  )
);
