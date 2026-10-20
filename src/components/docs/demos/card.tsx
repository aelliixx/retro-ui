import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

/**
 * Card demo components — imported by the doc panel (`page.mdx`).
 * The complete code for each demo lives in the fenced block under it.
 */

export function WindowCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader variant="titlebar">
        <CardTitle>readme.txt — Notepad</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p>
          A window is a card that grew up: hatched title bar, hairline
          chrome, and a status footer for the little truths.
        </p>
      </CardContent>
      <CardFooter>
        <span className="mr-auto text-sm text-ink-muted">1 file, 412 bytes</span>
        <Button size="sm">Close</Button>
      </CardFooter>
    </Card>
  );
}

export function CardVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-56" variant="raised">
        <CardHeader>
          <CardTitle>Raised</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ink-muted">
          The default — a window on the desk.
        </CardContent>
      </Card>
      <Card className="w-56" variant="flat">
        <CardHeader>
          <CardTitle>Flat</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ink-muted">
          Same box, printed on the surface.
        </CardContent>
      </Card>
      <Card className="w-56" variant="inset">
        <CardHeader>
          <CardTitle>Inset</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-ink-muted">
          A sunken well, like a code pane.
        </CardContent>
      </Card>
    </div>
  );
}
