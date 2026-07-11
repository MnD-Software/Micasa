"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ConciergeBell, ShieldCheck, Waves, Wifi } from "lucide-react";
import { PropertyCard } from "@/components/marketplace/property-card";
import { destinations, experiences, properties } from "@/lib/marketplace-data";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { createWhatsappHref } from "@/lib/whatsapp";
import { useSearchStore } from "@/store/search-store";

const nextMonthHomes = properties;

function RailHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <a className="group inline-flex min-w-0 items-center gap-3" href="#featured-stays">
        <h2 className="truncate text-xl font-bold tracking-normal text-brand-ink sm:text-2xl">
          {title}
        </h2>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition group-hover:border-brand-line">
          <ArrowRight size={18} aria-hidden />
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

function PropertyRail({ title, items, id }: { title: string; items: typeof properties; id?: string }) {
  return (
    <section id={id} className="py-5 sm:py-6">
      <RailHeader title={title} />
      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        {items.map((property, index) => (
          <div
            key={`${property.id}-${title}-${index}`}
            className="w-[44vw] min-w-[158px] max-w-[190px] shrink-0 snap-start sm:w-[218px] sm:max-w-none lg:w-[224px]"
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
  const flagship = properties[2] ?? properties[0];

  return (
    <main className="mx-auto max-w-[1820px] px-5 pb-28 pt-5 sm:px-6 sm:py-5 lg:px-10">
      <section id="services" className="my-5 hidden gap-4 overflow-hidden rounded-[24px] border border-white bg-brand-ink p-3 text-white shadow-luxe ring-1 ring-brand-line/70 sm:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[260px] overflow-hidden rounded-[20px] sm:min-h-[320px]">
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
            <h2 className="mt-3 max-w-xl text-2xl font-bold leading-tight sm:text-4xl">{flagship.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/78">
              Sea views, pool access, secure parking, fast Wi-Fi, and a fully equipped kitchen in prime Nyali.
            </p>
          </div>
        </div>
        <div className="grid content-between gap-4 p-2 sm:p-4">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78 backdrop-blur">
              Micasa stay OS
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl">
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
              <div key={String(title)} className="rounded-2xl border border-white/14 bg-white/10 p-3 backdrop-blur-xl">
                <Icon size={20} className="text-brand-gold" aria-hidden />
                <p className="mt-3 font-bold">{String(title)}</p>
                <p className="mt-1 text-xs leading-5 text-white/64">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PropertyRail id="featured-stays" title={`Popular homes in ${search.location.split(",")[0] || "Nyali"}`} items={availableHomes} />
      <PropertyRail title={`Available next month in ${search.location.split(",")[0] || "Nyali"}`} items={nextMonthHomes} />

      <section className="py-5 sm:py-7">
        <RailHeader title="Guest favorite destinations" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {destinations.map((destination) => (
            <a
              key={destination.city}
              className="block overflow-hidden rounded-[18px] border border-white bg-brand-ivory shadow-pearl ring-1 ring-brand-line/70 transition hover:-translate-y-0.5 hover:shadow-luxe sm:rounded-[28px]"
              href={createWhatsappHref(`Hello Micasa, I want help finding a stay in ${destination.city}, ${destination.country}.`)}
              rel="noreferrer"
              target="_blank"
            >
              <div className="relative aspect-square bg-brand-soft sm:aspect-auto sm:h-56">
                <Image src={destination.image} alt={destination.city} fill sizes="(min-width: 1024px) 31vw, 50vw" className="object-cover" />
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="line-clamp-1 text-[15px] font-bold leading-5 text-brand-ink sm:text-xl">{destination.city}</h3>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-brand-muted sm:text-sm">
                  {destination.country} - {destination.properties} homes
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="experiences" className="pb-16 pt-6">
        <RailHeader title="Experiences to add to your stay" />
        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          {experiences.map((experience) => (
            <article key={experience.title} className="w-[44vw] min-w-[158px] max-w-[190px] shrink-0 snap-start sm:w-[224px] sm:max-w-none">
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-brand-soft">
                <Image src={experience.image} alt={experience.title} fill sizes="(min-width: 640px) 224px, 44vw" className="object-cover" />
              </div>
              <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[18px] text-brand-ink sm:mt-4 sm:text-base sm:leading-5">{experience.title}</h3>
              <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-brand-muted sm:text-sm">
                {experience.location}{experience.price > 0 ? ` - from ${formatMoney(experience.price)}` : ""}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
