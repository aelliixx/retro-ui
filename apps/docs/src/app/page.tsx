import type { Metadata } from "next";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Input,
  LoadingIcon,
  PasswordToggleField,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  buttonVariants,
} from "@retroui/ui";
import { GroupBox } from "@/components/group-box";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@retroui/ui";
import { COMPONENT_COUNT } from "@retroui/ui";

export const metadata: Metadata = {
  title: "retro/ui — 90s UI components, modern engineering",
  description:
    "React + Tailwind components styled after the golden era of web UIs — tokens, light/dark theming and className composition included.",
};

/* ------------------------------------------------------------------------- */
/* hand-styled marketing type — the modern layer on top of the era chrome     */
/* ------------------------------------------------------------------------- */

/* type cast on the desktop canvas (hero + section headings) uses the
   desktop-ink token; text inside panes keeps the standard ink pair */
const EYEBROW =
  "font-mono text-xs uppercase tracking-[0.18em] text-desktop-ink";
const DESKTOP_LEAD = "text-base leading-7 text-desktop-ink";
const DESKTOP_TITLE = "text-2xl font-bold tracking-tight text-desktop-ink";
const LEAD = "text-base leading-7 text-ink-muted";
const SECTION_TITLE = "text-2xl font-bold tracking-tight text-ink";
const CARD_TEXT = "text-sm leading-6 text-ink-muted";

