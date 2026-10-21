import { describe, expect, it } from "vitest";

import { COMPONENT_COUNT } from "@retro-ui/ui";
import { closestDocPage, docGroups, docNeighbors, docPageLabel, docPages } from "@/lib/docs-nav";

const components = docGroups.find((group) => group.id === "components")!;

describe("docs navigation", () => {
  it("lists the components alphabetically", () => {
    const labels = components.pages.map((page) => page.label);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b));

    expect(labels).toEqual(sorted);
  });

  it("gives every component page a unique href", () => {
    const hrefs = components.pages.map((page) => page.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("keeps one page per component file", () => {
    expect(components.pages.length).toBe(COMPONENT_COUNT);
  });

  it("walks the neighbours of a page in reading order", () => {
    const { prev, next } = docNeighbors("/docs/components/badge");

    expect(prev?.href).toBe("/docs/components/avatar");
    expect(next?.href).toBe("/docs/components/button");
  });

  it("has no neighbour before the first page", () => {
    const { prev } = docNeighbors(docPages[0].href);

    expect(prev).toBeNull();
  });

  it("has no neighbour after the last page", () => {
    const { next } = docNeighbors(docPages[docPages.length - 1].href);

    expect(next).toBeNull();
  });

  it("returns no neighbours for a page outside the docs", () => {
    expect(docNeighbors("/playground")).toEqual({ prev: null, next: null });
  });

  it("finds the label of a page", () => {
    expect(docPageLabel("/docs/components/pagination")).toBe("Pagination");
  });

  it("finds the label of a page below a doc route", () => {
    expect(docPageLabel("/docs/components/pagination/extra")).toBe("Pagination");
  });

  it("does not let the docs root claim every page below it", () => {
    // /docs is the Introduction, and every other page lives under it —
    // the closest match has to win, or the Introduction labels the lot
    expect(docPageLabel("/docs")).toBe("Introduction");
    expect(docPageLabel("/docs/components/pagination")).toBe("Pagination");
    expect(docPageLabel("/docs/getting-started/styling")).toBe("Styling");
  });

  it("finds the closest page for a path", () => {
    expect(closestDocPage("/docs")?.href).toBe("/docs");
    expect(closestDocPage("/docs/components/pagination")?.href).toBe(
      "/docs/components/pagination",
    );
    expect(closestDocPage("/nowhere")).toBeUndefined();
  });

  it("returns an empty label outside the docs", () => {
    expect(docPageLabel("/playground")).toBe("");
  });
});
