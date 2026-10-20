import { Field, Slider } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Slider demos — imported by the doc panel (`page.mdx`).
 */

export function SliderSteps() {
  return (
    <DemoStage>
      <div className="flex max-w-xs flex-col gap-3">
        <Slider defaultValue={40} min={0} max={100} aria-label="Volume" />
        <Slider disabled defaultValue={70} aria-label="Disabled volume" />
      </div>
    </DemoStage>
  );
}

export function SliderInField() {
  return (
    <DemoStage>
      <Field label="Cathode warmth" hint="10% steps, honest and chunky.">
        <Slider defaultValue={30} min={0} max={100} step={10} />
      </Field>
    </DemoStage>
  );
}
