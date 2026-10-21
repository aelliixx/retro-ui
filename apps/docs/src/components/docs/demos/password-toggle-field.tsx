import { PasswordToggleField } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * PasswordToggleField demos — imported by the doc panel (`page.mdx`).
 */

export function PasswordBasics() {
  return (
    <DemoStage>
      <PasswordToggleField
        label="Secret phrase"
        hint="Keep it off the network."
        defaultValue="hunter2"
        className="max-w-xs"
      />    </DemoStage>
  );
}

export function PasswordInvalid() {
  return (
    <DemoStage>
      <PasswordToggleField
        label="Secret phrase"
        error="That is not the right phrase."
        required
        className="max-w-xs"
      />    </DemoStage>
  );
}
