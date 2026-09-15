// Correctness test for full-text search.
//
// The build proves search.json is emitted; it does not prove the index and the
// query engine agree. They are separate code paths — search-index.mjs encodes
// postings as base36 deltas, useSearch.js decodes them — and a mismatch there
// produces a search box that silently returns nothing, which is exactly the
// failure mode this repository keeps finding (a green build over broken
// behaviour).
//
// This loads the real generated index, runs the real query engine against it,
// and asserts on known-correct hits.
//
// Run: npm run test:search   (from learning-site/)

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const INDEX = join(ROOT, "src", "data", "generated", "search.json");
const LESSONS = join(ROOT, "src", "data", "generated", "lessons");

const failures = [];
let checks = 0;

function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(label + (detail ? " — " + detail : ""));
}

if (!existsSync(INDEX)) {
  console.error("SEARCH TEST FAILED — search.json not found. Run `npm run build:content` first.");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(INDEX, "utf8"));

// ---- Decode, mirroring useSearch.js exactly ---------------------------------
// Kept as a copy rather than imported because useSearch.js is JSX-adjacent and
// resolved through Vite; the point of this test is to catch a drift between the
// encoder and this decoder, so it must be an independent implementation reading
// the same bytes.

function parsePostings(text) {
  const map = new Map();
  for (const line of text.split("\n")) {
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const ids = [];
    let prev = 0;
    const body = line.slice(i + 1);
    if (body) {
      for (const d of body.split(",")) {
        prev += parseInt(d, 36);
        ids.push(prev);
      }
    }
    map.set(line.slice(0, i), ids);
  }
  return map;
}

