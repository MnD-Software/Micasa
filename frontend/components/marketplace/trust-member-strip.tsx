"use client";

import { Handshake, Home, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/auth-store";

export function TrustMemberStrip() {
  const hydrated = useHydrated();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showMemberPrompt = hydrated ? !isAuthenticated : true;

  return (
    <section className="py-3 sm:py-4">
      <div className="flex snap-x gap-2 overflow-x-auto rounded-2xl border border-brand-line bg-white/76 p-2 shadow-pearl sm:gap-3 sm:p-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {[
          [Home, "Right stay match", "Beach, pool, family, or work-ready."],
          [ShieldCheck, "MicasaCare", "Support if plans shift during a stay."],
          [Handshake, "Local help", "Human support before and after check-in."]
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="flex min-w-[230px] snap-start items-center gap-3 rounded-xl bg-brand-soft/80 px-3 py-2.5 lg:min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand-strong shadow-sm ring-1 ring-brand-line">
              <Icon size={19} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-brand-ink">{String(title)}</h2>
              <p className="truncate text-xs text-brand-ink/70">{String(text)}</p>
            </div>
          </div>
        ))}
      </div>

      {showMemberPrompt ? (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-brand-ink px-3 py-3 text-white shadow-pearl sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
              <Sparkles size={18} aria-hidden />
            </span>
            <p className="truncate text-sm font-bold">Member prices when signed in</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link className="focus-ring rounded-full bg-brand-gold px-3 py-2 text-xs font-bold text-brand-ink hover:bg-[#efb84a] sm:px-4" href="/login">
              Sign in
            </Link>
            <Link className="focus-ring hidden rounded-full px-3 py-2 text-xs font-bold text-white/86 hover:bg-white/10 sm:inline-flex" href="/become-host">
              Learn
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
