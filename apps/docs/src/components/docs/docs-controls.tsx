"use client";

import { useState } from "react";

import { Button, Dialog, ScrollArea } from "@retroui/ui";
import { ThemeToggle } from "@/components/theme-toggle";

import { DocTree } from "./docs-tree";

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
      <a
        href="https://github.com/aelliixx/retro-ui/"
        className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted no-underline hover:text-ink"
      >
        GitHub
      </a>
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
    </div>
  );
}
