"use client";

import { useState } from "react";

import { Toggle } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Toggle demos — the live demos on this page. The page itself is a
 * server component, so a demo that reads React state lives here,
 * beside it.
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
