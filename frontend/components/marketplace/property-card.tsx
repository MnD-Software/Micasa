"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Property } from "@/types/marketplace";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useAuthStore } from "@/store/auth-store";
import { useSavedStore } from "@/store/saved-store";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const totalForTwoNights = property.pricePerNight * 2 + property.cleaningFee + property.serviceFee;
  const [activeImage, setActiveImage] = useState(0);
  const { formatMoney, t } = usePreferences();
  const accountKey = useAuthStore((state) => state.accountKey);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSaved = useSavedStore((state) => state.isSaved(property.id, accountKey));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

  function handleSave() {
    if (!isAuthenticated) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    toggleSaved(property.id, accountKey);
  }

  function goToImage(index: number) {
    setActiveImage((index + property.images.length) % property.images.length);
  }

  const image = property.images[activeImage] ?? property.images[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="group"
    >
      <div className="relative">
        <Link href={`/property/${property.slug}`} aria-label={`View ${property.title}`}>
          <div className={["relative overflow-hidden bg-brand-soft transition duration-300 group-hover:shadow-lift", compact ? "aspect-square rounded-[18px]" : "aspect-[4/3] rounded-[18px]"].join(" ")}>
            <Image
              src={image}
              alt={property.title}
              fill
              sizes={compact ? "(min-width: 1280px) 224px, (min-width: 640px) 218px, 44vw" : "(min-width: 1280px) 20vw, (min-width: 768px) 28vw, 92vw"}
              className="object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          </div>
        </Link>
        {property.images.length > 1 ? (
          <>
            <button
              aria-label={`Previous photo of ${property.title}`}
              className="focus-ring absolute left-2.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/86 text-brand-ink shadow-pearl backdrop-blur transition group-hover:grid"
              onClick={() => goToImage(activeImage - 1)}
              type="button"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              aria-label={`Next photo of ${property.title}`}
              className="focus-ring absolute right-2.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/86 text-brand-ink shadow-pearl backdrop-blur transition group-hover:grid"
              onClick={() => goToImage(activeImage + 1)}
              type="button"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
              {property.images.slice(0, 5).map((item, index) => (
                <button
                  key={`${property.id}-${item}-${index}`}
                  aria-label={`Show ${property.title} photo ${index + 1}`}
                  className={[
                    "h-1.5 rounded-full shadow-sm transition",
                    index === activeImage ? "w-4 bg-white" : "w-1.5 bg-white/70"
                  ].join(" ")}
                  onClick={() => goToImage(index)}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
        <button
          className={[
            "focus-ring absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-white/80 bg-white/86 shadow-pearl backdrop-blur transition hover:bg-white",
            isSaved ? "text-brand-strong" : "text-brand-ink"
          ].join(" ")}
          aria-label={`${isSaved ? "Remove" : "Save"} ${property.title}`}
          onClick={handleSave}
          type="button"
        >
          <Heart size={17} aria-hidden className={isSaved ? "fill-brand-strong" : ""} />
        </button>
        {property.featured ? (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-white/80 bg-white/88 px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow-pearl backdrop-blur">
            {t("guestFavorite")}
          </span>
        ) : null}
      </div>
      <Link href={`/property/${property.slug}`} aria-label={`View ${property.title}`}>
        <div className="mt-2 grid gap-0.5 px-0.5">
          <div className={compact ? "grid gap-1" : "flex items-start justify-between gap-3"}>
            <h3 className={compact ? "line-clamp-2 text-[14px] font-semibold leading-[18px] text-brand-ink sm:text-[15px] sm:leading-5" : "line-clamp-1 text-[15px] font-semibold leading-5 text-brand-ink"}>
              {compact ? `${property.type} in ${property.location.split(",")[0]}` : property.title}
            </h3>
            {!compact ? (
              <span className="flex shrink-0 items-center gap-1 text-[13px] text-brand-ink">
                <Star size={13} className="fill-brand-ink" aria-hidden />
                {property.rating}
              </span>
            ) : null}
          </div>
          {!compact ? (
            <p className="line-clamp-1 text-[13px] text-brand-muted">
              <MapPin size={12} aria-hidden className="mr-1 inline" />
              {property.location.split(",").slice(0, 2).join(",")}
            </p>
          ) : null}
          {!compact ? (
            <p className="text-[13px] text-brand-muted">
              {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} baths
            </p>
          ) : null}
          {compact ? (
            <p className="line-clamp-1 text-[13px] leading-5 text-brand-muted">
              <span className="font-semibold text-brand-ink">{formatMoney(totalForTwoNights)}</span>
              {` ${t("forTwoNights")} `}
              <span aria-hidden>·</span>
              <Star size={13} className="mx-0.5 inline fill-brand-ink align-[-2px]" aria-hidden />
              <span>{property.rating}</span>
            </p>
          ) : (
            <p className="pt-0.5 text-[13px] text-brand-ink">
              <span className="font-semibold">{formatMoney(property.pricePerNight)}</span>
              {` ${t("night")}`}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
