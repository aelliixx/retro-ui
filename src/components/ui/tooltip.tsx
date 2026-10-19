import { cn } from "@/lib/utils";

const tooltipVariants = cn(
  "pointer-events-none absolute z-10 hidden border border-ink bg-tooltip px-1.5 py-0.5 text-xs text-ink group-hover:block group-focus-within:block",
);

type TooltipProps = React.ComponentProps<"span"> & {
  /** the bubble text */
  content: React.ReactNode;
  /** side the bubble opens toward */
  side?: "top" | "bottom";
};

/**
 * The classic yellow tip — instant show on hover or keyboard focus, no
 * animation. Wrap any focusable trigger; hover alone is not an a11y story,
 * so pair tooltips with controls (buttons, links, focusable spans).
 *
 * Rendered with plain CSS: no portal, no JS, no delay. Position with
 * `side` or fine-tune via className on the bubble.
 */
function Tooltip({
  className,
  children,
  content,
  side = "top",
  ...props
}: TooltipProps) {
  return (
    <span
      className="group relative inline-flex"
      {...props}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          tooltipVariants,
          "whitespace-nowrap",
          side === "top"
            ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2"
            : "top-full left-1/2 mt-1.5 -translate-x-1/2",
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}

export { Tooltip, tooltipVariants };
export type { TooltipProps };
