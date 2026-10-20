import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

function Menu(props: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }) {
  return (
    <NavigationMenu label="Main" {...props}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/products/widget">Widget</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="company">
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/company/about">About</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders a labelled nav with triggers", () => {
    render(<Menu />);

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Company" })).toBeInTheDocument();
  });

  it("keeps every panel closed until a trigger opens one", () => {
    render(<Menu />);

    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "Widget" })).not.toBeInTheDocument();
  });

  it("opens a panel on click", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.click(screen.getByRole("button", { name: "Products" }));

    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: "Widget" })).toBeInTheDocument();
  });

  it("closes the panel when the trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Widget" })).not.toBeInTheDocument();
  });

  it("keeps only one panel open at a time", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.click(screen.getByRole("button", { name: "Products" }));
    await user.click(screen.getByRole("button", { name: "Company" }));

    expect(screen.getByRole("button", { name: "Company" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("reports the open panel value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Menu onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(onValueChange).toHaveBeenCalledWith("products");

    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("opens on ArrowDown and closes on Escape, returning focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    trigger.focus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("link", { name: "Widget" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("link", { name: "Widget" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Menu value="" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Products" }));

    expect(onValueChange).toHaveBeenCalledWith("products");
    // the parent owns the open panel — nothing opens on its own
    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("marks the current page link with aria-current", () => {
    render(
      <NavigationMenu label="Main" defaultValue="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products" active>
                Widget
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    expect(screen.getByRole("link", { name: "Widget" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("links the trigger to its panel", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);

    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls!)).toBe(
      screen.getByRole("link", { name: "Widget" }).closest("[data-slot='navigation-menu-content']"),
    );
  });
});
