"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { closestDocPage, docGroups } from "@/lib/docs-nav";

/**
 * The docs navigation tree — shared by the desktop sidebar and the mobile
 * Drawer dialog. Groups are plain headings, pages are era list items:
 * the active page rides the standard selection recipe (sunken accent
 * tint, instant), links are plain `next/link` so nothing about the tree
 * needs to be re-learned.
 */
export function DocTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  // A route can sit under another route — /docs is the Introduction, and
  // every other page lives below it — so only the closest match counts as
  // the active page. Without this the Introduction would light up on
  // every page in the tree.
  const activeHref = closestDocPage(pathname)?.href;

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-5">
      {docGroups.map((group) => (
        <div key={group.id} className="flex flex-col gap-0.5">
          <h2 className="px-1.5 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
            {group.label}
          </h2>
          {group.pages.map((page) => {
            const active = page.href === activeHref;
            return (
              <Link
                key={page.href}
                href={page.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "no-underline border px-1.5 py-1 text-sm",
                  active
                    ? "border-ink bg-accent-soft font-semibold text-ink"
                    : "border-transparent text-ink-muted hover:border-border-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {page.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
