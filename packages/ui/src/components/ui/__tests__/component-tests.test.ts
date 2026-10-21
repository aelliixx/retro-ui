import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every component must have a test.
 *
 * A component can ship without a test file and nothing else notices: the
 * library still builds, the doc page still renders, and the demo still
 * works. This check closes that hole — add a component without a test and
 * the suite goes red.
 *
 * The rule is *direct import*: a component counts as tested when some
 * test file names it — `from "../checkbox"`. A barrel import does not
 * count: the cross-cutting audits that use the barrel (the axe sweep)
 * exercise every component without testing any of them. A component may
 * be covered by a shared test file (`inputs.test.tsx` covers Input,
 * Textarea and Select); what matters is that something exercises it, not
 * which file does it.
 */

// the component folder — vitest runs from the workspace root
const UI_DIR = join(process.cwd(), "packages", "ui", "src", "components", "ui");
const TEST_DIR = join(UI_DIR, "__tests__");

/** this file checks the suite rather than a component, so it imports none */
const SELF = "component-tests.test.ts";

/** every component module — the barrel is `index.ts`, not a component */
const componentFiles = readdirSync(UI_DIR)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

const testFiles = readdirSync(TEST_DIR).filter(
  (file) => file.endsWith(".test.tsx") || file.endsWith(".test.ts"),
);

/** component slug → the test files that import it directly */
const coveredBy = new Map<string, string[]>();

for (const testFile of testFiles) {
  const source = readFileSync(join(TEST_DIR, testFile), "utf8");

  // the tests import their component directly (relative, inside the
  // package); the barrel comes in as "../index" and covers no one
  for (const match of source.matchAll(/from\s+"\.\.\/([\w-]+)"/g)) {
    const slug = match[1];
    if (slug === "index") continue;
    coveredBy.set(slug, [...(coveredBy.get(slug) ?? []), testFile]);
  }
}

describe("every component has a test", () => {
  it("finds the component files", () => {
    expect(componentFiles.length).toBeGreaterThan(0);
    expect(testFiles.length).toBeGreaterThan(0);
  });

  it("exercises every component in a test", () => {
    const untested = componentFiles.filter(
      (component) => !coveredBy.has(component),
    );

    expect(
      untested.map((component) => ({
        component,
        hint: `add packages/ui/src/components/ui/__tests__/${component}.test.tsx`,
      })),
    ).toEqual([]);
  });

  it("has no test file that exercises nothing", () => {
    // a test file that imports no component is either empty or stale
    // (this file is the exception — it checks the suite, not a component)
    const orphans = testFiles.filter((testFile) => {
      if (testFile === SELF) return false;
      const source = readFileSync(join(TEST_DIR, testFile), "utf8");
      return !/from\s+"\.\.\/[\w-]+"/.test(source);
    });

    expect(orphans).toEqual([]);
  });

  it("points every component at a test file that exists", () => {
    for (const [component, tests] of coveredBy) {
      expect(componentFiles).toContain(component);
      for (const testFile of tests) {
        expect(testFiles).toContain(testFile);
      }
    }
  });
});
