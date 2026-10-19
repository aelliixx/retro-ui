import { cn } from "@/lib/utils";

type LoadingIconProps = {
  /** smallest change-wise sizing handled via className (e.g. size-3, size-6) */
  className?: string;
  /**
   * screen-reader announcement. Pass `null` when visible loading text
   * surrounds the icon.
   */
  label?: string | null;
};

/**
 * The classic busy-hourglass. It *flips* every 1.2s (instant, like an
 * animation frame from the era — no easing), and holds still entirely under
 * `prefers-reduced-motion`.
 *
 * The outline alone is centrosymmetric — flipped, it maps onto itself — so
 * the sand pile (accent fill) makes the flip legible: bottom, tick, top.
 */
function LoadingIcon({ className, label = "Loading…" }: LoadingIconProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className={cn("size-4 animate-hourglass text-ink", className)}
      >
        {/* sand in the lower bulb — lands in the upper bulb when flipped */}
        <path
          d="M4 11 L12 11 L13 14 L3 14 Z"
          className="text-accent"
          fill="currentColor"
        />
        <path
          d="M3 2 L13 2 L13 5 L9 8 L13 11 L13 14 L3 14 L3 11 L7 8 L3 5 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="bevel"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

export { LoadingIcon };
export type { LoadingIconProps };
