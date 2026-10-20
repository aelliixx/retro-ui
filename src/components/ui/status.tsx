import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const STATUS_VALUE = ["online", "away", "busy", "offline"] as const;

const statusVariants = cva("inline-block rounded-full border border-ink", {
  variants: {
    value: {
      online: "bg-accent",
      away: "bg-selection",
      busy: "bg-danger",
      offline: "bg-ink-muted",
    },
    size: {
      sm: "size-1.5",
      md: "size-2.5",
      lg: "size-3.5",
    },
  },
  defaultVariants: {
    value: "online",
    size: "md",
  },
});

type StatusProps = React.ComponentProps<"span"> &
  VariantProps<typeof statusVariants> & {
    /** visible label rendered after the pip, e.g. "Online" */
    label?: React.ReactNode;
  };

/**
 * The presence pip, on its own — the little availability dot roster lists
 * and chat windows drew next to every name. The pip is purely visual and
 * `aria-hidden`; pass `label` when the value needs to be read aloud, or let
 * surrounding text carry the meaning (as Avatar does with its name).
 */
function Status({ className, value, size, label, ...props }: StatusProps) {
  return (
    <span
      data-slot="status"
      data-value={value}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="status-pip"
        className={statusVariants({ value, size })}
      />
      {label != null && (
        <span className="font-mono text-xs text-ink">{label}</span>
      )}
    </span>
  );
}

export { Status, statusVariants, STATUS_VALUE };
export type { StatusProps };
