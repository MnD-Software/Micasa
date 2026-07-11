"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountUser = {
  email: string;
  fullName: string;
  role: "guest" | "host" | "admin";
};

type AuthStore = {
  token: string | null;
  user: AccountUser | null;
  accountKey: string;
  isAuthenticated: boolean;
  setSession: (token: string, user: AccountUser) => void;
  clearSession: () => void;
};

export const guestAccountKey = "guest";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      accountKey: guestAccountKey,
      isAuthenticated: false,
      setSession: (token, user) =>
        set({
          token,
          user,
          accountKey: user.email.toLowerCase(),
          isAuthenticated: true
        }),
      clearSession: () =>
        set({
          token: null,
          user: null,
          accountKey: guestAccountKey,
          isAuthenticated: false
        })
    }),
    {
      name: "micasa-account-session"
    }
  )
);
