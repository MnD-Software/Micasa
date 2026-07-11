"use client";

import { Handshake, Home, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export function TrustMemberStrip() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="py-3 sm:py-4">
      <div className="flex snap-x gap-2 overflow-x-auto rounded-2xl bg-[#e9fbfd] p-2 sm:gap-3 sm:p-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {[
          [Home, "Right stay match", "Beach, pool, family, or work-ready."],
          [ShieldCheck, "MicasaCare", "Support if plans shift during a stay."],
          [Handshake, "Local help", "Human support before and after check-in."]
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="flex min-w-[230px] snap-start items-center gap-3 rounded-xl bg-white/54 px-3 py-2.5 lg:min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#73dff3] text-brand-ink">
              <Icon size={19} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-brand-ink">{String(title)}</h2>
              <p className="truncate text-xs text-brand-ink/70">{String(text)}</p>
            </div>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-[#171d3d] px-3 py-3 text-white shadow-pearl sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
              <Sparkles size={18} aria-hidden />
            </span>
            <p className="truncate text-sm font-bold">Member prices when signed in</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link className="focus-ring rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 sm:px-4" href="/login">
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
