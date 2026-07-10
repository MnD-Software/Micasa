"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Building2, ConciergeBell, ShieldCheck, Sparkles, Waves, Wifi } from "lucide-react";
import { PropertyCard } from "@/components/marketplace/property-card";
import { destinations, experiences, properties } from "@/lib/marketplace-data";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { nightsBetween } from "@/lib/utils";
import { useSearchStore } from "@/store/search-store";

const nextMonthHomes = properties;

function RailHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <a className="group inline-flex min-w-0 items-center gap-3" href="#featured-stays">
        <h2 className="truncate text-2xl font-bold tracking-normal text-brand-ink sm:text-3xl">
          {title}
        </h2>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition group-hover:border-brand-line">
          <ArrowRight size={22} aria-hidden />
        </span>
      </a>
      <div className="hidden items-center gap-3 sm:flex">
        <button
          aria-label={`Previous ${title}`}
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white bg-brand-ivory text-brand-muted shadow-pearl"
          type="button"
        >
          <ArrowLeft size={20} aria-hidden />
        </button>
        <button
          aria-label={`Next ${title}`}
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl"
          type="button"
        >
          <ArrowRight size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function PropertyRail({ title, items }: { title: string; items: typeof properties }) {
  return (
    <section id={title === "Popular homes in Mombasa" ? "featured-stays" : undefined} className="py-8 sm:py-10">
      <RailHeader title={title} />
      <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        {items.map((property, index) => (
          <div
            key={`${property.id}-${title}-${index}`}
            className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[268px] lg:w-[272px]"
          >
            <PropertyCard property={property} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeSections() {
  const search = useSearchStore();
  const { formatMoney } = usePreferences();
  const query = search.location.trim().toLowerCase();
  const searchedHomes = properties.filter((property) => {
    const haystack = `${property.title} ${property.location} ${property.category} ${property.type}`.toLowerCase();
    return property.guests >= search.guests && (!query || haystack.includes(query.split(",")[0]));
  });
  const availableHomes = searchedHomes.length > 0 ? searchedHomes : properties.filter((property) => property.guests >= search.guests);
  const nights = nightsBetween(search.checkIn, search.checkOut);
  const searchSummary = `${availableHomes.length} available ${availableHomes.length === 1 ? "property" : "properties"} for ${search.guests} ${search.guests === 1 ? "guest" : "guests"} - ${nights} ${nights === 1 ? "night" : "nights"}`;
  const flagship = properties[2] ?? properties[0];

  return (
    <main className="mx-auto max-w-[1820px] px-4 pb-28 pt-4 sm:px-6 sm:py-6 lg:px-10">
      <section className="mb-3 rounded-[28px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">
          Live collection
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-ink sm:text-3xl">
              Available Micasa stays near {search.location || "your destination"}
            </h1>
            <p className="mt-1 text-sm text-brand-muted">{searchSummary}</p>
          </div>
          <p className="text-sm font-semibold text-brand-ink">
            {search.checkIn} to {search.checkOut}
          </p>
        </div>
      </section>

      <section className="my-8 grid gap-5 overflow-hidden rounded-[34px] border border-white bg-brand-ink p-4 text-white shadow-luxe ring-1 ring-brand-line/70 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[28px]">
          <Image
            src={flagship.images[0]}
            alt={flagship.title}
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.58))]" />
          <div className="absolute bottom-0 p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/72">Signature stay</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">{flagship.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/78">
              Sea views, pool access, secure parking, fast Wi-Fi, and a fully equipped kitchen in prime Nyali.
            </p>
          </div>
        </div>
        <div className="grid content-between gap-5 p-2 sm:p-5">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78 backdrop-blur">
              Micasa stay OS
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">
              A polished booking layer for coastal comfort.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              The catalogue now separates the luxury villa, family apartment, sea-view apartment, and one-bedroom stay so guests can quickly choose by group size, rate, and vibe.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [Waves, "Beach-first", "2 to 10 minutes from the coast"],
              [Wifi, "Fast Wi-Fi", "Work, stream, and plan smoothly"],
              [ConciergeBell, "Chef optional", "Private chef on request"],
              [ShieldCheck, "Secure stays", "Parking and 24/7 manned security"]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur-xl">
                <Icon size={20} className="text-brand-gold" aria-hidden />
                <p className="mt-3 font-bold">{String(title)}</p>
                <p className="mt-1 text-xs leading-5 text-white/64">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PropertyRail title={`Available stays in ${search.location || "Nyali, Mombasa"}`} items={availableHomes} />
      <PropertyRail title="Fresh coastal picks for next month" items={nextMonthHomes} />

      <section className="my-8 grid gap-4 rounded-[32px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70 sm:grid-cols-[1fr_1fr_1fr] sm:p-6">
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 shrink-0 text-brand-success" size={24} aria-hidden />
          <div>
            <h2 className="font-bold text-brand-ink">Own-property booking platform</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Guests can search, compare capacity, check availability, choose rooms, and continue with M-Pesa, card-ready checkout, or WhatsApp booking.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Building2 className="mt-1 shrink-0 text-brand-strong" size={24} aria-hidden />
          <div>
            <h2 className="font-bold text-brand-ink">Marketplace expansion ready</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              The operating model starts with owned stays and can expand into paid owner listings once the admin chooses to launch marketplace mode.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Sparkles className="mt-1 shrink-0 text-brand-gold" size={24} aria-hidden />
          <div>
            <h2 className="font-bold text-brand-ink">Coming soon controls</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Public owner onboarding and live payments are labelled coming soon until enabled from the admin side.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <RailHeader title="Guest favorite destinations" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <article key={destination.city} className="overflow-hidden rounded-[28px] border border-white bg-brand-ivory shadow-pearl ring-1 ring-brand-line/70">
              <div
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${destination.image})` }}
                role="img"
                aria-label={destination.city}
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-brand-ink">{destination.city}</h3>
                <p className="text-sm text-brand-muted">
                  {destination.country} - {destination.properties} homes
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-16 pt-8">
        <RailHeader title="Experiences to add to your stay" />
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          {experiences.map((experience) => (
            <article key={experience.title} className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[300px]">
              <div
                className="aspect-[4/3] rounded-[28px] bg-cover bg-center"
                style={{ backgroundImage: `url(${experience.image})` }}
                role="img"
                aria-label={experience.title}
              />
              <h3 className="mt-4 font-bold text-brand-ink">{experience.title}</h3>
              <p className="text-sm text-brand-muted">
                {experience.location}{experience.price > 0 ? ` - from ${formatMoney(experience.price)}` : ""}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
