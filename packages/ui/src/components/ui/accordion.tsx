import { cn } from "../../lib/utils";

/**
 * Expandable stacks built on native `<details>/<summary>` — disclosure
 * semantics, keyboard toggling and state persistence come from the platform.
 * Each item toggles independently (multiple can be open); pass `open` on an
 * item to start it expanded.
 */

function Accordion({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accordion"
      className={cn("border border-ink bg-surface shadow-out", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AccordionItem({
  className,
  children,
  ...props
}: React.ComponentProps<"details">) {
  return (
    <details
      data-slot="accordion-item"
      className={cn(
        "group border-b border-border-muted last:border-b-0",
        className,
      )}
      {...props}
    >
      {children}
    </details>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"summary">) {
  return (
    <summary
      data-slot="accordion-trigger"
      className={cn(
        "focus-etched flex cursor-pointer select-none list-none items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink",
        "hover:bg-surface-2",
        "[&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      {/* the era's folder-arrow — snaps open 90°, instant */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className="size-3 shrink-0 text-ink-muted group-open:rotate-90"
      >
        <path d="M6 3 L11 8 L6 13" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="truncate">{children}</span>
    </summary>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="accordion-content"
      className={cn(
        "border-t border-border-muted px-3 py-2.5 text-sm text-ink-muted",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
