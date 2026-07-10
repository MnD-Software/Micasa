import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-luxe border border-brand-line bg-brand-ivory shadow-pearl", className)}
      {...props}
    />
  );
}
