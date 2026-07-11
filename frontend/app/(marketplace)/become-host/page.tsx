import { Building2, CheckCircle2, Lock, MessageCircle } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";

export default function BecomeHostPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[22px] border border-white bg-brand-ivory p-4 shadow-pearl ring-1 ring-brand-line/70 sm:rounded-[24px] sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Hosts</p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-brand-ink sm:text-5xl">Partner onboarding is coming soon</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-muted sm:text-base">
            Micasa is currently presenting owned and directly managed coastal stays first. Owner onboarding can open later with approval, pricing, and quality controls.
          </p>
        </section>

        <section className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
          {[
            [Building2, "Property review", "Listings will need photos, amenities, capacity, and location details."],
            [CheckCircle2, "Quality approval", "Properties should match the Micasa standard before going live."],
            [Lock, "Controlled launch", "Owner accounts remain locked until marketplace mode is switched on."]
          ].map(([Icon, title, text]) => (
            <article key={String(title)} className="rounded-[18px] border border-brand-line bg-white p-4 shadow-pearl sm:rounded-[20px] sm:p-5">
              <Icon className="text-brand-strong" size={21} aria-hidden />
              <h2 className="mt-3 text-[15px] font-bold leading-5 text-brand-ink sm:mt-4 sm:text-lg">{String(title)}</h2>
              <p className="mt-1.5 text-[13px] leading-5 text-brand-muted sm:mt-2 sm:text-sm sm:leading-6">{String(text)}</p>
            </article>
          ))}
        </section>

        <section className="mt-5 rounded-[22px] bg-brand-ink p-4 text-white shadow-luxe sm:mt-6 sm:rounded-[24px] sm:p-5">
          <MessageCircle className="text-brand-gold" size={24} aria-hidden />
          <h2 className="mt-3 text-xl font-bold sm:mt-4 sm:text-2xl">Have a serious property inquiry?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
            Use WhatsApp to reach Micasa directly while owner onboarding is still private.
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
