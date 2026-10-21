import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "../switch";

describe("Switch", () => {
  it("renders an unchecked switch by default", () => {
    render(<Switch aria-label="Power" />);

    const control = screen.getByRole("switch", { name: "Power" });
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveAttribute("data-state", "unchecked");
  });

  it("starts on with defaultChecked", () => {
    render(<Switch aria-label="Power" defaultChecked />);

    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on click and reports the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Power" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole("switch");
    await user.click(control);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(control).toHaveAttribute("data-state", "checked");
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Power" onCheckedChange={onCheckedChange} />);

    await user.tab();
    expect(screen.getByRole("switch")).toHaveFocus();

    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Power" disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch"));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("honours a controlled checked value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Power"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole("switch"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("lets the consumer veto the toggle with preventDefault", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Power"
        onClick={(event) => event.preventDefault()}
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole("switch"));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles exactly once when clicked inside a wrapping label", async () => {
    // Gecko re-dispatches the click at the button as it bubbles to the
    // label, which used to fire the flip two or three times. happy-dom
    // does not re-dispatch that way, so this locks the contract rather
    // than reproducing the browser quirk.
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Switch onCheckedChange={onCheckedChange} />
        Power the drive
      </label>,
    );

    await user.click(screen.getByRole("switch"));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles exactly once when the label text is clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Switch onCheckedChange={onCheckedChange} />
        Power the drive
      </label>,
    );

    await user.click(screen.getByText("Power the drive"));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});
