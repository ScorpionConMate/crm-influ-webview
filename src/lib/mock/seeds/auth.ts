import { createMockUser } from "../mockDataFactory";
import { userSchema } from "@/lib/zod/schemas";

/**
 * Mock user data for authentication store
 */
export const mockUser = userSchema.parse(
  createMockUser({
    email: "demo@crm-influ.com",
    name: "Demo User",
    plan: "pro",
    avatarUrl: "https://i.pravatar.cc/150?u=demouser",
    createdAt: new Date("2025-01-15T10:00:00Z"),
  })
);

/**
 * Additional mock users for testing different plans
 */
export const mockFreeUser = userSchema.parse(
  createMockUser({
    email: "free@crm-influ.com",
    name: "Free User",
    plan: "free",
  })
);

export const mockEnterpriseUser = userSchema.parse(
  createMockUser({
    email: "enterprise@crm-influ.com",
    name: "Enterprise User",
    plan: "enterprise",
  })
);
