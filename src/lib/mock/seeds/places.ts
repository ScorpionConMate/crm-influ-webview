import { createMockPlace } from "../mockDataFactory";
import { placeSchema } from "@/lib/zod/schemas";

/**
 * Mock places data for places store
 */
export const mockPlaces = [
  placeSchema.parse(
    createMockPlace({
      name: "Savor Kitchen",
      address: "123 Main Street",
      city: "San Francisco",
      category: "Restaurant",
      website: "https://savorkitchen.com",
      phone: "+1 (555) 234-5678",
      instagram: "@savorkitchen",
      notes: "Farm-to-table restaurant, high-end dining experience",
      createdAt: new Date("2025-04-15T09:00:00Z"),
      updatedAt: new Date("2026-01-10T14:30:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "FitLife Gym",
      address: "456 Oak Avenue",
      city: "New York",
      category: "Gym",
      website: "https://fitlifegym.com",
      phone: "+1 (555) 345-6789",
      instagram: "@fitlifegym",
      notes: "Premium fitness center with modern equipment",
      createdAt: new Date("2025-05-20T13:15:00Z"),
      updatedAt: new Date("2026-01-05T11:20:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "Morning Brew Cafe",
      address: "789 Pine Road",
      city: "Los Angeles",
      category: "Cafe",
      website: "https://morningbrewcafe.com",
      phone: "+1 (555) 456-7890",
      instagram: "@morningbrewcafe",
      notes: "Specialty coffee and brunch spot",
      createdAt: new Date("2025-06-01T10:45:00Z"),
      updatedAt: new Date("2026-01-12T09:00:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "Urban Style",
      address: "321 Elm Street",
      city: "Chicago",
      category: "Retail",
      website: "https://urbanstyle.com",
      phone: "+1 (555) 567-8901",
      instagram: "@urbanstyle",
      notes: "Trendy fashion boutique",
      createdAt: new Date("2025-07-10T16:30:00Z"),
      updatedAt: new Date("2026-01-08T15:45:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "TechHub Startup Space",
      address: "654 Maple Lane",
      city: "San Francisco",
      category: "Tech",
      website: "https://techhub.io",
      phone: "+1 (555) 678-9012",
      instagram: "@techhub",
      notes: "Co-working space for tech startups",
      createdAt: new Date("2025-03-25T14:20:00Z"),
      updatedAt: new Date("2026-01-14T10:15:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "Grand Hotel",
      address: "987 Broadway",
      city: "New York",
      category: "Hotel",
      website: "https://grandhotel.com",
      phone: "+1 (555) 789-0123",
      instagram: "@grandhotelny",
      notes: "Luxury hotel with spa and fine dining",
      createdAt: new Date("2025-02-10T11:00:00Z"),
      updatedAt: new Date("2026-01-03T16:30:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "Skyline Lounge",
      address: "246 Park Avenue",
      city: "Chicago",
      category: "Bar",
      website: "https://skylinelounge.com",
      phone: "+1 (555) 890-1234",
      instagram: "@skylinelounge",
      notes: "Rooftop bar with city views",
      createdAt: new Date("2025-08-05T09:45:00Z"),
      updatedAt: new Date("2026-01-11T13:20:00Z"),
    })
  ),
  placeSchema.parse(
    createMockPlace({
      name: "Zen Wellness Spa",
      address: "135 Lakeview Drive",
      city: "Miami",
      category: "Wellness",
      website: "https://zenwellness.com",
      phone: "+1 (555) 901-2345",
      instagram: "@zenwellness",
      notes: "Full-service spa and wellness center",
      createdAt: new Date("2025-04-28T12:15:00Z"),
      updatedAt: new Date("2026-01-06T10:50:00Z"),
    })
  ),
];
