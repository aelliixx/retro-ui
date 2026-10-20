import { AspectRatio } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * A wallpaper tile drawn inline as a data URI so the demo needs no network.
 */
const DEMO_TILE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 533 300' preserveAspectRatio='xMidYMid slice'%3E%3Crect width='533' height='300' fill='%23008080'/%3E%3Crect x='36' y='36' width='221' height='112' fill='%23fcfdff' stroke='%23171a20'/%3E%3Ccircle cx='400' cy='150' r='64' fill='%23f5c542' stroke='%23171a20'/%3E%3Ccircle cx='378' cy='132' r='7' fill='%23171a20'/%3E%3Ccircle cx='422' cy='132' r='7' fill='%23171a20'/%3E%3Cpath d='M372 172 q28 22 56 0' stroke='%23171a20' stroke-width='5' fill='none'/%3E%3C/svg%3E";

/**
 * AspectRatio demos — imported by the doc panel (`page.mdx`). The complete
 * code for each demo lives in the fenced block under it on the page.
 */

export function AspectRatioDefault() {
  return (
    <DemoStage>
      <AspectRatio className="w-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEMO_TILE_SRC} alt="Teal wallpaper with a smiley sun" />
      </AspectRatio>
    </DemoStage>
  );
}

export function AspectRatioWide() {
  return (
    <DemoStage>
      <AspectRatio className="w-64" ratio={16 / 9}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEMO_TILE_SRC} alt="Teal wallpaper with a smiley sun" />
      </AspectRatio>
    </DemoStage>
  );
}

export function AspectRatioSquare() {
  return (
    <DemoStage>
      <AspectRatio className="w-24" ratio={1 / 1}>
        <div className="flex h-full w-full items-center justify-center font-pixel text-sm text-ink-muted">
          1 : 1
        </div>
      </AspectRatio>
    </DemoStage>
  );
}
