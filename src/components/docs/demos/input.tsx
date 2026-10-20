import { Field, Input } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Input demos — imported by the doc panel (`page.mdx`).
 */

export function InputStates() {
  return (
    <DemoStage>
      <div className="flex max-w-xs flex-col gap-3">
        <Input placeholder="Search the disk" aria-label="Search the disk" />
        <Input placeholder="Disabled" disabled aria-label="Disabled input" />
        <Input
          aria-invalid
          defaultValue="C:\WINDOWS\SYSTEM32"
          aria-label="Path"
        />
      </div>
    </DemoStage>
  );
}

export function InputFields() {
  return (
    <DemoStage>
      <div className="flex max-w-xs flex-col gap-4">
        <Field
          label="Secret phrase"
          hint="Keep it off the network."
        >
          <Input type="password" defaultValue="hunter2" />
        </Field>
        <Field label="Attachment" error="File is over the 64K limit.">
          <Input type="file" />
        </Field>
      </div>
    </DemoStage>
  );
}
