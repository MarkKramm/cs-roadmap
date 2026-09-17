// Controls for audit-claim-drift.mjs.
//
// WHY THIS EXISTS
// The guard's whole value is that it fails when a worklist stops describing the
// corpus. A guard that has never failed is indistinguishable from a comment --
// this repository has recorded that lesson three separate times, most recently
// when the corpus-balance rule in audit-quiz.mjs was dead code TWICE while the
// guard still exited non-zero for unrelated reasons.
//
// So each control here asserts WHICH BRANCH FIRED, not merely that the exit code
// was non-zero. An exit code is not evidence that the branch you wrote is the
// branch that ran (D-049).
//
// The three controls:
//   A. Plant the verbatim defect that actually fooled us -- corpus text changed
//      out from under a pack row -- and require it reported as GONE.
//   B. Shift every line by one, text untouched, and require MOVED, NOT GONE.
//      These need different fixes, so conflating them sends the reader to the
//      wrong repair.
//   C. Restore and require a clean pass, so the guard is not simply always-red.
//
// Every control restores the corpus in a finally block: the guard reads real
// content files, and a control that leaves one mutated would corrupt the repo for
// every later step. (Learned the hard way on the browser check, where a control
// that emptied a textarea broke an assertion 300 lines later.)
//
// Run: node scripts/test-audit-claim-drift.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-claim-drift.mjs");
const CORPUS = path.join(ROOT, "career-roadmaps", "cybersec-roadmap", "01-phase-foundations.md");

const failures = [];
let checks = 0;

function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(label + (detail ? " — " + detail : ""));
}

function run() {
  try {
    const out = execFileSync(process.execPath, [GUARD, "--track", "cybersec"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

const original = fs.readFileSync(CORPUS, "utf8");

try {
  // --- C (run first, so a failure there is not confused with an unrestored file)
  const clean = run();
  ok(clean.code === 0, "control C: a fresh pack set passes", `exit=${clean.code}`);
  ok(
    /in sync with the cybersec-roadmap corpus/.test(clean.out),
    "control C: the pass says what it means",
    clean.out.trim().split("\n").pop(),
  );

  // --- A: content changed out from under a pack row (the real 2026-09-17 bug)
  //
  // The pack row for `01-phase-foundations.md:478` quotes the NIST CSF table cell
  // beginning "| **NIST CSF** | Organises security work into six functions...".
  // Editing the START of that cell is what makes the row stale, because the guard
  // compares on the normalised PREFIX of the quoted text -- a change deep inside a
  // long cell is invisible to a prefix comparison and would be a weaker test.
  //
  // This mirrors the real defect exactly: the corpus was corrected to "six
  // functions" AFTER the extraction ran, so the pack went on quoting a sentence
  // that no longer existed, and a real verifier returned four WRONG verdicts
  // against text the corpus did not contain.
  const changed = original.replace(
    "| **NIST CSF** | Organises security work into six functions",
    "| **NIST CSF** | Organises security work into five functions",
  );
  ok(changed !== original, "control A: the plant actually changed the corpus");
  fs.writeFileSync(CORPUS, changed, "utf8");
  const a = run();
  ok(a.code === 1, "control A: drift exits 1", `exit=${a.code}`);
  ok(/text GONE:\s+[1-9]/.test(a.out), "control A: reported as GONE, not MOVED", a.out.match(/text GONE:.*/)?.[0]);
  ok(!/text MOVED:\s+[1-9]/.test(a.out), "control A: does NOT also report MOVED", a.out.match(/text MOVED:.*/)?.[0]);
  ok(/CLAIM DRIFT: \d+ row/.test(a.out), "control A: names the drift count");

  // --- B: pure line shift, text intact
  //
  // Inserting a blank line at the top moves every row by one WITHOUT changing a
  // single sentence. The guard must call this MOVED, because the repair is to
  // re-run extract + split, not to go and check whether the claim is still true.
  fs.writeFileSync(CORPUS, "\n" + original, "utf8");
  const b = run();
  ok(b.code === 1, "control B: line shift exits 1", `exit=${b.code}`);
  ok(/text MOVED:\s+[1-9]/.test(b.out), "control B: reported as MOVED", b.out.match(/text MOVED:.*/)?.[0]);
  ok(!/text GONE:\s+[1-9]/.test(b.out), "control B: does NOT report GONE for intact text", b.out.match(/text GONE:.*/)?.[0]);
  ok(/is now line \d+/.test(b.out), "control B: says which line the text moved to");
} finally {
  fs.writeFileSync(CORPUS, original, "utf8");
}

// --- and prove the restore worked, which is the failure this suite could itself
// --- introduce (a control that leaves the corpus mutated corrupts everything after it)
{
  const after = fs.readFileSync(CORPUS, "utf8");
  ok(after === original, "the corpus was restored byte-for-byte");
  const final = run();
  ok(final.code === 0, "after restore: clean pass again", `exit=${final.code}`);
}

if (failures.length) {
  console.error(`\nclaim-drift controls FAILED (${failures.length} of ${checks}):\n`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(`\nclaim-drift controls pass: ${checks} checks, 0 failures.`);
console.log("Branches proven: GONE on content change, MOVED on line shift, clean when in sync.");
