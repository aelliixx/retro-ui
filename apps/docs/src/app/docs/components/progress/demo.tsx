"use client";

import { useState } from "react";

import { Progress, Slider } from "@retroui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Progress demos — the live demos on this page. The page itself is a
 * server component, so a demo that reads React state lives here,
 * beside it.
 */

export function ProgressStates() {
  return (
    <DemoStage>
      <div className="flex w-64 flex-col gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Progress value={25} className="flex-1" aria-label="Copy progress" />
          <span aria-hidden="true">25%</span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={62} className="flex-1" aria-label="Copy progress" />
          <span aria-hidden="true">62%</span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={100} className="flex-1" aria-label="Copy progress" />
          <span aria-hidden="true">100%</span>
        </div>
      </div>
    </DemoStage>
  );
}

export function SliderWiredProgress() {
  const [value, setValue] = useState(40);
  return (
    <DemoStage>
      <div className="flex w-64 flex-col gap-3">
        <Progress value={value} aria-label="Copy progress" />
        <div className="flex items-center gap-2 text-sm text-ink">
          <Slider
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            aria-label="Adjust the meter"
          />
          <span className="font-mono text-xs">{value}%</span>
        </div>
      </div>
    </DemoStage>
  );
}
