"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatCurrency, type CurrencyCode } from "@/lib/utils";

export type LanguageCode = "en" | "sw";

type CopyKey =
  | "all"
  | "homes"
  | "experiences"
  | "services"
  | "apartments"
  | "becomeHost"
  | "anywhereAnyWeek"
  | "where"
  | "dates"
  | "who"
  | "searchDestinations"
  | "whereTo"
  | "mobileSearchHint"
  | "guestFavorite"
  | "night"
  | "forTwoNights"
  | "guests"
  | "bedrooms"
  | "baths"
  | "checkIn"
  | "checkOut"
  | "bedroomsNeeded"
  | "checkAvailability"
  | "availableFor"
  | "rate"
  | "estimatedTotal"
  | "payWith"
  | "mpesa"
  | "card"
  | "reserveConfirm"
  | "bookWhatsapp"
  | "notCharged"
  | "cleaningFee"
  | "serviceFee"
  | "totalBeforeTaxes"
  | "explore"
  | "saved"
  | "profile";

const currencyRates: Record<CurrencyCode, number> = {
  KES: 1,
  USD: 0.00773808,
  GBP: 0.005779,
  EUR: 0.006777
};

const copy: Record<LanguageCode, Record<CopyKey, string>> = {
  en: {
    all: "All",
    homes: "Homes",
    experiences: "Experiences",
    services: "Services",
    apartments: "Apartments",
    becomeHost: "Become a host",
    anywhereAnyWeek: "Anywhere, any week",
    where: "Where",
    dates: "Dates",
    who: "Who",
    searchDestinations: "Search destinations",
    whereTo: "Where to?",
    mobileSearchHint: "Anywhere - any week - add guests",
    guestFavorite: "Guest favorite",
    night: "night",
    forTwoNights: "for 2 nights",
    guests: "guests",
    bedrooms: "bedrooms",
    baths: "baths",
    checkIn: "Check in",
    checkOut: "Check out",
    bedroomsNeeded: "Bedrooms needed",
    checkAvailability: "Check availability and rates",
    availableFor: "Available for",
    rate: "Rate",
    estimatedTotal: "Estimated total",
    payWith: "Pay with",
    mpesa: "M-Pesa",
    card: "Card",
    reserveConfirm: "Reserve and confirm",
    bookWhatsapp: "Book through WhatsApp",
    notCharged: "You will not be charged yet",
    cleaningFee: "Cleaning fee",
    serviceFee: "Service fee",
    totalBeforeTaxes: "Total before taxes",
    explore: "Explore",
    saved: "Saved",
    profile: "Profile"
  },
  sw: {
    all: "Zote",
    homes: "Nyumba",
    experiences: "Matukio",
    services: "Huduma",
    apartments: "Fleti",
    becomeHost: "Kuwa mwenyeji",
    anywhereAnyWeek: "Popote, wiki yoyote",
    where: "Wapi",
    dates: "Tarehe",
    who: "Wageni",
    searchDestinations: "Tafuta eneo",
    whereTo: "Unaenda wapi?",
    mobileSearchHint: "Popote - wiki yoyote - ongeza wageni",
    guestFavorite: "Pendwa na wageni",
    night: "usiku",
    forTwoNights: "kwa usiku 2",
    guests: "wageni",
    bedrooms: "vyumba",
    baths: "bafu",
    checkIn: "Kuingia",
    checkOut: "Kutoka",
    bedroomsNeeded: "Vyumba vinavyohitajika",
    checkAvailability: "Angalia upatikanaji na bei",
    availableFor: "Inapatikana kwa",
    rate: "Bei",
    estimatedTotal: "Makadirio ya jumla",
    payWith: "Lipa kwa",
    mpesa: "M-Pesa",
    card: "Kadi",
    reserveConfirm: "Hifadhi na thibitisha",
    bookWhatsapp: "Weka nafasi WhatsApp",
    notCharged: "Hutatozwa bado",
    cleaningFee: "Ada ya usafi",
    serviceFee: "Ada ya huduma",
    totalBeforeTaxes: "Jumla kabla ya kodi",
    explore: "Gundua",
    saved: "Zilizohifadhiwa",
    profile: "Wasifu"
  }
};

type PreferencesContextValue = {
  currency: CurrencyCode;
  language: LanguageCode;
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (language: LanguageCode) => void;
  t: (key: CopyKey) => string;
  convertFromKes: (valueKes: number) => number;
  formatMoney: (valueKes: number) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const currencies: CurrencyCode[] = ["KES", "USD", "GBP", "EUR"];
export const languages: Array<{ code: LanguageCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
];

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("KES");
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const storedCurrency = window.localStorage.getItem("micasa-currency") as CurrencyCode | null;
    const storedLanguage = window.localStorage.getItem("micasa-language") as LanguageCode | null;

    if (storedCurrency && currencies.includes(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
    if (storedLanguage && languages.some((item) => item.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const value = useMemo<PreferencesContextValue>(() => {
    const locale = language === "sw" ? "sw-KE" : "en-KE";
    const convertFromKes = (valueKes: number) => valueKes * currencyRates[currency];

    return {
      currency,
      language,
      setCurrency: (nextCurrency) => {
        setCurrencyState(nextCurrency);
        window.localStorage.setItem("micasa-currency", nextCurrency);
      },
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("micasa-language", nextLanguage);
      },
      t: (key) => copy[language][key] ?? copy.en[key],
      convertFromKes,
      formatMoney: (valueKes) => formatCurrency(convertFromKes(valueKes), currency, locale)
    };
  }, [currency, language]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return context;
}

