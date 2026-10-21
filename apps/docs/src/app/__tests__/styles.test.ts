import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The library's classes must reach the browser.
 *
 * Tailwind scans the app's own source and never node_modules, so the
 * library — which lives in `packages/ui`, outside the app — is invisible
 * to the scanner unless its stylesheet says otherwise. When that
 * declaration went missing, the library still built, still rendered and
 * still passed every test: the components simply came out unstyled,
 * because the utility classes they use were never generated.
 *
 * These checks fail loudly instead.
 */

const ROOT = process.cwd();
const APP = join(ROOT, "apps", "docs", "src", "app");
const PKG = join(ROOT, "packages", "ui", "src");

const globals = readFileSync(join(APP, "globals.css"), "utf8");
const tokensPath = join(PKG, "styles", "tokens.css");
const tokens = readFileSync(tokensPath, "utf8");

describe("the docs stylesheet", () => {
  it("imports the library's stylesheets", () => {
    expect(globals).toContain('@import "@retro-ui/ui/tokens.css"');
    expect(globals).toContain('@import "@retro-ui/ui/utilities.css"');
  });

  it("points Tailwind at the library's own source", () => {
    const source = tokens.match(/@source\s+"([^"]+)"/)?.[1];

    expect(
      source,
      "the package's stylesheet must declare @source, or its classes are never generated",
    ).toBeTruthy();

    // the path is relative to the stylesheet that declares it
    const scanned = resolve(dirname(tokensPath), source ?? "");

    // and it has to cover every component — the published layout scans
    // the compiled JavaScript from the same relative path
    const components = join(PKG, "components", "ui");
    const files = readdirSync(components).filter((file) => file.endsWith(".tsx"));

    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      expect(
        existsSync(join(scanned, "components", "ui", file)),
        `${file} is outside the directory the stylesheet points Tailwind at`,
      ).toBe(true);
    }
  });

  it("keeps the theme mapping in the same file as the tokens", () => {
    // the utilities reference the variables; a consumer who imports only
    // one of the two gets colours with no names
    expect(tokens).toContain("@theme inline");
    expect(tokens).toContain("--surface:");
  });
});
