import { MenuItem, MenuBar, Menu, MenuSeparator } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * MenuBar demos — imported by the doc panel (`page.mdx`).
 */

export function WindowMenus() {
  return (
    <DemoStage>
      <MenuBar label="Window menus">
        <Menu label="File">
          <MenuItem>New dossier</MenuItem>
          <MenuItem shortcut="Ctrl+O">Open…</MenuItem>
          <MenuItem disabled>Save template</MenuItem>
          <MenuSeparator />
          <MenuItem>Exit</MenuItem>
        </Menu>
        <Menu label="Edit">
          <MenuItem shortcut="Ctrl+Z">Undo move</MenuItem>
          <MenuItem disabled>Redo move</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="Ctrl+V">Paste</MenuItem>
          <MenuItem shortcut="Ctrl+A">Select all</MenuItem>
        </Menu>
        <Menu label="View" align="end">
          <MenuItem shortcut="F5">Refresh</MenuItem>
          <MenuItem>Large icons</MenuItem>
          <MenuItem>Details</MenuItem>
        </Menu>
      </MenuBar>
    </DemoStage>
  );
}
