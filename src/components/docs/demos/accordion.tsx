import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
} from "@/components/ui";

/**
 * Accordion demo components — imported by the doc panel (`page.mdx`).
 * The complete code for each demo lives in the fenced block printed
 * under it on the page, so these files carry JSX only.
 */

export function BasicAccordion() {
  return (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>What ships in the box?</AccordionTrigger>
        <AccordionContent>
          Buttons, fields, menus, tables — windowed parts with tokens,
          light/dark theming and className composition underneath.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem open>
        <AccordionTrigger>Does open state survive reloads?</AccordionTrigger>
        <AccordionContent>
          Yes — items are real <code>details</code> elements, so the browser
          persists open state through navigation with no script at all.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Can several be open at once?</AccordionTrigger>
        <AccordionContent>
          By default every item toggles independently; the docs point at{" "}
          <code>Collapsible</code> when one panel is all you need.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ControlPanelAccordion() {
  return (
    <Accordion className="max-w-md">
      <AccordionItem open>
        <AccordionTrigger>Sharing permissions</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm text-ink">
              <Checkbox defaultChecked /> Let the workgroup read
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <Checkbox /> Let the workgroup write
            </label>
            <p className="text-sm text-ink-muted">
              Changes take effect the next time the drive mounts.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Connection details</AccordionTrigger>
        <AccordionContent>
          Server <code>file:\\wombat</code>, protocol SMB, port 139.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
