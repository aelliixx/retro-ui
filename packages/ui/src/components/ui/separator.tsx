import { cn } from "../../lib/utils";

/**
 * The carved divider — a two-tone "groove": a dark line with its light
 * highlight directly underneath, so the cut looks dented into the surface,
 * exactly how the era drew its rule lines.
 *
 * Renders a semantic separator (announced by screen readers) unless
 * `decorative` — then it is a bare div, skipped by the accessibility tree.
 * In a flex row/column give the vertical rule a stretching parent or it
 * collapses to hair height.
 */

type SeparatorProps = React.ComponentProps<"div"> & {
  /** rule direction — default horizontal */
  orientation?: "horizontal" | "vertical";
  /** omit the separator role; purely visual */
  decorative?: boolean;
};

function Separator({
  orientation = "horizontal",
  decorative = false,
  className,
  ...props
}: SeparatorProps) {
  const role = decorative ? undefined : "separator";
  // aria-orientation is the UA default for horizontal separators — omit it there
  const ariaOrientation =
    !decorative && orientation === "vertical" ? ("vertical" as const) : undefined;

  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      role={role}
      aria-orientation={ariaOrientation}
      className={cn(
        // zero-height element, two stacked hairlines: dark above, light below
        orientation === "horizontal"
          ? "h-0 w-auto border border-x-0 border-y border-t-bevel-dark border-b-bevel-light"
          : "w-0 h-auto self-stretch border border-y-0 border-x border-l-bevel-dark border-r-bevel-light",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
