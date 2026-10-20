import { cn } from "@/lib/utils";

/** Decorative 90s window chrome — minimize/maximize/close keys, purely
    visual; hidden from the a11y tree. Shared by the playground, the docs
    shell and the landing page so all three windows read as one desktop. */
export function WindowButtons({ className }: { className?: string }) {
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
