"use client";

import { cn } from "@/lib/utils";

const selectVariants = cn(
  "h-10 w-full cursor-pointer appearance-none border border-ink bg-well px-3 pr-8 text-ink shadow-in",
  "focus-etched",
  "aria-invalid:border-danger",
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
);

const selectRootVariants = cn("relative w-full", "disabled:text-ink-muted");

type SelectProps = React.ComponentProps<"select"> & {
  /** className lands on the wrapper (positions the chevron); the select fills it */
  className?: string;
};

function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className={cn(selectRootVariants, className)}>
      <select data-slot="select" className={selectVariants} {...props}>
        {children}
      </select>
      {/* chevron — pointer-events-none so clicks fall through to the select */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-ink-muted"
      >
        <path d="M3 6 L8 11 L13 6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export { Select, selectVariants };
export type { SelectProps };
