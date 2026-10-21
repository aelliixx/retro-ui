import type { MDXComponents } from "mdx/types";

import { cn } from "@retro-ui/ui";

/**
 * Global MDX element mapping — the docs' hand-styled prose (no
 * typography plugin). Headings keep their `id`s from rehype-slug; code
 * splits on fenced (`language-*` → plain text inside the wide sunken
 * well of `pre`) vs. inline (small sunken chip); GFM tables adopt the
 * library's vintage Table surface, inside a beveled frame pane.
 */
const components = {
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={cn("mb-6 mt-2 text-2xl font-bold tracking-tight text-ink", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-10 border-b border-border-muted pb-1.5 text-xl font-bold text-ink",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={cn("mt-8 text-base font-semibold text-ink", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={cn("mt-6 text-sm font-semibold text-ink", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn("my-3 text-sm leading-6 text-ink-muted", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: React.ComponentProps<"a">) => (
    <a
      className={cn(
        "text-inherit font-medium text-accent-strong underline decoration-dotted underline-offset-2 hover:bg-accent-soft",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn(
        "my-3 ml-5 list-disc space-y-1 text-sm leading-6 text-ink-muted marker:text-ink",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn(
        "my-3 ml-5 list-decimal space-y-1 text-sm leading-6 text-ink-muted marker:text-ink",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("my-0.5", className)} {...props} />
  ),
  strong: ({ className, ...props }: React.ComponentProps<"strong">) => (
    <strong className={cn("font-semibold text-ink", className)} {...props} />
  ),
  em: ({ className, ...props }: React.ComponentProps<"em">) => (
    <em className={cn("text-ink", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-4 border border-l-2 border-ink border-l-ink bg-surface-2 px-3 py-2 text-sm text-ink [&>p]:my-0",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.ComponentProps<"hr">) => (
    <hr className={cn("my-8 border-t border-border-muted", className)} {...props} />
  ),
  code: ({ className, ...props }: React.ComponentProps<"code">) =>
    /language-/.test(className ?? "") ? (
      // fenced — painted by `pre` below
      <code
        className={cn("font-mono text-xs leading-relaxed text-ink", className)}
        {...props}
      />
    ) : (
      <code
        className={cn(
          "border border-ink bg-surface-2 px-1 font-mono text-[0.8em] text-ink shadow-in",
          className,
        )}
        {...props}
      />
    ),
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      className={cn(
        "my-4 overflow-x-auto border border-ink bg-well p-3 font-mono text-xs leading-relaxed shadow-in [&_code]:p-0 [&_code]:border-0 [&_code]:bg-transparent [&_code]:shadow-none [&_code]:text-xs",
        className,
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto border border-ink bg-surface shadow-out [&_table]:caption-bottom [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:text-ink [&_table]:m-0">
      <table className={className} {...props} />
    </div>
  ),
  thead: ({ className, ...props }: React.ComponentProps<"thead">) => (
    <thead
      className={cn(
        "[&_tr]:border-y [&_tr]:border-y-ink [&_tr]:bg-surface-2 [&_tr:hover]:bg-surface-2",
        className,
      )}
      {...props}
    />
  ),
  tbody: ({ className, ...props }: React.ComponentProps<"tbody">) => (
    <tbody className={cn("[&_tr:hover]:bg-accent-soft", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr
      className={cn("border-b border-b-border-muted last:border-b-0", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "h-10 border-x border-x-border-muted px-3 py-2 text-left align-middle font-semibold text-ink first:border-l-0 last:border-r-0",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td className={cn("h-9 px-3 py-2 align-middle text-ink-muted", className)} {...props} />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
