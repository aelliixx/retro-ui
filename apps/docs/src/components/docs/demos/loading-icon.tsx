import { LoadingIcon } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * LoadingIcon demos — imported by the doc panel (`page.mdx`).
 */

export function LoadingIconSizes() {
  return (
    <DemoStage>
      <div className="flex items-center gap-3">
        <LoadingIcon className="size-3" label={null} />
        <LoadingIcon label={null} />
        <LoadingIcon className="size-6" label={null} />
        <LoadingIcon />
      </div>
    </DemoStage>
  );
}

export function LoadingIconStatus() {
  return (
    <DemoStage>
      <div className="flex items-center gap-2 text-sm text-ink">
        <LoadingIcon label={null} />
        <span>Mounting drive C…</span>
      </div>
    </DemoStage>
  );
}
