import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Pagination,
  PaginationNext,
  PaginationPager,
  PaginationPrev,
  PaginationTrigger,
} from "@/components/ui/pagination";

function Rail(props: {
  totalPages?: number;
  defaultPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  siblings?: number;
}) {
  return (
    <Pagination totalPages={props.totalPages ?? 12} {...props}>
      <PaginationPrev />
      <PaginationPager />
      <PaginationNext />
    </Pagination>
  );
}

describe("Pagination", () => {
  it("renders a labelled nav with the stepping keys", () => {
    render(<Rail totalPages={5} />);

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
  });

  it("lists every page when they all fit", () => {
    render(<Rail totalPages={5} />);

    expect(screen.getAllByRole("button", { name: /^Page \d+$/ })).toHaveLength(5);
    expect(screen.queryByText("…")).not.toBeInTheDocument();
  });

  it("leaves out the leading ellipsis near the first page", () => {
    render(<Rail totalPages={12} defaultPage={1} />);

    const pages = screen
      .getAllByRole("button", { name: /^Page \d+$/ })
      .map((button) => button.textContent);

    // the window is page 2 alone, so there is no gap before it
    expect(pages).toEqual(["1", "2", "12"]);
    expect(screen.getAllByText("…")).toHaveLength(1);
  });

  it("elides the middle pages with an ellipsis", () => {
    render(<Rail totalPages={12} defaultPage={4} />);

    const pages = screen
      .getAllByRole("button", { name: /^Page \d+$/ })
      .map((button) => button.textContent);

    expect(pages).toEqual(["1", "3", "4", "5", "12"]);
    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("marks the current page with aria-current", () => {
    render(<Rail totalPages={12} defaultPage={4} />);

    const current = screen.getByRole("button", { name: "Page 4" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("data-active", "true");
  });

  it("disables the stepping keys at the ends", async () => {
    const user = userEvent.setup();
    render(<Rail totalPages={5} defaultPage={1} />);

    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next page" }));
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
  });

  it("steps forward and back", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Rail totalPages={5} defaultPage={2} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it("jumps to a page when its key is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Rail totalPages={12} defaultPage={4} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Page 12" }));

    expect(onPageChange).toHaveBeenCalledWith(12);
    expect(screen.getByRole("button", { name: "Page 12" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("honours a controlled page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Rail totalPages={12} page={4} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Page 5" }));

    expect(onPageChange).toHaveBeenCalledWith(5);
    // the parent owns the page — the rail must not move on its own
    expect(screen.getByRole("button", { name: "Page 4" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("widens the visible window with siblings", () => {
    render(<Rail totalPages={12} defaultPage={6} siblings={2} />);

    const pages = screen
      .getAllByRole("button", { name: /^Page \d+$/ })
      .map((button) => button.textContent);

    expect(pages).toEqual(["1", "4", "5", "6", "7", "8", "12"]);
  });

  it("keeps the elision out of the accessibility tree", () => {
    render(<Rail totalPages={12} defaultPage={4} />);

    for (const ellipsis of screen.getAllByText("…")) {
      expect(ellipsis).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("lets the consumer veto a step with preventDefault", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination totalPages={5} defaultPage={2} onPageChange={onPageChange}>
        <PaginationPrev
          onClick={(event) => event.preventDefault()}
        />
        <PaginationPager />
        <PaginationNext />
      </Pagination>,
    );

    await user.click(screen.getByRole("button", { name: "Previous page" }));

    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("lets the consumer veto a step forward", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination totalPages={5} defaultPage={2} onPageChange={onPageChange}>
        <PaginationPrev />
        <PaginationPager />
        <PaginationNext onClick={(event) => event.preventDefault()} />
      </Pagination>,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(onPageChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("ignores a jump to the page it is already on", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination totalPages={5} defaultPage={3} onPageChange={onPageChange}>
        <PaginationPager />
      </Pagination>,
    );

    await user.click(screen.getByRole("button", { name: "Page 3" }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("lets a custom trigger pick its own size", () => {
    render(
      <Pagination totalPages={5} size="sm">
        <PaginationTrigger value={1} size="md">
          1
        </PaginationTrigger>
      </Pagination>,
    );

    // the root asks for small keys, the trigger asked for the medium one
    expect(screen.getByRole("button", { name: "1" })).toHaveClass("h-8");
  });

  it("gives a custom trigger the root's size when it has none", () => {
    render(
      <Pagination totalPages={5} size="sm">
        <PaginationTrigger value={1}>1</PaginationTrigger>
      </Pagination>,
    );

    expect(screen.getByRole("button", { name: "1" })).toHaveClass("h-7");
  });

  it("refuses to render a trigger outside a Pagination", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<PaginationTrigger value={1}>1</PaginationTrigger>)).toThrow(
      /must be used within <Pagination>/,
    );

    consoleError.mockRestore();
  });

  it("refuses to render a pager outside a Pagination", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<PaginationPager />)).toThrow(
      /must be used within <Pagination>/,
    );

    consoleError.mockRestore();
  });
});
