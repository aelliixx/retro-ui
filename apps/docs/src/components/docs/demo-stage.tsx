import { cn } from "@retroui/ui";

/**
 * The docs demo bench — every demo on a component doc page renders
 * inside one, so the live component sits in an obviously separate
 * container from the surrounding prose. A sunken surface with the
 * standard bevel: the bench is station chrome, not part of the demo.
 *
 * Note: no `overflow` clipping on purpose — pop panels, tooltips and
 * dialogs are allowed to escape their bench.
 */
export function DemoStage({ className, children }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="demo-stage"
      className={cn(
        "mt-4 border border-ink bg-surface-2 p-4 shadow-in sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
