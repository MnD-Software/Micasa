"use client";

import { Copy, Facebook, Heart, Mail, MessageCircle, MoreHorizontal, Share2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { createWhatsappHref } from "@/lib/whatsapp";
import { useAuthStore } from "@/store/auth-store";
import { useSavedStore } from "@/store/saved-store";
import type { Property } from "@/types/marketplace";

export function PropertyDetailActions({ property }: { property: Property }) {
  const [shareOpen, setShareOpen] = useState(false);
  const hydrated = useHydrated();
  const accountKey = useAuthStore((state) => state.accountKey);
  const savedInStore = useSavedStore((state) => state.isSaved(property.id, accountKey));
  const toggleSaved = useSavedStore((state) => state.toggleSaved);
  const isSaved = hydrated && savedInStore;

  function saveProperty() {
    toggleSaved(property.id, accountKey);
  }

  function copyLink() {
    void navigator.clipboard?.writeText(window.location.href);
  }

  function shareUrl() {
    return typeof window === "undefined" ? "" : window.location.href;
  }

  function shareText() {
    return `Check out ${property.title} on Micasa: ${shareUrl()}`;
  }

  function openShare(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  function shareWhatsApp() {
    openShare(createWhatsappHref(shareText()));
  }

  function shareEmail() {
    openShare(`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareText())}`);
  }

  function shareSms() {
    openShare(`sms:?&body=${encodeURIComponent(shareText())}`);
  }

  function shareFacebook() {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`);
  }

  async function shareMoreOptions() {
    if (navigator.share) {
      await navigator.share({ title: property.title, text: property.description, url: shareUrl() });
      setShareOpen(false);
      return;
    }
    copyLink();
  }

  const shareOptions = [
    ["Copy Link", Copy, copyLink],
    ["Email", Mail, shareEmail],
    ["Messages", MessageCircle, shareSms],
    ["WhatsApp", MessageCircle, shareWhatsApp],
    ["Facebook", Facebook, shareFacebook],
    ["More options", MoreHorizontal, shareMoreOptions]
  ] as const;

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
          onClick={() => setShareOpen(true)}
          type="button"
        >
          <Share2 size={17} aria-hidden />
          Share
        </button>
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
          onClick={saveProperty}
          type="button"
        >
          <Heart size={18} className={isSaved ? "fill-brand-strong text-brand-strong" : ""} aria-hidden />
          Save
        </button>
      </div>

      {shareOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-[680px] overflow-y-auto rounded-[28px] bg-white p-5 shadow-luxe sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-brand-ink">Share this place</h2>
                <div className="mt-5 flex gap-4">
                  <Image src={property.images[0]} alt={property.title} width={84} height={84} className="h-20 w-20 rounded-2xl object-cover" />
                  <p className="text-sm leading-6 text-brand-ink">
                    {property.type} in {property.location} - {property.rating} - {property.bedrooms} bedrooms - {property.bathrooms} baths
                  </p>
                </div>
              </div>
              <button className="focus-ring rounded-full p-2" onClick={() => setShareOpen(false)} type="button" aria-label="Close share modal">
                <X size={22} aria-hidden />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {shareOptions.map(([label, Icon, action]) => (
                <button
                  key={label}
                  className="focus-ring flex min-h-14 items-center gap-4 rounded-2xl border border-brand-line px-4 text-left font-semibold text-brand-ink transition hover:border-brand-ink"
                  onClick={action}
                  type="button"
                >
                  <Icon size={21} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
