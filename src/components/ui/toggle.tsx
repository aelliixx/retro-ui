"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The latching key — `<Toggle>` is `<ToggleGroupItem>` on its own: a button
 * with `aria-pressed` whose bevel inverts and tints while it stays down.
 * Same contract as everything here: `pressed` + `onPressedChange` for
 * controlled use, `defaultPressed` for uncontrolled, click/Space/Enter.
 */
type ToggleProps = React.ComponentProps<"button"> & {
  /** controlled on-state */
  pressed?: boolean;
  /** uncontrolled initial on-state */
  defaultPressed?: boolean;
  /** fires with the next on-state — controlled and uncontrolled */
  onPressedChange?: (pressed: boolean) => void;
};

function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  onClick,
  type = "button",
  className,
  children,
  ...props
}: ToggleProps) {
  const [inner, setInner] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const on = isControlled ? !!pressed : inner;

  return (
    <button
      type={type}
      data-slot="toggle"
      data-state={on ? "on" : "off"}
      aria-pressed={on}
      className={cn(
        "focus-etched flex select-none items-center justify-center gap-2 border border-ink px-3 py-1.5 text-sm text-ink",
        "enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-ink-muted",
        on
          ? "shadow-in bg-accent-soft text-accent-strong"
          : "shadow-out bg-surface enabled:hover:bg-surface-2",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !on;
        if (!isControlled) setInner(next);
        onPressedChange?.(next);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export { Toggle };
export type { ToggleProps };
