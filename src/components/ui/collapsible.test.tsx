import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

describe("Collapsible", () => {
  it("starts closed and hides the panel", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Advanced" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(screen.getByText("Panel body")).not.toBeVisible();
  });

  it("opens and closes on click", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Advanced" });
    const content = screen.getByText("Panel body");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).not.toBeVisible();
  });

  it("starts open with defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole("button", { name: "Advanced" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Panel body")).toBeVisible();
  });

  it("wires aria-controls to the panel id", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Advanced" });
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls!)).toBe(
      screen.getByText("Panel body"),
    );
  });

  it("reports the next open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    await user.click(screen.getByRole("button", { name: "Advanced" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole("button", { name: "Advanced" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("honours a controlled open value", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Advanced" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("lets the consumer veto the toggle with preventDefault", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger
          onClick={(event) => event.preventDefault()}
        >
          Advanced
        </CollapsibleTrigger>
        <CollapsibleContent>Panel body</CollapsibleContent>
      </Collapsible>,
    );

    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps the panel mounted while closed so form state survives", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Advanced</CollapsibleTrigger>
        <CollapsibleContent>
          <input aria-label="Note" defaultValue="kept" />
        </CollapsibleContent>
      </Collapsible>,
    );

    const input = screen.getByLabelText("Note");
    await user.click(screen.getByRole("button", { name: "Advanced" }));
    await user.click(screen.getByRole("button", { name: "Advanced" }));

    expect(input).toHaveValue("kept");
  });
});
