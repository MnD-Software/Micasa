"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, BedDouble, Calculator, CreditCard, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useHydrated } from "@/hooks/use-hydrated";
import { createWhatsappHref } from "@/lib/whatsapp";
import { nightsBetween } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { Property } from "@/types/marketplace";

const bookingSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().min(1).max(16),
  bedrooms: z.coerce.number().min(1).max(12),
  paymentMethod: z.enum(["mpesa", "card"]),
  paymentContact: z.string().optional(),
  coupon: z.string().optional()
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingWidget({ property }: { property: Property }) {
  const { formatMoney, t } = usePreferences();
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const paybill = process.env.NEXT_PUBLIC_MPESA_PAYBILL?.trim();
  const mpesaAccountName = process.env.NEXT_PUBLIC_MPESA_ACCOUNT_NAME?.trim() || "MICASA";
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    paymentMethod: "mpesa" | "card";
    total: number;
  } | null>(null);

  const { register, watch, handleSubmit } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: "2026-08-15",
      checkOut: "2026-08-19",
      guests: 2,
      bedrooms: Math.min(2, property.bedrooms),
      paymentMethod: "mpesa",
      paymentContact: "",
      coupon: ""
    }
  });

  const values = watch();
  const totals = useMemo(() => {
    const nights = nightsBetween(values.checkIn, values.checkOut);
    const selectedBedrooms = Math.min(Math.max(Number(values.bedrooms) || 1, 1), property.bedrooms);
    const nightlyRate = Math.ceil((property.pricePerNight / property.bedrooms) * selectedBedrooms);
    const subtotal = nights * nightlyRate;
    const discount = values.coupon?.toUpperCase() === "WELCOME10" ? subtotal * 0.1 : 0;
    const total = subtotal + property.cleaningFee + property.serviceFee - discount;
    return { nights, nightlyRate, selectedBedrooms, subtotal, discount, total };
  }, [property, values]);

  const isAvailable =
    Number(values.guests) <= property.guests &&
    Number(values.bedrooms) <= property.bedrooms &&
    Number(values.guests) > 0 &&
    Number(values.bedrooms) > 0;

  function loginForBooking() {
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/login?next=${encodeURIComponent(next)}`;
  }

  function requireAccount() {
    if (hydrated && isAuthenticated) {
      return true;
    }
    loginForBooking();
    return false;
  }

  function onSubmit(data: BookingValues) {
    if (!requireAccount()) {
      return;
    }
    setAvailabilityChecked(true);
    if (!isAvailable) {
      return;
    }
    const code = `MS-${Date.now().toString().slice(-6)}`;
    const event = new CustomEvent("micasa-booking", { detail: { ...data, propertyId: property.id, total: totals.total, code } });
    window.dispatchEvent(event);
    setConfirmation({ code, paymentMethod: data.paymentMethod, total: totals.total });
  }

  const whatsappMessage =
    `Hello, I want to book ${property.title}.
Dates: ${values.checkIn} to ${values.checkOut}
Guests: ${values.guests}
Bedrooms: ${values.bedrooms}
Rate: ${formatMoney(totals.nightlyRate)} per night
Total estimate: ${formatMoney(totals.total)}`;
  const whatsappHref = createWhatsappHref(whatsappMessage);

  return (
    <>
    <aside className="hidden w-full max-w-full overflow-hidden rounded-[20px] border border-white bg-brand-ivory p-4 shadow-pearl ring-1 ring-brand-line/70 lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:rounded-[22px] lg:p-5 lg:shadow-luxe">
      <div className="flex items-start justify-between gap-3">
        <p className="text-brand-ink">
          <span className="text-xl font-semibold sm:text-2xl">{formatMoney(property.pricePerNight)}</span>
          <span className="text-sm text-brand-muted"> {t("night")}</span>
        </p>
        <p className="text-sm font-semibold text-brand-ink">{property.rating} · {property.reviews} reviews</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 sm:mt-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-line">
          <label className="min-w-0 border-r border-brand-line p-3">
            <span className="block text-[11px] font-bold uppercase text-brand-ink sm:text-xs">{t("checkIn")}</span>
            <Input {...register("checkIn")} type="date" className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="min-w-0 p-3">
            <span className="block text-[11px] font-bold uppercase text-brand-ink sm:text-xs">{t("checkOut")}</span>
            <Input {...register("checkOut")} type="date" className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="min-w-0 border-t border-brand-line p-3">
            <span className="block text-[11px] font-bold uppercase text-brand-ink sm:text-xs">{t("guests")}</span>
            <Input {...register("guests")} type="number" min={1} className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="min-w-0 border-l border-t border-brand-line p-3">
            <span className="block text-[11px] font-bold uppercase text-brand-ink sm:text-xs">{t("bedroomsNeeded")}</span>
            <Input {...register("bedrooms")} type="number" min={1} max={property.bedrooms} className="h-auto rounded-none border-0 p-0" />
          </label>
        </div>

        <button
          className="focus-ring flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-4 text-sm font-bold text-brand-ink shadow-pearl transition hover:border-brand-ink sm:min-h-12"
          onClick={() => setAvailabilityChecked(true)}
          type="button"
        >
          <Calculator size={17} aria-hidden />
          {t("checkAvailability")}
        </button>

        {availabilityChecked ? (
          <div
            className={[
              "rounded-2xl border p-3 text-sm sm:p-4",
              isAvailable
                ? "border-brand-success/30 bg-white text-brand-ink"
                : "border-brand-error/30 bg-white text-brand-error"
            ].join(" ")}
          >
            {isAvailable ? (
              <>
                <p className="flex items-center gap-2 font-bold">
                  <BadgeCheck size={18} className="text-brand-success" aria-hidden />
                  {t("availableFor")} {values.guests} {t("guests")} and {totals.selectedBedrooms} {t("bedrooms")}
                </p>
                <p className="mt-2 text-brand-muted">
                  {t("rate")}: {formatMoney(totals.nightlyRate)} per {t("night")}. {t("estimatedTotal")}: {formatMoney(totals.total)} for {totals.nights} nights.
                </p>
              </>
            ) : (
              <p>
                This property allows up to {property.guests} guests and {property.bedrooms} bedrooms. Adjust your request to continue.
              </p>
            )}
          </div>
        ) : null}

        <fieldset className="grid gap-2">
          <legend className="mb-1 text-xs font-bold uppercase text-brand-ink">{t("payWith")}</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-2xl border border-brand-line bg-white p-3 text-sm font-semibold text-brand-ink">
              <input {...register("paymentMethod")} type="radio" value="mpesa" className="accent-brand-strong" />
              <Smartphone size={17} aria-hidden className="shrink-0" />
              <span className="truncate">{t("mpesa")}</span>
            </label>
            <label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-2xl border border-brand-line bg-white p-3 text-sm font-semibold text-brand-ink">
              <input {...register("paymentMethod")} type="radio" value="card" className="accent-brand-strong" />
              <CreditCard size={17} aria-hidden className="shrink-0" />
              <span className="truncate">{t("card")}</span>
            </label>
          </div>
          <Input {...register("paymentContact")} placeholder="M-Pesa phone or card email" />
          <p className="break-words text-xs leading-5 text-brand-muted">
            M-Pesa PayBill: <span className="font-bold text-brand-ink">{paybill || "add PayBill in .env/admin"}</span>.
            Account: <span className="font-bold text-brand-ink">{mpesaAccountName}</span>. Card collection is ready for launch when payment keys are enabled.
          </p>
        </fieldset>

        <Input {...register("coupon")} placeholder="Coupon code" />
        <Button type="submit" size="lg" className="min-h-12 w-full px-4 sm:min-h-14">
          <BadgeCheck size={18} aria-hidden />
          {t("reserveConfirm")}
        </Button>
        <a
          className={[
            "focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition",
            "bg-brand-success text-white hover:bg-[#008f82]"
          ].join(" ")}
          href={whatsappHref}
          onClick={(event) => {
            if (!isAuthenticated) {
              event.preventDefault();
              loginForBooking();
            }
          }}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={18} aria-hidden />
          {t("bookWhatsapp")}
        </a>
      </form>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-brand-muted">
        <ShieldCheck size={16} aria-hidden />
        {t("notCharged")}
      </p>

      {confirmation ? (
        <div className="mt-5 rounded-2xl border border-brand-success/30 bg-white p-3 text-sm shadow-pearl sm:p-4">
          <p className="flex items-center gap-2 font-bold text-brand-ink">
            <BadgeCheck size={18} className="text-brand-success" aria-hidden />
            Instant confirmation prepared
          </p>
          <p className="mt-2 text-brand-muted">
            Confirmation {confirmation.code} is ready for {property.title}. {formatMoney(confirmation.total)} by {confirmation.paymentMethod === "mpesa" ? "M-Pesa PayBill" : "card"} is queued for admin launch.
          </p>
          <p className="mt-3 flex items-center gap-2 font-semibold text-brand-ink">
            <MessageCircle size={16} aria-hidden />
            Guest confirmation message and host notification are ready.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-2.5 text-sm sm:gap-3">
        <div className="flex justify-between">
          <span>{formatMoney(totals.nightlyRate)} x {totals.nights} nights</span>
          <span>{formatMoney(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="inline-flex items-center gap-1"><BedDouble size={15} aria-hidden /> Bedrooms</span>
          <span>{totals.selectedBedrooms}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("cleaningFee")}</span>
          <span>{formatMoney(property.cleaningFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("serviceFee")}</span>
          <span>{formatMoney(property.serviceFee)}</span>
        </div>
        {totals.discount > 0 ? (
          <div className="flex justify-between text-brand-success">
            <span>Coupon</span>
            <span>-{formatMoney(totals.discount)}</span>
          </div>
        ) : null}
        <div className="border-t border-brand-line pt-3 text-base font-semibold text-brand-ink">
          <div className="flex justify-between">
            <span>{t("totalBeforeTaxes")}</span>
            <span>{formatMoney(totals.total)}</span>
          </div>
        </div>
      </div>
    </aside>
    <div className="fixed inset-x-0 bottom-[84px] z-40 border-t border-brand-line bg-white px-4 py-3 shadow-[0_-14px_34px_rgba(34,34,34,0.12)] lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-ink">
            {formatMoney(totals.total)} <span className="font-normal text-brand-muted">for {totals.nights} nights</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-brand-muted">{values.checkIn} to {values.checkOut}</p>
        </div>
        <button
          className="focus-ring min-h-12 shrink-0 rounded-full bg-brand-strong px-6 text-sm font-bold text-white shadow-lift"
          onClick={() => {
            if (requireAccount()) {
              setAvailabilityChecked(true);
            }
          }}
          type="button"
        >
          Reserve
        </button>
      </div>
    </div>
    </>
  );
}
