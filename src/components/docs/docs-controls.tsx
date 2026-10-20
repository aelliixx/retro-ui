"use client";

import { useState } from "react";

import { Button, Dialog, ScrollArea } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import { DocTree } from "./docs-tree";

/** Decorative 90s window chrome — purely visual, hidden from a11y tree.
    (Mirrors the playground's keys so both pages share one desktop.) */
function WindowButtons({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-1.5", className)}
    >
      <span className="flex h-4 w-4 items-end justify-center border border-ink bg-surface pb-0.5 shadow-out">
        <span className="h-0.5 w-1.5 bg-ink" />
      </span>
      <span className="flex h-4 w-4 items-center justify-center border border-ink bg-surface shadow-out">
        <span className="h-1.5 w-1.5 border border-ink" />
      </span>
      <span className="relative flex h-4 w-4 items-center justify-center border border-ink bg-surface shadow-out">
        <span className="absolute h-0.5 w-2 rotate-45 bg-ink" />
        <span className="absolute h-0.5 w-2 -rotate-45 bg-ink" />
      </span>
    </div>
  );
}

/**
 * Right side of the docs titlebar: the theme toggle and decorative keys
 * on every viewport, plus a Menu key below `lg` that opens the doc tree
 * as a drawer built from the library's own `<Dialog>` — native
 * `<dialog>` focus trapping and Escape handling come along for free.
 * Navigating from the drawer closes it.
 */
export function DocsTitlebarControls() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setMenuOpen(true)}
        className="font-mono text-xs uppercase tracking-[0.12em] lg:hidden"
        aria-label="Open documentation menu"
      >
        Menu
      </Button>
      <Dialog
        open={menuOpen}
        onOpenChange={setMenuOpen}
        title="retro/ui — documentation"
        noIcon
        className="m-0 h-dvh max-h-dvh w-72 max-w-[calc(100vw-2.5rem)]"
      >
        <ScrollArea className="h-full">
          <div className="pb-4">
            <DocTree onNavigate={() => setMenuOpen(false)} />
          </div>
        </ScrollArea>
      </Dialog>
      <WindowButtons className="hidden sm:flex" />
    </div>
  );
}
