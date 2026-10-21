# retro/ui

A small React + Tailwind component library styled after 90s desktop UIs —
carved group boxes, sunken input wells, hatched title bars and honest
two-tone bevels — rebuilt with modern design tokens, light/dark theming, and
full `className` composition.

Current components: **Button · Field · Input · PasswordToggleField ·
Textarea · Checkbox · Switch · Toggle · Slider · RadioGroup · Select ·
Progress · LoadingIcon · Tooltip · Card · Dialog · Avatar · Badge ·
Status · AspectRatio · Accordion · Collapsible · MenuBar ·
NavigationMenu · Pagination · Tabs · ToggleGroup · Separator ·
ScrollArea · Skeleton · Table · Toast**.

## Layout

A workspace with two packages:

```
packages/ui/     the library — components, tokens, utilities
apps/docs/      the documentation site and playground
```

```bash
npm run dev   # landing at http://localhost:3000 → playground at /playground · docs at /docs
npm test      # component test suite (vitest + testing-library, happy-dom)
npm run build # the docs site, statically exported
```

## Tests

Every component has a test file in a `__tests__` folder beside it —
`packages/ui/src/components/ui/__tests__/*.test.tsx` — covering what the component
promises: variants and class composition, controlled and uncontrolled
state, keyboard operation, disabled behavior, and the accessibility
wiring (roles, labels, `aria-*`).

```bash
npm test          # run the suite once
npm run test:watch # re-run on change
```

