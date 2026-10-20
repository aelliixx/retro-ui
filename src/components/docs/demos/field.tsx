import { Field, Input } from "@/components/ui";

/**
 * Field demos — imported by the doc panel (`page.mdx`).
 */

export function BasicField() {
  return (
    <Field
      label="Display name"
      hint="Shown to teammates on the network."
      required
      className="max-w-xs"
    >
      <Input defaultValue="carp" />
    </Field>
  );
}

export function InvalidField() {
  return (
    <Field label="Email" error="That is not a valid address." className="max-w-xs">
      <Input defaultValue="carp@bbs" />
    </Field>
  );
}
