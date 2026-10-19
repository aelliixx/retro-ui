"use client";

import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
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

function Cell({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"flex flex-col items-start gap-2 " + (className ?? "")}>
      {children}
      <span className="font-mono text-[11px] text-ink-muted">{label}</span>
    </div>
  );
}

/** Decorative 90s window chrome — purely visual, hidden from a11y tree. */
function WindowButtons({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={"flex items-center gap-1.5 " + (className ?? "")}
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
          v0.1.0
        </span>
      </div>
      <p className="max-w-prose text-ink-muted">
        A small React + Tailwind component library styled after 90s desktop
        UIs — carved group boxes, sunken input wells and hatched title bars
        — rebuilt with modern tokens, light/dark theming and full{" "}
        <code className="font-mono text-sm text-ink">className</code>{" "}
        composition via tailwind-merge.
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
        <Cell label='variant="primary"'>
          <Button variant="primary">Save changes</Button>
        </Cell>
        <Cell label='variant="secondary" (default)'>
          <Button>Cancel</Button>
        </Cell>
        <Cell label='variant="outline"'>
          <Button variant="outline">Browse files…</Button>
        </Cell>
        <Cell label='variant="ghost"'>
          <Button variant="ghost">Skip for now</Button>
        </Cell>
        <Cell label='variant="destructive"'>
          <Button variant="destructive">Delete forever</Button>
        </Cell>
        <Cell label="disabled">
          <Button disabled>Unavailable</Button>
        </Cell>
        <Cell label="sizes: sm / md / lg">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Compact</Button>
            <Button size="md">Default</Button>
            <Button size="lg">Command</Button>
          </div>
        </Cell>
        <Cell label="data-pressed toggle (click me)">
          <Button
            aria-pressed={pressed}
            data-pressed={pressed || undefined}
            onClick={() => setPressed((p) => !p)}
          >
            {pressed ? "Caps lock: on" : "Caps lock: off"}
          </Button>
        </Cell>
        <Cell label="composed via className">
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
    <Section label="Field + Input">
      <div className="grid gap-x-6 gap-y-8 pt-2 sm:grid-cols-2">
        <Field
          label="Username"
          required
          hint="3–20 characters, letters and digits."
        >
          <Input placeholder="ada_lovelace" />
        </Field>
        <Field label="Recovery email" error="That doesn't look like an email.">
          <Input type="email" defaultValue="ada@lovel" />
        </Field>
        <Field label="Machine name" hint="Shown on your local network.">
          <Input defaultValue="WIN98-WORKSTATION" disabled />
        </Field>
        <Field label="Access key" hint="We never phone home.">
          <Input type="password" placeholder="••••••••" />
        </Field>

        {/* composition demo: Card + Field + Input + Button */}
        <div className="sm:col-span-2">
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
        </div>
      </div>
    </Section>
  );
}

function CardsSection() {
  return (
    <Section label="Card">
      <div className="grid gap-6 pt-2 sm:grid-cols-2">
        <Cell label='default (raised) with header + footer'>
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
        <Cell label='titlebar header (hatch + small caps)'>
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
        <Cell label='variant="flat"'>
          <Card variant="flat" className="w-full">
            <CardContent>
              <p className="text-sm text-ink-muted">
                Flat variant: same border and surface, no carve. Good inside
                dense layouts.
              </p>
            </CardContent>
          </Card>
        </Cell>
        <Cell label='variant="inset" (well)'>
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
            <CardsSection />
            <TokensSection />
          </CardContent>

          <CardFooter className="gap-1 border-0 bg-surface px-1.5 py-1.5">
            <span className={PANE}>Ready — 4 components</span>
            <span aria-hidden="true" className={cn(PANE, "flex-1")} />
            <span className={cn(PANE, "hidden sm:block")}>tokens: light / dark</span>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
