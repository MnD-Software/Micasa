"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SavedStore = {
  savedByAccount: Record<string, string[]>;
  getSavedIds: (accountKey: string) => string[];
  isSaved: (id: string, accountKey: string) => boolean;
  toggleSaved: (id: string, accountKey: string) => void;
};

const guestAccountKey = "guest";

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedByAccount: {},
      getSavedIds: (accountKey) => (get().savedByAccount ?? {})[accountKey] ?? [],
      isSaved: (id, accountKey) => ((get().savedByAccount ?? {})[accountKey] ?? []).includes(id),
      toggleSaved: (id, accountKey) =>
        set((state) => ({
          savedByAccount: {
            ...(state.savedByAccount ?? {}),
            [accountKey]: ((state.savedByAccount ?? {})[accountKey] ?? []).includes(id)
              ? ((state.savedByAccount ?? {})[accountKey] ?? []).filter((savedId) => savedId !== id)
              : [id, ...((state.savedByAccount ?? {})[accountKey] ?? [])]
          }
        }))
    }),
    {
      name: "micasa-saved-homes",
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SavedStore> & { savedIds?: string[] };
        return {
          ...currentState,
          ...persisted,
          savedByAccount: {
            ...(currentState.savedByAccount ?? {}),
            ...(persisted.savedByAccount ?? {}),
            ...(persisted.savedIds ? { [guestAccountKey]: persisted.savedIds } : {})
          }
        };
      }
    }
  )
);
