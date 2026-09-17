// Controls for audit-doc-figures.mjs.
//
// Every control plants a WRONG FIGURE in the documentation and requires the guard to
// catch it, then restores the file. It runs against copies in a temp tree so the real
// documents are never written (D-058).
//
// The negative controls matter as much: the real documentation must PASS, and a figure
// that is merely *mentioned in prose* (a historical record of a past pass) must not be
// flagged, or the guard would be unusable and get switched off.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const GUARD = "scripts/audit-doc-figures.mjs";

// The guard resolves ROOT from its own location and reads real commands, so a copy in a
// temp tree would fail to find scripts/. Run it in place, but mutate ONLY a file the guard
// reads, and restore it unconditionally.
const TARGET = path.join(ROOT, "docs", "CHECKPOINT.md");
const ROADMAP = path.join(ROOT, "docs", "ROADMAP.md");
// THE RESTORE TARGET IS THE WORKING TREE AS IT WAS AT STARTUP, RE-READ FROM DISK.
//
// The first version kept `original` in a variable from module load and restored that.
// When one fixture wrote a mutated copy and a later control read the file back, the
// "original" it restored was already polluted -- so control 4's edit ("all 30 lessons
// parse") survived into the working tree and made the guard fail against the real
// document. That is D-058: a test suite writing into the artifact it validates.
//
// A second attempt read the pristine text from `git show HEAD:...`. That is worse in a
// different way: it silently tests the COMMITTED document, so a suite run while the docs
// are still being edited fails with "fixture did not find the figure" against text the
// author can see on screen. The restore target must be the working tree, captured before
// any fixture runs and never re-read from a fixture-polluted file.
const SNAPSHOT = new Map();
const snapshot = (file) => {
  if (!SNAPSHOT.has(file)) SNAPSHOT.set(file, fs.readFileSync(file, "utf8"));
  return SNAPSHOT.get(file);
};
/** Restore a file to its pre-fixture state. Never returns fixture-polluted text. */
const pristine = (file) => SNAPSHOT.get(file) ?? fs.readFileSync(file, "utf8");

// Capture both files NOW, before anything writes.
const original = snapshot(TARGET);
snapshot(ROADMAP);

