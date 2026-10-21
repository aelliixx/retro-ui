import { cn } from "../../lib/utils";

type AspectRatioProps = React.ComponentProps<"div"> & {
  /** width ÷ height the frame keeps, e.g. `4 / 3` or `16 / 9` */
  ratio?: number;
};

/**
 * A frame that holds its shape at any width — era thumbnails and photo
 * placeholders never reflowed, they scaled. Children fill the frame; give
 * the frame a `ratio` and it does the math. Ships with the house windowed
 * frame (ink border, sunken silver) — compose over it with `className`.
 */
function AspectRatio({
  className,
  ratio = 4 / 3,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn(
        "relative overflow-hidden border border-ink bg-surface-2 shadow-in",
        className,
      )}
      style={{ aspectRatio: String(ratio) }}
      {...props}
    >
      <div className="absolute inset-0 [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover">
        {children}
      </div>
    </div>
  );
}

export { AspectRatio };
export type { AspectRatioProps };
