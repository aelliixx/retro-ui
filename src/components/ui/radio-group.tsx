"use client";

import { createContext, useContext, useId } from "react";

import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  /** shared name so native radios group and toggle correctly */
  name: string;
  /** controlled value; omit for uncontrolled use */
  value?: string;
  /** initial value when uncontrolled */
  defaultValue?: string;
  /** fires with the newly picked value */
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

type RadioGroupProps = React.ComponentProps<"fieldset"> & {
  /** carved group-box caption, rendered as the fieldset's legend */
  label?: string;
  /** radio input `name`; auto-generated when omitted */
  name?: string;
  /** controlled checked value (must match a Radio's `value`) */
  value?: string;
  /** initially-selected Radio `value` when uncontrolled */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/**
 * A carved group box of real radio inputs — native semantics, keyboard
 * roving and form participation for free. `Radios` must be rendered inside
 * the group (they share its `name`); label each by wrapping it in a plain
 * `<label>` along with its text.
 *
 * Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 * Disabling the group disables every nested radio natively.
 */
function RadioGroup({
  label,
  name,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const autoName = useId();
  const context: RadioGroupContextValue = {
    name: name ?? autoName,
    value,
    defaultValue,
    onValueChange,
  };

  return (
    <fieldset
      data-slot="radio-group"
      className={cn(
        "border-2 border-border-muted [border-style:groove] px-3 pb-3",
        className,
      )}
      {...props}
    >
      {label && (
        <legend className="px-1 text-sm font-semibold text-ink">{label}</legend>
      )}
      <div className="flex flex-col gap-2">
        <RadioGroupContext.Provider value={context}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    </fieldset>
  );
}

type RadioProps = Omit<React.ComponentProps<"input">, "type" | "name"> & {
  /** the value this radio reports when picked */
  value: string;
  /** label text/data — children render next to the roundel */
  children?: React.ReactNode;
  /** text size class on the wrapping label */
  className?: string;
};

function Radio({
  value,
  children,
  className,
  onChange,
  ...props
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const groupValue = group?.value;
  const isControlled = groupValue !== undefined;

  return (
    <label className={cn("flex cursor-pointer items-center gap-2 text-sm text-ink", className)}>
      <input
        type="radio"
        name={group?.name}
        value={value}
        checked={isControlled ? groupValue === value : undefined}
        defaultChecked={!isControlled && group?.defaultValue === value ? true : undefined}
        onChange={(event) => {
          onChange?.(event);
          group?.onValueChange?.(value);
        }}
        className="peer sr-only"
        {...props}
      />
      {/* the roundel — peer states mirror the (visually hidden) input into it */}
      <span
        aria-hidden="true"
        className={cn(
          "relative size-4 shrink-0 rounded-full border border-ink bg-well shadow-in",
          "peer-enabled:cursor-pointer",
          "peer-disabled:cursor-not-allowed peer-disabled:bg-surface-2 peer-disabled:shadow-none",
          "peer-focus-visible:outline-1 peer-focus-visible:outline-dotted peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-ink",
          "after:absolute after:inset-[3px] after:rounded-full after:bg-transparent after:content-['']",
          "peer-checked:after:bg-accent",
        )}
      />
      {children}
    </label>
  );
}

export { RadioGroup, Radio };
export type { RadioGroupProps, RadioProps };
