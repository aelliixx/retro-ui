import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AspectRatio } from "@/components/ui/aspect-ratio";

/** happy-dom normalizes `aspect-ratio` to "w / h" — read it back as a number */
function readRatio() {
  const frame = document.querySelector('[data-slot="aspect-ratio"]') as HTMLElement;
  const [width, height = 1] = frame.style.aspectRatio.split("/").map(Number);
  return width / height;
}

describe("AspectRatio", () => {
  it("renders a frame around its children", () => {
    render(
      <AspectRatio>
        <span>inside</span>
      </AspectRatio>,
    );

    const frame = document.querySelector('[data-slot="aspect-ratio"]');
    expect(frame).toBeInTheDocument();
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("keeps 4:3 by default", () => {
    render(<AspectRatio>x</AspectRatio>);

    expect(readRatio()).toBeCloseTo(4 / 3, 5);
  });

  it("holds the given ratio", () => {
    render(<AspectRatio ratio={16 / 9}>x</AspectRatio>);

    expect(readRatio()).toBeCloseTo(16 / 9, 5);
  });

  it("ships the house windowed frame", () => {
    render(<AspectRatio>x</AspectRatio>);

    const frame = document.querySelector('[data-slot="aspect-ratio"]');
    expect(frame).toHaveClass("border-ink");
    expect(frame).toHaveClass("shadow-in");
  });

  it("composes through className", () => {
    render(<AspectRatio className="w-64">x</AspectRatio>);

    const frame = document.querySelector('[data-slot="aspect-ratio"]');
    expect(frame).toHaveClass("w-64");
  });

  it("passes native props through", () => {
    render(<AspectRatio id="thumb" data-testid="frame">x</AspectRatio>);

    expect(screen.getByTestId("frame")).toHaveAttribute("id", "thumb");
  });
});
