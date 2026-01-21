import { createRouter, createRoute, createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/home/Home";
import { Places } from "@/components/places/Places";
import { Pipeline } from "@/components/pipeline/Pipeline";
import { Calendar } from "@/components/calendar/Calendar";
import { MobileShell } from "@/components/layout/shell";
import { CreatePlace } from "@/components/CreatePlace";
import { PlaceDetail } from "@/components/PlaceDetail";
import { AddContact } from "@/components/AddContact";
import { ContactDetail } from "@/components/ContactDetail";

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

// Place routes
const placesNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/places/new",
  component: CreatePlace,
});

const placeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/places/$id",
  component: PlaceDetailWrapper,
});

function PlaceDetailWrapper() {
  const { id } = placeDetailRoute.useParams();
  return <PlaceDetail placeId={id} />;
}

// Contact routes
const contactsNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts/new",
  component: AddContact,
});

const contactDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contacts/$id",
  component: ContactDetailWrapper,
});

function ContactDetailWrapper() {
  const navigate = useNavigate();
  const { id } = contactDetailRoute.useParams();
  const handleBack = () => {
    navigate({ to: "/places" });
  };
  return <ContactDetail contactId={id} onBack={handleBack} />;
}



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
  placesNewRoute,
  placeDetailRoute,
  contactsNewRoute,
  contactDetailRoute,
  pipelineRoute,
  calendarRoute,
  moreRoute,
]);

export const router = createRouter({ routeTree });
