import { cn } from "@/lib/utils";

/**
 * The carved group box — a raised fieldset with the magic-type legend
 * punched through its border line (the classic "Panel:" label). The
 * playground's `Section` is this plus its demo grid framing; docs and
 * landing use it directly to group related controls.
 */
export function GroupBox({
  label,
  className,
  legendClassName,
  children,
}: {
  label: string;
  className?: string;
  legendClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      className={cn(
        "border-2 border-border-muted [border-style:groove] px-4 pb-4 pt-2",
        className,
      )}
    >
      <legend
        className={cn(
          "px-1.5 font-pixel text-[11px] uppercase text-ink",
          legendClassName,
        )}
      >
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
