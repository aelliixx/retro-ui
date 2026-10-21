import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "../checkbox";

describe("Checkbox", () => {
  it("renders an unchecked checkbox by default", () => {
    render(<Checkbox aria-label="Archive" />);

    const box = screen.getByRole("checkbox", { name: "Archive" });
    expect(box).toHaveAttribute("aria-checked", "false");
    expect(box).toHaveAttribute("data-state", "unchecked");
  });

  it("starts checked with defaultChecked", () => {
    render(<Checkbox aria-label="Archive" defaultChecked />);

    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles on click and reports the next value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Archive" onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    await user.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Archive" disabled onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox");
    await user.click(box);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("reports mixed while indeterminate and clears it on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Archive"
        indeterminate
        onCheckedChange={onCheckedChange}
      />,
    );

    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "mixed");
    expect(box).toHaveAttribute("data-state", "indeterminate");

    await user.click(box);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("honours a controlled checked value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Archive"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const box = screen.getByRole("checkbox");
    await user.click(box);

    // the parent owns the value — the component must not flip itself
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("lets the consumer veto the toggle with preventDefault", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Archive"
        onClick={(event) => event.preventDefault()}
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles exactly once when clicked inside a wrapping label", async () => {
    // Gecko re-dispatches the click at the button as it bubbles to the
    // label, which used to fire the toggle two or three times. The
    // component cancels the default action to keep it to one.
    //
    // happy-dom does not re-dispatch the way Gecko does, so this locks
    // the contract ("one click, one toggle") rather than reproducing the
    // browser quirk — the quirk itself needs a real browser to show.
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Checkbox onCheckedChange={onCheckedChange} />
        Include hidden files
      </label>,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("toggles exactly once when the label text is clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Checkbox onCheckedChange={onCheckedChange} />
        Include hidden files
      </label>,
    );

    await user.click(screen.getByText("Include hidden files"));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });
});
