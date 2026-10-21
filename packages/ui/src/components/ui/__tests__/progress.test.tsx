import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "../progress";

describe("Progress", () => {
  it("renders a progressbar", () => {
    render(<Progress value={40} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("fills to the value", () => {
    render(<Progress value={40} />);

    expect(document.querySelector('[data-slot="progress-fill"]')).toHaveStyle({
      width: "40%",
    });
  });

  it("honours a custom max", () => {
    render(<Progress value={5} max={10} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("clamps a value beyond the max", () => {
    render(<Progress value={150} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps a negative value", () => {
    render(<Progress value={-10} />);

    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("marks a full bar complete", () => {
    render(<Progress value={100} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "complete",
    );
  });

  it("leaves a partial bar unmarked", () => {
    render(<Progress value={50} />);

    expect(screen.getByRole("progressbar")).not.toHaveAttribute("data-state");
  });
});
