import * as React from "react";
import { usePlacesStore } from "@/stores/placesStore";
import { useVisitsStore } from "@/stores/visitsStore";
import { useContactsStore } from "@/stores/contactsStore";
import { useDealsStore } from "@/stores/dealsStore";
import { ArrowLeftIcon, SearchIcon, MapPinIcon, ClockIcon, UserIcon, CheckIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/zod/schemas";
import { useNavigate } from "@tanstack/react-router";

export function StartVisit() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeals, setSelectedDeals] = React.useState<Record<string, string>>({});
  const [showDealPicker, setShowDealPicker] = React.useState<string | null>(null);

  const { places } = usePlacesStore();
  const { startVisit } = useVisitsStore();
  const { contacts, placeLinks } = useContactsStore();

  const filteredPlaces = React.useMemo(() =>
    places.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [places, searchQuery]);

  const formattedDate = React.useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getContactForPlace = (placeId: string) => {
    const link = placeLinks.find((l) => l.placeId === placeId);
    if (!link) return null;
    return contacts.find((c) => c.id === link.contactId) || null;
  };

  const getActiveDealsForPlace = (placeId: string): Deal[] => {
    const { getDealsByPlace } = useDealsStore();
    const placeDeals = getDealsByPlace(placeId);
    
    return placeDeals.filter((deal) => {
      // Only return active deals (not lost, not paid)
      return deal.status !== "lost" && deal.status !== "paid";
    });
  };

  const handleStartVisit = (placeId: string) => {
    const dealId = selectedDeals[placeId];
    const visit = startVisit(placeId, dealId);
    navigate({ to: `/checkin/${visit.id}/notes` });
  };

  const handleDealSelect = (placeId: string, dealId: string) => {
    setSelectedDeals((prev) => ({
      ...prev,
      [placeId]: dealId,
    }));
    setShowDealPicker(null);
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const handleManualCheckIn = () => {
    // For now, navigate to places to select one
    // Future: open place selection modal
    navigate({ to: "/places" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card px-4 py-4 shadow-sm border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Select Event
          </h1>
          <div className="w-16" /> {/* Spacer for balance */}
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {formattedDate}
        </p>
      </div>

      {/* Search Bar */}
      <div className="sticky top-[60px] z-20 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex w-full items-center rounded-xl h-12 bg-card shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-center pl-4 pr-2 text-muted-foreground">
            <SearchIcon className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-none h-full placeholder:text-slate-400 text-base font-normal leading-normal"
          />
        </div>
      </div>

      {/* Places List */}
      <div className="flex-1 px-4 py-4 pb-32">
        {filteredPlaces.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <div className="space-y-3">
            {filteredPlaces.map((place, index) => {
              const contact = getContactForPlace(place.id);
              const isNearby = index < 2; // Mock: Show nearby for first 2 places
              const activeDeals = getActiveDealsForPlace(place.id);
              const selectedDealId = selectedDeals[place.id];

              return (
                <PlaceCard
                  key={place.id}
                  place={place}
                  contact={contact}
                  isNearby={isNearby}
                  activeDeals={activeDeals}
                  selectedDealId={selectedDealId}
                  showDealPicker={showDealPicker === place.id}
                  onDealSelect={(dealId) => handleDealSelect(place.id, dealId)}
                  onToggleDealPicker={() => setShowDealPicker(showDealPicker === place.id ? null : place.id)}
                  onStartVisit={() => handleStartVisit(place.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Check-In Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-slate-200 dark:border-slate-700/50 px-4 py-4 shadow-lg pb-safe-bottom">
        <button
          onClick={handleManualCheckIn}
          className="w-full py-3.5 px-4 bg-card hover:bg-accent text-slate-900 dark:text-white rounded-xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Manual Check-In</span>
        </button>
      </div>
    </div>
  );
}

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    city: string;
    category?: string;
    address?: string;
  };
  contact: {
    id: string;
    name: string;
    role?: string;
  } | null;
  isNearby: boolean;
  activeDeals: Deal[];
  selectedDealId: string | undefined;
  showDealPicker: boolean;
  onDealSelect: (dealId: string) => void;
  onToggleDealPicker: () => void;
  onStartVisit: () => void;
}

function PlaceCard({
  place,
  contact,
  isNearby,
  activeDeals,
  selectedDealId,
  showDealPicker,
  onDealSelect,
  onToggleDealPicker,
  onStartVisit,
}: PlaceCardProps) {
  const getSelectedDeal = () => {
    if (!selectedDealId) return null;
    return activeDeals.find((d) => d.id === selectedDealId) || null;
  };

  const selectedDeal = getSelectedDeal();

  return (
    <div className="bg-card border border-slate-100 dark:border-slate-700/50 rounded-xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Place Icon */}
          <div className="bg-gradient-to-br from-primary to-[#0ea5c6] rounded-xl size-16 shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-inner">
            {place.name.charAt(0).toUpperCase()}
          </div>

          {/* Place Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                {place.name}
              </h3>
              {isNearby && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400">
              <MapPinIcon className="h-3.5 w-3.5" />
              <p className="text-xs font-normal truncate">
                {place.address || place.city}
              </p>
            </div>

            {/* Contact */}
            {contact && (
              <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400">
                <UserIcon className="h-3.5 w-3.5" />
                <p className="text-xs font-normal truncate">
                  {contact.name}
                  {contact.role && ` • ${contact.role}`}
                </p>
              </div>
            )}

            {/* Last Visit Time (Mock) */}
            <div className="flex items-center gap-1 mt-1 text-slate-400 dark:text-slate-500">
              <ClockIcon className="h-3.5 w-3.5" />
              <p className="text-xs font-normal">
                Last visit: 3 days ago
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Picker Section */}
      {activeDeals.length > 0 && (
        <div className="px-4 pb-3">
          <button
            onClick={onToggleDealPicker}
            className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Linked Deal
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedDeal ? (
                  <>
                    <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400 truncate">
                      {selectedDeal.title}
                    </span>
                    <CheckIcon className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                  </>
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {activeDeals.length} active deal{activeDeals.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {showDealPicker && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => onDealSelect("")}
                  className={cn(
                    "w-full p-2.5 rounded-lg text-left transition-all border",
                    !selectedDealId
                      ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 dark:border-cyan-400"
                      : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                  )}
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    No linked deal
                  </p>
                </button>
                {activeDeals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => onDealSelect(deal.id)}
                    className={cn(
                      "w-full p-2.5 rounded-lg text-left transition-all border",
                      selectedDealId === deal.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500 dark:border-cyan-400"
                        : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                    )}
                  >
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {deal.title}
                    </p>
                    {deal.estimatedValue && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        ${deal.estimatedValue.toLocaleString()}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Start Check-In Button */}
      <div className="px-4 pb-4">
        <button
          onClick={onStartVisit}
          className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-base shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckIcon className="h-5 w-5" />
          <span>Start Check-In</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full flex flex-col items-center justify-center mb-8">
        <div className="relative w-64 h-64 mb-6">
          {/* Abstract Glow Background */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform scale-75" />
          {/* Floating Icon overlay */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute bottom-4 right-10 bg-card border border-border p-4 rounded-2xl shadow-xl transform rotate-6">
              <MapPinIcon className="h-8 w-8 text-primary" />
            </div>
            <MapPinIcon className="h-24 w-24 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 max-w-xs mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {searchQuery ? "No places found" : "No places yet"}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          {searchQuery
            ? "Try adjusting your search query"
            : "Add places to start checking in"}
        </p>
      </div>

      <div className="w-full pb-6 pt-8 space-y-3">
        <button
          onClick={() => navigate({ to: "/places" })}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Place</span>
        </button>
      </div>
    </div>
  );
}
