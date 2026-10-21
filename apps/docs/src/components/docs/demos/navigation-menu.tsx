import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * NavigationMenu demos — imported by the doc panel (`page.mdx`).
 */

export function HorizontalNav() {
  return (
    <DemoStage>
      <NavigationMenu label="Main">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink active href="#">
              Desktop
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Library</NavigationMenuTrigger>
            <NavigationMenuContent className="w-72">
              <div className="grid gap-0.5">
                <NavigationMenuLink href="#docs">
                  <span className="font-bold">Docs</span>
                  <span className="block text-xs text-ink-muted">
                    API reference for every primitive
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#tokens">
                  <span className="font-bold">Tokens</span>
                  <span className="block text-xs text-ink-muted">
                    Rebrand from one CSS variable sheet
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#themes">
                  <span className="font-bold">Themes</span>
                  <span className="block text-xs text-ink-muted">
                    Light and dark workstation skins
                  </span>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Help</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-0.5">
                <NavigationMenuLink href="#kb">Knowledge Base</NavigationMenuLink>
                <NavigationMenuLink href="#keyboard">
                  Keyboard Shortcuts
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </DemoStage>
  );
}

export function VerticalNav() {
  return (
    <DemoStage>
      <NavigationMenu label="Sidebar" orientation="vertical">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#new">New…</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>File</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-0.5">
                <NavigationMenuLink href="#open">Open…</NavigationMenuLink>
                <NavigationMenuLink href="#rename">Rename</NavigationMenuLink>
                <NavigationMenuLink href="#delete">Delete</NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Options</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#settings">Settings…</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </DemoStage>
  );
}
