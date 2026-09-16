// Controls for audit-quiz-sourcing.mjs.
//
// A guard is only worth having if a failing result and a passing result are
// distinguishable by the check itself (see docs/DECISIONS.md -> the guard
// doctrine). So every detection rule in audit-quiz-sourcing gets a probe that
// MUST be caught, and the clean corpus must still pass.
//
// WHY THIS FILE EXISTS AT ALL
// The last quiz guard written in this repository shipped without a
// `process.exit(1)`. It printed findings and exited 0, so CI would have stayed
// green on a real defect. The controls are what caught it. This file is that
// lesson applied in advance rather than after the fact.
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD = join(ROOT, "scripts", "audit-quiz-sourcing.mjs");
const PROBE = join(ROOT, "career-roadmaps", "cybersec-roadmap", "__probe-phase.md");

// Run the guard with no arguments -- it scans whatever phase files exist.
function runGuard() {
  try {
    const out = execFileSync(process.execPath, [GUARD], {
      cwd: ROOT, // explicit: inheriting the caller's cwd silently skipped probes once
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status === undefined ? 1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

// A well-formed probe phase. `quiz` is the quiz markdown body; frontmatter and
// enough surrounding section structure to look like a real phase.
function probeDoc(quiz) {
  return `---
id: cyber-99-probe
track: cyber
phase: 99
title: "Phase 99 — Probe"
duration: "1 week"
duration_weeks: 1
---

# Phase 99 — Probe

## Lesson

Subnetting uses a block size derived from the mask octet. A /26 has a block
size of 64, so networks begin at 0, 64, 128 and 192. The broadcast address is
one less than the next block boundary, and usable hosts sit between them.
Wireshark captures packets, and grep filters log lines by pattern.

## Quiz

${quiz}
## Checklist

- [ ] Probe item. <!-- id: cyber-99-c01 energy: low -->
`;
}

// Correct quiz markdown: 4 questions, ids matching the real convention
// (`cyber-99-q<nn>` -- track and phase number, not the frontmatter id),
// balanced answers (one in each position), each with a teaching-length Why.
function goodQuiz() {
  const mk = (n, pos) => {
    const opts = [0, 1, 2, 3].map((i) => `- [${i === pos ? "x" : " "}] Option ${"ABCD"[i]} for question ${n}.`);
    return `### Q${n}. Probe question ${n} about subnetting block size? <!-- id: cyber-99-q${String(n).padStart(2, "0")} energy: normal -->

${opts.join("\n")}

**Why:** The mask octet determines the block size, and the broadcast is one less than the next block boundary, so the arithmetic is deterministic and checkable without a tool.

`;
  };
  return mk(1, 0) + mk(2, 1) + mk(3, 2) + mk(4, 3);
}

const controls = [];
function control(name, quiz, expectFail, mutate) {
  controls.push({ name, quiz, expectFail, mutate });
}

// --- MUST FAIL -----------------------------------------------------------------
control(
  "detects 3 options (too few to be a test of anything)",
  goodQuiz().replace("- [ ] Option D for question 1.", ""),
  true
);
control(
  "detects 6 options (beyond the 5 the format allows)",
  goodQuiz().replace(
    "- [ ] Option D for question 1.",
    "- [ ] Option D for question 1.\n- [ ] Option E for question 1.\n- [ ] Option F for question 1."
  ),
  true
);
control(
  "detects two marked correct answers",
  // Mark question 2's *distractor* C as correct as well. Targeting "Option B"
  // here was the first attempt and it silently did nothing: B is already
  // question 2's correct answer in a position-balanced quiz, so the replace
  // rewrote the marked line as itself. A control that cannot change the probe
  // cannot fail the guard, and it reports as a guard weakness when it is
  // actually the control that is broken.
  goodQuiz().replace("- [ ] Option C for question 2.", "- [x] Option C for question 2."),
  true
);
control(
  "detects a missing **Why:** line",
  goodQuiz().replace(/\*\*Why:\*\*[^\n]*\n/, ""),
  true
);
control(
  "detects a Why: too short to teach",
  goodQuiz().replace(/\*\*Why:\*\*[^\n]*/, "**Why:** Because."),
  true
);
control(
  "detects a wrong question id prefix",
  goodQuiz().replace(/cyber-99-q02/, "cyber-99-probe-q99"),
  true
);
control(
  "detects a numbering gap",
  goodQuiz().replace("### Q4.", "### Q7.").replace("cyber-99-q04", "cyber-99-q07"),
  true
);
control(
  "detects all answers in one position (over 50%)",
  (() => {
    let q = goodQuiz();
    // Force every question's correct answer into position A.
    q = q.replace("- [x] Option B for question 2.", "- [ ] Option B for question 2.");
    q = q.replace("- [ ] Option A for question 2.", "- [x] Option A for question 2.");
    q = q.replace("- [x] Option C for question 3.", "- [ ] Option C for question 3.");
    q = q.replace("- [ ] Option A for question 3.", "- [x] Option A for question 3.");
    q = q.replace("- [x] Option D for question 4.", "- [ ] Option D for question 4.");
    q = q.replace("- [ ] Option A for question 4.", "- [x] Option A for question 4.");
    return q;
  })(),
  true
);
control(
  "detects a position never used",
  (() => {
    let q = goodQuiz();
    q = q.replace("- [x] Option D for question 4.", "- [ ] Option D for question 4.");
    q = q.replace("- [ ] Option C for question 4.", "- [x] Option C for question 4.");
    return q;
  })(),
  true
);
control(
  "detects a question sourced from a different phase",
  goodQuiz().replace(
    /### Q1\.[\s\S]*?\n\n/,
    `### Q1. Which NIST CSF function was added in version 2.0 to cover governance and risk strategy? <!-- id: cyber-99-q01 energy: normal -->

- [x] Govern, which CSF 2.0 added alongside the five functions from CSF 1.1
- [ ] Identify, which was renamed when the framework was reorganised
- [ ] Protect, which absorbed the previous risk management category
- [ ] Recover, which was split out of the response function

**Why:** CSF 2.0 added Govern as a sixth function, expanding the five functions that CSF 1.1 defined, and it sits at the centre of the wheel because every other function depends on it.

`
  ),
  true
);
control(
  "detects a quiz placed after the checklist",
  goodQuiz(),
  true,
  (doc) => {
    const qStart = doc.indexOf("## Quiz");
    const cStart = doc.indexOf("## Checklist");
    const quiz = doc.slice(qStart, cStart);
    const rest = doc.slice(0, qStart) + doc.slice(cStart);
    return rest + "\n" + quiz;
  }
);

// --- MUST PASS -----------------------------------------------------------------
control("accepts a well-formed 4-question quiz", goodQuiz(), false);
control(
  "accepts a legitimate 5-option question (the format allows a real 5th distractor)",
  goodQuiz().replace(
    "- [ ] Option D for question 1.",
    "- [ ] Option D for question 1.\n- [ ] Option E for question 1."
  ),
  false
);

// --- run ----------------------------------------------------------------------
let failures = 0;
console.log("");
console.log("=== must-fail controls (the guard has to catch each of these) ===");
for (const c of controls.filter((x) => x.expectFail)) {
  const doc = probeDoc(c.quiz);
  const final = c.mutate ? c.mutate(doc) : doc;
  writeFileSync(PROBE, final, { encoding: "utf8" });
  const r = runGuard();
  const caught = r.code !== 0;
  if (caught) {
    console.log(`  ok    ${c.name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${c.name} -- the guard stayed green. It cannot see this defect.`);
  }
}

console.log("");
console.log("=== must-pass controls (the guard must not flag correct work) ===");
for (const c of controls.filter((x) => !x.expectFail)) {
  const doc = probeDoc(c.quiz);
  const final = c.mutate ? c.mutate(doc) : doc;
  writeFileSync(PROBE, final, { encoding: "utf8" });
  const r = runGuard();
  if (r.code === 0) {
    console.log(`  ok    ${c.name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${c.name} -- the guard flagged correct work:`);
    for (const line of r.out.split("\n").filter((l) => l.includes("FAIL")).slice(0, 4)) {
      console.log(`          ${line.trim()}`);
    }
  }
}

// Clean up, and confirm the real corpus is unaffected.
try {
  rmSync(PROBE, { force: true });
} catch {}

console.log("");
console.log("=== the real corpus, with the probe removed ===");
const real = runGuard();
if (real.code === 0) {
  const line = real.out.split("\n").find((l) => l.includes("questions checked")) || "";
  console.log(`  ok    corpus passes  ${line.trim()}`);
} else {
  failures++;
  console.log("  FAIL  corpus does not pass:");
  for (const line of real.out.split("\n").filter((l) => l.includes("FAIL")).slice(0, 6)) {
    console.log(`          ${line.trim()}`);
  }
}

console.log("");
if (failures) {
  console.log(`${failures} control(s) failed.`);
  process.exit(1);
}
console.log(`All ${controls.length + 1} quiz-sourcing controls behaved correctly.`);
