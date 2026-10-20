"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Field, useFieldIds } from "./field";

/**
 * The password field with the reveal key — a joined well: the input runs
 * left, a raised key sits flush at its right end and toggles the mask
 * instantly (`password` ⇄ `text`). Label, hint/error and required markers
 * wire through the normal `Field` machinery.
 *
 * All other input props (`value`, `onChange`, `name`, `placeholder`, …)
 * pass straight through.
 */
type PasswordToggleFieldProps = Omit<
  React.ComponentProps<"input">,
  "type"
> & {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
};

function PasswordToggleField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: PasswordToggleFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      noWire
      className={className}
    >
      <RevealRow visible={visible} onReveal={setVisible} {...props} />
    </Field>
  );
}

function RevealRow({
  visible,
  onReveal,
  ...props
}: Omit<PasswordToggleFieldProps, "label" | "hint" | "error" | "required" | "className"> & {
  visible: boolean;
  onReveal: (next: boolean) => void;
}) {
  const ids = useFieldIds();

  return (
    <div
      data-slot="password-toggle-field"
      className={cn(
        "flex w-full items-stretch border border-ink bg-well shadow-in",
        ids.hasError && "border-danger",
      )}
    >
      <input
        type={visible ? "text" : "password"}
        id={ids.controlId}
        aria-required={ids.isRequired || undefined}
        aria-invalid={ids.hasError || undefined}
        aria-describedby={
          [ids.errorId, ids.hintId].filter(Boolean).join(" ") || undefined
        }
        data-slot="password-input"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink caret-accent placeholder:text-ink-muted focus-etched focus:outline-none disabled:cursor-not-allowed disabled:text-ink-muted"
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        data-state={visible ? "visible" : "masked"}
        disabled={props.disabled}
        onClick={() => onReveal(!visible)}
        className={cn(
          "focus-etched -my-px -mr-px flex w-9 shrink-0 items-center justify-center border border-ink bg-surface text-ink shadow-out",
          "enabled:cursor-pointer enabled:hover:bg-surface-2 enabled:active:shadow-in",
          "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
        )}
      >
        {visible ? <EyeOffGlyph /> : <EyeGlyph />}
      </button>
    </div>
  );
}

function EyeGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M1 8C3.5 4.2 12.5 4.2 15 8 12.5 11.8 3.5 11.8 1 8Z" />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EyeOffGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M1 8C3.5 4.2 12.5 4.2 15 8 12.5 11.8 3.5 11.8 1 8Z" />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none" />
      <path d="M2 14 14 2" />
    </svg>
  );
}

export { PasswordToggleField };
export type { PasswordToggleFieldProps };
