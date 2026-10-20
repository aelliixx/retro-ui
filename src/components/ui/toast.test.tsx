import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast } from "@/components/ui/toast";

function PushButton({
  variant,
  duration,
}: {
  variant?: "info" | "success" | "error";
  duration?: number;
}) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast[variant ?? "info"]("Saved", "The file is on disk.", { duration })
      }
    >
      push
    </button>
  );
}

function renderToasts(props: {
  variant?: "info" | "success" | "error";
  duration?: number;
}) {
  return render(
    <ToastProvider>
      <PushButton {...props} />
    </ToastProvider>,
  );
}

const push = () => fireEvent.click(screen.getByRole("button", { name: "push" }));

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("pushes a toast into the live region", () => {
    renderToasts({ duration: 0 });

    push();

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("The file is on disk.")).toBeInTheDocument();
  });

  it("renders the region as a labelled live area", () => {
    renderToasts({ duration: 0 });

    expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
  });

  it("gives error toasts the alert role and the others status", () => {
    const { rerender } = renderToasts({ duration: 0 });

    push();
    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(
      <ToastProvider>
        <PushButton variant="error" duration={0} />
      </ToastProvider>,
    );
    push();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("marks the variant on the toast", () => {
    renderToasts({ variant: "success", duration: 0 });

    push();

    expect(document.querySelector('[data-slot="toast"]')).toHaveAttribute(
      "data-variant",
      "success",
    );
  });

  it("dismisses on the ✕ key", () => {
    renderToasts({ duration: 0 });

    push();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("auto-dismisses after its duration", () => {
    renderToasts({ duration: 1000 });

    push();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("sticks around when the duration is 0", () => {
    renderToasts({ duration: 0 });

    push();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("stacks several toasts at once", () => {
    renderToasts({ duration: 0 });

    push();
    push();

    expect(screen.getAllByText("Saved")).toHaveLength(2);
  });
});
