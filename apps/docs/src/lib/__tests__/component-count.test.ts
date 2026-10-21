import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { COMPONENT_COUNT } from "@retro-ui/ui";
import { docGroups } from "@/lib/docs-nav";

// the workspace root — vitest runs from here, and the library lives in
// packages/ while the site lives in apps/
const ROOT = process.cwd();
const UI_DIR = join(ROOT, "packages", "ui", "src", "components", "ui");
const APP_DIR = join(ROOT, "apps", "docs", "src");

/** every component module in the library — the barrel is not one */
const componentFiles = readdirSync(UI_DIR)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

/** the modules themselves, loaded eagerly so their exports can be checked */
const modules = import.meta.glob(
  "/packages/ui/src/components/ui/*.tsx",
  { eager: true },
) as Record<string, Record<string, unknown>>;

const read = (...path: string[]) => readFileSync(join(ROOT, ...path), "utf8");
const readApp = (...path: string[]) => readFileSync(join(APP_DIR, ...path), "utf8");

/** `password-toggle-field` → `PasswordToggleField` */
const pascal = (slug: string) =>
  slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");

describe("component count", () => {
  it("matches the number of component files", () => {
    expect(componentFiles).toHaveLength(COMPONENT_COUNT);
  });

  it("matches the number of component doc pages", () => {
    const components = docGroups.find((group) => group.id === "components");
    expect(components?.pages).toHaveLength(COMPONENT_COUNT);
  });

  it("has a doc page for every component file", () => {
    const components = docGroups.find((group) => group.id === "components")!;
    const slugs = components.pages.map((page) =>
      page.href.replace("/docs/components/", ""),
    );

    for (const file of componentFiles) {
      expect(slugs).toContain(file);
    }
  });
});

describe("the component barrel", () => {
  const barrel = read("packages", "ui", "src", "components", "ui", "index.ts");

  it("re-exports every component module", () => {
    for (const file of componentFiles) {
      expect(barrel).toContain(`from "./${file}"`);
    }
  });

  it("exports nothing that no longer exists", () => {
    const exported = [...barrel.matchAll(/from "\.\/([\w-]+)"/g)].map(
      (match) => match[1],
    );

    for (const name of exported) {
      expect(componentFiles).toContain(name);
    }
  });

  it("gives every module a runtime export", () => {
    for (const file of componentFiles) {
      const componentModule = modules[`/packages/ui/src/components/ui/${file}.tsx`];
      const runtime = Object.keys(componentModule).filter(
        (name) => name !== "default" && !name.endsWith("Props"),
      );
      expect(runtime.length).toBeGreaterThan(0);
    }
  });

  it("re-exports every component's runtime symbols", async () => {
    const barrelModule = await import("@retro-ui/ui");

    for (const file of componentFiles) {
      const componentModule = modules[`/packages/ui/src/components/ui/${file}.tsx`];
      for (const name of Object.keys(componentModule)) {
        if (name === "default" || name.endsWith("Props")) continue;
        expect(barrelModule).toHaveProperty(name);
      }
    }
  });
});

describe("the count across the site", () => {
  it("is used by the landing page", () => {
    const page = readApp("app", "page.tsx");
    expect(page).toContain("COMPONENT_COUNT");
    expect(page).not.toMatch(/\b\d+ components/);
  });

  it("is used by the playground", () => {
    expect(readApp("components", "playground.tsx")).toContain(
      "COMPONENT_COUNT",
    );
    expect(readApp("app", "playground", "page.tsx")).toContain(
      "COMPONENT_COUNT",
    );
  });

  it("is used by the introduction", () => {
    expect(readApp("app", "docs", "page.mdx")).toContain("COMPONENT_COUNT");
  });

  it("matches the count in the installation notes", () => {
    // a plain code fence — the number is spelled out there
    expect(
      readApp("app", "docs", "getting-started", "installation", "page.mdx"),
    ).toContain(`# ${COMPONENT_COUNT} components + barrel`);
  });

  it("matches the component list in the readme", () => {
    const readme = read("README.md");
    const listed = readme
      .split("Current components: **")[1]
      .split("**")[0]
      .split("·")
      .map((name) => name.trim())
      .filter(Boolean);

    expect(listed).toHaveLength(COMPONENT_COUNT);
    expect(listed.sort()).toEqual(componentFiles.map(pascal).sort());
  });
});
