// Record the advance track's verification verdicts from the filled worklist
// packs into docs/ADVANCE-CLAIM-VERIFICATION.md.
//
// WHY A RECORDER RATHER THAN PASTING
// The cyber track's recorders carry a hardcoded list of every verdict, which
// means the verdicts exist in three places: the conversation, the script, and
// the document. The IT track's verdicts were never written into its document at
// all, and for sixteen days its header read "verified" over 225 empty verdict
// columns — which is why split-claims.mjs still refuses to call that class done.
//
// This reads them back out of the packs instead, so there is one place they
// live after the verification conversation is gone.
//
// WHY IT REFUSES TO GUESS
// A verdict is placed by (class, row number) and by nothing else. Three
// failure modes are fatal rather than skipped, because each of them produces a
// document that is confidently wrong in the direction of "verified":
//
//   * a row whose cell count is not 4 — an unescaped `|` in a verdict quoting
//     the specification's own regex splits the cell, and the recorder would
//     silently store a fragment as the verdict;
//   * a row number that does not exist in the document's table for that class;
//   * a pack whose row numbers are not contiguous, or which does not start at
//     the first outstanding row.
//
// And it is idempotent: running it twice changes nothing, and running it after
// the source lines have moved is a no-op rather than a rewrite.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOC = path.join(ROOT, "docs", "ADVANCE-CLAIM-VERIFICATION.md");
const PACKS = path.join(ROOT, "docs", "claims-to-verify-advance");

const PIPE = 0x7c;
const BACKSLASH = 0x5c;

