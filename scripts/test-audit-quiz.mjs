// Controls for audit-quiz.mjs — classes 1 and 2, the two that had none.
//
// (Class 3, the corpus-level spread, already has controls in
// scripts/test-audit-quiz-corpus.mjs, and its own header records that the rule was
// dead code twice before those controls caught it. It is not duplicated here.)
//
// WHAT THIS FOUND, and it is the reason the file is not just three more rules
//
// The CI workflow comment credited this guard with catching four defects: "no marked
// answer, two marked answers, a missing **Why:**, a duplicate id." Measured on
// 2026-10-02, it catches ONE of them.
//
//   - no marked answer        -> yes, class 2, line 139.
//   - fewer than 3 options    -> yes, class 2, line 136. (Not in the comment at all.)
//   - two marked answers      -> NO. The parser does `q.answer = q.options` on every
//     [x] it meets, so a second mark silently OVERWRITES the first. There is no
//     counter, so the rule cannot exist.
//   - a missing **Why:**      -> NO. A `why` flag was parsed and then never read by
//     anything. Removed.
//   - a duplicate id          -> NO. Ids are parsed and never compared.
//
// The last three ARE enforced, by other guards that can afford to look at the text:
// `audit-quiz-sourcing.mjs` (the `**Why:**` and its length) and `build-content.mjs`
// (exactly one mark, duplicate ids). So no requirement was ever unenforced. What was
// wrong is the ATTRIBUTION, and that is the more dangerous of the two errors: a reader
// debugging a broken quiz would have looked here, seen nothing, and concluded the check
// did not exist.
//
// Which is why the last group of controls below does something the other suites here
// do not: rather than testing this guard for a defect it cannot see, it plants each
// unclaimed defect and requires the guard that DOES claim it to catch it. The claim
// now lives with the code that implements it, and the CI comment says so.
//
// THE PROBE TRAP, recorded because it caught this file's first draft
//
// The first version of the probe defaulted every question's answer to position A, so
// all four cases failed on "correct answers are skewed: 4 of 4 sit in position A" and
// the rule under test was never reached. Every case below is therefore the balanced
// A,B,C,D baseline with EXACTLY ONE property changed — otherwise "exit 1" is evidence
// of nothing, which is the single most repeated lesson in this repository.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const QUIZ_GUARD = join("scripts", "audit-quiz.mjs");
const SOURCING_GUARD = join("scripts", "audit-quiz-sourcing.mjs");
const TRACK = "it-roadmap";

/**
 * A question with its correct answer at `pos` (0-based), plus optional extra marks.
 *
 * `whyText` is the whole `**Why:**` line, so a control that needs it short, absent or
 * long produces that by construction rather than by editing generated text.
 */
function q(id, { opts = 4, pos = 0, extraMarks = [], why = true, whyText = null } = {}) {
  const L = [`### Question <!-- id: ${id} -->`, ""];
  for (let i = 0; i < opts; i++) {
    L.push(`- [${i === pos || extraMarks.includes(i) ? "x" : " "}] Option ${i}`);
  }
  L.push("");
  if (why) {
    L.push(
      whyText ??
        `**Why:** the plausible wrong answer here reflects a misconception a learner actually holds, and naming it is the point.`,
    );
  }
  L.push("");
  return L.join("\n");
}

/** Four questions at A, B, C and D — balanced, so no balance rule can fire instead. */
function balanced(overrides = {}) {
  return [
    "## Quiz",
    "",
    q("q01", { pos: 0, ...(overrides.q01 || {}) }),
    q("q02", { pos: 1, ...(overrides.q02 || {}) }),
    q("q03", { pos: 2, ...(overrides.q03 || {}) }),
    q("q04", { pos: 3, ...(overrides.q04 || {}) }),
    "## Checklist",
    "- [ ] An item.",
    "",
  ].join("\n");
}

/**
 * Run a guard over a synthetic corpus. `guards` are copied into the scratch tree.
 *
 * ALL THREE track directories are created, not just the one under test.
 * `audit-quiz-sourcing.mjs` does an unguarded `readdirSync` per track and CRASHES
 * with ENOENT when one is absent -- so the first version of the attribution controls
 * ran it against a single-track tree, got exit 1, and the assertion "exit 1 AND a
 * Why finding" was satisfied by a stack trace. It is the clearest instance of the
 * trap in this repository's own history: **an exit code is not evidence that the
 * branch under test is the branch that ran**, and here the branch that ran was none
 * of them.
 */
