"use client";

import type { ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthBookingLink({
  children,
  className,
  href
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        if (!isAuthenticated) {
          event.preventDefault();
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        }
      }}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
