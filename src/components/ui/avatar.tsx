"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { useState } from "react";

import { cn } from "@/lib/utils";

const STATUS_COLOR = {
  online: "bg-accent",
  away: "bg-selection",
  busy: "bg-danger",
  offline: "bg-ink-muted",
} as const;

const avatarVariants = cva(
  "relative inline-flex select-none items-center justify-center border border-ink bg-surface-2 font-semibold text-ink-muted shadow-out",
  {
    variants: {
      size: {
        sm: "size-6 text-[10px]",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AvatarProps = React.ComponentProps<"span"> &
  VariantProps<typeof avatarVariants> & {
    /** image source; a missing or broken URL falls back to `fallback` */
    src?: string;
    /** the name — accessible label, and the source of default initials */
    name: string;
    /** fallback content; defaults to up to two initials derived from `name` */
    fallback?: React.ReactNode;
    /** presence pip in the bottom-right corner, hidden from the a11y tree */
    status?: "online" | "away" | "busy" | "offline";
  };

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "?"
  );
}

/**
 * Square, beveled presence tile — the era drew people as small framed
 * rectangles, not floating circles. Renders `src` when it loads, initial
 * letters otherwise; `status` adds the presence pip.
 *
 * The accessible contract lives on the tile itself (`role="img"` +
 * `aria-label="name"`), so the inner image is presentational.
 */
function Avatar({
  className,
  size,
  src,
  name,
  fallback,
  status,
  ...props
}: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = !!src && !broken;

  return (
    <span
      data-slot="avatar"
      role="img"
      aria-label={name}
      data-status={status}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="truncate px-0.5 leading-none">{fallback ?? initials(name)}</span>
      )}
      {status && (
        <span
          data-slot="avatar-status"
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-ink",
            STATUS_COLOR[status],
          )}
        />
      )}
    </span>
  );
}

export { Avatar, avatarVariants };
export type { AvatarProps };
