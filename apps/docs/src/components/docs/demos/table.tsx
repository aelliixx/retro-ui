import {
  ScrollArea,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Table demos — imported by the doc panel (`page.mdx`).
 */

const FILE_ROWS = [
  { name: "document.txt", size: "12 KB", modified: "yesterday" },
  { name: "budget.csv", size: "4 KB", modified: "last week" },
  { name: "wallpaper.png", size: "82 KB", modified: "a while ago" },
  { name: "autoexec.bat", size: "1 KB", modified: "years ago" },
];

export function FilesTable() {
  return (
    <DemoStage>
      <ScrollArea className="max-w-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-end">Size</TableHead>
              <TableHead className="text-end">Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FILE_ROWS.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-end">{row.size}</TableCell>
                <TableCell className="text-end">{row.modified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>4 objects</TableCell>
              <TableCell className="text-end">99 KB</TableCell>
            </TableRow>
          </TableFooter>
          <TableCaption>Everything you need is already on disk.</TableCaption>
        </Table>
      </ScrollArea>
    </DemoStage>
  );
}

export function RowHeadTable() {
  return (
    <DemoStage>
      <Table className="max-w-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Setting</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableHead scope="row">Protocol</TableHead>
            <TableCell>TCP/IP via modem</TableCell>
          </TableRow>
          <TableRow>
            <TableHead scope="row">Speed</TableHead>
            <TableCell>33.6 kbit/s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DemoStage>
  );
}
