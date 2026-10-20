"use client";

import { Button, ToastProvider, useToast } from "@/components/ui";

/**
 * Toast demos — imported by the doc panel (`page.mdx`). Client
 * component: the demo pushes through `useToast()`.
 *
 * The provider is mounted right in the demo so the panel is
 * self-contained; in an application it lives once near the root.
 */

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastTriggers />
    </ToastProvider>
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
