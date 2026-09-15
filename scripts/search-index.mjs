// Build the full-text search index for the learning site.
//
// DESIGN, and why it is this shape
//
// The obvious approach — store every segment's text — was measured at 1,438 KB
// raw / 473 KB gzipped, because the curriculum has ~1.7 MB of lesson JSON and
// the index duplicated all of it. An average lesson file is only 16 KB
// gzipped, so that index cost the reader roughly thirty lessons' worth of
// download for a feature they use occasionally. Wrong trade for an audience on
// modest connections.
//
// A second approach — windowing long segments for better snippets — was also
// measured, and made it WORSE: 1,438 KB to 1,501 KB, because the overlap
// duplicated text.
//
// This design stores an inverted index instead: term -> segment ids. It
// answers "where is this term" and nothing else. Snippets are rendered from
// the lesson JSON the site ALREADY downloads when the reader opens a phase, so
// no prose is duplicated. Measured at 332 KB raw / 150 KB gzipped, and it is
// fetched only on the reader's first search, never at page load.
//
// Terms shorter than two characters are dropped; everything else is kept,
// including long identifiers. `win32_quickfixengineering`,
// `get-adprincipalgroupmembership` and `driver_irql_not_less_or_equal` are
// precisely what a reader pastes into a search box, so pruning "unusual" terms
// would remove the highest-value queries.
//
// Terms appearing in more than 20% of segments are dropped as non-
// discriminating. That is standard IR and it saves ~10% of the postings; the
// stopword case is handled better by the query scorer than by the index.
//
// Encoding: one line per term, `term:delta,delta,...` with deltas in base36.
// Segments are numbered in document order, so the deltas are small.
//
// Zero dependencies. Contract: docs/CONTENT-SCHEMA.md.

// Terms appearing in more than this fraction of segments are kept in the index
// but flagged, so the query engine can ignore them when intersecting. They are
// poor discriminators, but they must NOT be deleted: a query is an AND over its
// terms, so a missing term makes the whole query return nothing. Removing
// "user" made "user account locked" return zero results with no explanation.
// Flagging instead of deleting lets the engine drop the term from the AND while
// still being able to report it.
const COMMON_SEGMENT_FRACTION = 0.2;
const MIN_TERM_LENGTH = 2;

/**
 * Strip inline Markdown so indexed text is readable prose, not markup.
 * `**bold**` and `` `code` `` would otherwise create terms like "**auditd**".
 */
