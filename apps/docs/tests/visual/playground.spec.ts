import { expect, test } from "@playwright/test";

/**
 * Visual tests for the playground.
 *
 * The playground holds every component and every variant in one page, so
 * it is the natural subject: one screenshot per section, compared
 * against a stored baseline. A change to a bevel, a colour or a font
 * shows up as a failing diff instead of a bug report.
 *
 * The baselines live next to this file. Regenerate them with
 * `npm run test:visual -- --update-snapshots`, and read the diff
 * before committing it — a changed baseline is a changed library.
 *
 * Two things move on their own, and are pinned here: the hourglass
 * (the library honours `prefers-reduced-motion`, which the config
 * sets) and the live copy-job demo (a progress bar that ticks — the
 * clock is frozen so it never advances).
 */

/** the playground's sections, in the order they appear */
const SECTIONS = [
  "Button",
  "Field · Input · Textarea",
  "Checkbox",
  "RadioGroup",
  "Scaling",
  "Defrag mode",
  "Select",
  "Progress · Loading",
  "Card",
  "AspectRatio",
  "Dialog",
  "Avatar",
  "Badge",
  "Status",
  "Accordion",
  "MenuBar",
  "NavigationMenu",
  "Pagination",
  "Tabs",
  "Switch · Slider",
  "ToggleGroup",
  "Separator",
  "Collapsible",
  "Skeleton",
  "Table",
  "PasswordToggleField",
  "ScrollArea",
  "Toast",
  "Tooltip",
  "Design tokens",
];

/** a file name for a section label */
function slug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

test.describe("the playground", () => {
  test("has no section the visual tests do not know about", async ({ page }) => {
    await page.goto("/playground");

    // the legend is uppercased by CSS, so the rendered text is not the
    // label — the source text is
    const legends = await page.locator("fieldset > legend").evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? ""),
    );
    const found = new Set(legends);
    const known = new Set(SECTIONS);

    expect(
      {
        added: [...found].filter((legend) => !known.has(legend)),
        removed: [...known].filter((legend) => !found.has(legend)),
      },
      "the playground's sections changed — add the new ones to SECTIONS",
    ).toEqual({ added: [], removed: [] });
  });

  for (const label of SECTIONS) {
    test(`${label} looks the same`, async ({ page }) => {
      // the live copy-job demo ticks on a timer; frozen, it never moves
      await page.clock.install();

      await page.goto("/playground");
      // webfonts change the metrics — wait for them before measuring
      await page.evaluate(() => document.fonts.ready);

      const section = page.getByRole("group", { name: label });
      await expect(section).toBeVisible();

      await expect(section).toHaveScreenshot(`playground-${slug(label)}.png`);
    });
  }
});
