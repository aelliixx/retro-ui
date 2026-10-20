import { ScrollArea } from "@/components/ui";

/**
 * ScrollArea demos — imported by the doc panel (`page.mdx`).
 */

const FILES = [
  "about the archive.txt",
  "boot-disk-notes.txt",
  "dialup handshakes (2).txt",
  "em dash or hyphen.txt",
  "floppy copy log.txt",
  "gamma table tuning.txt",
  "hi-score dump.txt",
  "interrupt vectors.txt",
  "kerning samples.txt",
  "longest filename so far.txt",
  "modem init strings.txt",
  "naming conventions (draft 7).txt",
  "palette swap matrix.txt",
  "quarter resolution test.txt",
  "raster lines.txt",
  "scanline flicker.txt",
  "terminator glyphs.txt",
  "undo history.txt",
  "vertical blanking.txt",
  "window chrome.txt",
  "x in the corner.txt",
  "yo-dawg recycling.txt",
  "z-buffer proposals.txt",
];

export function ArchivePane() {
  return (
    <ScrollArea label="Archive notes" className="h-40 max-w-sm">
      <ul className="flex flex-col gap-1.5 text-sm text-ink">
        {FILES.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export function WidePane() {
  return (
    <ScrollArea className="h-24 max-w-sm">
      <pre className="w-[560px] font-mono text-xs text-ink">
        0x00B0: EB 3C 90 49 42 4D 20 33 2E 33 00 02 02 00 00 00
      </pre>
    </ScrollArea>
  );
}
