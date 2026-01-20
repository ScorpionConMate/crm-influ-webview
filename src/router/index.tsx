import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { Home } from "@/components/home/Home";
import { Places } from "@/components/places/Places";
import { Pipeline } from "@/components/pipeline/Pipeline";
import { Calendar } from "@/components/calendar/Calendar";
import { MobileShell } from "@/components/layout/shell";

const rootRoute = createRootRoute({
  component: () => (
    <MobileShell>
      <Outlet />
    </MobileShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const placesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/places",
  component: Places,
});

const pipelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pipeline",
  component: Pipeline,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: Calendar,
});

const moreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/more",
  component: More,
});



function More() {
  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold">More</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Settings and profile
      </p>
    </div>
  );
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  placesRoute,
  pipelineRoute,
  calendarRoute,
  moreRoute,
]);

export const router = createRouter({ routeTree });
