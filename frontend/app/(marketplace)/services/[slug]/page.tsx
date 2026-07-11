import { ArrowLeft, Heart, Share, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, marketplaceExperiences, marketplaceServices } from "@/lib/service-data";
import { formatCurrency } from "@/lib/utils";
import { createWhatsappHref } from "@/lib/whatsapp";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...marketplaceServices, ...marketplaceExperiences].map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const whatsappHref = createWhatsappHref(`Hello Micasa, I want to check dates for ${service.title}.`);

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-brand-line bg-white px-4 sm:h-20 sm:px-5 lg:px-8">
        <Link aria-label="Back to services" className="grid h-10 w-10 place-items-center rounded-full text-brand-ink sm:h-11 sm:w-11" href={service.category === "experience" ? "/experiences" : "/services"}>
          <ArrowLeft size={25} aria-hidden />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <button aria-label="Share service" className="grid h-10 w-10 place-items-center rounded-full text-brand-ink sm:h-11 sm:w-11" type="button">
            <Share size={23} aria-hidden />
          </button>
          <button aria-label="Save service" className="grid h-10 w-10 place-items-center rounded-full text-brand-ink sm:h-11 sm:w-11" type="button">
            <Heart size={25} aria-hidden />
          </button>
        </div>
      </header>

      <section className="relative h-[220px] overflow-hidden sm:h-[360px] lg:h-[460px]">
        <Image src={service.heroImage} alt={service.title} fill priority sizes="100vw" className="object-cover" />
      </section>

      <section className="relative z-10 -mt-7 rounded-t-[28px] bg-white px-5 pb-7 pt-14 text-center shadow-[0_-12px_32px_rgba(34,34,34,0.08)] sm:rounded-t-[34px] sm:px-6 sm:pb-8 sm:pt-16 lg:mx-auto lg:-mt-14 lg:max-w-5xl lg:rounded-[34px] lg:px-12">
        <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-brand-soft shadow-luxe sm:h-28 sm:w-28">
          <Image src={service.avatar} alt={service.provider} fill sizes="112px" className="object-cover" />
        </div>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-brand-ink sm:text-5xl">{service.title}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-6 text-brand-muted sm:mt-5 sm:text-lg sm:leading-7">{service.subtitle}</p>
        <p className="mt-6 text-sm text-brand-ink sm:mt-8 sm:text-base">
          <span className="font-bold">★ {service.rating.toFixed(1)}</span>
          <span className="px-2">·</span>
          <span>{service.reviews} reviews</span>
          <span className="px-2">·</span>
          <span>{service.provider}</span>
        </p>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">{service.location}</p>

        <div className="mx-auto mt-7 h-px max-w-4xl bg-brand-line sm:mt-10" />

        <div className="mx-auto mt-6 grid max-w-4xl gap-3 text-left sm:mt-8 sm:gap-5">
          {service.packages.map((item) => (
            <article key={item.title} className="grid grid-cols-[104px_1fr] gap-3 rounded-[18px] border border-brand-line bg-white p-3 shadow-pearl sm:grid-cols-[180px_1fr] sm:gap-4 sm:rounded-[24px] sm:p-4">
              <div className="relative h-28 overflow-hidden rounded-[14px] sm:h-full sm:rounded-[18px]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 640px) 180px, 104px" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="line-clamp-2 text-[15px] font-bold leading-5 text-brand-ink sm:line-clamp-1 sm:text-xl">{item.title}</h2>
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-brand-muted sm:mt-2 sm:text-base sm:leading-6">{item.description}</p>
                <p className="mt-2 text-[13px] text-brand-muted sm:mt-4 sm:text-base">
                  <span className="font-bold text-brand-ink">{formatCurrency(item.price)}</span> / {item.unit}
                  <span className="px-2">·</span>
                  {item.duration}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-line bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-16px_42px_rgba(34,34,34,0.12)] sm:px-5 sm:pb-[max(env(safe-area-inset-bottom),0.9rem)] sm:pt-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="min-w-0 text-lg text-brand-ink sm:text-xl">
            From <span className="font-semibold">{formatCurrency(service.startingPrice)}</span>
            <span className="text-brand-muted"> / {service.unit}</span>
          </p>
          <a href={whatsappHref} rel="noreferrer" target="_blank">
            <Button size="lg" className="min-w-[138px] sm:min-w-[160px]">Show dates</Button>
          </a>
        </div>
      </section>
    </main>
  );
}
