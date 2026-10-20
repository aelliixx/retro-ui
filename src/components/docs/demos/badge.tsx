import { Badge } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Badge demos — imported by the doc panel (`page.mdx`). The complete
 * code for each demo lives in the fenced block under it on the page.
 */

export function BadgeTones() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>new</Badge>
        <Badge tone="success">stable</Badge>
        <Badge tone="danger">breaking</Badge>
        <Badge tone="neutral">v0.4.0</Badge>
      </div>
    </DemoStage>
  );
}

export function BadgeOutline() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">new</Badge>
        <Badge variant="outline" tone="success">stable</Badge>
        <Badge variant="outline" tone="danger">breaking</Badge>
        <Badge variant="outline" tone="neutral">v0.4.0</Badge>
      </div>
    </DemoStage>
  );
}

export function BadgeSubtle() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="subtle">new</Badge>
        <Badge variant="subtle" tone="success">stable</Badge>
        <Badge variant="subtle" tone="danger">breaking</Badge>
        <Badge variant="subtle" tone="neutral">v0.4.0</Badge>
      </div>
    </DemoStage>
  );
}

export function BadgeSizes() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm">sm</Badge>
        <Badge size="md">md</Badge>
      </div>
    </DemoStage>
  );
}

export function BadgeComposed() {
  return (
    <DemoStage>
      <Badge className="rounded-full px-2 shadow-none">rounded off</Badge>
    </DemoStage>
  );
}
