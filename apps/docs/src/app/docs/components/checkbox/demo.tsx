"use client";

import { useState } from "react";

import { Checkbox } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Checkbox demos — the live demos on this page. The page itself is a
 * server component, so a demo that reads React state lives here,
 * beside it.
 */

export function CheckboxBasics() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-6">
        <Checkbox aria-label="Archive everything" />
        <label className="flex items-center gap-2 text-sm text-ink">
          <Checkbox defaultChecked /> Include hidden files
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <Checkbox disabled /> Scan network drives
        </label>
      </div>
    </DemoStage>
  );
}

export function CheckboxControlled() {
  const [checked, setChecked] = useState(true);
  return (
    <DemoStage>
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        <span className="font-mono text-sm">checked = {String(checked)}</span>
      </div>
    </DemoStage>
  );
}

export function CheckboxMixed() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <Checkbox indeterminate /> Mixed contents
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <Checkbox /> All contents
        </label>
      </div>
    </DemoStage>
  );
}