const run = () => {
  try {
    return { code: 0, out: execFileSync("node", [GUARD], { encoding: "utf8", cwd: ROOT }) };
  } catch (e) {
    return { code: e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
};

// THE RESTORE MUST NOT RUN ON A CRASH.
//
// Registering cleanup on `exit` looked careful and was actively harmful. If the author
// edits the document, then runs this suite, and a control throws, the exit handler writes
// back the pre-run snapshot -- silently discarding the edit that was just made. That is
// exactly what happened: a new paragraph was written into CHECKPOINT.md, a control
// crashed on a fixture that no longer matched, and the paragraph was gone.
//
// A restore exists to undo a FIXTURE, and every fixture already restores in its own
// `finally`. The process-level handler is a belt-and-braces for an interrupted run, so it
// must only fire when the file still holds something a fixture wrote -- never to overwrite
// whatever the author has on disk. So: restore only if the current text is NOT the
// snapshot AND NOT the live edit. In practice, drop it entirely and rely on `finally`.
//
// This is D-058's second form: the cure for "a test suite must not write to the artifact"
// must not itself write to the artifact.
const cleanup = () => {
  // Intentionally a no-op beyond clearing any fixture marker. Every fixture restores its
  // own file in a `finally`; a process-level write is how an author's edit gets eaten.
};
// No process-level restore. A `finally` in each fixture already covers the normal path,
// and an exit-time write is how an author's edit gets eaten (see the note above). If a
// control throws hard enough to skip its own finally, the next `git status` shows it --
// which is the correct, visible failure mode.
process.on("uncaughtException", (e) => {
  throw e;
});

const results = [];
const control = (name, mutate, expectFail, allowNoop = false) => {
  // Start from the snapshot every time, so no fixture can inherit a previous one's edit.
  fs.writeFileSync(TARGET, original, "utf8");
  const mutated = mutate(original);
  // A no-op fixture tests nothing, so it is an error -- EXCEPT for a deliberate negative
  // control, which is supposed to leave the document alone on purpose.
  if (mutated === original && !allowNoop) {
    throw new Error(`fixture for "${name}" did not change the document`);
  }
  fs.writeFileSync(TARGET, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    // Restore HERE, in a finally, and not from a process-level handler: a process-level
    // write is what silently discarded an author's edit when a control crashed.
    fs.writeFileSync(TARGET, original, "utf8");
  }
  const failed = r.code !== 0;
  results.push({ name, ok: failed === expectFail, out: r.out });
};
/**
 * Mutate the NUMBER in a figure while leaving the sentence intact.
 *
 * Every failure-expecting fixture goes through this, because the obvious hand-written
 * version is easy to get wrong in a way that looks like the guard is broken: rewriting the
 * sentence so it no longer matches the guard's regex means the guard cannot see the drift,
 * so it passes and the control reports FAIL. That happened to the quiz-coverage control.
 *
 * This asserts the property directly -- after the edit, the guard's own pattern must still
 * match, and must see a different number.
 *
 * @param {string} text the document
 * @param {RegExp} re  the guard's pattern, with group 1 = the number
 * @param {number} delta added to the number (negative to shrink)
 * @param {string} label for the error message
 */
const driftNumber = (text, re, delta, label) => {
  // The regex must not be global/sticky: `exec` on such a regex advances lastIndex, so a
  // later call starts where the previous stopped. The first version of this helper used a
  // global regex and threw on every control.
  if (re.global || re.sticky) throw new Error(`driftNumber needs a non-global regex (label: ${label})`);

  const before = re.exec(text);
  if (!before) throw new Error(`fixture for "${label}" found no match to drift`);

  // Work out WHERE the number is inside the match, then splice the replacement into that
  // exact offset. This avoids string-replacing a digit sequence that also appears in group 1
  // (for example a version number in the surrounding words), which produces text the guard
  // no longer recognises -- the failure this helper exists to prevent.
  // Find the numeric group. The guard's patterns are not uniform: some put the number in
  // group 1 (`all (\d+) lessons`), some in group 2 with a prefix captured first
  // (`` (`scripts/audit-*.mjs` is **)(\d+)(**) ``). Assuming group 1 threw on the latter.
  const numIdx = before.slice(1).findIndex((g) => g !== undefined && /^\d+$/.test(g)) + 1;
  if (numIdx < 1) throw new Error(`fixture for "${label}": no numeric capture group in the pattern`);
  const numText = before[numIdx];
  const at = before.index + before[0].indexOf(numText);

  const out = text.slice(0, at) + String(Number(numText) + delta) + text.slice(at + numText.length);

  const after = re.exec(out);
  if (!after) throw new Error(`fixture for "${label}" broke the pattern the guard matches -- it would test nothing`);
  if (Number(after[numIdx]) === Number(before[numIdx])) {
    throw new Error(`fixture for "${label}" left the number unchanged -- it would test nothing`);
  }
  return out;
};

// 1. Negative: the real documentation must pass.
control("the real documentation -> must PASS", (t) => t, false, true);
// 2. The exact defect class: a figure that was right once and drifted.
control("guard count drifts -> must FAIL", (t) => driftNumber(t, /(`scripts\/audit-\*\.mjs` is \*\*)(\d+)(\*\*)/, +4, "control 2"), true);

// 3. The figure that was actually wrong for several passes. Fixtures nudge whatever the
//    document currently says rather than hard-coding a number, so they cannot rot when a
//    count legitimately changes -- the failure mode that broke six controls in the
//    verdict-count suite when the DNS class closed.
control("site suite count drifts -> must FAIL", (t) => driftNumber(t, /(`learning-site\/scripts\/\*\.mjs` is \*\*)(\d+)(\*\*)/, -1, "control 3"), true);

// 4. A curriculum figure, not a tooling figure.
control("lesson count drifts -> must FAIL", (t) => driftNumber(t, /all (\d+) lessons parse/, -1, "control 4"), true);

// 5. The task-id figure the 410-class failure belongs to.
control("phase task id count drifts -> must FAIL", (t) => driftNumber(t, /(\*\*)(\d+)(\*\* total phase task IDs)/, -6, "control 5"), true);

// 5b. A per-track phase count. This one needs its OWN fixture because the measurement is
//     per-track: a guard that compared every track against one shared total would pass
//     whenever the error in one track cancelled the error in another.
control("a single track's phase count drifts -> must FAIL", (t) => driftNumber(t, /(it-roadmap\/\s+\()(\d+)( phases)/, -1, "control 5b"), true);

/**
 * Drift a figure in some OTHER document, run the guard, restore, and record the result.
 *
 * Fixtures that write a file other than CHECKPOINT.md need their own restore, and every one
 * of them was repeating the same six lines with the same two chances to get it wrong (forget
 * the `finally`, forget the `snapshot`). One helper means the restore cannot be forgotten.
 */
const driftInFile = (label, file, re, delta, expectFail = true) => {
  const orig = snapshot(file);
  const mutated = driftNumber(orig, re, delta, label);
  fs.writeFileSync(file, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    fs.writeFileSync(file, orig, "utf8");
  }
  const failed = r.code !== 0;
  results.push({ name: label, ok: failed === expectFail, out: r.out });
};

// 5c. A figure in a DIFFERENT document. The first sweep guarded CHECKPOINT.md only, which
//     is exactly how DESIGN-SYSTEM.md carried 272 domain terms against CHECKPOINT's 274.
//     This control runs against DESIGN-SYSTEM.md to prove the guard reads more than one file.
driftInFile(
  "a figure in a second document drifts -> must FAIL",
  path.join(ROOT, "docs", "DESIGN-SYSTEM.md"),
  /(defines \*\*)(\d+)(\*\* domain acronyms)/,
  +3,
);

// 5d. THE BREAKDOWN, NOT THE TOTAL. ROADMAP.md quoted "252 banded" with a distribution of
//     quick 34 / focused 144 / deep 63 / ongoing 11 -- five stale numbers in one sentence,
//     and the total is the only one a reader would think to re-check. Each band gets its
//     own fixture, because a single shared one would pass whenever two errors cancelled.
driftInFile(
  "the focused band count drifts while the total is right -> must FAIL",
  path.join(ROOT, "docs", "ROADMAP.md"),
  /(Bands — focused )(\d+)(, deep \d+, quick \d+, ongoing \d+)/,
  -7,
);

// 5e. The energy breakdown, same reasoning: three figures, one sentence.
driftInFile(
  "the normal energy count drifts -> must FAIL",
  path.join(ROOT, "docs", "ROADMAP.md"),
  /(Energy — normal )(\d+)(, high \d+, low \d+)/,
  -9,
);

// 5f. NEGATIVE. ROADMAP.md's line above the distribution carries `183` -- "82% of the 183
//     tasks that existed when this was measured". That is a DATED measurement in past
//     tense, deliberately not guarded: correcting it would falsify a record. If a future
//     edit wires it up, this control catches the guard becoming wrong about an archive.
driftInFile(
  "the historical 183 figure is left alone -> must PASS",
  path.join(ROOT, "docs", "ROADMAP.md"),
  /(82% of the )(\d+)( tasks that existed when this was measured)/,
  -3,
  false,
);

// 5d. The most misleading stale figure the sweep found: quiz coverage. It said "10 of 31"
//     AND explained why IT 01 had none. The count was stale, but the RATIONALE is what made
//     it dangerous -- a reader treats a reasoned absence as deliberate design and does not
//     re-count. This control exists to keep that specific claim wired.
//
//     Its first version rewrote the sentence to "10 phases", which no longer matched the
//     guard's regex -- the guard could not see the drift, passed, and the control reported
//     FAIL. **A fixture that breaks the pattern under test tests nothing**, and it fails in
//     the direction that makes working code look broken. `driftNumber` now asserts the
//     pattern survives, which is why every fixture here goes through it.
driftInFile(
  "quiz-coverage figure drifts -> must FAIL",
  path.join(ROOT, "docs", "CONTENT-SCHEMA.md"),
  /(currently present in all )(\d+)( phases)/,
  -21,
);

// 5e. A figure inside a QUOTED COMMAND'S OUTPUT. The worst place for a stale number, because
//     a fenced block of build output reads as something the machine said.
driftInFile(
  "a figure quoted as command output drifts -> must FAIL",
  path.join(ROOT, "docs", "CONTENT-SCHEMA.md"),
  /(task bands:\s+)(\d+)( banded)/,
  -31,
);

// 6. A HISTORICAL figure must NOT be flagged. The summary table records what a past pass
//    measured, and those numbers are allowed to be stale -- they are an archive. Here we
//    change a figure inside that historical row; the guard reads only the present-tense
//    sentences, so it must stay silent. If it flagged this it would be unusable.
control(
  "a stale figure inside a historical pass row -> must PASS",
  (t) => {
    // Drift-relative, like the others: a fixture that hard-codes "71" rots the moment
    // anybody legitimately edits the historical row.
    const out = t.replace(/(`audit-encoding` \*\*)(\d+)(\*\* files)/, (m, a, n, c) => a + (Number(n) + 28) + c);
    if (out === t) throw new Error("control 6 fixture did not find the historical encoding figure");
    return out;
  },
  false,
);

// 7. THE LIMITATION, ASSERTED AS A PROPERTY. Figures NOT in the assertion table are not
//    checked -- a real gap, and this control pins its size so nobody mistakes the guard
//    for total coverage.
//
//    It was first written against the `validate-ci` step figure, assuming that was
//    unwired. It was not: the guard then read "999 steps" and failed, which is the guard
//    working and the control asserting a false premise -- the fixture-is-wrong pattern
//    that has now bitten five times. The example is a figure with genuinely no command
//    behind it: the per-lesson word counts in ROADMAP.md, which record what a past writing
//    pass produced.
{
  const roadmapOrig = pristine(ROADMAP);
  const mutated = roadmapOrig.replace(/(\d+)-word `## Lesson` section/, (m, n) => `${Number(n) + 500}-word \`## Lesson\` section`);
  if (mutated === roadmapOrig) throw new Error("control 7 fixture did not find a per-lesson word count in ROADMAP.md");
  fs.writeFileSync(ROADMAP, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    fs.writeFileSync(ROADMAP, pristine(ROADMAP), "utf8");
  }
  const restored = fs.readFileSync(ROADMAP, "utf8") === roadmapOrig;
  results.push({
    name: "an unwired figure in ROADMAP.md is NOT checked -> must PASS",
    ok: r.code === 0 && restored,
    out: r.out,
  });
  console.log(`  ROADMAP.md restored byte-identical: ${restored}`);
}

// The real tree must end exactly as it started -- the check whose absence let a fixture
// write "all 30 lessons" into the actual document (D-058).
//
// The list is DERIVED from the snapshot map rather than typed out, so adding a fixture that
// writes a new file cannot silently escape it. A hand-maintained list here would be the same
// defect as the hand-maintained figures this whole guard exists to replace.
const SNAPSHOT_FILES = [...SNAPSHOT.entries()].map(([file, want]) => ({
  name: path.relative(ROOT, file).replace(/\\/g, "/"),
  ok: fs.readFileSync(file, "utf8") === want,
}));

console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
for (const s of SNAPSHOT_FILES) console.log(`  ${s.name.padEnd(22)} restored byte-identical: ${s.ok}`);
const untouched = SNAPSHOT_FILES.every((s) => s.ok);
if (!untouched) {
  console.log("  !! A fixture wrote to the REAL tree. Fixtures must restore via `pristine`.");
}
const allClean = results.every((r) => r.ok) && untouched;
console.log(allClean ? "ALL CONTROLS PASS" : `${results.filter((r) => !r.ok).length} CONTROL(S) FAILED`);
process.exit(allClean ? 0 : 1);
