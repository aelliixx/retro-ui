"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/**
 * The site navigation bar: inline links plus items that pop a content panel
 * — the "mega menu" primitive. Panels hang flush under (or beside) the bar,
 * aligned to their trigger and clamped to the window, so the pointer stays
 * inside the chrome while moving from trigger to panel.
 *
 * Behavior: triggers open on mouse-over or click (Radix-style pop menus);
 * panels close on outside click, focus leaving the bar, or Escape — which
 * returns focus to the trigger. One panel is open at a time; moving between
 * triggers keeps the bar open with no re-close grace. Open state is a
 * `value`-based controlled slot (`value` / `defaultValue` / `onValueChange`
 * with `""` = closed), so React state is the single source of truth.
 *
 * Vertical orientation hangs panels to the right of the bar — the sidebar
 * navigation pattern.
 */

/* ------------------------------------------------------------------------- */
/* wiring                                                                    */
/* ------------------------------------------------------------------------- */

type Orientation = "horizontal" | "vertical";

type NavContextValue = {
  orientation: Orientation;
  /** `""` = every panel closed */
  value: string;
  setValue: (value: string) => void;
  rootRef: React.RefObject<HTMLElement | null>;
};

type ItemContextValue = {
  value: string;
  triggerId: string;
  contentId: string;
};

const NavContext = createContext<NavContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);
const TriggerRefContext = createContext<React.RefObject<HTMLButtonElement | null> | null>(null);

function useRoot() {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error("retro/ui: NavigationMenu* components must be used inside <NavigationMenu>");
  }
  return ctx;
}

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error("retro/ui: NavigationMenu* components must be used inside <NavigationMenuItem>");
  }
  return ctx;
}

function useTriggerRef() {
  const ctx = useContext(TriggerRefContext);
  if (!ctx) {
    throw new Error("retro/ui: NavigationMenu* components must be used inside <NavigationMenuItem>");
  }
  return ctx;
}

/** focus the panel's first interactive child — ArrowDown from the trigger */
function focusFirstInContent(contentId: string) {
  const content = document.getElementById(contentId);
  content?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
}

/** panels waiting to receive focus right after they mount (keyboard-opened) */
const pendingFocusFirst = new Set<string>();

/* ------------------------------------------------------------------------- */
/* root                                                                      */
/* ------------------------------------------------------------------------- */

type NavigationMenuProps = React.ComponentProps<"nav"> & {
  /** accessible name for the bar (`aria-label`) */
  label: string;
  /** bar direction; vertical hangs panels to the right */
  orientation?: Orientation;
  /** controlled open panel value — `""` closes all */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function NavigationMenu({
  label,
  orientation = "horizontal",
  value,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...props
}: NavigationMenuProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : innerValue;

  const rootRef = useRef<HTMLElement>(null);
  const graceTimer = useRef<number>(undefined);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const scheduleClose = useCallback(() => {
    window.clearTimeout(graceTimer.current);
    graceTimer.current = window.setTimeout(() => setValue(""), 150);
  }, [setValue]);

  const cancelClose = useCallback(() => {
    window.clearTimeout(graceTimer.current);
  }, []);

  // outside click — and focus escaping the bar — close immediately
  useEffect(() => {
    if (!currentValue) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setValue("");
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setValue("");
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusOut);
    };
  }, [currentValue, setValue]);

  useEffect(() => window.clearTimeout(graceTimer.current), []);

  return (
    <NavContext.Provider
      value={{ orientation, value: currentValue, setValue, rootRef }}
    >
      <nav
        data-slot="navigation-menu"
        aria-label={label}
        ref={rootRef}
        className={cn(
          "relative w-fit border border-ink bg-surface px-0.5 py-0.5 shadow-out",
          orientation === "horizontal" ? "flex items-stretch" : "flex flex-col items-stretch",
          className,
        )}
        onPointerEnter={cancelClose}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") scheduleClose();
        }}
        {...props}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
}

/* ------------------------------------------------------------------------- */
/* list + item                                                               */
/* ------------------------------------------------------------------------- */

