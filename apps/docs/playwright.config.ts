import { defineConfig, devices } from "@playwright/test";

/**
 * Visual tests.
 *
 * The playground shows every component and every variant in one page, so
 * it is the natural subject: one screenshot per section, compared
 * against a stored baseline.
 *
 * The tests run against the *exported* site, not the dev server — a
 * production build is what a visitor gets, and its CSS is what the
 * baselines are made of.
 */
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://127.0.0.1:4321",
    // the library honours prefers-reduced-motion, which parks the
    // hourglass — the one thing in the library that moves
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },

  expect: {
    toHaveScreenshot: {
      // a stray antialiased pixel is not a visual change
      maxDiffPixelRatio: 0.005,
      // the hourglass is parked, but nothing else should be mid-animation
      animations: "disabled",
    },
  },

  projects: [
    {
      name: "light",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "dark",
      use: {
        ...devices["Desktop Chrome"],
        // the theme is a class on <html>, kept in localStorage — the
        // layout's init script reads it before the first paint
        storageState: "tests/visual/fixtures/dark-theme.json",
      },
    },
  ],

  webServer: {
    command: "npm run build && node scripts/serve-export.mjs",
    url: "http://127.0.0.1:4321/playground",
    // never reuse a running server: it would serve the export as it was
    // before the change, and the test would pass against a stale build
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
