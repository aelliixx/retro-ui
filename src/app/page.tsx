"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Input,
  LoadingIcon,
  Progress,
  Select,
  Textarea,
  Tooltip,
} from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------- */
/* playground helpers                                                        */
/* ------------------------------------------------------------------------- */

function Section({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={
        "border-2 border-border-muted [border-style:groove] px-4 pb-4 pt-2 " +
        (className ?? "")
      }
    >
      <legend className="px-1.5 font-pixel text-[11px] uppercase text-ink">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

/** collapsed code disclosure — native <details>, no JS */
const DETAILS = [
  "w-full [&>summary]:w-fit [&>summary]:cursor-pointer [&>summary]:select-none [&>summary]:list-none",
  "[&>summary]:font-mono [&>summary]:text-[10px] [&>summary]:uppercase [&>summary]:tracking-[0.14em] [&>summary]:text-ink-muted [&>summary:hover]:text-ink",
  "[&>summary]:before:mr-1 [&>summary]:before:inline-block [&>summary]:before:content-['▸'] [&>summary]:before:text-ink [&[open]>summary]:before:rotate-90",
  "[&>summary::-webkit-details-marker]:hidden",
].join(" ");

const SNIPPET =
  "mt-1.5 w-full overflow-x-auto border border-ink bg-well p-2.5 font-mono text-[11px] leading-relaxed text-ink shadow-in";

function Cell({
  label,
  code,
  children,
  className,
}: {
  label: string;
  code?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {children}
      <span className="font-mono text-[11px] text-ink-muted">{label}</span>
      {code && (
        <details className={DETAILS}>
          <summary>code</summary>
          <pre className={SNIPPET}>
            <code>{code}</code>
          </pre>
        </details>
      )}
    </div>
  );
}

/** Decorative 90s window chrome — purely visual, hidden from a11y tree. */
function WindowButtons({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-1.5", className)}
    >
      <span className="flex h-4 w-4 items-end justify-center border border-ink bg-surface pb-0.5 shadow-out">
        <span className="h-0.5 w-1.5 bg-ink" />
      </span>
      <span className="flex h-4 w-4 items-center justify-center border border-ink bg-surface shadow-out">
        <span className="h-1.5 w-1.5 border border-ink" />
      </span>
      <span className="relative flex h-4 w-4 items-center justify-center border border-ink bg-surface shadow-out">
        <span className="absolute h-0.5 w-2 rotate-45 bg-ink" />
        <span className="absolute h-0.5 w-2 -rotate-45 bg-ink" />
      </span>
    </div>
  );
}

function CodeWell({ children }: { children: React.ReactNode }) {
  return (
    <Card variant="inset">
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-ink">
        <code>{children}</code>
      </pre>
    </Card>
  );
}

const PANE =
  "border border-ink bg-surface px-2 py-0.5 font-mono text-[11px] leading-none text-ink shadow-in";

const TOKENS = [
  "bg",
  "surface",
  "surface-2",
  "well",
  "ink",
  "ink-muted",
  "accent",
  "accent-soft",
  "danger",
  "tooltip",
] as const;

const TEXTURES = [
  { label: "bg-hatch", className: "bg-hatch" },
  { label: "bg-dither", className: "bg-dither" },
  { label: "bg-grid", className: "bg-grid" },
] as const;

/* ------------------------------------------------------------------------- */
/* sections                                                                  */
/* ------------------------------------------------------------------------- */

function Intro() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-pixel text-3xl">retro/ui</h1>
        <span className="border border-ink bg-accent-soft px-2 py-0.5 font-mono text-xs font-bold text-ink">
          v0.2.0
        </span>
      </div>
      <p className="max-w-prose text-ink-muted">
        A small React + Tailwind component library styled after 90s desktop
        UIs — carved group boxes, sunken input wells and hatched title bars
        — rebuilt with modern tokens, light/dark theming and full{" "}
        <code className="font-mono text-sm text-ink">className</code>{" "}
        composition via tailwind-merge. Every demo below ships a collapsed
        code snippet.
      </p>
      <CodeWell>{`import { Button, Card, Field, Input } from "@/components/ui";`}</CodeWell>
    </section>
  );
}

