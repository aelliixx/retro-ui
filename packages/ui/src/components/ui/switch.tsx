"use client";

import { useState } from "react";

import { cn } from "../../lib/utils";

/**
 * The power toggle — a sunken track with a square beveled knob that jumps
 * between the two ends of the rail the instant you click (no slide
 * animation; state is binary, motion is a lie). Built on
 * `<button role="switch">` with `aria-checked`, toggling with click, Space
 * and Enter for free.
 *
 * Management mirrors Checkbox: controlled (`checked` + `onCheckedChange`)
 * or uncontrolled (`defaultChecked`). The consumer's veto — a
 * `defaultPrevented` click — suppresses the flip. Inside a wrapping
 * `<label>` the browser sees the real button and everything just works.
 */

type SwitchProps = Omit<React.ComponentProps<"button">, "checked"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  /** fires with the next value — works for controlled and uncontrolled use */
  onCheckedChange?: (checked: boolean) => void;
  /** hides the on-state rail tint for surface-only switches */
  tinted?: boolean;
};

function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  tinted = true,
  disabled,
  onClick,
  className,
  ...props
}: SwitchProps) {
  const [state, setState] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? !!checked : state;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    // Same Gecko guard as Checkbox: cancel the click's default action (the
    // label's re-dispatched forward) so a single user click stays a single
    // flip. Label-text clicks still work — the forward arrives before this.
    event.preventDefault();
    const next = !value;
    if (!isControlled) setState(next);
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      data-slot="switch"
      disabled={disabled}
      aria-checked={value}
      data-state={value ? "checked" : "unchecked"}
      onClick={handleClick}
      className={cn(
        "focus-etched relative inline-flex h-5 w-10 shrink-0 items-stretch border border-ink p-0.5 shadow-in",
        "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
        tinted
          ? "bg-well aria-checked:bg-accent disabled:aria-checked:bg-well"
          : "bg-well",
        className,
      )}
      {...props}
    >
      {/* the knob — raised bevel block snapped to one end of the rail */}
      <span
        aria-hidden="true"
        className={cn(
          "w-3.5 border border-ink bg-surface shadow-out",
          value ? "ml-auto" : "mr-auto",
        )}
      />
    </button>
  );
}

export { Switch };
export type { SwitchProps };
