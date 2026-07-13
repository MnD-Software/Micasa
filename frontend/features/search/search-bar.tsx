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
      className="grid gap-2 rounded-3xl border border-brand-line bg-brand-frost p-2 shadow-pearl"
    >
      <label className="group flex min-h-14 items-center rounded-2xl bg-brand-soft px-4 transition hover:bg-white hover:shadow-pearl">
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold uppercase text-brand-muted">{t("where")}</span>
          <Input
            {...register("location")}
            className="h-auto border-0 bg-transparent p-0 text-base font-semibold text-brand-ink focus-visible:outline-none"
            placeholder={t("searchDestinations")}
          />
        </span>
      </label>
      <label className="flex min-h-14 items-center rounded-2xl bg-brand-soft px-4 transition hover:bg-white hover:shadow-pearl">
        <span className="flex-1">
          <span className="block text-xs font-bold uppercase text-brand-muted">{t("dates")}</span>
          <span className="grid gap-2 sm:grid-cols-2">
            <Input
              {...register("checkIn")}
              aria-label="Check-in date"
              type="date"
              className="h-auto min-w-0 border-0 bg-transparent p-0 text-sm font-semibold focus-visible:outline-none"
            />
            <Input
              {...register("checkOut")}
              aria-label="Check-out date"
              type="date"
              className="h-auto min-w-0 border-0 bg-transparent p-0 text-sm font-semibold focus-visible:outline-none"
            />
          </span>
        </span>
      </label>
      <label className="flex min-h-14 items-center rounded-2xl bg-brand-soft px-4 transition hover:bg-white hover:shadow-pearl">
        <span className="flex-1">
          <span className="block text-xs font-bold uppercase text-brand-muted">{t("who")}</span>
          <Input
            {...register("guests")}
            type="number"
            min={1}
            className="h-auto border-0 bg-transparent p-0 text-base font-semibold focus-visible:outline-none"
          />
        </span>
      </label>
      <Button size="lg" className="h-14 rounded-2xl bg-brand-strong px-4 hover:bg-brand-ink" aria-label="Search stays">
        <Search size={20} aria-hidden />
        <span className="ml-2">Search</span>
      </Button>
    </form>
  );
}
