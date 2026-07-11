"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, BedDouble, Calculator, CreditCard, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { getBookingWhatsappNumber } from "@/components/marketplace/whatsapp-button";
import { nightsBetween } from "@/lib/utils";
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
  const paybill = process.env.NEXT_PUBLIC_MPESA_PAYBILL?.trim();
  const mpesaAccountName = process.env.NEXT_PUBLIC_MPESA_ACCOUNT_NAME?.trim() || "MICASA";
  const whatsappNumber = getBookingWhatsappNumber();
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

  function onSubmit(data: BookingValues) {
    setAvailabilityChecked(true);
    if (!isAvailable) {
      return;
    }
    const code = `MS-${Date.now().toString().slice(-6)}`;
    const event = new CustomEvent("micasa-booking", { detail: { ...data, propertyId: property.id, total: totals.total, code } });
    window.dispatchEvent(event);
    setConfirmation({ code, paymentMethod: data.paymentMethod, total: totals.total });
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I want to book ${property.title}.
Dates: ${values.checkIn} to ${values.checkOut}
Guests: ${values.guests}
Bedrooms: ${values.bedrooms}
Rate: ${formatMoney(totals.nightlyRate)} per night
Total estimate: ${formatMoney(totals.total)}`
  );
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : undefined;

  return (
    <aside className="sticky top-28 rounded-[22px] border border-white bg-brand-ivory p-5 shadow-luxe ring-1 ring-brand-line/70">
      <div className="flex items-end justify-between">
        <p className="text-brand-ink">
          <span className="text-2xl font-semibold">{formatMoney(property.pricePerNight)}</span>
          <span className="text-sm text-brand-muted"> {t("night")}</span>
        </p>
        <p className="text-sm font-semibold text-brand-ink">{property.rating} · {property.reviews} reviews</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-3">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-brand-line">
          <label className="border-r border-brand-line p-3">
            <span className="block text-xs font-bold uppercase text-brand-ink">{t("checkIn")}</span>
            <Input {...register("checkIn")} type="date" className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="p-3">
            <span className="block text-xs font-bold uppercase text-brand-ink">{t("checkOut")}</span>
            <Input {...register("checkOut")} type="date" className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="col-span-2 border-t border-brand-line p-3">
            <span className="block text-xs font-bold uppercase text-brand-ink">{t("guests")}</span>
            <Input {...register("guests")} type="number" min={1} className="h-auto rounded-none border-0 p-0" />
          </label>
          <label className="col-span-2 border-t border-brand-line p-3">
            <span className="block text-xs font-bold uppercase text-brand-ink">{t("bedroomsNeeded")}</span>
            <Input {...register("bedrooms")} type="number" min={1} max={property.bedrooms} className="h-auto rounded-none border-0 p-0" />
          </label>
        </div>

        <button
          className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-line bg-white px-4 text-sm font-bold text-brand-ink shadow-pearl transition hover:border-brand-ink"
          onClick={() => setAvailabilityChecked(true)}
          type="button"
        >
          <Calculator size={17} aria-hidden />
          {t("checkAvailability")}
        </button>

        {availabilityChecked ? (
          <div
            className={[
              "rounded-2xl border p-4 text-sm",
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
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-brand-line bg-white p-3 text-sm font-semibold text-brand-ink">
              <input {...register("paymentMethod")} type="radio" value="mpesa" className="accent-brand-strong" />
              <Smartphone size={17} aria-hidden />
              {t("mpesa")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-brand-line bg-white p-3 text-sm font-semibold text-brand-ink">
              <input {...register("paymentMethod")} type="radio" value="card" className="accent-brand-strong" />
              <CreditCard size={17} aria-hidden />
              {t("card")}
            </label>
          </div>
          <Input {...register("paymentContact")} placeholder="M-Pesa phone or card email" />
          <p className="text-xs leading-5 text-brand-muted">
            M-Pesa PayBill: <span className="font-bold text-brand-ink">{paybill || "add PayBill in .env/admin"}</span>.
            Account: <span className="font-bold text-brand-ink">{mpesaAccountName}</span>. Card collection is ready for launch when payment keys are enabled.
          </p>
        </fieldset>

        <Input {...register("coupon")} placeholder="Coupon code" />
        <Button type="submit" size="lg" className="w-full">
          <BadgeCheck size={18} aria-hidden />
          {t("reserveConfirm")}
        </Button>
        <a
          className={[
            "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition",
            whatsappHref
              ? "bg-brand-success text-white hover:bg-[#008f82]"
              : "pointer-events-none bg-brand-line text-brand-muted"
          ].join(" ")}
          href={whatsappHref ?? "#"}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={18} aria-hidden />
          {t("bookWhatsapp")}
        </a>
        {!whatsappHref ? (
          <p className="text-center text-xs text-brand-muted">
            Add `NEXT_PUBLIC_BOOKING_WHATSAPP` in `.env` to activate WhatsApp booking.
          </p>
        ) : null}
      </form>

      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-muted">
        <ShieldCheck size={16} aria-hidden />
        {t("notCharged")}
      </p>

      {confirmation ? (
        <div className="mt-5 rounded-2xl border border-brand-success/30 bg-white p-4 text-sm shadow-pearl">
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

      <div className="mt-5 grid gap-3 text-sm">
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
  );
}
