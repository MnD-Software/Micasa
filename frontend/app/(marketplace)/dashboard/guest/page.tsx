import { CalendarCheck, Heart, MessageSquare, Star, type LucideIcon } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Card } from "@/components/ui/card";
import { properties } from "@/lib/marketplace-data";

const stats: Array<[label: string, value: string, Icon: LucideIcon]> = [
  ["Upcoming trips", "2", CalendarCheck],
  ["Saved homes", "14", Heart],
  ["Unread messages", "3", MessageSquare],
  ["Reviews due", "1", Star]
];

export default function GuestDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="text-3xl font-semibold text-brand-ink sm:text-4xl">Guest dashboard</h1>
        <p className="mt-3 text-brand-muted">Trips, saved homes, messages, reviews, and account controls.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-4 sm:p-5">
              <Icon className="text-brand-strong" size={21} aria-hidden />
              <p className="mt-4 text-2xl font-semibold text-brand-ink sm:mt-5 sm:text-3xl">{value}</p>
              <p className="text-[13px] text-brand-muted sm:text-sm">{label}</p>
            </Card>
          ))}
        </div>
        <section className="mt-6 rounded-[22px] bg-brand-soft p-4 sm:mt-10 sm:rounded-[24px] sm:p-6">
          <h2 className="text-xl font-semibold text-brand-ink">Next trip</h2>
          <p className="mt-2 text-brand-muted">{properties[0].title} · Aug 15-19, 2026</p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
