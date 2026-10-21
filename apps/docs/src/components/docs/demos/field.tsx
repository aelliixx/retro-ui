import { Field, Input } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Field demos — imported by the doc panel (`page.mdx`).
 */

export function BasicField() {
  return (
    <DemoStage>
      <Field
        label="Display name"
        hint="Shown to teammates on the network."
        required
        className="max-w-xs"
      >
        <Input defaultValue="carp" />
      </Field>
    </DemoStage>
  );
}

export function InvalidField() {
  return (
    <DemoStage>
      <Field label="Email" error="That is not a valid address." className="max-w-xs">
        <Input defaultValue="carp@bbs" />
      </Field>
    </DemoStage>
  );
}
