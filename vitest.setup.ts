import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// testing-library's auto-cleanup only hooks a global afterEach; with
// `globals: false` we unregister rendered trees ourselves between tests.
afterEach(() => {
  cleanup();
});
