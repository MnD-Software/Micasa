"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { createWhatsappHref } from "@/lib/whatsapp";

export function FloatingWhatsAppButton() {
  const pathname = usePathname();
  const href = createWhatsappHref("Hello Micasa, I would like help choosing and booking a stay in Nyali.");

  if (pathname.startsWith("/property/")) {
    return null;
  }

  return (
    <a
      aria-label="Chat with Micasa on WhatsApp"
      className="focus-ring fixed bottom-40 right-4 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-brand-success px-4 text-sm font-bold text-white shadow-luxe transition hover:-translate-y-0.5 hover:bg-[#008f82] sm:bottom-6 sm:right-6"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle size={20} aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
