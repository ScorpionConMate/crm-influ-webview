import { createRouter, createRoute, createRootRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import * as React from "react";
import { Home } from "@/components/home/Home";
import { Places } from "@/components/places/Places";
import { Pipeline } from "@/components/pipeline/Pipeline";
import { DealDetail } from "@/components/pipeline/DealDetail";
import { DealCreate } from "@/components/pipeline/DealCreate";
import { Calendar } from "@/components/calendar/Calendar";
import { MobileShell } from "@/components/layout/shell";
import { CreatePlace } from "@/components/CreatePlace";
import { PlaceDetail } from "@/components/PlaceDetail";
import { AddContact } from "@/components/AddContact";
import { ContactDetail } from "@/components/ContactDetail";
import { StartVisit } from "@/components/checkin/StartVisit";
import { VisitNotes } from "@/components/checkin/VisitNotes";
import { VisitHistory } from "@/components/checkin/VisitHistory";
import { VisitSummary } from "@/components/checkin/VisitSummary";
import { useVisitsStore } from "@/stores/visitsStore";
import { QuickReminder } from "@/components/reminders/QuickReminder";
import { ProfileSettings } from "@/components/ProfileSettings";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <MobileShell showFAB={true} >
        <Outlet />
      </MobileShell>
    );
  },
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

const dealDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deals/$id",
  component: DealDetailWrapper,
});

const dealNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deals/new",
  component: DealCreate,
});

function DealDetailWrapper() {
  const navigate = useNavigate();
  const { id } = dealDetailRoute.useParams();
  const handleBack = () => {
    navigate({ to: "/pipeline" });
  };
  return <DealDetail dealId={id} onBack={handleBack} />;
}

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

// Check-in routes
function CheckinStartGuard() {
  const navigate = useNavigate();
  const { activeVisit } = useVisitsStore();

  React.useEffect(() => {
    // If there's an active visit, redirect to its notes page
    if (activeVisit) {
      navigate({ to: `/checkin/${activeVisit.id}/notes`, replace: true });
    }
  }, [activeVisit, navigate]);

  return <StartVisit />;
}

function CheckinVisitGuard({ visitId, Component }: { visitId: string; Component: React.ComponentType<{ visitId: string }> }) {
  const navigate = useNavigate();
  const { activeVisit, visits } = useVisitsStore();

  const visit = React.useMemo(() => {
    // Check active visit first, then look in all visits
    if (activeVisit?.id === visitId) return activeVisit;
    return visits.find((v) => v.id === visitId);
  }, [visitId, activeVisit, visits]);

  React.useEffect(() => {
    // If no visit found, redirect to start
    if (!visit) {
      navigate({ to: "/checkin/start", replace: true });
    }
  }, [visit, navigate]);

  if (!visit) return null;
  return <Component visitId={visitId} />;
}

const startVisitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin/start",
  component: CheckinStartGuard,
});

const visitNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin/$id/notes",
  component: () => {
    const { id } = visitNotesRoute.useParams();
    return <CheckinVisitGuard visitId={id} Component={VisitNotes} />;
  },
});

const visitHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin/$id/history",
  component: () => {
    const { id } = visitHistoryRoute.useParams();
    return <CheckinVisitGuard visitId={id} Component={VisitHistory} />;
  },
});

const visitSummaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkin/$id/summary",
  component: () => {
    const { id } = visitSummaryRoute.useParams();
    return <CheckinVisitGuard visitId={id} Component={VisitSummary} />;
  },
});

// Quick Reminder route
const quickReminderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reminders/new",
  component: QuickReminderWrapper,
});

// Profile & Settings route
function ProfileSettingsWrapper() {
  return (
    <MobileShell showFAB={false} showTopBar={false}>
      <ProfileSettings />
    </MobileShell>
  );
}

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfileSettingsWrapper,
});

function QuickReminderWrapper() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <MobileShell showFAB={false}>
      <QuickReminder open={isOpen} onOpenChange={setIsOpen} />
    </MobileShell>
  );
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
  dealDetailRoute,
  dealNewRoute,
  calendarRoute,
  moreRoute,
  quickReminderRoute,
  profileRoute,
  startVisitRoute,
  visitNotesRoute,
  visitHistoryRoute,
  visitSummaryRoute,
]);

export const router = createRouter({ routeTree });
