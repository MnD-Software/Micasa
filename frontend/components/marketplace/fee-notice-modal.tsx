"use client";

import { BadgeCheck, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";

export function FeeNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = window.sessionStorage.getItem("micasa-fee-notice-dismissed");
    if (!dismissed) {
      const timer = window.setTimeout(() => setOpen(true), 500);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function close() {
    window.sessionStorage.setItem("micasa-fee-notice-dismissed", "true");
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-brand-ink/34 px-3 pb-3 backdrop-blur-[2px] sm:place-items-center sm:px-4 sm:pb-0">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="fee-notice-title"
        className="relative w-full max-w-[590px] rounded-[32px] border border-white bg-brand-ivory px-6 pb-6 pt-7 text-center shadow-[0_34px_110px_rgba(34,34,34,0.20),0_1px_0_rgba(255,255,255,0.95)_inset] ring-1 ring-brand-line/70 sm:rounded-[38px] sm:px-10 sm:pb-10 sm:pt-10"
      >
        <button
          aria-label="Close fee notice"
          className="focus-ring absolute right-5 top-4 grid h-10 w-10 place-items-center rounded-full text-brand-ink transition hover:bg-brand-soft sm:right-7 sm:top-6"
          onClick={close}
          type="button"
        >
          <X size={24} aria-hidden />
        </button>
        <div className="mx-auto mt-9 grid h-20 w-20 rotate-[-8deg] place-items-center rounded-[22px] bg-gradient-to-br from-brand-strong to-brand text-white shadow-lift sm:mt-14 sm:h-24 sm:w-24 sm:rounded-[24px]">
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/18" aria-hidden>
            <Tag size={31} />
            <BadgeCheck className="absolute -right-2 -top-2 rounded-full bg-white text-brand-strong" size={18} />
          </span>
        </div>
        <h2 id="fee-notice-title" className="mx-auto mt-8 max-w-md text-2xl font-bold leading-tight text-brand-ink sm:mt-12 sm:text-4xl">
          Now you will see one price for your trip, all fees included.
        </h2>
        <button
          className="focus-ring mt-7 h-14 w-full rounded-2xl bg-brand-ink text-base font-bold text-white transition hover:bg-black sm:mt-9 sm:h-[72px] sm:rounded-xl sm:text-xl"
          onClick={close}
          type="button"
        >
          Got it
        </button>
      </section>
    </div>
  );
}
