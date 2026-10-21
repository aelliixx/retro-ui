import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("opens a panel on mouse-over", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    await user.hover(screen.getByRole("button", { name: "Products" }));

    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: "Widget" })).toBeInTheDocument();
  });

  it("keeps a hover-opened panel open when the trigger is clicked", async () => {
    // the click must not dismiss what the hover just opened — otherwise
    // the first click on a fresh menu bar looks like it did nothing
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.hover(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Widget" })).toBeInTheDocument();
  });

  it("closes a click-opened panel on the next click", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
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

  it("closes when a pointer lands outside the bar", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Menu />
        <button>Elsewhere</button>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Elsewhere" }));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Widget" })).not.toBeInTheDocument();
  });

  it("closes when focus leaves the bar", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // focus landing outside the bar closes the panel
    document.body.focus();
    fireEvent.focusIn(document.body);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("hangs the panel beside the bar when vertical", () => {
    render(
      <NavigationMenu label="Main" orientation="vertical" defaultValue="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/widget">
                Widget
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const list = document.querySelector('[data-slot="navigation-menu-list"]')!;
    expect(list).toHaveClass("flex-col");

    const panel = document.querySelector(
      '[data-slot="navigation-menu-content"]',
    )!;
    // vertical panels hang to the right, not under the bar
    expect(panel).toHaveClass("left-full");
    expect(panel).toHaveClass("ml-[-1px]");
  });

  it("positions a panel that starts open", () => {
    // React attaches the bar's ref after the panel's layout effect, so a
    // panel open from the start has to measure itself again once the bar
    // is really there — otherwise it never gets an offset at all
    render(
      <NavigationMenu label="Main" defaultValue="products">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/widget">
                Widget
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const panel = document.querySelector(
      '[data-slot="navigation-menu-content"]',
    ) as HTMLElement;

    // the panel was measured against the bar and given a position
    expect(panel.getAttribute("style")).toContain("left");
  });

  it("opens on ArrowUp as well as ArrowDown", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    screen.getByRole("button", { name: "Products" }).focus();
    await user.keyboard("{ArrowUp}");

    expect(screen.getByRole("link", { name: "Widget" })).toBeInTheDocument();
  });

  it("moves focus into an already open panel on ArrowDown", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    trigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("link", { name: "Widget" })).toHaveFocus();
  });

  it("ignores keys that are not arrows inside the panel", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    screen.getByRole("button", { name: "Products" }).focus();
    await user.keyboard("{ArrowDown}");

    const panel = screen.getByRole("link", { name: "Widget" }).closest(
      "[data-slot='navigation-menu-content']",
    )!;
    fireEvent.keyDown(panel, { key: "a" });

    // the panel is still open — only Escape closes it
    expect(screen.getByRole("link", { name: "Widget" })).toBeInTheDocument();
  });

  it("lets the consumer veto the click", () => {
    const onValueChange = vi.fn();
    render(
      <NavigationMenu label="Main" onValueChange={onValueChange}>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger
              onClick={(event) => event.preventDefault()}
            >
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/widget">
                Widget
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    // fireEvent, not userEvent — a real click would hover the trigger on
    // the way in, and the hover would open the panel before the veto
    fireEvent.click(screen.getByRole("button", { name: "Products" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("lets the consumer veto the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NavigationMenu label="Main" onValueChange={onValueChange}>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger
              onKeyDown={(event) => event.preventDefault()}
            >
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/products/widget">
                Widget
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    screen.getByRole("button", { name: "Products" }).focus();
    await user.keyboard("{ArrowDown}");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ignores pointers that are not a mouse", () => {
    render(<Menu />);

    // a touch pointer must not open the panel — touch relies on the click
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Products" }), {
      pointerType: "touch",
    });

    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("does not re-report an already open trigger on hover", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Menu onValueChange={onValueChange} />);

    const trigger = screen.getByRole("button", { name: "Products" });
    await user.hover(trigger);
    expect(onValueChange).toHaveBeenCalledTimes(1);

    // hovering the open trigger again is a no-op
    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("derives safe ids from a value with no usable characters", () => {
    render(
      <NavigationMenu label="Main" defaultValue="!!!">
        <NavigationMenuList>
          <NavigationMenuItem value="!!!">
            <NavigationMenuTrigger>Odd</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/odd">Odd link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    const trigger = screen.getByRole("button", { name: "Odd" });
    const panel = document.querySelector(
      '[data-slot="navigation-menu-content"]',
    )!;

    // the ids still line up even when the value has nothing usable in it
    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
  });

  it("closes after a grace period once the pointer leaves the bar", () => {
    // leaving the bar does not close the panel at once — the pointer needs
    // a moment to travel to the panel, so the close is deferred
    vi.useFakeTimers();
    try {
      render(<Menu />);

      const trigger = screen.getByRole("button", { name: "Products" });
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      const nav = screen.getByRole("navigation", { name: "Main" });
      fireEvent.pointerLeave(nav, { pointerType: "mouse" });

      // still open during the grace period
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("refuses to render a trigger outside the menu", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<NavigationMenuTrigger>Products</NavigationMenuTrigger>),
    ).toThrow(/must be used inside <NavigationMenu>/);

    consoleError.mockRestore();
  });

  it("refuses to render a trigger outside an item", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // inside the bar, but not inside an item — the item context is missing
    expect(() =>
      render(
        <NavigationMenu label="Main">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        </NavigationMenu>,
      ),
    ).toThrow(/must be used inside <NavigationMenuItem>/);

    consoleError.mockRestore();
  });

  it("refuses to render content outside the menu", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<NavigationMenuContent>Panel</NavigationMenuContent>),
    ).toThrow(/must be used inside <NavigationMenu>/);

    consoleError.mockRestore();
  });
});
