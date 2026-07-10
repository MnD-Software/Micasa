import { notFound } from "next/navigation";
import Image from "next/image";
import { BadgeCheck, CalendarDays, MapPinned, Sparkles, Star, Wifi, type LucideIcon } from "lucide-react";
import { BookingWidget } from "@/features/booking/booking-widget";
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
      <main className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-white bg-brand-ivory p-4 shadow-luxe ring-1 ring-brand-line/70">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
            <div className="flex flex-col justify-between gap-8 p-3 sm:p-5">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-strong shadow-pearl">
                  <Sparkles size={15} aria-hidden />
                  Micasa selected stay
                </p>
                <p className="mt-5 text-sm font-semibold text-brand-muted">{property.type} in {property.location}</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-brand-ink sm:text-6xl">{property.title}</h1>
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
                  <div key={label} className="rounded-2xl border border-brand-line bg-white p-4 shadow-pearl">
                    <p className="text-2xl font-bold text-brand-ink">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-brand-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-h-[420px] gap-2 overflow-hidden rounded-[28px] md:grid-cols-4 md:grid-rows-2">
              <div className="relative aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto">
                <Image src={property.images[0]} alt={property.title} fill priority className="object-cover" />
              </div>
              {property.images.slice(1, 5).map((image, index) => (
                <div key={image} className="relative aspect-[4/3]">
                  <Image src={image} alt={`${property.title} gallery ${index + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
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

            <section className="grid gap-5 border-b border-brand-line py-8">
              {([
                ["Exceptional check-in", "Recent guests gave the check-in process a 5-star rating.", BadgeCheck],
                ["Fast Wi-Fi", "High-speed Wi-Fi is available for work, streaming, and group stays.", Wifi],
                ["House rules", "Check-in after 14:00, checkout before 10:00, and guest capacity is shown before booking.", CalendarDays]
              ] satisfies TrustSignal[]).map(([title, text, Icon]) => (
                <div key={String(title)} className="flex gap-4">
                  <Icon className="mt-1 text-brand-strong" size={24} aria-hidden />
                  <div>
                    <h3 className="font-semibold text-brand-ink">{title}</h3>
                    <p className="text-sm leading-6 text-brand-muted">{text}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="border-b border-brand-line py-8">
              <p className="leading-8 text-brand-ink">{property.description}</p>
            </section>

            <section className="border-b border-brand-line py-8">
              <h2 className="text-2xl font-semibold text-brand-ink">Amenities</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="rounded-2xl border border-brand-line bg-white/72 p-4 text-sm font-medium text-brand-ink shadow-pearl">
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-brand-line py-8">
              <h2 className="text-2xl font-semibold text-brand-ink">Where you will be</h2>
              <div className="mt-5 grid min-h-72 place-items-center rounded-[28px] border border-white bg-brand-soft p-6 text-center shadow-pearl">
                <MapPinned className="mx-auto text-brand-strong" size={42} aria-hidden />
                <p className="mt-3 font-semibold text-brand-ink">{property.location}</p>
                <p className="mt-2 max-w-md text-sm text-brand-muted">
                  Map abstraction is ready for Google Maps or Mapbox using stored coordinates:
                  {` ${property.coordinates.lat}, ${property.coordinates.lng}`}.
                </p>
              </div>
            </section>

            <section className="py-8">
              <h2 className="text-2xl font-semibold text-brand-ink">Reviews</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {["Immaculate stay, fast support, and exactly as shown.", "The booking flow was transparent and the host was excellent."].map((review) => (
                  <article key={review} className="rounded-[24px] border border-brand-line bg-white/72 p-5 shadow-pearl">
                    <p className="text-sm leading-6 text-brand-ink">{review}</p>
                    <p className="mt-4 text-sm font-semibold text-brand-muted">Verified guest</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
          <BookingWidget property={property} />
        </div>

        <section className="py-12">
          <h2 className="mb-6 text-2xl font-semibold text-brand-ink">Similar Micasa stays</h2>
          <div className="grid gap-7 md:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
