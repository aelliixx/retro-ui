"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* key chrome — a Button-sized key that reads pressed when current      */
/* ------------------------------------------------------------------ */

const paginationKeyVariants = cva(
  [
    "inline-flex select-none items-center justify-center whitespace-nowrap border border-ink font-mono text-sm shadow-out",
    "enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-ink-muted",
    "focus-etched enabled:active:shadow-in",
  ],
  {
    variants: {
      active: {
        true: "bg-accent text-accent-ink shadow-in",
        false: "bg-surface text-ink enabled:hover:bg-surface-2",
      },
      size: {
        sm: "h-7 w-7",
        md: "h-8 w-8",
      },
    },
    defaultVariants: {
      active: false,
      size: "md",
    },
  },
);

type PaginationKeyVariants = VariantProps<typeof paginationKeyVariants>;

/* ------------------------------------------------------------------ */
/* context                                                             */
/* ------------------------------------------------------------------ */

type PaginationContextValue = {
  page: number;
  goto: (page: number) => void;
  totalPages: number;
  siblings: number;
  size: "sm" | "md";
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePagination(component: string) {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error(`<${component}> must be used within <Pagination>`);
  }
  return context;
}

/* ------------------------------------------------------------------ */
/* item math — first/last stay, the window around `page` elides         */
/* ------------------------------------------------------------------ */

const ELLIPSIS = "…" as const;

type PagerItem = number | typeof ELLIPSIS;

function pagerItems(page: number, totalPages: number, siblings: number) {
  // everything fits — no eliding at all
  if (totalPages <= siblings * 2 + 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, page - siblings);
  const end = Math.min(totalPages - 1, page + siblings);

  const items: PagerItem[] = [1];
  if (start > 2) items.push(ELLIPSIS);
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push(ELLIPSIS);
  items.push(totalPages);

  return items;
}

/* ------------------------------------------------------------------ */
/* root                                                                */
/* ------------------------------------------------------------------ */

type PaginationProps = React.ComponentProps<"nav"> & {
  /** total page count the nav steps through */
  totalPages: number;
  /** controlled current page */
  page?: number;
  /** uncontrolled initial page */
  defaultPage?: number;
  /** fired with the newly selected page */
  onPageChange?: (page: number) => void;
  /** pages kept visible on each side of the current one */
  siblings?: number;
  /** key scale for every trigger in the nav */
  size?: "sm" | "md";
  /** accessible name; name it when several navs share a page */
  label?: string;
};

/**
 * Page navigation, era style: a rail of numbered keys with `◂`/`▸`
 * stepping and `…` eliding the pages that don't fit. `<Pagination>` owns
 * the page state and renders a `<nav>`; lay the rail out with
 * `PaginationPrev`, `PaginationPager` and `PaginationNext` inside it.
 *
 * Keyboard comes free — real buttons, so Tab/Enter/Space behave as keys.
 */
function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  size = "md",
  label = "Pagination",
  className,
  children,
  ...props
}: PaginationProps) {
  const [innerPage, setInnerPage] = useState(defaultPage);
  const current = Math.min(Math.max(page ?? innerPage, 1), totalPages);

  const goto = (next: number) => {
    const bounded = Math.min(Math.max(next, 1), totalPages);
    if (bounded === current) return;
    if (page == null) setInnerPage(bounded);
    onPageChange?.(bounded);
  };

  return (
    <PaginationContext.Provider
      value={{ page: current, goto, totalPages, siblings, size }}
    >
      <nav
        data-slot="pagination"
        aria-label={label}
        className={cn("flex w-fit items-center gap-1", className)}
        {...props}
      >
        {children}
      </nav>
    </PaginationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* triggers                                                            */
/* ------------------------------------------------------------------ */

/**
 * A single numbered key. Used by `PaginationPager`; exported for custom
 * rails — set `active` yourself (read `page` from your own state).
 */
function PaginationTrigger({
  className,
  active,
  size: sizeProp,
  ...props
}: React.ComponentProps<"button"> & PaginationKeyVariants) {
  const { size } = usePagination("PaginationTrigger");
  return (
    <button
      type="button"
      data-slot="pagination-trigger"
      data-active={active ? "true" : undefined}
      className={cn(
        paginationKeyVariants({ active, size: sizeProp ?? size }),
        className,
      )}
      {...props}
    />
  );
}

/**
 * The `◂` key. Disabled on the first page.
 */
function PaginationPrev({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { page, goto, size } = usePagination("PaginationPrev");
  return (
    <button
      type="button"
      data-slot="pagination-prev"
      aria-label="Previous page"
      disabled={page <= 1}
      className={cn(paginationKeyVariants({ size }), "font-pixel", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) goto(page - 1);
      }}
      {...props}
    >
      ◂
    </button>
  );
}

/**
 * The `▸` key. Disabled on the last page.
 */
function PaginationNext({ className, onClick, ...props }: React.ComponentProps<"button">) {
  const { page, goto, totalPages, size } = usePagination("PaginationNext");
  return (
    <button
      type="button"
      data-slot="pagination-next"
      aria-label="Next page"
      disabled={page >= totalPages}
      className={cn(paginationKeyVariants({ size }), "font-pixel", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) goto(page + 1);
      }}
      {...props}
    >
      ▸
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* pager — the numbered rail, auto-computed                            */
/* ------------------------------------------------------------------ */

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn("px-0.5 font-mono text-sm text-ink-muted", className)}
      {...props}
    >
      …
    </span>
  );
}

type PaginationPagerProps = React.ComponentProps<"ul">;

/**
 * The numbered keys, laid out from the current page: edge pages always
 * show, the middle window elides to `…` as space demands.
 */
function PaginationPager({ className, ...props }: PaginationPagerProps) {
  const { page, goto, totalPages, siblings, size } = usePagination("PaginationPager");
  const items = pagerItems(page, totalPages, siblings);

  return (
    <ul
      data-slot="pagination-pager"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {items.map((item, index) =>
        item === ELLIPSIS ? (
          <li key={`ellipsis-${index}-…`} aria-hidden="true">
            <PaginationEllipsis />
          </li>
        ) : (
          <li key={item}>
            <PaginationTrigger
              size={size}
              active={item === page}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => goto(item)}
            >
              {item}
            </PaginationTrigger>
          </li>
        ),
      )}
    </ul>
  );
}

export {
  Pagination,
  PaginationPrev,
  PaginationNext,
  PaginationTrigger,
  PaginationEllipsis,
  PaginationPager,
  paginationKeyVariants,
};
export type { PaginationProps, PagerItem };