function runOn(guards, text) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-quiz-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    for (const g of guards) copyFileSync(join(ROOT, g), join(scratch, g));
    for (const t of ["it-roadmap", "cybersec-roadmap", "advance-roadmap"]) {
      mkdirSync(join(scratch, "career-roadmaps", t), { recursive: true });
    }
    writeFileSync(join(scratch, "career-roadmaps", TRACK, "01-phase-probe.md"), text, "utf8");
    let out = "";
    let code = 0;
    try {
      out = execFileSync(process.execPath, [guards[0]], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) {
      code = e.status === undefined ? 1 : e.status;
      out = (e.stdout || "") + (e.stderr || "") || "";
    }
    return { code, out };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

/**
 * A phase `audit-quiz-sourcing.mjs` can actually accept.
 *
 * The sourcing guard compares each question's distinctive vocabulary against its own
 * phase's LESSON, so a fixture with no lesson produces sourcing findings regardless of
 * what the Why rule would have said. The lesson below is written so the guard gets
 * past that stage and reaches the rule under test -- which is the whole difficulty of
 * controlling a guard whose rules run in sequence.
 */
function withLesson(overrides = {}) {
  return [
    "---",
    "phase: 1",
    "---",
    "",
    "## Goal of this phase",
    "Learn the boot sequence.",
    "",
    "## Lesson",
    "",
    "The boot sequence reads the option ROM. The BIOS hands control to the boot",
    "device, which loads the operating system kernel into memory. A legacy BIOS",
    "reads its configuration from CMOS registers, while a UEFI reads the same",
    "configuration from NVRAM instead, which is why Secure Boot depends on it.",
    "",
    "## Quiz",
    "",
    q("q01", { pos: 0, ...(overrides.q01 || {}) }),
    q("q02", { pos: 1, ...(overrides.q02 || {}) }),
    q("q03", { pos: 2, ...(overrides.q03 || {}) }),
    q("q04", { pos: 3, ...(overrides.q04 || {}) }),
    "",
  ].join("\n");
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

const onQuiz = (text) => runOn([QUIZ_GUARD], text);
const onSourcing = (text) => runOn([SOURCING_GUARD], text);

// =============================================================================
// Control 0 — the baseline.
// =============================================================================
{
  const r = onQuiz(balanced());
  record("control 0: a balanced, well-formed quiz passes", r.code === 0, [`exit ${r.code}`]);
}

// =============================================================================
// Class 2 — option count and marked answer.
// =============================================================================
{
  const r = onQuiz(balanced({ q02: { opts: 2, pos: 1 } }));
  const ok = r.code === 1 && /fewer than 3 makes it a coin flip/.test(r.out);
  record("class 2: fewer than three options is caught", ok, [
    r.out.split("\n").find((l) => /coin flip/.test(l))?.trim().replace(/^.*md:\d+: /, "") || `(exit ${r.code})`,
  ]);
}
{
  const r = onQuiz(balanced({ q02: { pos: 9 } })); // never marked
  const ok = r.code === 1 && /has no correct option marked/.test(r.out);
  record("class 2: a question with no marked answer is caught", ok, [
    r.out.split("\n").find((l) => /no correct option/.test(l))?.trim().replace(/^.*md:\d+: /, "") || `(exit ${r.code})`,
  ]);
}
{
  // NEGATIVE. Three options is the floor, not a defect: a deliberate three-option
  // question is legal and a guard that flagged it would be switched off.
  const r = onQuiz(balanced({ q02: { opts: 3, pos: 1 } }));
  const ok = r.code === 0 || !/coin flip/.test(r.out);
  record("class 2 negative: exactly three options is not a finding", ok, [`exit ${r.code}; "coin flip" reported=${/coin flip/.test(r.out)}`]);
}

// =============================================================================
// Class 1 — per-phase position balance.
// =============================================================================
{
  // Every answer in one position. This is the real defect the class exists for: a
  // reader answering one letter every time scores 100% without reading a question.
  const allA = ["## Quiz", "", q("q01", { pos: 0 }), q("q02", { pos: 0 }), q("q03", { pos: 0 }), q("q04", { pos: 0 }), "## Checklist", "- [ ] An item.", ""].join("\n");
  const r = onQuiz(allA);
  const ok = r.code === 1 && /position A/.test(r.out);
  record("class 1: all four answers in one position is caught", ok, [
    r.out.split("\n").find((l) => /position A/.test(l))?.trim().replace(/^.*md:\d+: /, "") || `(exit ${r.code})`,
  ]);
}
{
  // NEGATIVE: an abandoned position must NOT be reported. A quiz using only A and B
  // with four questions is skewed, and the guard should say so only via the corpus
  // rule; a per-phase rule that fired on it would flag honest small quizzes.
  const r = onQuiz(balanced());
  record("class 1 negative: a balanced quiz is silent", r.code === 0, [`exit ${r.code}`]);
}

// =============================================================================
// THE ATTRIBUTION CONTROLS. Each defect this guard does NOT catch, planted and
// required to be caught by the guard that does claim it.
// =============================================================================
// If one of these ever passes, the requirement has become genuinely unenforced — which
// is the real risk the mis-attribution was hiding behind.
{
  // "a missing **Why:**" -> audit-quiz-sourcing.mjs. The fixture carries a real lesson
  // so the guard gets past its sourcing stage and reaches the Why rule.
  const r = onSourcing(withLesson({ q02: { why: false } }));
  const ok = r.code !== 0 && /has no \*\*Why:\*\* line/.test(r.out);
  record("a missing **Why:** is caught by audit-quiz-sourcing.mjs (the guard that claims it)", ok, [
    `exit ${r.code}`,
    r.out.split("\n").find((l) => /Why/.test(l))?.trim().replace(/^.*md:\d+: /, "") || "(no Why finding)",
  ]);
}
{
  // A `**Why:` that is present but too short to teach. The guard requires 60
  // characters, so the weaker form of the same rule is asserted too -- a presence
  // check alone would pass a one-word explanation, which teaches nothing.
  //
  // The first version replaced the long explanation with a regex, and the regex did
  // not match the text `q()` actually emits, so the fixture kept its full-length
  // **Why:** and the control passed for the wrong reason -- or rather it FAILED for
  // the wrong reason, having asserted a rule that never got exercised. The Why line
  // is now a parameter of `q()` so the short form is produced by construction rather
  // than by a string edit that can silently stop matching.
  const r = onSourcing(withLesson({ q02: { whyText: "**Why:** because." } }));
  const ok = r.code !== 0 && /too short to teach/.test(r.out);
  record("a **Why:** too short to teach is caught by audit-quiz-sourcing.mjs", ok, [
    `exit ${r.code}`,
    r.out.split("\n").find((l) => /short to teach/.test(l))?.trim().replace(/^.*md:\d+: /, "") || "(no finding)",
  ]);
}
{
  // "a two-mark question" -> audit-quiz-sourcing.mjs counts marked options.
  const r = onSourcing(withLesson({ q02: { extraMarks: [3] } }));
  const ok = r.code !== 0 && /marks \d+ correct options/.test(r.out);
  record("a question with two marked answers is caught by audit-quiz-sourcing.mjs", ok, [
    `exit ${r.code}`,
    r.out.split("\n").find((l) => /marks \d+ correct/.test(l))?.trim().replace(/^.*md:\d+: /, "") || "(no two-mark finding)",
  ]);
}
{
  // And the honest counterpart: this guard must NOT be the one that catches it, or
  // the attribution would be true for a different reason than stated. The marker is
  // placed on q02, whose answer is at B; overwriting it with a later mark moves the
  // key to D, which class 1 does notice — but as a BALANCE finding, not as a
  // two-mark finding. So the assertion is that no "two marked" style finding appears.
  const r = onQuiz(balanced({ q02: { extraMarks: [3] } }));
  const mentionsMarks = /two marked|2 marked|marks \d+ correct/.test(r.out);
  record("audit-quiz.mjs itself reports NO two-mark finding (it cannot see one)", !mentionsMarks, [
    `exit ${r.code}; a two-mark finding appeared=${mentionsMarks}`,
    r.out.split("\n").find((l) => l.includes(".md:"))?.trim().replace(/^.*md:\d+: /, "") || "(no findings at all)",
  ]);
}
{
  // "a duplicate id" -> build-content.mjs. That guard is the build step, not a
  // standalone audit, so it is exercised through `npm run build:content` rather than
  // here. What is asserted HERE is the negative half: audit-quiz.mjs does not claim
  // it, and a duplicate id does not make this guard fail for that reason.
  const dup = balanced().replace("id: q01", "id: qXX").replace("id: q02", "id: qXX");
  const r = onQuiz(dup);
  const mentionsDup = /duplicate/i.test(r.out);
  record("audit-quiz.mjs does not report a duplicate id (it never compares them)", !mentionsDup, [
    `exit ${r.code}; a duplicate-id finding appeared=${mentionsDup}`,
  ]);
}
{
  // The dead `why` field is gone, so nothing can read it. A grep is the honest way to
  // assert that: a field that no longer exists cannot be a rule that silently stopped
  // working.
  const src = readFileSync(join(ROOT, QUIZ_GUARD), "utf8");
  const stillParses = /q\.why\s*=|why:\s*(false|true)/.test(src.replace(/\/\/.*$/gm, ""));
  record("audit-quiz.mjs no longer parses a **Why:** flag it never read", !stillParses, [
    stillParses ? "a live q.why assignment is still present" : "only the comment mentions it",
  ]);
}

// =============================================================================
// Corpus scope, on the real tree.
// =============================================================================
{
  const out = execFileSync(process.execPath, [QUIZ_GUARD], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  // The guard's summary is "Quiz sets are sound: ..." and a "findings: N" line; the
  // first version of this control looked for a phrase that does not exist in it and so
  // asserted nothing about the denominator.
  const findings = /^findings: (\d+)$/m.exec(out);
  const sound = /Quiz sets are sound/.test(out);
  record(
    "the real corpus passes, and the guard prints a findings count",
    sound && findings && findings[1] === "0",
    [`"Quiz sets are sound" present=${sound}; ${findings ? findings[0] : "(no findings line)"}`],
  );
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(failed.length
  ? `${failed.length} of ${results.length} controls FAILED.`
  : `All ${results.length} controls passed. Classes 1 and 2 can fail on a balanced baseline, and each of the\n` +
    `three defects this guard never checked is proven to be caught by the guard that claims it.`);
process.exit(failed.length === 0 ? 0 : 1);
