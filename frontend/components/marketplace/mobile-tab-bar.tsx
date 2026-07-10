"use client";

import { Heart, House, Search, UserRound } from "lucide-react";
import { usePreferences } from "@/components/marketplace/preferences-provider";

const tabs = [
  { key: "explore", Icon: Search, active: true },
  { key: "homes", Icon: House, active: false },
  { key: "saved", Icon: Heart, active: false },
  { key: "profile", Icon: UserRound, active: false }
] as const;

export function MobileTabBar() {
  const { t } = usePreferences();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-brand-frost px-5 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[0_-16px_42px_rgba(34,34,34,0.08)] backdrop-blur-2xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ key, Icon, active }) => (
          <a
            key={key}
            className={[
              "flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold",
              active ? "text-brand-strong" : "text-brand-muted"
            ].join(" ")}
            href="#featured-stays"
          >
            <Icon size={22} aria-hidden />
            <span>{t(key)}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
