import axe from "axe-core";
import { render } from "@testing-library/react";
import { expect } from "vitest";

/**
 * Accessibility audit helper.
 *
 * Runs axe-core over a rendered component and fails the test on any
 * violation of the default rule set (WCAG 2.0/2.1 A and AA).
 *
 * Two notes on what this can and cannot see:
 *
 * - `color-contrast` is reported as *incomplete* here, never as a
 *   violation — the test DOM has no stylesheet, so axe has no colors to
 *   compare. Contrast has to be judged in a real browser.
 * - the fixture is wrapped in a `<main>`, so axe's `region` rule (page
 *   content must sit inside a landmark) is satisfied legitimately rather
 *   than being switched off.
 */
export async function expectNoA11yViolations(ui: React.ReactElement) {
  const { container } = render(<main>{ui}</main>);

  // an empty render would pass axe vacuously — 0 violations, 0 passes —
  // so make sure there is actually something to audit
  const main = container.querySelector("main");
  expect(main?.childElementCount ?? 0).toBeGreaterThan(0);

  const results = await axe.run(container);

  expect(
    results.violations.map((violation) => ({
      rule: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.html),
    })),
  ).toEqual([]);
}

/** the rules that could never pass in a style-less test DOM */
export const AXE_INCOMPLETE_RULES = ["color-contrast"];
