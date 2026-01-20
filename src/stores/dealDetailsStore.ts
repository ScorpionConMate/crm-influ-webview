import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Deliverable, type PaymentInfo } from "@/lib/zod/schemas";

interface DealDetailsStore {
  deliverables: Deliverable[];
  payments: PaymentInfo[];
  setDeliverables: (deliverables: Deliverable[]) => void;
  addDeliverable: (deliverable: Deliverable) => void;
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void;
  deleteDeliverable: (id: string) => void;
  markDeliverableCompleted: (id: string) => void;
  getDeliverablesByDeal: (dealId: string) => Deliverable[];
  setPayments: (payments: PaymentInfo[]) => void;
  addPayment: (payment: PaymentInfo) => void;
  updatePayment: (id: string, updates: Partial<PaymentInfo>) => void;
  deletePayment: (id: string) => void;
  markPaymentPaid: (id: string) => void;
  getPaymentsByDeal: (dealId: string) => PaymentInfo[];
}

export const useDealDetailsStore = create<DealDetailsStore>()(
  persist(
    (set, get) => ({
      deliverables: [],
      payments: [],
      setDeliverables: (deliverables) => set({ deliverables }),
      addDeliverable: (deliverable) => set((state) => ({ deliverables: [...state.deliverables, deliverable] })),
      updateDeliverable: (id, updates) => set((state) => ({
        deliverables: state.deliverables.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      })),
      deleteDeliverable: (id) => set((state) => ({
        deliverables: state.deliverables.filter((d) => d.id !== id),
      })),
      markDeliverableCompleted: (id) => set((state) => ({
        deliverables: state.deliverables.map((d) =>
          d.id === id ? { ...d, completedDate: new Date() } : d
        ),
      })),
      getDeliverablesByDeal: (dealId) => {
        const { deliverables } = get();
        return deliverables.filter((d) => d.dealId === dealId);
      },
      setPayments: (payments) => set({ payments }),
      addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
      updatePayment: (id, updates) => set((state) => ({
        payments: state.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),
      deletePayment: (id) => set((state) => ({
        payments: state.payments.filter((p) => p.id !== id),
      })),
      markPaymentPaid: (id) => set((state) => ({
        payments: state.payments.map((p) =>
          p.id === id ? { ...p, status: "paid", paidDate: new Date() } : p
        ),
      })),
      getPaymentsByDeal: (dealId) => {
        const { payments } = get();
        return payments.filter((p) => p.dealId === dealId);
      },
    }),
    {
      name: "deal-details-storage",
    }
  )
);
