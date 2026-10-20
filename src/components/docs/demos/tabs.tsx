import { Input, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Tabs demos — imported by the doc panel (`page.mdx`).
 */

export function FolderTabs() {
  return (
    <DemoStage>
      <Tabs defaultValue="general" className="max-w-sm">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <p className="text-sm text-ink-muted">
            The classic folder: clicking a tab swaps the page instantly.
          </p>
        </TabsContent>
        <TabsContent value="appearance">
          <p className="text-sm text-ink-muted">
            Panels stay mounted but hidden, so anything inside keeps its
            state while you look around.
          </p>
        </TabsContent>
        <TabsContent value="advanced">
          <p className="text-sm text-ink-muted">
            Arrow keys walk the triggers (Home/End too); moving focus selects
            — automatic activation, like the platform&apos;s best forms.
          </p>
        </TabsContent>
      </Tabs>
    </DemoStage>
  );
}

export function TabsKeptState() {
  return (
    <DemoStage>
      <Tabs defaultValue="one" className="max-w-sm">
        <TabsList>
          <TabsTrigger value="one">Draft one</TabsTrigger>
          <TabsTrigger value="two">Draft two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <Input placeholder="typed here — survives switching" />
        </TabsContent>
        <TabsContent value="two">
          <Input placeholder="so does this one" />
        </TabsContent>
      </Tabs>
    </DemoStage>
  );
}
