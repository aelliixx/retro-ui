import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge with retro/ui's custom shadow scale registered, so
 * `cn("shadow-hard-sm", className)` lets consumers override depth with
 * `shadow-none`, `shadow-hard`, an arbitrary `shadow-[...]`, …
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: ["shadow-hard-xs", "shadow-hard-sm", "shadow-hard", "shadow-sunk"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
