"use client";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  Field,
  Input,
  LoadingIcon,
  Menu,
  MenuBar,
  MenuItem,
  MenuSeparator,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  PasswordToggleField,
  Progress,
  Radio,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  ToastProvider,
  Tooltip,
  useToast,
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
          v0.3.0
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

function RadioGroupSection() {
  const [picked, setPicked] = useState("100");

  return (
    <Section label="RadioGroup">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2">
        <Cell
          label="uncontrolled + disabled member"
          code={`<RadioGroup label="Scaling" defaultValue="100">
  <Radio value="100">100% (small fonts)</Radio>
  <Radio value="125">125%</Radio>
  <Radio value="150" disabled>150% (needs sign-out)</Radio>
</RadioGroup>`}
        >
          <RadioGroup label="Scaling" defaultValue="100">
            <Radio value="100">100% (small fonts)</Radio>
            <Radio value="125">125%</Radio>
            <Radio value="150" disabled>150% (needs sign-out)</Radio>
          </RadioGroup>
        </Cell>
        <Cell
          label="controlled + onValueChange"
          code={`const [picked, setPicked] = useState("crt");

<RadioGroup
  label="Defrag mode"
  value={picked}
  onValueChange={setPicked}
>
  <Radio value="crt">CRT-friendly (interleaved)</Radio>
  <Radio value="fast">Optimize for speed</Radio>
  <Radio value="full">Full optimization</Radio>
</RadioGroup>
<span>{picked}</span>`}
        >
          <div className="flex flex-col items-start gap-2">
            <RadioGroup
              label="Defrag mode"
              value={picked}
              onValueChange={setPicked}
            >
              <Radio value="crt">CRT-friendly (interleaved)</Radio>
              <Radio value="fast">Optimize for speed</Radio>
              <Radio value="full">Full optimization</Radio>
            </RadioGroup>
            <span className="font-mono text-[11px] text-ink-muted">
              picked: {picked}
            </span>
          </div>
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

function DialogSection() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <Section label="Dialog">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2">
        <Cell
          label='variant="info" (controlled)'
          code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>About…</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  variant="info"
  title="About retro/ui"
  actions={<Button variant="primary" onClick={() => setOpen(false)}>OK</Button>}
>
  16 components, tokens for light and dark,
  and bevels all the way down.
</Dialog>`}
        >
          <Dialog
            open={infoOpen}
            onOpenChange={setInfoOpen}
            variant="info"
            title="About retro/ui"
            actions={
              <Button
                variant="primary"
                onClick={() => setInfoOpen(false)}
              >
                OK
              </Button>
            }
          >
            16 components, tokens for light and dark, and bevels all the way
            down.
          </Dialog>
          <Button variant="secondary" onClick={() => setInfoOpen(true)}>
            About…
          </Button>
        </Cell>
        <Cell
          label='variant="error" + destructive action'
          code={`const [open, setOpen] = useState(false);

<Button variant="outline" onClick={() => setOpen(true)}>
  Empty recycle bin…
</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  variant="error"
  title="Empty C:\\RECYCLED?"
  actions={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={() => setOpen(false)}>
      Empty bin
    </Button>
  </>}
>
  This removes 1,337 files. They do not go to
  a safe place. They simply stop existing.
</Dialog>`}
        >
          <Dialog
            open={errorOpen}
            onOpenChange={setErrorOpen}
            variant="error"
            title="Empty C:\\RECYCLED?"
            actions={
              <>
                <Button
                  variant="ghost"
                  onClick={() => setErrorOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setErrorOpen(false)}
                >
                  Empty bin
                </Button>
              </>
            }
          >
            This removes 1,337 files. They do not go to a safe place. They
            simply stop existing.
          </Dialog>
          <Button variant="outline" onClick={() => setErrorOpen(true)}>
            Empty recycle bin…
          </Button>
        </Cell>
      </div>
    </Section>
  );
}

function AccordionSection() {
  return (
    <Section label="Accordion">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2">
        <Cell
          label="items stay open independently"
          code={`<Accordion className="w-full max-w-sm">
  <AccordionItem open>
    <AccordionTrigger>Getting started</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>Theming</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>`}
        >
          <Accordion className="w-full max-w-sm">
            <AccordionItem open>
              <AccordionTrigger>Getting started</AccordionTrigger>
              <AccordionContent>
                Every component is a plain file in
                {" "}
                <code className="font-mono">src/components/ui</code> — import
                from the barrel and pass <code className="font-mono">className</code>{" "}
                for overrides.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>Theming</AccordionTrigger>
              <AccordionContent>
                Tokens live in <code className="font-mono">globals.css</code>;
                override <code className="font-mono">:root</code> /{" "}
                <code className="font-mono">.dark</code> to re-brand everything,
                bevel tokens included.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>Keyboard &amp; focus</AccordionTrigger>
              <AccordionContent>
                Items are native <code className="font-mono">details</code>{" "}
                elements — Tab reaches the trigger, Enter toggles, and the
                dotted focus rectangle is drawn inside the row.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Cell>
      </div>
    </Section>
  );
}

/** smiley tile drawn inline so the demo needs no network */
const DEMO_AVATAR_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23008080'/%3E%3Ccircle cx='16' cy='13' r='3.5' fill='%23fcfdff'/%3E%3Cpath d='M9 20 Q16 27 23 20' stroke='%23fcfdff' stroke-width='2.5' fill='none'/%3E%3C/svg%3E";

function AvatarSection() {
  return (
    <Section label="Avatar">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="sizes + default initials"
          code={`<Avatar size="sm" name="Ada Lovelace" />
<Avatar size="md" name="Ada Lovelace" />
<Avatar size="lg" name="Ada Lovelace" />
{/* fallback initials derived from name */}`}
        >
          <div className="flex items-end gap-4">
            <Avatar size="sm" name="Ada Lovelace" />
            <Avatar size="md" name="Ada Lovelace" />
            <Avatar size="lg" name="Ada Lovelace" />
          </div>
        </Cell>
        <Cell
          label="presence pip"
          code={`<Avatar name="Ada Lovelace" status="online" />   {/* teal */}
<Avatar name="Ada Lovelace" status="away" />     {/* selection */}
<Avatar name="Ada Lovelace" status="busy" />     {/* danger */}
<Avatar name="Ada Lovelace" status="offline" />  {/* muted */}`}
        >
          <div className="flex items-end gap-4">
            <Avatar name="Ada Lovelace" status="online" />
            <Avatar name="Ada Lovelace" status="away" />
            <Avatar name="Ada Lovelace" status="busy" />
            <Avatar name="Ada Lovelace" status="offline" />
          </div>
        </Cell>
        <Cell
          label="image + broken-url fallback"
          code={`<Avatar name="Ada Lovelace" src={demoImage} />
<Avatar name="Ada Lovelace" src="/missing.png" />  {/* initials */}
<Avatar name="Ada Lovelace" fallback="★" />        {/* custom node */}`}
        >
          <div className="flex items-end gap-4">
            <Avatar name="Ada Lovelace" src={DEMO_AVATAR_SRC} />
            <Avatar name="Ada Lovelace" src="/missing.png" />
            <Avatar name="Ada Lovelace" fallback="★" />
          </div>
        </Cell>
      </div>
    </Section>
  );
}

function MenuBarSection() {
  return (
    <Section label="MenuBar">
      <div className="grid gap-6 pt-2">
        <Cell
          label="hover or focus opens; shortcut + separator + disabled item"
          code={`<MenuBar label="Main menu">
  <Menu label="File">
    <MenuItem shortcut="Ctrl+N">New</MenuItem>
    <MenuItem shortcut="Ctrl+O">Open…</MenuItem>
    <MenuSeparator />
    <MenuItem disabled>Print…</MenuItem>
  </Menu>
  <Menu label="Edit">
    <MenuItem shortcut="Ctrl+Z">Undo</MenuItem>
    <MenuItem shortcut="Ctrl+C">Copy</MenuItem>
  </Menu>
  <Menu label="Help" align="end">
    <MenuItem>About retro/ui</MenuItem>
  </Menu>
</MenuBar>`}
        >
          <MenuBar label="Main menu" className="w-full max-w-sm">
            <Menu label="File">
              <MenuItem shortcut="Ctrl+N">New</MenuItem>
              <MenuItem shortcut="Ctrl+O">Open…</MenuItem>
              <MenuSeparator />
              <MenuItem shortcut="Ctrl+S">Save</MenuItem>
              <MenuSeparator />
              <MenuItem disabled>Print…</MenuItem>
            </Menu>
            <Menu label="Edit">
              <MenuItem shortcut="Ctrl+Z">Undo</MenuItem>
              <MenuItem shortcut="Ctrl+C">Copy</MenuItem>
              <MenuSeparator />
              <MenuItem shortcut="Ctrl+V">Paste</MenuItem>
            </Menu>
            <Menu label="Help" align="end" className="ml-auto">
              <MenuItem>About retro/ui</MenuItem>
            </Menu>
          </MenuBar>
        </Cell>
      </div>
    </Section>
  );
}

function NavigationMenuSection() {
  return (
    <Section label="NavigationMenu">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          className="sm:col-span-2"
          label="inline links + hover/click panels; Escape returns focus; active page marked"
          code={`<NavigationMenu label="Main">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink active href="#">
        Desktop
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Library</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="#docs">
          <span className="font-bold">Docs</span>
          <span className="block text-xs text-ink-muted">
            API reference for every primitive
          </span>
        </NavigationMenuLink>
        <NavigationMenuLink href="#tokens">
          <span className="font-bold">Tokens</span>
          <span className="block text-xs text-ink-muted">
            Rebrand from one CSS variable sheet
          </span>
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
        >
          <NavigationMenu label="Main">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink active href="#">
                  Desktop
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Library</NavigationMenuTrigger>
                <NavigationMenuContent className="w-72">
                  <div className="grid gap-0.5">
                    <NavigationMenuLink href="#docs">
                      <span className="font-bold">Docs</span>
                      <span className="block text-xs text-ink-muted">
                        API reference for every primitive
                      </span>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#tokens">
                      <span className="font-bold">Tokens</span>
                      <span className="block text-xs text-ink-muted">
                        Rebrand from one CSS variable sheet
                      </span>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#themes">
                      <span className="font-bold">Themes</span>
                      <span className="block text-xs text-ink-muted">
                        Light and dark workstation skins
                      </span>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Help</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-0.5">
                    <NavigationMenuLink href="#kb">
                      Knowledge Base
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#keyboard">
                      Keyboard Shortcuts
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Cell>

        <Cell
          label='orientation="vertical" — panels hang to the right'
          code={`<NavigationMenu
  label="Sidebar"
  orientation="vertical"
>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>File</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="#new">
          New…
        </NavigationMenuLink>
        <NavigationMenuLink href="#open">
          Open…
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink active href="#">
        Recycle Bin
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`}
        >
          <NavigationMenu label="Sidebar" orientation="vertical">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>File</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-0.5">
                    <NavigationMenuLink href="#new">New…</NavigationMenuLink>
                    <NavigationMenuLink href="#open">Open…</NavigationMenuLink>
                    <NavigationMenuLink href="#save">Save</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink active href="#">
                  Recycle Bin
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Cell>
      </div>
    </Section>
  );
}

