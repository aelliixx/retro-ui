import { cn } from "@/lib/utils";

const inputVariants = cn(
  "h-10 w-full border border-ink bg-well px-3 text-ink shadow-in",
  "placeholder:text-ink-muted caret-accent",
  "focus-etched",
  "aria-invalid:border-danger",
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
);

type InputProps = React.ComponentProps<"input">;

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants, className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
