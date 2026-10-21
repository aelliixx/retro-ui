"use client";

import { useState } from "react";

import { Button, Dialog } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Dialog demos — imported by the doc panel (`page.mdx`). Client
 * component: open state lives in the demo.
 */

export function InfoDialog() {
  const [open, setOpen] = useState(false);
  return (
    <DemoStage>
      <>
        <Button onClick={() => setOpen(true)}>Run defrag</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Defragment C:"
          actions={
            <Button variant="primary" onClick={() => setOpen(false)}>
              OK
            </Button>
          }
        >
          Are you sure you want to defragment drive C: now?
        </Dialog>
      </>
    </DemoStage>
  );
}

export function ErrorDialog() {
  const [open, setOpen] = useState(false);
  return (
    <DemoStage>
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Format disk
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          variant="error"
          title="Format C:"
          actions={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Format
              </Button>
            </>
          }
        >
          Formatting will erase all data on the disk. Continue?
        </Dialog>
      </>
    </DemoStage>
  );
}
