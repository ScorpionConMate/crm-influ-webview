import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Contact, type PlaceContactLink } from "@/lib/zod/schemas";

interface ContactsStore {
  contacts: Contact[];
  placeLinks: PlaceContactLink[];
  selectedContact: Contact | null;
  searchQuery: string;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  addPlaceLink: (link: PlaceContactLink) => void;
  removePlaceLink: (placeId: string, contactId: string) => void;
  getContactsByPlace: (placeId: string) => Contact[];
  filteredContacts: () => Contact[];
}

export const useContactsStore = create<ContactsStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      placeLinks: [],
      selectedContact: null,
      searchQuery: "",
      setContacts: (contacts) => set({ contacts }),
      addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
      updateContact: (id, updates) => set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)),
      })),
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
      })),
      setSelectedContact: (contact) => set({ selectedContact: contact }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      addPlaceLink: (link) => set((state) => ({ placeLinks: [...state.placeLinks, link] })),
      removePlaceLink: (placeId, contactId) => set((state) => ({
        placeLinks: state.placeLinks.filter((l) => !(l.placeId === placeId && l.contactId === contactId)),
      })),
      getContactsByPlace: (placeId) => {
        const { contacts, placeLinks } = get();
        const linkedContactIds = placeLinks
          .filter((l) => l.placeId === placeId)
          .map((l) => l.contactId);
        return contacts.filter((c) => linkedContactIds.includes(c.id));
      },
      filteredContacts: () => {
        const { contacts, searchQuery } = get();
        return contacts.filter((contact) => {
          const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchesSearch;
        });
      },
    }),
    {
      name: "contacts-storage",
    }
  )
);