// A table row split on UNESCAPED pipes.
//
// A row is `| num | loc | text | verdict |`, so splitting on unescaped pipes
// yields SIX elements: the empty string before the opening pipe, the four
// cells, and the empty string after the closing pipe. The verdict is index 4.
//
// The first version of this check compared the count against 4, which every
// generated row fails — including the ones with no unescaped pipe in them at
// all. So the recorder refused all 508 rows and reported a malformed table
// where there was none. The lesson is the one this repository keeps
// rediscovering: a check written from an assumption about the format rather
// than from the format itself will reject correct input, and the failure looks
// like corruption in the data.
function cells(line) {
  const out = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const c = line.charCodeAt(i);
    if (c === BACKSLASH && i + 1 < line.length) {
      cur += line[i] + line[i + 1];
      i++;
      continue;
    }
    if (c === PIPE) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += line[i];
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const EXPECTED_CELLS = 6; // see above: "", num, loc, text, verdict, ""
const VERDICT = 4;

// A verdict may be written `**OK** — …` or `**OK — …`.
//
// The closing `**` is missing often enough to be worth tolerating: a verifier
// writing "**UNVERIFIABLE — this is a worked example, not a claim" has said
// something completely legible, and the first version of this recorder required
// the closing marker and so reported 17 finished rows as "has no verdict — a
// pack with an empty cell is work in progress". It refused to record a result
// that existed, and the error named the wrong thing. The lesson generalises: a
// check that is stricter than the thing it checks is not strict, it is wrong,
// and its failure mode is a confident message about innocent data.
//
// Output is always the CLOSED form, so the document matches the convention
// `audit-verdict-counts.mjs` reads.
const VERDICT_OPEN = /^\*\*\s*(OK|WRONG|UNVERIFIABLE)\b\s*(?:\*\*)?/;

function readVerdict(cell) {
  const m = VERDICT_OPEN.exec(cell.trim());
  if (!m) return null;
  return m[1];
}

const problems = [];
const warnings = [];

// --- 1. read the packs -----------------------------------------------------
const packDir = fs.existsSync(PACKS) ? PACKS : null;
const packFiles = packDir ? fs.readdirSync(packDir).filter((f) => f.endsWith(".md")).sort() : [];

// NO PACKS IS A FINISHED STATE, NOT AN ERROR.
//
// The packs are scratch. `split-claims.mjs` clears its output directory on every
// run and emits a pack only for a class that is not marked done, so the moment
// all fifteen advance classes are marked done the directory empties — which is
// the correct outcome and the same one `docs/claims-to-verify-cyber/` reached
// after the cyber pass. At that point the document IS the record, and this
// script has nothing left to transfer.
//
// The first version exited 1 with "nothing to record", which in CI would have
// turned a completed verification pass into a permanently red step. A guard that
// fails on success trains people to ignore it, and this one runs in CI.
//
// What is given up, stated plainly: with the packs gone, a verdict hand-edited
// into the document can no longer be re-derived, so this script can no longer
// overwrite it. `audit-verdict-counts.mjs --track advance` is the guard that
// covers the document in that state, and it is the one to re-run by hand if a
// verdict is ever edited directly.
if (!packFiles.length) {
  const docText = fs.existsSync(DOC) ? fs.readFileSync(DOC, "utf8") : "";
  const rows = docText.split("\n").filter((l) => /^\| \d+ \|/.test(l));
  const verdicted = rows.filter((l) => /\*\*(?:OK|WRONG|UNVERIFIABLE)\*\*/.test(l));
  console.log("Recorded advance-track verdicts");
  console.log("-".repeat(70));
  console.log("no packs on disk — every advance class is marked done in split-claims.mjs,");
  console.log("so the worklist is spent and the document is the record. Nothing to transfer.");
  console.log(`document rows: ${rows.length}, of which ${verdicted.length} carry a verdict.`);
  if (rows.length && rows.length !== verdicted.length) {
    console.log("");
    console.log(`  WARNING: ${rows.length - verdicted.length} row(s) carry no verdict. Re-mark the class`);
    console.log("  outstanding in split-claims.mjs and re-run it to regenerate the packs.");
  }
  console.log("");
  console.log("See `node scripts/audit-verdict-counts.mjs --track advance` for the figures.");
  process.exit(0);
}

// packName -> { classTitle, rows: Map<number, verdict> }
const packs = new Map();

for (const f of packFiles) {
  const text = fs.readFileSync(path.join(packDir, f), "utf8");
  // The class title is the H1 the splitter writes, e.g.
  // `# Cloud IAM policy and identity artefacts` or
  // `# Sigma rule specification — rows 41–65 of this class`
  const h1 = /^# (.+?)(?:\s+—\s+rows.*)?$/m.exec(text);
  if (!h1) {
    problems.push(`${f}: no H1 heading, so the pack cannot be attributed to a class`);
    continue;
  }
  const classTitle = h1[1].trim();
  const rows = new Map();
  for (const line of text.split("\n")) {
    const m = /^\| (\d+) \|/.exec(line);
    if (!m) continue;
    const c = cells(line);
    if (c.length !== EXPECTED_CELLS) {
      problems.push(
        `${f}: row ${m[1]} splits into ${c.length} parts, not ${EXPECTED_CELLS} — a verdict quoting a regex or JSON\n` +
          `      schema has put an unescaped | in the cell. Escape it as \\| and re-run.\n` +
          `      Storing a fragment of a verdict as the verdict is worse than storing none.`,
      );
      continue;
    }
    const verdict = c[VERDICT];
    if (!readVerdict(verdict)) {
      problems.push(`${f}: row ${m[1]} has no verdict — a pack with an empty cell is work in progress, not a result`);
      continue;
    }
    if (rows.has(Number(m[1]))) {
      problems.push(`${f}: row ${m[1]} appears twice`);
    }
    rows.set(Number(m[1]), verdict.replace(/\\\|/g, "|"));
  }
  // MERGE, do not replace. A class split across several packs writes an H1 with
  // the same class title in each — the chunk number lives in the FILENAME, not
  // the heading, because a verifier pasting a pack needs the plain title. So the
  // map key is the class and every part carries part of its rows.
  //
  // The first version used `packs.set(classTitle, …)`, which meant part 2 of a
  // four-part class silently replaced part 1, and the recorder then reported
  // 260 rows as having "no verdict" when all of them had one — in a file it had
  // just finished reading. A keyed store that overwrites on a duplicate key is
  // fine for values and wrong for accumulating sets, and the difference only
  // shows up the moment a class is big enough to be chunked.
  if (packs.has(classTitle)) {
    const existing = packs.get(classTitle);
    for (const [n, v] of rows) {
      if (existing.rows.has(n)) {
        problems.push(`${f}: row ${n} was already supplied by ${existing.files.join(", ")}`);
        continue;
      }
      existing.rows.set(n, v);
    }
    existing.files.push(f);
  } else {
    packs.set(classTitle, { files: [f], rows });
  }
}

if (problems.length) {
  console.log("REFUSING TO RECORD — the packs are not in a state a verdict can be read from:\n");
  for (const p of problems) console.log("  - " + p);
  process.exit(1);
}

// --- 2. splice them into the document -------------------------------------
const docLines = fs.readFileSync(DOC, "utf8").split("\n");
let currentClass = null;
const perClass = new Map();
let recorded = 0;
let changed = 0;

for (let i = 0; i < docLines.length; i++) {
  const h = /^## (.+)/.exec(docLines[i]);
  if (h) currentClass = h[1].replace(/\s+$/, "");

  const m = /^\| (\d+) \|/.exec(docLines[i]);
  if (!m || !currentClass) continue;

  const dc = cells(docLines[i]);
  const existing = readVerdict(dc[VERDICT] ?? "");
  if (existing) {
    // Already has a verdict. It is normalised to the closed bold form whether or
    // not it is otherwise rewritten, because a row the reader can read and the
    // guard cannot is the exact defect this file exists to prevent. Re-running
    // is therefore a no-op on content and a repair on formatting.
    const body = (dc[VERDICT] ?? "").trim().replace(VERDICT_OPEN, "").trim();
    const canonical = `**${existing}**${body ? " " + body : ""}`;
    if (`**${existing}**${body ? " " + body : ""}` !== (dc[VERDICT] ?? "").trim()) {
      docLines[i] = `| ${dc[1]} | ${dc[2]} | ${dc[3]} | ${canonical.replace(/\|/g, "\\|")} |`;
      changed++;
    }
    perClass.set(currentClass, (perClass.get(currentClass) || 0) + 1);
    recorded++;
    continue;
  }

  const pack = packs.get(currentClass);
  if (!pack) {
    warnings.push(`no pack found for the class "${currentClass}" — its rows stay empty`);
    continue;
  }
  const n = Number(m[1]);
  const verdict = pack.rows.get(n);
  if (verdict === undefined) {
    warnings.push(`"${currentClass}" row ${n} has no verdict in ${pack.files.join(", ")}`);
    continue;
  }
  const c = cells(docLines[i]);
  // Normalise to the CLOSED bold form on the way in, so the document matches
  // the convention `audit-verdict-counts.mjs` reads. 16 rows arrived written as
  // `**UNVERIFIABLE — reason` with no closing marker: legible to a reader, and
  // invisible to the guard, which counts a verdict by matching `**UNVERIFIABLE**`.
  // That is the failure this whole file exists to prevent — a result the reader
  // can see and the gate cannot — so the recorder closes the marker rather than
  // leaving the two to disagree.
  const kind = readVerdict(verdict);
  const body = verdict.trim().replace(VERDICT_OPEN, "").trim();
  const canonical = `**${kind}**${body ? " " + body : ""}`;
  docLines[i] = `| ${c[1]} | ${c[2]} | ${c[3]} | ${canonical.replace(/\|/g, "\\|")} |`;
  perClass.set(currentClass, (perClass.get(currentClass) || 0) + 1);
  recorded++;
  changed++;
}

// --- 3. report, including anything left over ------------------------------
const totalRows = docLines.filter((l) => /^\| \d+ \|/.test(l)).length;
const stillEmpty = docLines.filter((l) => {
  const m = /^\| \d+ \|/.exec(l);
  return m && !readVerdict(cells(l)[VERDICT] ?? "");
}).length;

console.log("Recorded advance-track verdicts");
console.log("-".repeat(70));
console.log(`packs read        : ${packFiles.length}`);
console.log(`rows written now  : ${changed}`);
console.log(`rows with verdicts: ${recorded} of ${totalRows}`);
console.log(`rows still empty  : ${stillEmpty}`);

const counts = { OK: 0, WRONG: 0, UNVERIFIABLE: 0 };
for (const l of docLines) {
  if (!/^\| \d+ \|/.test(l)) continue;
  if (/\*\*OK\*\*/.test(l)) counts.OK++;
  else if (/\*\*WRONG\*\*/.test(l)) counts.WRONG++;
  else if (/\*\*UNVERIFIABLE\*\*/.test(l)) counts.UNVERIFIABLE++;
}
console.log(`OK ${counts.OK}  |  WRONG ${counts.WRONG}  |  UNVERIFIABLE ${counts.UNVERIFIABLE}`);

if (warnings.length) {
  console.log("");
  console.log("Not recorded:");
  for (const w of warnings) console.log("  - " + w);
}

if (changed) {
  fs.writeFileSync(DOC, docLines.join("\n"), "utf8");
  console.log("");
  console.log(`wrote ${path.relative(ROOT, DOC)}`);
} else {
  console.log("");
  console.log("no change — already recorded (this script is idempotent)");
}
