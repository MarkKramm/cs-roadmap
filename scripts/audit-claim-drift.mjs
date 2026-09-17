// Every row in a claim-verification pack must still describe the corpus.
//
// WHY THIS EXISTS -- and why it is a GATE and not a check
// A claim pack is a SNAPSHOT: extract-claims.mjs reads the corpus, and
// split-claims.mjs writes the rows into paste-ready messages. If the content
// changes afterwards, the pack goes on describing a sentence that is no longer
// in the file -- and a verifier handed that row will correctly report that the
// corpus contradicts the source, producing a WRONG verdict for text the corpus
// does not contain.
//
// That is not hypothetical. On 2026-09-17 four of the first verdicts returned
// from a real verification pass were exactly this: they flagged NIST CSF as
// teaching "five functions" when the corpus had already been corrected to six.
// The model was right about what it was given; the worklist was stale. Nothing
// in the repository could have caught it, because the extractor and the splitter
// are MANUAL steps that never ran in CI and nothing compared their output to the
// corpus they were derived from.
//
// A stale worklist is worse than no worklist: it manufactures confident, wrong
// findings, and each one costs a human a source lookup to disprove. So this runs
// in CI and fails on drift.
//
// Run: node scripts/audit-claim-drift.mjs [--track cybersec|it]

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const trackIdx = process.argv.indexOf("--track");
const TRACK_KEY = trackIdx > -1 ? process.argv[trackIdx + 1] : "cybersec";
const TRACKS = {
  it: { dir: "it-roadmap", packs: "claims-to-verify" },
  cybersec: { dir: "cybersec-roadmap", packs: "claims-to-verify-cyber" },
};
if (!TRACKS[TRACK_KEY]) {
  console.error(`unknown track "${TRACK_KEY}" — expected: ${Object.keys(TRACKS).join(", ")}`);
  process.exit(2);
}
const CORPUS = path.join(ROOT, "career-roadmaps", TRACKS[TRACK_KEY].dir);
const PACKS = path.join(ROOT, "docs", TRACKS[TRACK_KEY].packs);

if (!fs.existsSync(PACKS)) {
  console.error(`no pack folder at ${PACKS} — nothing to audit`);
  process.exit(2);
}

// Rows look like:  | 12 | `file.md:345` | claim text | verdict |
//
// The claim cell frequently IS a Markdown table row from the corpus, so it holds
// escaped pipes (`\|`). Two regex attempts at this both failed in opposite
// directions, and the measurements are worth keeping:
//
//   * `(.*?)` non-greedy stopped at the first `\|`, capturing a bare backslash.
//     That normalised to nothing, tripped the length floor, and silently skipped
//     **162 of 380 rows (42.6%)** -- including the NIST CSF row whose staleness
//     this guard exists to catch.
//   * `(.+)` greedy swallowed the trailing verdict columns, so every probe ended
//     in `| |` and **310 of 380 rows** were falsely reported as drift.
//
// A regex is the wrong tool. Split on unescaped pipes and take the fields by
// position: the leading empty field, then row number, then location, then the
// claim, then the remaining (verdict) columns.
function parseRow(line) {
  if (!/^\|\s*\d+\s*\|/.test(line)) return null;
  // Split on pipes NOT preceded by a backslash.
  const cells = line.split(/(?<!\\)\|/);
  if (cells.length < 6) return null;
  const num = cells[1].trim();
  const loc = cells[2].trim().replace(/^`|`$/g, "");
  const m = /^(.+?):(\d+)$/.exec(loc);
  if (!m) return null;
  // Split on pipes NOT preceded by a backslash. Two row shapes occur:
  //
  //   prose claim : ['', ' 12 ', ' `file:345` ', ' claim ', ' verdict ', '']
  //   table claim : ['', ' 12 ', ' `file:345` ', ' claim-a ', ' claim-b ', ..., ' verdict ', '']
  //
  // A claim that is itself a corpus table row contains REAL pipes in the pack
  // (only the corpus's own pipes are escaped as `\|`, and the pack's cell
  // separators are not), so it occupies several cells. The verdict is always the
  // LAST cell before the trailing empty one, and the claim is everything between
  // the location and that.
  //
  // THE EMPTY-VERDICT CASE IS THE ONE THAT BITES. In a fresh pack the verdict cell
  // is empty, so the row ends `... | ` + `|` and splitting yields
  // ['', n, loc, claim..., '', '']: the verdict cell and the closing pipe are BOTH
  // empty strings. Popping trailing empties first therefore eats the verdict cell
  // too, and the claim is then read as one cell too many -- which appends a stray
  // "|" and makes a claim that IS present verbatim report as GONE.
  //
  // That produced a false drift failure on IT row 30
  // (`02-phase-operating-systems.md:531`, "Machine is slow"), whose text is
  // byte-identical in the corpus. A false GONE is worse than a missed one: the
  // printed remedy is "re-run the pipeline", so it invites regenerating a
  // perfectly good worklist -- and on a verification pass a stale worklist is
  // exactly what invented four false WRONG verdicts before.
  //
  // The fix is to reason from the row's own shape: a pack row ALWAYS ends with
  // `|` and ALWAYS has a verdict cell. So drop exactly one trailing empty field
  // (the artifact of the closing pipe), then treat the new last field as the
  // verdict and discard it, whatever it contains.
  const tail = cells.slice(3);
  if (tail.length && tail[tail.length - 1].trim() === "") tail.pop();
  const claimCells = tail.slice(0, -1);
  const claim = claimCells.join("|").trim();
  return { n: num, file: m[1], ln: Number(m[2]), text: claim };
}

