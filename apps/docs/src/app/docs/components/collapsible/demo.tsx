"use client";

import { useState } from "react";

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
} from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Collapsible demos — the live demos on this page. The page itself is a
 * server component, so a demo that reads React state lives here,
 * beside it.
 */

export function MinimalCollapsible() {
  return (
    <DemoStage>
      <Collapsible className="group">
        <CollapsibleTrigger>
          <span
            aria-hidden="true"
            className="inline-block transition-none group-data-[state=open]:rotate-90"
          >
            ▸
          </span>
          Advanced sharing
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <p className="border-l-2 border-border-muted pl-3 text-sm text-ink-muted">
            The panel stays mounted but hidden while closed — anything inside
            survives the flip, instantly, no animation.
          </p>
        </CollapsibleContent>
      </Collapsible>
    </DemoStage>
  );
}

export function ControlledCollapsible() {
  const [open, setOpen] = useState(true);
  return (
    <DemoStage>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center gap-3">
          <CollapsibleTrigger>
            <span
              aria-hidden="true"
              className="inline-block transition-none group-data-[state=open]:rotate-90"
            >
              ▸
            </span>
            Preferences
          </CollapsibleTrigger>
          <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
            {open ? "Collapse" : "Expand"}
          </Button>
          <span className="font-mono text-sm">state = {open ? "open" : "closed"}</span>
        </div>
        <CollapsibleContent className="mt-2">
          <Input
            defaultValue="typed here — survives collapsing"
            className="max-w-xs"
          />
        </CollapsibleContent>
      </Collapsible>
    </DemoStage>
  );
}
