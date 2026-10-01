// Controls for audit-content.mjs.
//
// WHY THIS FILE EXISTS
// audit-content.mjs is the oldest guard in the repository, it gates the CI
// `content` job, and it has 20 defect classes. It had NO controls at all.
//
// That is not a neutral absence, because this guard has already carried the
// repository's single worst bug. DUPLICATE_PART and PART_GAP matched
// `h.text` against /^### Part \d+/, but `headings[].text` has its `#` prefix
// stripped at collection time — so both rules filtered an EMPTY ARRAY and
// could never fire. They shipped that way on the day the file was written,
// stayed green through the whole history of the guard, and were only found by
// planting a real duplicate heading and watching it exit 0.
//
// The lesson the repository recorded from it is that a rule which prints
// nothing reads as green. So the question this file answers is not "does the
// guard find things" — that has been asked by reading. It is: **for each of
// the 20 classes, can this guard be made to fail on a real instance of it?**
//
// TWO RULES, both learned here the hard way:
//
//   1. Every control asserts WHICH CLASS fired, never merely that the exit
//      code was non-zero. Many of these defects trip more than one rule at
//      once (removing `## Tools for This Phase` also empties the lesson), so a
//      non-zero exit can come from the wrong rule. An exit code is not
//      evidence that the branch under test is the branch that ran.
//
//   2. The fixtures are built in a scratch tree rather than by mutating real
//      files. The sibling suites mutate the repository and restore it in a
//      `finally`; that approach is fine for a one-file target and wrong for
//      this one, because the guard only runs clean over ALL 31 phases. A
//      single planted defect in a real file would be accompanied by 30 other
//      files' worth of context, and a failure would be hard to attribute. Here
//      each control is a complete, minimal, self-contained corpus.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-content.mjs");

// --- the fixture corpus -----------------------------------------------------
//
// A minimal phase file that satisfies every one of the guard's 20 rules. The
// first control asserts it passes clean, so if it does not, the fault is here
// and not in the guard — a control suite whose own baseline is wrong teaches
// you to edit the guard.
//
// Section order follows REQUIRED, and "## Specific topics to learn" is
// inserted from TOPIC_SECTION_ANY. Every heading is followed by a non-blank,
// non-heading line, because a heading immediately followed by a heading is
// EMPTY_SECTION.
const LESSON_WORDS = 3200; // gate is 3000; margin so a control cannot drift under it

function phase({
  parts = 2,
  lessonWords = LESSON_WORDS,
  // Section headings are built as a list so a control can drop or reorder one
  // by name, rather than by regex surgery on the finished string.
} = {}) {
  const L = [];
  L.push("# Phase 1 — Probe phase");
  L.push("");
  L.push("## Goal of this phase");
  L.push("Learn the thing this probe phase teaches.");
  L.push("");
  L.push("## Estimated time");
  L.push("10 hours.");
  L.push("");
  L.push("## Specific topics to learn");
  L.push("- A topic that the phase covers.");
  L.push("");
  L.push("## Skills you'll gain");
  L.push("- A skill worth having.");
  L.push("");
  L.push("## Lesson");
  L.push("");
  L.push(Array.from({ length: lessonWords }, () => "word").join(" "));
  L.push("");
  for (let i = 1; i <= parts; i++) {
    L.push(`### Part ${i} — Section ${i}`);
    L.push(`Body text for part ${i}.`);
    L.push("");
  }
  L.push("### Key takeaways");
  L.push("- One takeaway.");
  L.push("");
  L.push("### Practice this next");
  L.push("- One practice item.");
  L.push("");
  L.push("## Tools for This Phase");
  L.push("A free tool.");
  L.push("");
  L.push("## Free/cheap resources");
  L.push("A free resource.");
  L.push("");
  L.push("## Hands-on practice tasks");
  L.push("A practice task.");
  L.push("");
  L.push("## Deliverable / proof of work");
  L.push("A deliverable.");
  L.push("");
  L.push("## Checklist");
  L.push("- [ ] A checklist item. <!-- id: probe-01-c01 energy: low -->");
  L.push("");
  L.push("## You're ready to move on when");
  L.push("When the checklist is done.");
  L.push("");
  L.push("## Free vs Paid");
  L.push("Everything here is free.");
  L.push("");
  return L.join("\n");
}

// --- the runner -------------------------------------------------------------

/**
 * Build a scratch repository containing only the guard and the given
 * career-roadmaps tree, then run the guard there.
 *
 * `files` is { "it-roadmap": { "01-phase-a.md": "<text>" }, ... }. A value may
 * be a Buffer, for the BOM control.
 */
