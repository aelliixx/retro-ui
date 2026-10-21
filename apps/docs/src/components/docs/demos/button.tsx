import { Button } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Button demo components — imported by the doc panel (`page.mdx`).
 * The complete code for each demo lives in the fenced block under it.
 */

export function ButtonVariants() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Install</Button>
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="ghost">Dismiss</Button>
        <Button variant="destructive">Delete disk</Button>
      </div>
    </DemoStage>
  );
}

export function ButtonSizes() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Help">
          <span aria-hidden="true" className="font-bold">
            ?
          </span>
        </Button>
        <Button variant="primary" disabled>
          Floppy drive
        </Button>
      </div>
    </DemoStage>
  );
}
