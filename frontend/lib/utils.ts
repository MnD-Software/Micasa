import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrencyCode = "KES" | "USD" | "GBP" | "EUR";

export function formatCurrency(value: number, currency: CurrencyCode = "KES", locale = "en-KE") {
  if (currency === "KES") {
    return `KSh ${new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0
    }).format(value)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}
