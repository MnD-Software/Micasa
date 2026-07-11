"use client";

import { Heart, House, Search, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useSavedStore } from "@/store/saved-store";

const tabs = [
  { key: "explore", href: "/", Icon: Search },
  { key: "homes", href: "/#featured-stays", Icon: House },
  { key: "saved", href: "/saved", Icon: Heart },
  { key: "profile", href: "/dashboard/guest", Icon: UserRound }
] as const;

export function MobileTabBar() {
  const { t } = usePreferences();
  const pathname = usePathname();
  const savedCount = useSavedStore((state) => state.savedIds.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-brand-frost px-5 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-16px_42px_rgba(34,34,34,0.08)] backdrop-blur-2xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ key, href, Icon }) => {
          const active = pathname === href || (href === "/" && pathname === "/");
          return (
          <a
            key={key}
            className={[
              "relative flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold",
              active ? "text-brand-strong" : "text-brand-muted"
            ].join(" ")}
            href={href}
          >
            <Icon size={22} aria-hidden />
            {key === "saved" && savedCount > 0 ? (
              <span className="absolute right-7 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-strong px-1 text-[9px] text-white">
                {savedCount}
              </span>
            ) : null}
            <span>{t(key)}</span>
          </a>
          );
        })}
      </div>
    </nav>
  );
}
