"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/components/marketplace/preferences-provider";
import { useSearchStore } from "@/store/search-store";

const schema = z.object({
  location: z.string().min(2, "Choose a destination"),
  checkIn: z.string().min(1, "Required"),
  checkOut: z.string().min(1, "Required"),
  guests: z.coerce.number().min(1).max(16)
});

type SearchValues = z.infer<typeof schema>;

export function SearchBar() {
  const search = useSearchStore();
  const setSearch = useSearchStore((state) => state.setSearch);
  const { t } = usePreferences();
  const { register, handleSubmit } = useForm<SearchValues>({
    resolver: zodResolver(schema),
    defaultValues: search
  });

  function onSubmit(values: SearchValues) {
    setSearch(values);
    document.getElementById("featured-stays")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid rounded-full border border-white bg-brand-frost p-2 shadow-luxe ring-1 ring-brand-line/70 backdrop-blur-xl md:grid-cols-[1.2fr_1.35fr_0.8fr_auto]"
    >
      <label className="group flex min-h-16 items-center rounded-full px-8 transition hover:bg-white hover:shadow-pearl">
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-brand-ink">{t("where")}</span>
          <Input
            {...register("location")}
            className="h-auto border-0 bg-transparent p-0 text-base focus-visible:outline-none"
            placeholder={t("searchDestinations")}
          />
        </span>
      </label>
      <label className="flex min-h-16 items-center border-l border-brand-line px-8 transition hover:bg-white hover:shadow-pearl">
        <span className="flex-1">
          <span className="block text-sm font-bold text-brand-ink">{t("dates")}</span>
          <span className="grid grid-cols-2 gap-2">
            <Input
              {...register("checkIn")}
              aria-label="Check-in date"
              type="date"
              className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:outline-none"
            />
            <Input
              {...register("checkOut")}
              aria-label="Check-out date"
              type="date"
              className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:outline-none"
            />
          </span>
        </span>
      </label>
      <label className="flex min-h-16 items-center border-l border-brand-line px-8 transition hover:bg-white hover:shadow-pearl">
        <span className="flex-1">
          <span className="block text-sm font-bold text-brand-ink">{t("who")}</span>
          <Input
            {...register("guests")}
            type="number"
            min={1}
            className="h-auto border-0 bg-transparent p-0 text-base focus-visible:outline-none"
          />
        </span>
      </label>
      <Button size="lg" className="m-1 h-14 w-14 px-0" aria-label="Search stays">
        <Search size={22} aria-hidden />
      </Button>
    </form>
  );
}