function NavigationMenuList({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  const { orientation } = useRoot();
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "flex m-0",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

type NavigationMenuItemProps = React.ComponentProps<"li"> & {
  /** panel value for controlled use — defaults to an auto-generated id */
  value?: string;
};

function NavigationMenuItem({
  value,
  className,
  children,
  ...props
}: NavigationMenuItemProps) {
  const uid = useId();
  const itemValue = value ?? uid;
  const baseId = itemValue.replace(/[^a-zA-Z0-9_-]/g, "") || uid;
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <TriggerRefContext.Provider value={triggerRef}>
      <ItemContext.Provider
        value={{
          value: itemValue,
          triggerId: `${baseId}-trigger`,
          contentId: `${baseId}-content`,
        }}
      >
        <li data-slot="navigation-menu-item" className={cn("flex", className)} {...props}>
          {children}
        </li>
      </ItemContext.Provider>
    </TriggerRefContext.Provider>
  );
}

/* ------------------------------------------------------------------------- */
/* trigger                                                                   */
/* ------------------------------------------------------------------------- */

type NavigationMenuTriggerProps = React.ComponentProps<"button"> & {
  /** hides the chevron for trigger-less-looking items */
  chevron?: boolean;
};

function NavigationMenuTrigger({
  chevron = true,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: NavigationMenuTriggerProps) {
  const { value, setValue } = useRoot();
  const item = useItem();
  const triggerRef = useTriggerRef();
  const open = value === item.value;
  // the panel may already be open because the mouse hovered over the
  // trigger — a click then must not dismiss it, or the first click on a
  // fresh menu bar would look like it did nothing
  const openedByHover = useRef(false);

  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      id={item.triggerId}
      aria-expanded={open}
      aria-controls={item.contentId}
      ref={triggerRef}
      className={cn(
        "focus-etched flex cursor-default select-none items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-sm text-ink",
        "hover:bg-accent hover:text-accent-ink",
        "focus-visible:bg-accent focus-visible:text-accent-ink",
        "aria-expanded:bg-accent aria-expanded:text-accent-ink",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (open && !openedByHover.current) {
          setValue("");
        } else {
          setValue(item.value);
          openedByHover.current = false;
        }
      }}
      onPointerEnter={(event) => {
        // mouse-over opens like the era's menus; touch relies on the click
        if (event.pointerType !== "mouse") return;
        if (value === item.value) return;
        openedByHover.current = true;
        setValue(item.value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (open) {
            focusFirstInContent(item.contentId);
          } else {
            // tag the panel to take focus once it mounts
            pendingFocusFirst.add(item.value);
            setValue(item.value);
          }
        }
      }}
      {...props}
    >
      {children}
      {chevron && (
        <svg viewBox="0 0 8 8" className="size-2" aria-hidden="true">
          {open ? (
            <path d="M1 5.5 L4 1.5 L7 5.5 Z" fill="currentColor" />
          ) : (
            <path d="M1 2.5 L7 2.5 L4 6.5 Z" fill="currentColor" />
          )}
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------------- */
/* content                                                                   */
/* ------------------------------------------------------------------------- */

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation, value, setValue, rootRef } = useRoot();
  const item = useItem();
  const triggerRef = useTriggerRef();
  const open = value === item.value;
  const contentRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<{ left?: number; top?: number }>({});

  // hang the panel flush under (horizontal) or beside (vertical) the bar,
  // aligned to the trigger and clamped so it never leaves the window
  useLayoutEffect(() => {
    if (!open) return;
    // keyboard-opened panels receive focus immediately (ArrowDown flows in)
    if (pendingFocusFirst.delete(item.value)) {
      focusFirstInContent(item.contentId);
    }
    const trigger = triggerRef.current;
    const root = rootRef.current;
    const content = contentRef.current;
    if (!trigger || !root || !content) return;
    const triggerRect = trigger.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    if (orientation === "horizontal") {
      const natural = triggerRect.left - rootRect.left;
      const maxLeft = Math.max(
        0,
        window.innerWidth - contentRect.width - rootRect.left,
      );
      setOffset({ left: Math.min(Math.max(0, natural), maxLeft) });
    } else {
      const natural = triggerRect.top - rootRect.top;
      const maxTop = Math.max(
        0,
        window.innerHeight - contentRect.height - rootRect.top,
      );
      setOffset({ top: Math.min(Math.max(0, natural), maxTop) });
    }
  }, [open, orientation, item.value, item.contentId, triggerRef, rootRef]);

  if (!open) return null;

  return (
    <div
      data-slot="navigation-menu-content"
      id={item.contentId}
      role="group"
      aria-labelledby={item.triggerId}
      ref={contentRef}
      className={cn(
        "absolute z-30 min-w-56 border border-ink bg-surface p-3 shadow-out",
        // overlap the bar's bottom (or right) hairline so panel and bar
        // join seamlessly — no floating gap for the pointer to fall through
        orientation === "horizontal" ? "top-full mt-[-1px]" : "left-full ml-[-1px]",
        className,
      )}
      style={orientation === "horizontal" ? { left: offset.left } : { top: offset.top }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        setValue("");
        triggerRef.current?.focus();
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* link                                                                      */
/* ------------------------------------------------------------------------- */

type NavigationMenuLinkProps = React.ComponentProps<"a"> & {
  /** marks the current page (`aria-current="page"` + active styling) */
  active?: boolean;
};

function NavigationMenuLink({
  active,
  className,
  children,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <a
      data-slot="navigation-menu-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-etched block select-none px-2.5 py-1 text-sm text-ink",
        "hover:bg-accent hover:text-accent-ink",
        "focus-visible:bg-accent focus-visible:text-accent-ink",
        active && "bg-accent-soft text-accent-strong",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
export type {
  NavigationMenuProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuLinkProps,
};
