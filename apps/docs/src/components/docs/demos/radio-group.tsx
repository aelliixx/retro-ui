import { Radio, RadioGroup } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * RadioGroup demos — imported by the doc panel (`page.mdx`).
 */

export function ViewRadioGroup() {
  return (
    <DemoStage>
      <RadioGroup
        label="View"
        defaultValue="details"
        name="view"
        className="max-w-xs"
      >
        <Radio value="large">Large icons</Radio>
        <Radio value="list">List</Radio>
        <Radio value="details">Details</Radio>
        <Radio value="network" disabled>
          Network places
        </Radio>
      </RadioGroup>
    </DemoStage>
  );
}