function runOn(files) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-content-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    for (const [track, docs] of Object.entries(files)) {
      const dir = join(scratch, "career-roadmaps", track);
      mkdirSync(dir, { recursive: true });
      for (const [name, content] of Object.entries(docs)) {
        writeFileSync(join(dir, name), content, typeof content === "string" ? "utf8" : undefined);
      }
    }
    let out = "";
    let code = 0;
    try {
      out = execFileSync(process.execPath, [GUARD_REL], {
        cwd: scratch,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e) {
      code = e.status === undefined ? 1 : e.status;
      out = (e.stdout || "") + (e.stderr || "");
    }
    return { code, out, scratch };
  } catch (e) {
    rmSync(scratch, { recursive: true, force: true });
    throw e;
  }
}

const results = [];
function record(name, passed, detail) {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

/**
 * Assert a control's outcome. `expectClass` is the class that MUST appear in
 * the report; when given, the control also fails if the guard exited 0.
 */
function expectClass(name, files, expectClass) {
  let r;
  try {
    r = runOn(files);
  } finally {
    // Scoped to the scratch dir, so there is no repository state to restore.
  }
  const fired = expectClass ? new RegExp(`^\\s+ISSUE\\s+${expectClass}\\b`, "m").test(r.out) : false;
  const detail = [
    `exit ${r.code}; ${expectClass} fired=${fired}`,
    ...r.out
      .split("\n")
      .filter((l) => /^\s+(ISSUE|AUDIT SCRIPT ERROR)|^\s+\S+\.(md)?:|expected Part/.test(l))
      .slice(0, 6)
      .map((l) => `  | ${l.trim()}`),
  ];
  const passed = expectClass ? r.code !== 0 && fired : r.code === 0;
  record(name, passed, detail);
  return r;
}

/** The same, for a control that must PASS (negative control). */
function expectClean(name, files) {
  const r = runOn(files);
  const total = /TOTAL ISSUES: (\d+)/.exec(r.out);
  const n = total ? total[1] : "(not reported)";
  record(name, r.code === 0 && n === "0", [`exit ${r.code}; TOTAL ISSUES: ${n}`]);
  return r;
}

const one = (t) => ({ "it-roadmap": { "01-phase-probe.md": t } });
const probe = phase();

// =============================================================================
// Control 0 — THE BASELINE. The fixture must be clean.
// =============================================================================
// This is the control most likely to be skipped and the one that matters most.
// If the synthetic phase is not actually valid, every failure below is
// ambiguous: the guard could be broken, or the fixture could be wrong, and
// the previous passes in this repository have six times found the fixture
// at fault. Assert TOTAL ISSUES: 0, not just exit 0, so a guard that found
// something and did not gate would still fail this control.
expectClean("control 0: the synthetic phase is clean (fix the fixture, not the guard, if this fails)", one(probe));

// =============================================================================
// The `^0[1-9]-` regression pair.
// =============================================================================
// This is the second-worst bug the repository has had: five guards matched
// phase files with `^0[1-9]-`, which covers 01–09 only, so every phase 10 and
// above was invisible. The failure mode was silence — a clean report over four
// fifths of the content. Two controls, because counting files is not checking
// them: the first proves the denominator, the second proves a defect in a
// two-digit phase is actually caught rather than merely counted.
{
  const r = runOn({
    "it-roadmap": {
      "01-phase-alpha.md": probe,
      "10-phase-beta.md": phase({ parts: 3 }),
      "00-overview.md": "# Overview\n\nA strategy document, not a phase.\n",
    },
  });
  const count = /AUDIT: (\d+) phase files scanned/.exec(r.out);
  // 00-overview is a strategy document and must be excluded; 10- must be included.
  record("phase 10+ is counted, and 00-overview is excluded", r.code === 0 && count && count[1] === "2", [
    `exit ${r.code}; scanned=${count ? count[1] : "(not reported)"} (want 2)`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // A real defect planted in the two-digit phase only. If this passes, phase
  // 10+ is counted but not examined — the original bug wearing a new hat.
  const broken = phase({ parts: 2 }).replace("## Checklist", "## Cheklist");
  expectClass("a defect in phase 10 is caught, not merely counted", { "it-roadmap": { "10-phase-beta.md": broken } }, "MISSING_SECTION");
}

// =============================================================================
// The 20 classes, one control each.
// =============================================================================

// --- encoding (3) ---

{
  // BOM: the guard reads the file twice, once as utf8 and once as a Buffer,
  // and the Buffer read is the only one that can see the BOM.
  const withBom = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(probe, "utf8")]);
  expectClass("BOM: a file starting with U+FEFF", { "it-roadmap": { "01-phase-probe.md": withBom } }, "BOM");
}

{
  // CRLF. Deliberately built by replacing \n with \r\n on the whole file,
  // because that is what a Windows-native editor actually does — a single
  // stray \r would be a different and much narrower defect.
  const r = runOn({ "it-roadmap": { "01-phase-probe.md": probe.replace(/\n/g, "\r\n") } });
  const fired = /^\s+ISSUE\s+CRLF\b/m.test(r.out);
  record("CRLF: a file written with Windows line endings", r.code !== 0 && fired, [
    `exit ${r.code}; CRLF fired=${fired}`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

{
  // The U+FFFD is built with String.fromCharCode rather than written as a literal
  // in this file. Two guards scan scripts/ (audit-encoding.mjs rule 3 and
  // lint-content.mjs) and both flag a literal U+FFFD as a lost byte -- correctly,
  // since in a source file it almost always is one. An exemption was added to
  // audit-encoding.mjs for this file, but that left a second guard disagreeing
  // with the first, and the honest fix is to not store the corruption in the
  // repository at all. The fixture is built at runtime, so only the scratch file
  // ever contains the character.
  const FFFD = String.fromCharCode(0xfffd);
  const r = runOn({
    "it-roadmap": {
      "01-phase-probe.md": probe.replace("A free tool.", `A free ${FFFD} tool.`),
    },
  });
  const fired = /^\s+ISSUE\s+REPLACEMENT_CHAR\b/m.test(r.out);
  record("REPLACEMENT_CHAR: a U+FFFD in the text", r.code !== 0 && fired, [
    `exit ${r.code}; REPLACEMENT_CHAR fired=${fired}`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// --- structure: required sections (3) ---

{
  expectClass(
    "MISSING_SECTION: `## Checklist` removed",
    one(probe.replace(/## Checklist\n- \[ \][^\n]*\n/, "")),
    "MISSING_SECTION",
  );
}

{
  expectClass(
    "MISSING_TOPIC_SECTION: the topic/structure block removed entirely",
    one(probe.replace(/## Specific topics to learn\n[^\n]*\n/, "")),
    "MISSING_TOPIC_SECTION",
  );
}

{
  // SECTION_ORDER. Deliverable is moved to the very top of the file, ahead of
  // Goal of this phase, so its index goes backwards against the last one seen.
  const lines = probe.split("\n");
  const block = lines.splice(
    lines.findIndex((l) => l.startsWith("## Deliverable")),
    2,
  );
  lines.splice(1, 0, ...block);
  expectClass("SECTION_ORDER: Deliverable moved above Goal", one(lines.join("\n")), "SECTION_ORDER");
}

// --- structure: the lesson (3) ---

{
  // The heading must not merely be absent but not start with "Lesson" — the
  // guard uses startsWith, so "## Lesson: a reading" would satisfy it.
  expectClass("NO_LESSON: the Lesson section renamed to something else", one(probe.replace("## Lesson\n", "## The reading\n")), "NO_LESSON");
}

{
  // A short lesson. Built by rebuilding with fewer words rather than by
  // deleting lines, so the section structure stays valid and LESSON_TOO_SHORT
  // is the only class available to fire.
  expectClass("LESSON_TOO_SHORT: a lesson under 3000 words", one(phase({ lessonWords: 1200 })), "LESSON_TOO_SHORT");
}

{
  // LESSON_UNTERMINATED. Note this ALSO empties the lesson body, so
  // LESSON_TOO_SHORT fires too — which is exactly why this control asserts
  // the class by name instead of the exit code.
  const noTools = probe.replace(/## Tools for This Phase\n[^\n]*\n/, "");
  expectClass("LESSON_UNTERMINATED: no Tools section after the lesson", one(noTools), "LESSON_UNTERMINATED");
}

// --- structure: the closing pair (3) ---

{
  expectClass("NO_KEY_TAKEAWAYS: the closing takeaways heading removed", one(probe.replace(/### Key takeaways\n/, "### Summary\n")), "NO_KEY_TAKEAWAYS");
}

{
  expectClass("NO_PRACTICE: the closing practice heading removed", one(probe.replace(/### Practice this next\n/, "### Next steps\n")), "NO_PRACTICE");
}

{
  // CLOSING_ORDER: the two closing blocks swapped. Each is two lines plus a
  // blank, so the swap is done on line ranges to keep both intact.
  const lines = probe.split("\n");
  const ki = lines.findIndex((l) => l === "### Key takeaways");
  const pi = lines.findIndex((l) => l === "### Practice this next");
  const key = lines.splice(ki, 2);
  lines.splice(pi, 0, ...key);
  expectClass("CLOSING_ORDER: Practice before Key takeaways", one(lines.join("\n")), "CLOSING_ORDER");
}

{
  // STRANDED_AFTER_CLOSING — the Phase 6/7/8 defect: lesson content left after
  // the closing pair, where it reads as an appendix rather than as the lesson.
  const stranded = probe.replace(
    "### Practice this next\n- One practice item.\n",
    "### Practice this next\n- One practice item.\n\n### Appendix that should not be here\nOrphaned lesson prose.\n",
  );
  expectClass("STRANDED_AFTER_CLOSING: an h3 after the closing pair", one(stranded), "STRANDED_AFTER_CLOSING");
}

// --- markdown mechanics (4) ---

{
  // GLUED_HEADING: a heading opening directly after a text line. The guard
  // exempts a preceding HEADING, so a text line is required here.
  const glued = probe.replace("## Free vs Paid\nEverything here is free.", "## Free vs Paid\nEverything here is free.\n## A heading glued onto prose");
  expectClass("GLUED_HEADING: a heading immediately after a text line", one(glued), "GLUED_HEADING");
}

{
  // GLUED_FENCE: an UNINDENTED fence with no preceding blank line. An indented
  // fence inside a list item is valid Markdown and must NOT be flagged, so
  // the negative form of this rule is asserted too — a guard that flags valid
  // usage gets switched off.
  const glued = probe.replace("A free tool.", "A free tool.\n```\nsome code\n```");
  expectClass("GLUED_FENCE: a column-0 fence with no blank line before it", one(glued), "GLUED_FENCE");
}
{
  const indented = probe.replace("A free tool.", "A free tool.\n  ```\n  some code\n  ```");
  expectClean("GLUED_FENCE negative: an INDENTED fence in a list is valid Markdown", one(indented));
}

{
  // UNBALANCED_FENCE: one extra opening fence makes the count odd.
  const odd = probe + "\n```\n";
  expectClass("UNBALANCED_FENCE: an odd number of fence lines", one(odd), "UNBALANCED_FENCE");
}

// --- part numbering (2) — the two that were dead code for the guard's life ---

{
  // DUPLICATE_PART. This is the exact defect the original dead rule could not
  // see, and the comment in the guard records that planting it exited 0. If
  // this control ever passes, the fix has been reverted.
  const dup = probe.replace("### Part 2 — Section 2", "### Part 1 — Section 2");
  expectClass("DUPLICATE_PART: two headings numbered Part 1", one(dup), "DUPLICATE_PART");
}

{
  // PART_GAP: parts 1 and 3, no 2. The other dead rule.
  const gap = probe.replace("### Part 2 — Section 2", "### Part 3 — Section 3");
  expectClass("PART_GAP: part numbering skips 2", one(gap), "PART_GAP");
}

// --- final two classes (2) ---

{
  expectClass("EMPTY_SECTION: a heading followed immediately by a heading", one(probe.replace("## Free vs Paid\n", "## Notes\n## Free vs Paid\n")), "EMPTY_SECTION");
}

{
  expectClass("PLACEHOLDER: a TODO marker left in the text", one(probe.replace("A free tool.", "A free tool.\n\nTODO: replace this tool.")), "PLACEHOLDER");
}

// =============================================================================
// Control 20 — a NEGATIVE for the placeholder rule.
// =============================================================================
// The guard's own comment says "PLACEHOLDER" is a risky word because
// legitimate prose uses it. This asserts the word alone is not a finding, so
// the rule cannot be "fixed" into flagging every occurrence.
expectClean("PLACEHOLDER negative: the word 'placeholder' in ordinary prose is not a finding", one(probe.replace("A free tool.", "Use a placeholder value in the config.")));

// =============================================================================
// Control 21 — the report must not silently drop a class.
// =============================================================================
// The guard exits 2 when a check records a class that `order` does not list,
// because that class would otherwise be counted as zero and the exit code
// would say "clean" over a non-empty report. That branch is asserted here in
// the only way it can be reached without editing the guard: a corpus that
// trips nothing must still print every class as OK, so the report is complete
// on the passing path too.
{
  const r = runOn(one(probe));
  const reported = (r.out.match(/^\s+OK\s+([A-Z_]+)/gm) || []).length;
  record("a clean run still enumerates all 20 classes as OK", r.code === 0 && reported === 20, [
    `exit ${r.code}; ${reported} classes reported OK (want 20)`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================

const failed = results.filter((r) => !r.passed);
console.log("");
if (failed.length === 0) {
  console.log(`All ${results.length} controls passed: every one of audit-content.mjs's 20 classes can be made to fail,`);
  console.log("on a real instance, and three of them on legitimate content as well.");
} else {
  console.log(`${failed.length} of ${results.length} controls FAILED. The classes above are not proven, and a class`);
  console.log("that cannot fail is worse than no class, because it reads as coverage.");
}
process.exit(failed.length === 0 ? 0 : 1);
