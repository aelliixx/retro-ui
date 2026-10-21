import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("derives initials from the name", () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("keeps only the first two words", () => {
    render(<Avatar name="Grace Brewster Murray Hopper" />);

    expect(screen.getByText("GB")).toBeInTheDocument();
  });

  it("labels the tile with the full name", () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("renders a custom fallback", () => {
    render(<Avatar name="Ada Lovelace" fallback="★" />);

    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("renders the image when a source is given", () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);

    const image = document.querySelector("img");
    expect(image).toHaveAttribute("src", "/ada.png");
    // the tile carries the accessible name — the image itself is presentational
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar name="Ada Lovelace" src="/missing.png" />);

    const image = document.querySelector("img")!;
    fireEvent.error(image);

    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("draws the presence pip from the Status component", () => {
    render(<Avatar name="Ada Lovelace" status="online" />);

    const pip = document.querySelector('[data-slot="status-pip"]');
    expect(pip).toBeInTheDocument();
    expect(document.querySelector('[data-slot="status"]')).toHaveAttribute(
      "data-value",
      "online",
    );
  });

  it("omits the pip without a status", () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(document.querySelector('[data-slot="status-pip"]')).not.toBeInTheDocument();
  });

  it("scales with size", () => {
    render(<Avatar name="Ada Lovelace" size="lg" />);

    expect(screen.getByRole("img")).toHaveClass("size-10");
  });

  it("falls back to a question mark for an empty name", () => {
    render(<Avatar name="" />);

    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
