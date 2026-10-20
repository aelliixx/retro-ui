import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PasswordToggleField } from "@/components/ui/password-toggle-field";

describe("PasswordToggleField", () => {
  it("masks the input by default", () => {
    render(<PasswordToggleField label="Password" />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("reveals the value on the reveal key", async () => {
    const user = userEvent.setup();
    render(<PasswordToggleField label="Password" />);

    await user.click(screen.getByRole("button", { name: "Show password" }));

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toBeInTheDocument();
  });

  it("masks the value again", async () => {
    const user = userEvent.setup();
    render(<PasswordToggleField label="Password" />);

    await user.click(screen.getByRole("button", { name: "Show password" }));
    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("keeps the typed value while revealing", async () => {
    const user = userEvent.setup();
    render(<PasswordToggleField label="Password" />);

    const input = screen.getByLabelText("Password");
    await user.type(input, "hunter2");
    await user.click(screen.getByRole("button", { name: "Show password" }));

    expect(screen.getByLabelText("Password")).toHaveValue("hunter2");
  });

  it("marks the control invalid when there is an error", () => {
    render(<PasswordToggleField label="Password" error="Too short" />);

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
  });

  it("passes input props through", async () => {
    const user = userEvent.setup();
    render(<PasswordToggleField label="Password" placeholder="type here" />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("placeholder", "type here");

    await user.type(input, "x");
    expect(input).toHaveValue("x");
  });
});
