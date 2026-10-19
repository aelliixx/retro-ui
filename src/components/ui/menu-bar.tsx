import { cn } from "@/lib/utils";

/**
 * The classic pull-down menu strip. Menus open on hover or keyboard focus
 * (the era's hover-preview) — plain CSS, no state, no portal. Each item is a
 * real `<button>`, so Tab walks into the open list and Enter fires the item;
 * outside roles (`menubar`/`menu`) are deliberately omitted since arrow-key
 * roving can't be honored without JS.
 *
 * Shortcuts shown on the right are displays only — bind real keys yourself.
 */

function MenuBar({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"nav"> & {
  /** accessible name for the strip (`aria-label`) */
  label: string;
}) {
  return (
    <nav
      data-slot="menu-bar"
      aria-label={label}
      className={cn("flex items-stretch border border-ink bg-surface px-0.5 py-0.5 shadow-out", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

type MenuProps = React.ComponentProps<"div"> & {
  /** the menu title — hover or focus opens the list below it */
  label: React.ReactNode;
  /** which side the dropdown hugs; `"end"` for menus hung at the right edge */
  align?: "start" | "end";
};

function Menu({ label, align = "start", className, children, ...props }: MenuProps) {
  return (
    <div
      data-slot="menu"
      className={cn("group relative flex", className)}
      {...props}
    >
      <button
        type="button"
        className={cn(
          "focus-etched h-full cursor-default select-none whitespace-nowrap px-2.5 py-1 text-sm text-ink",
          "group-hover:bg-accent group-hover:text-accent-ink",
          "group-focus-within:bg-accent group-focus-within:text-accent-ink",
        )}
      >
        {label}
      </button>
      <div
        data-slot="menu-list"
        className={cn(
          "absolute top-full z-20 hidden min-w-44 border border-ink bg-surface p-1 shadow-out",
          "group-hover:block group-focus-within:block",
          align === "start" ? "left-0" : "right-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type MenuItemProps = React.ComponentProps<"button"> & {
  /** right-aligned display-only shortcut, e.g. "Ctrl+S" */
  shortcut?: string;
};

function MenuItem({ shortcut, className, children, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "group/item focus-etched flex w-full cursor-pointer select-none items-center justify-between gap-6 whitespace-nowrap px-2.5 py-1 text-left text-sm text-ink",
        "enabled:hover:bg-accent enabled:hover:text-accent-ink",
        "enabled:focus-visible:bg-accent enabled:focus-visible:text-accent-ink",
        "disabled:cursor-not-allowed disabled:text-ink-muted",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {shortcut && (
        <kbd className="font-mono text-[11px] text-ink-muted group-hover/item:text-accent-ink">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

function MenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      data-slot="menu-separator"
      className={cn("my-1 border-t border-border-muted", className)}
      {...props}
    />
  );
}

export { MenuBar, Menu, MenuItem, MenuSeparator };
export type { MenuProps, MenuItemProps };
