import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { PlusIcon, SearchIcon, ChevronRightIcon, StoreIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "places" | "contacts" | "both";
type ItemType = { type: "place"; place: ReturnType<typeof usePlacesStore.getState>["places"][0] } | { type: "contact"; contact: ReturnType<typeof useContactsStore.getState>["contacts"][0] };

export function Places() {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<FilterType>("both");
  const [searchQuery, setSearchQuery] = React.useState("");

  const { places } = usePlacesStore();
  const { contacts, placeLinks } = useContactsStore();

  const filteredPlaces = React.useMemo(() =>
    places.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    ), [places, searchQuery]);

  const filteredContacts = React.useMemo(() =>
    contacts.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [contacts, searchQuery]);

  const displayItems = React.useMemo(() => {
    const placeItems: ItemType[] = filteredPlaces.map((p) => ({ type: "place" as const, place: p }));
    const contactItems: ItemType[] = filteredContacts.map((c) => ({ type: "contact" as const, contact: c }));

    if (filter === "places") return placeItems;
    if (filter === "contacts") return contactItems;
    return [...placeItems, ...contactItems];
  }, [filteredPlaces, filteredContacts, filter]);

  const items = displayItems;

  const getPlaceForContact = (contactId: string) => {
    const link = placeLinks.find(l => l.contactId === contactId);
    if (!link) return null;
    return places.find(p => p.id === link.placeId) || null;
  };

  const handleItemClick = (item: ItemType) => {
    if (item.type === "place") {
      navigate({ to: `/places/${item.place.id}` });
    } else {
      navigate({ to: `/contacts/${item.contact.id}` });
    }
  };

  const handleAddPlace = () => {
    navigate({ to: "/places/new" });
  };

  const handleAddContact = () => {
    navigate({ to: "/contacts/new" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Search Bar */}
      <div className="sticky z-20 bg-background/95 backdrop-blur-sm px-4 py-2">
        <div className="flex w-full items-center rounded-xl h-12 bg-card shadow-sm border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-center pl-4 pr-2 text-muted-foreground">
            <SearchIcon className="h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="Search places or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-none h-full placeholder:text-slate-400 text-base font-normal leading-normal"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="sticky z-20 bg-background/95 backdrop-blur-sm px-4 py-3 shadow-sm border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setFilter("places")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "places" ? "bg-card dark:bg-slate-700 shadow-sm" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "places" ? "text-primary" : "text-slate-500 dark:text-slate-400"
            )}>
              Places
            </span>
          </button>
          <button
            onClick={() => setFilter("contacts")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "contacts" ? "bg-card dark:bg-slate-700 shadow-sm" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "contacts" ? "text-primary" : "text-slate-500 dark:text-slate-400"
            )}>
              Contacts
            </span>
          </button>
          <button
            onClick={() => setFilter("both")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "both" ? "bg-primary shadow-md" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "both" ? "text-primary-foreground" : "text-slate-500 dark:text-slate-400"
            )}>
              Both
            </span>
          </button>
        </div>
      </div>

      {/* List Content */}
      {items.length === 0 ? (
        <EmptyState filter={filter} searchQuery={searchQuery} onAddPlace={handleAddPlace} onAddContact={handleAddContact} />
      ) : (
        <div className="flex flex-col gap-1 px-4 mt-2 pb-24">
          <div className="pb-1 pt-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {filter === "both" ? "Recent" : filter === "places" ? "Places" : "Contacts"}
            </h3>
          </div>

          {items.map((item) => {
            if (item.type === "place") {
              return (
                <PlaceCard key={item.place.id} place={item.place} onClick={() => handleItemClick(item)} />
              );
            }
            const linkedPlace = getPlaceForContact(item.contact.id);
            return (
              <ContactCard key={item.contact.id} contact={item.contact} linkedPlace={linkedPlace} onClick={() => handleItemClick(item)} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlaceCard({
  place,
  onClick
}: {
  place: {
    id: string;
    name: string;
    city: string;
    category?: string;
  };
  onClick: () => void;
}) {
  const categoryColors: Record<string, string> = {
    "Restaurant": "bg-primary/10 text-primary",
    "Hotel": "bg-purple-500/10 text-purple-500",
    "Gym": "bg-orange-500/10 text-orange-500",
    "Retail": "bg-emerald-500/10 text-emerald-500",
    "Nightlife": "bg-rose-500/10 text-rose-500",
  };

  const badgeClass = categoryColors[place.category || ""] || "bg-muted text-muted-foreground";

  return (
    <button
      onClick={onClick}
      className="group flex gap-4 w-full bg-card border border-slate-100 dark:border-slate-700/50 p-3 rounded-xl shadow-sm items-center active:scale-[0.99] transition-transform text-left hover:border-primary/50"
    >
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-[72px] shrink-0 border border-slate-100 dark:border-slate-700/50 bg-gradient-to-br from-primary to-[#0ea5c6] flex items-center justify-center text-white text-2xl font-bold">
        {place.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight truncate">
            {place.name}
          </p>
        </div>
        {place.category && (
          <div className="flex items-center gap-2">
            <span className={`${badgeClass} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
              {place.category}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPinIcon className="h-3.5 w-3.5" />
          <p className="text-xs font-normal leading-normal truncate">
            {place.city}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-muted-foreground">
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </button>
  );
}

function ContactCard({
  contact,
  linkedPlace,
  onClick
}: {
  contact: {
    id: string;
    name: string;
    role?: string;
    email?: string;
  };
  linkedPlace: { name: string } | null;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex gap-4 w-full bg-card border border-slate-100 dark:border-slate-700/50 p-3 rounded-xl shadow-sm items-center active:scale-[0.99] transition-transform text-left hover:border-primary/50"
    >
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-[72px] shrink-0 border border-slate-100 dark:border-slate-700/50 bg-gradient-to-br from-primary to-[#0ea5c6] flex items-center justify-center text-white text-2xl font-bold">
        {contact.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
        <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight truncate">
          {contact.name}
        </p>
        {contact.role && (
          <p className="text-muted-foreground text-sm font-normal leading-normal truncate">
            {contact.role}
          </p>
        )}
        <div className="flex items-center gap-1 text-muted-foreground">
          <StoreIcon className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
            {linkedPlace ? linkedPlace.name : contact.email || "No email"}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-muted-foreground">
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </button>
  );
}

function EmptyState({
  filter,
  searchQuery,
  onAddPlace,
  onAddContact
}: {
  filter: FilterType;
  searchQuery: string;
  onAddPlace: () => void;
  onAddContact: () => void;
}) {
  const title = filter === "places" ? "No places found" : filter === "contacts" ? "No contacts found" : "No results found";
  const message = searchQuery
    ? "Try adjusting your search query"
    : filter === "places"
      ? "Add your first place to get started"
      : filter === "contacts"
        ? "Add your first contact to get started"
        : "Add places and contacts to build your directory";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
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
          {title}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          {message}
        </p>
      </div>

      <div className="w-full pb-6 pt-8 space-y-3">
        {filter === "both" || filter === "places" ? (
          <button
            onClick={onAddPlace}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Place</span>
          </button>
        ) : null}
        {filter === "both" || filter === "contacts" ? (
          <button
            onClick={onAddContact}
            className={cn(
              "w-full py-3.5 px-4 rounded-xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2",
              filter === "contacts"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-slate-100 dark:bg-card hover:bg-accent text-slate-700 dark:text-slate-200"
            )}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Contact</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
