"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe2, Menu, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { currencies, languages, usePreferences } from "@/components/marketplace/preferences-provider";

const links = [
  { href: "#featured-stays", key: "homes" },
  { href: "#", key: "experiences" },
  { href: "#", key: "services" }
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { currency, language, setCurrency, setLanguage, t } = usePreferences();

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
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-frost shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1820px] items-center justify-between gap-4 px-4 sm:h-[86px] sm:px-6 lg:px-10">
        <Link className="flex min-w-0 items-center" href="/" aria-label="Micasa Staycations Nyali home">
          <span className="relative block h-12 w-[138px] shrink-0 overflow-hidden rounded-[14px] border border-brand-gold/30 bg-white shadow-pearl ring-1 ring-white/80 sm:h-14 sm:w-[178px]">
            <Image
              src="/images/brand/micasa-logo.svg"
              alt="Micasa Staycations"
              fill
              priority
              sizes="(min-width: 640px) 178px, 138px"
              className="object-contain px-2 py-1.5"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-base font-semibold text-brand-muted lg:flex">
          <a className="text-brand-ink" href="#featured-stays">
            {t("all")}
          </a>
          {links.map((link) => (
            <a key={link.key} className="transition hover:text-brand-ink" href={link.href}>
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a className="rounded-full px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-white hover:shadow-pearl" href="#">
            {t("becomeHost")}
          </a>
          {renderPreferenceControls("desktop")}
          <button
            aria-label="Open account menu"
            className="focus-ring grid h-12 w-12 place-items-center rounded-full border border-white bg-brand-ivory text-brand-ink shadow-pearl transition hover:border-brand-line"
            type="button"
          >
            <Menu size={22} aria-hidden />
          </button>
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
        <div className="mb-4 flex items-center gap-3 rounded-full border border-brand-line bg-white px-4 py-3 text-sm text-brand-muted shadow-pearl">
          <Search size={18} aria-hidden />
          {t("anywhereAnyWeek")}
        </div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Globe2 size={18} className="text-brand-muted" aria-hidden />
          {renderPreferenceControls("mobile")}
        </div>
        <div className="grid gap-3 text-sm font-medium text-brand-ink">
          <a href="#featured-stays">{t("all")}</a>
          {links.map((link) => (
            <a key={link.key} href={link.href}>
              {t(link.key)}
            </a>
          ))}
          <a href="#">{t("becomeHost")}</a>
        </div>
      </div>
    </header>
  );
}
