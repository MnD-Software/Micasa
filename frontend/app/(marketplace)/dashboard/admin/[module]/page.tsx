"use client";

import {
  BarChart3,
  Building2,
  ClipboardList,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Package,
  Save,
  UploadCloud,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { properties as storefrontProperties } from "@/lib/marketplace-data";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/marketplace";

const API_URL = "/api/backend";
const adminTokenKey = "micasa-admin-token";

class ApiRequestError extends Error {
  constructor(public status: number) {
    super(`Request failed with ${status}`);
  }
}

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
  images?: ApiPropertyImage[];
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

type AdminProperty = {
  apiId?: number;
  storefrontId?: string;
  source: "backend" | "storefront";
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
  image_urls: string[];
  rating: number;
  reviews: number;
};

type PropertyDraft = {
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

const modules: Record<string, { title: string; icon: LucideIcon; description: string }> = {
  inventory: { title: "Inventory", icon: Building2, description: "Listings, publishing state, rates, capacity, and source." },
  packages: { title: "Packages", icon: Package, description: "How storefront stays are grouped and priced by package." },
  bookings: { title: "Bookings", icon: ClipboardList, description: "Guest reservation and payment operations." },
  content: { title: "Content", icon: ImageIcon, description: "Storefront cards, media, and guest-facing listing copy." }
};

const navItems: Array<{ Icon: LucideIcon; label: string; href: string }> = [
  { Icon: LayoutDashboard, label: "Overview", href: "/dashboard/admin" },
  { Icon: Building2, label: "Inventory", href: "/dashboard/admin/inventory" },
  { Icon: Package, label: "Packages", href: "/dashboard/admin/packages" },
  { Icon: ClipboardList, label: "Bookings", href: "/dashboard/admin/bookings" },
  { Icon: ImageIcon, label: "Content", href: "/dashboard/admin/content" }
];

const emptyRows = [{ label: "No data", value: 0 }];

async function apiRequest<T>(path: string, token?: string, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new ApiRequestError(response.status);
  }
  return response.json() as Promise<T>;
}

function storefrontToAdminProperty(property: Property): AdminProperty {
  return {
    storefrontId: property.id,
    source: "storefront",
    title: property.title,
    slug: property.slug,
    description: property.description,
    property_type: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    guests: property.guests,
    price_per_night: property.pricePerNight,
    cleaning_fee: property.cleaningFee,
    service_fee: property.serviceFee,
    location: property.location,
    latitude: property.coordinates.lat,
    longitude: property.coordinates.lng,
    featured: Boolean(property.featured),
    status: "published",
    image_urls: property.images,
    rating: property.rating,
    reviews: property.reviews
  };
}

function apiToAdminProperty(property: ApiProperty): AdminProperty {
  const fallback = storefrontProperties.find((item) => item.slug === property.slug);
  const imageUrls = (property.images ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((image) => image.image_url)
    .filter(Boolean);
  return {
    apiId: property.id,
    storefrontId: fallback?.id,
    source: "backend",
    title: property.title,
    slug: property.slug,
    description: property.description,
    property_type: property.property_type,
    bedrooms: Number(property.bedrooms),
    bathrooms: Number(property.bathrooms),
    guests: Number(property.guests),
    price_per_night: Number(property.price_per_night),
    cleaning_fee: Number(property.cleaning_fee),
    service_fee: Number(property.service_fee),
    location: property.location,
    latitude: property.latitude,
    longitude: property.longitude,
    featured: Boolean(property.featured),
    status: property.status,
    image_urls: imageUrls.length ? imageUrls : fallback?.images ?? [],
    rating: fallback?.rating ?? 5,
    reviews: fallback?.reviews ?? 0
  };
}

function toDraft(property: AdminProperty): PropertyDraft {
  return {
    title: property.title,
    slug: property.slug,
    description: property.description,
    property_type: property.property_type,
    location: property.location,
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    guests: String(property.guests),
    price_per_night: String(property.price_per_night),
    cleaning_fee: String(property.cleaning_fee),
    service_fee: String(property.service_fee),
    status: property.status,
    featured: property.featured,
    image_urls: property.image_urls.join("\n")
  };
}

function draftToPayload(draft: PropertyDraft, property?: AdminProperty) {
  return {
    title: draft.title,
    slug: draft.slug,
    description: draft.description,
    property_type: draft.property_type,
    location: draft.location,
    bedrooms: Number(draft.bedrooms),
    bathrooms: Number(draft.bathrooms),
    guests: Number(draft.guests),
    price_per_night: Number(draft.price_per_night),
    cleaning_fee: Number(draft.cleaning_fee),
    service_fee: Number(draft.service_fee),
    latitude: property?.latitude ?? null,
    longitude: property?.longitude ?? null,
    status: draft.status,
    featured: draft.featured,
    image_urls: draft.image_urls.split("\n").map((url) => url.trim()).filter(Boolean)
  };
}

function mergeAdminProperties(apiProperties: ApiProperty[]): AdminProperty[] {
  const backendRows = apiProperties.map(apiToAdminProperty);
  const backendBySlug = new Map(backendRows.map((property) => [property.slug, property]));
  const mergedRows = storefrontProperties.map((property) => backendBySlug.get(property.slug) ?? storefrontToAdminProperty(property));
  const storefrontSlugs = new Set(storefrontProperties.map((property) => property.slug));
  return [...mergedRows, ...backendRows.filter((property) => !storefrontSlugs.has(property.slug))];
}

function countRows(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

function MiniBars({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="mt-5 grid gap-3">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[96px_1fr_44px] items-center gap-3 text-sm sm:grid-cols-[130px_1fr_58px]">
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

function KpiCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{detail}</p>
    </Card>
  );
}

function SourcePill({ source }: { source: AdminProperty["source"] }) {
  return (
    <span className={["rounded-full px-2.5 py-1 text-[11px] font-bold ring-1", source === "backend" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-sky-50 text-sky-700 ring-sky-200"].join(" ")}>
      {source === "backend" ? "Editable" : "Storefront"}
    </span>
  );
}

export default function AdminModulePage() {
  const params = useParams<{ module?: string }>();
  const requestedModule = params.module;
  const moduleKey = requestedModule && requestedModule in modules ? requestedModule : "inventory";
  const currentModule = modules[moduleKey];
  const Icon = currentModule.icon;
  const [apiProperties, setApiProperties] = useState<ApiProperty[]>([]);
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(storefrontProperties[0]?.slug ?? "");
  const properties = useMemo(() => mergeAdminProperties(apiProperties), [apiProperties]);
  const selectedProperty = properties.find((property) => property.slug === selectedSlug) ?? properties[0];
  const [draft, setDraft] = useState<PropertyDraft>(() => toDraft(storefrontToAdminProperty(storefrontProperties[0])));

  useEffect(() => {
    const storedToken = window.localStorage.getItem(adminTokenKey) ?? "";
    setToken(storedToken);
    async function load() {
      try {
        const nextProperties = await apiRequest<ApiProperty[]>("/api/properties");
        setApiProperties(nextProperties);
        if (storedToken) {
          try {
            setBookings(await apiRequest<ApiBooking[]>("/api/bookings", storedToken));
          } catch (bookingError) {
            if (bookingError instanceof ApiRequestError && bookingError.status === 401) {
              window.localStorage.removeItem(adminTokenKey);
              setToken("");
              setBookings([]);
              setError("Admin session expired. Sign in again from Overview to view protected booking data and save edits.");
              return;
            }
            throw bookingError;
          }
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load module data");
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      setDraft(toDraft(selectedProperty));
    }
  }, [selectedProperty]);

  const statusRows = useMemo(() => countRows(properties.map((property) => property.status)), [properties]);
  const packageRows = useMemo(() => countRows(properties.map((property) => property.property_type)), [properties]);
  const sourceRows = useMemo(() => countRows(properties.map((property) => property.source)), [properties]);
  const bookingRows = useMemo(() => countRows(bookings.map((booking) => booking.booking_status)), [bookings]);
  const revenue = bookings.reduce((total, booking) => total + Number(booking.total_amount), 0);
  const averageRate = properties.length ? properties.reduce((total, property) => total + property.price_per_night, 0) / properties.length : 0;
  const mediaCount = properties.reduce((total, property) => total + property.image_urls.length, 0);
  const featuredCount = properties.filter((property) => property.featured).length;
  const packageGroups = useMemo(() => {
    const groups = new Map<string, AdminProperty[]>();
    properties.forEach((property) => groups.set(property.property_type, [...(groups.get(property.property_type) ?? []), property]));
    return Array.from(groups.entries()).map(([name, rows]) => ({ name, rows }));
  }, [properties]);

  async function refreshProperties() {
    setApiProperties(await apiRequest<ApiProperty[]>("/api/properties"));
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setMessage("Sign in from Overview before saving storefront content.");
      return;
    }
    if (!selectedProperty) {
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const payload = draftToPayload(draft, selectedProperty);
      if (selectedProperty.apiId) {
        await apiRequest<ApiProperty>(`/api/properties/${selectedProperty.apiId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setMessage("Content updated in the backend.");
      } else {
        const created = await apiRequest<ApiProperty>("/api/properties", token, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setSelectedSlug(created.slug);
        setMessage("Storefront item published to the backend and can now be edited dynamically.");
      }
      await refreshProperties();
    } catch (requestError) {
      if (requestError instanceof ApiRequestError && requestError.status === 401) {
        window.localStorage.removeItem(adminTokenKey);
        setToken("");
        setMessage("Admin session expired. Sign in from Overview and try again.");
      } else {
        setMessage(requestError instanceof Error ? requestError.message : "Unable to save content.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) {
      return;
    }
    if (!token) {
      setMessage("Sign in from Overview before uploading images.");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch(`${API_URL}/api/uploads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body
        });
        if (!response.ok) {
          if (response.status === 401) {
            window.localStorage.removeItem(adminTokenKey);
            setToken("");
            throw new Error("Admin session expired. Sign in from Overview and try again.");
          }
          const errorBody = await response.json().catch(() => null) as { detail?: string } | null;
          throw new Error(errorBody?.detail ?? `Image upload failed with ${response.status}`);
        }
        const result = await response.json() as { url: string };
        uploadedUrls.push(result.url);
      }
      setDraft((current) => ({
        ...current,
        image_urls: [current.image_urls.trim(), ...uploadedUrls].filter(Boolean).join("\n")
      }));
      setMessage(`${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded. Save content to attach them to this listing.`);
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Unable to upload image.");
    } finally {
      setUploading(false);
    }
  }

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
            {navItems.map(({ Icon: NavIcon, label, href }) => (
              <a key={label} href={href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-white/72 transition hover:bg-white/10 hover:text-white">
                <NavIcon size={18} aria-hidden />
                {label}
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
              {navItems.map(({ label, href }) => (
                <a key={label} href={href} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
            {error ? <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
            <p className="mb-5 text-sm text-slate-500">{currentModule.description}</p>

            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiCard label="Storefront listings" value={properties.length} detail={`${apiProperties.length} saved in backend, ${storefrontProperties.length} bundled storefront items`} />
              <KpiCard label={moduleKey === "content" ? "Media assets" : "Packages"} value={moduleKey === "content" ? mediaCount : packageRows.length} detail={moduleKey === "content" ? "Images visible in listing cards and detail pages" : "Distinct storefront packages"} />
              <KpiCard label="Revenue" value={formatCurrency(revenue)} detail={bookings.length ? "Recorded booking value" : "Sign in and receive bookings to populate"} />
              <KpiCard label={moduleKey === "content" ? "Featured" : "Average rate"} value={moduleKey === "content" ? featuredCount : formatCurrency(averageRate)} detail={moduleKey === "content" ? "Items highlighted as guest favorites" : "Average nightly listing rate"} />
            </section>

            {moduleKey === "content" ? (
              <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                <Card className="border-0 bg-white p-4 shadow-[0_14px_42px_rgba(15,23,42,0.07)] sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">Storefront cards</h2>
                      <p className="text-sm text-slate-500">These are the cards guests see on the public site.</p>
                    </div>
                    <ImageIcon size={22} className="text-slate-400" aria-hidden />
                  </div>
                  <div className="mt-5 grid max-h-[660px] gap-3 overflow-y-auto pr-1">
                    {properties.map((property) => (
                      <button
                        key={`${property.source}-${property.slug}`}
                        className={["grid grid-cols-[86px_1fr] gap-3 rounded-2xl border p-3 text-left transition", selectedProperty?.slug === property.slug ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-slate-400"].join(" ")}
                        onClick={() => setSelectedSlug(property.slug)}
                        type="button"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                          <Image src={property.image_urls[0] ?? "/images/brand/micasa-logo.jpeg"} alt="" fill sizes="86px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-2 font-bold">{property.title}</p>
                            <SourcePill source={property.source} />
                          </div>
                          <p className={selectedProperty?.slug === property.slug ? "mt-1 truncate text-xs text-white/62" : "mt-1 truncate text-xs text-slate-500"}>{property.location}</p>
                          <p className={selectedProperty?.slug === property.slug ? "mt-2 text-xs text-white/70" : "mt-2 text-xs text-slate-500"}>{property.image_urls.length} images - {formatCurrency(property.price_per_night)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="border-0 bg-white p-4 shadow-[0_14px_42px_rgba(15,23,42,0.07)] sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Edit storefront content</h2>
                      <p className="text-sm text-slate-500">
                        {selectedProperty?.source === "backend" ? "This item is already editable from the backend." : "This item is bundled in the storefront. Saving publishes it to the backend first."}
                      </p>
                    </div>
                    {selectedProperty ? <SourcePill source={selectedProperty.source} /> : null}
                  </div>
                  <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={saveContent}>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Title
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Slug
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Package
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" value={draft.property_type} onChange={(event) => setDraft({ ...draft, property_type: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Location
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Guests
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={1} type="number" value={draft.guests} onChange={(event) => setDraft({ ...draft, guests: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Bedrooms
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={0} type="number" value={draft.bedrooms} onChange={(event) => setDraft({ ...draft, bedrooms: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Bathrooms
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={0} type="number" value={draft.bathrooms} onChange={(event) => setDraft({ ...draft, bathrooms: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Nightly rate
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={1} type="number" value={draft.price_per_night} onChange={(event) => setDraft({ ...draft, price_per_night: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Cleaning fee
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={0} type="number" value={draft.cleaning_fee} onChange={(event) => setDraft({ ...draft, cleaning_fee: event.target.value })} />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Service fee
                      <input className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" min={0} type="number" value={draft.service_fee} onChange={(event) => setDraft({ ...draft, service_fee: event.target.value })} />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                      Status
                      <select className="h-12 rounded-full border border-slate-200 px-4 text-base outline-none sm:text-sm" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                    <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700">
                      <input checked={draft.featured} className="h-5 w-5 accent-teal-700" onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} type="checkbox" />
                      Guest favorite badge
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2">
                      Description
                      <textarea className="min-h-32 rounded-2xl border border-slate-200 p-4 text-base outline-none sm:text-sm" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} required />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2">
                      Images shown on storefront cards and detail pages
                      <span className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-slate-500">Upload from your computer, then save the listing.</span>
                        <span className="relative inline-flex">
                          <input
                            accept="image/*"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            disabled={uploading}
                            multiple
                            onChange={(event) => {
                              void uploadImages(event.target.files);
                              event.target.value = "";
                            }}
                            type="file"
                          />
                          <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white">
                            {uploading ? <Loader2 className="animate-spin" size={17} aria-hidden /> : <UploadCloud size={17} aria-hidden />}
                            {uploading ? "Uploading" : "Choose images"}
                          </span>
                        </span>
                      </span>
                      <textarea className="min-h-40 rounded-2xl border border-slate-200 p-4 text-base outline-none sm:text-sm" value={draft.image_urls} onChange={(event) => setDraft({ ...draft, image_urls: event.target.value })} />
                    </label>
                    <Button className="md:col-span-2" disabled={saving} type="submit">
                      {saving ? <Loader2 className="animate-spin" size={18} aria-hidden /> : selectedProperty?.apiId ? <Save size={18} aria-hidden /> : <UploadCloud size={18} aria-hidden />}
                      {selectedProperty?.apiId ? "Save content" : "Publish and edit dynamically"}
                    </Button>
                  </form>
                  {message ? <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p> : null}
                </Card>
              </section>
            ) : null}

            {moduleKey === "packages" ? (
              <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                  <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Package mix</h2>
                  <MiniBars rows={packageRows.length ? packageRows : emptyRows} />
                </Card>
                <div className="grid gap-4">
                  {packageGroups.map((group) => (
                    <Card key={group.name} className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold">{group.name}</h2>
                          <p className="text-sm text-slate-500">{group.rows.length} listings - avg {formatCurrency(group.rows.reduce((sum, item) => sum + item.price_per_night, 0) / group.rows.length)}</p>
                        </div>
                        <Package className="text-slate-400" size={24} aria-hidden />
                      </div>
                      <div className="mt-4 grid gap-2">
                        {group.rows.map((property) => (
                          <div key={property.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                            <span className="font-semibold">{property.title}</span>
                            <span className="text-sm font-bold">{formatCurrency(property.price_per_night)}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {moduleKey === "bookings" ? (
              <section className="mt-5 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
                <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                  <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Booking mix</h2>
                  <MiniBars rows={bookingRows.length ? bookingRows : [{ label: token ? "No bookings" : "Login", value: 0 }]} />
                  {!token ? <p className="mt-4 text-sm font-semibold text-amber-700">Sign in from Overview to load protected booking records.</p> : null}
                </Card>
                <Card className="overflow-hidden border-0 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                  <div className="border-b border-slate-100 p-5">
                    <h2 className="text-lg font-bold">Booking records</h2>
                    <p className="text-sm text-slate-500">{bookings.length} records returned by the backend.</p>
                  </div>
                  <div className="max-h-[560px] overflow-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Booking</th>
                          <th className="px-5 py-4">Property</th>
                          <th className="px-5 py-4">Dates</th>
                          <th className="px-5 py-4">Payment</th>
                          <th className="px-5 py-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-5 py-4 font-bold">MS-{String(booking.id).padStart(6, "0")}</td>
                            <td className="px-5 py-4 text-slate-600">{properties.find((property) => property.apiId === booking.property_id)?.title ?? `Property #${booking.property_id}`}</td>
                            <td className="px-5 py-4 text-slate-600">{booking.check_in} to {booking.check_out}</td>
                            <td className="px-5 py-4 text-slate-600">{booking.payment_status}</td>
                            <td className="px-5 py-4 text-right font-bold">{formatCurrency(Number(booking.total_amount))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!bookings.length ? <div className="grid min-h-52 place-items-center p-8 text-center text-sm font-semibold text-slate-500">No booking records are available yet.</div> : null}
                  </div>
                </Card>
              </section>
            ) : null}

            {moduleKey === "inventory" ? (
              <section className="mt-5 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
                <div className="grid gap-5">
                  <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                    <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Publishing status</h2>
                    <MiniBars rows={statusRows.length ? statusRows : emptyRows} />
                  </Card>
                  <Card className="border-0 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                    <h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 size={20} aria-hidden /> Source mix</h2>
                    <MiniBars rows={sourceRows.length ? sourceRows : emptyRows} />
                  </Card>
                </div>
                <Card className="overflow-hidden border-0 bg-white shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
                  <div className="border-b border-slate-100 p-5">
                    <h2 className="text-lg font-bold">Inventory records</h2>
                    <p className="text-sm text-slate-500">Storefront listings plus backend overrides.</p>
                  </div>
                  <div className="max-h-[620px] overflow-auto">
                    <table className="w-full min-w-[840px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Listing</th>
                          <th className="px-5 py-4">Package</th>
                          <th className="px-5 py-4">Capacity</th>
                          <th className="px-5 py-4">Source</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4 text-right">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {properties.map((property) => (
                          <tr key={`${property.source}-${property.slug}`}>
                            <td className="px-5 py-4 font-semibold">{property.title}</td>
                            <td className="px-5 py-4 text-slate-600">{property.property_type}</td>
                            <td className="px-5 py-4 text-slate-600">{property.guests} guests - {property.bedrooms} bedrooms</td>
                            <td className="px-5 py-4"><SourcePill source={property.source} /></td>
                            <td className="px-5 py-4 text-slate-600">{property.status}</td>
                            <td className="px-5 py-4 text-right font-bold">{formatCurrency(property.price_per_night)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
