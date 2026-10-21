import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ToastProvider,
  useToast,
  type ToastPosition,
  type ToastTone,
} from "../toast";

function PushButton({
  variant,
  duration,
  tone,
  icon,
}: {
  variant?: "info" | "success" | "error";
  duration?: number;
  tone?: ToastTone;
  icon?: React.ReactNode;
}) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast[variant ?? "info"]("Saved", "The file is on disk.", {
          duration,
          tone,
          icon,
        })
      }
    >
      push
    </button>
  );
}

function renderToasts(props: {
  variant?: "info" | "success" | "error";
  duration?: number;
  tone?: ToastTone;
  icon?: React.ReactNode;
  position?: ToastPosition;
}) {
  return render(
    <ToastProvider position={props.position}>
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

  it("holds the timer while the pointer rests on the toast", () => {
    renderToasts({ duration: 1000 });

    push();
    const toast = document.querySelector('[data-slot="toast"]')!;

    // a pointer parked on the toast holds its timer — a toast should not
    // die while someone is reading it
    fireEvent.pointerEnter(toast);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(toast).toHaveAttribute("data-hovered", "true");
  });

  it("restarts the full duration once the pointer leaves", () => {
    renderToasts({ duration: 1000 });

    push();
    const toast = document.querySelector('[data-slot="toast"]')!;

    fireEvent.pointerEnter(toast);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    fireEvent.pointerLeave(toast);

    // the leave restarts the clock — the toast survives the first window
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByText("Saved")).toBeInTheDocument();

    // and the restarted clock still runs out
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("defaults to the info variant and omits an empty description", () => {
    // the raw push API carries no variant of its own
    function RawPush() {
      const toast = useToast();
      return (
        <button type="button" onClick={() => toast.push({ title: "Saved" })}>
          push
        </button>
      );
    }

    render(
      <ToastProvider>
        <RawPush />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "push" }));

    const toast = document.querySelector('[data-slot="toast"]')!;
    expect(toast).toHaveAttribute("data-variant", "info");
    // title only — the description paragraph is not rendered at all
    expect(toast.querySelectorAll("p")).toHaveLength(1);
  });

  it("refuses to push outside a provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    function Orphan() {
      useToast();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow(
      /must be used inside <ToastProvider>/,
    );

    consoleError.mockRestore();
  });

  describe("position", () => {
    const region = () => screen.getByLabelText("Notifications");

    it("sits in the bottom-right by default", () => {
      renderToasts({ duration: 0 });

      expect(region()).toHaveAttribute("data-position", "bottom-right");
      expect(region()).toHaveClass("right-4");
      expect(region()).toHaveClass("bottom-4");
    });

    it.each([
      ["bottom-left", ["left-4", "bottom-4"]],
      ["bottom-right", ["right-4", "bottom-4"]],
      ["top-left", ["left-4", "top-4"]],
      ["top-right", ["right-4", "top-4"]],
    ] as const)("pins the stack to the %s corner", (position, classes) => {
      renderToasts({ duration: 0, position });

      expect(region()).toHaveAttribute("data-position", position);
      for (const className of classes) {
        expect(region()).toHaveClass(className);
      }
    });

    it.each(["top-center", "bottom-center"] as const)(
      "centres the stack along the %s edge",
      (position) => {
        renderToasts({ duration: 0, position });

        expect(region()).toHaveAttribute("data-position", position);
        expect(region()).toHaveClass("left-1/2");
        expect(region()).toHaveClass("-translate-x-1/2");
      },
    );

    it("lets the consumer override the placement", () => {
      render(
        <ToastProvider position="top-right" className="top-24 right-8">
          <span>child</span>
        </ToastProvider>,
      );

      // tailwind-merge: the consumer's corner wins
      expect(region()).toHaveClass("top-24");
      expect(region()).toHaveClass("right-8");
      expect(region()).not.toHaveClass("top-4");
    });
  });

  describe("tone and icon", () => {
    const toast = () => document.querySelector('[data-slot="toast"]')!;

    it("wears the variant's tone by default", () => {
      renderToasts({ variant: "success", duration: 0 });
      push();

      expect(toast()).toHaveAttribute("data-tone", "success");
      expect(toast().className).toContain("before:bg-success");
    });

    it("wears a tone of its own", () => {
      renderToasts({ variant: "error", tone: "neutral", duration: 0 });
      push();

      // the tone paints the rail and the glyph, the variant keeps the role
      expect(toast()).toHaveAttribute("data-tone", "neutral");
      expect(toast().className).toContain("before:bg-ink-muted");
      expect(toast()).toHaveAttribute("role", "alert");
    });

    it("shows the variant's glyph by default", () => {
      renderToasts({ variant: "success", duration: 0 });
      push();

      // the check mark, in the tone's colour
      expect(toast().querySelector("svg")).toBeInTheDocument();
      expect(toast().querySelector("span")?.className).toContain(
        "text-success",
      );
    });

    it("shows a custom icon instead of the variant's glyph", () => {
      renderToasts({
        duration: 0,
        icon: <span data-testid="custom-glyph">★</span>,
      });
      push();

      expect(screen.getByTestId("custom-glyph")).toBeInTheDocument();
      expect(toast().querySelector("svg")).not.toBeInTheDocument();
    });

    it("paints a custom icon with the tone", () => {
      renderToasts({
        duration: 0,
        tone: "accent",
        icon: <span data-testid="custom-glyph">★</span>,
      });
      push();

      expect(screen.getByTestId("custom-glyph").parentElement).toHaveClass(
        "text-accent",
      );
    });
  });
});
