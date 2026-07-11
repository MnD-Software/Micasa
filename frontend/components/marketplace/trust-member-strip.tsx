"use client";

import { Handshake, Home, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export function TrustMemberStrip() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="grid gap-4 py-5 sm:py-6">
      <div className="grid gap-4 rounded-[22px] bg-[#e5f8fb] p-5 sm:rounded-[28px] sm:p-7 lg:grid-cols-3">
        {[
          [Home, "We know just the place", "Near the beach. By the pool. Find Micasa stays for every occasion."],
          [ShieldCheck, "MicasaCare guarantee", "If your stay goes sideways, our support team will help make it right."],
          [Handshake, "On call day or night", "Real people. Real support before, during, and after your stay."]
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#73dff3] text-brand-ink sm:h-14 sm:w-14">
              <Icon size={25} aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-bold text-brand-ink sm:text-lg">{String(title)}</h2>
              <p className="mt-1 text-sm leading-6 text-brand-ink/78 sm:text-base">{String(text)}</p>
            </div>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <div className="flex flex-col gap-4 rounded-[22px] bg-[#171d3d] p-5 text-white shadow-pearl sm:rounded-[28px] sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
              <Sparkles size={26} aria-hidden />
            </span>
            <p className="text-base font-bold sm:text-lg">Members always get our best prices when signed in</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="focus-ring rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700" href="/login">
              Sign in
            </Link>
            <Link className="focus-ring rounded-full px-4 py-3 text-sm font-bold text-white/86 hover:bg-white/10" href="/become-host">
              Learn more
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
