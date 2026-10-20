import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tooltip } from "@/components/ui/tooltip";

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
});
