import { Avatar } from "@/components/ui";

/**
 * Avatar demo components — imported by the doc panel (`page.mdx`).
 * The complete code for each demo lives in the fenced block under it.
 */

export function AvatarRoster() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" status="online" />
      <Avatar name="Alan Turing" status="away" />
      <Avatar name="Edsger Dijkstra" status="busy" />
      <Avatar name="Barbara Liskov" status="offline" />
      <Avatar name="Maintenance Mode" src="/avatars/missing.png" fallback="MM" />
    </div>
  );
}

export function AvatarSizes() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Katherine Johnson" size="sm" />
      <Avatar name="Katherine Johnson" size="md" />
      <Avatar name="Katherine Johnson" size="lg" />
    </div>
  );
}
