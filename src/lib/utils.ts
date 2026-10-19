import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge with retro/ui's custom vocabulary registered:
 * - the bevel scale, so `cn("shadow-out", className)` lets consumers
 *   override depth with `shadow-none`, `shadow-in`, `shadow-[…]`, …
 * - the texture utilities (bg-hatch / bg-dither / bg-grid / bg-backdrop),
 *   which twMerge would otherwise mis-file under `bg-color` and drop when
 *   a real background color joins the list — texture and color compose.
 */
const twMerge = extendTailwindMerge<"retro-texture">({
  extend: {
    classGroups: {
      shadow: ["shadow-out", "shadow-in"],
      // new group id also declared in the generic parameter above
      "retro-texture": [
        "bg-hatch",
        "bg-dither",
        "bg-grid",
        "bg-backdrop",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
