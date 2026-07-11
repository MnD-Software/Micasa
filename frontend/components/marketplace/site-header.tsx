"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe2, Heart, Menu, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { currencies, languages, usePreferences } from "@/components/marketplace/preferences-provider";
import { FloatingWhatsAppButton } from "@/components/marketplace/whatsapp-button";
import { useSavedStore } from "@/store/saved-store";

const links = [
  { href: "/#featured-stays", key: "homes" },
  { href: "/experiences", key: "experiences" },
  { href: "/services", key: "services" }
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { currency, language, setCurrency, setLanguage, t } = usePreferences();
  const savedCount = useSavedStore((state) => state.savedIds.length);

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
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-frost shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl">
      <div className="mx-auto grid h-[68px] max-w-[1820px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:h-[78px] sm:px-6 lg:px-10">
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

        <nav className="hidden items-center justify-end gap-5 text-sm font-semibold text-brand-muted lg:flex">
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

        <div className="hidden items-center gap-3 md:flex">
          <Link className="rounded-full px-3 py-2.5 text-sm font-semibold text-brand-ink transition hover:bg-white hover:shadow-pearl" href="/become-host">
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
          {renderPreferenceControls("desktop")}
          <Link
            aria-label="Open guest dashboard"
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition hover:border-brand-line"
            href="/dashboard/guest"
          >
            <UserRound size={20} aria-hidden />
          </Link>
        </div>

        <button
          aria-label="Open navigation"
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white bg-brand-ivory shadow-pearl md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <Menu size={20} aria-hidden />
        </button>
      </div>

      <div
        className={cn(
          "border-t border-brand-line bg-brand-ivory px-4 py-4 shadow-pearl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <Link href="/#featured-stays" className="mb-4 flex items-center gap-3 rounded-full border border-brand-line bg-white px-4 py-3 text-sm text-brand-muted shadow-pearl" onClick={() => setOpen(false)}>
          <Search size={18} aria-hidden />
          {t("anywhereAnyWeek")}
        </Link>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Globe2 size={18} className="text-brand-muted" aria-hidden />
          {renderPreferenceControls("mobile")}
        </div>
        <div className="grid gap-3 text-sm font-medium text-brand-ink">
          <Link href="/" onClick={() => setOpen(false)}>{t("all")}</Link>
          {links.map((link) => (
            <Link key={link.key} href={link.href} onClick={() => setOpen(false)}>
              {t(link.key)}
            </Link>
          ))}
          <Link href="/saved" onClick={() => setOpen(false)}>{t("saved")} {savedCount > 0 ? `(${savedCount})` : ""}</Link>
          <Link href="/become-host" onClick={() => setOpen(false)}>{t("becomeHost")}</Link>
          <Link href="/dashboard/guest" onClick={() => setOpen(false)}>{t("profile")}</Link>
        </div>
      </div>
    </header>
    <FloatingWhatsAppButton />
    </>
  );
}
