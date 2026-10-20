import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Menu, MenuBar, MenuItem, MenuSeparator } from "@/components/ui/menu-bar";

describe("MenuBar", () => {
  it("renders a labelled nav with menus", () => {
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
        </Menu>
      </MenuBar>,
    );

    expect(screen.getByRole("navigation", { name: "File" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "File" })).toBeInTheDocument();
  });

  it("keeps the dropdown list in the DOM, hidden until hover", () => {
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
        </Menu>
      </MenuBar>,
    );

    const list = document.querySelector('[data-slot="menu-list"]');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass("hidden");
  });

  it("renders items as real buttons", () => {
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
          <MenuItem>Open</MenuItem>
        </Menu>
      </MenuBar>,
    );

    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("fires an item on click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem onClick={onClick}>New</MenuItem>
        </Menu>
      </MenuBar>,
    );

    await user.click(screen.getByRole("button", { name: "New" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows the shortcut as display-only text", () => {
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem shortcut="Ctrl+S">Save</MenuItem>
        </Menu>
      </MenuBar>,
    );

    expect(screen.getByText("Ctrl+S")).toBeInTheDocument();
  });

  it("renders separators with the separator role", () => {
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
          <MenuSeparator />
          <MenuItem>Exit</MenuItem>
        </Menu>
      </MenuBar>,
    );

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("hangs an end-aligned menu on the right", () => {
    render(
      <MenuBar label="File">
        <Menu label="View" align="end">
          <MenuItem>Zoom</MenuItem>
        </Menu>
      </MenuBar>,
    );

    const list = document.querySelector('[data-slot="menu-list"]');
    expect(list).toHaveClass("right-0");
    expect(list).not.toHaveClass("left-0");
  });

  it("reveals the list on hover and on keyboard focus", () => {
    // the reveal is pure CSS — the wrapper is the group, and the list
    // comes back on group-hover or group-focus-within
    const { container } = render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
        </Menu>
      </MenuBar>,
    );

    const menu = container.querySelector('[data-slot="menu"]')!;
    expect(menu).toHaveClass("group");

    const list = container.querySelector('[data-slot="menu-list"]')!;
    expect(list).toHaveClass("hidden");
    expect(list).toHaveClass("group-hover:block");
    expect(list).toHaveClass("group-focus-within:block");
  });

  it("keeps the items reachable by keyboard once the menu is focused", async () => {
    const user = userEvent.setup();
    render(
      <MenuBar label="File">
        <Menu label="File">
          <MenuItem>New</MenuItem>
          <MenuItem>Open</MenuItem>
        </Menu>
      </MenuBar>,
    );

    // focus-within keeps the list open, so Tab walks into the items
    await user.tab();
    expect(screen.getByRole("button", { name: "File" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "New" })).toHaveFocus();
  });
});
