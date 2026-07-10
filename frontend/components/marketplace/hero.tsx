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
        image: index === 0 ? property.images[2] ?? property.images[0] : property.images[0],
        kicker: index === 0 ? "Poolside villa" : index === 1 ? "Family apartment" : index === 2 ? "Ocean view flagship" : "Couples retreat"
      })),
    []
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = carouselSlides[activeSlide] ?? carouselSlides[0];
  const nextSlide = carouselSlides[(activeSlide + 1) % carouselSlides.length] ?? currentSlide;
  const followingSlide = carouselSlides[(activeSlide + 2) % carouselSlides.length] ?? currentSlide;

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
    <section className="relative isolate overflow-hidden border-b border-brand-line bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_58%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_18%_20%,rgba(255,180,0,0.16),transparent_30rem),radial-gradient(circle_at_85%_16%,rgba(0,166,153,0.13),transparent_28rem)]" />
      <div className="mx-auto max-w-[1500px] px-4 pb-8 pt-3 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-2 overflow-x-auto pb-1 sm:mb-8 sm:justify-center sm:gap-12">
          {categoryTabs.map(({ key, Icon, active }) => (
            <button
              key={key}
              className={[
                "focus-ring flex min-w-16 shrink-0 flex-col items-center gap-1 border-b-4 px-1 pb-2 text-xs font-semibold transition sm:min-w-20 sm:pb-3 sm:text-sm",
                active
                  ? "border-brand-ink text-brand-ink"
                  : "border-transparent text-brand-muted hover:border-brand-line hover:text-brand-ink"
              ].join(" ")}
              type="button"
            >
              <Icon size={24} aria-hidden className="sm:h-7 sm:w-7" />
              <span>{t(key)}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[34px] border border-white bg-brand-ivory p-5 shadow-luxe ring-1 ring-brand-line/70 sm:p-7 lg:min-h-[560px]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-ink shadow-pearl">
                  <Waves size={16} className="text-brand-success" aria-hidden />
                  Micasa coastal collection
                </div>
                <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[0.96] text-brand-ink sm:text-6xl lg:text-7xl">
                  Silky Nyali stays with ocean energy.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-brand-muted sm:text-lg">
                  Villas and apartments shaped for family holidays, business trips, group getaways, and calm coastal staycations near beaches, malls, pools, and secure parking.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["2 min", "beach access"],
                  ["4", "curated stays"],
                  ["24/7", "manned security"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white bg-white/74 p-4 shadow-pearl ring-1 ring-brand-line/60 backdrop-blur">
                    <p className="text-2xl font-bold text-brand-ink">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted">{label}</p>
                  </div>
                ))}
              </div>

              <div className="hidden max-w-[980px] md:block">
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

          <div className="grid min-h-[540px] gap-4 sm:grid-cols-[1fr_0.62fr]">
            <div className="relative overflow-hidden rounded-[34px] border border-white bg-brand-ink shadow-luxe ring-1 ring-brand-line/60">
              {carouselSlides.map((slide, index) => (
                <div
                  key={`${slide.property.id}-${slide.image}`}
                  className={[
                    "absolute inset-0 transition duration-700 ease-out",
                    index === activeSlide ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                  ].join(" ")}
                >
                  {/* Native img is deliberate here: this is a background-like hero layer, and local WhatsApp filenames include spaces. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.62)_100%)]" />
              <div className="absolute left-5 top-5 flex gap-2">
                <button
                  aria-label="Previous featured stay"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/18 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/28"
                  onClick={() => goToSlide(activeSlide - 1)}
                  type="button"
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>
                <button
                  aria-label="Next featured stay"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/18 text-white shadow-pearl backdrop-blur-xl transition hover:bg-white/28"
                  onClick={() => goToSlide(activeSlide + 1)}
                  type="button"
                >
                  <ChevronRight size={18} aria-hidden />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/18 px-4 py-2 text-xs font-bold backdrop-blur-xl">
                  <ShieldCheck size={15} aria-hidden />
                  {currentSlide.kicker}
                </div>
                <h2 className="max-w-md text-3xl font-bold leading-tight sm:text-5xl">{currentSlide.property.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/82">
                  {currentSlide.property.guests} guests - {currentSlide.property.bedrooms} bedrooms - pool - secure parking
                </p>
                <div className="mt-5 flex gap-2">
                  {carouselSlides.map((slide, index) => (
                    <button
                      key={slide.property.id}
                      aria-label={`Show ${slide.property.title}`}
                      className={[
                        "h-1.5 rounded-full transition",
                        index === activeSlide ? "w-10 bg-white" : "w-4 bg-white/42 hover:bg-white/70"
                      ].join(" ")}
                      onClick={() => goToSlide(index)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              {[nextSlide.image, followingSlide.image].map((image, index) => (
                <div key={image} className="relative overflow-hidden rounded-[28px] border border-white bg-brand-soft shadow-pearl ring-1 ring-brand-line/60">
                  <Image
                    src={image}
                    alt={index === 0 ? nextSlide.property.title : followingSlide.property.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
