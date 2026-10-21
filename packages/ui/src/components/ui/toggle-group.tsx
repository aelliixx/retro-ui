"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { cn } from "../../lib/utils";

/**
 * The segmented switch bank — a horizontal row of joined keys in one
 * bevel, where each key toggles or mutually-excludes (`type="single"` is
 * the classic radio-strip look). Real buttons throughout: click, Space and
 * Enter all toggle; the selected key sits sunken with an accent tint —
 * the press stayed down, no animation.
 *
 * Stack it with `className="flex-col"` for a vertical bank; the bevel
 * `items-stretch` makes every key the same width.
 *
 * `type="single"`: value is one item's value or empty string. `type=
 * "multiple"`: value is an array. Controlled and uncontrolled like
 * everything here.
 *
 * Tab walks each key natively (no roving tabindex) — keep group counts
 * humane and name the group with an `aria-label`.
 */

type ToggleGroupType = "single" | "multiple";

type ToggleGroupContextValue = {
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroup() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error("retro/ui: ToggleGroupItem must be used inside <ToggleGroup>");
  }
  return ctx;
}

/**
 * Discriminated by `type` so the value callbacks see `string` for single
 * and `string[]` for multiple — matching what the runtime emits.
 */
type ToggleGroupProps = React.ComponentProps<"div"> &
  (
    | {
        type?: "single";
        /** controlled selection — one value or `""` */
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        type: "multiple";
        /** controlled selection — array of selected values */
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

function ToggleGroup({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: ToggleGroupProps) {
  const [innerValue, setInnerValue] = useState<readonly string[]>(() => {
    if (defaultValue === undefined) return [];
    return typeof defaultValue === "string" ? [defaultValue] : defaultValue;
  });
  const isControlled = value !== undefined;
  const current: readonly string[] = useMemo(
    () =>
      isControlled
        ? typeof value === "string"
          ? [value]
          : value
        : innerValue,
    [isControlled, value, innerValue],
  );

  const isSelected = useCallback(
    (itemValue: string) => current.includes(itemValue),
    [current],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      const selected = current.includes(itemValue);
      const next: readonly string[] =
        type === "single"
          ? selected
            ? []
            : [itemValue]
          : selected
            ? current.filter((v) => v !== itemValue)
            : [...current, itemValue];
      if (!isControlled) setInnerValue(next);
      const emit = onValueChange as ((v: string | string[]) => void) | undefined;
      emit?.(
        type === "single" ? (next[0] ?? "") : [...next],
      );
    },
    [current, isControlled, onValueChange, type],
  );

  return (
    <ToggleGroupContext.Provider value={{ isSelected, toggle }}>
      <div
        data-slot="toggle-group"
        role="group"
        data-type={type}
        className={cn(
          "flex flex-row items-stretch w-fit gap-0.5 border border-ink bg-surface p-0.5 shadow-out",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = React.ComponentProps<"button"> & {
  /** the value this key contributes to the group state */
  value: string;
};

function ToggleGroupItem({
  value,
  className,
  children,
  onClick,
  ...props
}: ToggleGroupItemProps) {
  const { isSelected, toggle } = useToggleGroup();
  const pressed = isSelected(value);

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-value={value}
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      className={cn(
        "focus-etched flex select-none items-center justify-center whitespace-nowrap border border-ink px-2.5 py-1 text-sm text-ink",
        "enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-ink-muted",
        pressed
          // stayed down: the bevel inverts like a pressed key — and the
          // accent tint keeps "on" readable against the sunken surface
          ? "shadow-in bg-accent-soft text-accent-strong"
          : "shadow-out bg-surface enabled:hover:bg-surface-2",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggle(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps, ToggleGroupItemProps, ToggleGroupType };
