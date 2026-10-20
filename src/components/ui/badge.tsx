import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex select-none items-center justify-center gap-1 whitespace-nowrap border border-ink font-pixel text-[10px] uppercase leading-none shadow-out",
  {
    variants: {
      variant: {
        solid: "",
        outline: "bg-surface text-ink",
        subtle: "border-transparent shadow-none",
      },
      tone: {
        accent: "",
        success: "",
        danger: "",
        neutral: "",
      },
      size: {
        sm: "h-4 px-1 text-[9px]",
        md: "h-5 px-1.5",
      },
    },
    compoundVariants: [
      // solid — the full chip, tinted edge to edge
      { variant: "solid", tone: "accent", class: "bg-accent text-accent-ink" },
      { variant: "solid", tone: "success", class: "bg-success text-success-ink" },
      { variant: "solid", tone: "danger", class: "bg-danger text-danger-ink" },
      { variant: "solid", tone: "neutral", class: "bg-ink text-surface-2" },
      // outline — ink frame, tone in the text alone
      {
        variant: "outline",
        tone: "accent",
        class: "text-accent-strong",
      },
      {
        variant: "outline",
        tone: "success",
        class: "text-success-strong",
      },
      {
        variant: "outline",
        tone: "danger",
        class: "text-danger-strong",
      },
      // subtle — the soft well behind, no bevel
      {
        variant: "subtle",
        tone: "accent",
        class: "bg-accent-soft text-ink",
      },
      {
        variant: "subtle",
        tone: "success",
        class: "bg-success-soft text-ink",
      },
      {
        variant: "subtle",
        tone: "danger",
        class: "bg-danger-soft text-ink",
      },
      {
        variant: "subtle",
        tone: "neutral",
        class: "bg-well text-ink-muted",
      },
    ],
    defaultVariants: {
      variant: "solid",
      tone: "accent",
      size: "md",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

/**
 * A tiny stamped label — "NEW!", "BETA", "3 unread" — set in pixel caps on
 * a beveled chip. `tone` picks the ink family, `variant` how loudly the
 * chip speaks (solid fill / outline / soft well).
 */
function Badge({ className, variant, tone, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
