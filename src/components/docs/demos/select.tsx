import { Field, Select } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Select demos — imported by the doc panel (`page.mdx`).
 */

export function SelectBasics() {
  return (
    <DemoStage>
      <div className="flex max-w-xs flex-col gap-4">
        <Field label="File format">
          <Select defaultValue="xlsx">
            <option value="xlsx">Excel sheet</option>
            <option value="txt">Plain text</option>
            <option value="csv">Comma ledger</option>
            <option value="rtf" disabled>
              Rich text (archived)
            </option>
          </Select>
        </Field>
        <Field label="Network protocol">
          <Select disabled>
            <option>NetBEUI</option>
          </Select>
        </Field>
      </div>
    </DemoStage>
  );
}

export function SelectGroups() {
  return (
    <DemoStage>
      <Field label="Resolution" hint="Applies after a reboot.">
        <Select defaultValue="800">
          <optgroup label="Square">
            <option value="640">640 × 480</option>
            <option value="800">800 × 600</option>
            <option value="1024">1024 × 768</option>
          </optgroup>
          <optgroup label="Wide">
            <option value="1280w">1280 × 720</option>
            <option value="1600w">1600 × 900</option>
          </optgroup>
        </Select>
      </Field>
    </DemoStage>
  );
}
