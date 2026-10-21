import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";

describe("Accordion", () => {
  it("renders disclosure semantics", () => {
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>Install it</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(
      document.querySelector('[data-slot="accordion-trigger"]')?.tagName,
    ).toBe("SUMMARY");
    expect(
      document.querySelector('[data-slot="accordion-item"]')?.tagName,
    ).toBe("DETAILS");
    expect(screen.getByText("Getting started")).toBeInTheDocument();
  });

  it("starts closed by default", () => {
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>Install it</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const details = document.querySelector('[data-slot="accordion-item"]');
    expect(details).not.toHaveAttribute("open");
  });

  it("starts open with the open prop", () => {
    render(
      <Accordion>
        <AccordionItem open>
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>Install it</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(
      document.querySelector('[data-slot="accordion-item"]'),
    ).toHaveAttribute("open");
  });

  it("toggles an item open on click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Getting started</AccordionTrigger>
          <AccordionContent>Install it</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const details = document.querySelector('[data-slot="accordion-item"]')!;
    await user.click(screen.getByText("Getting started"));

    expect(details).toHaveAttribute("open");
  });

  it("keeps items independent — several may be open at once", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>First</AccordionTrigger>
          <AccordionContent>One</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>Second</AccordionTrigger>
          <AccordionContent>Two</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    await user.click(screen.getByText("First"));
    await user.click(screen.getByText("Second"));

    const details = document.querySelectorAll('[data-slot="accordion-item"]');
    expect(details[0]).toHaveAttribute("open");
    expect(details[1]).toHaveAttribute("open");
  });
});
