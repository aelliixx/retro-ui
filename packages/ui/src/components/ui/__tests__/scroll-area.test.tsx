import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "../scroll-area";

describe("ScrollArea", () => {
  it("renders a plain pane without a label", () => {
    const { container } = render(<ScrollArea>content</ScrollArea>);

    expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
    expect(container.querySelector('[role="region"]')).not.toBeInTheDocument();
  });

  it("promotes the pane to a labelled region", () => {
    render(<ScrollArea label="File list">content</ScrollArea>);

    const region = screen.getByRole("region", { name: "File list" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  it("keeps an explicit tabIndex", () => {
    render(
      <ScrollArea label="File list" tabIndex={-1}>
        content
      </ScrollArea>,
    );

    expect(screen.getByRole("region")).toHaveAttribute("tabindex", "-1");
  });

  it("composes through className", () => {
    render(<ScrollArea className="h-32">content</ScrollArea>);

    expect(document.querySelector('[data-slot="scroll-area"]')).toHaveClass(
      "h-32",
    );
  });
});
