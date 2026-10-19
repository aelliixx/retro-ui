"use client";

import { createContext, useContext, useId, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The keep — a trigger that expands/collapses one panel, instantly. Use it
 * instead of `<Accordion>` when there is a single panel and the trigger
 * shouldn't look like a folder row: both parts are bare, styled by you,
 * and wired together for free.
 *
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>▸ Advanced</CollapsibleTrigger>
 *   <CollapsibleContent>…anything…</CollapsibleContent>
 * </Collapsible>
 * ```
 *
 * Real `button` semantics throughout: `aria-expanded` + `aria-controls`,
 * click/Space/Enter. The panel stays mounted while closed but `hidden`,
 * so form state inside survives toggling — style on `data-state`
 * (`open`/`closed`) of every part, e.g. to rotate a chevron. Controlled
 * (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`). The
 * trigger's content is yours wholesale — most demos draw the arrow as a
 * plain "▸" text glyph, which CSS can flip via data-state.
 */

type CollapsibleContextValue = {
  open: boolean;
  toggle: () => void;
  idPrefix: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(
      "retro/ui: Collapsible* parts must be used inside <Collapsible>",
    );
  }
  return ctx;
}

type CollapsibleProps = React.ComponentProps<"div"> & {
  /** controlled open-state */
  open?: boolean;
  /** uncontrolled initial open-state */
  defaultOpen?: boolean;
  /** fires with the next open-state — controlled and uncontrolled */
  onOpenChange?: (open: boolean) => void;
};

function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const uid = useId();
  const idPrefix = `${uid.replace(/[^a-zA-Z0-9_-]/g, "") || uid}-collapsible`;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const current = isControlled ? !!open : innerOpen;

  const toggle = () => {
    const next = !current;
    if (!isControlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open: current, toggle, idPrefix }}>
      <div
        data-slot="collapsible"
        data-state={current ? "open" : "closed"}
        className={cn("w-fit", className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { open, toggle, idPrefix } = useCollapsible();

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      id={`${idPrefix}-trigger`}
      aria-expanded={open}
      aria-controls={`${idPrefix}-content`}
      data-state={open ? "open" : "closed"}
      className={cn(
        "focus-etched flex select-none items-center gap-2 border border-ink bg-surface px-3 py-1 text-sm text-ink",
        "enabled:cursor-pointer enabled:hover:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-muted",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggle();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, idPrefix } = useCollapsible();

  return (
    <div
      data-slot="collapsible-content"
      id={`${idPrefix}-content`}
      aria-labelledby={`${idPrefix}-trigger`}
      data-state={open ? "open" : "closed"}
      hidden={!open}
      className={cn("border-0 bg-transparent p-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
export type { CollapsibleProps };
