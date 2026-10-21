import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from "../separator";

describe("Separator", () => {
  it("renders a semantic separator by default", () => {
    render(<Separator />);

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("omits the role when decorative", () => {
    const { container } = render(<Separator decorative />);

    expect(container.querySelector('[role="separator"]')).not.toBeInTheDocument();
  });

  it("marks a vertical rule with aria-orientation", () => {
    render(<Separator orientation="vertical" />);

    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("leaves the horizontal orientation implicit", () => {
    render(<Separator />);

    expect(screen.getByRole("separator")).not.toHaveAttribute(
      "aria-orientation",
    );
  });

  it("composes through className", () => {
    render(<Separator className="my-4" />);

    expect(screen.getByRole("separator")).toHaveClass("my-4");
  });
});
