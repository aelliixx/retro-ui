import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingIcon } from "../loading-icon";

describe("LoadingIcon", () => {
  it("announces itself as a status", () => {
    render(<LoadingIcon />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("carries a screen-reader label by default", () => {
    render(<LoadingIcon />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<LoadingIcon label="Copying files" />);

    expect(screen.getByText("Copying files")).toBeInTheDocument();
  });

  it("drops the label when it is null", () => {
    const { container } = render(<LoadingIcon label={null} />);

    expect(container.querySelector(".sr-only")).not.toBeInTheDocument();
  });

  it("hides the hourglass drawing from the accessibility tree", () => {
    const { container } = render(<LoadingIcon />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
