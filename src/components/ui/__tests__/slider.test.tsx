import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "@/components/ui/slider";

describe("Slider", () => {
  it("renders a native range input", () => {
    render(<Slider aria-label="Volume" />);

    const slider = screen.getByLabelText("Volume");
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveAttribute("data-slot", "slider");
  });

  it("starts at the min by default", () => {
    render(<Slider aria-label="Volume" />);

    expect(screen.getByLabelText("Volume")).toHaveValue("0");
  });

  it("starts at defaultValue", () => {
    render(<Slider aria-label="Volume" defaultValue={30} />);

    expect(screen.getByLabelText("Volume")).toHaveValue("30");
  });

  it("reports the next value", () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText("Volume"), {
      target: { value: "42" },
    });

    expect(onValueChange).toHaveBeenCalledWith(42);
  });

  it("mirrors the native change event", () => {
    const onChange = vi.fn();
    render(<Slider aria-label="Volume" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("Volume"), {
      target: { value: "7" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("honours a controlled value", () => {
    const onValueChange = vi.fn();
    render(
      <Slider aria-label="Volume" value={20} onValueChange={onValueChange} />,
    );

    fireEvent.change(screen.getByLabelText("Volume"), {
      target: { value: "80" },
    });

    expect(onValueChange).toHaveBeenCalledWith(80);
    // the parent owns the value — the knob must not move on its own
    expect(screen.getByLabelText("Volume")).toHaveValue("20");
  });

  it("paints the hard-stop fill from the value", () => {
    render(<Slider aria-label="Volume" defaultValue={25} />);

    const slider = screen.getByLabelText("Volume");
    expect(slider.style.getPropertyValue("--slider-fill")).toBe("25%");
  });

  it("marks a disabled slider", () => {
    render(<Slider aria-label="Volume" disabled />);

    const slider = screen.getByLabelText("Volume");
    expect(slider).toBeDisabled();
    expect(slider).toHaveAttribute("data-state", "disabled");
  });

  it("handles a degenerate range", () => {
    // min === max has no span to fill — the fill must not divide by zero
    render(<Slider aria-label="Volume" min={5} max={5} defaultValue={5} />);

    const slider = screen.getByLabelText("Volume");
    expect(slider.style.getPropertyValue("--slider-fill")).toBe("0%");
  });
});
