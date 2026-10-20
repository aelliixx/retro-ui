import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Status, STATUS_VALUE } from "@/components/ui/status";

describe("Status", () => {
  it("renders the pip with the given value", () => {
    render(<Status value="busy" />);

    const status = document.querySelector('[data-slot="status"]');
    expect(status).toHaveAttribute("data-value", "busy");
  });

  it("hides the pip from the accessibility tree", () => {
    render(<Status value="online" />);

    const pip = document.querySelector('[data-slot="status-pip"]');
    expect(pip).toHaveAttribute("aria-hidden", "true");
  });

  it("paints the pip per value", () => {
    const { rerender } = render(<Status value="online" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "bg-accent",
    );

    rerender(<Status value="away" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "bg-selection",
    );

    rerender(<Status value="busy" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "bg-danger",
    );

    rerender(<Status value="offline" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "bg-ink-muted",
    );
  });

  it("scales the pip with size", () => {
    const { rerender } = render(<Status size="sm" value="online" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "size-1.5",
    );

    rerender(<Status size="lg" value="online" />);
    expect(document.querySelector('[data-slot="status-pip"]')).toHaveClass(
      "size-3.5",
    );
  });

  it("renders a visible label when given one", () => {
    render(<Status value="online" label="Online" />);

    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders no label by default", () => {
    render(<Status value="online" />);

    expect(document.querySelector('[data-slot="status"]')).toHaveTextContent("");
  });

  it("exposes the full set of presence values", () => {
    expect(STATUS_VALUE).toEqual(["online", "away", "busy", "offline"]);
  });
});
