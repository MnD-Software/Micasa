"use client";

import { useEffect, useState } from "react";

export type PublicSiteSettings = {
  nav_badges: {
    experiences: boolean;
    services: boolean;
  };
};

export const defaultPublicSiteSettings: PublicSiteSettings = {
  nav_badges: {
    experiences: false,
    services: false
  }
};

export function usePublicSiteSettings() {
  const [settings, setSettings] = useState<PublicSiteSettings>(defaultPublicSiteSettings);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch("/api/backend/api/site-settings/public", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as PublicSiteSettings;
        if (!cancelled) {
          setSettings({
            nav_badges: {
              ...defaultPublicSiteSettings.nav_badges,
              ...(data.nav_badges ?? {})
            }
          });
        }
      } catch {
        // Keep badges off when settings cannot be loaded.
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
