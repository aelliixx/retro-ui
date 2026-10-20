import { redirect } from "next/navigation";

/** `/docs` is one page — the Introduction. Send stray roots there. */
export default function DocsIndexPage() {
  redirect("/docs/introduction");
}
