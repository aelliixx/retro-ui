import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Field, useFieldIds } from "../field";
import { Input } from "../input";

describe("Field", () => {
  it("links its label to the control", () => {
    render(
      <Field label="Username">
        <Input />
      </Field>,
    );

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("wires the hint to the control with aria-describedby", () => {
    render(
      <Field label="Username" hint="Letters and digits">
        <Input />
      </Field>,
    );

    const input = screen.getByLabelText("Username");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "Letters and digits",
    );
  });

  it("shows the error instead of the hint, and marks the control invalid", () => {
    render(
      <Field label="Username" hint="Letters and digits" error="Already taken">
        <Input />
      </Field>,
    );

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Already taken");
    expect(screen.queryByText("Letters and digits")).not.toBeInTheDocument();
  });

  it("marks a required field and the control", () => {
    render(
      <Field label="Username" required>
        <Input />
      </Field>,
    );

    expect(screen.getByLabelText(/Username/)).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("keeps a control's own id when it has one", () => {
    render(
      <Field label="Username">
        <Input id="my-input" />
      </Field>,
    );

    expect(screen.getByLabelText("Username")).toHaveAttribute("id", "my-input");
  });

  it("leaves the control alone with noWire", () => {
    render(
      <Field label="Username" noWire>
        <Input />
      </Field>,
    );

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("id");
  });

  it("does not wire multiple children", () => {
    render(
      <Field label="Username">
        <Input />
        <Input />
      </Field>,
    );

    for (const input of screen.getAllByRole("textbox")) {
      expect(input).not.toHaveAttribute("id");
    }
  });

  it("lets the consumer type into the control", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Field label="Username">
        <Input onChange={onChange} />
      </Field>,
    );

    await user.type(screen.getByLabelText("Username"), "ada");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Username")).toHaveValue("ada");
  });

  it("renders without a label", () => {
    render(
      <Field>
        <Input aria-label="Unlabelled" />
      </Field>,
    );

    // no label element is rendered, and the control keeps its own name
    expect(document.querySelector('[data-slot="field-label"]')).not.toBeInTheDocument();
    expect(screen.getByLabelText("Unlabelled")).toBeInTheDocument();
  });

  it("refuses to read field ids outside a Field", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    function Orphan() {
      useFieldIds();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(/must be used inside <Field>/);

    consoleError.mockRestore();
  });
});
