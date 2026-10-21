import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "../toggle-group";

describe("ToggleGroup", () => {
  it("renders a group of unpressed items by default", () => {
    render(
      <ToggleGroup aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group).toHaveAttribute("data-type", "single");

    const left = screen.getByRole("button", { name: "Left" });
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(left).toHaveAttribute("data-state", "off");
  });

  it("selects one item at a time in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Left" }));
    expect(onValueChange).toHaveBeenCalledWith("left");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Center" }));
    expect(onValueChange).toHaveBeenLastCalledWith("center");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("deselects the active item and reports an empty value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup defaultValue="left" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Left" }));

    expect(onValueChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("keeps several items on in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    await user.click(screen.getByRole("button", { name: "Italic" }));

    expect(onValueChange).toHaveBeenLastCalledWith(["bold", "italic"]);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup value="left" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Center" }));

    expect(onValueChange).toHaveBeenCalledWith("center");
    // the parent owns the selection — the group must not move on its own
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("lets the consumer veto the toggle with preventDefault", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroupItem
          value="left"
          onClick={(event) => event.preventDefault()}
        >
          Left
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Left" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("deselects an item in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]} onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).toHaveBeenCalledWith([]);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("honours a controlled array value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        type="multiple"
        value={["bold"]}
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Italic" }));

    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
    // the parent owns the selection — the group must not move on its own
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("refuses to render an item outside a ToggleGroup", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ToggleGroupItem value="left">Left</ToggleGroupItem>)).toThrow(
      /must be used inside <ToggleGroup>/,
    );

    consoleError.mockRestore();
  });
});
