import { Separator } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Separator demos — imported by the doc panel (`page.mdx`).
 */

export function HorizontalSeparator() {
  return (
    <DemoStage>
      <div className="max-w-sm text-sm text-ink">
        <p>Everything ends.</p>
        <Separator className="my-2" />
        <p>Everything begins again.</p>
      </div>
    </DemoStage>
  );
}

export function VerticalSeparator() {
  return (
    <DemoStage>
      <div className="flex h-16 items-center gap-3 text-sm text-ink">
        <span>Suspend</span>
        <Separator orientation="vertical" />
        <span>Shut down</span>
        <Separator orientation="vertical" />
        <span>Restart</span>
      </div>
    </DemoStage>
  );
}
