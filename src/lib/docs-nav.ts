/**
 * Documentation navigation — the single source of truth for the sidebar
 * tree, the mobile drawer, the prev/next pager, and (later) the doc
 * landing pages. Add a page here and to `src/app/docs` and everything
 * lights up.
 *
 * The Components group is deliberately empty for now — per-component
 * documentation comes after the groundwork gets its pass.
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
  /** shown instead of pages while the group ships nothing */
  pendingNote?: string;
};

export const docGroups: DocGroup[] = [
  {
    id: "overview",
    label: "Overview",
    pages: [
      { href: "/docs/introduction", label: "Introduction" },
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
    pages: [],
    pendingNote:
      "Panels land one milestone at a time — until then the playground shows all 29 in working order.",
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

/** label of the page a given path belongs to ("" when outside the docs) */
export function docPageLabel(pathname: string): string {
  return (
    docPages.find((page) => page.href === pathname || pathname.startsWith(`${page.href}/`))
      ?.label ?? ""
  );
}
