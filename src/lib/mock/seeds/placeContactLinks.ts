import { createMockPlaceContactLink } from "../mockDataFactory";
import { placeContactLinkSchema } from "@/lib/zod/schemas";

/**
 * Mock place-contact links for connecting places and contacts
 */
export const mockPlaceContactLinks = [
  // Savor Kitchen (place-1) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-1",
      contactId: "contact-1",
      role: "Marketing Manager",
      createdAt: new Date("2025-04-15T09:00:00Z"),
    })
  ),
  // FitLife Gym (place-2) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-2",
      contactId: "contact-2",
      role: "Owner",
      createdAt: new Date("2025-05-20T13:15:00Z"),
    })
  ),
  // Morning Brew Cafe (place-3) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-3",
      contactId: "contact-3",
      role: "Social Media Coordinator",
      createdAt: new Date("2025-06-01T10:45:00Z"),
    })
  ),
  // Urban Style (place-4) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-4",
      contactId: "contact-4",
      role: "Sales Director",
      createdAt: new Date("2025-07-10T16:30:00Z"),
    })
  ),
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-4",
      contactId: "contact-9",
      role: "Brand Manager",
      createdAt: new Date("2025-09-18T15:30:00Z"),
    })
  ),
  // TechHub Startup Space (place-5) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-5",
      contactId: "contact-5",
      role: "HR Manager",
      createdAt: new Date("2025-03-25T14:20:00Z"),
    })
  ),
  // Grand Hotel (place-6) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-6",
      contactId: "contact-6",
      role: "General Manager",
      createdAt: new Date("2025-02-10T11:00:00Z"),
    })
  ),
  // Skyline Lounge (place-7) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-7",
      contactId: "contact-7",
      role: "Events Coordinator",
      createdAt: new Date("2025-08-05T09:45:00Z"),
    })
  ),
  // Zen Wellness Spa (place-8) contacts
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-8",
      contactId: "contact-8",
      role: "Wellness Director",
      createdAt: new Date("2025-04-28T12:15:00Z"),
    })
  ),
  // Multiple contacts for same place example
  placeContactLinkSchema.parse(
    createMockPlaceContactLink({
      placeId: "place-2",
      contactId: "contact-10",
      role: "Operations Manager",
      createdAt: new Date("2025-06-29T10:00:00Z"),
    })
  ),
];
