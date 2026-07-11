import { ArrowRight, Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { formatCurrency } from "@/lib/utils";
import { marketplaceServices } from "@/lib/service-data";

function AppBanner() {
  return (
    <section className="flex items-center gap-3 border-b border-brand-line bg-white px-5 py-4 lg:hidden">
      <button aria-label="Dismiss app banner" className="text-brand-muted" type="button">
        <X size={20} aria-hidden />
      </button>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-strong text-xl font-bold text-white">M</div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-brand-ink">Get Micasa help</p>
        <p className="truncate text-sm text-brand-muted">Fastest way to confirm service add-ons</p>
      </div>
      <a className="rounded-full bg-[#2f8f5b] px-5 py-2.5 text-sm font-bold text-white" href="https://wa.me/254715410023" rel="noreferrer" target="_blank">
        Use app
      </a>
    </section>
  );
}

function ServiceRail() {
  return (
    <section className="px-5 py-8 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="max-w-[78%] text-3xl font-bold leading-tight text-brand-ink lg:text-4xl">Services in Mombasa</h1>
        <Link className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-ink" href="/services/micasa-private-chef-coastal-dinner">
          <ArrowRight size={24} aria-hidden />
        </Link>
      </div>
      <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-4">
        {marketplaceServices.map((service) => (
          <Link key={service.slug} className="w-[42vw] min-w-[172px] max-w-[220px] shrink-0 sm:w-[220px]" href={`/services/${service.slug}`}>
            <article>
              <div className="relative aspect-[1/1] overflow-hidden rounded-[22px] bg-brand-soft">
                <Image src={service.heroImage} alt={service.title} fill sizes="220px" className="object-cover" />
                {service.badge ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-ink shadow-pearl">
                    {service.badge}
                  </span>
                ) : null}
                <span className="absolute right-3 top-3 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.55)]">
                  <Heart size={31} aria-hidden />
                </span>
              </div>
              <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-6 text-brand-ink">{service.title}</h2>
              <p className="mt-1 text-base text-brand-muted">
                From {formatCurrency(service.startingPrice)} / {service.unit}
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-brand-muted">
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
      <AppBanner />
      <main className="pb-28">
        <ServiceRail />
        <section className="mt-8 bg-brand-soft px-5 py-12 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-ink">Inspiration for future getaways</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
            Chef support, transfers, special setups, and guest coordination can be added to selected Micasa stays.
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
