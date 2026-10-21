"use client";

import { useState } from "react";

import {
  Button,
  ToastProvider,
  useToast,
  type ToastPosition,
} from "@retro-ui/ui";

import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Toast demos — the live demos on this page. The page itself is a
 * server component, so a demo that reads React state lives here,
 * beside it.
 */

export function ToastDemo() {
  return (
    <DemoStage>
      <ToastProvider>
        <ToastTriggers />
      </ToastProvider>
    </DemoStage>
  );
}

function ToastTriggers() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        size="sm"
        onClick={() => toast.info("Saved", "Your document is on the disk.")}
      >
        Info
      </Button>
      <Button
        size="sm"
        onClick={() => toast.success("Copy complete", "3 files written to C:\\TEMP.")}
      >
        Success
      </Button>
      <Button
        size="sm"
        onClick={() => toast.error("Merge conflict", "Resolve it by hand.")}
      >
        Error
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast.push({
            title: "Working offline",
            description: "Reconnect to sync.",
            duration: 0,
          })
        }
      >
        Sticky
      </Button>
    </div>
  );
}

const POSITIONS: ToastPosition[] = [
  "bottom-left",
  "bottom-right",
  "top-left",
  "top-right",
  "top-center",
  "bottom-center",
];

export function ToastPositions() {
  const [position, setPosition] = useState<ToastPosition>("bottom-left");

  return (
    <DemoStage>
      <ToastProvider position={position}>
        <PositionTriggers position={position} onPick={setPosition} />
      </ToastProvider>
    </DemoStage>
  );
}

function PositionTriggers({
  position,
  onPick,
}: {
  position: ToastPosition;
  onPick: (next: ToastPosition) => void;
}) {
  const toast = useToast();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {POSITIONS.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={option === position ? "primary" : "outline"}
          onClick={() => {
            onPick(option);
            toast.info("Placed here", `The stack is pinned ${option}.`, {
              duration: 0,
            });
          }}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

export function ToastIconAndTone() {
  return (
    <DemoStage>
      {/* its own corner, so this stack never lands on the demo above */}
      <ToastProvider position="bottom-right">
        <IconTriggers />
      </ToastProvider>
    </DemoStage>
  );
}

function IconTriggers() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        size="sm"
        onClick={() =>
          toast.push({
            title: "Saved to disk",
            description: "C:\\TEMP\\notes.txt",
            icon: <span aria-hidden="true">★</span>,
          })
        }
      >
        Custom icon
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toast.push({
            title: "Paused",
            description: "Nothing is syncing right now.",
            tone: "neutral",
            duration: 0,
          })
        }
      >
        Neutral tone
      </Button>
    </div>
  );
}
