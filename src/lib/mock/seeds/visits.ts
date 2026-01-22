import { createMockVisit, createMockVoiceMemo, createMockPhoto } from "../mockDataFactory";
import { visitSchema, voiceMemoSchema, photoSchema } from "@/lib/zod/schemas";

/**
 * Mock visits data for visits store
 */
export const mockVisits = [
  visitSchema.parse(
    createMockVisit({
      id: "visit-1",
      placeId: "place-1",
      dealId: "deal-paid-1",
      startTime: new Date("2025-03-10T10:00:00Z"),
      endTime: new Date("2025-03-10T11:30:00Z"),
      notes: [
        "Met with Sarah Johnson to discuss campaign timeline",
        "Walked through the restaurant and took photos of key areas",
        "Discussed menu items to feature in content",
        "Confirmed availability for photoshoot on March 20th",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Productive meeting, client is excited about the campaign. Photoshoot confirmed for March 20th.",
      createdAt: new Date("2025-03-10T10:00:00Z"),
      updatedAt: new Date("2025-03-10T11:30:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-2",
      placeId: "place-2",
      dealId: "deal-delivered-1",
      startTime: new Date("2025-06-15T14:00:00Z"),
      endTime: new Date("2025-06-15T15:45:00Z"),
      notes: [
        "Photoshoot for Summer Fitness Challenge campaign",
        "Captured workout demonstrations and facility highlights",
        "Interviewed gym members for testimonials",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Successful photoshoot. Got great footage of trainers and members doing workouts.",
      createdAt: new Date("2025-06-15T14:00:00Z"),
      updatedAt: new Date("2025-06-15T15:45:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-3",
      placeId: "place-3",
      dealId: "deal-paid-2",
      startTime: new Date("2025-04-20T09:30:00Z"),
      endTime: new Date("2025-04-20T10:15:00Z"),
      notes: [
        "Coffee tasting and menu review",
        "Discussed brand aesthetic for social media",
        "Checked out Instagram-friendly photo spots in the cafe",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Great coffee and friendly staff. Found several photogenic corners for content creation.",
      createdAt: new Date("2025-04-20T09:30:00Z"),
      updatedAt: new Date("2025-04-20T10:15:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-4",
      placeId: "place-4",
      dealId: "deal-confirmed-1",
      startTime: new Date("2025-12-05T11:00:00Z"),
      endTime: new Date("2025-12-05T12:30:00Z"),
      notes: [
        "Contract signing meeting",
        "Reviewed deliverables and timeline",
        "Discussed creative direction",
        "Selected key products to feature",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Contract signed! Client loves the creative direction. Ready to start production.",
      createdAt: new Date("2025-12-05T11:00:00Z"),
      updatedAt: new Date("2025-12-05T12:30:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-5",
      placeId: "place-5",
      dealId: "deal-negotiation-1",
      startTime: new Date("2025-11-25T13:00:00Z"),
      endTime: new Date("2025-11-25T14:00:00Z"),
      notes: [
        "Presentation of monthly content package proposal",
        "Negotiated pricing and deliverables",
        "Client requested additional revisions",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Good meeting but client wants more flexibility in the package. Will send revised proposal.",
      createdAt: new Date("2025-11-25T13:00:00Z"),
      updatedAt: new Date("2025-11-25T14:00:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-6",
      placeId: "place-7",
      dealId: "deal-contacted-1",
      startTime: new Date("2025-11-18T16:00:00Z"),
      endTime: new Date("2025-11-18T17:15:00Z"),
      notes: [
        "Initial discovery call",
        "Learned about their brand values and target audience",
        "Presented portfolio and past campaigns",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Excellent initial call. Brand values align well with our creative approach. Follow-up proposal scheduled.",
      createdAt: new Date("2025-11-18T16:00:00Z"),
      updatedAt: new Date("2025-11-18T17:15:00Z"),
    })
  ),
  visitSchema.parse(
    createMockVisit({
      id: "visit-7",
      placeId: "place-8",
      dealId: "deal-lead-1",
      startTime: new Date("2025-12-08T10:00:00Z"),
      endTime: new Date("2025-12-08T10:45:00Z"),
      notes: [
        "Quick site visit and introduction",
        "Discussed their social media goals",
        "Left business cards and portfolio",
      ],
      voiceMemos: [],
      photos: [],
      summary: "Initial introduction. Interested in social media management. Will follow up with detailed proposal.",
      createdAt: new Date("2025-12-08T10:00:00Z"),
      updatedAt: new Date("2025-12-08T10:45:00Z"),
    })
  ),
];

/**
 * Mock voice memos data
 */
export const mockVoiceMemos = [
  voiceMemoSchema.parse(
    createMockVoiceMemo({
      id: "vmemo-1",
      url: "https://example.com/audio/meeting-notes-1.mp3",
      duration: 45,
      timestamp: new Date("2025-03-10T10:15:00Z"),
      visitId: "visit-1",
    })
  ),
  voiceMemoSchema.parse(
    createMockVoiceMemo({
      id: "vmemo-2",
      url: "https://example.com/audio/ideas-brainstorm.mp3",
      duration: 120,
      timestamp: new Date("2025-12-05T11:45:00Z"),
      visitId: "visit-4",
    })
  ),
];

/**
 * Mock photos data
 */
export const mockPhotos = [
  photoSchema.parse(
    createMockPhoto({
      id: "photo-1",
      url: "https://example.com/images/restaurant-interior.jpg",
      timestamp: new Date("2025-03-10T10:30:00Z"),
    })
  ),
  photoSchema.parse(
    createMockPhoto({
      id: "photo-2",
      url: "https://example.com/images/gym-equipment.jpg",
      timestamp: new Date("2025-06-15T14:30:00Z"),
    })
  ),
  photoSchema.parse(
    createMockPhoto({
      id: "photo-3",
      url: "https://example.com/images/cafe-interior.jpg",
      timestamp: new Date("2025-04-20T09:45:00Z"),
    })
  ),
  photoSchema.parse(
    createMockPhoto({
      id: "photo-4",
      url: "https://example.com/images/specialty-coffee.jpg",
      timestamp: new Date("2025-04-20T10:00:00Z"),
    })
  ),
  photoSchema.parse(
    createMockPhoto({
      id: "photo-5",
      url: "https://example.com/images/rooftop-view.jpg",
      timestamp: new Date("2025-11-18T16:45:00Z"),
    })
  ),
];

/**
 * Attach photos to visits (helper function)
 */
export function addPhotosToVisits(visits: typeof mockVisits, photos: typeof mockPhotos): typeof mockVisits {
  return visits.map((visit, index) => ({
    ...visit,
    photos: index < photos.length ? [photos[index]] : [],
  }));
}
