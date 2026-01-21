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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center h-12 justify-between px-4">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight">Directory</h1>
          <button
            onClick={handleAddPlace}
            className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 transition-colors"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-[48px] z-20 bg-white dark:bg-slate-900 px-4 py-2">
        <div className="flex w-full items-center rounded-lg h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-center pl-4 pr-2 text-slate-400">
            <SearchIcon className="h-6 w-6" />
          </div>
          <input
            type="text"
            placeholder="Search places or contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none h-full placeholder:text-slate-400 text-base font-normal leading-normal"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="sticky top-[110px] z-20 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
          <button
            onClick={() => setFilter("places")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "places" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "places" ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
            )}>
              Places
            </span>
          </button>
          <button
            onClick={() => setFilter("contacts")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "contacts" ? "bg-white dark:bg-slate-700 shadow-sm" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "contacts" ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
            )}>
              Contacts
            </span>
          </button>
          <button
            onClick={() => setFilter("both")}
            className={cn(
              "group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all",
              filter === "both" ? "bg-cyan-500 shadow-md" : ""
            )}
          >
            <span className={cn(
              "truncate text-sm font-medium",
              filter === "both" ? "text-white" : "text-slate-500 dark:text-slate-400"
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
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
    "Restaurant": "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400",
    "Hotel": "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    "Gym": "bg-orange-500/10 text-orange-500 dark:text-orange-400",
    "Retail": "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    "Nightlife": "bg-rose-500/10 text-rose-500 dark:text-rose-400",
  };

  const badgeClass = categoryColors[place.category || ""] || "bg-slate-500/10 text-slate-500 dark:text-slate-400";

  return (
    <button
      onClick={onClick}
      className="group flex gap-4 w-full bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 items-center active:scale-[0.99] transition-transform text-left"
    >
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[72px] shrink-0 border border-slate-100 dark:border-slate-700 bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
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
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <MapPinIcon className="h-3.5 w-3.5" />
          <p className="text-xs font-normal leading-normal truncate">
            {place.city}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-slate-300 dark:text-slate-600">
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
      className="group flex gap-4 w-full bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 items-center active:scale-[0.99] transition-transform text-left"
    >
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-[72px] shrink-0 border border-slate-100 dark:border-slate-700 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
        {contact.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
        <p className="text-slate-900 dark:text-white text-base font-semibold leading-tight truncate">
          {contact.name}
        </p>
        {contact.role && (
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal truncate">
            {contact.role}
          </p>
        )}
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <StoreIcon className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
            {linkedPlace ? linkedPlace.name : contact.email || "No email"}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-slate-300 dark:text-slate-600">
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
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full transform scale-75" />
          {/* Floating Icon overlay */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute bottom-4 right-10 bg-slate-800 border border-white/10 p-4 rounded-2xl shadow-xl transform rotate-6">
              <MapPinIcon className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            </div>
            <MapPinIcon className="h-24 w-24 text-slate-300 dark:text-slate-600" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 max-w-xs mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
          {message}
        </p>
      </div>

      <div className="w-full pb-6 pt-8 space-y-3">
        {filter === "both" || filter === "places" ? (
          <button
            onClick={onAddPlace}
            className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-base shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
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
