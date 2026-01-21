import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Visit, type VoiceMemo, type Photo } from "@/lib/zod/schemas";

interface VisitsStore {
  visits: Visit[];
  activeVisit: Visit | null;
  setVisits: (visits: Visit[]) => void;
  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  setActiveVisit: (visit: Visit | null) => void;
  updateActiveVisit: (updates: Partial<Visit>) => void;
  startVisit: (placeId: string, dealId?: string) => Visit;
  endVisit: (visitId: string) => void;
  addNoteToVisit: (visitId: string, note: string) => void;
  addVoiceMemoToVisit: (visitId: string, memo: VoiceMemo) => void;
  addPhotoToVisit: (visitId: string, photo: Photo) => void;
  getVisitsByPlace: (placeId: string) => Visit[];
  getActiveVisitDuration: () => string;
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
          voiceMemos: [],
          photos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ activeVisit: visit });
        get().addVisit(visit);
        return visit;
      },
      updateActiveVisit: (updates) => set((state) => ({
        activeVisit: state.activeVisit
          ? { ...state.activeVisit, ...updates, updatedAt: new Date() }
          : null,
      })),
      addVoiceMemoToVisit: (visitId, memo) => set((state) => ({
        visits: state.visits.map((v) =>
          v.id === visitId
            ? { ...v, voiceMemos: [...v.voiceMemos, memo], updatedAt: new Date() }
            : v
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? {
              ...state.activeVisit,
              voiceMemos: [...state.activeVisit.voiceMemos, memo],
              updatedAt: new Date(),
            }
          : state.activeVisit,
      })),
      addPhotoToVisit: (visitId, photo) => set((state) => ({
        visits: state.visits.map((v) =>
          v.id === visitId
            ? { ...v, photos: [...v.photos, photo], updatedAt: new Date() }
            : v
        ),
        activeVisit: state.activeVisit?.id === visitId
          ? {
              ...state.activeVisit,
              photos: [...state.activeVisit.photos, photo],
              updatedAt: new Date(),
            }
          : state.activeVisit,
      })),
      getActiveVisitDuration: () => {
        const { activeVisit } = get();
        if (!activeVisit) return "0m";
        const endTime = activeVisit.endTime || new Date();
        const durationMs = endTime.getTime() - activeVisit.startTime.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
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
