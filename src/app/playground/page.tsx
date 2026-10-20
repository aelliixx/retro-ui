import type { Metadata } from "next";

import { PlaygroundPage } from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground · retro/ui",
  description:
    "All 32 retro/ui components in working order, with a collapsed code snippet on every demo.",
};

export default function Page() {
  return <PlaygroundPage />;
}
