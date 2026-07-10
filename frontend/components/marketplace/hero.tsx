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
      <div className="mx-auto max-w-[1420px] px-4 pb-4 pt-1 sm:px-6 sm:pb-6 lg:px-8">
        <div className="mx-auto mb-3 flex max-w-2xl items-center justify-between gap-2 overflow-x-auto pb-1 sm:mb-4 sm:justify-center sm:gap-8">
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

        <div className="relative grid overflow-hidden rounded-[26px] border border-white bg-[#061c17] p-3 shadow-luxe ring-1 ring-brand-line/70 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch lg:p-4">
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

          <div className="relative min-h-[300px] overflow-hidden rounded-[22px] p-4 text-white sm:p-5 lg:min-h-[330px]">
            <div className="absolute -left-16 -top-20 h-80 w-80 rounded-full bg-brand-success/18 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-gold/12 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold shadow-pearl backdrop-blur">
                  <Waves size={14} aria-hidden />
                  Micasa coastal collection
                </div>
                <h1 className="mt-4 max-w-lg font-serif text-3xl font-bold leading-[0.98] tracking-normal text-white sm:text-4xl lg:text-5xl">
                  Nyali stays. Sea views. Private comfort.
                </h1>
                <p className="mt-3 max-w-lg text-xs leading-5 text-white/72 sm:text-sm">
                  Villas and apartments shaped for family holidays, business trips, group getaways, and calm coastal staycations near beaches, malls, pools, and secure parking.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
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

              <div className="hidden max-w-[680px] rounded-full bg-white/95 p-1 shadow-luxe md:block">
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

          <div className="grid min-h-[300px] gap-3 sm:grid-cols-[1fr_0.45fr] lg:min-h-[330px]">
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-brand-ink shadow-luxe ring-1 ring-white/10">
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
                <h2 className="max-w-sm text-xl font-bold leading-tight sm:text-2xl">{currentSlide.property.title}</h2>
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
            <div className="grid grid-rows-2 gap-4">
              {[nextSlide.image, followingSlide.image].map((image, index) => (
                <button
                  key={image}
                  className="focus-ring relative overflow-hidden rounded-[18px] border border-white/12 bg-brand-soft text-left shadow-pearl ring-1 ring-white/10"
                  onClick={() => goToSlide(activeSlide + index + 1)}
                  type="button"
                >
                  <Image
                    src={image}
                    alt={index === 0 ? nextSlide.property.title : followingSlide.property.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
