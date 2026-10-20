import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="Name" />);

    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("honours an explicit type", () => {
    render(<Input type="email" aria-label="Mail" />);

    expect(screen.getByLabelText("Mail")).toHaveAttribute("type", "email");
  });

  it("accepts typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    await user.type(screen.getByLabelText("Name"), "ada");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Name")).toHaveValue("ada");
  });
});

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea aria-label="Notes" />);

    expect(screen.getByLabelText("Notes").tagName).toBe("TEXTAREA");
  });

  it("accepts typing", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" />);

    await user.type(screen.getByLabelText("Notes"), "hello");

    expect(screen.getByLabelText("Notes")).toHaveValue("hello");
  });
});

describe("Select", () => {
  it("renders a native select with its options", () => {
    render(
      <Select aria-label="Drive">
        <option value="c">C:</option>
        <option value="d">D:</option>
      </Select>,
    );

    const select = screen.getByLabelText("Drive");
    expect(select.tagName).toBe("SELECT");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("picks an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select aria-label="Drive" onChange={onChange} defaultValue="c">
        <option value="c">C:</option>
        <option value="d">D:</option>
      </Select>,
    );

    await user.selectOptions(screen.getByLabelText("Drive"), "d");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText("Drive")).toHaveValue("d");
  });
});
