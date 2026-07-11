"use client";

import { CalendarCheck, Heart, MessageSquare, Star, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/auth-store";
import { useSavedStore } from "@/store/saved-store";

const signedOutStats: Array<[label: string, value: string, Icon: LucideIcon]> = [
  ["Upcoming trips", "0", CalendarCheck],
  ["Saved homes", "0", Heart],
  ["Unread messages", "0", MessageSquare],
  ["Reviews due", "0", Star]
];

export default function GuestDashboardPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const accountKey = useAuthStore((state) => state.accountKey);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const savedCount = useSavedStore((state) => state.getSavedIds(accountKey).length);
  const visibleIsAuthenticated = hydrated && isAuthenticated;
  const visibleUser = hydrated ? user : null;
  const visibleSavedCount = hydrated ? savedCount : 0;
  const accountStats: Array<[label: string, value: string, Icon: LucideIcon]> = [
    ["Upcoming trips", "0", CalendarCheck],
    ["Saved homes", String(visibleSavedCount), Heart],
    ["Unread messages", "0", MessageSquare],
    ["Reviews due", "0", Star]
  ];

  function signOut() {
    clearSession();
    router.push("/login");
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-[24px] border border-white bg-brand-ivory p-5 shadow-pearl ring-1 ring-brand-line/70">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand-ink sm:text-4xl">
            {visibleIsAuthenticated ? `Welcome, ${visibleUser?.fullName?.split(" ")[0] ?? "guest"}` : "Log in to manage your trip"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
            {visibleIsAuthenticated
              ? `Signed in as ${visibleUser?.email}. Your wishlists and booking workflow are tied to this account.`
              : "Use a Micasa account to save stays, keep wishlists private, and continue booking across devices."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {visibleIsAuthenticated ? (
              <>
                <Link href="/saved">
                  <Button>View wishlists</Button>
                </Link>
                <Button type="button" variant="secondary" onClick={signOut}>Log out</Button>
              </>
            ) : (
              <Link href="/login?next=/dashboard/guest">
                <Button>Log in or sign up</Button>
              </Link>
            )}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(visibleIsAuthenticated ? accountStats : signedOutStats).map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-4 sm:p-5">
              <Icon className="text-brand-strong" size={21} aria-hidden />
              <p className="mt-4 text-2xl font-semibold text-brand-ink sm:mt-5 sm:text-3xl">{value}</p>
              <p className="text-[13px] text-brand-muted sm:text-sm">{label}</p>
            </Card>
          ))}
        </div>

        <section className="mt-6 rounded-[22px] bg-brand-soft p-4 sm:mt-10 sm:rounded-[24px] sm:p-6">
          <h2 className="text-xl font-semibold text-brand-ink">Trips</h2>
          <p className="mt-2 text-sm leading-6 text-brand-muted">
            {visibleIsAuthenticated
              ? "No confirmed trips yet. When a booking is created through your account, it will appear here."
              : "Log in to see trips connected to your account."}
          </p>
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
