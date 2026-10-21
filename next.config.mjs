import createMDX from "@next/mdx";
import { resolve } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // docs pages are .mdx on the filesystem
  pageExtensions: ["ts", "tsx", "mdx"],
  // `/docs` is one page — the Introduction.
  //
  // This is a routing rule, not a page that calls redirect(): with
  // cacheComponents on, the "instant" validation pass renders the route
  // ahead of time, and a component whose only job is to redirect throws
  // NEXT_REDIRECT there — which Next reports as
  // "Could not validate `instant` because an error prevented the target
  // segment from rendering" the first time the route is hit in dev.
  // A rule below never renders anything, so it cannot fail that way.
  async redirects() {
    return [
      { source: "/docs", destination: "/docs/introduction", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  // turbopack requires serializable plugin names (object form below);
  // gfm: GFM tables etc. · slug: heading anchors for the docs
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      // slug: heading anchors for the docs
      "rehype-slug",
      // build-time syntax highlighting; dual themes are emitted as CSS
      // variables so the `.dark` class flips palettes with no re-render
      ["@shikijs/rehype", {
        themes: { light: "vitesse-light", dark: "vitesse-dark" },
        defaultColor: false,
      }],
      // fold code wells of minLines+ lines into <details> disclosures.
      // Local plugins load through require.resolve against the MDX file's
      // own directory, so an absolute path from the project root is the
      // only portable way to point at it.
      [resolve("src/mdx-plugins/collapse-demos.mjs"), { minLines: 12 }],
    ],
  },
});

export default withMDX(nextConfig);
