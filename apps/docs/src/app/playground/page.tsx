import type { Metadata } from "next";

import { PlaygroundPage } from "@/components/playground";
import { COMPONENT_COUNT } from "@retro-ui/ui";

export const metadata: Metadata = {
  title: "Playground · retro/ui",
  description: `All ${COMPONENT_COUNT} retro/ui components in working order, with a collapsed code snippet on every demo.`,
};

export default function Page() {
  return <PlaygroundPage />;
}
