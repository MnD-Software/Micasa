import { ArrowRight, Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { marketplaceExperiences } from "@/lib/service-data";
import { formatCurrency } from "@/lib/utils";
import { createWhatsappHref } from "@/lib/whatsapp";

function AppBanner() {
  return (
    <section className="flex items-center gap-3 border-b border-brand-line bg-white px-5 py-4 lg:hidden">
      <button aria-label="Dismiss app banner" className="text-brand-muted" type="button">
        <X size={20} aria-hidden />
      </button>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-strong text-xl font-bold text-white">M</div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-brand-ink">Get Micasa help</p>
        <p className="truncate text-sm text-brand-muted">Fastest way to confirm local experiences</p>
      </div>
      <a className="rounded-full bg-[#2f8f5b] px-5 py-2.5 text-sm font-bold text-white" href={createWhatsappHref("Hello Micasa, I want help booking an experience.")} rel="noreferrer" target="_blank">
        Use app
      </a>
    </section>
  );
}

function ExperienceRail({ title }: { title: string }) {
  return (
    <section className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="max-w-[78%] text-2xl font-bold leading-tight text-brand-ink sm:text-3xl lg:text-4xl">{title}</h1>
        <Link className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand-ink sm:h-12 sm:w-12" href={`/services/${marketplaceExperiences[0].slug}`}>
          <ArrowRight size={22} aria-hidden />
        </Link>
      </div>
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 sm:gap-5">
        {marketplaceExperiences.map((experience) => (
          <Link key={`${title}-${experience.slug}`} className="w-[44vw] min-w-[158px] max-w-[190px] shrink-0 sm:w-[220px] sm:max-w-none" href={`/services/${experience.slug}`}>
            <article>
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-brand-soft sm:rounded-[22px]">
                <Image src={experience.heroImage} alt={experience.title} fill sizes="(min-width: 640px) 220px, 44vw" className="object-cover" />
                {experience.time ? (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow-pearl sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                    {experience.time}
                  </span>
                ) : null}
                <span className="absolute right-2.5 top-2.5 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)] sm:right-3 sm:top-3">
                  <Heart size={28} aria-hidden />
                </span>
              </div>
              <h2 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[18px] text-brand-ink sm:mt-3 sm:text-lg sm:font-bold sm:leading-6">{experience.title}</h2>
              <p className="mt-1 line-clamp-1 text-[13px] text-brand-muted sm:text-base">
                From {formatCurrency(experience.startingPrice)} / {experience.unit}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[13px] text-brand-muted sm:text-sm">
                <Star size={13} className="fill-brand-muted" aria-hidden />
                {experience.rating.toFixed(1)}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ExperiencesPage() {
  return (
    <>
      <SiteHeader />
      <AppBanner />
      <main className="pb-28">
        <ExperienceRail title="Happening today in Mombasa" />
        <ExperienceRail title="Tomorrow in Mombasa" />
      </main>
      <MobileTabBar />
    </>
  );
}
