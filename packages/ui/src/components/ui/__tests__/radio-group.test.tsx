import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Radio, RadioGroup } from "../radio-group";

describe("RadioGroup", () => {
  it("renders a group with a legend", () => {
    render(
      <RadioGroup label="Speed">
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("group", { name: "Speed" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("checks the default value", () => {
    render(
      <RadioGroup defaultValue="slow">
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Slow" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Fast" })).not.toBeChecked();
  });

  it("selects a radio and reports its value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Fast" }));

    expect(onValueChange).toHaveBeenCalledWith("fast");
    expect(screen.getByRole("radio", { name: "Fast" })).toBeChecked();
  });

  it("shares one name across the group", () => {
    render(
      <RadioGroup name="speed">
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    const names = screen
      .getAllByRole("radio")
      .map((radio) => radio.getAttribute("name"));
    expect(names).toEqual(["speed", "speed"]);
  });

  it("honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup value="slow" onValueChange={onValueChange}>
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    await user.click(screen.getByRole("radio", { name: "Fast" }));

    expect(onValueChange).toHaveBeenCalledWith("fast");
    // the parent owns the selection — the radios must not move on their own
    expect(screen.getByRole("radio", { name: "Slow" })).toBeChecked();
  });

  it("disables every radio when the group is disabled", () => {
    render(
      <RadioGroup disabled>
        <Radio value="slow">Slow</Radio>
        <Radio value="fast">Fast</Radio>
      </RadioGroup>,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });
});
