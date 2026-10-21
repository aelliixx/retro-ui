"use client";

import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * The loading tile — the era's placeholder: a sunken block wearing the
 * fine checkerboard dither, standing in for content not yet on the disk.
 * API mirrors Radix Themes' Skeleton, minus the shimmer (waits here are
 * static) — same structure, defaults and behaviors:
 *
 * - `<Skeleton />` — a generic tile; size it via `className` (`h-4 w-32`
 *   for a text line, `h-10 w-10` for an avatar well). Empty shells are
 *   promoted to `display: block` so the sizes mean anything.
 * - `<Skeleton loading={loading}><Switch … /></Skeleton>` — wraps live
 *   content: the shell renders *onto* the child element (no wrapper node),
 *   which keeps its dimensions and layout while its paint is replaced by
 *   the placeholder; `loading={false}` renders the children untouched.
 * - `<Skeleton>Lorem ipsum</Skeleton>` — bare text children are
 *   supported, with the inline-metric normalization Radix does (wrap the
 *   text node itself, not its parent, and the placeholder ends up the
 *   same shape as the words would be).
 *
 * The shell is `aria-hidden`, `tabIndex` `-1` and `inert` — "preserves
 * the dimensions of children when hidden and disables interactive
 * elements". Shell paint lives in the `.retro-skeleton` rules in
 * `globals.css` and deliberately wins over the wrapped element's own
 * bevels, so any component can sit underneath without fighting.
 */

type SkeletonProps = React.ComponentProps<"span"> & {
  /** whether the skeleton shell replaces the children's paint (default true) */
  loading?: boolean;
};

function Skeleton({
  loading = true,
  className,
  children,
  ...props
}: SkeletonProps) {
  if (!loading) return children;

  const skeletonClasses = cn("retro-skeleton", className);

  // single element child: render the shell onto the child itself (Radix
  // Slots it), so the placeholder is exactly the child's shape and size
  if (React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      "data-slot": "skeleton",
      "data-state": "loading",
      "aria-hidden": true,
      tabIndex: -1,
      inert: true,
      ...props,
      className: cn(
        "retro-skeleton",
        (child.props.className as string | undefined) ?? "",
        className,
      ),
    });
  }

  // bare text, fragments, arrays or nothing: wrap in the shell span;
  // `data-inline-skeleton` normalizes inline text metrics like Radix
  // (the element-child case returned above, so this is always the
  // text-shaped shell)
  return (
    <span
      data-slot="skeleton"
      data-state="loading"
      aria-hidden="true"
      tabIndex={-1}
      data-inline-skeleton
      className={skeletonClasses}
      {...props}
    >
      {children}
    </span>
  );
}

export { Skeleton };
export type { SkeletonProps };
