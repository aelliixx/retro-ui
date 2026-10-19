import { cn } from "@/lib/utils";

const textareaVariants = cn(
  "min-h-20 w-full resize-y border border-ink bg-well p-3 text-ink shadow-in",
  "placeholder:text-ink-muted caret-accent",
  "focus-etched",
  "aria-invalid:border-danger",
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted",
);

type TextareaProps = React.ComponentProps<"textarea">;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants, className)}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
export type { TextareaProps };
