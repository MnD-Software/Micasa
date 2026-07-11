import { Building2, CheckCircle2, Lock, MessageCircle } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";

export default function BecomeHostPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Hosts</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-5xl">Partner onboarding is coming soon</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-muted sm:text-base">
            Micasa is currently presenting owned and directly managed coastal stays first. Owner onboarding can open later with approval, pricing, and quality controls.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [Building2, "Property review", "Listings will need photos, amenities, capacity, and location details."],
            [CheckCircle2, "Quality approval", "Properties should match the Micasa standard before going live."],
            [Lock, "Controlled launch", "Owner accounts remain locked until marketplace mode is switched on."]
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="rounded-[20px] border border-brand-line bg-white p-5 shadow-pearl">
              <Icon className="text-brand-strong" size={24} aria-hidden />
              <h2 className="mt-4 text-lg font-bold text-brand-ink">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{String(text)}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[24px] bg-brand-ink p-5 text-white shadow-luxe">
          <MessageCircle className="text-brand-gold" size={28} aria-hidden />
          <h2 className="mt-4 text-2xl font-bold">Have a serious property inquiry?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
            Use WhatsApp to reach Micasa directly while owner onboarding is still private.
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
