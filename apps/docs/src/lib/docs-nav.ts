/**
 * Documentation navigation — the single source of truth for the sidebar
 * tree, the mobile drawer, the prev/next pager, and the doc panels. Add
 * a page here and to `src/app/docs` and everything lights up.
 *
 * The Components group is one flat, alphabetical list — the Radix docs
 * shape — with a page per part of the library.
 */

export type DocPage = {
  /** root-relative href, e.g. `/docs/getting-started/installation` */
  href: string;
  label: string;
};

export type DocGroup = {
  id: string;
  /** sidebar group heading */
  label: string;
  pages: DocPage[];
};

const componentPages = [
  ["accordion", "Accordion"],
  ["aspect-ratio", "AspectRatio"],
  ["avatar", "Avatar"],
  ["badge", "Badge"],
  ["button", "Button"],
  ["card", "Card"],
  ["checkbox", "Checkbox"],
  ["collapsible", "Collapsible"],
  ["dialog", "Dialog"],
  ["field", "Field"],
  ["input", "Input"],
  ["loading-icon", "LoadingIcon"],
  ["menu-bar", "MenuBar"],
  ["navigation-menu", "NavigationMenu"],
  ["pagination", "Pagination"],
  ["password-toggle-field", "PasswordToggleField"],
  ["progress", "Progress"],
  ["radio-group", "RadioGroup"],
  ["scroll-area", "ScrollArea"],
  ["select", "Select"],
  ["separator", "Separator"],
  ["skeleton", "Skeleton"],
  ["slider", "Slider"],
  ["status", "Status"],
  ["switch", "Switch"],
  ["table", "Table"],
  ["tabs", "Tabs"],
  ["textarea", "Textarea"],
  ["toast", "Toast"],
  ["toggle", "Toggle"],
  ["toggle-group", "ToggleGroup"],
  ["tooltip", "Tooltip"],
].map(([slug, label]) => ({ href: `/docs/components/${slug}`, label }));

export const docGroups: DocGroup[] = [
  {
    id: "overview",
    label: "Overview",
    pages: [
      { href: "/docs", label: "Introduction" },
    ],
  },
  {
    id: "getting-started",
    label: "Getting started",
    pages: [
      { href: "/docs/getting-started/installation", label: "Installation" },
      { href: "/docs/getting-started/styling", label: "Styling" },
      { href: "/docs/getting-started/theming", label: "Theming" },
    ],
  },
  {
    id: "components",
    label: "Components",
    pages: componentPages,
  },
];

/** flattened reading order — drives the prev/next pager */
export const docPages: DocPage[] = docGroups.flatMap((group) => group.pages);

/** neighbors of `href` in reading order (both null at the ends) */
export function docNeighbors(href: string): {
  prev: DocPage | null;
  next: DocPage | null;
} {
  const index = docPages.findIndex((page) => page.href === href);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? docPages[index - 1] : null,
    next: index < docPages.length - 1 ? docPages[index + 1] : null,
  };
}

/**
 * the doc page a path belongs to
 *
 * A route can sit under another route — /docs is the Introduction, and
 * every other page lives below it — so the closest match wins, or the
 * Introduction would claim every page in the tree.
 */
export function closestDocPage(pathname: string): DocPage | undefined {
  return docPages
    .filter(
      (page) => pathname === page.href || pathname.startsWith(`${page.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/** label of the page a given path belongs to ("" when outside the docs) */
export function docPageLabel(pathname: string): string {
  return closestDocPage(pathname)?.label ?? "";
}
