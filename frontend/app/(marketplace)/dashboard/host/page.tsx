import { ChartNoAxesCombined, Home, Inbox, Percent, type LucideIcon } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Card } from "@/components/ui/card";

const stats: Array<[label: string, value: string, Icon: LucideIcon]> = [
  ["Active listings", "8", Home],
  ["Occupancy", "82%", Percent],
  ["Monthly revenue", "KSh 5.5M", ChartNoAxesCombined],
  ["Guest threads", "19", Inbox]
];

export default function HostDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="text-3xl font-semibold text-brand-ink sm:text-4xl">Host dashboard</h1>
        <p className="mt-3 text-brand-muted">Property operations, calendar, revenue, occupancy, and guest communication.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-4 sm:p-5">
              <Icon className="text-brand-strong" size={21} aria-hidden />
              <p className="mt-4 text-2xl font-semibold text-brand-ink sm:mt-5 sm:text-3xl">{value}</p>
              <p className="text-[13px] text-brand-muted sm:text-sm">{label}</p>
            </Card>
          ))}
        </div>
      </main>
      <MobileTabBar />
    </>
  );
}
