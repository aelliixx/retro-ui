import { Button, Tooltip } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Tooltip demos — imported by the doc panel (`page.mdx`).
 */

export function TooltipRow() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-3 py-6">
        <Tooltip content="Save the file to disk">
          <Button>Disk</Button>
        </Tooltip>
        <Tooltip content="Discard every change" side="bottom">
          <Button variant="outline">Discard</Button>
        </Tooltip>
        <Tooltip content="Ctrl+P needs a paper drive">
          <Button variant="outline" size="icon" aria-label="Print">
            <span aria-hidden="true" className="font-bold">P</span>
          </Button>
        </Tooltip>
      </div>
    </DemoStage>
  );
}
