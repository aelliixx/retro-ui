import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tooltip } from "../tooltip";

describe("Tooltip", () => {
  it("renders the bubble with the tooltip role", () => {
    render(
      <Tooltip content="Save the document">
        <button>Save</button>
      </Tooltip>,
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent("Save the document");
  });

  it("keeps the bubble hidden until hover or focus", () => {
    render(
      <Tooltip content="Save the document">
        <button>Save</button>
      </Tooltip>,
    );

    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(bubble).toHaveClass("hidden");
  });

  it("wraps the trigger so the group hover works", () => {
    const { container } = render(
      <Tooltip content="Save the document">
        <button>Save</button>
      </Tooltip>,
    );

    expect(container.firstElementChild).toHaveClass("group");
  });

  it("hangs the bubble below for side bottom", () => {
    render(
      <Tooltip content="Save the document" side="bottom">
        <button>Save</button>
      </Tooltip>,
    );

    expect(screen.getByRole("tooltip", { hidden: true })).toHaveClass(
      "top-full",
    );
  });

  it("reveals the bubble on hover and on keyboard focus", () => {
    // the reveal is pure CSS — the wrapper is the group, and the bubble
    // comes back on group-hover or group-focus-within
    const { container } = render(
      <Tooltip content="Save the document">
        <button>Save</button>
      </Tooltip>,
    );

    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass("group");

    const bubble = screen.getByRole("tooltip", { hidden: true });
    expect(bubble).toHaveClass("hidden");
    expect(bubble).toHaveClass("group-hover:block");
    expect(bubble).toHaveClass("group-focus-within:block");
  });

  it("keeps the trigger focusable, so the bubble can show on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Save the document">
        <button>Save</button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });
});
