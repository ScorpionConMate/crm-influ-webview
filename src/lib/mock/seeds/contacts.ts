import { createMockContact } from "../mockDataFactory";
import { contactSchema } from "@/lib/zod/schemas";

/**
 * Mock contacts data for contacts store
 */
export const mockContacts = [
  contactSchema.parse(
    createMockContact({
      name: "Sarah Johnson",
      role: "Marketing Manager",
      email: "sarah.j@restaurant1.com",
      phone: "+1 (555) 234-5678",
      instagram: "@sarah.marketing",
      notes: "Key decision maker, responds well to email",
      createdAt: new Date("2025-08-15T10:00:00Z"),
      updatedAt: new Date("2026-01-10T14:30:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Michael Chen",
      role: "Owner",
      email: "michael.c@gymfit.com",
      phone: "+1 (555) 345-6789",
      instagram: "@michaelgymfit",
      notes: "Prefers in-person meetings",
      createdAt: new Date("2025-07-20T09:15:00Z"),
      updatedAt: new Date("2026-01-05T11:20:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Emily Rodriguez",
      role: "Social Media Coordinator",
      email: "emily.r@cafebliss.com",
      phone: "+1 (555) 456-7890",
      instagram: "@emilycreates",
      notes: "Handles all social media content",
      createdAt: new Date("2025-09-01T16:45:00Z"),
      updatedAt: new Date("2026-01-12T09:00:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "David Thompson",
      role: "Sales Director",
      email: "david.t@retailmax.com",
      phone: "+1 (555) 567-8901",
      instagram: "@davidretail",
      notes: "Looking for influencer partnerships",
      createdAt: new Date("2025-06-10T13:20:00Z"),
      updatedAt: new Date("2026-01-08T15:45:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Jessica Williams",
      role: "HR Manager",
      email: "jessica.w@techstart.com",
      phone: "+1 (555) 678-9012",
      instagram: "@jessicahr",
      notes: "Handles brand partnerships",
      createdAt: new Date("2025-10-05T11:30:00Z"),
      updatedAt: new Date("2026-01-14T10:15:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Robert Anderson",
      role: "General Manager",
      email: "robert.a@hotelgrand.com",
      phone: "+1 (555) 789-0123",
      instagram: "@roberthotel",
      notes: "Prefers phone calls over email",
      createdAt: new Date("2025-05-22T14:00:00Z"),
      updatedAt: new Date("2026-01-03T16:30:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Amanda Martinez",
      role: "Events Coordinator",
      email: "amanda.m@barluxe.com",
      phone: "+1 (555) 890-1234",
      instagram: "@amandaevents",
      notes: "Organizes monthly influencer events",
      createdAt: new Date("2025-08-28T09:45:00Z"),
      updatedAt: new Date("2026-01-11T13:20:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Christopher Lee",
      role: "Wellness Director",
      email: "chris.l@spadaily.com",
      phone: "+1 (555) 901-2345",
      instagram: "@chriswellness",
      notes: "Interested in wellness content",
      createdAt: new Date("2025-07-14T12:15:00Z"),
      updatedAt: new Date("2026-01-06T10:50:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Nicole Brown",
      role: "Brand Manager",
      email: "nicole.b@boutique.com",
      phone: "+1 (555) 012-3456",
      instagram: "@nicolebrand",
      notes: "High response rate, great to work with",
      createdAt: new Date("2025-09-18T15:30:00Z"),
      updatedAt: new Date("2026-01-09T14:10:00Z"),
    })
  ),
  contactSchema.parse(
    createMockContact({
      name: "Kevin Zhang",
      role: "Operations Manager",
      email: "kevin.z@bistro.com",
      phone: "+1 (555) 123-4567",
      instagram: "@kevinbistro",
      notes: "Handles logistics for events",
      createdAt: new Date("2025-06-29T10:00:00Z"),
      updatedAt: new Date("2026-01-07T11:40:00Z"),
    })
  ),
];
