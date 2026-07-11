"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3X3, Play, X } from "lucide-react";
import { useState } from "react";

type MediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

export function PropertyMediaCarousel({
  title,
  images,
  videos = []
}: {
  title: string;
  images: string[];
  videos?: string[];
}) {
  const media: MediaItem[] = [
    ...images.map((src, index) => ({ type: "image" as const, src, alt: `${title} photo ${index + 1}` })),
    ...videos.map((src, index) => ({ type: "video" as const, src, alt: `${title} video ${index + 1}` }))
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const active = media[activeIndex] ?? media[0];

  function goTo(index: number) {
    setActiveIndex((index + media.length) % media.length);
  }

  if (!active) {
    return null;
  }

  return (
    <>
      <div className="relative min-h-[280px] overflow-hidden rounded-[20px] bg-brand-ink sm:rounded-[28px] md:min-h-[420px]">
        {active.type === "image" ? (
          <Image
            src={active.src}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        ) : (
          <video
            className="h-full min-h-[280px] w-full object-cover md:min-h-[420px]"
            controls
            muted
            playsInline
            preload="metadata"
            src={active.src}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_50%,rgba(0,0,0,0.55)_100%)]" />

        {media.length > 1 ? (
          <>
            <button
              aria-label="Previous media"
              className="focus-ring absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/88 text-brand-ink shadow-pearl backdrop-blur transition hover:bg-white"
              onClick={() => goTo(activeIndex - 1)}
              type="button"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              aria-label="Next media"
              className="focus-ring absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/88 text-brand-ink shadow-pearl backdrop-blur transition hover:bg-white"
              onClick={() => goTo(activeIndex + 1)}
              type="button"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <button
              className="focus-ring absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-bold text-brand-ink shadow-pearl backdrop-blur transition hover:bg-white"
              onClick={() => setTourOpen(true)}
              type="button"
            >
              <Grid3X3 size={14} aria-hidden />
              Show all media
            </button>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3 sm:p-4">
              <div className="flex max-w-[70%] gap-1.5 overflow-hidden">
                {media.slice(0, 12).map((item, index) => (
                  <button
                    key={`${item.src}-${index}`}
                    aria-label={`Show media ${index + 1}`}
                    className={[
                      "h-1.5 shrink-0 rounded-full transition",
                      index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"
                    ].join(" ")}
                    onClick={() => goTo(index)}
                    type="button"
                  />
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-ink shadow-pearl backdrop-blur">
                {active.type === "video" ? <Play size={13} aria-hidden /> : null}
                {activeIndex + 1} / {media.length}
              </span>
            </div>
          </>
        ) : null}
      </div>

      {tourOpen ? (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-line bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
            <button className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-brand-line" onClick={() => setTourOpen(false)} type="button" aria-label="Close photo tour">
              <X size={22} aria-hidden />
            </button>
            <h2 className="text-lg font-bold text-brand-ink sm:text-2xl">Photo tour</h2>
            <span className="text-sm font-semibold text-brand-muted">{media.length} items</span>
          </div>
          <div className="h-[calc(100vh-78px)] overflow-y-auto px-4 py-8 sm:px-8 lg:px-16">
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {media.map((item, index) => (
                <button
                  key={`${item.src}-tour-${index}`}
                  className="group text-left"
                  onClick={() => {
                    goTo(index);
                    setTourOpen(false);
                  }}
                  type="button"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-soft shadow-pearl">
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                        className="object-cover transition group-hover:scale-[1.03]"
                      />
                    ) : (
                      <video className="h-full w-full object-cover" muted playsInline preload="metadata" src={item.src} />
                    )}
                    {item.type === "video" ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-brand-ink">
                        Video
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 font-semibold text-brand-ink">{item.type === "image" ? `Photo ${index + 1}` : `Video ${index + 1}`}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
