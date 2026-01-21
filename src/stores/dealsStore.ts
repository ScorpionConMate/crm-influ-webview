import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Deal, type DealStatus, type Deliverable, type PaymentInfo } from "@/lib/zod/schemas";

interface DealsStore {
  deals: Deal[];
  selectedDeal: Deal | null;
  statusFilter: DealStatus | null;

  // Basic CRUD
  setDeals: (deals: Deal[]) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;

  // Selection and filtering
  setSelectedDeal: (deal: Deal | null) => void;
  setStatusFilter: (status: DealStatus | null) => void;

  // Getters
  getDealById: (id: string) => Deal | undefined;
  getDealsByStatus: (status: DealStatus) => Deal[];
  getDealsByPlace: (placeId: string) => Deal[];
  getDealsByContact: (contactId: string) => Deal[];

  // Status management
  changeDealStatus: (id: string, status: DealStatus, lostReason?: string) => void;

  // Deliverables management
  addDeliverable: (dealId: string, deliverable: Deliverable) => void;
  updateDeliverable: (dealId: string, deliverableId: string, updates: Partial<Deliverable>) => void;
  deleteDeliverable: (dealId: string, deliverableId: string) => void;

  // Payments management
  addPayment: (dealId: string, payment: PaymentInfo) => void;
  updatePayment: (dealId: string, paymentId: string, updates: Partial<PaymentInfo>) => void;
  deletePayment: (dealId: string, paymentId: string) => void;
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
        deals: state.deals.map((d) => {
          if (d.id === id) {
            const updatedDeal = { ...d, ...updates, updatedAt: new Date() };
            // Handle nested updates for deliverables
            if (updates.deliverables) {
              updatedDeal.deliverables = updates.deliverables;
            }
            // Handle nested updates for payments
            if (updates.payments) {
              updatedDeal.payments = updates.payments;
            }
            return updatedDeal;
          }
          return d;
        }),
      })),

      deleteDeal: (id) => set((state) => ({
        deals: state.deals.filter((d) => d.id !== id),
        selectedDeal: state.selectedDeal?.id === id ? null : state.selectedDeal,
      })),

      setSelectedDeal: (deal) => set({ selectedDeal: deal }),
      setStatusFilter: (status) => set({ statusFilter: status }),

      getDealById: (id) => {
        const { deals } = get();
        return deals.find((d) => d.id === id);
      },

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

      changeDealStatus: (id, status, lostReason) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === id
            ? {
                ...d,
                status,
                lostReason: status === "lost" ? lostReason : undefined,
                updatedAt: new Date(),
              }
            : d
        ),
      })),

      addDeliverable: (dealId, deliverable) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? { ...d, deliverables: [...d.deliverables, deliverable], updatedAt: new Date() }
            : d
        ),
      })),

      updateDeliverable: (dealId, deliverableId, updates) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                deliverables: d.deliverables.map((del) =>
                  del.id === deliverableId ? { ...del, ...updates } : del
                ),
                updatedAt: new Date(),
              }
            : d
        ),
      })),

      deleteDeliverable: (dealId, deliverableId) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                deliverables: d.deliverables.filter((del) => del.id !== deliverableId),
                updatedAt: new Date(),
              }
            : d
        ),
      })),

      addPayment: (dealId, payment) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? { ...d, payments: [...d.payments, payment], updatedAt: new Date() }
            : d
        ),
      })),

      updatePayment: (dealId, paymentId, updates) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                payments: d.payments.map((p) =>
                  p.id === paymentId ? { ...p, ...updates } : p
                ),
                updatedAt: new Date(),
              }
            : d
        ),
      })),

      deletePayment: (dealId, paymentId) => set((state) => ({
        deals: state.deals.map((d) =>
          d.id === dealId
            ? {
                ...d,
                payments: d.payments.filter((p) => p.id !== paymentId),
                updatedAt: new Date(),
              }
            : d
        ),
      })),
    }),
    {
      name: "deals-storage",
    }
  )
);
