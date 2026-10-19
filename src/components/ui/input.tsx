import { cn } from "@/lib/utils";

const inputVariants = cn(
  "h-10 w-full rounded-sm border-2 border-ink bg-surface px-3 text-ink shadow-sunk",
  "placeholder:text-ink-muted caret-accent",
  "transition-[background-color,border-color,box-shadow,opacity] duration-100 motion-reduce:transition-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "aria-invalid:border-danger",
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted disabled:opacity-90",
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
