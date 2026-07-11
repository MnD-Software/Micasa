import { notFound } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, CalendarDays, MapPinned, Sparkles, Star, Wifi, type LucideIcon } from "lucide-react";
import { BookingWidget } from "@/features/booking/booking-widget";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { PropertyCard } from "@/components/marketplace/property-card";
import { getPropertyBySlug, properties } from "@/lib/marketplace-data";

type Props = {
  params: Promise<{ slug: string }>;
};

type TrustSignal = [title: string, text: string, Icon: LucideIcon];

export async function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similar = properties.filter((item) => item.id !== property.id).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-5 sm:px-6 sm:py-6 lg:px-8">
        <section className="overflow-hidden rounded-[24px] border border-white bg-brand-ivory p-3 shadow-luxe ring-1 ring-brand-line/70 sm:rounded-[34px] sm:p-4">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
            <div className="flex flex-col justify-between gap-5 p-2 sm:gap-8 sm:p-5">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-strong shadow-pearl">
                  <Sparkles size={15} aria-hidden />
                  Micasa selected stay
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-muted sm:mt-5">{property.type} in {property.location}</p>
                <h1 className="mt-2 text-3xl font-bold leading-tight text-brand-ink sm:text-6xl">{property.title}</h1>
                <p className="mt-4 flex items-center gap-2 text-sm text-brand-ink">
                  <Star size={16} className="fill-brand-ink" aria-hidden />
                  {property.rating} - {property.reviews} reviews - {property.location}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  [`${property.guests}`, "guests"],
                  [`${property.bedrooms}`, "bedrooms"],
                  [`${property.bathrooms}`, "bathrooms"]
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-brand-line bg-white p-3 shadow-pearl sm:p-4">
                    <p className="text-xl font-bold text-brand-ink sm:text-2xl">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-muted sm:text-xs sm:tracking-[0.1em]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2 overflow-hidden rounded-[20px] sm:rounded-[28px] md:min-h-[420px] md:grid-cols-4 md:grid-rows-2">
              <div className="relative aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto">
                <Image src={property.images[0]} alt={property.title} fill priority className="object-cover" />
              </div>
              {property.images.slice(1, 5).map((image, index) => (
                <div key={image} className="relative hidden aspect-[4/3] md:block">
                  <Image src={image} alt={`${property.title} gallery ${index + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-8 sm:mt-10 lg:grid-cols-[1fr_380px] lg:gap-10">
          <div>
            <section className="border-b border-brand-line pb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-brand-ink">Hosted by {property.host.name}</h2>
                  <p className="text-brand-muted">
                    {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
                  </p>
                </div>
                <Image
                  src={property.host.avatar}
                  alt={property.host.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
            </section>

            <section className="grid gap-4 border-b border-brand-line py-6 sm:gap-5 sm:py-8">
              {([
                ["Exceptional check-in", "Recent guests gave the check-in process a 5-star rating.", BadgeCheck],
                ["Fast Wi-Fi", "High-speed Wi-Fi is available for work, streaming, and group stays.", Wifi],
                ["House rules", "Check-in after 14:00, checkout before 10:00, and guest capacity is shown before booking.", CalendarDays]
              ] satisfies TrustSignal[]).map(([title, text, Icon]) => (
                <div key={String(title)} className="flex gap-3 sm:gap-4">
                  <Icon className="mt-1 text-brand-strong" size={21} aria-hidden />
                  <div>
                    <h3 className="text-[15px] font-semibold text-brand-ink sm:text-base">{title}</h3>
                    <p className="text-sm leading-6 text-brand-muted">{text}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="border-b border-brand-line py-6 sm:py-8">
              <p className="text-sm leading-7 text-brand-ink sm:text-base sm:leading-8">{property.description}</p>
            </section>

            <section className="border-b border-brand-line py-6 sm:py-8">
              <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="rounded-2xl border border-brand-line bg-white/72 p-3 text-[13px] font-medium leading-5 text-brand-ink shadow-pearl sm:p-4 sm:text-sm">
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-brand-line py-6 sm:py-8">
              <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">Where you will be</h2>
              <div className="mt-4 grid min-h-56 place-items-center rounded-[22px] border border-white bg-brand-soft p-5 text-center shadow-pearl sm:mt-5 sm:min-h-72 sm:rounded-[28px] sm:p-6">
                <MapPinned className="mx-auto text-brand-strong" size={36} aria-hidden />
                <p className="mt-3 font-semibold text-brand-ink">{property.location}</p>
                <p className="mt-2 max-w-md text-sm text-brand-muted">
                  Map abstraction is ready for Google Maps or Mapbox using stored coordinates:
                  {` ${property.coordinates.lat}, ${property.coordinates.lng}`}.
                </p>
              </div>
            </section>

            <section className="py-6 sm:py-8">
              <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl">Reviews</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-5">
                {["Immaculate stay, fast support, and exactly as shown.", "The booking flow was transparent and the host was excellent."].map((review) => (
                  <article key={review} className="rounded-[20px] border border-brand-line bg-white/72 p-4 shadow-pearl sm:rounded-[24px] sm:p-5">
                    <p className="text-sm leading-6 text-brand-ink">{review}</p>
                    <p className="mt-4 text-sm font-semibold text-brand-muted">Verified guest</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
          <BookingWidget property={property} />
        </div>

        <section className="py-8 sm:py-12">
          <h2 className="mb-4 text-xl font-semibold text-brand-ink sm:mb-6 sm:text-2xl">Similar Micasa stays</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 md:gap-7">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} compact />
            ))}
          </div>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
