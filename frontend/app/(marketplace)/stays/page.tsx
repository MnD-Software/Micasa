"use client";

import { ListFilter, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { Button } from "@/components/ui/button";
import { useLiveProperties } from "@/hooks/use-live-properties";
import { filterProperties, stayFilterOptions } from "@/lib/property-filters";
import { useSearchStore } from "@/store/search-store";

export default function StaysPage() {
  const properties = useLiveProperties();
  const search = useSearchStore();
  const setSearch = useSearchStore((state) => state.setSearch);
  const { formatMoney } = usePreferences();
  const [urlFilter, setUrlFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextFilter = params.get("filter") ?? "";
    const nextLocation = params.get("location");
    const nextGuests = Number(params.get("guests") ?? "");
    setUrlFilter(nextFilter);
    setSearch({
      ...(nextFilter ? { filter: nextFilter } : {}),
      ...(nextLocation ? { location: nextLocation } : {}),
      ...(nextGuests > 0 ? { guests: nextGuests } : {})
    });
  }, [setSearch]);

  const filtered = useMemo(() => filterProperties(properties, { ...search, filter: urlFilter || search.filter }), [properties, search, urlFilter]);

  function applyFilter(filter: string) {
    setUrlFilter(filter);
    setSearch({ filter });
    const params = new URLSearchParams(window.location.search);
    if (filter) {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    window.history.replaceState(null, "", `/stays${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] overflow-x-hidden px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section className="rounded-[26px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-strong">
                <ListFilter size={16} aria-hidden />
                List view
              </p>
              <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-4xl">All Micasa stays</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
                {filtered.length} stays matching {search.location || "your search"} for {search.guests} guest{search.guests === 1 ? "" : "s"}.
              </p>
            </div>
            <Link href="/#featured-stays">
              <Button variant="secondary">
                <Search size={18} aria-hidden />
                Back to explore
              </Button>
            </Link>
          </div>
        </section>

        <section className="sticky top-[70px] z-20 -mx-4 mt-4 border-y border-brand-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {stayFilterOptions.map(([value, label], index) => {
              const active = (urlFilter || search.filter) === value || (index === 0 && !(urlFilter || search.filter));
              return (
                <button
                  key={label}
                  className={[
                    "focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                    active ? "border-brand-ink bg-brand-ink text-white shadow-pearl" : "border-brand-line bg-white text-brand-muted hover:border-brand-ink hover:text-brand-ink"
                  ].join(" ")}
                  onClick={() => applyFilter(value)}
                  type="button"
                >
                  {index === 0 ? <SlidersHorizontal size={16} aria-hidden /> : null}
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {filtered.map((property) => (
            <article key={property.id} className="overflow-hidden rounded-[24px] border border-brand-line bg-white shadow-pearl">
              <Link className="grid gap-0 sm:grid-cols-[280px_1fr]" href={`/property/${property.slug}`}>
                <div className="relative aspect-[4/3] bg-brand-soft sm:aspect-auto sm:min-h-56">
                  <Image src={property.images[0]} alt={property.title} fill sizes="(min-width: 640px) 280px, 100vw" className="object-cover" />
                </div>
                <div className="min-w-0 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">{property.type}</p>
                      <h2 className="mt-1 line-clamp-2 text-xl font-bold text-brand-ink">{property.title}</h2>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-ink">
                      <Star size={15} className="fill-brand-ink" aria-hidden />
                      {property.rating}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm text-brand-muted">
                    <MapPin size={14} className="mr-1 inline" aria-hidden />
                    {property.location}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-muted">{property.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-brand-muted">
                    <span>{property.guests} guests</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                  <p className="mt-4 text-base font-bold text-brand-ink">{formatMoney(property.pricePerNight)} <span className="font-normal text-brand-muted">night</span></p>
                </div>
              </Link>
            </article>
          ))}
          {!filtered.length ? (
            <div className="grid min-h-80 place-items-center rounded-[24px] border border-brand-line bg-white p-8 text-center shadow-pearl">
              <div>
                <h2 className="text-2xl font-bold text-brand-ink">No stays match those filters</h2>
                <p className="mt-2 text-sm text-brand-muted">Clear filters or lower the guest count to see more stays.</p>
                <Button className="mt-5" onClick={() => applyFilter("")}>Clear filters</Button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
