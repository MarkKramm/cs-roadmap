// CHANGELOG structure audit. Exit code 1 on a structural defect, so it can gate CI.
//
// This exists because the same defect has now appeared three times and nothing
// ever failed because of it. Keep a Changelog permits ONE of each section
// heading per release version. `[Unreleased]` accumulated eleven headings over
// at least four commits — four `Fixed`, four `Changed`, three `Added` — and a
// reader looking for what changed had to read four separate `Fixed` lists to
// find it. They were merged mechanically in b9f6133: 8 heading lines removed,
// 312 content lines byte-identical. The same shape returned twice more in one
// session (2026-09-16), each time because a new entry was appended above an
// existing section of the same name rather than into it.
//
// Why this one is buildable when the topic-list guard was not (see D-033):
// the question "does this heading appear twice" is arithmetic on the document,
// and a failing result is distinguishable from a passing one BY THE CHECK
// ITSELF. The topic-list guard asked whether prose constitutes teaching, so a
// promise and a lesson returned the same answer and its pass path looked like
// its skip path. That is the test a candidate guard has to pass, and this one
// passes it.
//
// Three classes are checked, all structural rather than editorial:
//
//   1. A duplicate section heading inside one version block. This is the defect
//      that motivated the guard.
//   2. A version block whose headings are out of the canonical order. Keep a
//      Changelog fixes the order as Added, Changed, Deprecated, Removed, Fixed,
//      Security; a block that lists Fixed before Added is readable but wrong,
//      and reordering it later produces a diff that hides the real change.
//   3. A heading with no content beneath it, or a version block with no headings
//      at all. Both mean an entry was started and abandoned, which reads as
//      "nothing changed in this release" when the opposite may be true.
//
// `[0.1.0]` is treated exactly like `[Unreleased]`: it is a released version
// that is still being amended in this repository, and the historical record is
// worth keeping well-formed even after release.
//
// Read-only: writes nothing.
import fs from 'node:fs';

const FILE = 'CHANGELOG.md';

// The canonical order. Only the headings actually used are checked against it,
// so a block that legitimately omits `Security` is not penalised.
const ORDER = ['### Added', '### Changed', '### Deprecated', '### Removed', '### Fixed', '### Security'];

const findings = [];
const note = (line, message) => findings.push({ line, message });

const lines = fs.readFileSync(FILE, 'utf8').split('\n');

// Split into version blocks at `## ` boundaries, keeping the heading line.
const blocks = [];
let current = null;
lines.forEach((line, i) => {
  if (/^## /.test(line)) {
    current = { heading: line.trim(), line: i + 1, headings: [], body: [], inHeading: null };
    blocks.push(current);
    return;
  }
  if (!current) return; // the file preamble before the first `## `
  const h = line.match(/^(###\s+.+?)\s*$/);
  if (h) {
    current.inHeading = { text: h[1], line: i + 1, body: [] };
    current.headings.push(current.inHeading);
    return;
  }
  if (current.inHeading) current.inHeading.body.push(line);
  else current.body.push(line);
});

const isBlank = (arr) => arr.every((l) => l.trim() === '');

let versionCount = 0;
for (const block of blocks) {
  versionCount++;

  if (block.headings.length === 0) {
    // A version block with prose but no sections is fine (a short note about the
    // release); a version block that is entirely empty is not.
    if (isBlank(block.body)) {
      note(block.line, `${block.heading} has no sections and no content`);
    }
    continue;
  }

  // Class 1 — duplicate headings.
  const seen = new Map();
  for (const h of block.headings) {
    const prev = seen.get(h.text);
    if (prev) {
      note(h.line, `${block.heading} has a second \`${h.text}\` (first at line ${prev}); merge them`);
    } else {
      seen.set(h.text, h.line);
    }
  }

  // Class 2 — canonical order. Compare only the headings present, in the order
  // they appear, against their canonical relative order.
  const ranks = block.headings
    .map((h) => ({ h, rank: ORDER.indexOf(h.text) }))
    .filter((x) => x.rank >= 0);
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i].rank < ranks[i - 1].rank) {
      note(
        ranks[i].h.line,
        `${block.heading} lists \`${ranks[i].h.text}\` after \`${ranks[i - 1].h.text}\`; keep-a-changelog order is ${ORDER.map((o) => o.replace('### ', '')).join(', ')}`,
      );
    }
  }

  // Class 3 — a heading with nothing under it.
  for (const h of block.headings) {
    if (isBlank(h.body)) note(h.line, `${h.text} under ${block.heading} has no entries`);
  }
}

// Report.
findings.sort((a, b) => a.line - b.line);
for (const f of findings) console.log(`${FILE}:${f.line}: ${f.message}`);
console.log('');
console.log(`version blocks checked: ${versionCount}`);
console.log(`findings: ${findings.length}`);
if (findings.length === 0) {
  console.log('CHANGELOG structure is sound: no duplicate sections, canonical order, no empty headings.');
}
process.exit(findings.length === 0 ? 0 : 1);
