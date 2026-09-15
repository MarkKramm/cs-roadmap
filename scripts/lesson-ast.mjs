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
const H3 = /^###\s+(.*)$/;
const H4 = /^####\s+(.*)$/;
const H5 = /^#####\s+(.*)$/;
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

    stack[stack.length - 1].list.items.push({ text: e.text, children: [] });
  }

  return root;
}

export function parseLesson(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  const toc = [];
  const seen = new Map();
  const unknown = [];

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
    const h3 = H3.exec(line);
    const h4 = H4.exec(line);
    const h5 = H5.exec(line);
    if (h3 || h4 || h5) {
      flushPara();
      const level = h3 ? 3 : h4 ? 4 : 5;
      const text = (h3 || h4 || h5)[1].trim();
      const id = slugify(text, seen);
      blocks.push({ type: "heading", level, text, id });
      if (level <= 4) toc.push({ level, text, id });
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
        entries.push({
          indent: m[1].length,
          ordered: ORDERED.test(lines[i]),
          text: m[2].trim(),
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