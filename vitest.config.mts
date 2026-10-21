import { fileURLToPath } from "node:url";

import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));
const docs = fileURLToPath(new URL("./apps/docs/src", import.meta.url));
const ui = fileURLToPath(new URL("./packages/ui/src", import.meta.url));

export default defineConfig({
  // the doc pages are MDX, and the demo smoke tests render the demos
  // that now live inside them
  plugins: [react(), mdx()],
  resolve: {
    alias: {
      "@": docs,
      "@retro-ui/ui": `${ui}/index.ts`,
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: [`${root}vitest.setup.ts`],
    include: [
      "apps/*/src/**/*.test.{ts,tsx}",
      "packages/*/src/**/*.test.{ts,tsx}",
    ],
    globals: false,
  },
});
