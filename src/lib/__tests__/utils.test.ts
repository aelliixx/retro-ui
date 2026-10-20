import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("keeps the last of two conflicting utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("lets a consumer override a background color", () => {
    expect(cn("bg-surface", "bg-danger")).toBe("bg-danger");
  });

  it("lets a consumer override the bevel", () => {
    // the house registers shadow-out / shadow-in with tailwind-merge, so a
    // consumer's shadow-none must win instead of both surviving
    expect(cn("shadow-out", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-in", "shadow-out")).toBe("shadow-out");
  });

  it("lets a consumer override the bevel with an arbitrary shadow", () => {
    expect(cn("shadow-out", "shadow-[3px_3px_0_red]")).toBe(
      "shadow-[3px_3px_0_red]",
    );
  });

  it("keeps a texture when a background color joins it", () => {
    // bg-hatch would otherwise be mis-filed under bg-color and dropped
    expect(cn("bg-hatch", "bg-surface")).toBe("bg-hatch bg-surface");
    expect(cn("bg-surface", "bg-hatch")).toBe("bg-surface bg-hatch");
  });

  it("keeps every texture class", () => {
    for (const texture of ["bg-hatch", "bg-dither", "bg-grid", "bg-backdrop"]) {
      expect(cn(texture, "bg-surface")).toContain(texture);
    }
  });

  it("merges border utilities within their own group", () => {
    // width and color are separate groups — a width never cancels a color
    expect(cn("border border-2", "border-0")).toBe("border-0");
    expect(cn("border-ink", "border-danger")).toBe("border-danger");
  });

  it("does not merge unrelated groups", () => {
    expect(cn("flex items-center", "gap-2")).toBe("flex items-center gap-2");
  });

  it("accepts conditional class values", () => {
    expect(cn("base", true && "on", false && "off")).toBe("base on");
  });

  it("accepts arrays and objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});
