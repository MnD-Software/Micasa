import { ConciergeBell, Plane, ShieldCheck, Utensils, Wifi } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";

const services = [
  [Utensils, "Private chef", "Chef support can be arranged for villa and group stays."],
  [Plane, "Airport transfers", "Pickup and drop-off can be coordinated before arrival."],
  [Wifi, "Work-ready stays", "Fast Wi-Fi, furnished living spaces, and secure buildings."],
  [ShieldCheck, "Guest support", "Booking help, check-in guidance, and WhatsApp coordination."]
] as const;

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Services</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-4xl">Support around every Micasa booking</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            The site is focused on stays first, with service options guests can confirm directly with the Micasa team.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([Icon, title, text]) => (
            <article key={title} className="rounded-[20px] border border-brand-line bg-white p-5 shadow-pearl">
              <Icon className="text-brand-strong" size={24} aria-hidden />
              <h2 className="mt-4 text-lg font-bold text-brand-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[24px] bg-brand-ink p-5 text-white shadow-luxe">
          <ConciergeBell className="text-brand-gold" size={28} aria-hidden />
          <h2 className="mt-4 text-2xl font-bold">Need something specific?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
            Use the WhatsApp button to ask about chef availability, transport, early check-in, late checkout, or group stay planning.
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
