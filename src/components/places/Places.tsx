import { useState } from "react";
import { usePlacesStore } from "@/stores/placesStore";
import { useContactsStore } from "@/stores/contactsStore";
import { SearchIcon, ChevronRightIcon, StoreIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "places" | "contacts" | "both";

export function Places() {
  const [filter, setFilter] = useState<FilterType>("both");
  const [searchQuery, setSearchQuery] = useState("");

  const { places } = usePlacesStore();
  const { contacts } = useContactsStore();

  const filteredPlaces = places.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayItems = () => {
    if (filter === "places") return filteredPlaces.map((p) => ({ ...p, type: "place" as const }));
    if (filter === "contacts") return filteredContacts.map((c) => ({ ...c, type: "contact" as const }));
    return [
      ...filteredPlaces.map((p) => ({ ...p, type: "place" as const })),
      ...filteredContacts.map((c) => ({ ...c, type: "contact" as const })),
    ];
  };

  const items = displayItems();

  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center gap-2 h-12 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 px-4">
        <SearchIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search places or contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-slate-900 dark:text-white focus:outline-none text-base"
        />
      </div>

      <div className="flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-lg p-1 h-10">
        <button
          onClick={() => setFilter("places")}
          className={cn(
            "flex-1 h-full flex items-center justify-center rounded-md transition-all text-sm font-medium",
            filter === "places" ? "bg-white dark:bg-slate-700 text-cyan-500 shadow-sm" : "text-slate-500 dark:text-slate-400"
          )}
        >
          Places
        </button>
        <button
          onClick={() => setFilter("contacts")}
          className={cn(
            "flex-1 h-full flex items-center justify-center rounded-md transition-all text-sm font-medium",
            filter === "contacts" ? "bg-white dark:bg-slate-700 text-cyan-500 shadow-sm" : "text-slate-500 dark:text-slate-400"
          )}
        >
          Contacts
        </button>
        <button
          onClick={() => setFilter("both")}
          className={cn(
            "flex-1 h-full flex items-center justify-center rounded-md transition-all text-sm font-medium",
            filter === "both" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-500 dark:text-slate-400"
          )}
        >
          Both
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MapPinIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No {filter === "places" ? "places" : filter === "contacts" ? "contacts" : "results"} found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Try adjusting your search or add a new place
          </p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Add New Place
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-2">
          <div className="pb-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {filter === "both" ? "All" : filter === "places" ? "Places" : "Contacts"}
            </h3>
          </div>

          {items.map((item) => {
            if (item.type === "place") {
              return (
                <PlaceCard key={item.id} place={item} />
              );
            }
            return (
              <ContactCard key={item.id} contact={item} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlaceCard({ place }: { place: { name: string; city: string; category?: string } }) {
  return (
    <div className="group flex gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 items-center active:scale-[0.99] transition-transform cursor-pointer">
      <div className="aspect-square w-18 h-18 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
        {place.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
            {place.name}
          </p>
        </div>
        {place.category && (
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {place.category}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <MapPinIcon className="h-3.5 w-3.5" />
          <p className="text-xs font-normal truncate">
            {place.city}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-slate-300 dark:text-slate-600">
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: { name: string; role?: string; email?: string } }) {
  return (
    <div className="group flex gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 items-center active:scale-[0.99] transition-transform cursor-pointer">
      <div className="aspect-square w-18 h-18 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
        {contact.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
        <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
          {contact.name}
        </p>
        {contact.role && (
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal truncate">
            {contact.role}
          </p>
        )}
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <StoreIcon className="h-3.5 w-3.5 text-cyan-500" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
            {contact.email || "No email"}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-slate-300 dark:text-slate-600">
        <ChevronRightIcon className="h-5 w-5" />
      </div>
    </div>
  );
}
