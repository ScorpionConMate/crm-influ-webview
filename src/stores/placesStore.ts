import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Place } from "@/lib/zod/schemas";

interface PlacesStore {
  places: Place[];
  selectedPlace: Place | null;
  searchQuery: string;
  filter: "all" | "category";
  categoryFilter: string | null;
  setPlaces: (places: Place[]) => void;
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  setSelectedPlace: (place: Place | null) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: "all" | "category") => void;
  setCategoryFilter: (category: string | null) => void;
  filteredPlaces: () => Place[];
}

export const usePlacesStore = create<PlacesStore>()(
  persist(
    (set, get) => ({
      places: [],
      selectedPlace: null,
      searchQuery: "",
      filter: "all",
      categoryFilter: null,
      setPlaces: (places) => set({ places }),
      addPlace: (place) => set((state) => ({ places: [...state.places, place] })),
      updatePlace: (id, updates) => set((state) => ({
        places: state.places.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
      })),
      deletePlace: (id) => set((state) => ({
        places: state.places.filter((p) => p.id !== id),
        selectedPlace: state.selectedPlace?.id === id ? null : state.selectedPlace,
      })),
      setSelectedPlace: (place) => set({ selectedPlace: place }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilter: (filter) => set({ filter }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      filteredPlaces: () => {
        const { places, searchQuery, filter, categoryFilter } = get();
        return places.filter((place) => {
          const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.city.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = filter === "all" || (categoryFilter && place.category === categoryFilter);
          return matchesSearch && matchesCategory;
        });
      },
    }),
    {
      name: "places-storage",
    }
  )
);