// The pack escapes pipes and backticks inside table cells, and truncates long
// rows with an ellipsis. Normalise both sides the same way before comparing.
//
// THE ESCAPING IS DOUBLED, AND ONLY ON THE PACK SIDE. `extract-claims.mjs` does
// `s.replace(/\|/g, "\\|")`, which is correct -- but when the claim is ITSELF a
// corpus table row, the corpus text already contains `\|` (an escaped pipe inside
// its own table). Escaping that again gives `\\|`, so the pack holds one more
// level of escaping than the corpus line it came from.
//
// Unescaping once is therefore not enough: `\\|` -> `\|` still does not equal the
// corpus's `|`. The old code unescaped once and compared, so every claim that was
// a corpus table row containing an escaped pipe reported GONE while sitting on the
// stated line byte-for-byte. That is what flagged IT row 30
// (`02-phase-operating-systems.md:531`, "Machine is slow"), and it is a false
// positive with a dangerous remedy attached: the printed fix is "re-run the
// pipeline", which invites regenerating a good worklist -- and a stale worklist is
// precisely what invented four false WRONG verdicts earlier in this project.
//
// Normalise by collapsing ALL backslash-escapes of pipes and backticks on both
// sides, so the comparison is about the text, not about how many times someone
// escaped it. `\\+` before a pipe or backtick becomes that character.
const norm = (s) =>
  s
    .replace(/\\+\|/g, "|")
    .replace(/\\+`/g, "`")
    .replace(/\\+$/, "")
    .replace(/….*$/, "")
    .replace(/\s+/g, " ")
    .trim();

// A probe that normalises down to almost nothing cannot decide anything. Table
// rows whose leading pipes were stripped leave a bare backslash; counting those
// as drift would make this guard cry wolf, and a guard that cries wolf is
// ignored. Measured: 157 of 342 rows in the pre-fix cyber pack were this shape.
const MEANINGFUL = 12;

let rows = 0;
let ok = 0;
let moved = 0;
let gone = 0;
const findings = [];
const skipped = [];

for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith(".md")).sort()) {
  const lines = fs.readFileSync(path.join(PACKS, f), "utf8").split("\n");
  for (const line of lines) {
    const parsed = parseRow(line);
    if (!parsed) continue;
    const { n, file, ln, text } = parsed;
    rows++;

    const p = path.join(CORPUS, file);
    if (!fs.existsSync(p)) {
      gone++;
      findings.push(`${f} row ${n}: corpus file does not exist — ${file}`);
      continue;
    }
    const all = fs.readFileSync(p, "utf8").split("\n");
    const actual = (all[ln - 1] || "").trim();
    const probe = norm(text);
    // The floor exists so a row that carries no comparable text is skipped rather
    // than reported as drift -- a guard that cries wolf is ignored. After the
    // greedy match above this should be rare; REPORT the count rather than hiding
    // it, because an unchecked row is a hole in the guard and the reader needs to
    // know how big it is.
    if (probe.replace(/[\\|\s]/g, "").length < MEANINGFUL) {
      skipped.push(`${f} row ${n} (${file}:${ln})`);
      continue;
    }

    if (norm(actual).includes(probe)) {
      ok++;
      continue;
    }
    // Drift, but is it only line movement, or was the text rewritten?
    const elsewhere = all.findIndex((l) => norm(l).includes(probe));
    if (elsewhere !== -1) {
      moved++;
      findings.push(
        `${f} row ${n}: text still exists but MOVED — ${file}:${ln} is now line ${elsewhere + 1}`,
      );
    } else {
      gone++;
      findings.push(`${f} row ${n}: text no longer in ${file} — was: ${probe.slice(0, 70)}`);
    }
  }
}

console.log(`claim packs audited:  docs/${TRACKS[TRACK_KEY].packs}/`);
console.log(`rows checked:         ${rows}`);
console.log(`  text on stated line: ${ok}`);
console.log(`  text MOVED:          ${moved}   <- line drift; re-run extract + split`);
console.log(`  text GONE:           ${gone}   <- the sentence was rewritten or removed`);
console.log(`  not probeable:       ${skipped.length}   (pack truncates these rows)`);
console.log("");
if (skipped.length) {
  // Printed, never silent. These rows are NOT protected by this guard, and a
  // reader who assumed full coverage would be wrong by whatever this fraction is
  // -- a regex detail they cannot see from the output.
  console.log(`NOT COVERED by this guard: ${skipped.length} row(s), whose pack text is too short`);
  console.log(`  to compare. e.g. ${skipped.slice(0, 3).join("; ")}`);
  console.log("");
}

if (!findings.length) {
  console.log(`Claim packs are in sync with the ${TRACKS[TRACK_KEY].dir} corpus.`);
  process.exit(0);
}

console.log(`CLAIM DRIFT: ${findings.length} row(s) no longer describe the corpus.`);
console.log("");
for (const f of findings.slice(0, 25)) console.log("  " + f);
if (findings.length > 25) console.log(`  ... and ${findings.length - 25} more`);
console.log("");
console.log("FIX: re-run the pipeline against current HEAD, in order —");
console.log(`  node scripts/extract-claims.mjs --track ${TRACK_KEY}`);
console.log(`  node scripts/split-claims.mjs   --track ${TRACK_KEY}`);
console.log("Then rebuild any bundles derived from the packs.");
process.exit(1);
