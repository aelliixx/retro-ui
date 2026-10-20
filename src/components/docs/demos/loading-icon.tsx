import { LoadingIcon } from "@/components/ui";

/**
 * LoadingIcon demos — imported by the doc panel (`page.mdx`).
 */

export function LoadingIconSizes() {
  return (
    <div className="flex items-center gap-3">
      <LoadingIcon className="size-3" label={null} />
      <LoadingIcon label={null} />
      <LoadingIcon className="size-6" label={null} />
      <LoadingIcon />
    </div>
  );
}

export function LoadingIconStatus() {
  return (
    <div className="flex items-center gap-2 text-sm text-ink">
      <LoadingIcon label={null} />
      <span>Mounting drive C…</span>
    </div>
  );
}
