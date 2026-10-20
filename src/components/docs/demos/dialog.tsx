"use client";

import { useState } from "react";

import { Button, Dialog } from "@/components/ui";

/**
 * Dialog demos — imported by the doc panel (`page.mdx`). Client
 * component: open state lives in the demo.
 */

export function InfoDialog() {
  const [open, setOpen] = useState(false);
  return (
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
  );
}

export function ErrorDialog() {
  const [open, setOpen] = useState(false);
  return (
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
  );
}
