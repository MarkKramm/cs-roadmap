// Guard: the build's own output must still match what the documentation publishes.
//
// WHY THIS IS A SEPARATE FILE, which is the whole point of it.
//
// `scripts/audit-doc-figures.mjs` runs in CI's `content` job, which has no
// `dist/`. It cannot measure bundle size, so bundle size was unguarded — and
// it rotted. `docs/CHECKPOINT.md` published 1,527,506 bytes; the build emitted
// 1,527,558. Fifty-two bytes, uncaught, for as long as the figure sat there.
//
// The row itself carried the instruction to fix this, and the instruction was
// wrong in a way that would have wasted an afternoon: it said to "add a bundle
// measurement to audit-doc-figures.mjs". That script cannot see `dist/`. The
// measurement has to happen where the build happens, so it lives here, in the
// `site` job, immediately after `npm run build`.
//
// This is the one place the documentation splits across two CI jobs rather than
// being checked in one. That is a real cost and it is paid on purpose: the
// alternative was a figure nobody re-derives, which is how 1,527,506 became
// 1,527,558 without anyone noticing.
//
// WHY EVERY CLAIM IS ANCHORED TO A ROW, which the first version got wrong.
//
// The first version scanned every line of the document for its patterns. It
// worked, by luck: an older row in the "Health checks" section carries "29
// on-demand lesson chunks" — a figure that is SUPPOSED to stay stale, because
// that section is a dated record — and it escaped only because the 29 was not
// bolded. Bold it, as a purely cosmetic edit to a record, and the guard goes red
// on a document that is entirely correct. Worse, the failure message then says
// "correct the document", and the only way to comply is to falsify a dated
// record, which this repository forbids outright.
//
// So each claim names the ROW it lives in, and the search is scoped to that
// row. A current-state figure is checked against the current-state row and
// nothing else can reach it.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "learning-site", "dist");
const ASSETS = path.join(DIST, "assets");
const DOC_FILE = "docs/CHECKPOINT.md";

const findings = [];
const measured = {};

// --- the build output must actually be there --------------------------------
// A guard that measures an absent directory and reports zero is worse than no
// guard, because it prints a clean result. So the precondition is checked
// first and loudly, and this file is not useful without it.
if (!fs.existsSync(DIST) || !fs.existsSync(ASSETS)) {
  console.error(
    "BUILD OUTPUT MISSING — this guard needs a completed `npm run build`.\n" +
      "  expected: " + path.relative(ROOT, ASSETS) + "\n" +
      "  A guard that measures nothing and passes is the failure this file exists to prevent.",
  );
  process.exit(1);
}

const assets = fs.readdirSync(ASSETS).filter((f) => fs.statSync(path.join(ASSETS, f)).isFile());

// The initial chunk is `index-*.js`; a lesson chunk is named for its track and
// phase; the search index is its own lazy chunk. Classified by name because that
// is how the build emits them and how the row describes them.
//
// The lesson pattern is anchored with a NON-CAPTURING track group and requires
// the phase number to be followed by more name. The first version's
// `/^(it|cyber|advance)-\d+.*\.js$/` would also match any future non-lesson
// chunk that happened to be emitted under a phase-style name, and would then
// fail on a perfectly correct document.
const initial = assets.filter((f) => /^index-[^/]*\.js$/.test(f));
const lessonChunks = assets.filter((f) => /^(?:it|cyber|advance)-\d+-.+\.js$/.test(f));
const searchChunks = assets.filter((f) => /^search-[^/]*\.js$/.test(f));
const css = assets.filter((f) => f.endsWith(".css"));

if (initial.length !== 1) {
  findings.push({
    what: "initial chunk",
    line: "n/a",
    note:
      "dist/assets should hold exactly one index-*.js; found " +
      (initial.length ? initial.join(", ") : "none") +
      ". The document is not at fault here and nothing below can be trusted.",
  });
}

const initialBytes = initial.length ? fs.statSync(path.join(ASSETS, initial[0])).size : 0;
measured.initialBytes = initialBytes;
// KB rounded to one decimal, which is how the row publishes it. Rounding here
// rather than in the pattern is what makes the claim stable: the row is written
// as "1,491.8 KiB" and this is the only value that can match it.
measured.initialKb = Math.round((initialBytes / 1024) * 10) / 10;
measured.lessonChunks = lessonChunks.length;
measured.lazyChunks = lessonChunks.length + searchChunks.length;
measured.cssChunks = css.length;

