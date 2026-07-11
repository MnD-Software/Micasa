"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types/marketplace";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useSavedStore } from "@/store/saved-store";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const totalForTwoNights = property.pricePerNight * 2 + property.cleaningFee + property.serviceFee;
  const { formatMoney, t } = usePreferences();
  const isSaved = useSavedStore((state) => state.isSaved(property.id));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);

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
          <div className={["relative overflow-hidden bg-brand-soft transition duration-300 group-hover:shadow-lift", compact ? "aspect-[1.08/1] rounded-[16px]" : "aspect-[4/3] rounded-[18px]"].join(" ")}>
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 768px) 28vw, 92vw"
              className="object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          </div>
        </Link>
        <button
          className={[
            "focus-ring absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-white/80 bg-white/86 shadow-pearl backdrop-blur transition hover:bg-white",
            isSaved ? "text-brand-strong" : "text-brand-ink"
          ].join(" ")}
          aria-label={`${isSaved ? "Remove" : "Save"} ${property.title}`}
          onClick={() => toggleSaved(property.id)}
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
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-[15px] font-semibold leading-5 text-brand-ink">
              {compact ? `${property.type} in ${property.location.split(",")[0]}` : property.title}
            </h3>
            <span className="flex shrink-0 items-center gap-1 text-[13px] text-brand-ink">
              <Star size={13} className="fill-brand-ink" aria-hidden />
              {property.rating}
            </span>
          </div>
          <p className="line-clamp-1 text-[13px] text-brand-muted">
            <MapPin size={12} aria-hidden className="mr-1 inline" />
            {property.location.split(",").slice(0, 2).join(",")}
          </p>
          {!compact ? (
            <p className="text-[13px] text-brand-muted">
              {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} baths
            </p>
          ) : null}
          <p className="pt-0.5 text-[13px] text-brand-ink">
            <span className="font-semibold">{formatMoney(compact ? totalForTwoNights : property.pricePerNight)}</span>
            {compact ? ` ${t("forTwoNights")}` : ` ${t("night")}`}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
