# retro/ui

A small React + Tailwind component library styled after 90s desktop UIs — hard
borders, sunken wells and honest hard shadows — rebuilt with modern design
tokens, light/dark theming, and full `className` composition.

Current components: **Button · Field · Input · Card** (more coming).

```bash
npm run dev   # playground at http://localhost:3000
```

## How theming works

Every color is a plain CSS variable declared in
[`src/app/globals.css`](src/app/globals.css) and mapped into Tailwind v4 with
`@theme inline`, which gives you utilities like `bg-surface`, `text-ink-muted`,
`border-ink`, `shadow-hard`, `shadow-sunk`, and textures `bg-hatch`,
`bg-dither`, `bg-grid`.

- **Light theme** — variables on `:root`
- **Dark theme** — the same variables under `.dark` (class strategy, wired with
  `@custom-variant dark`)
- **Fonts** — `--font-sans` / `--font-mono` (Geist / Geist Mono by default).
  Point them at anything to re-voice the whole library.

Re-branding = editing one token block. No component has a hardcoded color.

```css
:root {
  --accent: #0f766e;      /* primary actions + title bars */
  --shadow-color: #1b1f27; /* hard offset shadows   */
  /* …bg, surface, surface-2, ink, ink-muted, danger, ring, selection… */
}
.dark { /* same names, dark values */ }
```

## Overriding components

All components accept a `className` that is merged through
`clsx` + `tailwind-merge` (see `src/lib/utils.ts`), and the custom shadow
scale is registered with tailwind-merge so depth overrides resolve cleanly:

```tsx
<Button variant="secondary" className="rounded-none border-dashed text-accent shadow-none" />
<Input className="h-12 font-mono" />
<Card className="max-w-md rotate-0" />
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

Native `<button>` props pass through. Extras:

- **Press mechanics** — buttons sink into their own shadow (`active:` /
  `disabled:` states are built in).
- **`data-pressed="true"`** — persistent sunken state, for toggles. Pair with
  `aria-pressed` in React when using it as a toggle button.

### `<Input>`

Native `<input>` props pass through. Styling is state-driven:

- sunken well by default, focus ring in `--ring`, `aria-invalid` switches the
  border to `--danger`, `disabled` uses the muted well.

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

- `titlebar` headers render the signature retro chrome: hatched background +
  small uppercase title.
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