function ButtonsSection() {
  const [pressed, setPressed] = useState(false);

  return (
    <Section label="Button">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell label='variant="primary"' code={`<Button variant="primary">Save changes</Button>`}>
          <Button variant="primary">Save changes</Button>
        </Cell>
        <Cell label='variant="secondary" (default)' code={`<Button>Cancel</Button>`}>
          <Button>Cancel</Button>
        </Cell>
        <Cell label='variant="outline"' code={`<Button variant="outline">Browse files…</Button>`}>
          <Button variant="outline">Browse files…</Button>
        </Cell>
        <Cell label='variant="ghost"' code={`<Button variant="ghost">Skip for now</Button>`}>
          <Button variant="ghost">Skip for now</Button>
        </Cell>
        <Cell label='variant="destructive"' code={`<Button variant="destructive">Delete forever</Button>`}>
          <Button variant="destructive">Delete forever</Button>
        </Cell>
        <Cell label="disabled" code={`<Button disabled>Unavailable</Button>`}>
          <Button disabled>Unavailable</Button>
        </Cell>
        <Cell
          label="sizes: sm / md / lg"
          code={`<Button size="sm">Compact</Button>
<Button size="md">Default</Button>
<Button size="lg">Command</Button>`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Compact</Button>
            <Button size="md">Default</Button>
            <Button size="lg">Command</Button>
          </div>
        </Cell>
        <Cell
          label="data-pressed toggle (click me)"
          code={`<Button
  aria-pressed={pressed}
  data-pressed={pressed || undefined}
  onClick={() => setPressed((p) => !p)}
>
  {pressed ? "Caps lock: on" : "Caps lock: off"}
</Button>`}
        >
          <Button
            aria-pressed={pressed}
            data-pressed={pressed || undefined}
            onClick={() => setPressed((p) => !p)}
          >
            {pressed ? "Caps lock: on" : "Caps lock: off"}
          </Button>
        </Cell>
        <Cell
          label="composed via className"
          code={`<Button className="border-dashed text-accent shadow-none">
  Inline override
</Button>`}
        >
          <Button
            variant="secondary"
            className="border-dashed text-accent shadow-none"
          >
            Inline override
          </Button>
        </Cell>
      </div>
    </Section>
  );
}

function FieldsSection() {
  return (
    <Section label="Field · Input · Textarea">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2">
        <Cell
          label="hint + required wiring"
          code={`<Field
  label="Username"
  required
  hint="3–20 characters, letters and digits."
>
  <Input placeholder="ada_lovelace" />
</Field>`}
        >
          <Field
            label="Username"
            required
            hint="3–20 characters, letters and digits."
            className="w-full"
          >
            <Input placeholder="ada_lovelace" />
          </Field>
        </Cell>
        <Cell
          label="error replaces hint"
          code={`<Field
  label="Recovery email"
  error="That doesn't look like an email."
>
  <Input type="email" defaultValue="ada@lovel" />
</Field>`}
        >
          <Field
            label="Recovery email"
            error="That doesn't look like an email."
            className="w-full"
          >
            <Input type="email" defaultValue="ada@lovel" />
          </Field>
        </Cell>
        <Cell
          label="disabled"
          code={`<Field label="Machine name" hint="Shown on your local network.">
  <Input defaultValue="WIN98-WORKSTATION" disabled />
</Field>`}
        >
          <Field label="Machine name" hint="Shown on your local network." className="w-full">
            <Input defaultValue="WIN98-WORKSTATION" disabled />
          </Field>
        </Cell>
        <Cell
          label="password"
          code={`<Field label="Access key" hint="We never phone home.">
  <Input type="password" placeholder="••••••••" />
</Field>`}
        >
          <Field label="Access key" hint="We never phone home." className="w-full">
            <Input type="password" placeholder="••••••••" />
          </Field>
        </Cell>
        <Cell
          label="Textarea in a Field"
          code={`<Field label="Log entry" hint="Lines wrap automatically.">
  <Textarea placeholder="# /var/log/syslog" />
</Field>`}
        >
          <Field
            label="Log entry"
            hint="Lines wrap automatically."
            className="w-full"
          >
            <Textarea placeholder="# /var/log/syslog" />
          </Field>
        </Cell>
        <Cell
          label="bare Textarea"
          code={`<Textarea
  rows={2}
  placeholder="Tell us what happened… (no Field wrapper)"
/>`}
        >
          <Textarea rows={2} placeholder="Tell us what happened…" />
        </Cell>

        {/* composition demo: Card + Field + Input + Button */}
        <div className="sm:col-span-2">
          <Cell
            label="composition: Card + Field + Input + Button"
            code={`<Card className="max-w-md">
  <CardHeader variant="titlebar">
    <CardTitle>Sign in</CardTitle>
  </CardHeader>
  <CardContent className="flex flex-col gap-4">
    <Field label="Username" required>
      <Input placeholder="ada_lovelace" />
    </Field>
    <Field label="Password" required>
      <Input type="password" placeholder="••••••••" />
    </Field>
    <Button variant="primary" className="mt-1 w-full">
      Sign in
    </Button>
  </CardContent>
</Card>`}
          >
            <Card className="max-w-md">
              <CardHeader variant="titlebar">
                <CardTitle>Sign in</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field label="Username" required>
                  <Input placeholder="ada_lovelace" autoComplete="username" />
                </Field>
                <Field label="Password" required>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </Field>
                <Button variant="primary" className="mt-1 w-full">
                  Sign in
                </Button>
              </CardContent>
            </Card>
          </Cell>
        </div>
      </div>
    </Section>
  );
}

function CheckboxSection() {
  const [checked, setChecked] = useState(false);

  return (
    <Section label="Checkbox">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="checked by default (label-wrapped)"
          code={`<label className="flex cursor-pointer items-center gap-2 text-sm">
  <Checkbox defaultChecked />
  Enable Turbo mode
</label>`}
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Enable Turbo mode
          </label>
        </Cell>
        <Cell
          label="controlled + onCheckedChange"
          code={`const [checked, setChecked] = useState(false);

<label className="flex cursor-pointer items-center gap-2 text-sm">
  <Checkbox checked={checked} onCheckedChange={setChecked} />
  Turbo: {checked ? "on" : "off"}
</label>`}
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={checked} onCheckedChange={setChecked} />
            Turbo: {checked ? "on" : "off"}
          </label>
        </Cell>
        <Cell
          label="indeterminate (tri-state)"
          code={`<label className="flex cursor-pointer items-center gap-2 text-sm">
  <Checkbox indeterminate />
  Select all (mixed)
</label>`}
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox indeterminate />
            Select all (mixed)
          </label>
        </Cell>
        <Cell
          label="disabled"
          code={`<label className="flex items-center gap-2 text-sm text-ink-muted">
  <Checkbox disabled defaultChecked />
  Read-only option
</label>`}
        >
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <Checkbox disabled defaultChecked />
            Read-only option
          </label>
        </Cell>
      </div>
    </Section>
  );
}

function SelectSection() {
  return (
    <Section label="Select">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="bare select"
          code={`<Select defaultValue="1024x768">
  <option value="640x480">640 × 480</option>
  <option value="800x600">800 × 600</option>
  <option value="1024x768">1024 × 768</option>
</Select>`}
        >
          <Select defaultValue="1024x768" aria-label="Screen resolution">
            <option value="640x480">640 × 480</option>
            <option value="800x600">800 × 600</option>
            <option value="1024x768">1024 × 768</option>
          </Select>
        </Cell>
        <Cell
          label="Field-wrapped (a11y wired)"
          code={`<Field label="Resolution" hint="Applies after reboot.">
  <Select defaultValue="1024x768">
    <option value="640x480">640 × 480</option>
    <option value="1024x768">1024 × 768</option>
    <option value="1280x1024">1280 × 1024</option>
  </Select>
</Field>`}
        >
          <Field label="Resolution" hint="Applies after reboot." className="w-full">
            <Select defaultValue="1024x768">
              <option value="640x480">640 × 480</option>
              <option value="1024x768">1024 × 768</option>
              <option value="1280x1024">1280 × 1024</option>
            </Select>
          </Field>
        </Cell>
        <Cell
          label="disabled"
          code={`<Select disabled defaultValue="win98">
  <option value="win98">Windows 98 (optimized)</option>
  <option value="win95">Windows 95 (compat.)</option>
</Select>`}
        >
          <Select disabled defaultValue="win98" aria-label="Compatibility mode">
            <option value="win98">Windows 98 (optimized)</option>
            <option value="win95">Windows 95 (compat.)</option>
          </Select>
        </Cell>
        <Cell
          label="compact (h-8 override)"
          code={`<Select className="h-8 w-64" defaultValue="defrag">
  <option value="defrag">Defragment (Quick)</option>
  <option value="full">Defragment (Full)</option>
</Select>`}
        >
          <Select className="h-8 w-64" defaultValue="defrag" aria-label="Disk task">
            <option value="defrag">Defragment (Quick)</option>
            <option value="full">Defragment (Full)</option>
          </Select>
        </Cell>
      </div>
    </Section>
  );
}

/** live file-copy demo: auto-ticks, Pause/Resume, completion beat at 100% */
function CopyJobDemo() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setValue((v) => (v === 100 ? 0 : Math.min(100, v + 4)));
    }, 600);
    return () => clearInterval(id);
  }, [running]);

  return (
    <Card variant="flat" className="w-full max-w-sm">
      <CardContent className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between font-mono text-xs text-ink">
          <span>Copying file_8899.wav</span>
          <LoadingIcon label={null} className="size-3.5" />
        </div>
        <Progress value={value} aria-label="Copy progress" />
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? "Pause" : "Resume"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function IndicatorsSection() {
  return (
    <Section label="Progress · Loading">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell label="value = 64" code={`<Progress value={64} />`}>
          <Progress value={64} className="w-full" aria-label="Install progress" />
        </Cell>
        <Cell
          label="complete state"
          code={`<Progress value={100} />  {/* data-state="complete" */}`}
        >
          <Progress value={100} className="w-full" aria-label="Finished" />
        </Cell>
        <Cell
          label="live copy job (pausable)"
          code={`function CopyJobDemo() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setValue((v) => (v === 100 ? 0 : Math.min(100, v + 4)));
    }, 600);
    return () => clearInterval(id);
  }, [running]);

  return (
    <Progress value={value} />
  );
}`}
        >
          <CopyJobDemo />
        </Cell>
        <Cell
          label="sizes"
          code={`<LoadingIcon className="size-3" />
<LoadingIcon />                    {/* default: size-4 */}
<LoadingIcon className="size-6" />`}
        >
          <div className="flex items-center gap-4">
            <LoadingIcon className="size-3" label={null} />
            <LoadingIcon label={null} />
            <LoadingIcon className="size-6" label={null} />
          </div>
        </Cell>
        <Cell
          label="in a busy Button"
          code={`<Button size="sm" disabled>
  <LoadingIcon label={null} className="size-3.5" />
  Copying…
</Button>`}
        >
          <Button size="sm" disabled>
            <LoadingIcon label={null} className="size-3.5" />
            Copying…
          </Button>
        </Cell>
      </div>
    </Section>
  );
}

function CardsSection() {
  return (
    <Section label="Card">
      <div className="grid gap-6 pt-2 sm:grid-cols-2">
        <Cell
          label="default (raised) with header + footer"
          code={`<Card>
  <CardHeader>
    <CardTitle>Display properties</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>
      Standard raised card: hairline chrome, carved
      two-tone bevel, header and footer rails.
    </CardDescription>
  </CardContent>
  <CardFooter className="justify-end">
    <Button size="sm" variant="ghost">Discard</Button>
    <Button size="sm" variant="primary">Apply</Button>
  </CardFooter>
</Card>`}
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Display properties</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Standard raised card: hairline chrome, carved two-tone bevel,
                header and footer rails.
              </CardDescription>
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm" variant="ghost">
                Discard
              </Button>
              <Button size="sm" variant="primary">
                Apply
              </Button>
            </CardFooter>
          </Card>
        </Cell>
        <Cell
          label="titlebar header (hatch + small caps)"
          code={`<Card>
  <CardHeader variant="titlebar">
    <CardTitle>C:\\SYSTEM\\README.TXT</CardTitle>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>`}
        >
          <Card className="w-full">
            <CardHeader variant="titlebar">
              <CardTitle>C:\SYSTEM\README.TXT</CardTitle>
              <WindowButtons />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink-muted">
                The titlebar header is the signature move — hatched
                background, small caps title, and room for
                beveled window chrome.
              </p>
            </CardContent>
          </Card>
        </Cell>
        <Cell
          label='variant="flat"'
          code={`<Card variant="flat"><CardContent>…</CardContent></Card>`}
        >
          <Card variant="flat" className="w-full">
            <CardContent>
              <p className="text-sm text-ink-muted">
                Flat variant: same border and surface, no carve. Good inside
                dense layouts.
              </p>
            </CardContent>
          </Card>
        </Cell>
        <Cell
          label='variant="inset" (well)'
          code={`<Card variant="inset"><CardContent>…</CardContent></Card>`}
        >
          <Card variant="inset" className="w-full">
            <CardContent>
              <p className="font-mono text-sm text-ink">
                Sunken wells hold content the way text inputs do — carved
                inward, muted surface.
              </p>
            </CardContent>
          </Card>
        </Cell>
      </div>
    </Section>
  );
}

function TooltipSection() {
  return (
    <Section label="Tooltip">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label='side="top" (default)'
          code={`<Tooltip content="Saves the file to C:\\ARCHIVE">
  <Button variant="outline">Archive</Button>
</Tooltip>`}
        >
          <Tooltip content="Saves the file to C:\ARCHIVE">
            <Button variant="outline">Archive</Button>
          </Tooltip>
        </Cell>
        <Cell
          label='side="bottom"'
          code={`<Tooltip
  content="Places file into C:\\ARCHIVE"
  side="bottom"
>
  <Button variant="outline">Hover: below</Button>
</Tooltip>`}
        >
          <Tooltip content="Places file into C:\ARCHIVE" side="bottom">
            <Button variant="outline">Hover: below</Button>
          </Tooltip>
        </Cell>
        <Cell
          label="keyboard shortcut bubble"
          code={`<Tooltip content="Save document">
  <button
    type="button"
    className="border border-ink bg-well px-2 py-1
               text-xs font-mono shadow-in"
  >
    Ctrl+S
  </button>
</Tooltip>`}
        >
          <Tooltip content="Save document">
            <button
              type="button"
              className="border border-ink bg-well px-2 py-1 font-mono text-xs shadow-in focus-etched"
            >
              Ctrl+S
            </button>
          </Tooltip>
        </Cell>
      </div>
    </Section>
  );
}

function TokensSection() {
  return (
    <Section label="Design tokens">
      <p className="max-w-prose pt-2 text-sm text-ink-muted">
        Every color is a CSS variable — override{" "}
        <code className="font-mono text-ink">:root</code> /{" "}
        <code className="font-mono text-ink">.dark</code> in{" "}
        <code className="font-mono text-ink">globals.css</code> to re-brand the
        entire library. Components also merge your{" "}
        <code className="font-mono text-ink">className</code>, so any Tailwind
        utility wins over the defaults.
      </p>

      <div className="grid grid-cols-3 gap-4 pt-4 sm:grid-cols-5">
        {TOKENS.map((token) => (
          <div key={token} className="flex flex-col gap-1.5">
            <div
              className="h-12 w-full border border-ink"
              style={{ backgroundColor: `var(--${token})` }}
            />
            <span className="font-mono text-[11px] text-ink-muted">
              --{token}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 sm:max-w-sm">
        {TEXTURES.map((texture) => (
          <div key={texture.label} className="flex flex-col gap-1.5">
            <div
              className={cn("h-12 w-full border border-ink", texture.className)}
            />
            <span className="font-mono text-[11px] text-ink-muted">
              {texture.label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------- */
/* page                                                                      */
/* ------------------------------------------------------------------------- */

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-desktop bg-dither p-4 sm:p-8 lg:p-12">
      <main className="mx-auto w-full max-w-4xl">
        <Card>
          <CardHeader
            variant="titlebar"
            className="flex-wrap justify-between gap-2"
          >
            <CardTitle className="min-w-0 truncate">
              retro/ui — component playground
            </CardTitle>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <WindowButtons className="hidden sm:flex" />
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-10 p-4 sm:p-6">
            <Intro />
            <ButtonsSection />
            <FieldsSection />
            <CheckboxSection />
            <SelectSection />
            <IndicatorsSection />
            <CardsSection />
            <TooltipSection />
            <TokensSection />
          </CardContent>

          <CardFooter className="gap-1 border-0 bg-surface px-1.5 py-1.5">
            <span className={PANE}>Ready — 10 components</span>
            <span aria-hidden="true" className={cn(PANE, "flex-1")} />
            <span className={cn(PANE, "hidden sm:block")}>
              tokens: light / dark
            </span>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
