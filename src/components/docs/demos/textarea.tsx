import { Field, Textarea } from "@/components/ui";

/**
 * Textarea demos — imported by the doc panel (`page.mdx`).
 */

export function NoteTextarea() {
  return (
    <Field label="Autoexec notes" hint="Resize at the bottom edge; wraps at the column." className="max-w-sm">
      <Textarea rows={4} defaultValue={"REM load high, run late\nREM keep off the network"} />
    </Field>
  );
}

export function TextareaStates() {
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Textarea placeholder="Disabled buffer" disabled aria-label="Disabled buffer" />
      <Textarea
        aria-invalid
        defaultValue="buffer overrun: 512 bytes requested"
        aria-label="Invalid note"
      />
    </div>
  );
}
