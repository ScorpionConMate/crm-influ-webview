import { create } from "zustand";
import { persist } from "zustand/middleware";
import { placeSchema, type Place } from "@/lib/zod/schemas";

interface PlacesStore {
  places: Place[];
  selectedPlace: Place | null;
  searchQuery: string;
  filter: "all" | "category";
  categoryFilter: string | null;
  setPlaces: (places: Place[]) => void;
  createPlace: (placeData: Omit<Place, "id" | "createdAt" | "updatedAt">) => { success: true; place: Place } | { success: false; error: string };
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updates: Partial<Place>) => { success: true; place: Place } | { success: false; error: string };
  deletePlace: (id: string) => { success: true } | { success: false; error: string };
  setSelectedPlace: (place: Place | null) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: "all" | "category") => void;
  setCategoryFilter: (category: string | null) => void;
  getPlaceById: (id: string) => Place | undefined;
  getAllPlaces: () => Place[];
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
      createPlace: (placeData) => {
        try {
          const now = new Date();
          const placeWithDates = {
            ...placeData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          } as Place;

          const validationResult = placeSchema.safeParse(placeWithDates);
          if (!validationResult.success) {
            return { success: false, error: "Invalid place data" };
          }

          const newPlace = validationResult.data;
          set((state) => ({ places: [...state.places, newPlace] }));
          return { success: true, place: newPlace };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
      addPlace: (place) => set((state) => ({ places: [...state.places, place] })),
      updatePlace: (id, updates) => {
        try {
          const { places } = get();
          const existingPlace = places.find((p) => p.id === id);
          if (!existingPlace) {
            return { success: false, error: "Place not found" };
          }

          const updatedPlace = { ...existingPlace, ...updates, updatedAt: new Date() };
          const validationResult = placeSchema.safeParse(updatedPlace);
          if (!validationResult.success) {
            return { success: false, error: "Invalid place data" };
          }

          set((state) => ({
            places: state.places.map((p) => (p.id === id ? updatedPlace : p)),
          }));
          return { success: true, place: updatedPlace };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
      deletePlace: (id) => {
        try {
          const { places } = get();
          const exists = places.some((p) => p.id === id);
          if (!exists) {
            return { success: false, error: "Place not found" };
          }

          set((state) => ({
            places: state.places.filter((p) => p.id !== id),
            selectedPlace: state.selectedPlace?.id === id ? null : state.selectedPlace,
          }));
          return { success: true };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      },
      setSelectedPlace: (place) => set({ selectedPlace: place }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilter: (filter) => set({ filter }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      getPlaceById: (id) => {
        const { places } = get();
        return places.find((p) => p.id === id);
      },
      getAllPlaces: () => {
        return get().places;
      },
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
