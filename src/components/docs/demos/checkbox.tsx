"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui";

/**
 * Checkbox demos — imported by the doc panel (`page.mdx`). The complete
 * code for each demo lives in the fenced block under it on the page.
 * This file is a client component because one demo reads React state.
 */

export function CheckboxBasics() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Checkbox aria-label="Archive everything" />
      <label className="flex items-center gap-2 text-sm text-ink">
        <Checkbox defaultChecked /> Include hidden files
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <Checkbox disabled /> Scan network drives
      </label>
    </div>
  );
}

export function CheckboxControlled() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      <span className="font-mono text-sm">checked = {String(checked)}</span>
    </div>
  );
}

export function CheckboxMixed() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <label className="flex items-center gap-2 text-sm text-ink">
        <Checkbox indeterminate /> Mixed contents
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <Checkbox /> All contents
      </label>
    </div>
  );
}
