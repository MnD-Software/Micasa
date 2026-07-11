import { Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { experiences } from "@/lib/marketplace-data";

export default function ExperiencesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Experiences</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-4xl">Add coastal services to your stay</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            Optional add-ons for guests who want the trip handled before arrival.
          </p>
        </section>

        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <article key={experience.title} className="overflow-hidden rounded-[20px] border border-brand-line bg-white shadow-pearl">
              <div className="relative aspect-[4/3]">
                <Image src={experience.image} alt={experience.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <Sparkles className="text-brand-gold" size={20} aria-hidden />
                <h2 className="mt-3 text-lg font-bold text-brand-ink">{experience.title}</h2>
                <p className="mt-1 text-sm text-brand-muted">{experience.location}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
                  <Clock3 size={14} aria-hidden />
                  Confirm on WhatsApp
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
