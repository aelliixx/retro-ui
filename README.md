# retro/ui

A small React + Tailwind component library styled after 90s desktop UIs —
carved group boxes, sunken input wells, gradient title bars and honest
two-tone bevels — rebuilt with modern design tokens, light/dark theming, and
full `className` composition.

Current components: **Button · Field · Input · Card** (more coming).

```bash
npm run dev   # playground at http://localhost:3000
```

## How theming works

Every color is a plain CSS variable declared in
[`src/app/globals.css`](src/app/globals.css) and mapped into Tailwind v4 with
`@theme inline`, which gives you utilities like `bg-surface`, `text-ink-muted`,
`border-ink`, plus the depth and texture utilities below.

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
  --titlebar-a/b: …;       /* horizontal title-bar gradient           */
  --focus: #171a20;        /* dotted focus rectangle                  */
  /* …bg, surface, surface-2, well, ink, ink-muted, danger, selection… */
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

Textures: `bg-titlebar` (horizontal title gradient), `bg-hatch`, `bg-dither`,
`bg-grid`. Keyboard focus renders as a dotted rectangle inside the control
(`focus-etched`), controlled by `--focus`.

## Overriding components

All components accept a `className` that is merged through
`clsx` + `tailwind-merge` (see `src/lib/utils.ts`), and the bevel scale is
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

### `<Input>`

Native `<input>` props pass through. Behavior notes:

- sunken well by default (`--well` interior, `shadow-in`), dotted focus
  rectangle, `aria-invalid` switches the border to `--danger`, `disabled`
  uses the muted well.

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
- `titlebar` headers render the signature retro chrome: classic
  left-to-right gradient (`--titlebar-a → --titlebar-b`), small caps white
  title.
- `inset` = sunken well (matches `<Input>`), good for code blocks and
  terminal-style content.

## Adding components

Follow the existing pattern:

1. One file per component in `src/components/ui/`, with a `cva()` call for
   variants and `data-slot` attributes on each rendered part.
2. Accept all native props for the underlying element plus variant props.
3. Always merge classes with `cn()` last so consumer `className` wins.
4. Export from `src/components/ui/index.ts` and add a demo to the playground
   (`src/app/page.tsx`).

## Dark mode (playground)

`ThemeToggle` (`src/components/theme-toggle.tsx`) flips the `.dark` class on
`<html>` and persists the choice in `localStorage["retro-theme"]`. An inline
script in [`src/app/layout.tsx`](src/app/layout.tsx) applies the persisted
theme (or system preference on first visit) before first paint.
