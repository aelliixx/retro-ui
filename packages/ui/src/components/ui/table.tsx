import { cn } from "../../lib/utils";

/**
 * The details pane — semantic native table parts wearing the operating
 * system's list skin: column headers on a sunken sheet between dark
 * rules, hairline column dividers, rows separated by soft hairlines
 * that highlight the era way (an accent-tint hover, instant).
 *
 * Composable and flat: `<Table>` is the `<table>` itself; wrap it in a
 * `<ScrollArea>` when the column count outruns the pane. No wrappers
 * are invented for structure you already own — `<thead>`/`<tbody>` are
 * semantic and simply styled. For row headers in the first column pass
 * `scope="row"` to `TableHead` (and consider `text-start`).
 *
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Size</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>document.txt</TableCell>
 *       <TableCell>12 KB</TableCell>
 *     </TableRow>
 *   </TableBody>
 *   <TableCaption>4 objects</TableCaption>
 * </Table>
 * ```
 */

type TableProps = React.ComponentProps<"table">;

function Table({ className, ...props }: TableProps) {
  return (
    <table
      data-slot="table"
      className={cn("w-full caption-bottom border-collapse text-sm text-ink", className)}
      {...props}
    />
  );
}

type TableHeaderProps = React.ComponentProps<"thead">;

function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:bg-surface-2 [&_tr]:border-y [&_tr]:border-y-ink", className)}
      {...props}
    />
  );
}

type TableBodyProps = React.ComponentProps<"tbody">;

function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody data-slot="table-body" className={cn("bg-surface", className)} {...props} />;
}

type TableFooterProps = React.ComponentProps<"tfoot">;

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-t-ink bg-surface-2 font-semibold [&>tr]:border-t-0",
        className,
      )}
      {...props}
    />
  );
}

type TableRowProps = React.ComponentProps<"tr">;

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-b-border-muted hover:bg-accent-soft hover:text-ink last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

type TableHeadProps = React.ComponentProps<"th">;

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 border-x border-x-border-muted px-3 py-2 text-left align-middle font-semibold first:border-l-0 last:border-r-0",
        className,
      )}
      {...props}
    />
  );
}

type TableCellProps = React.ComponentProps<"td">;

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn("h-10 px-3 py-2 align-middle", className)}
      {...props}
    />
  );
}

type TableCaptionProps = React.ComponentProps<"caption">;

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 px-3 py-1.5 text-left text-xs text-ink-muted", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
};
