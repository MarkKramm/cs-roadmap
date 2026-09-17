// Controls for audit-quiz.mjs class 3 — the CORPUS-level answer balance rule.
//
// A guard is only worth having if a failing result and a passing result are
// distinguishable by the check itself (docs/DECISIONS.md -> the guard doctrine).
// Class 3 gates a property that only exists once every phase has been read, so
// it cannot be tested one phase at a time: the probes here rewrite the whole
// corpus in a scratch copy and require the guard to fail.
//
// WHY THIS FILE EXISTS
// Class 3 was written on 2026-09-17 to close an item that had been open for
// passes: the corpus distribution was printed on every run and never gated, and
// it drifted in the documentation anyway (one file quoted A=90 B=97 C=97 D=96
// while the guard printed C=98 D=97). Writing the rule was the easy half.
//
// The rule was WRONG TWICE before these controls passed, and both failures were
// invisible from the green output:
//
//   1. The floor was gated on `usedCount >= 4`, the number of NON-EMPTY
//      positions. Abandoning a position removes it from that count, so the one
//      defect the floor exists to catch was the one defect that switched it off.
//   2. The opportunity map was built with `for (const shape of optionShapes)`
//      over a Map, then read `shape.options`. A Map yields [key, value] pairs,
//      so that was undefined and the map stayed empty. The floor was dead code.
//
// In both cases the guard still exited 1 in the probe scenario, for an unrelated
// per-phase reason — 32 per-phase findings — so a careless control would have
// recorded PASS. That is why every probe below asserts WHICH branch fired, not
// merely that the exit code was non-zero. An exit code is not evidence that the
// branch you just wrote is the branch that ran.
import { mkdtempSync, writeFileSync, rmSync, readFileSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-quiz.mjs");
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

// Copy the repo to a scratch dir. node_modules and .git are skipped; the content
// tree is what the guard reads. Written by hand rather than shelled out so this
// behaves the same on Windows and in CI.
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "tm") continue;
    const s = join(src, e.name);
    const d = join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else copyFileSync(s, d);
  }
}

function runGuardIn(cwd) {
  try {
    const out = execFileSync(process.execPath, [join(cwd, GUARD_REL)], {
      cwd, // explicit: inheriting the caller's cwd read the wrong corpus once
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status === undefined ? 1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

// Apply `fn` to the option list of every question in the scratch corpus. A
// question's option block is a maximal run of `- [ ]` / `- [x]` lines; the
// replacement is only written when the run actually contains a marked answer,
// so a practice-task checklist elsewhere in the file cannot be mistaken for a
// quiz question. (It can, in a naive scan — that mistake produced "22-option
// questions" during development, from a run that mixed a quiz and a checklist.)
function rewriteAnswers(scratch, fn) {
  let touched = 0;
  let turn = 0;
  for (const track of TRACKS) {
    const dir = join(scratch, "career-roadmaps", track);
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      let text = readFileSync(p, "utf8");
      const next = text.replace(/((?:^- \[[ x]\] .*\n)+)/gm, (block) => {
        const lines = block.trimEnd().split("\n");
        const marked = lines.findIndex((l) => l.startsWith("- [x] "));
        if (marked < 0) return block; // a checklist, not a question
        const stripped = lines.map((l) => l.replace(/^- \[x\] /, "- [ ] "));
        const target = fn(marked, lines.length, turn++);
        if (target < 0 || target >= stripped.length) return block;
        stripped[target] = stripped[target].replace(/^- \[ \] /, "- [x] ");
        touched++;
        return stripped.join("\n") + "\n";
      });
      if (next !== text) writeFileSync(p, next);
    }
  }
  return touched;
}

let allPassed = true;
const results = [];

function record(name, passed, detail) {
  if (!passed) allPassed = false;
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

// --- Control A: the real corpus must pass -----------------------------------
// Guards that fail on healthy content get disabled, so this is the control that
// is easiest to forget and most important to keep.
{
  const scratch = mkdtempSync(join(tmpdir(), "cs-quiz-ctl-a-"));
  copyTree(ROOT, scratch);
  const r = runGuardIn(scratch);
  const corpus = r.out.split("\n").find((l) => /answer position across/.test(l))?.trim() ?? "(no corpus line)";
  record("control A: the real corpus passes class 3", r.code === 0, [
    `exit ${r.code} (want 0)`,
    corpus,
  ]);
  rmSync(scratch, { recursive: true, force: true });
}

// --- Control B: the corpus collapsed onto one position ----------------------
// This is the headline defect: every answer at A, which is what a batch of
// quizzes written by one author in one sitting tends to do. Per-phase this may
// or may not trip class 1 depending on quiz size — which is exactly why the
// corpus rule is needed and why this control asserts the corpus branch.
{
  const scratch = mkdtempSync(join(tmpdir(), "cs-quiz-ctl-b-"));
  copyTree(ROOT, scratch);
  const n = rewriteAnswers(scratch, () => 0); // every answer to position A
  if (n < 50) {
    record("control B: corpus collapsed onto A fails", false, [`PROBE INVALID: only ${n} questions rewritten`]);
  } else {
    const r = runGuardIn(scratch);
    const ceiling = /above the 35% ceiling/.test(r.out);
    record("control B: corpus collapsed onto A fails on the CEILING", r.code !== 0 && ceiling, [
      `rewrote ${n} questions to position A`,
      `exit ${r.code}; ceiling branch fired=${ceiling}`,
      r.out.split("\n").find((l) => /\(corpus\).*ceiling/.test(l))?.trim() ?? "(no ceiling finding)",
    ]);
  }
  rmSync(scratch, { recursive: true, force: true });
}

// --- Control C: one position abandoned, ceiling NOT tripped -----------------
// The trap this control is built to avoid: spreading all D-answers onto a single
// other letter trips the ceiling, so the guard fails for the wrong reason and
// the floor is never exercised. Answers are rotated across A/B/C instead, which
// leaves the ceiling clear and forces the FLOOR branch to be the one that fires.
{
  const scratch = mkdtempSync(join(tmpdir(), "cs-quiz-ctl-c-"));
  copyTree(ROOT, scratch);
  // Only touch questions whose answer sits at position D (index 3).
  let turn = 0;
  const n = rewriteAnswers(scratch, (marked) => (marked === 3 ? [0, 1, 2][turn++ % 3] : -1));
  if (n < 20) {
    record("control C: abandoning a position fires the FLOOR", false, [`PROBE INVALID: only ${n} D-answers moved`]);
  } else {
    const r = runGuardIn(scratch);
    const floor = /no answers at all|below the 15% floor/.test(r.out);
    const ceiling = /above the 35% ceiling/.test(r.out);
    record("control C: abandoning a position fires the FLOOR, not the ceiling", r.code !== 0 && floor && !ceiling, [
      `moved ${n} answers off position D, rotated across A/B/C`,
      `exit ${r.code}; floor fired=${floor}; ceiling fired=${ceiling} (want floor only)`,
      r.out.split("\n").find((l) => /\(corpus\)/.test(l))?.trim() ?? "(no corpus finding)",
    ]);
  }
  rmSync(scratch, { recursive: true, force: true });
}

console.log("");
if (allPassed) {
  console.log("All class-3 controls passed: the corpus-level rule can fail, and only on real skew.");
} else {
  console.log(`${results.filter((r) => !r.passed).length} control(s) FAILED — class 3 is not trustworthy.`);
}
process.exit(allPassed ? 0 : 1);
