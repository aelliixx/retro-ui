import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // the app router lives in the docs app, not at the workspace root
      "@next/next/no-html-link-for-pages": ["error", "apps/docs/src/app"],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/.next/**",
    "**/out/**",
    "**/dist/**",
    "**/node_modules/**",
  ]),
]);

export default eslintConfig;
