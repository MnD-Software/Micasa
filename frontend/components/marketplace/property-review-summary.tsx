"use client";

import { CheckCircle2, KeyRound, Map, MessageSquare, SprayCan, Star, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getDefaultPropertyExperience,
  propertyExperienceStorageKey,
  type PropertyExperience
} from "@/lib/property-experience";
import type { Property } from "@/types/marketplace";

const categoryIcons = [SprayCan, CheckCircle2, KeyRound, MessageSquare, Map, Tag];

export function PropertyReviewSummary({ property }: { property: Property }) {
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
    <section id="reviews" className="content-visibility-auto overflow-hidden border-b border-brand-line py-8 [contain-intrinsic-size:560px] sm:py-10">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-4">
          <Star className="hidden fill-brand-ink text-brand-ink sm:block" size={34} aria-hidden />
          <p className="text-6xl font-bold tracking-normal text-brand-ink sm:text-8xl">{property.rating.toFixed(1)}</p>
          <Star className="hidden fill-brand-ink text-brand-ink sm:block" size={34} aria-hidden />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-brand-ink">Guest favorite</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted sm:text-base">
          This home is a guest favorite based on ratings, reviews, and reliability.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7 lg:gap-5">
        <div className="col-span-2 rounded-2xl border border-brand-line bg-white p-4 shadow-pearl sm:col-span-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <h3 className="font-semibold text-brand-ink">Overall rating</h3>
          <div className="mt-3 grid gap-1.5">
            {[5, 4, 3, 2, 1].map((score) => (
              <div key={score} className="grid grid-cols-[18px_1fr] items-center gap-2 text-sm text-brand-ink">
                <span>{score}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-brand-line">
                  <span className="block h-full rounded-full bg-brand-ink" style={{ width: score === 5 ? "96%" : score === 4 ? "28%" : "7%" }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {experience.reviewCategories.map((category, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];
          return (
            <div key={category.label} className="min-w-0 rounded-2xl border border-brand-line bg-white p-4 shadow-pearl lg:rounded-none lg:border-y-0 lg:border-r-0 lg:bg-transparent lg:pl-5 lg:shadow-none">
              <h3 className="font-semibold text-brand-ink">{category.label}</h3>
              <p className="mt-2 text-2xl font-bold text-brand-ink sm:text-3xl">{category.score.toFixed(1)}</p>
              <Icon className="mt-5 text-brand-ink sm:mt-7" size={28} aria-hidden />
            </div>
          );
        })}
      </div>

      <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {experience.reviewTags.map((tag) => (
          <span key={tag} className="snap-start whitespace-nowrap rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-ink shadow-pearl">
            <Star size={14} className="mr-2 inline fill-brand-strong text-brand-strong" aria-hidden />
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
