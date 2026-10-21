# @retro-ui/ui

React + Tailwind components styled after 90s desktop UIs — carved group
boxes, sunken input wells, hatched title bars and honest two-tone bevels —
rebuilt with modern design tokens, light and dark theming, and full
`className` composition.

No runtime, no theme provider, no CSS-in-JS. Tailwind v4 tokens, React 19
peer dependencies, and a stylesheet you import once.

## Install

```sh
npm install @retro-ui/ui
```

`react`, `react-dom` and `tailwindcss` (v4) are peer dependencies.

## Setup

Import the library's stylesheet into your global CSS, after Tailwind:

```css
/* app/globals.css — the library first, so its cascade layer order counts */
@import "@retro-ui/ui/styles.css";
@import "tailwindcss";
```

The library's own rules sit in a `retro-ui` cascade layer below
Tailwind's, so your utilities and your plain CSS always win — no
`!important`, no import order to remember. The order is declared by the
stylesheet, which is why it is imported first.

Two files are published separately if you would rather take one at a time:
`@retro-ui/ui/tokens.css` (the theming contract — the variables and the
`@theme inline` mapping) and `@retro-ui/ui/utilities.css` (the component
skin — the etched focus ring, the era's textures, the styled slider).

The stylesheet declares its own source, so Tailwind picks up the class names
the components use without any extra configuration.

## Use

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@retro-ui/ui";

export function Example() {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">OK</Button>
      </CardContent>
    </Card>
  );
}
```

Every component takes a `className` and composes it with `tailwind-merge`,
so a consumer's class always wins over the library's.

## Theming

Every colour, font and depth value is a plain CSS variable. Override them
and the whole library re-brands itself:

```css
:root {
  --surface: #eaeef2;
  --ink: #171a20;
  --accent: #0f766e;
  --bevel-light: #fcfdff;
  --bevel-dark: #8d95a3;
}

.dark {
  --surface: #1a1e28;
  --accent: #2dd4bf;
}
```

The dark theme is a class on `<html>`, not a media query, so the consumer
owns the switch.

The colours sit on a scale: a ramp per family (`--accent-1` …
`--accent-13`), and the names above are indirections into it. Override a
ramp step to re-brand the family, and both themes follow.

## Components

Accordion · AspectRatio · Avatar · Badge · Button · Card · Checkbox ·
Collapsible · Dialog · Field · Input · LoadingIcon · MenuBar ·
NavigationMenu · Pagination · PasswordToggleField · Progress · RadioGroup ·
ScrollArea · Select · Separator · Skeleton · Slider · Status · Switch ·
Table · Tabs · Textarea · Toast · Toggle · ToggleGroup · Tooltip

## Copy the source instead

The library is also distributed as source: copy
`packages/ui/src/components/ui/*.tsx` and `packages/ui/src/lib/utils.ts`
into your project and tailor them in place. The files use relative imports
and no path aliases, so they work wherever you drop them.

## License

MIT
