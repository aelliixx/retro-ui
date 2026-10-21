"use client";

import { useState } from "react";

import { cn } from "../../lib/utils";

/**
 * The track knob — a native `<input type="range">` wearing the workstation
 * skin: a sunken groove track with a hard-stop accent fill up to the knob
 * (a solid block, no soft gradient) and a square beveled thumb, styled via
 * the `.retro-slider` rules in `globals.css`.
 *
 * All native behavior stays native — pointer drag, arrow keys, PageUp/Down,
 * Home/End, form submission. `onValueChange` mirrors `onChange` with the
 * number; `defaultValue` for uncontrolled use. Pass `aria-label` (or wrap
 * in a `<Field>`) — a bare slider has no accessible name.
 *
 * Horizontal only: native vertical ranges are still a compatibility mess,
 * so `orientation="vertical"` waits for a rebuild.
 */

type SliderProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  min?: number;
  max?: number;
  step?: number;
  /** controlled knob position */
  value?: number;
  defaultValue?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** fires with the next numeric position — controlled and uncontrolled */
  onValueChange?: (value: number) => void;
};

function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = min,
  onChange,
  onValueChange,
  disabled,
  className,
  style,
  ...props
}: SliderProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : innerValue;

  const span = max - min;
  // hard-stop fill position — read by the track's two-color background
  const fill = span > 0 ? ((current - min) / span) * 100 : 0;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    const next = Number(event.target.value);
    if (!isControlled) setInnerValue(next);
    onValueChange?.(next);
  }

  return (
    <input
      type="range"
      data-slot="slider"
      data-state={disabled ? "disabled" : undefined}
      min={min}
      max={max}
      step={step}
      value={current}
      disabled={disabled}
      onChange={handleChange}
      className={cn("retro-slider min-w-40", className)}
      style={{ ...style, "--slider-fill": `${fill}%` } as React.CSSProperties}
      {...props}
    />
  );
}

export { Slider };
export type { SliderProps };
