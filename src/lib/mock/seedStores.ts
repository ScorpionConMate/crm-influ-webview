import { useAuthStore } from "@/stores/authStore";
import { useContactsStore } from "@/stores/contactsStore";
import { usePlacesStore } from "@/stores/placesStore";
import { useDealsStore } from "@/stores/dealsStore";
import { useDealDetailsStore } from "@/stores/dealDetailsStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { useRemindersStore } from "@/stores/remindersStore";

// Import seed data
import { mockUser } from "./seeds/auth";
import { mockContacts } from "./seeds/contacts";
import { mockPlaces } from "./seeds/places";
import { mockDeals, mockDeliverables, mockPayments } from "./seeds/deals";
import { mockVisits, addPhotosToVisits, mockVoiceMemos, mockPhotos } from "./seeds/visits";
import { mockReminders } from "./seeds/reminders";
import { mockPlaceContactLinks } from "./seeds/placeContactLinks";

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

/**
 * Seed all stores with mock data
 * Call this function to populate your stores for testing
 */
export function seedAllStores(): void {
  seedAuthStore();
  seedContactsStore();
  seedPlacesStore();
  seedDealsStore();
  seedDealDetailsStore();
  seedVisitsStore();
  seedRemindersStore();
}

/**
 * Seed auth store with mock user
 */
export function seedAuthStore(): void {
  const authStore = useAuthStore.getState();
  authStore.setUser(mockUser);
}

/**
 * Seed contacts store with mock contacts
 */
export function seedContactsStore(): void {
  const contactsStore = useContactsStore.getState();
  contactsStore.setContacts(mockContacts);
}

/**
 * Seed places store with mock places
 */
export function seedPlacesStore(): void {
  const placesStore = usePlacesStore.getState();
  placesStore.setPlaces(mockPlaces);
}

/**
 * Seed deals store with mock deals
 */
export function seedDealsStore(): void {
  const dealsStore = useDealsStore.getState();
  dealsStore.setDeals(mockDeals);
}

/**
 * Seed deal details store with deliverables and payments
 */
export function seedDealDetailsStore(): void {
  const dealDetailsStore = useDealDetailsStore.getState();
  dealDetailsStore.setDeliverables(mockDeliverables);
  dealDetailsStore.setPayments(mockPayments);
}

/**
 * Seed visits store with mock visits (including photos and voice memos)
 */
export function seedVisitsStore(): void {
  const visitsStore = useVisitsStore.getState();

  // Add photos to visits
  const visitsWithPhotos = addPhotosToVisits(mockVisits, mockPhotos);

  // Add voice memos to visits
  const visitsWithVoiceMemos = visitsWithPhotos.map((visit) => {
    const visitVoiceMemos = mockVoiceMemos.filter((memo) => memo.visitId === visit.id);
    return { ...visit, voiceMemos: visitVoiceMemos };
  });

  visitsStore.setVisits(visitsWithVoiceMemos);
}

/**
 * Seed reminders store with mock reminders
 */
export function seedRemindersStore(): void {
  const remindersStore = useRemindersStore.getState();
  remindersStore.setReminders(mockReminders);
}

// ============================================================================
// CLEAR/RESET FUNCTIONS
// ============================================================================

/**
 * Clear all stores (reset to empty state)
 */
export function clearAllStores(): void {
  clearAuthStore();
  clearContactsStore();
  clearPlacesStore();
  clearDealsStore();
  clearDealDetailsStore();
  clearVisitsStore();
  clearRemindersStore();
}

/**
 * Clear auth store
 */
export function clearAuthStore(): void {
  const authStore = useAuthStore.getState();
  authStore.logout();
}

/**
 * Clear contacts store
 */
export function clearContactsStore(): void {
  const contactsStore = useContactsStore.getState();
  contactsStore.setContacts([]);
  contactsStore.setSearchQuery("");
  contactsStore.setSelectedContact(null);
}

/**
 * Clear places store
 */
export function clearPlacesStore(): void {
  const placesStore = usePlacesStore.getState();
  placesStore.setPlaces([]);
  placesStore.setSearchQuery("");
  placesStore.setSelectedPlace(null);
  placesStore.setFilter("all");
  placesStore.setCategoryFilter(null);
}

/**
 * Clear deals store
 */
export function clearDealsStore(): void {
  const dealsStore = useDealsStore.getState();
  dealsStore.setDeals([]);
  dealsStore.setSelectedDeal(null);
  dealsStore.setStatusFilter(null);
}

/**
 * Clear deal details store
 */
export function clearDealDetailsStore(): void {
  const dealDetailsStore = useDealDetailsStore.getState();
  dealDetailsStore.setDeliverables([]);
  dealDetailsStore.setPayments([]);
}

/**
 * Clear visits store
 */
export function clearVisitsStore(): void {
  const visitsStore = useVisitsStore.getState();
  visitsStore.setVisits([]);
  visitsStore.setActiveVisit(null);
}

/**
 * Clear reminders store
 */
export function clearRemindersStore(): void {
  const remindersStore = useRemindersStore.getState();
  remindersStore.setReminders([]);
  remindersStore.setSelectedReminder(null);
  remindersStore.setFilter("pending");
}

/**
 * Reset all stores to fresh state (clear and re-seed)
 */
export function resetAllStores(): void {
  clearAllStores();
  seedAllStores();
}

/**
 * Place-contact links seeding (helper for contacts store)
 * This needs to be called after both contacts and places are seeded
 */
export function seedPlaceContactLinks(): void {
  const contactsStore = useContactsStore.getState();
  contactsStore.placeLinks = mockPlaceContactLinks;
}

/**
 * Get mock data for direct testing
 */
export const mockData = {
  user: mockUser,
  contacts: mockContacts,
  places: mockPlaces,
  deals: mockDeals,
  deliverables: mockDeliverables,
  payments: mockPayments,
  visits: mockVisits,
  voiceMemos: mockVoiceMemos,
  photos: mockPhotos,
  reminders: mockReminders,
  placeContactLinks: mockPlaceContactLinks,
};
