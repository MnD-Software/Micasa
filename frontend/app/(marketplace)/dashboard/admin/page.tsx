import {
  BadgeCheck,
  Banknote,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  MessageCircle,
  Plane,
  Settings2,
  ShieldCheck,
  Smartphone,
  ToggleRight,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/marketplace-data";
import { formatCurrency } from "@/lib/utils";
import { getBookingWhatsappNumber } from "@/lib/whatsapp";

const property = properties[0];
const paybillConfigured = Boolean(process.env.NEXT_PUBLIC_MPESA_PAYBILL);
const whatsappNumber = getBookingWhatsappNumber();

const bookings = [
  {
    code: "MS-482931",
    guest: "Amina Hassan",
    dates: "Aug 15-19, 2026",
    guests: 6,
    bedrooms: 3,
    method: "M-Pesa PayBill",
    status: "Awaiting payment",
    total: 123000
  },
  {
    code: "MS-482612",
    guest: "Brian Otieno",
    dates: "Aug 22-25, 2026",
    guests: 8,
    bedrooms: 4,
    method: "WhatsApp",
    status: "Host follow-up",
    total: 153500
  },
  {
    code: "MS-481904",
    guest: "Njeri K.",
    dates: "Sep 03-07, 2026",
    guests: 4,
    bedrooms: 2,
    method: "Card",
    status: "Payment launch pending",
    total: 98000
  }
];

const checklist: Array<[label: string, status: string, Icon: LucideIcon]> = [
  ["Property listing", "Live", CheckCircle2],
  ["Availability and bedroom rate calculator", "Live", CalendarDays],
  ["M-Pesa PayBill instructions", paybillConfigured ? "Configured" : "Needs PayBill", Smartphone],
  ["WhatsApp booking redirect", `Active: +${whatsappNumber}`, MessageCircle],
  ["Card collection", "Ready for launch", CreditCard],
  ["Owner marketplace onboarding", "Coming soon", Building2]
];

const revenue = bookings.reduce((total, booking) => total + booking.total, 0);

const metrics: Array<[label: string, value: string | number, Icon: LucideIcon]> = [
  ["Active properties", properties.length, Building2],
  ["Pending bookings", bookings.length, Clock3],
  ["Projected revenue", formatCurrency(revenue), CircleDollarSign],
  ["Max capacity", `${property.guests} guests`, UsersRound]
];

const propertyFacts: Array<[label: string, value: string, Icon: LucideIcon]> = [
  ["Property", property.title, BadgeCheck],
  ["Bedrooms", `${property.bedrooms} bedrooms / 5 beds`, BedDouble],
  ["Capacity", `${property.guests} guests`, UsersRound],
  ["Extras", "Chef and airport transfers", Plane]
];

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[34px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-strong">
                Admin dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-5xl">
                Manage bookings, payments, and property launch
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-muted sm:text-base">
                This is the operating dashboard for your own coastal properties first. Marketplace owner onboarding stays locked as coming soon until you decide to launch it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/property/${property.slug}`}>
                <Button variant="secondary">View listing</Button>
              </Link>
              <Button>
                <Settings2 size={18} aria-hidden />
                Launch settings
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-5">
              <Icon className="text-brand-strong" size={24} aria-hidden />
              <p className="mt-5 text-3xl font-bold text-brand-ink">{value}</p>
              <p className="text-sm text-brand-muted">{label}</p>
            </Card>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-brand-line p-5">
              <h2 className="text-xl font-bold text-brand-ink">Booking requests</h2>
              <p className="mt-1 text-sm text-brand-muted">
                Requests from the booking widget, M-Pesa PayBill flow, card-ready flow, and WhatsApp redirect.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-brand-soft text-xs uppercase tracking-[0.08em] text-brand-muted">
                  <tr>
                    <th className="px-5 py-4">Guest</th>
                    <th className="px-5 py-4">Dates</th>
                    <th className="px-5 py-4">Request</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-line">
                  {bookings.map((booking) => (
                    <tr key={booking.code}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-brand-ink">{booking.guest}</p>
                        <p className="text-xs text-brand-muted">{booking.code}</p>
                      </td>
                      <td className="px-5 py-4 text-brand-ink">{booking.dates}</td>
                      <td className="px-5 py-4 text-brand-muted">
                        {booking.guests} guests / {booking.bedrooms} bedrooms
                      </td>
                      <td className="px-5 py-4 text-brand-ink">{booking.method}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-brand-ink">
                        {formatCurrency(booking.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-bold text-brand-ink">Launch controls</h2>
            <div className="mt-5 grid gap-4">
              {checklist.map(([label, status, Icon]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-4">
                  <Icon className="shrink-0 text-brand-strong" size={22} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-brand-ink">{label}</p>
                    <p className="text-sm text-brand-muted">{status}</p>
                  </div>
                  <ToggleRight className="text-brand-muted" size={22} aria-hidden />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="p-5">
            <Banknote className="text-brand-strong" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">M-Pesa PayBill</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Add `NEXT_PUBLIC_MPESA_PAYBILL` to activate the public PayBill instructions. Bookings can already store the chosen M-Pesa flow.
            </p>
          </Card>
          <Card className="p-5">
            <MessageCircle className="text-brand-success" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">WhatsApp bookings</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Booking links send guest dates, bedrooms, guest count, and rate estimates to +{whatsappNumber}.
            </p>
          </Card>
          <Card className="p-5">
            <ShieldCheck className="text-brand-gold" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">Marketplace mode</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Owner listing approvals, paid placements, and public onboarding remain coming soon until the admin switches them on.
            </p>
          </Card>
        </section>

        <section className="mt-6 rounded-[30px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <h2 className="text-xl font-bold text-brand-ink">Current property</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {propertyFacts.map(([label, value, Icon]) => (
              <div key={String(label)} className="rounded-2xl border border-brand-line bg-white p-4">
                <Icon className="text-brand-strong" size={20} aria-hidden />
                <p className="mt-3 text-xs font-bold uppercase text-brand-muted">{label}</p>
                <p className="mt-1 font-bold text-brand-ink">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
