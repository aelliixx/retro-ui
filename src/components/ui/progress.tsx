import { cn } from "@/lib/utils";

const progressVariants = cn(
  "h-4 w-full border border-ink bg-well shadow-in p-[2px]",
);

type ProgressProps = React.ComponentProps<"div"> & {
  /** current value (0–max); the fill line runs flush into the end wall */
  value?: number;
  max?: number;
};

function Progress({ className, value = 0, max = 100, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={pct === 0 ? undefined : Math.round(pct)}
      data-state={pct === 100 ? "complete" : undefined}
      data-slot="progress"
      className={cn(progressVariants, className)}
      {...props}
    >
      <div
        data-slot="progress-fill"
        style={{ width: `${pct}%` }}
        className="h-full bg-accent"
      />
    </div>
  );
}

export { Progress, progressVariants };
export type { ProgressProps };
