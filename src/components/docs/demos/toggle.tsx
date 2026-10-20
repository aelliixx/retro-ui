"use client";

import { useState } from "react";

import { Toggle } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Toggle demos — imported by the doc panel (`page.mdx`). Client
 * component: the second demo reads state.
 */

export function ToggleStates() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle>Bold</Toggle>
        <Toggle defaultPressed>Italic</Toggle>
        <Toggle disabled>Underline</Toggle>
      </div>
    </DemoStage>
  );
}

export function ControlledToggle() {
  const [on, setOn] = useState(false);
  return (
    <DemoStage>
      <div className="flex items-center gap-3">
        <Toggle pressed={on} onPressedChange={setOn}>
          Caps lock
        </Toggle>
        <span className="font-mono text-sm">pressed = {String(on)}</span>
      </div>
    </DemoStage>
  );
}
