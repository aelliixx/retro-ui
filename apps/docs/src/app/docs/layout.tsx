import { Card, CardContent, CardHeader, CardTitle } from "@retroui/ui";

import { DocsTitlebarControls } from "@/components/docs/docs-controls";
import { DocPager } from "@/components/docs/docs-pager";
import { DocTree } from "@/components/docs/docs-tree";
import Link from "next/link";

/**
 * The docs window — full screen, like a truly maximized application:
 * hatched titlebar against the top edge, explorer-style two panes under
 * it (nav | content), each scrolling on its own. No desktop shows through.
 * Below `lg` the left pane moves into the titlebar's Menu drawer.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-dvh">
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader variant="titlebar" className="justify-between gap-3">
          <CardTitle className="flex items-baseline min-w-0 truncate">
            <Link href="/" className="no-underline group">
              retro/ui
            </Link>
              <span className="ml-1">— documentation</span>
          </CardTitle>
          <DocsTitlebarControls />
        </CardHeader>
        <CardContent className="grid min-h-0 flex-1 grid-cols-1 p-0 lg:grid-cols-[16rem_1fr]">
          <aside className="hidden min-h-0 overflow-y-auto border-r border-ink bg-surface py-6 pl-5 pr-4 lg:block">
            <DocTree />
          </aside>
          <article className="min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-8 sm:px-8 lg:px-10">
              {children}
              <DocPager />
            </div>
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
