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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-brand-ink">Guest dashboard</h1>
        <p className="mt-3 text-brand-muted">Trips, saved homes, messages, reviews, and account controls.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-5">
              <Icon className="text-brand-strong" size={24} aria-hidden />
              <p className="mt-5 text-3xl font-semibold text-brand-ink">{value}</p>
              <p className="text-sm text-brand-muted">{label}</p>
            </Card>
          ))}
        </div>
        <section className="mt-10 rounded-[24px] bg-brand-soft p-6">
          <h2 className="text-xl font-semibold text-brand-ink">Next trip</h2>
          <p className="mt-2 text-brand-muted">{properties[0].title} · Aug 15-19, 2026</p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