function TabsSection() {
  return (
    <Section label="Tabs">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          className="sm:col-span-2"
          label="arrow keys walk + select; panels keep state while hidden"
          code={`<Tabs defaultValue="view">
  <TabsList>
    <TabsTrigger value="view">View</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="effects">Effects</TabsTrigger>
  </TabsList>
  <TabsContent value="view">…</TabsContent>
  <TabsContent value="general">…</TabsContent>
  <TabsContent value="effects">…</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue="view" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <p className="text-sm text-ink">
                Web view renders pages in sequence; continuous view stacks
                them vertically like an endless fax.
              </p>
            </TabsContent>
            <TabsContent value="general">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox defaultChecked />
                Restore windows on login
              </label>
            </TabsContent>
            <TabsContent value="effects">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Switch defaultChecked />
                CRT phosphor glow
              </label>
            </TabsContent>
          </Tabs>
        </Cell>
      </div>
    </Section>
  );
}

function SwitchSliderSection() {
  const [on, setOn] = useState(false);
  const [fill, setFill] = useState(64);
  return (
    <Section label="Switch · Slider">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="uncontrolled — knobs jump, no slide"
          code={`<Switch defaultChecked />
<Switch />
<Switch disabled defaultChecked />`}
        >
          <div className="flex items-center gap-4">
            <Switch defaultChecked />
            <Switch />
            <Switch disabled defaultChecked />
          </div>
        </Cell>
        <Cell
          label="controlled + onCheckedChange"
          code={`const [on, setOn] = useState(false);

<Switch checked={on} onCheckedChange={setOn} />
<span>Turbo: {on ? "on" : "off"}</span>`}
        >
          <div className="flex flex-col items-start gap-2">
            <Switch checked={on} onCheckedChange={setOn} />
            <span className="font-mono text-[11px] text-ink-muted">
              Turbo: {on ? "on" : "off"}
            </span>
          </div>
        </Cell>
        <Cell
          label="label-wrapped; disabled"
          code={`<label className="flex items-center gap-2 text-sm">
  <Switch defaultChecked />
  Turbo mode
</label>
<Switch disabled defaultChecked />`}
        >
          <div className="flex flex-col items-start gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Switch defaultChecked />
              Turbo mode
            </label>
            <Switch disabled defaultChecked />
          </div>
        </Cell>
        <Cell
          label="bare slider — native range, hard-stop fill"
          code={`<Slider defaultValue={64} />`}
        >
          <Slider defaultValue={64} aria-label="Volume" />
        </Cell>
        <Cell
          label="controlled + onValueChange + min/max"
          code={`const [fill, setFill] = useState(64);

<Slider
  aria-label="Defrag level"
  min={0}
  max={200}
  defaultValue={64}
  onValueChange={setFill}
/>
<span>Fill: {fill}</span>`}
        >
          <div className="flex flex-col items-start gap-2">
            <Slider
              aria-label="Defrag level"
              min={0}
              max={200}
              step={1}
              value={fill}
              onValueChange={setFill}
            />
            <span className="font-mono text-[11px] text-ink-muted">
              value: {fill}
            </span>
          </div>
        </Cell>
        <Cell
          label="in a Field, with a disabled rail"
          code={`<Field hint="Applies after reboot">
  <Slider aria-label="Refresh rate" defaultValue={60} />
</Field>
<Slider disabled defaultValue={75} aria-label="Locked" />`}
        >
          <div className="flex flex-col items-start gap-2">
            <Field hint="Applies after reboot">
              <Slider aria-label="Refresh rate" defaultValue={60} />
            </Field>
            <Slider disabled defaultValue={75} aria-label="Locked" />
          </div>
        </Cell>
      </div>
    </Section>
  );
}

function ToggleGroupSection() {
  const [mode, setMode] = useState("");
  const [keys, setKeys] = useState<string[]>(["bold"]);
  return (
    <Section label="ToggleGroup">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label='type="single" — the radio-strip: one key down at a time'
          code={`const [mode, setMode] = useState("");

<ToggleGroup
  type="single"
  value={mode}
  onValueChange={setMode}
  aria-label="Text align"
>
  <ToggleGroupItem value="wrap">Wrap</ToggleGroupItem>
  <ToggleGroupItem value="hex">Hex</ToggleGroupItem>
  <ToggleGroupItem value="raw">Raw</ToggleGroupItem>
</ToggleGroup>`}
        >
          <div className="flex flex-col items-start gap-2">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={setMode}
              aria-label="Text align"
            >
              <ToggleGroupItem value="wrap">Wrap</ToggleGroupItem>
              <ToggleGroupItem value="hex">Hex</ToggleGroupItem>
              <ToggleGroupItem value="raw">Raw</ToggleGroupItem>
            </ToggleGroup>
            <span className="font-mono text-[11px] text-ink-muted">
              mode: {mode || "—"}
            </span>
          </div>
        </Cell>
        <Cell
          label='type="multiple" — independent keys toggle freely'
          code={`const [keys, setKeys] = useState(["bold"]);

<ToggleGroup
  type="multiple"
  value={keys}
  onValueChange={setKeys}
  aria-label="Text style"
>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
  <ToggleGroupItem value="mono">Mono</ToggleGroupItem>
</ToggleGroup>`}
        >
          <div className="flex flex-col items-start gap-2">
            <ToggleGroup
              type="multiple"
              value={keys}
              onValueChange={setKeys}
              aria-label="Text style"
            >
              <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
              <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
              <ToggleGroupItem value="mono">Mono</ToggleGroupItem>
            </ToggleGroup>
            <span className="font-mono text-[11px] text-ink-muted">
              keys: {keys.join(" ") || "—"}
            </span>
          </div>
        </Cell>
        <Cell
          label="<Toggle> — the same key on its own"
          code={`<Toggle defaultPressed>Bold</Toggle>

// controlled:
const [on, setOn] = useState(false);
<Toggle pressed={on} onPressedChange={setOn}>
  Debug
</Toggle>`}
        >
          <div className="flex items-center gap-4">
            <Toggle defaultPressed>
              <span className="font-bold">Bold</span>
            </Toggle>
            <Toggle>
              <span className="font-mono">Debug</span>
            </Toggle>
            <Toggle disabled>Turbo</Toggle>
          </div>
        </Cell>
        <Cell
          label="vertical arrangement via container classes"
          code={`<ToggleGroup
  aria-label="Sidebar handles"
  defaultValue="left"
  className="flex-col"
>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`}
        >
          <ToggleGroup
            aria-label="Sidebar handles"
            defaultValue="left"
            className="flex-col"
          >
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </Cell>
      </div>
    </Section>
  );
}

function SeparatorSection() {
  return (
    <Section label="Separator">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="horizontal groove (default)"
          code={`<p>File menu</p>
<Separator className="my-2 w-40" />
<p>…uses the sunken two-tone groove</p>`}
        >
          <div className="w-48">
            <p className="text-sm">Format</p>
            <Separator className="my-2 w-40" />
            <p className="text-sm text-ink-muted">Two-tone groove — dark
            line over its light highlight</p>
          </div>
        </Cell>
        <Cell
          label='orientation="vertical" — needs a stretching flex row'
          code={`<div className="flex h-12 items-stretch gap-3">
  <span>Toolbar</span>
  <Separator orientation="vertical" />
  <span>Palette</span>
</div>`}
        >
          <div className="flex h-12 items-stretch gap-3 border border-ink bg-surface p-2 shadow-out">
            <span className="text-sm">Toolbar</span>
            <Separator orientation="vertical" />
            <span className="text-sm">Palette</span>
          </div>
        </Cell>
        <Cell
          label="decorative — skipped by screen readers"
          code={`<Separator decorative className="w-40" />`}
        >
          <div className="w-48">
            <label className="text-sm">Overwrite mode</label>
            <Separator decorative className="my-2 w-40" />
            <span className="text-sm text-ink-muted">purely visual rule</span>
          </div>
        </Cell>
      </div>
    </Section>
  );
}

function CollapsibleSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section label="Collapsible">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="uncontrolled — the panel keeps its state while hidden"
          code={`<Collapsible>
  <CollapsibleTrigger>Advanced</CollapsibleTrigger>
  <CollapsibleContent>
    <!-- anything, state included -->
  </CollapsibleContent>
</Collapsible>`}
        >
          <Collapsible className="flex w-full max-w-xs flex-col items-start gap-2">
            <CollapsibleTrigger>Advanced</CollapsibleTrigger>
            <CollapsibleContent className="flex w-full flex-col gap-2">
              <Field label="Mount point" hint="Where the archive unpacks">
                <Input defaultValue="C:\\ARCHIVE" />
              </Field>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox defaultChecked />
                Prompt before overwrite
              </label>
            </CollapsibleContent>
          </Collapsible>
        </Cell>
        <Cell
          label="controlled + onOpenChange"
          code={`const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Details</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>
<span>state: {open ? "open" : "closed"}</span>`}
        >
          <div className="flex flex-col items-start gap-2">
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleTrigger>Details</CollapsibleTrigger>
              <CollapsibleContent>
                <p className="max-w-xs text-sm text-ink-muted">
                  The panel stays mounted while closed (hidden), so anything
                  inside keeps its state across toggles.
                </p>
              </CollapsibleContent>
            </Collapsible>
            <span className="font-mono text-[11px] text-ink-muted">
              state: {open ? "open" : "closed"}
            </span>
          </div>
        </Cell>
        <Cell
          label="data-state styling — the arrow flips, no animation"
          code={`<CollapsibleTrigger
  className="data-[state=open]:[&>span]:rotate-90"
>
  <span>▸</span> Advanced
</CollapsibleTrigger>`}
        >
          <Collapsible className="flex w-full max-w-xs flex-col items-start gap-2">
            <CollapsibleTrigger className="data-[state=open]:[&>span]:rotate-90">
              <span aria-hidden="true" className="inline-block">
                ▸
              </span>
              Advanced
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="max-w-xs text-sm text-ink-muted">
                Every part carries data-state, so the key&rsquo;s arrow (or any
                styling) can read the open-state — instantly, of course.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </Cell>
      </div>
    </Section>
  );
}

function SkeletonSection() {
  return (
    <Section label="Skeleton">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="text lines — sizes sketch the pending layout"
          code={`<div className="flex flex-col gap-1.5">
  <Skeleton className="h-3 w-full" />
  <Skeleton className="h-3 w-4/5" />
  <Skeleton className="h-3 w-2/3" />
</div>`}
        >
          <div className="flex w-64 flex-col gap-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </Cell>
        <Cell
          label="avatar well + two lines"
          code={`<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10" />
  <div className="flex flex-1 flex-col gap-1.5">
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
</div>`}
        >
          <div className="flex w-full max-w-xs items-center gap-3">
            <Skeleton className="h-10 w-10" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </Cell>
        <Cell
          label="block pane standing in for Card content"
          code={`<div className="border border-ink bg-surface p-3">
  <p className="mb-2 language text-sm">README.TXT</p>
  <Skeleton className="h-24 w-full" />
</div>`}
        >
          <div className="w-64 border border-ink bg-surface p-3 shadow-out">
            <p className="mb-2 font-mono text-xs uppercase text-ink-muted">
              README.TXT
            </p>
            <Skeleton className="h-24 w-full" />
          </div>
        </Cell>
      </div>
    </Section>
  );
}

function PasswordSection() {
  return (
    <Section label="PasswordToggleField">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="label + hint — the reveal key toggles the mask instantly"
          code={`<PasswordToggleField
  label="Access key"
  hint="8+ characters; the key never leaves this machine"
  placeholder="hunter2"
  autoComplete="current-password"
/>`}
        >
          <PasswordToggleField
            label="Access key"
            hint="8+ characters; the key never leaves this machine"
            placeholder="hunter2"
            autoComplete="current-password"
          />
        </Cell>
        <Cell
          label="error medicine: invalid wiring included"
          code={`<PasswordToggleField
  label="Access key"
  error="That key was rejected three times. Caps lock?"
  defaultValue="letmein123"
/>`}
        >
          <PasswordToggleField
            label="Access key"
            error="That key was rejected three times. Caps lock?"
            defaultValue="letmein123"
          />
        </Cell>
        <Cell
          label="defaultValue + required marker"
          code={`<PasswordToggleField
  label="Access key"
  defaultValue="correct horse battery staple"
  required
/>`}
        >
          <PasswordToggleField
            label="Access key"
            defaultValue="correct horse battery staple"
            required
          />
        </Cell>
      </div>
    </Section>
  );
}

function ScrollAreaSection() {
  const lines = Array.from({ length: 40 }, (_, i) => `line ${String(i + 1).padStart(2, "0")} — station log entry, sector ${i + 7} nominal`);
  return (
    <Section label="ScrollArea">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="vertical trough — native scrollbars, already skinned"
          code={`<ScrollArea label="Station log" className="h-40 w-64">
  {lines.map((line) => (
    <p key={line}>{line}</p>
  ))}
</ScrollArea>`}
        >
          <ScrollArea label="Station log" className="h-40 w-full max-w-64 font-mono text-xs">
            {lines.map((line) => (
              <p key={line} className="whitespace-nowrap text-ink">
                {line}
              </p>
            ))}
          </ScrollArea>
        </Cell>
        <Cell
          label="horizontal too — pass wider content"
          code={`<ScrollArea label="Wide manifest" className="h-40 w-64">
  <p className="w-max">very long manifest line, item 001 … item 099</p>
</ScrollArea>`}
        >
          <ScrollArea label="Wide manifest" className="h-24 w-full max-w-64 font-mono text-xs">
            <p className="w-max text-ink">
              manifest 001 · crate A-7 · destination gateway east · weight 12kg · manifest 002 · crate B-2 · destination gateway west · weight 8kg · manifest 003 · crate C-9 · destination hold · weight 31kg
            </p>
          </ScrollArea>
        </Cell>
        <Cell
          label="unnamed scrolls fine — no region role, no tab stop"
          code={`<ScrollArea className="h-24 w-64">
  <p>Decorative pane — skipped by screen readers.</p>
</ScrollArea>`}
        >
          <ScrollArea className="h-24 w-full max-w-64">
            <p className="text-sm text-ink">
              Decorative pane — scrolls with the mouse, skipped by the
              accessibility tree.
            </p>
          </ScrollArea>
        </Cell>
      </div>
    </Section>
  );
}

function ToastSection() {
  const toast = useToast();
  return (
    <Section label="Toast">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        <Cell
          label="info — polite live region, 5s auto-dismiss"
          code={`const toast = useToast();

<Button onClick={() => toast.info("Saved", "Your document is on the disk.")}>
  Push info
</Button>`}
        >
          <Button
            variant="secondary"
            onClick={() => toast.info("Saved", "Your document is on the disk.")}
          >
            Push info
          </Button>
        </Cell>
        <Cell
          label="success — the green rail"
          code={`toast.success(
  "Copy complete",
  "3 files written to C:\\\\TEMP.",
);`}
        >
          <Button
            variant="secondary"
            onClick={() =>
              toast.success("Copy complete", "3 files written to C:\\TEMP.")
            }
          >
            Push success
          </Button>
        </Cell>
        <Cell
          label="error — asserts with role=alert, sticky until ✕"
          code={`toast.error(
  "Merge conflict",
  "Resolve it by hand.",
  { duration: 0 },
);`}
        >
          <Button
            variant="destructive"
            onClick={() =>
              toast.error("Merge conflict", "Resolve it by hand.", {
                duration: 0,
              })
            }
          >
            Push error
          </Button>
        </Cell>
        <Cell
          label="short timer — 1.2s, watch it leave"
          code={`toast.info("Copied 3 files", undefined, { duration: 1200 });`}
        >
          <Button
            variant="secondary"
            onClick={() =>
              toast.info("Copied 3 files", undefined, { duration: 1200 })
            }
          >
            Push brief
          </Button>
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
    <ToastProvider>
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
            <RadioGroupSection />
            <SelectSection />
            <IndicatorsSection />
            <CardsSection />
            <DialogSection />
            <AvatarSection />
            <AccordionSection />
            <MenuBarSection />
            <NavigationMenuSection />
            <TabsSection />
            <SwitchSliderSection />
            <ToggleGroupSection />
            <SeparatorSection />
            <CollapsibleSection />
            <SkeletonSection />
            <PasswordSection />
            <ScrollAreaSection />
            <ToastSection />
            <TooltipSection />
            <TokensSection />
          </CardContent>

          <CardFooter className="gap-1 border-0 bg-surface px-1.5 py-1.5">
            <span className={PANE}>Ready — 28 components</span>
            <span aria-hidden="true" className={cn(PANE, "flex-1")} />
            <span className={cn(PANE, "hidden sm:block")}>
              tokens: light / dark
            </span>
          </CardFooter>
        </Card>
      </main>
      </div>
    </ToastProvider>
  );
}
