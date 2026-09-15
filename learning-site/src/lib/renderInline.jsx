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
//
// NESTING
// The curriculum writes bold that CONTAINS inline code — ``**`/etc`**`` — which
// a single-pass alternation cannot handle: the bold branch excludes asterisks
// but not backticks, and the code branch would split the bold open. So the
// string is scanned once with an ordered pattern that matches bold and italic
// BEFORE code, and the inner text of a matched bold/italic run is recursively
// formatted. That resolves nesting without a full Markdown parser.

// Alternation order matters: **bold** must be tried before *italic*, and both
// before `code`, so a marker pair is consumed as a unit.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

function format(text, keyPrefix, depth) {
  if (typeof text !== "string" || text === "") return text;
  if (!/[*`]/.test(text)) return text;

  const parts = text.split(TOKEN).filter((p) => p !== "");
  const out = [];

  parts.forEach((part, i) => {
    const key = `${keyPrefix}-${i}`;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      // Recurse so `code` inside bold still becomes a <code> element.
      out.push(<strong key={key}>{format(part.slice(2, -2), key, depth + 1)}</strong>);
      return;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push(<code key={key}>{part.slice(1, -1)}</code>);
      return;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push(<em key={key}>{format(part.slice(1, -1), key, depth + 1)}</em>);
      return;
    }
    out.push(part);
  });

  return out;
}

/**
 * Turn one content string into React nodes.
 * @param {string} text
 * @param {string} keyPrefix stable prefix so React keys stay unique
 * @returns {Array|string} React nodes, or the original string when nothing matched
 */
export function renderInline(text, keyPrefix = "md") {
  if (typeof text !== "string" || text === "") return text;
  // Fast path: nothing to format, so return the original string untouched.
  if (!/[*`]/.test(text)) return text;
  return format(text, keyPrefix, 0);
}