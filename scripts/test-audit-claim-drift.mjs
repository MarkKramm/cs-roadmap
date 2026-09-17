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
// ---------------------------------------------------------------------------
// THE CONTROLS MUST NOT DEPEND ON A PACK THAT CAN LEGITIMATELY VANISH.
//
// The first version of this suite planted its defect at the location cited by row 2
// of `04-standards-frameworks-and-control-identifiers.md`. That was fine until the
// standards class was VERIFIED and the splitter correctly stopped emitting it -- at
// which point the pack disappeared, the guard found no row, and all three control-A
// assertions failed while the guard itself was working perfectly. **A control that
// fails because its fixture was cleaned up is a false alarm, and false alarms are
// how a real alarm gets ignored.**
//
// So the suite BUILDS ITS OWN FIXTURE: a temporary pack in the real pack folder,
// pointing at a corpus line it quotes itself. It depends on nothing that a
// verification pass can remove. The fixture is deleted in the finally, and the
// suite asserts it is gone -- a leftover fixture would be picked up by the bundle
// build as genuine outstanding work.
// ---------------------------------------------------------------------------
//
// Run: node scripts/test-audit-claim-drift.mjs

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-claim-drift.mjs");
const CORPUS = path.join(ROOT, "career-roadmaps", "cybersec-roadmap", "01-phase-foundations.md");
const FIXTURE = path.join(ROOT, "docs", "claims-to-verify-cyber", "99-drift-control-fixture.md");

// A corpus line to anchor the fixture to. Any stable line works; this one is in a
// phase that is not going to be restructured casually.
const ANCHOR_LINE = 478;

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
const corpusLines = original.split("\n");
const anchorText = (corpusLines[ANCHOR_LINE - 1] || "").trim();
if (!anchorText) {
  console.error(`fixture anchor line ${ANCHOR_LINE} of ${path.basename(CORPUS)} is empty`);
  process.exit(1);
}
// The fixture quotes the first 60 characters of the anchor line. Long enough to
// clear the guard's meaningful-text floor; short enough that a change inside the
// window is a change to the text the row cites.
const PROBE = anchorText.slice(0, 60);

// A pack containing exactly one row, pointing at the anchor line. Written into the
// REAL pack folder, because that is where the guard looks -- and deleted in the
// finally, with the deletion asserted.
function writeFixture() {
  fs.writeFileSync(
    FIXTURE,
    [
      "# Drift control fixture",
      "",
      "Written and deleted by `scripts/test-audit-claim-drift.mjs`. If this file is",
      "present outside a test run, the suite was interrupted before its cleanup.",
      "",
      "| # | Location | Text as written | Verdict |",
      "|---|---|---|---|",
      `| 1 | \`01-phase-foundations.md:${ANCHOR_LINE}\` | ${PROBE.replace(/\|/g, "\\|")} | |`,
      "",
    ].join("\n"),
    "utf8",
  );
}

try {
  // --- C (run first, so a failure there is not confused with an unrestored file)
  writeFixture();
  const clean = run();
  ok(clean.code === 0, "control C: a fresh pack set passes", `exit=${clean.code}`);
  ok(
    /in sync with the cybersec-roadmap corpus/.test(clean.out),
    "control C: the pass says what it means",
    clean.out.trim().split("\n").pop(),
  );

  // --- A: content changed out from under a pack row (the real 2026-09-17 bug)
  //
  // Change a character INSIDE the window the fixture quotes, so the row describes a
  // sentence that no longer exists -- exactly what happened when the NIST CSF 5-to-6
  // fix landed AFTER extraction, producing four false WRONG verdicts from a real
  // verifier that was correct about what it had been given.
  //
  // Deliberately NOT a plant at a location a real pack happens to cite: an earlier
  // version did that, and stopped working the moment that class was verified and its
  // pack was correctly withheld.
  const changed = original.replace(PROBE, "X" + PROBE.slice(1));
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
  if (fs.existsSync(FIXTURE)) fs.rmSync(FIXTURE);
}

// --- and prove both restores worked. This suite mutates BOTH the curriculum and
// --- the pack folder, so a failure to clean up would corrupt the repository for
// --- every later step -- and a leftover fixture pack would be read by the bundle
// --- build as genuine outstanding work.
{
  const after = fs.readFileSync(CORPUS, "utf8");
  ok(after === original, "the corpus was restored byte-for-byte");
  ok(!fs.existsSync(FIXTURE), "the fixture pack was removed");
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
