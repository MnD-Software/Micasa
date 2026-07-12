"use client";

import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { PropertyCard } from "@/components/marketplace/property-card";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useLiveProperties } from "@/hooks/use-live-properties";
import { useAuthStore } from "@/store/auth-store";
import { useSavedStore } from "@/store/saved-store";

export default function SavedPage() {
  const hydrated = useHydrated();
  const accountKey = useAuthStore((state) => state.accountKey);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const properties = useLiveProperties();
  const savedIds = useSavedStore((state) => state.getSavedIds(accountKey));
  const visibleSavedIds = hydrated ? savedIds : [];
  const visibleIsAuthenticated = hydrated && isAuthenticated;
  const visibleUser = hydrated ? user : null;
  const savedHomes = properties.filter((property) => visibleSavedIds.includes(property.id));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1480px] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Wishlist</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-ink sm:text-4xl">
            {visibleIsAuthenticated ? `${visibleUser?.fullName?.split(" ")[0] ?? "Your"} saved stays` : "Saved stays on this device"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            {visibleIsAuthenticated
              ? "Tap the heart on any listing to keep it here while comparing dates, bedrooms, rates, and WhatsApp booking options."
              : "You can like homes before signing in. Log in when you are ready to book or keep them across devices."}
          </p>
        </section>

        {!visibleIsAuthenticated ? (
          <section className="mt-4 flex flex-col gap-3 rounded-[22px] border border-brand-line bg-white p-4 shadow-pearl sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-brand-ink">Sign in before booking so your trip, messages, and saved homes attach to your account.</p>
            <Link href="/login?next=/saved" className="shrink-0">
              <Button>
                <Search size={18} aria-hidden />
                Log in or sign up
              </Button>
            </Link>
          </section>
        ) : null}

        {savedHomes.length > 0 ? (
          <section className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {savedHomes.map((property) => (
              <PropertyCard key={property.id} property={property} compact />
            ))}
          </section>
        ) : (
          <section className="mt-6 grid min-h-[360px] place-items-center rounded-[24px] border border-brand-line bg-white p-8 text-center shadow-pearl">
            <div>
              <Heart className="mx-auto text-brand-strong" size={42} aria-hidden />
              <h2 className="mt-4 text-2xl font-bold text-brand-ink">No saved homes yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-muted">
                Start with the main collection and save the homes you want to compare.
              </p>
              <Link href="/#featured-stays" className="mt-5 inline-flex">
                <Button>
                  <Search size={18} aria-hidden />
                  Browse stays
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      <MobileTabBar />
    </>
  );
}
