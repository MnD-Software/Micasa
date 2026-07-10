import { ChartNoAxesCombined, Home, Inbox, Percent, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Card } from "@/components/ui/card";

const stats: Array<[label: string, value: string, Icon: LucideIcon]> = [
  ["Active listings", "8", Home],
  ["Occupancy", "82%", Percent],
  ["Monthly revenue", "$42.8k", ChartNoAxesCombined],
  ["Guest threads", "19", Inbox]
];

export default function HostDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-brand-ink">Host dashboard</h1>
        <p className="mt-3 text-brand-muted">Property operations, calendar, revenue, occupancy, and guest communication.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-5">
              <Icon className="text-brand-strong" size={24} aria-hidden />
              <p className="mt-5 text-3xl font-semibold text-brand-ink">{value}</p>
              <p className="text-sm text-brand-muted">{label}</p>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
