import { cn } from "@/lib/utils";

/**
 * The loading tile — the era's placeholder: a sunken block wearing the
 * fine checkerboard dither, standing in for content not yet on the disk.
 * Purely visual (a bare div); size it with `className` (`h-4 w-32` for a
 * text line, `h-10 w-10` for an avatar well) and lay several out to sketch
 * the pending layout. Deliberately static — the wait is honest, no
 * shimmer.
 *
 * ```tsx
 * <div className="flex flex-col gap-1.5">
 *   <Skeleton className="h-3 w-full" />
 *   <Skeleton className="h-3 w-4/5" />
 *   <Skeleton className="h-3 w-2/3" />
 * </div>
 * ```
 */

type SkeletonProps = React.ComponentProps<"div">;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-state="loading"
      aria-hidden="true"
      className={cn(
        "bg-dither pointer-events-none select-none overflow-hidden border border-ink bg-surface-2 shadow-in",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
