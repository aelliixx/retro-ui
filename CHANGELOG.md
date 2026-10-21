# Changelog

All notable changes to retro/ui, newest first. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [semantic versioning](https://semver.org/).

## Unreleased

### Added

- **The toast can be placed** — `position` on the provider puts the
  stack in any corner or at the top and bottom centre, and each toast
  carries its own `tone` and `icon`.

### Changed

- **The toast's default placement is bottom-right**, not bottom-left.
- **The tokens are stacked** — a scale (a ramp per colour family,
  `--accent-1` through `--accent-13`) sits under the names the
  components use, so re-branding a family is a change to the ramp and
  both themes follow.
- **The library's rules sit in a cascade layer** below Tailwind's, so
  a consumer's utilities and plain CSS win whatever the import order.
  The stylesheet declares the order, so it now has to be imported
  *before* `tailwindcss`.

### Fixed

- The Pagination rail stopped changing width as you page.
- The bevels read again in the dark theme.
- The NavigationMenu's panel is positioned when it opens.
- The library's classes reach the browser again — Tailwind never scans
  `node_modules`, so the package's stylesheet declares its own source.

## 0.5.0

### Added

- **Badge, AspectRatio, Status and Pagination** — four more components.
  Status came out of Avatar and carries a label of its own.

## 0.4.0

### Added

- **NavigationMenu, Switch, Slider, Tabs, ToggleGroup, Separator,
  Toast, Toggle, ScrollArea, PasswordToggleField, Collapsible, Skeleton
  and Table** — thirteen components.

### Changed

- The Toast holds its auto-dismiss timer while the pointer rests on it.
- The ToggleGroup lays out horizontally by default.
- The Skeleton follows the Radix Themes API.

### Fixed

- The Checkbox no longer double-toggles on Gecko, where a label
  forwards its click to the control.

## 0.3.0

### Added

- **Dialog, Avatar, Accordion, MenuBar and RadioGroup** — five
  components.
- The `bg-backdrop` utility — the era's dithered modal dimmer.

### Changed

- The Progress fill is a solid line, and the Select's dropdown is
  themed rather than the platform's.

### Fixed

- The Select's closed label centres in `base-select` mode.
- The LoadingIcon's sand flip is visible.

## 0.2.0

### Added

- **Checkbox, Select, Textarea, Progress, LoadingIcon and Tooltip** —
  six components.

## 0.1.0

### Added

- **Button, Field, Input and Card** — the first four components.
- Two-tone bevels instead of drop shadows, a hatched texture instead
  of gradient title bars, and instant states.
