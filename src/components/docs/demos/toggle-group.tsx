import { ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * ToggleGroup demos — imported by the doc panel (`page.mdx`).
 */

export function AlignBank() {
  return (
    <DemoStage>
      <ToggleGroup type="single" defaultValue="left" aria-label="Text align" className="w-fit">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </DemoStage>
  );
}

export function PanesBank() {
  return (
    <DemoStage>
      <ToggleGroup
        type="multiple"
        defaultValue={["grid", "list"]}
        aria-label="Visible panes"
        className="w-fit"
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
      </ToggleGroup>
    </DemoStage>
  );
}

export function VerticalBank() {
  return (
    <DemoStage>
      <ToggleGroup
        type="single"
        defaultValue="days"
        aria-label="Sort order"
        className="w-32 flex-col"
      >
        <ToggleGroupItem value="days">By date</ToggleGroupItem>
        <ToggleGroupItem value="name">By name</ToggleGroupItem>
        <ToggleGroupItem value="size">By size</ToggleGroupItem>
      </ToggleGroup>
    </DemoStage>
  );
}
