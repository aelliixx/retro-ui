import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // docs pages are .mdx on the filesystem
  pageExtensions: ["ts", "tsx", "mdx"],
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
    ],
  },
});

export default withMDX(nextConfig);
