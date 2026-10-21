# Changelog

All notable changes to retro/ui, newest first. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [semantic versioning](https://semver.org/).

## Unreleased

### Added

- **Badge, AspectRatio, Status and Pagination** — four more components,
  28 to 32. Status came out of Avatar and carries a label of its own.
- **A token scale** — a ramp per colour family (`--accent-1` through
  `--accent-13`) under the names the components use, so re-branding a
  family is a change to the ramp and both themes follow.
- **A cascade layer** — the library's own rules sit in a `retro-ui`
  layer below Tailwind's, so a consumer's utilities and plain CSS win
  whatever the import order.
- **Visual tests** — 62 screenshots of the playground, one per section,
  in light and dark, compared against stored baselines.
- **A publishable package** — `@retro-ui/ui` ships a build with types,
  the stylesheets, and a manifest that points at it.

### Changed

- The repository is a workspace now: `packages/ui` holds the library,
  `apps/docs` the site.
- The doc demos live in their pages. An MDX page is a server component,
  so the eight demos that read React state sit in a `demo.tsx` beside
  the page.
- The installation guide leads with the package; copying the source is
  still there.

### Fixed

- The library's classes reach the browser again. Tailwind never scans
  `node_modules`, so the package's stylesheet now declares its own
  source.
- The NavigationMenu opened on the first click.
- The Pagination rail stopped changing width as you page.
- The bevels read again in the dark theme.

## 0.5.0 — 2026-10-20

### Added

- **A test suite** — one test file per component, beside it, covering
  what the component promises: variants and class composition,
  controlled and uncontrolled state, keyboard operation, disabled
  behaviour, and the accessibility wiring.
- **An axe audit** — every component is checked for accessibility
  violations.
- **A coverage script** — `npm run test:coverage`.

## 0.4.0 — 2026-10-20

### Added

- **Doc panels for all 28 components** — a live demo and a
  copy-pasteable snippet per component, with API tables.
- **Switch, Slider, Tabs, ToggleGroup, Separator, Toast, Toggle,
  ScrollArea, PasswordToggleField, Collapsible, Skeleton and Table** —
  the components that landed between 0.3.0 and 0.4.0.
- **The documentation itself** — an MDX pipeline with build-time syntax
  highlighting, the docs shell, and a playground that shows every
  component.

## 0.3.0 — 2026-10-19

### Added

- **Dialog, Avatar, Accordion, MenuBar and RadioGroup** — five
  components.
- **The `bg-backdrop` utility** — the era's dithered modal dimmer.

### Fixed

- The Gecko label-forwarded click that double-toggled a Checkbox.

## 0.2.0 — 2026-10-19

### Added

- **Checkbox, Select, Textarea, Progress, LoadingIcon and Tooltip** —
  six components.
- **Collapsible playground code examples** — the snippets collapse when
  they grow past a dozen lines.

## 0.1.0 — 2026-10-19

### Added

- **Button, Field, Input and Card** — the first four components.
- **The playground** — every component, with its variants, in one page.
- **The design tokens** — two-tone bevels instead of drop shadows, a
  hatched texture instead of gradient title bars, and instant states.
