"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@retro-ui/ui";
import { cn } from "@retro-ui/ui";

/**
 * Light/dark switcher. Persists the explicit choice in localStorage under
 * `retro-theme`; first visit falls back to the system preference (see the
 * init script in `app/layout.tsx`).
 *
 * Implemented as a tiny store over the `<html>` class list so the label is
 * reactive without setState-in-effect.
 */
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

function setIsDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  try {
    localStorage.setItem("retro-theme", next ? "dark" : "light");
  } catch {
    /* private mode — theme just won't persist */
  }
  for (const listener of listeners) listener();
}

export function ThemeToggle({ className }: { className?: string }) {
  // Server snapshot is `null` (state unknown pre-hydration); the client
  // snapshot resolves from the live DOM class applied by the init script.
  const dark = useSyncExternalStore<boolean | null>(
    subscribe,
    isDark,
    () => null,
  );

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsDark(!isDark())}
      aria-label="Toggle color theme"
      className={cn("font-mono text-xs uppercase tracking-[0.12em]", className)}
    >
      {dark === null ? "Theme" : dark ? "Light mode" : "Dark mode"}
    </Button>
  );
}
