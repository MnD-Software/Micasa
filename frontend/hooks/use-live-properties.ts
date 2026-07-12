"use client";

import { useEffect, useState } from "react";
import { mergedPublicPropertiesFromApi, type ApiProperty } from "@/lib/api-property-mapper";
import { properties as fallbackProperties } from "@/lib/marketplace-data";
import type { Property } from "@/types/marketplace";

export function useLiveProperties() {
  const [properties, setProperties] = useState<Property[]>(fallbackProperties);

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      try {
        const response = await fetch("/api/backend/api/properties", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as ApiProperty[];
        const liveProperties = mergedPublicPropertiesFromApi(data);
        if (!cancelled) {
          setProperties(liveProperties);
        }
      } catch {
        // Keep the bundled catalogue if the backend is unavailable.
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  return properties;
}
