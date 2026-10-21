import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";

function TabsFixture(props: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs {...props}>
      <TabsList>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="network">Network</TabsTrigger>
        <TabsTrigger value="console">Console</TabsTrigger>
      </TabsList>
      <TabsContent value="files">Files panel</TabsContent>
      <TabsContent value="network">Network panel</TabsContent>
      <TabsContent value="console">Console panel</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes tablist / tab / tabpanel roles", () => {
    render(<TabsFixture defaultValue="files" />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("selects the default tab and shows only its panel", () => {
    render(<TabsFixture defaultValue="files" />);

    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Files panel")).toBeVisible();
    // inactive panels stay mounted (so their form state survives) but hidden
    expect(screen.getByText("Network panel")).not.toBeVisible();
  });

  it("switches panels on click", async () => {
    const user = userEvent.setup();
    render(<TabsFixture defaultValue="files" />);

    await user.click(screen.getByRole("tab", { name: "Network" }));

    expect(screen.getByText("Network panel")).toBeVisible();
    expect(screen.getByRole("tab", { name: "Network" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("reports the selected value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabsFixture defaultValue="files" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("tab", { name: "Console" }));
    expect(onValueChange).toHaveBeenCalledWith("console");
  });

  it("links trigger and panel through aria-controls / aria-labelledby", () => {
    render(<TabsFixture defaultValue="files" />);

    const trigger = screen.getByRole("tab", { name: "Files" });
    const panel = screen.getByRole("tabpanel");

    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
  });

  it("keeps a roving tabindex — only the selected tab is tabbable", () => {
    render(<TabsFixture defaultValue="files" />);

    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("tab", { name: "Network" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("walks the tabs with the arrow keys, selecting as it goes", async () => {
    const user = userEvent.setup();
    render(<TabsFixture defaultValue="files" />);

    const files = screen.getByRole("tab", { name: "Files" });
    files.focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Network" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Network" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Console" })).toHaveFocus();

    // wraps around to the first tab
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveFocus();
  });

  it("walks backwards with the left arrow", async () => {
    const user = userEvent.setup();
    render(<TabsFixture defaultValue="network" />);

    screen.getByRole("tab", { name: "Network" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("tab", { name: "Files" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("jumps to the first and last tab with Home and End", async () => {    const user = userEvent.setup();
    render(<TabsFixture defaultValue="files" />);

    screen.getByRole("tab", { name: "Files" }).focus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Console" })).toHaveFocus();

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveFocus();
  });

  it("honours a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabsFixture value="files" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("tab", { name: "Network" }));

    expect(onValueChange).toHaveBeenCalledWith("network");
    // the parent owns the selection — the tab must not move on its own
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("lets the consumer veto the switch with preventDefault", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="files" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger
            value="files"
            onClick={(event) => event.preventDefault()}
          >
            Files
          </TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="files">Files panel</TabsContent>
        <TabsContent value="network">Network panel</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: "Files" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ignores keys that are not navigation keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TabsFixture defaultValue="files" onValueChange={onValueChange} />);

    screen.getByRole("tab", { name: "Files" }).focus();
    await user.keyboard("a");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("lets the consumer veto keyboard navigation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="files" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger
            value="files"
            onKeyDown={(event) => event.preventDefault()}
          >
            Files
          </TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="files">Files panel</TabsContent>
        <TabsContent value="network">Network panel</TabsContent>
      </Tabs>,
    );

    screen.getByRole("tab", { name: "Files" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("derives safe ids from a value with no usable characters", () => {
    render(
      <Tabs defaultValue="!!!">
        <TabsList>
          <TabsTrigger value="!!!">Odd</TabsTrigger>
        </TabsList>
        <TabsContent value="!!!">Odd panel</TabsContent>
      </Tabs>,
    );

    const trigger = screen.getByRole("tab", { name: "Odd" });
    const panel = screen.getByRole("tabpanel");

    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
  });

  it("refuses to render a trigger outside Tabs", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TabsTrigger value="files">Files</TabsTrigger>)).toThrow(
      /must be used inside <Tabs>/,
    );

    consoleError.mockRestore();
  });

  it("refuses to render content outside Tabs", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TabsContent value="files">Panel</TabsContent>)).toThrow(
      /must be used inside <Tabs>/,
    );

    consoleError.mockRestore();
  });
});