// --- the documentation side -------------------------------------------------
// A claim: which ROW it lives in, a regex within that row whose FIRST capture
// group is the published number, and a human name.
const claim = (row, re, what) => ({ row, re, what });
const ASSERTIONS = [
  {
    key: "initialBytes",
    claims: [claim("Bundle & build output", /Initial chunk \*\*([\d,]+) bytes raw\*\*/, "initial chunk size in bytes")],
    why: "the size of dist/assets/index-*.js",
  },
  {
    key: "initialKb",
    claims: [claim("Bundle & build output", /bytes raw\*\* = \*\*([\d,.]+) KiB\*\*/, "initial chunk size in KiB")],
    why: "the same chunk divided by 1024, to one decimal",
  },
  {
    key: "lessonChunks",
    claims: [claim("Bundle & build output", /with \*\*(\d+)\*\* on-demand lesson chunks/, "lesson chunk count")],
    why: "one lazy chunk per phase, on-demand",
  },
  {
    key: "lazyChunks",
    claims: [claim("Bundle & build output", /— (\d+) lazy chunks in total/, "total lazy chunk count")],
    why: "lesson chunks plus the separate search chunk",
  },
];

const docPath = path.join(ROOT, DOC_FILE);
if (!fs.existsSync(docPath)) {
  console.error("MISSING DOCUMENT — " + DOC_FILE + " does not exist, so nothing can be checked.");
  process.exit(1);
}
const docLines = fs.readFileSync(docPath, "utf8").split("\n");

// A row is the line that OPENS with "| <label> |". Scoping to the line that
// carries the label is what keeps a dated historical row out of reach.
const rowLine = (label) => {
  const re = new RegExp("^\\|\\s*" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\|");
  return docLines.findIndex((l) => re.test(l));
};

let assertionsChecked = 0;
for (const a of ASSERTIONS) {
  const actual = measured[a.key];
  for (const c of a.claims) {
    const idx = rowLine(c.row);
    if (idx < 0) {
      findings.push({
        what: c.what,
        line: "?",
        note:
          "the row '| " + c.row + " |' is not in " + DOC_FILE +
          " — the claim has nowhere to look, which is an absent check rather than a passing one",
      });
      continue;
    }
    const m = c.re.exec(docLines[idx]);
    if (!m) {
      findings.push({
        what: c.what,
        line: idx + 1,
        note: "the pattern matched no text in that row — an absent check, not a passing one",
      });
      continue;
    }
    // Thousands separators, because the row publishes "1,527,558" and
    // `Number("1,527,558")` is NaN, which would make the comparison vacuous
    // rather than wrong — the failure mode of a check that cannot fail.
    const stated = Number(String(m[1]).replace(/,/g, ""));
    assertionsChecked++;
    if (!Number.isFinite(stated) || stated !== actual) {
      findings.push({
        what: c.what,
        line: idx + 1,
        stated: Number.isFinite(stated) ? stated : String(m[1]) + " (unparseable)",
        actual,
        why: a.why,
      });
    }
  }
}

// --- report -----------------------------------------------------------------
// The unasserted list is DERIVED from which keys have no claim, not written
// out by hand. The first version hardcoded it to one key while the `measured`
// table printed five, two of which the document publishes — so the guard stated
// a principle in its own header and then broke it on a figure the document
// actually contains.
const assertedKeys = new Set(ASSERTIONS.map((a) => a.key));
const unasserted = Object.keys(measured).filter((k) => !assertedKeys.has(k));

console.log("Measured from the build output:");
for (const [k, v] of Object.entries(measured)) {
  console.log("  " + k.padEnd(16) + String(v).padStart(9) + (assertedKeys.has(k) ? "" : "   (not asserted)"));
}
console.log("");
console.log("Build figures asserted: " + assertionsChecked);
console.log(
  "Measured but NOT asserted (no claim can fail on these): " +
    (unasserted.length ? unasserted.join(", ") : "(none — every measurement has a claim)"),
);
console.log("");

if (findings.length) {
  console.log("BUILD FIGURES FAILED — " + findings.length + " finding(s):");
  for (const f of findings) {
    const where = typeof f.line === "number" ? DOC_FILE + ":" + f.line : f.line;
    console.log("  " + where + "  [" + f.what + "]");
    console.log("      " + (f.note ? f.note : "document says " + f.stated + "   reality is " + f.actual + "   (" + f.why + ")"));
  }
  console.log("");
  console.log("FIX: correct the document, or correct the code. Never edit this guard to agree.");
  process.exit(1);
}

console.log("BUILD FIGURES OK — every asserted figure matches the build that produced it.");
