"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  getDefaultPropertyExperience,
  propertyExperienceStorageKey,
  type PropertyExperience
} from "@/lib/property-experience";
import type { Property } from "@/types/marketplace";

export function PropertySleepRooms({ property }: { property: Property }) {
  const defaultExperience = useMemo(() => getDefaultPropertyExperience(property), [property]);
  const [experience, setExperience] = useState<PropertyExperience>(defaultExperience);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(propertyExperienceStorageKey(property.id));
      if (stored) {
        setExperience({ ...defaultExperience, ...(JSON.parse(stored) as Partial<PropertyExperience>) });
      }
    } catch {
      setExperience(defaultExperience);
    }
  }, [defaultExperience, property.id]);

  return (
    <section className="content-visibility-auto border-b border-brand-line py-6 [contain-intrinsic-size:420px] sm:py-8">
      <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">Where you will sleep</h2>
      <div className="-mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-2 lg:overflow-visible">
        {experience.sleepRooms.map((room, index) => (
          <article key={`${room.title}-${index}`} className="w-[74vw] max-w-[320px] shrink-0 snap-start sm:w-[280px] lg:w-auto lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-soft shadow-pearl">
              {room.image ? (
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 280px, 74vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <h3 className="mt-3 text-base font-bold text-brand-ink">{room.title}</h3>
            <p className="mt-1 text-sm text-brand-muted">{room.beds}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
