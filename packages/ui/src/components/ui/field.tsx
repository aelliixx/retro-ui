"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

type FieldProps = React.ComponentProps<"div"> & {
  /** Visible label text. Rendered as a `<label>` linked to the control. */
  label?: string;
  /** Helper text shown below the control (hidden while `error` is set). */
  hint?: string;
  /** Error message shown below the control; wires `aria-invalid` + describedby. */
  error?: string;
  /** Marks the field required: renders a marker and wires `aria-required`. */
  required?: boolean;
  /** Explicit control id. Derived from the child `<input>` when omitted. */
  htmlFor?: string;
  /**
   * Composite controls (input + joined button, custom sub-controls) wire
   * themselves through `useFieldIds()` — pass `noWire` to skip the
   * single-child clone injection.
   */
  noWire?: boolean;
};

type FieldIds = {
  /** what a `<label>`'s htmlFor — and the control's id — should read */
  controlId: string;
  hintId?: string;
  errorId?: string;
  hasError: boolean;
  isRequired: boolean;
};

const FieldContext = React.createContext<FieldIds | null>(null);

/** wire a composite control (joined input+button, custom rows) to its Field */
function useFieldIds(): FieldIds {
  const ctx = React.useContext(FieldContext);
  if (!ctx) {
    throw new Error("retro/ui: useFieldIds() must be used inside <Field>");
  }
  return ctx;
}

/**
 * Form field wrapper: label + control + hint/error with the accessibility
 * wiring done for you. Pass a single control (e.g. `<Input />`) as the child —
 * Field clones it and injects `id`, `aria-describedby`, `aria-invalid` and
 * `aria-required` unless you set them yourself. For composite controls pass
 * `noWire` and read `useFieldIds()` inside your group instead.
 */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  noWire = false,
  className,
  children,
  id,
  ...props
}: FieldProps) {
  const autoId = React.useId();
  const fallbackId = `${autoId}-control`;
  const hintId = hint ? `${autoId}-hint` : undefined;
  const errorId = error ? `${autoId}-error` : undefined;

  let controlId = htmlFor ?? fallbackId;
  let control: React.ReactNode = children;

  // Wire a single element child with the generated ids / states.
  const items = React.Children.toArray(children);
  if (
    !noWire &&
    items.length === 1 &&
    React.isValidElement(items[0]) &&
    items[0].type !== React.Fragment
  ) {
    const el = items[0] as React.ReactElement<Record<string, unknown>>;
    const elProps = el.props;
    controlId = htmlFor ?? (elProps.id as string | undefined) ?? fallbackId;

    const describedBy = [
      elProps["aria-describedby"] as string | undefined,
      hintId,
      errorId,
    ]
      .filter(Boolean)
      .join(" ");

    const merged: Record<string, unknown> = {};
    if (!elProps.id) merged.id = controlId;
    if (describedBy) merged["aria-describedby"] = describedBy;
    if (error && elProps["aria-invalid"] === undefined)
      merged["aria-invalid"] = true;
    if (
      required &&
      elProps.required === undefined &&
      elProps["aria-required"] === undefined
    )
      merged["aria-required"] = true;

    control = React.cloneElement(el, merged);
  }

  const ids: FieldIds = React.useMemo(
    () => ({
      controlId,
      hintId,
      errorId,
      hasError: !!error,
      isRequired: !!required,
    }),
    [controlId, hintId, errorId, error, required],
  );

  return (
    <FieldContext.Provider value={ids}>
      <div
        data-slot="field"
        id={id}
        className={cn("flex flex-col gap-1.5", className)}
        {...props}
      >
        {label ? (
          <label
            data-slot="field-label"
            htmlFor={controlId}
            className="text-sm font-semibold text-ink"
          >
            {label}
            {required ? (
              <span aria-hidden="true" className="ml-1 text-accent">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {control}
        {error ? (
          <p
            data-slot="field-error"
            id={errorId}
            role="alert"
            className="text-sm font-medium text-danger"
          >
            {error}
          </p>
        ) : hint ? (
          <p
            data-slot="field-hint"
            id={hintId}
            className="text-sm text-ink-muted"
          >
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

export { Field, useFieldIds };
export type { FieldProps, FieldIds };
