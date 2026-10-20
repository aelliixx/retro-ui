import { Switch } from "@/components/ui";

/**
 * Switch demos — imported by the doc panel (`page.mdx`).
 */

export function SwitchStates() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <label className="flex items-center gap-2 text-sm text-ink">
        <Switch defaultChecked /> AutoSave
      </label>
      <label className="flex items-center gap-2 text-sm text-ink">
        <Switch /> History
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <Switch disabled defaultChecked /> Ping watchdog
      </label>
    </div>
  );
}

export function SwitchSurface() {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <Switch defaultChecked tinted={false} /> Tion-free tint
    </label>
  );
}
