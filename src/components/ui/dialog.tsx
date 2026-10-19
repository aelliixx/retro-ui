"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const dialogVariants = cva(
  // native <dialog> carries UA chrome (canvas bg, solid border, padding) —
  // reset it and rebuild with the standard window recipe; Tailwind's preflight
  // zeroes the UA 'margin: auto', so centering is restored explicitly, and the
  // backdrop dims with the era's black dither
  "m-auto w-[min(28rem,calc(100vw-2rem))] border border-ink bg-surface p-0 text-ink shadow-out [&::backdrop]:bg-backdrop",
  {
    variants: {
      variant: {
        info: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

type DialogProps = React.ComponentProps<"dialog"> &
  VariantProps<typeof dialogVariants> & {
    /** controlled visibility; omit for uncontrolled use */
    open?: boolean;
    /** initial visibility when uncontrolled */
    defaultOpen?: boolean;
    /** fires with the next visibility, from Escape, ✕, or `close()` */
    onOpenChange?: (open: boolean) => void;
    /** titlebar text — doubles as the dialog's a11y label */
    title: string;
    /** dictionary glyph; pass a node to replace the default per-variant icon */
    icon?: React.ReactNode;
    /** hide the icon entirely (plain text dialogs) */
    noIcon?: boolean;
    /** right-aligned action row rendered in the footer rail */
    actions?: React.ReactNode;
  };

type GlyphProps = { className?: string };

function InfoGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        className="text-accent-soft"
        fill="currentColor"
        stroke="var(--ink)"
      />
      <rect x="7.1" y="6.8" width="1.8" height="5" className="text-accent" fill="currentColor" />
      <rect x="7.1" y="3.7" width="1.8" height="2" className="text-accent" fill="currentColor" />
    </svg>
  );
}

function ErrorGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        className="text-danger"
        fill="currentColor"
        stroke="var(--ink)"
      />
      <path
        d="M5.4 5.4 L10.6 10.6 M10.6 5.4 L5.4 10.6"
        stroke="var(--danger-ink)"
        strokeWidth="1.7"
      />
    </svg>
  );
}

/**
 * A modal message window built on the native `<dialog>` element — focus
 * trapping, Escape-to-close and page-blocking behavior come from the platform,
 * not from script. The default glyphs are the era's info ("i" roundel) and
 * critical-error (red X roundel) icons; pass `icon` to override either.
 *
 * Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
 * Escape and the ✕ button both fire `onOpenChange(false)` — keep `open`
 * in sync. Render buttons into `actions`; they land bottom-right on the
 * classic footer rail.
 */
function Dialog({
  open,
  defaultOpen = false,
  onOpenChange,
  variant = "info",
  title,
  icon,
  noIcon = false,
  actions,
  className,
  children,
  ...props
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  // controlled + uncontrolled, Checkbox-style
  const isControlled = open !== undefined;
  const [state, setState] = useState(defaultOpen);
  const openState = isControlled ? !!open : state;

  const autoId = useId();
  const titleId = `${autoId}-title`;
  const contentId = `${autoId}-content`;

  // native close events (Escape) also flow through onOpenChange
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      setState(false);
      onOpenChangeRef.current?.(false);
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (openState && !el.open) el.showModal();
    else if (!openState && el.open) el.close();
  }, [openState]);

  return (
    <dialog
      ref={ref}
      data-slot="dialog"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      className={cn(dialogVariants({ variant }), className)}
      {...props}
    >
      {/* hatched titlebar with a real close key */}
      <div
        data-slot="dialog-header"
        className="flex items-center justify-between gap-3 border-b border-ink bg-surface-2 bg-hatch px-3 py-2"
      >
        <h2
          id={titleId}
          className="truncate text-xs font-bold uppercase tracking-[0.14em] text-ink"
        >
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={() => {
            // the close event routes through onOpenChange — one path
            ref.current?.close();
          }}
          className={cn(
            "focus-etched enabled:cursor-pointer shrink-0 flex size-5 items-center justify-center border border-ink bg-surface shadow-out",
            "enabled:active:shadow-in",
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 8 8"
            fill="none"
            className="size-2 text-ink"
          >
            <path d="M1 1 L7 7 M7 1 L1 7" stroke="currentColor" />
          </svg>
        </button>
      </div>

      {/* icon + message */}
      <div
        data-slot="dialog-body"
        className="flex items-start gap-3.5 px-4 py-4"
      >
        {!noIcon &&
          (icon ?? (variant === "error" ? <ErrorGlyph /> : <InfoGlyph />))}
        <div id={contentId} className="text-sm text-ink">
          {children}
        </div>
      </div>

      {actions && (
        <div
          data-slot="dialog-footer"
          className="flex justify-end gap-2 border-t border-ink bg-surface px-4 py-3"
        >
          {actions}
        </div>
      )}
    </dialog>
  );
}

export { Dialog, dialogVariants };
export type { DialogProps };
