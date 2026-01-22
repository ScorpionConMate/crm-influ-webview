export const DEMO_SCENARIOS = [
  "firstRun",
  "emptyDashboard",
  "dashboardWithActivity",
  "remindersGrouping",
  "pipelineEmpty",
  "usageNearLimits",
  "quickReminderCreation",
] as const;

export type DemoScenario = (typeof DEMO_SCENARIOS)[number];

import { seedAllStores, resetAllStores } from "@/lib/mock/seedStores";

export function runDemoScenario(scenario: DemoScenario): void {
  switch (scenario) {
    case "firstRun":
      localStorage.removeItem("onboardingComplete");
      seedAllStores();
      break;
    case "emptyDashboard":
      resetAllStores();
      break;
    case "dashboardWithActivity":
      seedAllStores();
      break;
    case "remindersGrouping":
      seedAllStores();
      break;
    case "pipelineEmpty":
      resetAllStores();
      break;
    case "usageNearLimits":
      seedAllStores();
      break;
    case "quickReminderCreation":
      seedAllStores();
      break;
    default:
      console.warn(`Unknown scenario: ${scenario}`);
      break;
  }
  window.location.reload();
}
