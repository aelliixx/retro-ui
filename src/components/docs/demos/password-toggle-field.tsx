import { PasswordToggleField } from "@/components/ui";

/**
 * PasswordToggleField demos — imported by the doc panel (`page.mdx`).
 */

export function PasswordBasics() {
  return (
    <PasswordToggleField
      label="Secret phrase"
      hint="Keep it off the network."
      defaultValue="hunter2"
      className="max-w-xs"
    />
  );
}

export function PasswordInvalid() {
  return (
    <PasswordToggleField
      label="Secret phrase"
      error="That is not the right phrase."
      required
      className="max-w-xs"
    />
  );
}
