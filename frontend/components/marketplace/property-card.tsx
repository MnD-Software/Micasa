"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types/marketplace";
import { usePreferences } from "@/components/marketplace/preferences-provider";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const totalForTwoNights = property.pricePerNight * 2 + property.cleaningFee + property.serviceFee;
  const { formatMoney, t } = usePreferences();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45 }}
      className="group"
    >
      <Link href={`/property/${property.slug}`}>
        <div className={["relative overflow-hidden border border-white bg-brand-ivory shadow-pearl ring-1 ring-brand-line/60 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-luxe", compact ? "aspect-[1.04/1] rounded-[24px] sm:rounded-[22px]" : "aspect-[4/3] rounded-[26px]"].join(" ")}>
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_30%,rgba(0,0,0,0.42)_100%)] opacity-80 transition group-hover:opacity-95" />
          <button
            className="focus-ring absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/78 text-brand-ink shadow-pearl backdrop-blur transition hover:bg-white sm:h-9 sm:w-9"
            aria-label={`Save ${property.title}`}
            type="button"
          >
            <Heart size={compact ? 20 : 22} aria-hidden />
          </button>
          {property.featured ? (
            <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/86 px-4 py-2 text-sm font-bold text-brand-ink shadow-pearl backdrop-blur sm:px-3 sm:py-1.5 sm:text-xs">
              {t("guestFavorite")}
            </span>
          ) : null}
          <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/25 bg-white/18 p-3 text-white shadow-pearl backdrop-blur-xl">
            <p className="line-clamp-1 text-sm font-bold">{property.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/82">
              <MapPin size={13} aria-hidden />
              {property.location.split(",").slice(0, 2).join(",")}
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-0.5 px-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-bold text-brand-ink sm:text-[15px]">
              {compact ? `${property.type} in ${property.location.split(",")[0]}` : property.title}
            </h3>
            <span className="flex shrink-0 items-center gap-1 text-sm text-brand-ink sm:text-[13px]">
              <Star size={14} className="fill-brand-ink" aria-hidden />
              {property.rating}
            </span>
          </div>
          {!compact ? <p className="text-sm text-brand-muted">{property.location}</p> : null}
          {!compact ? (
            <p className="text-sm text-brand-muted">
              {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} baths
            </p>
          ) : null}
          <p className="pt-0.5 text-sm text-brand-ink sm:text-[13px]">
            <span className="font-semibold">{formatMoney(compact ? totalForTwoNights : property.pricePerNight)}</span>
            {compact ? ` ${t("forTwoNights")}` : ` ${t("night")}`}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
