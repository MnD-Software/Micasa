"use client";

import { BarChart3, Building2, ClipboardList, Image as ImageIcon, LayoutDashboard, Package } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const API_URL = "/api/backend";
const adminTokenKey = "micasa-admin-token";

type ApiProperty = {
  id: number;
  title: string;
  property_type: string;
  bedrooms: number;
  guests: number;
  price_per_night: number;
  status: string;
};

type ApiBooking = {
  id: number;
  property_id: number;
  check_in: string;
  check_out: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
};

const modules = {
  inventory: { title: "Inventory", icon: Building2, description: "Published, draft, and inactive stay records." },
  packages: { title: "Packages", icon: Package, description: "How stays are grouped by package or property type." },
  bookings: { title: "Bookings", icon: ClipboardList, description: "Guest reservation and payment operations." },
  content: { title: "Content", icon: ImageIcon, description: "Listing media and guest-facing content coverage." }
} as const;

async function apiRequest<T>(path: string, token?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function MiniBars({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="mt-5 grid gap-3">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[110px_1fr_58px] items-center gap-3 text-sm">
          <span className="truncate font-semibold text-slate-600">{row.label}</span>
          <span className="h-3 overflow-hidden rounded-full bg-slate-100">
            <span className="block h-full rounded-full bg-teal-700" style={{ width: `${Math.max(8, Math.round((row.value / max) * 100))}%` }} />
          </span>
          <span className="text-right font-bold text-slate-950">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminModulePage() {
  const params = useParams<{ module?: string }>();
  const requestedModule = params.module;
  const moduleKey = requestedModule && requestedModule in modules ? requestedModule as keyof typeof modules : "inventory";
  const currentModule = modules[moduleKey];
  const Icon = currentModule.icon;
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem(adminTokenKey) ?? "";
    async function load() {
      try {
        const nextProperties = await apiRequest<ApiProperty[]>("/api/properties");
        setProperties(nextProperties);
        if (token) {
          setBookings(await apiRequest<ApiBooking[]>("/api/bookings", token));
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load module data");
      }
    }
    load();
  }, []);

  const statusRows = useMemo(() => {
    const counts = new Map<string, number>();
    properties.forEach((property) => counts.set(property.status, (counts.get(property.status) ?? 0) + 1));
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [properties]);

  const packageRows = useMemo(() => {
    const counts = new Map<string, number>();
    properties.forEach((property) => counts.set(property.property_type, (counts.get(property.property_type) ?? 0) + 1));
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [properties]);

  const bookingRows = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((booking) => counts.set(booking.booking_status, (counts.get(booking.booking_status) ?? 0) + 1));
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
  }, [bookings]);

  const revenue = bookings.reduce((total, booking) => total + Number(booking.total_amount), 0);
  const averageRate = properties.length ? properties.reduce((total, property) => total + Number(property.price_per_night), 0) / properties.length : 0;

  return (
    <main className="h-screen overflow-hidden bg-slate-100 text-slate-950">
      <div className="grid h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden h-screen overflow-y-auto border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500 font-bold">M</span>
            <div>
              <p className="font-bold">Micasa Ops</p>
              <p className="text-xs text-white/50">Administration</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-2 text-sm font-semibold">
            {[
              [LayoutDashboard, "Overview", "/dashboard/admin"],
              [Building2, "Inventory", "/dashboard/admin/inventory"],
              [Package, "Packages", "/dashboard/admin/packages"],
              [ClipboardList, "Bookings", "/dashboard/admin/bookings"],
              [ImageIcon, "Content", "/dashboard/admin/content"]
            ].map(([NavIcon, label, href]) => (
              <a key={String(label)} href={String(href)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/72 transition hover:bg-white/10 hover:text-white">
                <NavIcon size={18} aria-hidden />
                {String(label)}
              </a>
            ))}
          </nav>
        </aside>

        <section className="h-screen min-w-0 overflow-y-auto">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white">
                <Icon size={20} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Operations module</p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{currentModule.title}</h1>
              </div>
            </div>
            <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
              {[
                ["Overview", "/dashboard/admin"],
                ["Inventory", "/dashboard/admin/inventory"],
                ["Packages", "/dashboard/admin/packages"],
                ["Bookings", "/dashboard/admin/bookings"],
                ["Content", "/dashboard/admin/content"]
              ].map(([label, href]) => (
                <a key={label} href={href} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            {error ? <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
            <p className="mb-5 text-sm text-slate-500">{currentModule.description}</p>

            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <p className="text-sm font-semibold text-slate-500">Listings</p>
                <p className="mt-3 text-3xl font-bold">{properties.length}</p>
              </Card>
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <p className="text-sm font-semibold text-slate-500">Packages</p>
                <p className="mt-3 text-3xl font-bold">{packageRows.length}</p>
              </Card>
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <p className="text-sm font-semibold text-slate-500">Revenue</p>
                <p className="mt-3 text-2xl font-bold">{formatCurrency(revenue)}</p>
              </Card>
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <p className="text-sm font-semibold text-slate-500">Average rate</p>
                <p className="mt-3 text-2xl font-bold">{formatCurrency(averageRate)}</p>
              </Card>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-3">
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Status mix</h2>
                <MiniBars rows={statusRows.length ? statusRows : [{ label: "No data", value: 0 }]} />
              </Card>
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Package mix</h2>
                <MiniBars rows={packageRows.length ? packageRows : [{ label: "No data", value: 0 }]} />
              </Card>
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Booking mix</h2>
                <MiniBars rows={bookingRows.length ? bookingRows : [{ label: "Login", value: 0 }]} />
              </Card>
            </section>

            <Card className="mt-5 overflow-hidden border-0 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
              <div className="border-b border-slate-100 p-5">
                <h2 className="text-lg font-bold">System records</h2>
                <p className="text-sm text-slate-500">Records currently returned by the backend.</p>
              </div>
              <div className="max-h-[560px] overflow-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Listing</th>
                      <th className="px-5 py-4">Package</th>
                      <th className="px-5 py-4">Capacity</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {properties.map((property) => (
                      <tr key={property.id}>
                        <td className="px-5 py-4 font-semibold">{property.title}</td>
                        <td className="px-5 py-4 text-slate-600">{property.property_type}</td>
                        <td className="px-5 py-4 text-slate-600">{property.guests} guests - {property.bedrooms} bedrooms</td>
                        <td className="px-5 py-4 text-slate-600">{property.status}</td>
                        <td className="px-5 py-4 text-right font-bold">{formatCurrency(Number(property.price_per_night))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
