"use client";

import Image from "next/image";
import { ArrowUpRight, BedDouble, Building2, CalendarDays, ChevronLeft, ChevronRight, ConciergeBell, Globe2, House, MapPin, Search, ShieldCheck, Sparkles, Users, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/features/search/search-bar";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useLiveProperties } from "@/hooks/use-live-properties";

const categoryTabs = [
  { key: "all", Icon: Globe2, active: true },
  { key: "homes", Icon: House, active: false },
  { key: "experiences", Icon: Sparkles, active: false },
  { key: "services", Icon: ConciergeBell, active: false },
  { key: "apartments", Icon: Building2, active: false }
] as const;

export function Hero() {
  const { t } = usePreferences();
  const properties = useLiveProperties();
  const carouselSlides = useMemo(
    () =>
      properties.map((property, index) => ({
        property,
        images: property.images.slice(0, 5),
        kicker: index === 0 ? "Poolside villa" : index === 1 ? "Family apartment" : index === 2 ? "Ocean view flagship" : "Couples retreat"
      })),
    [properties]
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = carouselSlides[activeSlide] ?? carouselSlides[0];
  const galleryImages = currentSlide.images.length > 0 ? currentSlide.images : currentSlide.property.images;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % carouselSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [carouselSlides.length]);

  function goToSlide(index: number) {
    setActiveSlide((index + carouselSlides.length) % carouselSlides.length);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-brand-line bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_70%,#ffffff_100%)]">
      <div className="mx-auto max-w-[1460px] px-4 pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-2 overflow-x-auto rounded-full border border-brand-line bg-brand-frost p-1 shadow-pearl backdrop-blur sm:justify-center sm:gap-2">
          {categoryTabs.map(({ key, Icon, active }) => (
            <button
              key={key}
              className={[
                "focus-ring flex min-h-11 min-w-12 shrink-0 items-center justify-center gap-2 rounded-full px-3 text-[11px] font-bold transition sm:min-w-16 sm:px-4 sm:text-xs",
                active
                  ? "bg-brand-ink text-white shadow-pearl"
                  : "text-brand-muted hover:bg-white hover:text-brand-ink"
              ].join(" ")}
              type="button"
            >
              <Icon size={18} aria-hidden className="sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{t(key)}</span>
            </button>
          ))}
        </div>

        <div className="home-hero-shell relative grid min-w-0 overflow-hidden rounded-[28px] border border-white bg-[#071713] p-3 shadow-luxe ring-1 ring-brand-line/70 lg:grid-cols-[0.78fr_1.08fr_0.72fr] lg:items-stretch lg:p-4">
          <button
            aria-label="Previous featured stay"
            className="focus-ring absolute left-[31%] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/12 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/22 lg:grid"
            onClick={() => goToSlide(activeSlide - 1)}
            type="button"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            aria-label="Next featured stay"
            className="focus-ring absolute right-[26%] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/12 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/22 lg:grid"
            onClick={() => goToSlide(activeSlide + 1)}
            type="button"
          >
            <ChevronRight size={18} aria-hidden />
          </button>

          <div className="relative min-h-[310px] min-w-0 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 text-white sm:p-7 lg:min-h-[520px]">
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold shadow-pearl backdrop-blur">
                  <Waves size={14} aria-hidden />
                  Micasa stay desk
                </div>
                <h1 className="mt-5 max-w-xl text-wrap font-serif text-3xl font-bold leading-[0.98] tracking-normal text-white sm:text-5xl lg:text-[4.25rem]">
                  A field guide to slower Nyali stays.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/72 sm:text-base">
                  Curated homes mapped around beach time, family rhythm, work breaks, chef requests, and the small details that make a coastal stay feel handled.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:max-w-md">
                {[
                  [MapPin, "2 min", "beach routes"],
                  [BedDouble, "4", "curated stays"],
                  [ShieldCheck, "24/7", "stay support"]
                ].map(([Icon, value, label]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-pearl backdrop-blur">
                    <Icon size={17} className="text-brand-gold" aria-hidden />
                    <p className="mt-2 text-xl font-bold text-white">{String(value)}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58">{String(label)}</p>
                  </div>
                ))}
              </div>

              <button
                className="focus-ring flex min-h-14 w-full items-center gap-3 rounded-full border border-white bg-white px-4 text-left shadow-luxe md:hidden"
                type="button"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-strong text-white">
                  <Search size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-bold text-brand-ink">{t("whereTo")}</span>
                  <span className="block text-xs text-brand-muted">{t("mobileSearchHint")}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[340px] min-w-0 overflow-hidden border-y border-white/10 bg-brand-ink shadow-luxe ring-1 ring-white/10 sm:min-h-[420px] lg:min-h-[520px]">
            <div className="absolute left-4 top-4 z-10 rounded-full border border-white/22 bg-black/20 px-3 py-1.5 text-[11px] font-bold uppercase text-white/82 backdrop-blur">
              Live stay board
            </div>
            <div className="grid h-full grid-cols-5 grid-rows-5 gap-2 p-2">
              {galleryImages.slice(0, 5).map((image, index) => (
                <div
                  key={`${currentSlide.property.id}-${image}`}
                  className={[
                    "relative overflow-hidden bg-brand-soft",
                    index === 0
                      ? "col-span-5 row-span-3 rounded-[18px] sm:col-span-3 sm:row-span-5"
                      : index === 1
                        ? "col-span-3 row-span-2 rounded-[18px] sm:col-span-2 sm:row-span-3"
                        : index === 2
                          ? "col-span-2 row-span-2 rounded-[18px] sm:col-span-2 sm:row-span-2"
                          : "hidden rounded-[18px] sm:block"
                  ].join(" ")}
                >
                  <Image
                    src={image}
                    alt={`${currentSlide.property.title} photo ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes={index === 0 ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 18vw, 50vw"}
                    className="object-cover transition duration-700 ease-out hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.58)_100%)]" />
            <div className="absolute left-3 top-3 flex gap-2 lg:hidden">
                <button
                  aria-label="Previous featured stay"
                  className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/18 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/28"
                  onClick={() => goToSlide(activeSlide - 1)}
                  type="button"
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <button
                  aria-label="Next featured stay"
                  className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/18 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/28"
                  onClick={() => goToSlide(activeSlide + 1)}
                  type="button"
                >
                  <ChevronRight size={18} aria-hidden />
                </button>
              </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/18 px-3 py-1.5 text-[11px] font-bold backdrop-blur-xl">
                <ShieldCheck size={13} aria-hidden />
                {currentSlide.kicker}
              </div>
              <h2 className="max-w-xl text-xl font-bold leading-tight sm:text-2xl">{currentSlide.property.title}</h2>
              <p className="mt-1.5 max-w-md text-xs leading-5 text-white/82">
                {currentSlide.property.guests} guests / {currentSlide.property.bedrooms} bedrooms / pool / secure parking
              </p>
              <div className="mt-3 flex gap-2">
                {carouselSlides.map((slide, index) => (
                <button
                  key={slide.property.id}
                  aria-label={`Show ${slide.property.title}`}
                  className={[
                    "h-1.5 rounded-full transition",
                    index === activeSlide ? "w-8 bg-white" : "w-3 bg-white/42 hover:bg-white/70"
                  ].join(" ")}
                  onClick={() => goToSlide(index)}
                  type="button"
                />
                ))}
              </div>
            </div>
          </div>

          <div className="relative grid min-h-[360px] min-w-0 content-between gap-5 rounded-[22px] bg-white p-4 text-brand-ink sm:p-5 lg:min-h-[520px]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase text-brand-muted">Plan console</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-strong/10 px-2.5 py-1 text-[11px] font-bold text-brand-strong">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-strong" />
                  Direct support
                </span>
              </div>
              <div className="mt-4 hidden md:block">
                <SearchBar />
              </div>
            </div>

            <div className="grid gap-3">
              {[
                [CalendarDays, "Flexible arrival", "Short coastal breaks or longer remote-work stays."],
                [Users, "Match by group", "Couples, families, teams, and group trips."],
                [ConciergeBell, "Add local help", "Chef, transfers, and stay support by request."]
              ].map(([Icon, title, text]) => (
                <div key={String(title)} className="flex items-start gap-3 rounded-2xl border border-brand-line bg-brand-soft p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-strong text-white">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-brand-ink">{String(title)}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-brand-muted">{String(text)}</span>
                  </span>
                </div>
              ))}
            </div>

            <a
              className="focus-ring inline-flex min-h-12 items-center justify-between rounded-2xl bg-brand-strong px-4 text-sm font-bold text-white shadow-lift transition hover:bg-brand-ink"
              href="#featured-stays"
            >
              Browse the stay board
              <ArrowUpRight size={18} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
