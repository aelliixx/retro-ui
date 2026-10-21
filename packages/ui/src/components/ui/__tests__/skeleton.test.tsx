import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("renders an empty shell", () => {
    const { container } = render(<Skeleton />);

    const shell = container.querySelector('[data-slot="skeleton"]');
    expect(shell).toBeInTheDocument();
    expect(shell).toHaveAttribute("data-state", "loading");
  });

  it("hides the shell from the accessibility tree", () => {
    const { container } = render(<Skeleton />);

    const shell = container.querySelector('[data-slot="skeleton"]');
    expect(shell).toHaveAttribute("aria-hidden", "true");
    expect(shell).toHaveAttribute("tabindex", "-1");
  });

  it("renders the shell onto a single element child", () => {
    const { container } = render(
      <Skeleton>
        <button>Save</button>
      </Skeleton>,
    );

    // the child's own shape and size are kept — the shell lands on it
    // (and the shell is aria-hidden, so the button leaves the a11y tree)
    const button = screen.getByText("Save");
    expect(button).toHaveAttribute("data-slot", "skeleton");
    expect(button).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(1);
  });

  it("leaves children untouched when loading is false", () => {
    render(
      <Skeleton loading={false}>
        <button>Save</button>
      </Skeleton>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).not.toHaveAttribute("data-slot", "skeleton");
    expect(button).not.toHaveAttribute("aria-hidden");
  });

  it("wraps bare text in a shell", () => {
    const { container } = render(<Skeleton>Loading text</Skeleton>);

    const shell = container.querySelector('[data-slot="skeleton"]');
    expect(shell).toHaveTextContent("Loading text");
    expect(shell).toHaveAttribute("data-inline-skeleton", "true");
  });
});
