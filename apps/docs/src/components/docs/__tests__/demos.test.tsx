import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

/**
 * Demo smoke tests.
 *
 * Every demo the doc pages show is rendered here. The demos live in the
 * pages themselves (a demo that reads React state sits beside its
 * page, in `demo.tsx`), and a broken demo does not fail anything
 * else: the page still builds, the component's own test still passes,
 * and the page just renders a hole. These tests are the cheapest
 * possible check — the demo mounts and paints something.
 *
 * Behaviour is verified by the component's own test; this only asks
 * "does it still work?".
 */

/** every doc page, and the client demo beside it where there is one */
const pages = import.meta.glob(
  "/apps/docs/src/app/docs/components/*/page.mdx",
  { eager: true },
) as Record<string, Record<string, unknown>>;

const clientDemos = import.meta.glob(
  "/apps/docs/src/app/docs/components/*/demo.tsx",
  { eager: true },
) as Record<string, Record<string, unknown>>;

/** the demos a module exports — the functions, not the metadata object */
function demos(module: Record<string, unknown>) {
  return Object.entries(module).filter(
    ([name, exported]) =>
      name !== "default" && typeof exported === "function",
  ) as [string, React.ComponentType][];
}

describe("demo smoke tests", () => {
  it("finds every doc page", () => {
    // a page the glob misses would never have its demos rendered
    expect(Object.keys(pages)).toHaveLength(32);
  });

  it("finds the client demos", () => {
    // the demos that read React state sit beside their page
    expect(Object.keys(clientDemos)).toHaveLength(8);
  });

  for (const [path, module] of Object.entries(pages)) {
    const slug = path.split("/").at(-2) ?? path;

    for (const [name, Demo] of demos(module)) {
      it(`${slug} · ${name} renders`, () => {
        const { container, unmount } = render(<Demo />);

        // an empty render would pass a smoke test vacuously
        expect(container.innerHTML).not.toBe("");

        unmount();
      });
    }
  }

  for (const [path, module] of Object.entries(clientDemos)) {
    const slug = path.split("/").at(-2) ?? path;

    for (const [name, Demo] of demos(module)) {
      it(`${slug} · ${name} renders`, () => {
        const { container, unmount } = render(<Demo />);

        expect(container.innerHTML).not.toBe("");

        unmount();
      });
    }
  }
});
