import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm",
    "border-2 border-ink font-medium shadow-hard-sm",
    "transition-[background-color,color,box-shadow,translate,opacity] duration-100 motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    // press mechanics: the button sinks into its own shadow
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
    "disabled:pointer-events-none disabled:translate-none disabled:opacity-55 disabled:shadow-none",
    // controlled "sunken" state, e.g. for toggle buttons
    "data-[pressed=true]:translate-x-[3px] data-[pressed=true]:translate-y-[3px] data-[pressed=true]:shadow-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-ink hover:bg-accent-strong",
        secondary: "bg-surface text-ink hover:bg-surface-2",
        outline: "bg-transparent text-ink hover:bg-surface-2",
        ghost:
          "border-transparent bg-transparent text-ink shadow-none hover:bg-surface-2",
        destructive: "bg-danger text-danger-ink hover:bg-danger-strong",
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

function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
