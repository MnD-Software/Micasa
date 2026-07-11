"use client";

import Link from "next/link";
import Image from "next/image";
import { ConciergeBell, Globe2, Heart, House, Search, SlidersHorizontal, Sparkles, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { currencies, languages, usePreferences } from "@/components/marketplace/preferences-provider";
import { FloatingWhatsAppButton } from "@/components/marketplace/whatsapp-button";
import { useSearchStore } from "@/store/search-store";
import { useAuthStore } from "@/store/auth-store";
import { useSavedStore } from "@/store/saved-store";

const links = [
  { href: "/#featured-stays", key: "homes" },
  { href: "/experiences", key: "experiences" },
  { href: "/services", key: "services" }
] as const;

const mobileTabs = [
  { href: "/#featured-stays", label: "Homes", Icon: House, badge: null },
  { href: "/experiences", label: "Experiences", Icon: Sparkles, badge: "NEW" },
  { href: "/services", label: "Services", Icon: ConciergeBell, badge: "NEW" }
] as const;

const suggestions = [
  ["Nearby", "Find stays around Nyali"],
  ["Nyali, Mombasa", "Beach, malls, pool stays"],
  ["Mombasa, Kenya", "For coastal family trips"]
] as const;

const filterOptions = [
  ["", "Filters"],
  ["Fast Wi-Fi", "Wifi"],
  ["Parking", "Free parking"],
  ["Self check-in", "Self check-in"],
  ["bathrooms", "1+ bathrooms"],
  ["Air conditioning", "Air conditioning"],
  ["Smart TV", "TV"],
  ["Swimming pool", "Pool"],
  ["Beach", "Beach access"]
] as const;

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileLocation, setMobileLocation] = useState("Nyali, Mombasa");
  const pathname = usePathname();
  const { currency, language, setCurrency, setLanguage, t } = usePreferences();
  const accountKey = useAuthStore((state) => state.accountKey);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const savedCount = useSavedStore((state) => state.getSavedIds(accountKey).length);
  const activeFilter = useSearchStore((state) => state.filter);
  const setSearch = useSearchStore((state) => state.setSearch);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function submitMobileSearch(location = mobileLocation) {
    const target = location.trim() || "Nyali, Mombasa";
    setSearch({ location: target });
    setSearchOpen(false);
    if (pathname !== "/") {
      window.location.href = "/#featured-stays";
      return;
    }
    document.getElementById("featured-stays")?.scrollIntoView({ behavior: "smooth" });
  }

  const renderPreferenceControls = (idPrefix: string) => (
    <div className="flex items-center gap-2 rounded-full border border-white bg-brand-ivory p-1 shadow-pearl">
      <label className="sr-only" htmlFor={`${idPrefix}-currency-select`}>
        Currency
      </label>
      <select
        id={`${idPrefix}-currency-select`}
        aria-label="Currency"
        className="h-10 rounded-full bg-transparent px-2 text-sm font-bold text-brand-ink outline-none"
        onChange={(event) => setCurrency(event.target.value as typeof currency)}
        value={currency}
      >
        {currencies.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <span className="h-5 w-px bg-brand-line" aria-hidden />
      <label className="sr-only" htmlFor={`${idPrefix}-language-select`}>
        Language
      </label>
      <select
        id={`${idPrefix}-language-select`}
        aria-label="Language"
        className="h-10 rounded-full bg-transparent px-2 text-sm font-bold text-brand-ink outline-none"
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        value={language}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-frost shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl transition-all duration-300">
      <div className="mx-auto hidden h-[76px] max-w-[1820px] grid-cols-[auto_minmax(340px,1fr)_auto] items-center gap-5 px-6 transition-all duration-300 lg:grid lg:px-10">
        <Link className="flex min-w-0 items-center" href="/" aria-label="Micasa Staycations Nyali home">
          <span className="relative block h-10 w-[126px] shrink-0 overflow-hidden rounded-[12px] border border-brand-gold/30 bg-white shadow-pearl ring-1 ring-white/80 sm:h-12 sm:w-[158px]">
            <Image
              src="/images/brand/micasa-logo.jpeg"
              alt="Micasa Staycations"
              fill
              priority
              sizes="(min-width: 640px) 158px, 126px"
              className="object-contain px-2 py-1.5"
            />
          </span>
        </Link>

        <div className="hidden min-w-0 items-center justify-center gap-6 lg:flex">
          <Link
            className="focus-ring flex h-12 min-w-[360px] max-w-xl items-center justify-between rounded-full border border-brand-line bg-white px-5 text-sm font-semibold text-brand-ink shadow-pearl transition hover:shadow-lift"
            href="/#featured-stays"
          >
            <span>Nyali</span>
            <span className="h-5 w-px bg-brand-line" aria-hidden />
            <span>Any week</span>
            <span className="h-5 w-px bg-brand-line" aria-hidden />
            <span className="text-brand-muted">Add guests</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-strong text-white">
              <Search size={16} aria-hidden />
            </span>
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <nav className="hidden items-center gap-4 text-sm font-semibold text-brand-muted xl:flex">
            <Link className={pathname === "/" ? "text-brand-ink" : "transition hover:text-brand-ink"} href="/">
              {t("all")}
            </Link>
            {links.map((link) => (
            <Link
              key={link.key}
              className={pathname === link.href ? "text-brand-ink" : "transition hover:text-brand-ink"}
              href={link.href}
            >
              {t(link.key)}
            </Link>
            ))}
          </nav>
          <Link className="hidden rounded-full px-3 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-white hover:shadow-pearl 2xl:inline-flex" href="/become-host">
            {t("becomeHost")}
          </Link>
          <Link
            aria-label={`${savedCount} saved homes`}
            className="focus-ring relative grid h-11 w-11 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition hover:border-brand-line"
            href="/saved"
          >
            <Heart size={19} aria-hidden />
            {savedCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-strong px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            ) : null}
          </Link>
          <div className="hidden 2xl:block">
            {renderPreferenceControls("desktop")}
          </div>
          <Link
            aria-label={isAuthenticated ? "Open guest dashboard" : "Log in"}
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition hover:border-brand-line"
            href={isAuthenticated ? "/dashboard/guest" : "/login"}
          >
            {user?.fullName ? (
              <span className="text-sm font-bold">{user.fullName.slice(0, 1).toUpperCase()}</span>
            ) : (
              <UserRound size={20} aria-hidden />
            )}
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "mx-auto hidden max-w-[980px] items-center justify-center gap-7 overflow-hidden px-6 transition-all duration-300 lg:flex",
          isScrolled ? "max-h-0 opacity-0" : "max-h-16 pb-4 opacity-100"
        )}
      >
        {mobileTabs.map(({ href, label, Icon, badge }) => (
          <Link key={href} href={href} className="group flex items-center gap-2 border-b-3 border-transparent pb-2 text-sm font-bold text-brand-muted transition hover:border-brand-ink hover:text-brand-ink">
            <span className="relative">
              <Icon size={28} aria-hidden />
              {badge ? <span className="absolute -right-5 -top-2 rounded-md bg-[#315073] px-1 py-0.5 text-[8px] text-white">NEW</span> : null}
            </span>
            {label}
          </Link>
        ))}
      </div>

      <div className="border-t border-brand-line/70">
        <div className="mx-auto flex max-w-[1120px] gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-10">
          {filterOptions.map(([value, label], index) => {
            const active = activeFilter === value || (index === 0 && !activeFilter);
            return (
              <button
                key={label}
                className={cn(
                  "focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                  active ? "border-brand-ink bg-white text-brand-ink shadow-pearl" : "border-brand-line bg-white/72 text-brand-muted hover:border-brand-ink hover:text-brand-ink"
                )}
                onClick={() => setSearch({ filter: value })}
                type="button"
              >
                {index === 0 ? <SlidersHorizontal size={16} aria-hidden /> : null}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:hidden">
        <div className={cn("px-4 pb-2 transition-all duration-300", isScrolled ? "pt-3" : "pt-5")}>
          <button
            className={cn(
              "focus-ring mx-auto flex w-full max-w-[630px] items-center justify-center gap-3 rounded-full border border-brand-line bg-white font-bold text-brand-ink shadow-[0_12px_34px_rgba(34,34,34,0.12)] transition-all duration-300",
              isScrolled ? "h-12 text-base" : "h-[62px] text-[18px]"
            )}
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <Search size={22} aria-hidden />
            Start your search
          </button>
        </div>
        <nav className={cn("grid grid-cols-3 border-b border-brand-line px-5 transition-all duration-300", isScrolled ? "max-h-0 overflow-hidden pt-0 opacity-0" : "max-h-24 pt-3 opacity-100")}>
          {mobileTabs.map(({ href, label, Icon, badge }) => {
            const isActive = href === "/#featured-stays" ? pathname === "/" : pathname === href;
            return (
            <Link
              key={href}
              className={cn(
                "relative flex flex-col items-center gap-1.5 border-b-3 px-2 pb-2 text-sm font-semibold",
                isActive ? "border-brand-ink text-brand-ink" : "border-transparent text-brand-muted"
              )}
              href={href}
            >
              <span className="relative grid h-9 place-items-center">
                <Icon size={28} aria-hidden />
                {badge ? (
                  <span className="absolute -right-7 -top-1 rounded-md bg-[#315073] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-pearl">
                    {badge}
                  </span>
                ) : null}
              </span>
              <span>{label}</span>
            </Link>
            );
          })}
        </nav>
      </div>
    </header>
    {searchOpen ? (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f7f7f7] px-5 pb-7 pt-5 lg:hidden">
        <div className="mx-auto max-w-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-ink shadow-pearl">
              <SlidersHorizontal size={17} aria-hidden />
              Micasa
            </div>
            <button
              aria-label="Close search"
              className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-white text-brand-ink shadow-pearl"
              onClick={() => setSearchOpen(false)}
              type="button"
            >
              <X size={24} aria-hidden />
            </button>
          </div>

          <nav className="mb-5 grid grid-cols-3">
            {mobileTabs.map(({ href, label, Icon, badge }) => (
              <Link key={href} className="relative flex flex-col items-center gap-1.5 text-sm font-semibold text-brand-muted" href={href}>
                <span className="relative grid h-9 place-items-center">
                  <Icon size={28} aria-hidden />
                  {badge ? <span className="absolute -right-7 -top-1 rounded-md bg-[#315073] px-1.5 py-0.5 text-[9px] font-bold text-white">NEW</span> : null}
                </span>
                <span className={href === "/#featured-stays" ? "border-b-3 border-brand-ink pb-1 text-brand-ink" : "pb-1"}>{label}</span>
              </Link>
            ))}
          </nav>

          <section className="rounded-[30px] border border-brand-line bg-white p-6 shadow-luxe">
            <h2 className="text-3xl font-bold text-brand-ink">Where?</h2>
            <label className="mt-5 flex h-[72px] items-center gap-4 rounded-2xl border border-brand-muted/40 px-5">
              <Search size={25} aria-hidden />
              <input
                className="min-w-0 flex-1 bg-transparent text-lg font-medium text-brand-ink outline-none placeholder:text-brand-muted"
                onChange={(event) => setMobileLocation(event.target.value)}
                placeholder="Search destinations"
                value={mobileLocation}
              />
            </label>

            <p className="mt-6 text-base font-semibold text-brand-ink">Suggested destinations</p>
            <div className="mt-4 grid gap-4">
              {suggestions.map(([title, text]) => (
                <button
                  key={title}
                  className="focus-ring flex items-center gap-4 rounded-2xl text-left"
                  onClick={() => submitMobileSearch(title === "Nearby" ? "Nyali, Mombasa" : title)}
                  type="button"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-soft text-2xl">
                    {title === "Nearby" ? "N" : title.startsWith("Nyali") ? "M" : "KE"}
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-brand-ink">{title}</span>
                    <span className="text-base text-brand-muted">{text}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="mt-5 grid gap-4">
            <button className="flex min-h-20 items-center justify-between rounded-3xl bg-white px-6 text-left text-lg font-bold shadow-pearl" type="button">
              <span className="text-brand-muted">When</span>
              <span className="text-brand-ink">Add dates</span>
            </button>
            <button className="flex min-h-20 items-center justify-between rounded-3xl bg-white px-6 text-left text-lg font-bold shadow-pearl" type="button">
              <span className="text-brand-muted">Who</span>
              <span className="text-brand-ink">Add guests</span>
            </button>
          </div>

          <div className="mt-9 flex items-center justify-between">
            <button className="text-lg font-bold text-brand-ink" onClick={() => setMobileLocation("")} type="button">
              Clear all
            </button>
            <button
              className="focus-ring inline-flex h-16 items-center gap-3 rounded-2xl bg-brand-strong px-8 text-lg font-bold text-white shadow-lift"
              onClick={() => submitMobileSearch()}
              type="button"
            >
              <Search size={24} aria-hidden />
              Search
            </button>
          </div>
        </div>
      </div>
    ) : null}
    <FloatingWhatsAppButton />
    </>
  );
}
