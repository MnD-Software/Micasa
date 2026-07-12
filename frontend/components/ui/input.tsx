import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-12 w-full rounded-full border border-brand-line bg-white px-4 text-base text-brand-ink placeholder:text-brand-muted sm:text-sm",
        className
      )}
      {...props}
    />
  );
}