export function plain(text) {
  return String(text == null ? "" : text)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split text into indexable terms, lowercased.
 *
 * Trailing punctuation is stripped because it otherwise creates separate terms:
 * "timestomped." and "timestomped" would be different entries, so a search for
 * one would miss the other. This is a real bug that was found in testing — a
 * sentence ending "...was timestomped." indexed the word with the period
 * attached.
 *
 * Interior punctuation is KEPT, because identifiers legitimately contain it and
 * are exactly what a reader pastes into a search box:
 * `get-adprincipalgroupmembership`, `page_fault_in_nonpaged_area`,
 * `microsoft-windows-wlan-autoconfig`, `system.windows.forms.screen`.
 */
export function terms(text) {
  const raw = String(text || "").toLowerCase().match(/[a-z0-9][a-z0-9'’._+-]*/g) || [];
  const out = [];
  for (const w of raw) {
    // Strip trailing separators. If that leaves too little to be a term, the
    // token was punctuation-led noise such as a numbered-list marker ("1.", "2+")
    // rather than a word, so drop it outright instead of keeping the punctuated
    // form — which would create an index entry nothing can ever match.
    const t = w.replace(/[._+-]+$/, "");
    if (t.length >= MIN_TERM_LENGTH) out.push(t);
  }
  return out;
}

/**
 * Flatten a lesson's blocks into heading-scoped segments.
 *
 * Segments are cut at h3/h4 headings, which lands a result on roughly a
 * screenful of reading and gives every hit a natural title. Indexing per block
 * would give a huge result list; indexing per lesson would give 23 uselessly
 * broad hits.
 *
 * @param {Array} blocks parsed blocks from lesson-ast.mjs
 * @param {{id:string,title:string,phaseTitle:string,track:string}} meta
 * @returns {Array<{h:string,a:string,p:string,pt:string,k:string,t:string}>}
 */
export function indexLesson(blocks, meta) {
  const segments = [];
  let current = null;

  const start = (heading, anchor) => {
    current = { h: heading, a: anchor, parts: [] };
    segments.push(current);
  };

  // Any text before the first heading belongs to the lesson itself.
  start(meta.title || "Overview", "");

  const addText = (t) => {
    const s = plain(t);
    if (s) current.parts.push(s);
  };

  for (const b of blocks) {
    switch (b.type) {
      case "heading":
        if (b.level === 3 || b.level === 4) start(plain(b.text), b.id || "");
        else addText(b.text);
        break;

      case "para":
        addText(b.text);
        break;

      case "quote":
        (b.paras || []).forEach(addText);
        break;

      case "code":
        // Verbatim: commands, flags and error strings are the most searchable
        // text in the curriculum and are not prose.
        if (b.text) current.parts.push(b.text);
        break;

      case "table":
        addText((b.head || []).join(" "));
        (b.rows || []).forEach((r) => addText(r.join(" ")));
        break;

      case "list": {
        const walk = (list) => {
          for (const item of list.items || []) {
            addText(item.text);
            (item.children || []).forEach((c) => {
              if (c.type === "list") walk(c);
              else addText(c.text);
            });
          }
        };
        walk(b);
        break;
      }

      default:
        // An unrecognised block would silently vanish from search — the same
        // failure mode the lesson renderer guards against. Fail the build.
        throw new Error("search index: unsupported block type " + JSON.stringify(b.type));
    }
  }

  return segments
    .map((s) => ({ h: s.h, a: s.a, t: s.parts.join(" ").trim() }))
    .filter((s) => s.t.length > 0)
    .map((s) => ({ h: s.h, a: s.a, p: meta.id, pt: meta.phaseTitle, k: meta.track, t: s.t }));
}

/**
 * Build the search payload from all lessons of both tracks.
 *
 * @param {Array<{id:string,title:string,phaseTitle:string,track:string,blocks:Array}>} lessons
 * @returns {{segments:Array,terms:Object,generatedAt?:string}}
 */
export function buildSearchIndex(lessons) {
  const segments = [];
  for (const l of lessons) segments.push(...indexLesson(l.blocks, l));

  // Postings: term -> ascending segment ids.
  const postings = new Map();
  segments.forEach((seg, i) => {
    for (const w of new Set(terms(seg.t))) {
      let list = postings.get(w);
      if (!list) postings.set(w, (list = []));
      list.push(i);
    }
  });

  // EVERY term is emitted, including the very common ones. Terms in more than
  // COMMON_SEGMENT_FRACTION of segments are listed separately in `common` so
  // the engine can recognise them, match them, and say so — while not letting
  // them narrow the result set, because a word in a fifth of the corpus narrows
  // nothing useful. Deleting them instead was a bug: a query is an AND over its
  // terms, so a missing term makes the whole query return zero results with no
  // explanation. Pruning "user" broke "user account locked".
  const limit = Math.floor(segments.length * COMMON_SEGMENT_FRACTION);
  const lines = [];
  const common = [];
  for (const [w, list] of postings) {
    if (list.length > limit) {
      common.push(w);
      continue;
    }
    let prev = 0;
    const parts = [];
    for (const n of list) {
      parts.push((n - prev).toString(36));
      prev = n;
    }
    lines.push(w + ":" + parts.join(","));
  }
  lines.sort();
  common.sort();

  // The site needs the segment metadata (heading, lesson id, anchor) to render
  // a result row, but NOT the prose. Only the five short fields are emitted.
  const meta = segments.map((s) => ({ h: s.h, a: s.a, p: s.p, pt: s.pt, k: s.k }));

  return {
    v: 2,
    segments: meta,
    terms: lines.join("\n"),
    common: common.join("\n"),
  };
}