/* small desk glyphs — 16px ink line art, one per feature card */
function FeatureGlyph({ kind }: { kind: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-5 shrink-0 text-ink"
    >
      {kind === "tokens" && (
        <>
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" />
          <path d="M2 2 H18 V5 H5 V18 H2 Z" fill="currentColor" opacity="0.9" />
          <path d="M18 18 H2 V15 H15 V2 H18 Z" fill="currentColor" opacity="0.35" />
        </>
      )}
      {kind === "compose" && (
        <>
          <path d="M3 5 H17 M3 10 H17 M3 15 H17" stroke="currentColor" />
          <rect x="6" y="2.5" width="5" height="5" fill="var(--accent-soft)" stroke="currentColor" />
          <rect x="10" y="7.5" width="5" height="5" fill="var(--surface)" stroke="currentColor" />
          <rect x="4" y="12.5" width="5" height="5" fill="var(--accent-soft)" stroke="currentColor" />
        </>
      )}
      {kind === "native" && (
        <>
          <rect x="2" y="3" width="16" height="14" stroke="currentColor" />
          <path d="M2 7 H18" stroke="currentColor" />
          <path d="M15 5.2 L16.8 7 L15 8.8 L13.2 7 Z" fill="currentColor" />
          <path d="M5 11 H11" stroke="currentColor" />
          <path d="M5 13.5 H9" stroke="currentColor" />
        </>
      )}
      {kind === "themes" && (
        <>
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" />
          <path d="M10 2 V18" stroke="currentColor" />
          <rect x="3" y="3" width="7" height="14" fill="var(--selection)" opacity="0.8" />
          <rect x="12.6" y="3" width="4.4" height="14" fill="currentColor" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* the hero demo window — live, uncontrolled, zero script on this page        */
/* ------------------------------------------------------------------------- */

function DemoWindow() {
  return (
    <Card className="mx-auto w-full max-w-3xl text-left">
      <CardHeader variant="titlebar" className="justify-between gap-3">
        <CardTitle className="min-w-0 truncate">carve.exe — live components</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-6 gap-y-5 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        <GroupBox label="Sign in" className="min-w-0">
          <div className="flex flex-col gap-3">
            <Field label="Username">
              <Input placeholder="ada" />
            </Field>
            <PasswordToggleField
              label="Access key"
              defaultValue="hunter2"
              hint="Saved on the lock on your disk."
            />
          </div>
        </GroupBox>
        <GroupBox label="Sound">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 text-sm text-ink">
              <span>Beep on error</span>
              <Switch defaultChecked aria-label="Beep on error" />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-ink">
              <span>Skip intro music</span>
              <Switch aria-label="Skip intro music" />
            </div>
            <Progress value={62} aria-label="Load progress" />
            <LoadingIcon className="text-ink" />
          </div>
        </GroupBox>
        <RadioGroup label="View">
          <label className="flex items-center gap-2 text-sm text-ink">
            <Radio value="tiles" />
            <span>Tiles</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <Radio value="list" />
            <span>List</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <Radio value="details" />
            <span>Details</span>
          </label>
        </RadioGroup>
        <GroupBox label="Files">
          <Tabs defaultValue="disk">
            <TabsList>
              <TabsTrigger value="disk">disk</TabsTrigger>
              <TabsTrigger value="net">net</TabsTrigger>
            </TabsList>
            <TabsContent value="disk">
              <div className="flex flex-col gap-1.5 text-sm text-ink">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked aria-label="Include readme.txt" />
                  readme.txt
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox aria-label="Include todo.txt" />
                  todo.txt
                </div>
              </div>
            </TabsContent>
            <TabsContent value="net">
              <p className={cn(CARD_TEXT, "m-0")}>
                3 workgroups on the wire.
              </p>
            </TabsContent>
          </Tabs>
        </GroupBox>
        <GroupBox label="Resolution">
          <Select defaultValue="800x600" aria-label="Resolution">
            <option value="640x480">640 × 480</option>
            <option value="800x600">800 × 600</option>
            <option value="1024x768">1024 × 768</option>
          </Select>
        </GroupBox>
        <GroupBox label="Volume">
          <Slider defaultValue={40} min={0} max={100} aria-label="Volume" />
          <p className={cn(CARD_TEXT, "m-0 mt-2")}>
            From silence to full blast — the knob is a real input.
          </p>
        </GroupBox>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------------- */
/* landing                                                                    */
/* ------------------------------------------------------------------------- */

const FEATURES = [
  {
    glyph: "tokens",
    title: "Token-driven, never hardcoded",
    body: "Every color, edge and texture resolves through semantic CSS variables mapped with @theme inline. Change one value, watch every window follow.",
  },
  {
    glyph: "compose",
    title: "Composition that survives contact",
    body: "Defaults merge through cn() — clsx plus tailwind-merge with retro/ui's own vocabulary registered. Your className always wins; texture and bevels compose instead of colliding.",
  },
  {
    glyph: "native",
    title: "Built on the platform",
    body: "Dialog is a real <dialog>, Accordion is <details>, Select is the native control. Focus trapping, Escape and semantics come from the browser, not from bundles.",
  },
  {
    glyph: "themes",
    title: "Light and dark, both first-class",
    body: "One token set per theme, flipped by the .dark class before first paint. Bevels re-tone with depth edges so shadows read as bevels in the dark.",
  },
];

const STEPS = [
  {
    href: "/docs/getting-started/installation",
    step: "01",
    title: "Install",
    blurb: "The package, and the stylesheet.",
  },
  {
    href: "/docs/getting-started/styling",
    step: "02",
    title: "Style",
    blurb: "Bevels, textures, composition.",
  },
  {
    href: "/docs/getting-started/theming",
    step: "03",
    title: "Theme",
    blurb: "Dark mode and new color families.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-desktop bg-dither">
      {/* top bar — hand-styled: solid sheet, hairline, sticky */}
      <header className="sticky top-0 z-40 border-b border-ink bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5 sm:px-6">
          <Link href="/" className="no-underline group">
            <span className="font-pixel text-lg text-ink group-hover:text-accent-strong">
              retro/ui
            </span>
          </Link>
          <nav aria-label="Landing" className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/docs"
              className={cn(
                "font-mono text-xs uppercase tracking-[0.14em] text-ink-muted no-underline hover:text-ink",
              )}
            >
              Docs
            </Link>
            <Link
              href="/playground"
              className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted no-underline hover:text-ink"
            >
              Playground
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* hero */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-20">
          <p className={EYEBROW}>React · Tailwind v4 · MIT</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-desktop-ink sm:text-5xl">
            Straight out of 1994.
          </h1>
          <p className={cn(DESKTOP_LEAD, "max-w-xl")}>
            retro/ui is a component library styled after the golden era of
            web and desktop UIs — carved group boxes, sunken input wells,
            hatched title bars. Underneath it is all modern: design tokens,
            light/dark theming, accessible native semantics, and a{" "}
            <code className="font-mono text-sm text-desktop-ink">cn()</code>{" "}
            that lets your className win.
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Read the docs
            </Link>
            <Link
              href="/playground"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                // a face, not a hole: the outline button's ink on the teal
                // desktop is 3.65:1, and a real button on the era desk had
                // a grey face anyway
                "bg-surface",
              )}
            >
              Open the playground
            </Link>
          </div>

          {/* the install — one command, then one stylesheet */}
          <div className="mt-2 flex w-full max-w-xl flex-col items-center gap-2">
            <div className="flex w-full items-stretch border border-ink bg-well shadow-in">
              <span
                aria-hidden="true"
                className="select-none border-r border-ink bg-surface-2 px-2.5 py-1.5 font-mono text-xs text-ink-muted"
              >
                $
              </span>
              <code className="block flex-1 overflow-x-auto px-3 py-1.5 font-mono text-xs text-ink">
                npm install @retroui/ui
              </code>
            </div>
            <p className="m-0 text-xs leading-5 text-desktop-ink">
              then import the stylesheet — the{" "}
              <Link
                href="/docs/getting-started/installation"
                className="text-desktop-ink underline decoration-dotted underline-offset-2 hover:bg-accent-soft hover:text-ink"
              >
                installation guide
              </Link>{" "}
              has the two lines
            </p>
          </div>

          <p className="border border-ink bg-surface px-2 py-0.5 font-mono text-xs leading-none text-ink shadow-in">
            {COMPONENT_COUNT} components · works with your tokens from day one
          </p>

          {/* the hook: a real window doing real things */}
          <div className="mt-4 w-full">
            <DemoWindow />
          </div>
        </section>

        {/* features */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
          <div className="flex flex-col gap-2 pb-6">
            <p className={EYEBROW}>Why it holds up</p>
            <h2 className={DESKTOP_TITLE}>Modern underneath, retro where you can see it</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="p-0">
                <CardContent className="flex flex-col gap-3 p-5">
                  <FeatureGlyph kind={feature.glyph} />
                  <h3 className="text-base font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className={cn(CARD_TEXT, "m-0")}>{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* getting started */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className={EYEBROW}>Start in five minutes</p>
              <h2 className={cn(DESKTOP_TITLE, "pb-1")}>Install. Ship out.</h2>
              <p className={cn(DESKTOP_LEAD, "m-0")}>
                One install and one stylesheet: pull the package in, point
                Tailwind at the tokens, and the components build like they
                grew there. No runtime to adopt, no client to fight.
              </p>
              <div className="border border-ink bg-well p-3 font-mono text-xs shadow-in">
                <code className="block overflow-x-auto text-ink">
                  npm install @retroui/ui
                </code>
              </div>
              <div>
                <Link href="/docs/getting-started/installation" className={buttonVariants({ variant: "primary", size: "sm" })}>
                  Installation guide
                </Link>
              </div>
            </div>
            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {STEPS.map((step) => (
                <li key={step.step}>
                  <Link
                    href={step.href}
                    className="no-underline block border border-ink bg-surface px-4 py-3 shadow-out hover:bg-surface-2 focus-etched"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-ink-muted">
                        {step.step}
                      </span>
                      <span className="text-base font-semibold text-ink">
                        {step.title}
                      </span>
                      <span className="ml-auto font-mono text-xs text-ink-muted">
                        ▸
                      </span>
                    </div>
                    <p className={cn(CARD_TEXT, "m-0 mt-1 ml-9")}>
                      {step.blurb}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* closing CTA */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-center gap-4 border border-ink bg-accent-soft px-6 py-10 text-center shadow-out">
            <h2 className={SECTION_TITLE}>Take the components for a spin</h2>
            <p className={cn(LEAD, "m-0 max-w-lg")}>
              The playground runs every component live — each demo with its
              code disclosure — and the docs explain the token system
              beneath them.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/playground" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Open the playground
              </Link>
              <Button variant="ghost" disabled>
                no webhooks, no dashboards
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* the taskbar — era footer, sticky bottom */}
      <footer className="sticky bottom-0 z-40 border-t border-ink bg-surface-2">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-1.5 sm:px-6">
          <Link
            href="/docs"
            className="no-underline flex items-center gap-2 border border-ink bg-surface px-3 py-1 shadow-out hover:bg-surface-2"
          >
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 bg-[repeating-conic-gradient(var(--accent)_0%_25%,transparent_0%_50%)] bg-[length:4px_4px]"
            />
            <span className="font-pixel text-xs text-ink">Start</span>
          </Link>
          <span className="border border-ink bg-surface px-2 py-0.5 font-mono text-[11px] leading-none text-ink shadow-in">
            Ready — {COMPONENT_COUNT} components
          </span>
          <span className="ml-auto hidden font-mono text-[11px] text-ink-muted sm:block">
            retro/ui v0.5.0
          </span>
        </div>
      </footer>
    </div>
  );
}
