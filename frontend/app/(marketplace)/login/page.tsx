"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Heart, Loader2, Lock, UserRound } from "lucide-react";
import { MobileTabBar } from "@/components/marketplace/mobile-tab-bar";
import { SiteHeader } from "@/components/marketplace/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore, type AccountUser } from "@/store/auth-store";

const API_URL = "/api/backend";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const setSession = useAuthStore((state) => state.setSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const visibleIsAuthenticated = hydrated && isAuthenticated;
  const visibleUser = hydrated ? user : null;
  const [mode, setMode] = useState<Mode>("login");
  const [nextPath, setNextPath] = useState("/saved");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next?.startsWith("/")) {
      setNextPath(next);
    }
  }, []);

  async function loginAccount(accountEmail = email, accountName = fullName || email.split("@")[0]) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: accountEmail, password })
    });

    if (!response.ok) {
      throw new Error("We could not sign you in with those details.");
    }

    const data = (await response.json()) as { access_token: string };
    const accountUser: AccountUser = {
      email: accountEmail,
      fullName: accountName,
      role: "guest"
    };
    setSession(data.access_token, accountUser);
    router.push(nextPath);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name: fullName, email, password, role: "guest" })
        });

        if (!response.ok && response.status !== 409) {
          throw new Error("We could not create that account.");
        }
      }

      await loginAccount();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Account request failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-10">
        <section className="rounded-[26px] bg-brand-ink p-5 text-white shadow-luxe sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/58">Micasa account</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">
            Save stays, compare trips, and continue booking like Airbnb.
          </h1>
          <div className="mt-7 grid gap-3">
            {[
              [Heart, "Private wishlists", "Every saved home belongs to your account."],
              [BadgeCheck, "Booking continuity", "Come back to the same homes and trip choices."],
              [Lock, "Guest profile", "Use one account for stays, services, and messages."]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="flex gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
                <Icon className="shrink-0 text-brand-gold" size={21} aria-hidden />
                <div>
                  <h2 className="text-sm font-bold">{String(title)}</h2>
                  <p className="mt-1 text-xs leading-5 text-white/68">{String(text)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[26px] border border-brand-line bg-white p-5 shadow-pearl sm:p-7">
          {visibleIsAuthenticated ? (
            <div className="grid min-h-[360px] place-items-center text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-2xl font-bold text-brand-strong">
                  {visibleUser?.fullName?.slice(0, 1).toUpperCase() ?? "M"}
                </div>
                <h2 className="mt-5 text-2xl font-bold text-brand-ink">You are signed in</h2>
                <p className="mt-2 text-sm text-brand-muted">Continue to your saved homes or profile dashboard.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button type="button" onClick={() => router.push("/saved")}>Wishlists</Button>
                  <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/guest")}>Profile</Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 rounded-full bg-brand-soft p-1">
                {(["login", "signup"] as const).map((item) => (
                  <button
                    key={item}
                    className={[
                      "h-11 rounded-full text-sm font-bold transition",
                      mode === item ? "bg-white text-brand-ink shadow-pearl" : "text-brand-muted"
                    ].join(" ")}
                    onClick={() => setMode(item)}
                    type="button"
                  >
                    {item === "login" ? "Log in" : "Sign up"}
                  </button>
                ))}
              </div>

              <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
                {mode === "signup" ? (
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-brand-ink">Full name</span>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" required />
                  </label>
                ) : null}
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-brand-ink">Email</span>
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-brand-ink">Password</span>
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} />
                </label>

                {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <UserRound size={18} aria-hidden />}
                  {mode === "login" ? "Log in" : "Create account"}
                </Button>
              </form>
            </>
          )}
        </section>
      </main>
      <MobileTabBar />
    </>
  );
}
