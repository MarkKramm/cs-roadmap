// Markdown-subset parser for the lesson region of a phase file.
//
// WHY THIS EXISTS
// The site originally rendered only the structured sections (goal, skills,
// checklist, tools). Measured across both tracks, the `## Lesson:` region is
// 84–95% of every phase file — so the site was showing roughly a tenth of the
// curriculum. This parser turns that region into a block AST the React layer
// can render.
//
// WHY NOT A DEPENDENCY
// D-006 scopes the site to plain CSS and no component library; D-003/D-005 keep
// the content side dependency-free. So this supports exactly the Markdown
// subset the curriculum actually uses, which was measured rather than assumed
// (see docs/CONTENT-SCHEMA.md → "Lesson blocks"):
//
//   h3 (163) · h4 (569) · h5 (0) · paragraphs (2762) · ul (813) · ol (484)
//   nested ul (7) · table rows (1711) · fences (608) · blockquote (182)
//   inline bold/code/italic, and no h5, images, footnotes, or raw HTML.
//
// The parser never drops a line: anything that does not match a known block
// becomes a paragraph, and `unknown` records any line that looked structural
// but was not handled, so a future authoring change fails loudly in the audit
// instead of silently disappearing from the page.

const FENCE = /^\s*(`{3,}|~{3,})(.*)$/;

// Heading depth is matched relative to a BASE, because the two corpora this
// parser reads start at different depths.
//
// A lesson is authored INSIDE `## Lesson: …`, so its headings are the third,
// fourth and fifth levels — see the census above: h3 163, h4 569, h5 0. A shared
// strategy document (career-roadmaps/shared/) is a standalone file with no
// enclosing section, so it is authored `# Title`, `## Section`, `### Subsection`
// — the first, second and third levels.
//
// Before this parameter existed, `## Minimum Effective Study Day` matched none of
// the three anchored patterns and fell through to the paragraph branch, reaching
// the page with its hashes visible to the reader. Silent content degradation is
// the exact failure class `audit-lesson-ast.mjs` and the smoke sweep exist to
// catch, so the depth is now declared rather than assumed. The default is 3,
// which keeps the lesson path byte-identical.
const headingRe = (level) => new RegExp("^" + "#".repeat(level) + "\\s+(.*)$");
const BULLET = /^(\s*)[-*]\s+(.*)$/;
const ORDERED = /^(\s*)\d+\.\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_DELIM = /^\s*\|[\s:|-]+\|\s*$/;

// Stable, readable anchor for a heading. Duplicates get a numeric suffix so a
// table of contents never links two entries to the same place.
export function slugify(text, seen = new Map()) {
  const base = text
    .toLowerCase()
    .replace(/[`*_[\]]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60) || "section";
  const n = seen.get(base) || 0;
  seen.set(base, n + 1);
  return n === 0 ? base : base + "-" + (n + 1);
}

// Split a table row into cells, honouring two escapes:
//   - `\|` is a literal pipe (used for Nmap's `open|filtered` state).
//   - A pipe INSIDE a code span is literal too, because the curriculum has
//     payloads like `*)(uid=*))(|(uid=*` whose pipes are content, not columns.
// Splitting naively on every `|` broke both cases: one cell became two, and the
// stray backtick then leaked into the rendered page as literal text.
function cells(row) {
  const inner = row.trim().replace(/^\|/, "").replace(/\|$/, "");
  const out = [];
  let buf = "";
  let inCode = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (ch === "\\" && inner[i + 1] === "|") {
      buf += "|";
      i++;
      continue;
    }
    if (ch === "`") {
      inCode = !inCode;
      buf += ch;
      continue;
    }
    if (ch === "|" && !inCode) {
      out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  out.push(buf.trim());
  return out;
}

// Build a nested list from flat entries.
//
// The rule is simply: compare each entry's indent to the PREVIOUS entry's. If it
// is greater the entry starts a child list under the previous item; if it is
// equal it is a sibling; if it is smaller it closes one or more levels. Tracking
// "the indent of the current container" instead of "the indent of the previous
// entry" is what made an earlier version nest seventeen flat sibling bullets
// under the first one — with flat input the container indent never matched the
// entry indent, so every item looked deeper than the container.
//
// A marker-type change at the same level (a `1.` inside a `-` list) opens a
// sibling list so it renders as its own <ol> rather than continuing the <ul>.
function buildList(entries) {
  const root = { type: "list", ordered: entries[0].ordered, items: [] };

  // Each frame is the list currently accepting items, plus the indent of the
  // entries that belong to it.
  const stack = [{ indent: entries[0].indent, ordered: entries[0].ordered, list: root }];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];

    if (i > 0) {
      const prev = entries[i - 1];
      const top = stack[stack.length - 1];

      if (e.indent > prev.indent) {
        // Deeper than the previous entry: open a child list on the last item.
        const parentItem = top.list.items[top.list.items.length - 1];
        const child = { type: "list", ordered: e.ordered, items: [] };
        parentItem.children.push(child);
        stack.push({ indent: e.indent, ordered: e.ordered, list: child });
      } else if (e.indent < prev.indent) {
        // Shallower: close levels until the indent matches again.
        while (stack.length > 1 && stack[stack.length - 1].indent > e.indent) stack.pop();
        const now = stack[stack.length - 1];
        // A dedent can land on a level whose marker type differs.
        if (now.ordered !== e.ordered && e.indent === prev.indent) {
          const sibling = { type: "list", ordered: e.ordered, items: [] };
          now.list.items[now.list.items.length - 1].children.push(sibling);
          stack.push({ indent: e.indent, ordered: e.ordered, list: sibling });
        }
      } else if (top.ordered !== e.ordered) {
        // Same indent, different marker: a sibling list nested on the last item.
        const sibling = { type: "list", ordered: e.ordered, items: [] };
        top.list.items[top.list.items.length - 1].children.push(sibling);
        stack.push({ indent: e.indent, ordered: e.ordered, list: sibling });
      }
    }

    // `checked` is omitted entirely for an ordinary bullet rather than written
    // as null. The field only means something for a checkbox item, and carrying
    // `"checked":null` on all ~1,300 list items across the 23 lessons cost a
    // measurable 23 KB of lesson payload for a value that is never read on that
    // path. A renderer tests `item.checked !== undefined` rather than for null.
    const item = { text: e.text, children: [] };
    if (e.checked !== null && e.checked !== undefined) item.checked = e.checked;
    stack[stack.length - 1].list.items.push(item);
  }

  return root;
}

export function parseLesson(markdown, { headingBase = 3 } = {}) {
  const lines = markdown.split("\n");
  const blocks = [];
  const toc = [];
  const seen = new Map();
  const unknown = [];

  // The three depths this parser recognises, relative to the document's own
  // base. Built per call so a lesson and a shared document can be parsed by the
  // same function without either one's headings being wrong.
  const HEAD = [
    headingRe(headingBase),
    headingRe(headingBase + 1),
    headingRe(headingBase + 2),
  ];

  let i = 0;
  let para = [];

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "para", text });
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // --- fenced code ---
    const fence = FENCE.exec(line);
    if (fence) {
      flushPara();
      const marker = fence[1][0];
      const lang = fence[2].trim();
      const body = [];
      i++;
      while (i < lines.length && !new RegExp("^\\s*" + marker + "{3,}").test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      i++; // consume the closing fence
      blocks.push({ type: "code", lang: lang || null, text: body.join("\n") });
      continue;
    }

    // --- headings ---
    // Shallowest first, so `#### ` is never mistaken for `### ` plus a stray
    // hash — the patterns are anchored, so the order is a readability choice
    // rather than a correctness one.
    let head = null;
    let level = 0;
    for (let d = 0; d < HEAD.length; d++) {
      const m = HEAD[d].exec(line);
      if (m) {
        head = m;
        level = headingBase + d;
        break;
      }
    }
    if (head) {
      flushPara();
      const text = head[1].trim();
      const id = slugify(text, seen);
      blocks.push({ type: "heading", level, text, id });
      // The TOC carries the two depths that own a section. For a lesson
      // (base 3) that is h3 and h4, exactly as before; the third depth stays
      // out because it is a paragraph-level label. A shared document's title
      // and its sections are the equivalent pair at its own base.
      if (level <= headingBase + 1) toc.push({ level, text, id });
      i++;
      continue;
    }

    // --- table ---
    if (TABLE_ROW.test(line) && i + 1 < lines.length && TABLE_DELIM.test(lines[i + 1])) {
      flushPara();
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && TABLE_ROW.test(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      blocks.push({ type: "table", head, rows });
      continue;
    }

    // --- blockquote ---
    if (QUOTE.test(line)) {
      flushPara();
      const quoted = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        quoted.push(QUOTE.exec(lines[i])[1]);
        i++;
      }
      // A quote may contain blank-quote lines; keep it one block, split on blanks.
      const groups = quoted.join("\n").split(/\n\s*\n/).map((g) => g.replace(/\n/g, " ").trim()).filter(Boolean);
      blocks.push({ type: "quote", paras: groups });
      continue;
    }

    // --- list ---
    if (BULLET.test(line) || ORDERED.test(line)) {
      flushPara();
      const entries = [];
      while (i < lines.length && (BULLET.test(lines[i]) || ORDERED.test(lines[i]))) {
        const m = BULLET.exec(lines[i]) || ORDERED.exec(lines[i]);
        // A task-list item — `- [ ] thing` — is a checkbox, not a bullet whose
        // text happens to start with brackets. The shared weekly tracker is
        // built almost entirely from these, and rendering `[ ]` as literal text
        // would look like a parser bug rather than a blank box to fill in.
        //
        // `checked` is null for an ordinary bullet and true/false for a
        // checkbox, so a renderer can tell "not a checkbox" from "unchecked".
        let text = m[2].trim();
        let checked = null;
        const box = /^\[([ xX])\]\s*(.*)$/.exec(text);
        if (box) {
          checked = box[1].toLowerCase() === "x";
          text = box[2];
        }
        entries.push({
          indent: m[1].length,
          ordered: ORDERED.test(lines[i]),
          text,
          checked,
        });
        i++;
      }
      blocks.push(buildList(entries));
      continue;
    }

    // --- blank ---
    if (!line.trim()) {
      flushPara();
      i++;
      continue;
    }

    // --- anything else is paragraph text ---
    // Catch constructs the curriculum does not currently use so that adding
    // one is visible rather than silent.
    if (/^\s*(!\[|<[a-z]|\[\^)/i.test(line)) unknown.push(line.trim().slice(0, 80));
    para.push(line.trim());
    i++;
  }

  flushPara();
  return { blocks, toc, unknown, blockCount: blocks.length };
}