import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Deal, type DealStatus } from "@/lib/zod/schemas";

interface DealsStore {
  deals: Deal[];
  selectedDeal: Deal | null;
  statusFilter: DealStatus | null;
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  setStatusFilter: (status: DealStatus | null) => void;
  getDealsByStatus: (status: DealStatus) => Deal[];
  getDealsByPlace: (placeId: string) => Deal[];
  getDealsByContact: (contactId: string) => Deal[];
}

export const useDealsStore = create<DealsStore>()(
  persist(
    (set, get) => ({
      deals: [],
      selectedDeal: null,
      statusFilter: null,
      setDeals: (deals) => set({ deals }),
      addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),
      updateDeal: (id, updates) => set((state) => ({
        deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d)),
      })),
      deleteDeal: (id) => set((state) => ({
        deals: state.deals.filter((d) => d.id !== id),
        selectedDeal: state.selectedDeal?.id === id ? null : state.selectedDeal,
      })),
      setSelectedDeal: (deal) => set({ selectedDeal: deal }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      getDealsByStatus: (status) => {
        const { deals } = get();
        return deals.filter((d) => d.status === status);
      },
      getDealsByPlace: (placeId) => {
        const { deals } = get();
        return deals.filter((d) => d.placeId === placeId);
      },
      getDealsByContact: (contactId) => {
        const { deals } = get();
        return deals.filter((d) => d.contactId === contactId);
      },
    }),
    {
      name: "deals-storage",
    }
  )
);
