import { readdirSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Demo smoke tests.
 *
 * Every demo in `src/components/docs/demos` is rendered here. The demo
 * files are what the doc pages show, and a broken demo does not fail
 * anything else: the doc page still builds, the component's own test
 * still passes, and the page just renders a hole. These tests are the
 * cheapest possible check — the demo mounts and paints something.
 *
 * Behaviour is verified by the component's own test; this only asks
 * "does it still work?".
 */

/** every demo module, loaded eagerly so each export can be rendered */
const modules = import.meta.glob("../*.tsx", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const demoFiles = readdirSync(join(process.cwd(), "src", "components", "docs", "demos"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

describe("demo smoke tests", () => {
  it("finds every demo file", () => {
    // a new demo that the glob misses would otherwise never be rendered
    expect(Object.keys(modules)).toHaveLength(demoFiles.length);
  });

  for (const file of demoFiles) {
    const path = `../${file}.tsx`;
    const demoModule = modules[path];

    it(`${file} exports at least one demo`, () => {
      expect(demoModule, `no module for ${path}`).toBeDefined();
      expect(Object.keys(demoModule).length).toBeGreaterThan(0);
    });

    for (const [name, exported] of Object.entries(demoModule ?? {})) {
      it(`${file} · ${name} renders`, () => {
        expect(typeof exported, `${file} exports ${name}, which is not a component`).toBe(
          "function",
        );

        const Demo = exported as React.ComponentType;
        const { container, unmount } = render(<Demo />);

        // an empty render would pass a smoke test vacuously
        expect(container.innerHTML).not.toBe("");

        unmount();
      });
    }
  }
});
