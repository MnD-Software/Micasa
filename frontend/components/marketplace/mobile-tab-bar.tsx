"use client";

import { Heart, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSavedStore } from "@/store/saved-store";

const tabs = [
  { label: "Explore", href: "/", Icon: Search },
  { label: "Wishlists", href: "/saved", Icon: Heart },
  { label: "Log in", href: "/dashboard/guest", Icon: UserRound }
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const savedCount = useSavedStore((state) => state.savedIds.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-white px-8 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-16px_42px_rgba(34,34,34,0.08)] sm:hidden">
      <div className="mx-auto grid max-w-sm grid-cols-3">
        {tabs.map(({ label, href, Icon }) => {
          const active = pathname === href || (href === "/" && pathname === "/");
          return (
          <a
            key={label}
            className={[
              "relative flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium",
              active ? "text-brand-strong" : "text-brand-muted"
            ].join(" ")}
            href={href}
          >
            <Icon size={30} strokeWidth={active ? 2.5 : 1.8} aria-hidden />
            {label === "Wishlists" && savedCount > 0 ? (
              <span className="absolute right-8 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-strong px-1 text-[9px] text-white">
                {savedCount}
              </span>
            ) : null}
            <span>{label}</span>
          </a>
          );
        })}
      </div>
    </nav>
  );
}
