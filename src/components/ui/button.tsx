import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group inline-flex select-none items-center justify-center whitespace-nowrap border border-ink bg-surface text-ink font-medium shadow-out",
    "enabled:cursor-pointer disabled:cursor-not-allowed disabled:text-ink-muted",
    // keyboard focus, the old way: dotted rectangle inside the border
    "focus-etched",
    // press: the bevel inverts instantly — a key, not an animation
    "enabled:active:shadow-in",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-ink enabled:hover:bg-accent-strong",
        secondary: "enabled:hover:bg-surface-2",
        outline: "bg-transparent enabled:hover:bg-surface-2",
        ghost:
          "border-transparent bg-transparent shadow-none enabled:hover:bg-surface-2",
        destructive: "bg-danger text-danger-ink enabled:hover:bg-danger-strong",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, type = "button", children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {/* content sits in its own layer so pressing nudges it, not the bevel */}
      <span
        className={cn(
          "flex items-center gap-2 group-active:translate-x-[1px] group-active:translate-y-[1px]",
          "group-data-[pressed=true]:translate-x-[1px] group-data-[pressed=true]:translate-y-[1px]",
        )}
      >
        {children}
      </span>
    </button>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
