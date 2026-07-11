"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SavedStore = {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedIds: [],
      isSaved: (id) => get().savedIds.includes(id),
      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [id, ...state.savedIds]
        }))
    }),
    {
      name: "micasa-saved-homes"
    }
  )
);
