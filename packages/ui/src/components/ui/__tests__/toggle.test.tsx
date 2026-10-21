import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from "../toggle";

describe("Toggle", () => {
  it("renders unpressed by default", () => {
    render(<Toggle>Bold</Toggle>);

    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("starts pressed with defaultPressed", () => {
    render(<Toggle defaultPressed>Bold</Toggle>);

    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("data-state", "on");
  });

  it("latches on click and reports the next state", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    const toggle = screen.getByRole("button", { name: "Bold" });
    await user.click(toggle);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    await user.tab();
    await user.keyboard(" ");

    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("honours a controlled pressed value", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("lets the consumer veto the latch with preventDefault", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle
        onClick={(event) => event.preventDefault()}
        onPressedChange={onPressedChange}
      >
        Bold
      </Toggle>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onPressedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
