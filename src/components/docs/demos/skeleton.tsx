"use client";

import { useState } from "react";

import { Button, Skeleton, Switch } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Skeleton demos — imported by the doc panel (`page.mdx`). Client
 * component: the second demo toggles the shell.
 */

export function SkeletonTiles() {
  return (
    <DemoStage>
      <div className="flex w-72 gap-3">
        <Skeleton className="size-10 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </DemoStage>
  );
}

export function SkeletonContent() {
  const [loading, setLoading] = useState(true);
  return (
    <DemoStage>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton loading={loading} className="rounded-none">
            <Switch defaultChecked />
          </Skeleton>
          <span className="text-sm text-ink">AutoSave</span>
        </div>
        <Button size="sm" onClick={() => setLoading(!loading)}>
          {loading ? "Reveal" : "Re-paint the shell"}
        </Button>
      </div>
    </DemoStage>
  );
}
