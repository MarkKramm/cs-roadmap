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

// 1. Negative: the real documentation must pass.
control("the real documentation -> must PASS", (t) => t, false, true);

// 2. The exact defect class: a figure that was right once and drifted.
control(
  "guard count drifts -> must FAIL",
  (t) => {
    const out = t.replace(/(`scripts\/audit-\*\.mjs` is \*\*)(\d+)(\*\*)/, (m, a, n, c) => a + (Number(n) + 4) + c);
    if (out === t) throw new Error("control 2 fixture did not find the guard-count figure");
    return out;
  },
  true,
);

// 3. The figure that was actually wrong for several passes. Fixtures nudge whatever the
//    document currently says rather than hard-coding a number, so they cannot rot when a
//    count legitimately changes -- the failure mode that broke six controls in the
//    verdict-count suite when the DNS class closed.
control(
  "site suite count drifts -> must FAIL",
  (t) => {
    const out = t.replace(/(`learning-site\/scripts\/\*\.mjs` is \*\*)(\d+)(\*\*)/, (m, a, n, c) => a + Math.max(0, Number(n) - 1) + c);
    if (out === t) throw new Error("control 3 fixture did not find the site-suite figure");
    return out;
  },
  true,
);

// 4. A curriculum figure, not a tooling figure.
control(
  "lesson count drifts -> must FAIL",
  (t) => {
    const out = t.replace(/all (\d+) lessons parse/, (m, n) => `all ${Number(n) - 1} lessons parse`);
    if (out === t) throw new Error("control 4 fixture did not find the lesson count");
    return out;
  },
  true,
);

// 5. The task-id figure the 410-class failure belongs to.
control(
  "phase task id count drifts -> must FAIL",
  (t) => {
    const out = t.replace(/(\*\*)(\d+)(\*\* total phase task IDs)/, (m, a, n, c) => a + (Number(n) - 6) + c);
    if (out === t) throw new Error("control 5 fixture did not find the task-id figure");
    return out;
  },
  true,
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
const untouched = fs.readFileSync(TARGET, "utf8") === original;
const roadmapUntouched = fs.readFileSync(ROADMAP, "utf8") === pristine(ROADMAP);
console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
console.log(`  CHECKPOINT.md restored byte-identical: ${untouched}`);
console.log(`  ROADMAP.md    restored byte-identical: ${roadmapUntouched}`);
if (!untouched || !roadmapUntouched) {
  console.log("  !! A fixture wrote to the REAL tree. Fixtures must restore via `pristine`.");
}
const allClean = results.every((r) => r.ok) && untouched && roadmapUntouched;
console.log(allClean ? "ALL CONTROLS PASS" : `${results.filter((r) => !r.ok).length} CONTROL(S) FAILED`);
process.exit(allClean ? 0 : 1);
