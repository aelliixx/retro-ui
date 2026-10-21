import { cn } from "../../lib/utils";

/**
 * The pane with the trough scrollbars — a sunken well that scrolls its
 * overflow. The scrollbars themselves are the native ones, already skinned
 * by the global rules in `globals.css`, so dragging works everywhere and
 * the component stays zero-JS.
 *
 * Pass `label` to expose the pane to assistive tech: it becomes a
 * `role="region"` with `aria-label` and takes `tabIndex={0}` so keyboard
 * users can scroll it directly.
 */
type ScrollAreaProps = React.ComponentProps<"div"> & {
  /** accessible name — promotes the well to a labelled scroll region */
  label?: string;
};

function ScrollArea({ label, className, tabIndex, ...props }: ScrollAreaProps) {
  const named = !!label;

  return (
    <div
      data-slot="scroll-area"
      role={named ? "region" : undefined}
      aria-label={label}
      tabIndex={named ? (tabIndex ?? 0) : tabIndex}
      className={cn(
        "overflow-auto border border-ink bg-well p-3 shadow-in",
        "[scrollbar-width:thin] [scrollbar-color:var(--surface)_var(--well)]",
        "focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-offset-[-3px] focus-visible:outline-focus",
        className,
      )}
      {...props}
    />
  );
}

export { ScrollArea };
export type { ScrollAreaProps };
