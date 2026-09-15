// Renders the small subset of inline Markdown that appears in the generated
// content JSON: **bold**, `code`, and *italic*.
//
// WHY THIS EXISTS
// The site has no Markdown renderer and deliberately no extra dependency, so
// any **bold** or `code` inside a content string was displayed literally, with
// the asterisks and backticks visible to the reader. The curriculum Markdown
// uses this syntax for emphasis in practice tasks and deliverables, so the
// generated JSON carries it through as plain text.
//
// This is intentionally a formatter for INLINE syntax only. It does not handle
// headings, lists, links, or block structure, because the JSON contains none —
// those are parsed out by scripts/build-content.mjs and become real UI
// elements. Anything unrecognised is rendered as literal text.
//
// SAFETY
// Output is React elements, never HTML, so no dangerouslySetInnerHTML is
// involved and content cannot inject markup.

const TOKEN = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*)/g;

/**
 * Turn one content string into React nodes.
 * @param {string} text
 * @param {string} keyPrefix stable prefix so React keys stay unique
 * @returns {Array} React nodes, or the original string when nothing matched
 */
export function renderInline(text, keyPrefix = "md") {
  if (typeof text !== "string" || text === "") return text;

  // Fast path: nothing to format, so return the original string untouched.
  if (!/[*`]/.test(text)) return text;

  const parts = text.split(TOKEN).filter((p) => p !== "");
  const out = [];

  parts.forEach((part, i) => {
    const key = `${keyPrefix}-${i}`;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push(<strong key={key}>{part.slice(2, -2)}</strong>);
      return;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push(<code key={key}>{part.slice(1, -1)}</code>);
      return;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push(<em key={key}>{part.slice(1, -1)}</em>);
      return;
    }
    out.push(part);
  });

  return out;
}