import { create } from "zustand";

type SearchState = {
  location: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  filter: string;
  setSearch: (values: Partial<Omit<SearchState, "setSearch">>) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  location: "Nyali, Mombasa",
  guests: 2,
  checkIn: "2026-08-15",
  checkOut: "2026-08-19",
  filter: "",
  setSearch: (values) => set(values)
}));
