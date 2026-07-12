import { ArrowRight, Heart, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { formatCurrency } from "@/lib/utils";
import { marketplaceServices } from "@/lib/service-data";
import { createWhatsappHref } from "@/lib/whatsapp";

function SupportStrip() {
  return (
    <section className="flex items-center gap-3 border-b border-brand-line bg-white px-5 py-3 lg:hidden">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-strong">
        <MessageCircle size={22} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-brand-ink">Need help choosing?</p>
        <p className="truncate text-sm text-brand-muted">Confirm add-ons with the local team</p>
      </div>
      <a className="rounded-full bg-brand-strong px-4 py-2.5 text-sm font-bold text-white" href={createWhatsappHref("Hello Micasa, I want help booking a service.")} rel="noreferrer" target="_blank">
        Chat
      </a>
    </section>
  );
}

function ServiceRail() {
  return (
    <section className="px-5 py-6 lg:px-8 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="max-w-[78%] text-2xl font-bold leading-tight text-brand-ink sm:text-3xl lg:text-4xl">Services in Mombasa</h1>
        <Link className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand-ink sm:h-12 sm:w-12" href="/services/micasa-private-chef-coastal-dinner">
          <ArrowRight size={22} aria-hidden />
        </Link>
      </div>
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 sm:gap-5">
        {marketplaceServices.map((service) => (
          <Link key={service.slug} className="w-[44vw] min-w-[158px] max-w-[190px] shrink-0 sm:w-[220px] sm:max-w-none" href={`/services/${service.slug}`}>
            <article>
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-brand-soft sm:rounded-[22px]">
                <Image src={service.heroImage} alt={service.title} fill sizes="(min-width: 640px) 220px, 44vw" className="object-cover" />
                {service.badge ? (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow-pearl sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">
                    {service.badge}
                  </span>
                ) : null}
                <span className="absolute right-2.5 top-2.5 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)] sm:right-3 sm:top-3">
                  <Heart size={28} aria-hidden />
                </span>
              </div>
              <h2 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-[18px] text-brand-ink sm:mt-3 sm:text-lg sm:font-bold sm:leading-6">{service.title}</h2>
              <p className="mt-1 line-clamp-1 text-[13px] text-brand-muted sm:text-base">
                From {formatCurrency(service.startingPrice)} / {service.unit}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[13px] text-brand-muted sm:text-sm">
                <Star size={13} className="fill-brand-muted" aria-hidden />
                {service.rating.toFixed(1)}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <SupportStrip />
      <main className="pb-28">
        <ServiceRail />
        <section className="mt-4 bg-brand-soft px-5 py-8 lg:px-8 lg:py-12">
          <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">Inspiration for future getaways</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
            Chef support, transfers, special setups, and guest coordination can be added to selected Micasa stays.
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
