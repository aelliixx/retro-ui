/**
 * rehype plugin: fold large highlighted code wells into native
 * `<details>` disclosures. Runs after `@shikijs/rehype`, so it sees the
 * finished `pre.shiki` elements; wells under the line threshold stay
 * exactly as they were.
 *
 * Options are a plain serializable object (Turbopack requirement):
 * `{ minLines = 12, label = "Code" }`.
 *
 * Two facts this plugin works around:
 * - shiki writes its theme classes on `properties.class` as a plain
 *   string (it never fills `className`), so the merge below normalizes
 *   that string into the complete `className` array — otherwise the
 *   JSX compiler renders only one of the two class attributes and the
 *   folded well loses its syntax-highlight classes.
 * - shiki's flattened text drops the final newline, so a proper line
 *   count means: strip one trailing newline, then split.
 */
export default function rehypeCollapseDemos(options = {}) {
  const minLines = options.minLines ?? 12;
  const label = options.label ?? "Code";

  /** full flattened code text of a HAST subtree */
  function flatten(node) {
    if (node.type === "text") return node.value;
    return (node.children ?? []).map(flatten).join("");
  }

  /** visual line count: "a\nb\n" and "a\nb" are both two lines */
  function countLines(node) {
    const text = flatten(node);
    return (text.endsWith("\n") ? text.slice(0, -1) : text).split("\n").length;
  }

  return (tree) => {
    /** Walk with parent context so `pre` can be spliced out into its
        disclosure wrapper. Depth-first, in document order. */
    const walk = (parent) => {
      const out = [];
      for (const child of parent.children ?? []) {
        if (
          child.type === "element" &&
          child.tagName === "pre" &&
          countLines(child) >= minLines
        ) {
          child.properties ??= {};
          const prior = child.properties.className ?? child.properties.class;
          child.properties.className = [
            ...(Array.isArray(prior) ? prior : prior ? String(prior).split(" ") : []),
            "doc-collapse-well",
          ];
          delete child.properties.class;
          out.push({
            type: "element",
            tagName: "details",
            properties: { className: ["doc-collapse"] },
            children: [
              {
                type: "element",
                tagName: "summary",
                properties: { className: ["doc-collapse-chip"] },
                children: [{ type: "text", value: label }],
              },
              child,
            ],
          });
        } else if (child.type === "element" || child.type === "root") {
          walk(child);
          out.push(child);
        } else {
          out.push(child);
        }
      }
      parent.children = out;
    };
    walk(tree);
  };
}
