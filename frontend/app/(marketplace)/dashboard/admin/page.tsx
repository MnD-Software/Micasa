"use client";

import {
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  Save,
  ShieldCheck,
  TrendingUp,
  UsersRound
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { defaultPublicSiteSettings, type PublicSiteSettings } from "@/hooks/use-public-site-settings";
import { formatCurrency } from "@/lib/utils";

const API_URL = "/api/backend";
const adminTokenKey = "micasa-admin-token";

type ApiPropertyImage = {
  id: number;
  image_url: string;
  display_order: number;
};

type ApiProperty = {
  id: number;
  title: string;
  slug: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  featured: boolean;
  status: string;
  owner_id: number;
  images?: ApiPropertyImage[];
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

type PropertyForm = {
  title: string;
  slug: string;
  description: string;
  property_type: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  guests: string;
  price_per_night: string;
  cleaning_fee: string;
  service_fee: string;
  status: string;
  featured: boolean;
  image_urls: string;
};

const emptyForm: PropertyForm = {
  title: "",
  slug: "",
  description: "",
  property_type: "Signature stay",
  location: "",
  bedrooms: "1",
  bathrooms: "1",
  guests: "2",
  price_per_night: "",
  cleaning_fee: "0",
  service_fee: "0",
  status: "published",
  featured: false,
  image_urls: ""
};

async function apiRequest<T>(path: string, token?: string, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
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

function propertyToForm(property: ApiProperty): PropertyForm {
  return {
    title: property.title,
    slug: property.slug,
    description: property.description,
    property_type: property.property_type,
    location: property.location,
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    guests: String(property.guests),
    price_per_night: String(Number(property.price_per_night)),
    cleaning_fee: String(Number(property.cleaning_fee)),
    service_fee: String(Number(property.service_fee)),
    status: property.status,
    featured: property.featured,
    image_urls: (property.images ?? []).sort((a, b) => a.display_order - b.display_order).map((image) => image.image_url).join("\n")
  };
}

function formToPayload(form: PropertyForm) {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description,
    property_type: form.property_type,
    location: form.location,
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    guests: Number(form.guests),
    price_per_night: Number(form.price_per_night),
    cleaning_fee: Number(form.cleaning_fee),
    service_fee: Number(form.service_fee),
    status: form.status,
    featured: form.featured,
    image_urls: form.image_urls.split("\n").map((url) => url.trim()).filter(Boolean)
  };
}

function formatDateRange(checkIn: string, checkOut: string) {
  const formatter = new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric" });
  return `${formatter.format(new Date(checkIn))} - ${formatter.format(new Date(checkOut))}`;
}

function MetricCard({ label, value, detail, Icon }: { label: string; value: string | number; detail: string; Icon: typeof LayoutDashboard }) {
  return (
    <Card className="border-0 bg-white p-4 shadow-[0_14px_42px_rgba(15,23,42,0.07)] sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white">
          <Icon size={19} aria-hidden />
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">Live</span>
      </div>
      <p className="mt-5 text-2xl font-bold text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{label}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{detail}</p>
    </Card>
  );
}

function BarChart({ bookings }: { bookings: ApiBooking[] }) {
  const rows = useMemo(() => {
    const buckets = new Map<string, number>();
    bookings.forEach((booking) => {
      const key = new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(booking.check_in));
      buckets.set(key, (buckets.get(key) ?? 0) + Number(booking.total_amount));
    });
    const entries = Array.from(buckets.entries()).slice(-6);
    const max = Math.max(...entries.map(([, value]) => value), 1);
    return entries.map(([label, value]) => ({ label, value, height: Math.max(8, Math.round((value / max) * 112)) }));
  }, [bookings]);

  return (
    <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Revenue trend</h2>
          <p className="text-sm text-slate-500">Booking value by arrival month</p>
        </div>
        <BarChart3 className="text-slate-400" size={24} aria-hidden />
      </div>
      <div className="mt-6 flex h-40 items-end gap-3">
        {rows.length ? rows.map((row) => (
          <div key={row.label} className="flex flex-1 flex-col items-center justify-end gap-2">
            <div className="w-full rounded-t-xl bg-slate-900" style={{ height: row.height }} />
            <span className="text-xs font-semibold text-slate-500">{row.label}</span>
          </div>
        )) : (
          <div className="grid h-full w-full place-items-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-500">
            No booking revenue yet
          </div>
        )}
      </div>
    </Card>
  );
}

function PackageChart({ properties }: { properties: ApiProperty[] }) {
  const rows = useMemo(() => {
    const buckets = new Map<string, number>();
    properties.forEach((property) => buckets.set(property.property_type, (buckets.get(property.property_type) ?? 0) + 1));
    const max = Math.max(...Array.from(buckets.values()), 1);
    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value, width: Math.round((value / max) * 100) }));
  }, [properties]);

  return (
    <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Package mix</h2>
          <p className="text-sm text-slate-500">Listings grouped by property package</p>
        </div>
        <Package className="text-slate-400" size={24} aria-hidden />
      </div>
      <div className="mt-6 grid gap-4">
        {rows.length ? rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-800">{row.label}</span>
              <span className="text-slate-500">{row.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${row.width}%` }} />
            </div>
          </div>
        )) : (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm font-semibold text-slate-500">No inventory yet</div>
        )}
      </div>
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editor, setEditor] = useState<PropertyForm>(emptyForm);
  const [createForm, setCreateForm] = useState<PropertyForm>(emptyForm);
  const [editorMessage, setEditorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [publicSettings, setPublicSettings] = useState<PublicSiteSettings>(defaultPublicSiteSettings);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const selectedProperty = properties.find((property) => property.id === selectedId) ?? properties[0];

  const loadProperties = useCallback(async () => {
    setLoadState("loading");
    setError("");
    try {
      const data = await apiRequest<ApiProperty[]>("/api/properties");
      setProperties(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
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

  const loadPublicSettings = useCallback(async () => {
    try {
      const data = await apiRequest<PublicSiteSettings>("/api/site-settings/public");
      setPublicSettings({
        nav_badges: {
          ...defaultPublicSiteSettings.nav_badges,
          ...(data.nav_badges ?? {})
        }
      });
    } catch {
      setPublicSettings(defaultPublicSiteSettings);
    }
  }, []);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(adminTokenKey) ?? "";
    setToken(storedToken);
    void loadProperties();
    void loadBookings(storedToken);
    void loadPublicSettings();
  }, [loadBookings, loadProperties, loadPublicSettings]);

  useEffect(() => {
    if (selectedProperty) {
      setEditor(propertyToForm(selectedProperty));
    }
  }, [selectedProperty]);

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

  async function saveSelectedProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !selectedProperty) {
      setEditorMessage("Sign in as admin before editing inventory.");
      return;
    }
    setIsSaving(true);
    setEditorMessage("");
    try {
      await apiRequest<ApiProperty>(`/api/properties/${selectedProperty.id}`, token, {
        method: "PUT",
        body: JSON.stringify(formToPayload(editor))
      });
      setEditorMessage("Listing updated.");
      await loadProperties();
    } catch (requestError) {
      setEditorMessage(requestError instanceof Error ? requestError.message : "Unable to update listing.");
    } finally {
      setIsSaving(false);
    }
  }

  async function createProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setEditorMessage("Sign in as admin before creating inventory.");
      return;
    }
    setIsSaving(true);
    setEditorMessage("");
    try {
      const created = await apiRequest<ApiProperty>("/api/properties", token, {
        method: "POST",
        body: JSON.stringify(formToPayload(createForm))
      });
      setCreateForm(emptyForm);
      setSelectedId(created.id);
      setEditorMessage("Listing created.");
      await loadProperties();
    } catch (requestError) {
      setEditorMessage(requestError instanceof Error ? requestError.message : "Unable to create listing.");
    } finally {
      setIsSaving(false);
    }
  }

  async function savePublicSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setSettingsMessage("Sign in as admin before changing public badges.");
      return;
    }
    setIsSavingSettings(true);
    setSettingsMessage("");
    try {
      const data = await apiRequest<PublicSiteSettings>("/api/site-settings/public", token, {
        method: "PUT",
        body: JSON.stringify(publicSettings)
      });
      setPublicSettings(data);
      setSettingsMessage("Public badge settings saved.");
    } catch (requestError) {
      setSettingsMessage(requestError instanceof Error ? requestError.message : "Unable to save badge settings.");
    } finally {
      setIsSavingSettings(false);
    }
  }

  const propertyById = useMemo(() => new Map(properties.map((property) => [property.id, property])), [properties]);
  const activeProperties = properties.filter((property) => ["active", "published"].includes(property.status));
  const pendingBookings = bookings.filter((booking) => booking.booking_status !== "cancelled");
  const revenue = bookings.reduce((total, booking) => total + Number(booking.total_amount), 0);
  const maxCapacity = activeProperties.reduce((total, property) => total + property.guests, 0);
  const averageRate = activeProperties.length
    ? activeProperties.reduce((total, property) => total + Number(property.price_per_night), 0) / activeProperties.length
    : 0;

  const metrics = [
    ["Active listings", activeProperties.length, `${properties.length} total inventory records`, Building2],
    ["Booking requests", token ? pendingBookings.length : "Locked", bookingState === "loading" ? "Loading protected bookings" : "Operations queue", CalendarDays],
    ["Gross booking value", token ? formatCurrency(revenue) : "Login", "Total recorded booking value", CircleDollarSign],
    ["Guest capacity", maxCapacity, `Avg rate ${formatCurrency(averageRate)}`, UsersRound]
  ] as const;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 px-5 py-6 text-white lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500 font-bold">M</span>
            <div>
              <p className="font-bold">Micasa Ops</p>
              <p className="text-xs text-white/50">Administration</p>
            </div>
          </div>
          <nav className="mt-8 grid gap-2 text-sm font-semibold">
            {[
              [LayoutDashboard, "Overview"],
              [Building2, "Inventory"],
              [Package, "Packages"],
              [ClipboardList, "Bookings"],
              [ImageIcon, "Content"]
            ].map(([Icon, label]) => (
              <a key={String(label)} href={`#${String(label).toLowerCase()}`} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/72 transition hover:bg-white/10 hover:text-white">
                <Icon size={18} aria-hidden />
                {String(label)}
              </a>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Operations console</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Dashboard</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => { void loadProperties(); void loadBookings(); }}>
                  <RefreshCw size={17} aria-hidden />
                  Refresh
                </Button>
                {token ? (
                  <Button type="button" variant="dark" onClick={handleLogout}>
                    <LogOut size={17} aria-hidden />
                    Log out
                  </Button>
                ) : null}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
            {!token ? (
              <Card className="mb-5 border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <div className="grid gap-5 lg:grid-cols-[1fr_420px] lg:items-center">
                  <div>
                    <ShieldCheck className="text-teal-700" size={30} aria-hidden />
                    <h2 className="mt-3 text-2xl font-bold text-slate-950">Admin authentication required</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Sign in to edit inventory, arrange listing packages, and view protected booking operations.
                    </p>
                  </div>
                  <form className="grid gap-3" onSubmit={handleLogin}>
                    <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" required />
                    <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
                    <Button type="submit" disabled={isSigningIn}>
                      {isSigningIn ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <ShieldCheck size={18} aria-hidden />}
                      Sign in
                    </Button>
                    {authError ? <p className="text-sm font-semibold text-rose-700">{authError}</p> : null}
                  </form>
                </div>
              </Card>
            ) : null}

            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                Inventory connection failed: {error}
              </div>
            ) : null}

            <section id="overview" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {metrics.map(([label, value, detail, Icon]) => (
                <MetricCard key={label} label={label} value={value} detail={detail} Icon={Icon} />
              ))}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
              <BarChart bookings={bookings} />
              <PackageChart properties={properties} />
            </section>

            <Card className="mt-5 border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Public navigation badges</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Turn these on only when the admin team has launched something new for guests.
                  </p>
                </div>
                <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={savePublicSettings}>
                  {(["experiences", "services"] as const).map((key) => (
                    <label key={key} className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 text-sm font-semibold capitalize text-slate-900">
                      {key}
                      <input
                        type="checkbox"
                        checked={publicSettings.nav_badges[key]}
                        onChange={(event) =>
                          setPublicSettings({
                            nav_badges: {
                              ...publicSettings.nav_badges,
                              [key]: event.target.checked
                            }
                          })
                        }
                        className="h-5 w-5 accent-teal-700"
                      />
                    </label>
                  ))}
                  <Button type="submit" disabled={isSavingSettings}>
                    {isSavingSettings ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Save size={18} aria-hidden />}
                    Save badges
                  </Button>
                </form>
              </div>
              {settingsMessage ? <p className="mt-3 text-sm font-semibold text-slate-600">{settingsMessage}</p> : null}
            </Card>

            <section id="inventory" className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Inventory</h2>
                    <p className="text-sm text-slate-500">{loadState === "loading" ? "Loading listings" : `${properties.length} listing records`}</p>
                  </div>
                  <Home className="text-slate-400" size={24} aria-hidden />
                </div>
                <div className="mt-5 grid max-h-[620px] gap-3 overflow-y-auto pr-1">
                  {properties.map((property) => (
                    <button
                      key={property.id}
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        selectedProperty?.id === property.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-slate-400"
                      ].join(" ")}
                      onClick={() => setSelectedId(property.id)}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-bold">{property.title}</p>
                          <p className={selectedProperty?.id === property.id ? "mt-1 text-sm text-white/60" : "mt-1 text-sm text-slate-500"}>{property.property_type}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${statusTone(property.status)}`}>{property.status}</span>
                      </div>
                      <div className={selectedProperty?.id === property.id ? "mt-3 flex flex-wrap gap-2 text-xs text-white/68" : "mt-3 flex flex-wrap gap-2 text-xs text-slate-500"}>
                        <span>{property.guests} guests</span>
                        <span>{property.bedrooms} bedrooms</span>
                        <span>{formatCurrency(Number(property.price_per_night))}</span>
                      </div>
                    </button>
                  ))}
                  {!properties.length ? (
                    <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                      No inventory records yet.
                    </div>
                  ) : null}
                </div>
              </Card>

              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Listing editor</h2>
                    <p className="text-sm text-slate-500">Arrange packages, pricing, content, and publishing state.</p>
                  </div>
                  <BedDouble className="text-slate-400" size={24} aria-hidden />
                </div>

                <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={saveSelectedProperty}>
                  <Input value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} placeholder="Title" required />
                  <Input value={editor.slug} onChange={(event) => setEditor({ ...editor, slug: event.target.value })} placeholder="Slug" required />
                  <Input value={editor.property_type} onChange={(event) => setEditor({ ...editor, property_type: event.target.value })} placeholder="Package or property type" required />
                  <Input value={editor.location} onChange={(event) => setEditor({ ...editor, location: event.target.value })} placeholder="Location" required />
                  <Input value={editor.bedrooms} onChange={(event) => setEditor({ ...editor, bedrooms: event.target.value })} type="number" min={0} placeholder="Bedrooms" required />
                  <Input value={editor.bathrooms} onChange={(event) => setEditor({ ...editor, bathrooms: event.target.value })} type="number" min={0} placeholder="Bathrooms" required />
                  <Input value={editor.guests} onChange={(event) => setEditor({ ...editor, guests: event.target.value })} type="number" min={1} placeholder="Guests" required />
                  <Input value={editor.price_per_night} onChange={(event) => setEditor({ ...editor, price_per_night: event.target.value })} type="number" min={1} placeholder="Nightly rate" required />
                  <Input value={editor.cleaning_fee} onChange={(event) => setEditor({ ...editor, cleaning_fee: event.target.value })} type="number" min={0} placeholder="Cleaning fee" />
                  <Input value={editor.service_fee} onChange={(event) => setEditor({ ...editor, service_fee: event.target.value })} type="number" min={0} placeholder="Service fee" />
                  <select value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value })} className="h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold outline-none">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 px-4 text-sm font-semibold">
                    <input type="checkbox" checked={editor.featured} onChange={(event) => setEditor({ ...editor, featured: event.target.checked })} className="accent-teal-700" />
                    Featured collection
                  </label>
                  <textarea value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm outline-none md:col-span-2" placeholder="Guest-facing description" required />
                  <textarea value={editor.image_urls} onChange={(event) => setEditor({ ...editor, image_urls: event.target.value })} className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm outline-none md:col-span-2" placeholder="One public image URL per line" />
                  <Button type="submit" disabled={isSaving || !selectedProperty} className="md:col-span-2">
                    {isSaving ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Save size={18} aria-hidden />}
                    Save listing
                  </Button>
                </form>
                {editorMessage ? <p className="mt-3 text-sm font-semibold text-slate-600">{editorMessage}</p> : null}
              </Card>
            </section>

            <section id="packages" className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
              <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <h2 className="text-lg font-bold text-slate-950">Create listing</h2>
                <p className="mt-1 text-sm text-slate-500">New houses can be assigned to their package immediately.</p>
                <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={createProperty}>
                  <Input value={createForm.title} onChange={(event) => setCreateForm({ ...createForm, title: event.target.value })} placeholder="Title" required />
                  <Input value={createForm.slug} onChange={(event) => setCreateForm({ ...createForm, slug: event.target.value })} placeholder="Slug" required />
                  <Input value={createForm.property_type} onChange={(event) => setCreateForm({ ...createForm, property_type: event.target.value })} placeholder="Package" required />
                  <Input value={createForm.location} onChange={(event) => setCreateForm({ ...createForm, location: event.target.value })} placeholder="Location" required />
                  <Input value={createForm.bedrooms} onChange={(event) => setCreateForm({ ...createForm, bedrooms: event.target.value })} type="number" min={0} placeholder="Bedrooms" required />
                  <Input value={createForm.bathrooms} onChange={(event) => setCreateForm({ ...createForm, bathrooms: event.target.value })} type="number" min={0} placeholder="Bathrooms" required />
                  <Input value={createForm.guests} onChange={(event) => setCreateForm({ ...createForm, guests: event.target.value })} type="number" min={1} placeholder="Guests" required />
                  <Input value={createForm.price_per_night} onChange={(event) => setCreateForm({ ...createForm, price_per_night: event.target.value })} type="number" min={1} placeholder="Nightly rate" required />
                  <textarea value={createForm.description} onChange={(event) => setCreateForm({ ...createForm, description: event.target.value })} className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm outline-none md:col-span-2" placeholder="Guest-facing description" required />
                  <textarea value={createForm.image_urls} onChange={(event) => setCreateForm({ ...createForm, image_urls: event.target.value })} className="min-h-28 rounded-2xl border border-slate-200 p-4 text-sm outline-none md:col-span-2" placeholder="One public image URL per line" />
                  <Button type="submit" disabled={isSaving} className="md:col-span-2">Create listing</Button>
                </form>
              </Card>

              <Card id="bookings" className="overflow-hidden border-0 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="text-lg font-bold text-slate-950">Bookings</h2>
                  <p className="text-sm text-slate-500">{bookingState === "loading" ? "Loading" : `${bookings.length} records`}</p>
                </div>
                <div className="max-h-[540px] overflow-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Booking</th>
                        <th className="px-5 py-4">Listing</th>
                        <th className="px-5 py-4">Dates</th>
                        <th className="px-5 py-4">Payment</th>
                        <th className="px-5 py-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => {
                        const property = propertyById.get(booking.property_id);
                        return (
                          <tr key={booking.id}>
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-950">MS-{String(booking.id).padStart(6, "0")}</p>
                              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(booking.booking_status)}`}>{booking.booking_status}</span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-900">{property?.title ?? `Property #${booking.property_id}`}</p>
                              <p className="text-xs text-slate-500">{property?.property_type ?? "Unassigned"}</p>
                            </td>
                            <td className="px-5 py-4 text-slate-700">{formatDateRange(booking.check_in, booking.check_out)}</td>
                            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTone(booking.payment_status)}`}>{booking.payment_status}</span></td>
                            <td className="px-5 py-4 text-right font-bold text-slate-950">{formatCurrency(Number(booking.total_amount))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {!bookings.length ? (
                    <div className="grid min-h-48 place-items-center p-6 text-center text-sm font-semibold text-slate-500">
                      Sign in to load bookings, or wait for the first guest reservation.
                    </div>
                  ) : null}
                </div>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