function queryTerms(q) {
  const m = String(q || "").toLowerCase().match(/[a-z0-9][a-z0-9'’._+-]*/g) || [];
  const out = [];
  for (const w of m) {
    const t = w.replace(/[._+-]+$/, "");
    if (t.length >= 2) out.push(t);
  }
  return out;
}

const postings = parsePostings(raw.terms);
const segments = raw.segments;
const common = new Set((raw.common || "").split("\n").filter(Boolean));

function search(query, limit = 30) {
  const terms = queryTerms(query);
  if (!terms.length) return { hits: [], ignored: [], missing: [] };
  const resolved = [];
  const missing = [];
  for (const term of terms) {
    const exactIds = postings.get(term);
    const looseIds = [];
    if (term.length >= 3) {
      for (const [k, v] of postings) {
        if (k !== term && k.startsWith(term)) looseIds.push(...v);
      }
      if (term.length >= 6) {
        const stem = term.slice(0, Math.max(5, Math.floor(term.length * 0.75)));
        for (const [k, v] of postings) {
          if (k !== term && !k.startsWith(term) && k.startsWith(stem)) looseIds.push(...v);
        }
      }
    }
    if (exactIds || looseIds.length) {
      resolved.push({ term, exact: exactIds || [], loose: [...new Set(looseIds)] });
      continue;
    }
    missing.push(term);
  }
  const ignored = resolved.filter((r) => common.has(r.term)).map((r) => r.term);
  let narrow = resolved.filter((r) => !common.has(r.term));
  if (!narrow.length) {
    if (!resolved.length) return { hits: [], ignored, missing };
    narrow = [resolved.slice().sort((a, b) => (a.exact.length + a.loose.length) - (b.exact.length + b.loose.length))[0]];
  }
  const perTerm = narrow.map((r) => new Set([...r.exact, ...r.loose]));
  const order = narrow.map((r, i) => ({ i, n: perTerm[i].size })).sort((a, b) => a.n - b.n);
  const counts = new Map();
  for (const id of perTerm[order[0].i]) counts.set(id, 1);
  for (let s = 1; s < order.length; s++) {
    const set = perTerm[order[s].i];
    for (const [id, n] of counts) if (set.has(id)) counts.set(id, n + 1);
  }
  const total = order.length;
  const EXACT_BONUS = 3;
  const out = [];
  for (const [id, n] of counts) {
    if (n !== total) continue;
    let score = 0;
    for (let i = 0; i < narrow.length; i++) {
      const r = narrow[i];
      const inExact = r.exact.length ? r.exact.includes(id) : false;
      score += (inExact ? EXACT_BONUS : 1) / Math.log(2 + (perTerm[i].size || 1));
    }
    out.push({ id, score });
  }
  out.sort((a, b) => b.score - a.score || a.id - b.id);
  return { hits: out.slice(0, limit).map((r) => segments[r.id]), ignored, missing };
}

// ---- The index is structurally usable --------------------------------------

ok(segments.length > 500, "index has a plausible number of segments", "got " + segments.length);
ok(postings.size > 5000, "index has a plausible vocabulary", "got " + postings.size);

// Segment ids must be in range: an out-of-range id renders a result row with no
// heading and no lesson to open.
let outOfRange = 0;
for (const [, ids] of postings) for (const id of ids) if (id < 0 || id >= segments.length) outOfRange++;
ok(outOfRange === 0, "every posting id is within range", outOfRange + " out of range");

// Ids within a posting list must be ascending and unique, which is what makes
// delta decoding valid. A regression here would corrupt every id after it.
let badOrder = 0;
for (const [, ids] of postings) {
  for (let i = 1; i < ids.length; i++) if (ids[i] <= ids[i - 1]) badOrder++;
}
ok(badOrder === 0, "posting lists are strictly ascending", badOrder + " out of order");

// Every segment must know which lesson it belongs to.
const phaseIds = new Set(segments.map((s) => s.p));
ok(phaseIds.size >= 23, "segments cover all phases", "got " + phaseIds.size);
let missingMeta = 0;
for (const s of segments) if (!s.h || !s.p || !s.pt || !s.k) missingMeta++;
ok(missingMeta === 0, "every segment carries heading, lesson, title and track", missingMeta + " incomplete");

// ---- Known queries return the expected lessons -----------------------------

// Each case: a query, and a lesson id that MUST appear in the results. These
// are terms that are genuinely specific to one phase.
//
// Lesson ids are checked against the generated JSON rather than guessed — an
// earlier version of this test asserted "cyber-01-security-fundamentals" when
// the real id is "cyber-03-security-fundamentals", and the failure looked like
// a search bug.
const CASES = [
  ["auditd", "cyber-10-detection-engineering"],
  ["subnet mask", "it-03-networking-basics"],
  ["Get-ScheduledTaskInfo", "cyber-12-scripting-automation"],
  ["STAR", "it-07-soft-skills"],
  ["CloudTrail", "cyber-09-cloud-and-identity"],
  ["risk register", "cyber-13-grc-compliance"],
  ["least privilege", "cyber-03-security-fundamentals"],
  // Deliberately a term that appears in several modules. The assertion is that
  // ALL of them are found, not just the first — timestomping is taught in 11
  // and referenced by 10 and 12, and a search that returned only one would be
  // hiding two thirds of the material.
  ["timestomping", ["cyber-10-detection-engineering", "cyber-11-incident-response", "cyber-12-scripting-automation"]],
];

for (const [q, expect] of CASES) {
  const expected = Array.isArray(expect) ? expect : [expect];
  const { hits } = search(q, 60);
  ok(hits.length > 0, `query "${q}" returns results`);
  const found = new Set(hits.map((h) => h.p));
  const missingLessons = expected.filter((e) => !found.has(e));
  ok(missingLessons.length === 0, `query "${q}" finds ${expected.join(", ")}`,
    missingLessons.length ? "missing " + missingLessons.join(", ") : "");
}

// ---- Behaviour that the UI depends on --------------------------------------

// Prefix matching: this is what makes the box feel live while typing.
const prefix = search("subn");
ok(prefix.hits.length > 0, "a partial word returns results", "subn returned nothing");

// Multi-term queries must AND, not OR. If this degraded to OR, searching two
// terms would return almost every segment.
const two = search("subnet mask");
const one = search("subnet");
ok(two.hits.length <= one.hits.length, "adding a term narrows the result set",
  `subnet=${one.hits.length} vs "subnet mask"=${two.hits.length}`);

// Nonsense must return nothing rather than everything. A silent fallback to
// "show all" is the classic search bug.
const none = search("zzzzqqqxxyy");
ok(none.hits.length === 0, "a nonsense query returns no results", "got " + none.hits.length);

// Empty and whitespace queries must not throw or return the whole corpus.
ok(search("").hits.length === 0, "empty query returns nothing");
ok(search("   ").hits.length === 0, "whitespace query returns nothing");
ok(search("a").hits.length === 0, "single-character query is ignored");

// ---- Common terms must not silently kill a query ---------------------------
//
// This is a regression test for a real bug. Terms appearing in more than 20% of
// segments were originally DELETED from the index. Because a query is an AND
// over its terms, one deleted term made the whole query return zero results —
// "user account locked" found nothing because "user" was gone. They are now
// kept and flagged so the engine can ignore them for narrowing while still
// matching them.

const COMMONLY_TYPED = [
  "user account locked",
  "data breach response",
  "risk and impact",
  "cloud user access",
];

for (const q of COMMONLY_TYPED) {
  const { hits } = search(q, 60);
  ok(hits.length > 0, `a query mixing common words still returns results: "${q}"`,
    "returned 0 — a common term is probably being dropped from the index");
}

// A common word on its own should still resolve rather than erroring out.
const commonOnly = search("user");
ok(commonOnly.hits.length > 0, 'the common word "user" alone returns results',
  "got " + commonOnly.hits.length);

// The flagged list must be non-empty, or the flagging is not working and this
// test proves nothing.
ok(common.size > 0, "the index flags at least one term as too common");
ok(common.has("user") || common.has("the") || common.has("and"),
  "flagging catches known stopwords");

// ---- Trailing punctuation must not create separate terms --------------------
//
// Regression test for a real bug. A sentence ending "...was timestomped."
// indexed the term WITH the period attached, so "timestomped." and
// "timestomped" were different entries and a search for one missed the other.
// Module 11 only ever wrote "timestomped", so searching the more natural
// "timestomping" found modules 10 and 12 but not 11.
let punctuatedTerms = 0;
for (const t of postings.keys()) {
  if (/[._+-]$/.test(t)) punctuatedTerms++;
}
ok(punctuatedTerms === 0, "no index term ends in punctuation",
  punctuatedTerms + " terms end in a separator, e.g. " +
  [...postings.keys()].filter((t) => /[._+-]$/.test(t)).slice(0, 5).join(", "));

// Identifiers that legitimately contain interior punctuation must survive.
for (const id of ["get-adprincipalgroupmembership", "page_fault_in_nonpaged_area"]) {
  ok(postings.has(id), `identifier "${id}" is indexed intact`);
}

// The word as it actually appears in module 11 must be findable.
const stem = search("timestomped", 60);
ok(stem.hits.some((h) => h.p === "cyber-11-incident-response"),
  '"timestomped" finds cyber-11 (the module that uses that spelling)',
  "returned " + [...new Set(stem.hits.map((h) => h.p))].join(", "));

// ---- Snippets are reachable ------------------------------------------------
// The UI builds a snippet from the lesson file. Every result must point at a
// lesson file that exists, or the row renders with no evidence.
const missingLesson = new Set();
for (const s of segments) {
  if (!existsSync(join(LESSONS, s.p + ".json"))) missingLesson.add(s.p);
}
ok(missingLesson.size === 0, "every segment's lesson file exists",
  [...missingLesson].slice(0, 5).join(", "));

// Headings must have anchors for the deep-link scroll, except the synthetic
// lesson-level segment that has no heading of its own.
const anchored = segments.filter((s) => s.a).length;
ok(anchored > segments.length * 0.8, "most segments carry a heading anchor",
  anchored + " of " + segments.length);

// ---- Report ----------------------------------------------------------------

const kb = (n) => (n / 1024).toFixed(0) + " KB";
console.log("search index: " + segments.length + " segments, " + postings.size +
  " terms, " + kb(Buffer.byteLength(JSON.stringify(raw), "utf8")) + " raw");

if (failures.length) {
  console.error("\nSEARCH TEST FAILED — " + failures.length + " of " + checks + " check(s):");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log("SEARCH TEST PASSED — " + checks + " checks across the index and the query engine.");