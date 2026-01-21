import { create } from "zustand";
import { persist } from "zustand/middleware";
import { contactSchema, type Contact, type PlaceContactLink } from "@/lib/zod/schemas";

interface ContactsStore {
  contacts: Contact[];
  placeLinks: PlaceContactLink[];
  selectedContact: Contact | null;
  searchQuery: string;
  setContacts: (contacts: Contact[]) => void;
  createContact: (contactData: Omit<Contact, "id" | "createdAt" | "updatedAt">) => { success: true; contact: Contact } | { success: false; error: string };
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => { success: true; contact: Contact } | { success: false; error: string };
  deleteContact: (id: string) => { success: true } | { success: false; error: string };
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  addPlaceLink: (link: PlaceContactLink) => void;
  removePlaceLink: (placeId: string, contactId: string) => void;
  getContactsByPlace: (placeId: string) => Contact[];
  getContactById: (id: string) => Contact | undefined;
  getAllContacts: () => Contact[];
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
      createContact: (contactData) => {
        try {
          const now = new Date();
          const contactWithDates = {
            ...contactData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          } as Contact;

          const validationResult = contactSchema.safeParse(contactWithDates);
          if (!validationResult.success) {
            return { success: false, error: "Invalid contact data" };
          }

          const newContact = validationResult.data;
          set((state) => ({ contacts: [...state.contacts, newContact] }));
          return { success: true, contact: newContact };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
      addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
      updateContact: (id, updates) => {
        try {
          const { contacts } = get();
          const existingContact = contacts.find((c) => c.id === id);
          if (!existingContact) {
            return { success: false, error: "Contact not found" };
          }

          const updatedContact = { ...existingContact, ...updates, updatedAt: new Date() };
          const validationResult = contactSchema.safeParse(updatedContact);
          if (!validationResult.success) {
            return { success: false, error: "Invalid contact data" };
          }

          set((state) => ({
            contacts: state.contacts.map((c) => (c.id === id ? updatedContact : c)),
          }));
          return { success: true, contact: updatedContact };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
      deleteContact: (id) => {
        try {
          const { contacts } = get();
          const exists = contacts.some((c) => c.id === id);
          if (!exists) {
            return { success: false, error: "Contact not found" };
          }

          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
            selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
          }));
          return { success: true };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
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
      getContactById: (id) => {
        const { contacts } = get();
        return contacts.find((c) => c.id === id);
      },
      getAllContacts: () => {
        return get().contacts;
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
