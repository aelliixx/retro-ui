"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";

import { cn } from "../../lib/utils";

/**
 * The file-folder tab control — real `tablist`/`tab`/`tabpanel` ARIA with a
 * roving tabindex: Arrow keys (plus Home/End) walk the triggers and moving
 * focus selects (automatic activation, like Radix's default); click selects
 * the old way. Inactive panels stay mounted but `hidden`, so form state
 * inside them survives switching.
 *
 * Trigger and content ids derive deterministically from the tab value, so
 * `aria-controls` / `aria-labelledby` line up without lifted registration.
 * The selected trigger loses its bottom border and overlaps the panel's top
 * hairline by 1px — tab and page read as one carved sheet.
 */

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  idPrefix: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("retro/ui: Tabs* components must be used inside <Tabs>");
  }
  return ctx;
}

/** tab values can hold any characters — keep DOM ids CSS-selector-safe */
function toIdFragment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "") || "tab";
}

type TabsProps = React.ComponentProps<"div"> & {
  /** controlled selected tab value */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const uid = useId();
  const idPrefix = `${uid.replace(/[^a-zA-Z0-9_-]/g, "") || uid}-tabs`;
  const [innerValue, setInnerValue] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const current = isControlled ? value : innerValue;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInnerValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: current, setValue, idPrefix }}>
      <div data-slot="tabs" className={cn("w-fit", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("flex items-stretch gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type TabsTriggerProps = React.ComponentProps<"button"> & {
  /** the tab's value — unique within the group */
  value: string;
};

function TabsTrigger({
  value,
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const tabs = useTabs();
  const fragment = toIdFragment(value);
  const selected = tabs.value === value;

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      id={`${tabs.idPrefix}-trigger-${fragment}`}
      data-value={value}
      role="tab"
      aria-selected={selected}
      aria-controls={`${tabs.idPrefix}-panel-${fragment}`}
      data-state={selected ? "active" : "inactive"}
      tabIndex={selected ? 0 : -1}
      className={cn(
        "focus-etched relative select-none whitespace-nowrap border border-ink px-3 py-1 text-sm text-ink",
        "enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-ink-muted",
        selected
          // selected: no bottom border, overlapping the panel's hairline —
          // the folder tab reads as merged with its page
          ? "-mb-px z-10 border-b-0 bg-surface shadow-out"
          : "bg-surface-2 shadow-out enabled:hover:text-ink",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        tabs.setValue(value);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const key = event.key;
        if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") {
          return;
        }
        const list = event.currentTarget.closest<HTMLElement>('[role="tablist"]');
        if (!list) return;
        const triggers = [
          ...list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
        ];
        const index = triggers.indexOf(event.currentTarget);
        if (index < 0) return;
        event.preventDefault();
        event.stopPropagation();
        const next =
          key === "Home"
            ? 0
            : key === "End"
              ? triggers.length - 1
              : (index + (key === "ArrowRight" ? 1 : -1) + triggers.length) %
                triggers.length;
        const nextTrigger = triggers[next];
        if (!nextTrigger) return;
        // activation follows focus — walking also selects
        nextTrigger.focus();
        tabs.setValue(nextTrigger.dataset.value ?? "");
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = React.ComponentProps<"div"> & {
  /** the tab value this panel answers */
  value: string;
};

function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const tabs = useTabs();
  const fragment = toIdFragment(value);
  const active = tabs.value === value;

  return (
    <div
      data-slot="tabs-content"
      id={`${tabs.idPrefix}-panel-${fragment}`}
      role="tabpanel"
      aria-labelledby={`${tabs.idPrefix}-trigger-${fragment}`}
      data-state={active ? "active" : "inactive"}
      // APG: an otherwise-unfocusable panel takes focus when its tab activates
      tabIndex={active ? 0 : undefined}
      aria-hidden={!active}
      hidden={!active}
      className={cn(
        "border border-ink bg-surface p-3 shadow-out",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsTriggerProps, TabsContentProps };
