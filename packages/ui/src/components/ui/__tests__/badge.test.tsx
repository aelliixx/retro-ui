import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../badge";

describe("Badge", () => {
  it("renders its children inside the chip", () => {
    render(<Badge>new</Badge>);

    const badge = screen.getByText("new");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("defaults to a solid accent chip", () => {
    render(<Badge>new</Badge>);

    const badge = screen.getByText("new");
    expect(badge).toHaveClass("bg-accent");
    expect(badge).toHaveClass("text-accent-ink");
  });

  it("paints the solid fill per tone", () => {
    const { rerender } = render(<Badge tone="success">ok</Badge>);
    expect(screen.getByText("ok")).toHaveClass("bg-success");

    rerender(<Badge tone="danger">bad</Badge>);
    expect(screen.getByText("bad")).toHaveClass("bg-danger");

    rerender(<Badge tone="neutral">v1</Badge>);
    expect(screen.getByText("v1")).toHaveClass("bg-ink");
  });

  it("keeps the outline variant windowed, with the tone in the text", () => {
    render(
      <Badge variant="outline" tone="danger">
        bad
      </Badge>,
    );

    const badge = screen.getByText("bad");
    expect(badge).toHaveClass("bg-surface");
    expect(badge).toHaveClass("text-danger-strong");
    expect(badge).not.toHaveClass("bg-danger");
  });

  it("drops the bevel on the subtle variant", () => {
    render(
      <Badge variant="subtle" tone="accent">
        quiet
      </Badge>,
    );

    const badge = screen.getByText("quiet");
    expect(badge).toHaveClass("shadow-none");
    expect(badge).toHaveClass("bg-accent-soft");
  });

  it("scales with size", () => {
    const { rerender } = render(<Badge size="sm">s</Badge>);
    expect(screen.getByText("s")).toHaveClass("h-4");

    rerender(<Badge size="md">m</Badge>);
    expect(screen.getByText("m")).toHaveClass("h-5");
  });

  it("composes through className", () => {
    render(<Badge className="rounded-full">new</Badge>);

    const badge = screen.getByText("new");
    expect(badge).toHaveClass("rounded-full");
  });

  it("passes native props through", () => {
    render(<Badge title="unread count">3</Badge>);

    expect(screen.getByText("3")).toHaveAttribute("title", "unread count");
  });
});
