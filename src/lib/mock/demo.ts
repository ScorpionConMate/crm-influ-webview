/**
 * Mock Data System Usage Demo
 *
 * This file demonstrates basic usage of the mock data system.
 * Run this in your browser console or add to a component to test.
 */

// Example 1: Basic usage - Seed all stores
export function demoSeedAll() {
  import { seedAllStores } from "@/lib/mock";
  seedAllStores();
  console.log("✅ All stores seeded with mock data!");
}

// Example 2: Check seeded data
export function demoCheckData() {
  import {
    useAuthStore,
    useContactsStore,
    usePlacesStore,
    useDealsStore,
    useVisitsStore,
    useRemindersStore,
  } from "@/stores";

  console.log("📊 Mock Data Summary:");
  console.log("───────────────────────");

  const user = useAuthStore.getState().user;
  console.log(`User: ${user?.name} (${user?.plan} plan)`);

  const contacts = useContactsStore.getState().contacts;
  console.log(`Contacts: ${contacts.length}`);

  const places = usePlacesStore.getState().places;
  console.log(`Places: ${places.length}`);

  const deals = useDealsStore.getState().deals;
  console.log(`Deals: ${deals.length}`);

  const visits = useVisitsStore.getState().visits;
  console.log(`Visits: ${visits.length}`);

  const reminders = useRemindersStore.getState().reminders;
  console.log(`Reminders: ${reminders.length}`);
}

// Example 3: Create custom mock data
export function demoCustomData() {
  import {
    createMockContact,
    createMockDeal,
  } from "@/lib/mock";
  import { useContactsStore, useDealsStore } from "@/stores";

  // Create a custom contact
  const newContact = createMockContact({
    name: "Alice Johnson",
    role: "Marketing Director",
    email: "alice@example.com",
  });

  useContactsStore.getState().addContact(newContact);
  console.log("✅ Custom contact created:", newContact.name);

  // Create a custom deal
  const newDeal = createMockDeal({
    title: "Custom Campaign",
    status: "negotiation",
    estimatedValue: 15000,
    contactId: newContact.id,
  });

  useDealsStore.getState().addDeal(newDeal);
  console.log("✅ Custom deal created:", newDeal.title);
}

// Example 4: Reset stores
export function demoReset() {
  import { resetAllStores } from "@/lib/mock";
  resetAllStores();
  console.log("🔄 All stores reset!");
}

// Example 5: Access mock data directly
export function demoAccessMockData() {
  import { mockData } from "@/lib/mock";

  console.log("📦 Mock Data Access:");
  console.log("────────────────────");

  // Count by deal status
  const statusCounts = mockData.deals.reduce(
    (acc: Record<string, number>, deal: { status: string }) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("Deals by status:", statusCounts);

  // Count by reminder priority
  const priorityCounts = mockData.reminders.reduce(
    (acc: Record<string, number>, reminder: { priority: string }) => {
      acc[reminder.priority] = (acc[reminder.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("Reminders by priority:", priorityCounts);

  // Get upcoming reminders
  const upcoming = mockData.reminders.filter(
    (r: { completed: boolean; dueDate: Date }) =>
      !r.completed && new Date(r.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  console.log(`Upcoming reminders (next 7 days): ${upcoming.length}`);
}

// Export a demo runner function
export function runDemo() {
  console.log("🚀 Mock Data System Demo\n");

  demoSeedAll();
  demoCheckData();
  demoCustomData();
  demoAccessMockData();

  console.log("\n✨ Demo complete! Check the console for details.");
}
