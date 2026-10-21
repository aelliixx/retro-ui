import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

describe("Card", () => {
  it("renders its parts with their slots", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardDescription>Read-only</CardDescription>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Properties").tagName).toBe("H3");
    expect(screen.getByText("Read-only").tagName).toBe("P");
    expect(
      document.querySelector('[data-slot="card-content"]'),
    ).toHaveTextContent("Body");
    expect(
      document.querySelector('[data-slot="card-footer"]'),
    ).toHaveTextContent("Footer");
  });

  it("is raised by default", () => {
    render(<Card>Body</Card>);

    expect(document.querySelector('[data-slot="card"]')).toHaveClass(
      "shadow-out",
    );
  });

  it("sinks with the inset variant", () => {
    render(<Card variant="inset">Body</Card>);

    const card = document.querySelector('[data-slot="card"]');
    expect(card).toHaveClass("shadow-in");
    expect(card).toHaveClass("bg-surface-2");
  });

  it("drops the carve with the flat variant", () => {
    render(<Card variant="flat">Body</Card>);

    const card = document.querySelector('[data-slot="card"]');
    expect(card).not.toHaveClass("shadow-out");
    expect(card).not.toHaveClass("shadow-in");
  });

  it("hatches the titlebar header", () => {
    render(
      <Card>
        <CardHeader variant="titlebar">
          <CardTitle>Properties</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(
      document.querySelector('[data-slot="card-header"]'),
    ).toHaveClass("bg-hatch");
  });
});
