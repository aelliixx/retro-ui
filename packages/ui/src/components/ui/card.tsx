import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "border border-ink bg-surface text-ink overflow-hidden",
  {
    variants: {
      variant: {
        /** raised window: two-tone bevel (default) */
        raised: "shadow-out",
        /** same box, no carve */
        flat: "",
        /** sunken well, e.g. for code blocks or content wells */
        inset: "bg-surface-2 shadow-in",
      },
    },
    defaultVariants: {
      variant: "raised",
    },
  },
);

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>;

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({
  className,
  variant = "plain",
  ...props
}: React.ComponentProps<"div"> & { variant?: "plain" | "titlebar" }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex items-center gap-2 border-b border-ink px-4 py-3",
        variant === "titlebar" && [
          "bg-surface-2 bg-hatch",
          // title bars speak in small, bold caps
          "[&_[data-slot=card-title]]:text-xs [&_[data-slot=card-title]]:font-bold [&_[data-slot=card-title]]:uppercase [&_[data-slot=card-title]]:tracking-[0.14em]",
        ],
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base font-semibold text-ink", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-ink-muted", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 py-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 border-t border-ink px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
