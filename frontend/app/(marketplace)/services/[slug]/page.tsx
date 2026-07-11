import { ArrowLeft, Heart, Share, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, marketplaceExperiences, marketplaceServices } from "@/lib/service-data";
import { formatCurrency } from "@/lib/utils";

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

  const whatsappMessage = encodeURIComponent(`Hello Micasa, I want to check dates for ${service.title}.`);

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-brand-line bg-white px-5 lg:px-8">
        <Link aria-label="Back to services" className="grid h-11 w-11 place-items-center rounded-full text-brand-ink" href={service.category === "experience" ? "/experiences" : "/services"}>
          <ArrowLeft size={28} aria-hidden />
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Share service" className="grid h-11 w-11 place-items-center rounded-full text-brand-ink" type="button">
            <Share size={25} aria-hidden />
          </button>
          <button aria-label="Save service" className="grid h-11 w-11 place-items-center rounded-full text-brand-ink" type="button">
            <Heart size={28} aria-hidden />
          </button>
        </div>
      </header>

      <section className="relative h-[260px] overflow-hidden sm:h-[360px] lg:h-[460px]">
        <Image src={service.heroImage} alt={service.title} fill priority sizes="100vw" className="object-cover" />
      </section>

      <section className="relative z-10 -mt-8 rounded-t-[34px] bg-white px-6 pb-8 pt-16 text-center shadow-[0_-12px_32px_rgba(34,34,34,0.08)] lg:mx-auto lg:-mt-14 lg:max-w-5xl lg:rounded-[34px] lg:px-12">
        <div className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-brand-soft shadow-luxe">
          <Image src={service.avatar} alt={service.provider} fill sizes="112px" className="object-cover" />
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-brand-ink sm:text-5xl">{service.title}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-brand-muted">{service.subtitle}</p>
        <p className="mt-8 text-base text-brand-ink">
          <span className="font-bold">★ {service.rating.toFixed(1)}</span>
          <span className="px-2">·</span>
          <span>{service.reviews} reviews</span>
          <span className="px-2">·</span>
          <span>{service.provider}</span>
        </p>
        <p className="mt-2 text-base text-brand-muted">{service.location}</p>

        <div className="mx-auto mt-10 h-px max-w-4xl bg-brand-line" />

        <div className="mx-auto mt-8 grid max-w-4xl gap-5 text-left">
          {service.packages.map((item) => (
            <article key={item.title} className="grid gap-4 rounded-[24px] border border-brand-line bg-white p-4 shadow-pearl sm:grid-cols-[180px_1fr]">
              <div className="relative h-36 overflow-hidden rounded-[18px] sm:h-full">
                <Image src={item.image} alt={item.title} fill sizes="180px" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="line-clamp-1 text-xl font-bold text-brand-ink">{item.title}</h2>
                <p className="mt-2 line-clamp-2 text-base leading-6 text-brand-muted">{item.description}</p>
                <p className="mt-4 text-base text-brand-muted">
                  <span className="font-bold text-brand-ink">{formatCurrency(item.price)}</span> / {item.unit}
                  <span className="px-2">·</span>
                  {item.duration}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-line bg-white px-5 pb-[max(env(safe-area-inset-bottom),0.9rem)] pt-4 shadow-[0_-16px_42px_rgba(34,34,34,0.12)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="min-w-0 text-xl text-brand-ink">
            From <span className="font-semibold">{formatCurrency(service.startingPrice)}</span>
            <span className="text-brand-muted"> / {service.unit}</span>
          </p>
          <a href={`https://wa.me/254715410023?text=${whatsappMessage}`} rel="noreferrer" target="_blank">
            <Button size="lg" className="min-w-[160px]">Show dates</Button>
          </a>
        </div>
      </section>
    </main>
  );
}
