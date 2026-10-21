"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@retro-ui/ui";

import { docNeighbors } from "@/lib/docs-nav";

/**
 * Prev/next rail under every doc page — the era's wizard-step feel:
 * two plain beveled links, the reading directions labeled in the
 * small-caps mono of the title bars. Both slots render even on the
 * edges of the reading order, so the rail keeps its shape.
 */
export function DocPager() {
  const pathname = usePathname();
  const { prev, next } = docNeighbors(pathname);
  if (!prev && !next) return null;

  const arrow = "font-mono text-xs text-ink-muted";
  const block =
    "no-underline border border-ink bg-surface px-3 py-2 shadow-out hover:bg-surface-2 focus-etched max-w-[45%]";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-12 flex items-stretch justify-between gap-4 border-t border-border-muted pt-6",
      )}
    >
      {prev ? (
        <Link href={prev.href} className={cn(block, "text-left")}>
          <span className={cn(arrow, "block")}>◂ Previous</span>
          <span className="block text-sm font-semibold text-ink">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={cn(block, "text-right ml-auto")}>
          <span className={cn(arrow, "block")}>Next ▸</span>
          <span className="block text-sm font-semibold text-ink">
            {next.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