The suite runs on [happy-dom](https://github.com/capricorn86/happy-dom) and
uses [Testing Library](https://testing-library.com) queries, so the tests
assert on what a user (or a screen reader) can actually reach.

## Visual tests

happy-dom draws nothing, so the suite cannot see whether a component
*looks* right. The visual tests do: they screenshot the playground — one
per section, light and dark — and compare each against a stored
baseline.

```bash
npm run test:visual                        # the whole suite
npm run test:visual -- --update-snapshots  # accept the new look
```

They run against the **exported** site, not the dev server: a
production build is what a visitor gets, and its CSS is what the
baselines are made of. The web server is rebuilt for every run, so a
test can never pass against a stale export.

Two things in the playground move on their own, and both are pinned:
the hourglass (the library honours `prefers-reduced-motion`, which the
config sets) and the live copy-job demo (a progress bar that ticks —
the clock is frozen so it never advances).

The baselines live in
`apps/docs/tests/visual/playground.spec.ts-snapshots/`, one file per
section per theme per platform. A changed baseline is a changed
library: read the diff before committing it. A guard test fails when
the playground grows a section the list does not know about, so a new
component cannot slip past unphotographed.

## How theming works

Every color is a plain CSS variable declared in
[`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css)
and mapped into Tailwind v4 with
`@theme inline`, which gives you utilities like `bg-surface`, `text-ink-muted`,
`border-ink`, plus the depth and texture utilities below. The component skin
(the etched focus ring, the textures, the styled slider, the placeholder
shell) lives beside it in
[`packages/ui/src/styles/utilities.css`](packages/ui/src/styles/utilities.css).

- **Light theme** — variables on `:root`
- **Dark theme** — the same variables under `.dark` (class strategy, wired with
  `@custom-variant dark`)
- **Fonts** — `--font-sans` / `--font-mono` (Geist / Geist Mono by default),
  and an optional pixel accent `--font-pixel` (Silkscreen, used for the
  playground wordmark and section labels). Point them at anything to re-voice
  the whole library.

Re-branding = editing one token block. No component has a hardcoded color.

```css
:root {
  --accent: #0f766e;       /* primary actions + title bars            */
  --bevel-light: #f8fafc;  /* raised edge (top-left face of a carve)  */
  --bevel-dark: #8d95a3;   /* sunken edge (bottom-right face)         */
  --focus: #171a20;        /* dotted focus rectangle                  */
  /* …bg, surface, surface-2, well, ink, ink-muted, danger, tooltip,
     selection… */
}
.dark { /* same names, dark values */ }
```

### Depth — bevels, not drop shadows

Depth is modeled the way 90s systems did it: a **two-tone bevel** (a light
edge on one side, a dark edge on the opposite one), never a blurred or
animated shadow:

- `shadow-out` — raised (light top-left, dark bottom-right)
- `shadow-in` — pressed / sunken (inverted)
- states flip between the two **instantly** — no transitions by design.
  Pressure points: Button press, Input wells, Card wells, status-bar panes.

Textures: `bg-hatch` (title-bar ticking), `bg-dither`,
`bg-grid`, `bg-backdrop` (the modal dim — hard black dither). Keyboard focus
renders as a dotted rectangle inside the control
(`focus-etched`), controlled by `--focus`.

## Overriding components

All components accept a `className` that is merged through
`clsx` + `tailwind-merge` (see `packages/ui/src/lib/utils.ts`), and the bevel scale is
registered with tailwind-merge so depth overrides resolve cleanly:

```tsx
<Button variant="secondary" className="border-dashed text-accent shadow-none" />
<Input className="h-12 font-mono" />
<Card className="max-w-md" />
```

Useful hooks for deeper customization: every part of a component carries a
`data-slot` attribute (`button`, `field-label`, `card-title`, …), and variant
classes are exported (`buttonVariants`, `cardVariants`, `inputVariants`).

## Components

### `<Button>`

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` `secondary` `outline` `ghost` `destructive` | `secondary` |
| `size` | `sm` `md` `lg` `icon` | `md` |

Native `<button>` props pass through. Behavior notes:

- **Press** — the bevel inverts (`shadow-out` → `shadow-in`) and the content
  nudges 1px, instantly. Authentic key-press, zero animation.
- **`data-pressed="true"`** — persistent sunken state, for toggles. Pair with
  `aria-pressed` in React when using it as a toggle button.
- **Focus** — dotted etched rectangle (`--focus`).

### `<Input>` / `<Textarea>`

Native `<input>` / `<textarea>` props pass through. Behavior notes:

- sunken well by default (`--well` interior, `shadow-in`), dotted focus
  rectangle, `aria-invalid` switches the border to `--danger`, `disabled`
  uses the muted well, teal caret.
- `Textarea` is `resize-y` with a `min-h-20` floor.

### `<Checkbox>`

A `role="checkbox"` button — native keyboard activation, no `input` element
under the hood. Tri-state via `indeterminate` (dash glyph, reports
`aria-checked="mixed"`, resolves to checked on next activate). Works
controlled (`checked` + `onCheckedChange`) or uncontrolled
(`defaultChecked`). Label it by wrapping in a `<label>` or pointing `htmlFor`
at its id. Styling hooks: `data-state` (`checked` / `unchecked` /
`indeterminate`). Great for label-wrapping since buttons are labelable.

### `<Select>`

A styled native `<select>` — real options, keyboard + assistive-tech
behavior for free — wrapped in a relative container that paints the chevron.
`className` lands on the wrapper (use it for `w-*` / `h-*`; the select fills
it); `Field`-wrapping wires label/id/aria straight through to the inner
select.

The dropdown list is themed too (`select-base` utility): engines with
customizable-select (`appearance: base-select` — current Chromium and
friends) get a fully in-page picker with the retro chrome — ink border,
sunken bevel, token colors, hover/checked option states; older engines just
keep the native OS list. Options are styled via the select element, so a
plain `<option>` needs no classes of its own.

### `<Progress>`

```tsx
<Progress value={64} />
```

Sunken track with a solid teal fill line that runs flush into the end wall.
`role="progressbar"`, `aria-valuemin/max/now` wired; `data-state="complete"`
at 100%. `value` / `max` props, size via className (`h-3`, `h-5`, …).

### `<LoadingIcon>`

The classic busy-hourglass that *flips* every 1.2s (instant, stepped — no
easing), and holds still under `prefers-reduced-motion`. Announces
`"Loading…"` to screen readers by default; pass `label={null}` when visible
loading text surrounds it. Size via className (`size-3`, `size-6`, …).

### `<Tooltip>`

```tsx
<Tooltip content="Saves to C:\ARCHIVE">
  <Button variant="outline">Archive</Button>
</Tooltip>
```

The classic yellow bubble (`--tooltip`), 1px ink border, instant show on
hover **or keyboard focus** — pure CSS, no portal, no delay. `side`
(`"top"` default / `"bottom"`) positions it; fine-tune via `className`.
Always wrap a **focusable** trigger so keyboard users get the content too;
for non-icon content the tooltip supplements, never replaces, the trigger's
label.

### `<Field>`

Form field wrapper that handles label + hint/error + accessibility wiring.

```tsx
<Field label="Username" required hint="3–20 characters.">
  <Input placeholder="ada_lovelace" />
</Field>
```

Pass a **single control** as the child: `Field` clones it and injects `id`,
`aria-describedby` (hint + error), `aria-invalid` (when `error` is set) and
`aria-required` unless you've set them yourself. Props: `label`, `hint`,
`error`, `required`, `htmlFor`. When `error` is present it replaces the hint
and is announced via `role="alert"`.

### `<Card>` (compound)

```tsx
<Card>                      // variants: "raised" (default) | "flat" | "inset"
  <CardHeader>              // variant: "plain" (default) | "titlebar"
    <CardTitle>…</CardTitle>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
  <CardDescription>…</CardDescription>
</Card>
```

- `raised` — hairline chrome + `shadow-out` bevel; reads as a window.
- `titlebar` headers render the signature retro chrome: hatched
  silver background, small caps
  title.
- `inset` = sunken well (matches `<Input>`), good for code blocks and
  terminal-style content.

### `<Dialog>`

A modal message window on the native `<dialog>` element — focus trapping,
Escape-to-close and page blocking come from the platform. Two presets:
`variant="info"` (teal *i* roundel) and `variant="error"` (red ✗ roundel);
pass `icon` to replace either, or `noIcon` for plain text.

```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Delete…</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  variant="error"
  title="Empty C:\RECYCLED?"
  actions={<Button variant="destructive" onClick={() => setOpen(false)}>Empty bin</Button>}
>
  This removes 1,337 files.
</Dialog>
```

Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
Escape and the ✕ button fire `onOpenChange(false)` — keep `open` synced.
`actions` render bottom-right on the footer rail; `title` doubles as the
a11y label; the backdrop dims with `bg-backdrop` (hard black dither).

### `<Avatar>`

Square, beveled presence tile (no circles here), with the era's presence pip:

```tsx
<Avatar name="Ada Lovelace" />                       // initials "AL"
<Avatar name="Ada Lovelace" src={url} status="online" />
```

Renders `src` when it loads; on a missing/broken image it falls back to
initials derived from `name` (or a custom `fallback` node). `status` —
`online` / `away` / `busy` / `offline` — adds a corner pip mapped to
`--accent` / `--selection` / `--danger` / `--ink-muted`; the pip is
decorative (`aria-hidden`), and the tile itself carries
`role="img"` + `aria-label={name}`. Sizes via `size-6/8/10` className
overrides.

### `<Accordion>`

Disclosure stack built on native `<details>/<summary>` — no state, no
animation, keyboard toggling for free. Each item toggles independently
(multiple can be open at once); set `open` on `<AccordionItem>` to start
expanded.

```tsx
<Accordion>
  <AccordionItem open>
    <AccordionTrigger>Getting started</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>
```

The trigger's folder-arrow snaps 90° open — instant, like everything else
here. Row hover is the pressed-silver surface.

### `<MenuBar>`

The classic menu strip with pull-down lists — pure CSS, no state: menus open
on hover *or keyboard focus* (era-authentic hover-preview), and each item is
a real `<button>`, so Tab walks into the list and Enter fires it.

```tsx
<MenuBar label="Main menu">
  <Menu label="File">
    <MenuItem shortcut="Ctrl+N">New</MenuItem>   {/* display only */}
    <MenuItem shortcut="Ctrl+O">Open…</MenuItem>
    <MenuSeparator />
    <MenuItem disabled>Print…</MenuItem>
  </Menu>
  <Menu label="Help" align="end">…</Menu>
</MenuBar>
```

Deliberate limitations (documented, not hidden): `menubar`/`menu` roles are
omitted because arrow-key roving can't be honored without JS, and keyboard
focus is what keeps a list open — move focus away and it closes.

### `<NavigationMenu>`

The site navigation bar (the Radix-style "nav menu" primitive): inline links
plus items that pop a content panel — panels hang flush under (or beside, for
`orientation="vertical"`) the bar, aligned to their trigger and clamped to
the window. One panel is open at a time; triggers open on mouse-over or
click; panels close on outside click, focus leaving the bar, or Escape
(which returns focus to the trigger). ArrowDown from a trigger opens it and
focuses the panel's first link. Radix-compatible open-state API: `value` /
`defaultValue` / `onValueChange`, with `""` = all closed.

```tsx
<NavigationMenu label="Main">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink active href="#">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Library</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="#docs">
          <span className="font-bold">Docs</span>
          <span className="block text-xs text-ink-muted">Reference</span>
        </NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

Panels are `role="group"` labelled by their trigger; the active page link
takes `aria-current="page"`. Use `MenuBar` for app-style action menus and
`NavigationMenu` for site/section navigation with content panels.

### `<Tabs>`

The file-folder tab control. Real `tablist`/`tab`/`tabpanel` ARIA with a
roving tabindex — Arrow keys (and Home/End) walk the triggers and moving
focus selects (automatic activation). Inactive panels stay mounted but
`hidden`, so form state inside them survives switching.

```tsx
<Tabs defaultValue="view">
  <TabsList>
    <TabsTrigger value="view">View</TabsTrigger>
    <TabsTrigger value="general">General</TabsTrigger>
  </TabsList>
  <TabsContent value="view">…</TabsContent>
  <TabsContent value="general">…</TabsContent>
</Tabs>
```

The selected trigger merges with its panel — no bottom border, overlapping
the top hairline — the classic carving for a selected folder tab. Trigger
and panel ids derive from the tab `value`, which should be unique and
free of `: . ,` characters (anything else becomes `"tab"` in the DOM id).

### `<Switch>`

The power toggle — `<button role="switch">` with a sunken track and a
square beveled knob that jumps between the rail ends instantly (no slide
animation). Same management contract as `Checkbox`: `checked` +
`onCheckedChange` or `defaultChecked`, click/Space/Enter to flip,
`disabled` supported.

```tsx
<Switch checked={on} onCheckedChange={setOn} />
```

### `<Slider>`

A native `<input type="range">` in the workstation skin: sunken groove
track, hard-stop accent fill up to the knob (solid blocks — no soft
blend), square beveled thumb. All native behavior stays native — drag,
arrow keys, PageUp/Down, Home/End, forms.

```tsx
<Field label="Refresh rate" hint="Applies after reboot">
  <Slider min={0} max={120} defaultValue={60} />
</Field>
```

`onValueChange` mirrors `onChange` with the number (works controlled or
uncontrolled). Give it an accessible name (`aria-label` or a wrapping
`Field`). Horizontal only for now — native vertical ranges are still a
compatibility mess; the skin lives in the `.retro-slider` utility.

### `<ToggleGroup>`

The segmented switch bank — joined keys in one bevel, like the toolbar or
radio-strip patterns. Selected keys sit sunken (the press stayed down);
hover/`aria-pressed` behave like `data-pressed` buttons.

```tsx
<ToggleGroup type="single" value={mode} onValueChange={setMode}>
  <ToggleGroupItem value="wrap">Wrap</ToggleGroupItem>
  <ToggleGroupItem value="hex">Hex</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="multiple" defaultValue={["bold"]}>…</ToggleGroup>
```

The group is a horizontal row by default; `className="flex-col"` turns it
into a vertical bank where `items-stretch` gives every key the same width.
Selected keys invert their bevel like a pressed key and carry an accent
tint so "on" stays readable in either theme. `type="single"` callbacks
see a `string` (empty when nothing is selected); `type="multiple"` sees
`string[]`. Note: items are plain tabbable buttons (no roving tabindex)
— fine for humane group sizes.

### `<Toggle>`

The latching key — `ToggleGroupItem` on its own: a button with
`aria-pressed` whose bevel inverts and tints while it stays down.

```tsx
<Toggle defaultPressed>Bold</Toggle>
<Toggle pressed={on} onPressedChange={setOn}>Debug</Toggle>
```

### `<Toast>`

Notification balloons from the tray, minus the physics — toasts stack
bottom-right and vanish without animation. Mount one `<ToastProvider>`
(it renders the persistent polite live region and the stack), then push
with the `useToast()` hook:

```tsx
const toast = useToast();
toast.info("Saved", "Your document is on the disk.");     // 5s default
toast.error("Merge conflict", "Resolve it by hand.", { duration: 0 });
```

`duration` is milliseconds — `0` sticks until the ✕ key. Hovering a
toast holds its timer; leaving restarts the full duration, so nothing
dies while it's being read. `variant` is
`variant` is `info` (accent rail), `success` (green rail) or `error`
(danger rail), mirroring `Dialog`; error
toasts assert with `role="alert"`. The provider is a client component —
mount it around your app or page.

### `<ScrollArea>`

A sunken well that scrolls its overflow with the native (globally
skinned) scrollbars — zero JS, honest trough-look.

```tsx
<ScrollArea label="Station log" className="h-40 w-64">
  <p className="w-max">…wide or tall content…</p>
</ScrollArea>
```

Give it an accessible `label` and the pane becomes `role="region"`,
takes a tab stop, and scrolls with the keyboard once focused.

### `<Collapsible>`

A trigger that expands/collapses one panel, instantly. Use it instead of
`<Accordion>` when there's a single panel and the trigger shouldn't look
like a folder row — both parts are bare and styled by you, but wired
together: `aria-expanded` + `aria-controls`, click/Space/Enter, and
`data-state="open|closed"` on every part for styling (the classic move:
`data-[state=open]:rotate-90` on an arrow the consumer includes themself).

```tsx
<Collapsible>
  <CollapsibleTrigger>▸ Advanced</CollapsibleTrigger>
  <CollapsibleContent>…anything…</CollapsibleContent>
</Collapsible>
```

Controlled (`open` + `onOpenChange`) or uncontrolled (`defaultOpen`).
Like Tabs' panels, the content stays mounted while closed but `hidden`,
so form state inside survives toggling.

### `<Skeleton>` (Radix Themes API)

"Replaces content with a same-shape placeholder that indicates a loading
state" — the era's take: a sunken block wearing the fine checkerboard
dither, static (no shimmer; Radix's pulse is swapped for honesty).

Wraps live content with `loading` (default `true`): the shell renders
*onto* the child (no wrapper node), so the placeholder is exactly the
child's shape; the child stays mounted but hidden — dimensions and
layout preserved — and is disabled (`inert`, `tabIndex={-1}`,
`aria-hidden`). `loading={false}` renders the children untouched.

```tsx
<Skeleton loading={loading}>
  <Switch defaultChecked />
</Skeleton>

{/* bare text children are supported, with text-metric normalization —
    wrap the text node itself, not its parent, so the placeholder is the
    same shape as the words */}
<p>
  Logs: <Skeleton loading={loading}>Cache hits 1,024 · misses 3</Skeleton>
</p>

{/* bare usage: a generic tile, sized via className */}
<Skeleton className="h-3 w-2/3" />
```

Shell paint lives in the `.retro-skeleton` rules in
`packages/ui/src/styles/utilities.css` and deliberately beats the wrapped
element's own bevels. Base element: span (like Radix).

### `<Table>`

The details pane — semantic native table parts wearing the operating
system's list skin: column headers on a sunken sheet between dark
rules, hairline column dividers, rows separated by soft hairlines that
highlight on hover (accent tint, instant — the list-selection way).

Composable and flat — `<Table>` is the `<table>` itself; everything is
semantic and simply styled:

```tsx
<ScrollArea className="border border-ink bg-surface shadow-out">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Size</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>document.txt</TableCell>
        <TableCell>12 KB</TableCell>
      </TableRow>
    </TableBody>
    <TableCaption>4 objects</TableCaption>
  </Table>
</ScrollArea>
```

Wrap in a `<ScrollArea>` when the column count outruns the pane. For
row headers in the first column pass `scope="row"` to `TableHead`.
`TableFooter` is a `tfoot` (dark rule above, sunken sheet). A selected
row is a consumer concern: `className="bg-accent-soft"` on the `TableRow`.

### `<PasswordToggleField>`

The password well with a joined reveal key: the button sits flush at the
right end of the trough and toggles the mask instantly (`password` ⇄
`text`, no transitions). Label/hint/error/required wire through the
normal `Field` machinery — composite controls opt out of Field's
single-child clone and self-wire via the exported `useFieldIds()` hook.

```tsx
<PasswordToggleField
  label="Access key"
  hint="8+ characters"
  autoComplete="current-password"
/>
```

### `<Separator>`

The carved divider — a two-tone groove (dark line over its light
highlight), dented into the surface like the era drew them.

```tsx
<Separator className="my-2" />            {/* horizontal */}
<Separator orientation="vertical" />       {/* flex row: give it stretch */}
<Separator decorative />                   {/* bare div, no separator role */}
```

### `<RadioGroup>`

A carved group box of real radio inputs — native semantics, keyboard roving
and form participation for free.

```tsx
<RadioGroup label="Scaling" defaultValue="100">
  <Radio value="100">100% (small fonts)</Radio>
  <Radio value="125">125%</Radio>
  <Radio value="150" disabled>150% (needs sign-out)</Radio>
</RadioGroup>
```

Radios must render inside the group (they share its auto-generated `name`).
Wrap each `<Radio>` in a plain `<label>` to give it text. Controlled
(`value` + `onValueChange`) or uncontrolled (`defaultValue`). Disabling the
group disables every nested radio natively; the roundel is the standard
sunken bevel, mint-dot when checked.

## Doc pages

A doc page is one file: `apps/docs/src/app/docs/components/<slug>/page.mdx`
holds the prose, the live demos and the copy-pasteable snippet.

The demos are exported functions in the page itself. An MDX page is a
server component — the `use client` directive is dropped by the MDX
compiler — so a demo that reads React state cannot live in the page; it
goes in `demo.tsx` beside it and the page imports it.

## Adding components

Follow the existing pattern:

1. One file per component in `packages/ui/src/components/ui/`, with a `cva()` call for
   variants and `data-slot` attributes on each rendered part.
2. Accept all native props for the underlying element plus variant props.
3. Always merge classes with `cn()` last so consumer `className` wins.
4. Export from `packages/ui/src/components/ui/index.ts` and add a demo to the playground
   (`apps/docs/src/app/page.tsx`).

## Dark mode (playground)

`ThemeToggle` (`apps/docs/src/components/theme-toggle.tsx`) flips the `.dark`
class on `<html>` and persists the choice in `localStorage["retro-theme"]`. An
inline script in [`apps/docs/src/app/layout.tsx`](apps/docs/src/app/layout.tsx)
applies the persisted theme (or system preference on first visit) before first
paint.
