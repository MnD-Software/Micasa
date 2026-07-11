"use client";

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
  Loader2,
  LogOut,
  MessageCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  ToggleRight,
  UsersRound,
  type LucideIcon
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { getBookingWhatsappNumber } from "@/lib/whatsapp";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const adminTokenKey = "micasa-admin-token";

type ApiProperty = {
  id: number;
  title: string;
  slug: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  location: string;
  featured: boolean;
  status: string;
  owner_id: number;
};

type ApiBooking = {
  id: number;
  guest_id: number;
  property_id: number;
  check_in: string;
  check_out: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

async function apiRequest<T>(path: string, token?: string) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function formatDateRange(checkIn: string, checkOut: string) {
  const formatter = new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric", year: "numeric" });
  return `${formatter.format(new Date(checkIn))} - ${formatter.format(new Date(checkOut))}`;
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (["paid", "confirmed", "active", "published"].includes(normalized)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (["cancelled", "failed", "inactive"].includes(normalized)) {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }
  return "bg-amber-50 text-amber-800 ring-amber-200";
}

function MetricCard({ label, value, Icon, detail }: { label: string; value: string | number; Icon: LucideIcon; detail: string }) {
  return (
    <Card className="overflow-hidden bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand-strong sm:h-11 sm:w-11">
          <Icon size={20} aria-hidden />
        </span>
        <span className="rounded-full bg-brand-ivory px-2.5 py-1 text-[11px] font-bold text-brand-muted sm:px-3 sm:text-xs">Live</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-brand-ink sm:mt-5 sm:text-3xl">{value}</p>
      <p className="mt-1 text-[13px] font-semibold text-brand-ink sm:text-sm">{label}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-brand-muted">{detail}</p>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [bookingState, setBookingState] = useState<LoadState>("idle");
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const whatsappNumber = getBookingWhatsappNumber();
  const paybillConfigured = Boolean(process.env.NEXT_PUBLIC_MPESA_PAYBILL);

  const loadProperties = useCallback(async () => {
    setLoadState("loading");
    setError("");
    try {
      const data = await apiRequest<ApiProperty[]>("/api/properties");
      setProperties(data);
      setLoadState("ready");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load properties");
      setLoadState("error");
    }
  }, []);

  const loadBookings = useCallback(async (nextToken = token) => {
    if (!nextToken) {
      setBookings([]);
      setBookingState("idle");
      return;
    }

    setBookingState("loading");
    setAuthError("");
    try {
      const data = await apiRequest<ApiBooking[]>("/api/bookings", nextToken);
      setBookings(data);
      setBookingState("ready");
    } catch (requestError) {
      setBookings([]);
      setBookingState("error");
      setAuthError(requestError instanceof Error ? requestError.message : "Unable to load bookings");
    }
  }, [token]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(adminTokenKey) ?? "";
    setToken(storedToken);
    void loadProperties();
    void loadBookings(storedToken);
  }, [loadBookings, loadProperties]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSigningIn(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Admin sign-in failed");
      }

      const data = (await response.json()) as { access_token: string };
      window.localStorage.setItem(adminTokenKey, data.access_token);
      setToken(data.access_token);
      setPassword("");
      await loadBookings(data.access_token);
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : "Admin sign-in failed");
    } finally {
      setIsSigningIn(false);
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(adminTokenKey);
    setToken("");
    setBookings([]);
    setBookingState("idle");
  }

  const propertyById = useMemo(() => {
    return new Map(properties.map((property) => [property.id, property]));
  }, [properties]);

  const activeProperties = properties.filter((property) => ["active", "published"].includes(property.status));
  const pendingBookings = bookings.filter((booking) => booking.booking_status !== "cancelled");
  const revenue = bookings.reduce((total, booking) => total + Number(booking.total_amount), 0);
  const maxCapacity = activeProperties.reduce((total, property) => total + property.guests, 0);
  const featuredCount = properties.filter((property) => property.featured).length;

  const metrics = [
    {
      label: "Active properties",
      value: activeProperties.length,
      detail: `${properties.length} total listing${properties.length === 1 ? "" : "s"} returned by the API`,
      Icon: Building2
    },
    {
      label: "Booking requests",
      value: token ? pendingBookings.length : "Locked",
      detail: token ? "Loaded from protected bookings API" : "Sign in to load real booking rows",
      Icon: Clock3
    },
    {
      label: "Collected value",
      value: token ? formatCurrency(revenue) : "Login",
      detail: "Sum of real booking totals in the database",
      Icon: CircleDollarSign
    },
    {
      label: "Guest capacity",
      value: maxCapacity,
      detail: "Total guests supported by active listings",
      Icon: UsersRound
    }
  ];

  const checklist: Array<[label: string, status: string, Icon: LucideIcon]> = [
    ["Backend API", loadState === "ready" ? "Connected" : loadState === "loading" ? "Checking" : "Needs attention", CheckCircle2],
    ["Property inventory", properties.length > 0 ? `${properties.length} real listings` : "No listings in database", CalendarDays],
    ["Admin bookings", token ? (bookingState === "ready" ? `${bookings.length} real bookings` : "Token connected") : "Admin sign-in required", ShieldCheck],
    ["M-Pesa PayBill", paybillConfigured ? "Configured" : "Needs PayBill", Smartphone],
    ["WhatsApp redirect", `Active: +${whatsappNumber}`, MessageCircle],
    ["Featured listings", `${featuredCount} featured`, ToggleRight]
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-white bg-brand-ink text-white shadow-luxe">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Live admin console</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                Real bookings, listings, and launch health
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                This dashboard now reads from the backend API. When the database is empty, it stays empty instead of showing demo bookings.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={() => { void loadProperties(); void loadBookings(); }}>
                  <RefreshCw size={18} aria-hidden />
                  Refresh data
                </Button>
                <a href="/become-host" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/16">
                  <Plus size={18} aria-hidden />
                  Add listing flow
                </a>
              </div>
            </div>

            <Card className="bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-brand-ink">Admin access</h2>
                  <p className="mt-1 text-sm text-brand-muted">
                    {token ? "Bookings are connected with your stored admin token." : "Sign in to load protected booking data."}
                  </p>
                </div>
                {token ? (
                  <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={16} aria-hidden />
                    Log out
                  </Button>
                ) : null}
              </div>

              {!token ? (
                <form className="mt-5 grid gap-3" onSubmit={handleLogin}>
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" required />
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
                  <Button type="submit" disabled={isSigningIn}>
                    {isSigningIn ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <ShieldCheck size={18} aria-hidden />}
                    Sign in
                  </Button>
                </form>
              ) : (
                <div className="mt-5 rounded-2xl border border-brand-line bg-brand-soft p-4">
                  <p className="font-bold text-brand-ink">Session connected</p>
                  <p className="mt-1 text-sm text-brand-muted">The dashboard will only show booking rows that exist in your backend database.</p>
                </div>
              )}

              {authError ? <p className="mt-3 text-sm font-semibold text-brand-error">{authError}</p> : null}
            </Card>
          </div>
        </section>

        {error ? (
          <section className="mt-6 rounded-3xl border border-brand-error/25 bg-white p-5 text-sm text-brand-error shadow-pearl">
            Backend connection failed: {error}. Check `NEXT_PUBLIC_API_URL` and confirm the Render API is awake.
          </section>
        ) : null}

        <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="overflow-hidden bg-white">
            <div className="flex flex-col gap-3 border-b border-brand-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-ink">Booking requests</h2>
                <p className="mt-1 text-sm text-brand-muted">Real rows from `/api/bookings`; no seeded fallback data.</p>
              </div>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-muted">
                {bookingState === "loading" ? "Loading" : `${bookings.length} records`}
              </span>
            </div>

            {!token ? (
              <div className="grid min-h-[260px] place-items-center p-8 text-center">
                <div className="max-w-sm">
                  <ShieldCheck className="mx-auto text-brand-strong" size={38} aria-hidden />
                  <h3 className="mt-4 text-xl font-bold text-brand-ink">Sign in to view bookings</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">Bookings are protected by the backend. The table will stay empty until an admin token is connected.</p>
                </div>
              </div>
            ) : bookingState === "loading" ? (
              <div className="grid min-h-[260px] place-items-center p-8 text-brand-muted">
                <Loader2 className="animate-spin" size={34} aria-hidden />
              </div>
            ) : bookings.length === 0 ? (
              <div className="grid min-h-[260px] place-items-center p-8 text-center">
                <div className="max-w-sm">
                  <CalendarDays className="mx-auto text-brand-strong" size={38} aria-hidden />
                  <h3 className="mt-4 text-xl font-bold text-brand-ink">No bookings yet</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-muted">Once guests create bookings through the backend, they will appear here. No demo rows are shown.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] text-left text-sm">
                  <thead className="bg-brand-soft text-xs uppercase tracking-[0.08em] text-brand-muted">
                    <tr>
                      <th className="px-5 py-4">Booking</th>
                      <th className="px-5 py-4">Property</th>
                      <th className="px-5 py-4">Dates</th>
                      <th className="px-5 py-4">Guest</th>
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    {bookings.map((booking) => {
                      const property = propertyById.get(booking.property_id);
                      return (
                        <tr key={booking.id}>
                          <td className="px-5 py-4">
                            <p className="font-bold text-brand-ink">MS-{String(booking.id).padStart(6, "0")}</p>
                            <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(booking.booking_status)}`}>
                              {booking.booking_status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-brand-ink">{property?.title ?? `Property #${booking.property_id}`}</p>
                            <p className="text-xs text-brand-muted">{property?.location ?? "Not in current property response"}</p>
                          </td>
                          <td className="px-5 py-4 text-brand-ink">{formatDateRange(booking.check_in, booking.check_out)}</td>
                          <td className="px-5 py-4 text-brand-muted">Guest #{booking.guest_id}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(booking.payment_status)}`}>
                              {booking.payment_status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-brand-ink">{formatCurrency(Number(booking.total_amount))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="bg-white p-5">
            <h2 className="text-xl font-bold text-brand-ink">Launch health</h2>
            <div className="mt-5 grid gap-4">
              {checklist.map(([label, status, Icon]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-brand-line bg-brand-ivory p-4">
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
          <Card className="bg-white p-5">
            <Banknote className="text-brand-strong" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">M-Pesa PayBill</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              {paybillConfigured ? "Public PayBill instructions are configured from environment variables." : "Add `NEXT_PUBLIC_MPESA_PAYBILL` to show real PayBill instructions publicly."}
            </p>
          </Card>
          <Card className="bg-white p-5">
            <MessageCircle className="text-brand-success" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">WhatsApp bookings</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Booking links send guest dates, bedrooms, guest count, and rate estimates to +{whatsappNumber}.
            </p>
          </Card>
          <Card className="bg-white p-5">
            <CreditCard className="text-brand-gold" size={26} aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-ink">Payment readiness</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Card and M-Pesa statuses come from actual booking rows once payments are recorded through the backend.
            </p>
          </Card>
        </section>

        <section className="mt-6 rounded-[30px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand-ink">Property inventory</h2>
              <p className="mt-1 text-sm text-brand-muted">Real listings returned by `/api/properties`.</p>
            </div>
            <span className="text-sm font-bold text-brand-ink">{activeProperties.length} active / {properties.length} total</span>
          </div>

          {loadState === "loading" ? (
            <div className="grid min-h-[180px] place-items-center text-brand-muted">
              <Loader2 className="animate-spin" size={32} aria-hidden />
            </div>
          ) : properties.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-brand-line bg-white p-6 text-center">
              <Building2 className="mx-auto text-brand-strong" size={38} aria-hidden />
              <h3 className="mt-4 text-xl font-bold text-brand-ink">No properties in the database</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">Create real properties through the backend and they will appear here. The dashboard no longer uses frontend seeded listings.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <article key={property.id} className="rounded-2xl border border-brand-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-brand-ink">{property.title}</h3>
                      <p className="mt-1 text-sm text-brand-muted">{property.location}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <p className="rounded-2xl bg-brand-soft p-3 font-semibold text-brand-ink"><BedDouble className="mb-2" size={17} aria-hidden />{property.bedrooms} beds</p>
                    <p className="rounded-2xl bg-brand-soft p-3 font-semibold text-brand-ink"><UsersRound className="mb-2" size={17} aria-hidden />{property.guests}</p>
                    <p className="rounded-2xl bg-brand-soft p-3 font-semibold text-brand-ink"><BadgeCheck className="mb-2" size={17} aria-hidden />{property.featured ? "Featured" : "Standard"}</p>
                  </div>
                  <p className="mt-4 text-sm font-bold text-brand-ink">{formatCurrency(Number(property.price_per_night))} / night</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
