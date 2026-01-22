/**
 * Mock Data System
 *
 * This module provides comprehensive mock data for all stores in the CRM application.
 * Use it to test all flows without connecting to a backend.
 *
 * @example
 * ```typescript
 * // Seed all stores at once
 * import { seedAllStores } from "@/lib/mock";
 * seedAllStores();
 *
 * // Seed individual stores
 * import { seedContactsStore, seedDealsStore } from "@/lib/mock";
 * seedContactsStore();
 * seedDealsStore();
 *
 * // Access mock data directly
 * import { mockData } from "@/lib/mock";
 * console.log(mockData.contacts);
 *
 * // Create custom mock data
 * import { createMockContact, createMockDeal } from "@/lib/mock";
 * const customContact = createMockContact({ name: "John Doe" });
 * const customDeal = createMockDeal({ title: "Custom Deal", status: "confirmed" });
 * ```
 */

// Factory functions for creating mock data
export * from "./mockDataFactory";

// Seed data arrays
export * from "./seeds/auth";
export * from "./seeds/contacts";
export * from "./seeds/places";
export * from "./seeds/deals";
export * from "./seeds/visits";
export * from "./seeds/reminders";
export * from "./seeds/placeContactLinks";

// Store seeding and clearing functions
export * from "./seedStores";
