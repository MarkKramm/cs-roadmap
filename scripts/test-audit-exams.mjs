// Controls for audit-exams.mjs.
//
// Every control mutates a real paper, runs the guard, and restores in `finally` from a
// startup snapshot -- never from a process-level handler, which once silently discarded an
// author's edit in this repository (D-062).
//
// The mutation that matters most is control 5: a paper whose claimed domain weight no longer
// matches its questions. That is the defect a reader cannot see, and the reason this guard
// exists rather than a note in the README.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GUARD = "scripts/audit-exams.mjs";
const TARGET = path.join(ROOT, "career-roadmaps", "exams", "security-plus.md");

const SNAPSHOT = new Map();
const snapshot = (f) => {
  if (!SNAPSHOT.has(f)) SNAPSHOT.set(f, fs.readFileSync(f, "utf8"));
  return SNAPSHOT.get(f);
};
const original = snapshot(TARGET);

const run = () => {
  try {
    return { code: 0, out: execFileSync("node", [GUARD], { encoding: "utf8", cwd: ROOT }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") };
  }
};

const results = [];

// A second entry point for controls whose defect lives in a different file. The guard reads
// every paper in the directory, so a fixture may target whichever file the defect belongs in
// -- the README, for instance, is the only file that links between papers.
//
// DEFINED BEFORE `control`, deliberately: `control` calls it, and an arrow function assigned
// to a `const` is in the temporal dead zone until its own line executes. Calling it from above
// throws `Cannot access 'controlIn' before initialization` -- which is exactly what happened
// when this helper was first added, in this file, earlier in this same session.
const controlIn = (file, name, mutate, expectFail, allowNoop = false) => {
  const before = snapshot(file);
  fs.writeFileSync(file, before, "utf8");
  const mutated = mutate(before);
  if (mutated === before && !allowNoop) throw new Error(`fixture for "${name}" changed nothing`);
  fs.writeFileSync(file, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    fs.writeFileSync(file, before, "utf8");
  }
  results.push({ name, ok: (r.code !== 0) === expectFail, out: r.out, file });
};

const control = (name, mutate, expectFail, allowNoop = false) =>
  controlIn(TARGET, name, mutate, expectFail, allowNoop);

// 1. The real paper passes.
control("the real paper -> must PASS", (t) => t, false, true);

// 2. Two marked answers. The reader cannot tell which was intended, and the page still
//    looks completely normal -- which is why this is checked mechanically.
control("a question with two marked answers -> must FAIL", (t) =>
  t.replace(/(### Q1\.[\s\S]*?)(- \[ \] Availability)/, "$1- [x] Availability"), true);

// 3. No marked answer at all: unanswerable.
control("a question with no marked answer -> must FAIL", (t) =>
  t.replace(/(### Q1\.[\s\S]*?)- \[x\] \*\*Integrity\*\*/, "$1- [ ] **Integrity**"), true);

// 4. A missing explanation. A practice question without its `Why` teaches nothing, and it
//    looks exactly like a question that has one.
control("a question with no explanation -> must FAIL", (t) =>
  t.replace(/(### Q2\. [\s\S]*?)\n\*\*Why:\*\*[^\n]*\n/, "$1\n"), true);

// 5. THE ONE THAT MATTERS. Claim a domain weight the questions do not support. A reader
//    would study the wrong proportion of the syllabus and nothing on the page would look
//    wrong.
control("a claimed domain weight that the questions do not support -> must FAIL", (t) =>
  t.replace(/\| 4\. Security operations \| \*\*28%\*\* \| 11 \|/, "| 4. Security operations | **28%** | 4 |"), true);

// 6. The declared question count drifting from reality.
control("front matter questions count drifting -> must FAIL", (t) =>
  t.replace(/^questions: 40$/m, "questions: 44"), true);

// 7. A gap in question numbering -- a question silently lost in an edit.
control("a gap in the question numbering -> must FAIL", (t) =>
  t.replace(/^### Q20\./m, "### Q21."), true);

// 8. A question outside any domain section, so it is counted in no weight.
control("a question outside a domain section -> must FAIL", (t) =>
  t.replace(/^## Domain 1 — General security concepts \(12%\)$/m, "## Concepts"), true);

// 9. Front matter losing the blueprint date, so a stale paper cannot be identified.
control("front matter missing the blueprint date -> must FAIL", (t) =>
  t.replace(/^blueprint_checked: .*$/m, ""), true);

// 10. NEGATIVE. The four-option format is a convention, not a rule -- a three-option question
//     is legitimate and must not be flagged, or the guard would fight real authoring.
//     NOTE ON THE FIXTURE: the first draft removed TWO options, leaving only two, and the
//     guard correctly failed it -- a two-option question is a coin flip and the guard's
//     `>= 3` floor is right to reject it. The fixture was wrong, not the guard: this control
//     claims to test a THREE-option question, so it must leave exactly three.
control("a legitimate three-option question -> must PASS", (t) =>
  t.replace(/(### Q1\.[\s\S]*?)- \[ \] Availability\n/, "$1"), false);

// 11. A curriculum path that does not exist. This is the control for a defect that shipped in
//     the first draft of all seven papers: 36 invented filenames in the "where each domain is
//     taught" tables, every one of them rendered as an ordinary backticked path.
control("a curriculum path that does not exist -> must FAIL", (t) =>
  t.replace(/`cybersec-roadmap\/01-phase-foundations\.md`/, "`cybersec-roadmap/04-phase-soc-operations.md`"), true);

// 12. A link to another paper that does not exist. This one is tested against the README,
//     because it is the file that links between papers -- the papers themselves carry no
//     markdown links at all, which is why the control cannot run against security-plus.md.
controlIn(path.join(ROOT, "career-roadmaps", "exams", "README.md"),
  "a link to a paper that does not exist -> must FAIL", (t) =>
    t.replace(/\]\(a-plus-core-1\.md\)/, "](a-plus-core-3.md)"), true);

// 13. NEGATIVE. An absolute URL is not a path in this repository and must not be resolved
//     against the filesystem, or every paper would fail on its own citation.
//     NOTE ON THE FIXTURE: the first attempt replaced the URL in `security-plus.md`'s front
//     matter, where it is a plain `source:` string and not a markdown link at all -- so the
//     regex never saw it, the guard correctly still passed, and the control failed. The
//     fixture was testing a line the code does not read. This version inserts a real markdown
//     link, which is the shape the link check actually examines.
control("an external URL is not treated as a local path -> must PASS", (t) =>
  t.replace(/^# CompTIA Security\+ — practice questions$/m,
    "# CompTIA Security+ — practice questions\n\nSource: [CompTIA](https://example.invalid/not-a-local-path)."), false);

const restored = [...SNAPSHOT.entries()].every(([f, before]) => fs.readFileSync(f, "utf8") === before);
console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
console.log(`  every touched file restored byte-identical: ${restored}`);
for (const f of SNAPSHOT.keys()) {
  console.log(`    ${path.relative(ROOT, f).replace(/\\/g, "/")}`);
}
const bad = results.filter((r) => !r.ok);
if (bad.length) {
  console.log("");
  for (const b of bad) console.log(b.out.split("\n").slice(-12).join("\n"));
}
const ok = bad.length === 0 && restored;
console.log(ok ? "ALL CONTROLS PASS" : `${bad.length} CONTROL(S) FAILED`);
process.exit(ok ? 0 : 1);
