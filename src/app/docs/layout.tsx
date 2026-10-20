import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import { DocsTitlebarControls } from "@/components/docs/docs-controls";
import { DocPager } from "@/components/docs/docs-pager";
import { DocTree } from "@/components/docs/docs-tree";

/**
 * The docs window — the same desktop as the playground, but this card is
 * a maximized application: hatched titlebar up top, explorer-style two
 * panes under it (nav | content), each scrolling on its own. Below `lg`
 * the left pane moves into the titlebar's Menu drawer.
 */
export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-desktop bg-dither p-4 sm:p-8">
      <main className="mx-auto h-[calc(100dvh-2rem)] w-full max-w-6xl sm:h-[calc(100dvh-4rem)]">
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader variant="titlebar" className="justify-between gap-3">
            <CardTitle className="min-w-0 truncate">
              retro/ui — documentation
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
      </main>
    </div>
  );
}
