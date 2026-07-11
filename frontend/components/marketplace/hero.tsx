"use client";

import Image from "next/image";
import { Building2, ChevronLeft, ChevronRight, ConciergeBell, Globe2, House, Search, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/features/search/search-bar";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { properties } from "@/lib/marketplace-data";

const categoryTabs = [
  { key: "all", Icon: Globe2, active: true },
  { key: "homes", Icon: House, active: false },
  { key: "experiences", Icon: Sparkles, active: false },
  { key: "services", Icon: ConciergeBell, active: false },
  { key: "apartments", Icon: Building2, active: false }
] as const;

export function Hero() {
  const { t } = usePreferences();
  const carouselSlides = useMemo(
    () =>
      properties.map((property, index) => ({
        property,
        images: property.images.slice(0, 5),
        kicker: index === 0 ? "Poolside villa" : index === 1 ? "Family apartment" : index === 2 ? "Ocean view flagship" : "Couples retreat"
      })),
    []
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
      <div className="mx-auto max-w-[1420px] px-4 pb-5 pt-1 sm:px-6 lg:px-8">
        <div className="mx-auto mb-2 flex max-w-2xl items-center justify-between gap-2 overflow-x-auto pb-1 sm:mb-3 sm:justify-center sm:gap-8">
          {categoryTabs.map(({ key, Icon, active }) => (
            <button
              key={key}
              className={[
                "focus-ring flex min-w-12 shrink-0 flex-col items-center gap-0.5 border-b-3 px-1 pb-1 text-[11px] font-semibold transition sm:min-w-16 sm:pb-1.5 sm:text-xs",
                active
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-muted hover:border-brand-line hover:text-brand-ink"
              ].join(" ")}
              type="button"
            >
              <Icon size={18} aria-hidden className="sm:h-5 sm:w-5" />
              <span>{t(key)}</span>
            </button>
          ))}
        </div>

        <div className="relative grid overflow-hidden rounded-[22px] border border-white bg-[#071713] p-3 shadow-luxe ring-1 ring-brand-line/70 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch lg:p-3">
          <button
            aria-label="Previous featured stay"
            className="focus-ring absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/12 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/22 lg:grid"
            onClick={() => goToSlide(activeSlide - 1)}
            type="button"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            aria-label="Next featured stay"
            className="focus-ring absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/12 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/22 lg:grid"
            onClick={() => goToSlide(activeSlide + 1)}
            type="button"
          >
            <ChevronRight size={18} aria-hidden />
          </button>

          <div className="relative min-h-[255px] overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 text-white sm:p-5 lg:min-h-[360px]">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold shadow-pearl backdrop-blur">
                  <Waves size={14} aria-hidden />
                  Micasa coastal collection
                </div>
                <h1 className="mt-4 max-w-lg font-serif text-3xl font-bold leading-[0.98] tracking-normal text-white sm:text-4xl lg:text-[3.35rem]">
                  Nyali stays. Sea views. Private comfort.
                </h1>
                <p className="mt-3 max-w-lg text-xs leading-5 text-white/72 sm:text-sm">
                  Villas and apartments shaped for family holidays, business trips, group getaways, and calm coastal staycations near beaches, malls, pools, and secure parking.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:max-w-md">
                {[
                  ["2 min", "beach"],
                  ["4", "stays"],
                  ["24/7", "security"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-white/12 bg-white/8 p-2.5 shadow-pearl backdrop-blur">
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58">{label}</p>
                  </div>
                ))}
              </div>

              <div className="hidden max-w-[620px] rounded-full bg-white/95 p-1 shadow-luxe md:block">
                <SearchBar />
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

          <div className="relative min-h-[280px] overflow-hidden rounded-[18px] border border-white/10 bg-brand-ink shadow-luxe ring-1 ring-white/10 sm:min-h-[340px] lg:min-h-[360px]">
            <div className="grid h-full grid-cols-4 grid-rows-3 gap-1.5 p-1.5 sm:gap-2 sm:p-2">
              {galleryImages.slice(0, 5).map((image, index) => (
                <div
                  key={`${currentSlide.property.id}-${image}`}
                  className={[
                    "relative overflow-hidden rounded-[14px] bg-brand-soft",
                    index === 0
                      ? "col-span-4 row-span-2 sm:col-span-2 sm:row-span-3"
                      : index === 1
                        ? "col-span-2 row-span-1 sm:col-span-1 sm:row-span-2"
                        : index === 2
                          ? "col-span-2 row-span-1 sm:col-span-1 sm:row-span-2"
                          : "hidden sm:block"
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
                {currentSlide.property.guests} guests - {currentSlide.property.bedrooms} bedrooms - pool - secure parking
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
        </div>
      </div>
    </section>
  );
}
