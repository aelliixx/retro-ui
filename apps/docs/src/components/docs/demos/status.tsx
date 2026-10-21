import { Avatar, Status } from "@retro-ui/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Status demos — imported by the doc panel (`page.mdx`). The complete
 * code for each demo lives in the fenced block under it on the page.
 */

export function StatusValues() {
  return (
    <DemoStage>
      <div className="flex flex-wrap items-center gap-6">
        <Status value="online" />
        <Status value="away" />
        <Status value="busy" />
        <Status value="offline" />
      </div>
    </DemoStage>
  );
}

export function StatusSizes() {
  return (
    <DemoStage>
      <div className="flex items-center gap-6">
        <Status size="sm" value="online" />
        <Status size="md" value="online" />
        <Status size="lg" value="online" />
      </div>
    </DemoStage>
  );
}

export function StatusLabeled() {
  return (
    <DemoStage>
      <div className="grid gap-2">
        <Status value="online" label="Online" />
        <Status value="away" label="Away" />
        <Status value="busy" label="In a meeting" />
        <Status value="offline" label="Offline" />
      </div>
    </DemoStage>
  );
}

export function StatusRoster() {
  return (
    <DemoStage>
      <ul className="w-44 [&>li+li]:border-t-0">
        {(
          [
            { name: "ada", status: "online" },
            { name: "grace", status: "busy" },
            { name: "lars", status: "away" },
            { name: "noor", status: "offline" },
          ] as const
        ).map((member) => (
          <li
            key={member.name}
            className="flex items-center justify-between border border-ink bg-surface px-2 py-1"
          >
            <span className="font-mono text-xs">{member.name}</span>
            <Status value={member.status} />
          </li>
        ))}
      </ul>
    </DemoStage>
  );
}

export function StatusInAvatar() {
  return (
    <DemoStage>
      <div className="flex items-end gap-4">
        <Avatar name="Ada Lovelace" status="online" />
        <Avatar name="Lars Bak" status="away" />
        <Avatar name="Noor Nisa" status="busy" />
        <Avatar name="Tim B." status="offline" />
      </div>
    </DemoStage>
  );
}
