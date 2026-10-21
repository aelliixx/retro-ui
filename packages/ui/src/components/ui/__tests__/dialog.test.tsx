import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "../dialog";

describe("Dialog", () => {
  it("renders closed by default", () => {
    render(<Dialog title="Careful">Something happened.</Dialog>);

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("opens with defaultOpen", () => {
    render(
      <Dialog title="Careful" defaultOpen>
        Something happened.
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });

  it("labels the dialog by its title", () => {
    render(
      <Dialog title="Careful" defaultOpen>
        Something happened.
      </Dialog>,
    );

    expect(
      screen.getByRole("dialog", { name: "Careful" }),
    ).toBeInTheDocument();
  });

  it("describes the dialog with its body", () => {
    render(
      <Dialog title="Careful" defaultOpen>
        Something happened.
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "Something happened.",
    );
  });

  it("closes from the ✕ key and reports the next state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Careful" defaultOpen onOpenChange={onOpenChange}>
        Something happened.
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    );
  });

  it("routes the native close event through onOpenChange", async () => {
    // Escape closes a modal <dialog> in the browser, which fires the
    // native "close" event — happy-dom does not implement that key
    // behaviour, so the event itself is what we assert on here.
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Careful" defaultOpen onOpenChange={onOpenChange}>
        Something happened.
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    dialog.dispatchEvent(new Event("close"));

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("reports the close to a controlled parent", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Careful" open onOpenChange={onOpenChange}>
        Something happened.
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    // the parent owns the prop — it decides what happens next
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("opens and closes as the controlled value flips", () => {
    const { rerender } = render(
      <Dialog title="Careful" open={false}>
        Something happened.
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    );

    rerender(
      <Dialog title="Careful" open={true}>
        Something happened.
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("open");
  });

  it("renders action buttons in the footer rail", () => {
    render(
      <Dialog title="Careful" defaultOpen actions={<button>OK</button>}>
        Something happened.
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("can hide the glyph with noIcon", () => {
    const { container } = render(
      <Dialog title="Careful" defaultOpen noIcon>
        Something happened.
      </Dialog>,
    );

    // the titlebar ✕ glyph is the only svg left
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("closes without an onOpenChange handler", async () => {
    const user = userEvent.setup();
    render(
      <Dialog title="Careful" defaultOpen>
        Something happened.
      </Dialog>,
    );

    // the handler is optional — closing must not throw on the missing call
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
        "open",
      );
    });
  });
});
