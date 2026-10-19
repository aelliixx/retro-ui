"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const checkboxVariants = cn(
  "inline-flex size-4 shrink-0 items-center justify-center border border-ink bg-well shadow-in",
  "enabled:cursor-pointer enabled:hover:bg-surface-2 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
  "focus-etched",
);

type CheckboxProps = Omit<React.ComponentProps<"button">, "checked" | "value"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  /** fires with the next value — works for controlled and uncontrolled use */
  onCheckedChange?: (checked: boolean) => void;
  /** tri-state: renders a dash and reports as mixed until toggled */
  indeterminate?: boolean;
};

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate = false,
  disabled,
  onClick,
  ...props
}: CheckboxProps) {
  const [state, setState] = useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? !!checked : state;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const next = indeterminate ? true : !value;
    if (!isControlled) setState(next);
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="checkbox"
      disabled={disabled}
      aria-checked={(indeterminate && !value) ? "mixed" : value}
      data-state={indeterminate && !value ? "indeterminate" : value ? "checked" : "unchecked"}
      className={cn(checkboxVariants, className)}
      onClick={handleClick}
      {...props}
    >
      {value ? (
        // check glyph
        <svg viewBox="0 0 12 12" className="size-3 text-accent" fill="none" aria-hidden="true">
          <path d="M2 6.5 L4.6 9.2 L10 2.8" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : indeterminate ? (
        // dash glyph
        <span aria-hidden="true" className="h-0.5 w-2 bg-current text-accent" />
      ) : null}
    </button>
  );
}

export { Checkbox, checkboxVariants };
export type { CheckboxProps };
