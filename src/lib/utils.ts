import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge with retro/ui's custom bevel scale registered, so
 * `cn("shadow-out", className)` lets consumers override depth with
 * `shadow-none`, `shadow-in`, an arbitrary `shadow-[...]`, …
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: ["shadow-out", "shadow-in"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
