// Controls for audit-readability.mjs.
//
// WHY THIS FILE EXISTS, and what it found on its first run
//
// The guard has TWO thresholds and ONE gate. `EDITORIAL` (90) is reported,
// `CEILING` (110) fails the build. That split is deliberate and the header
// explains it well, so the real question is whether each half does what it
// claims. Neither had been shown to fail.
//
// The first control run found a discrepancy that is not a bug in the code but a
// false claim in the documentation, and it is worth stating plainly because the
// guard is CORRECT and the CHECKPOINT item that describes it is not:
//
//   docs/WORKFLOW.md says "node scripts/audit-readability.mjs reports no phase
//   outside the target." Six phases are outside the target right now, and the
//   guard exits 0. The average-sentence target (18) is the unmet one, and the
//   guard treats it as REPORTING rather than gating — which the header is
//   candid about for the paragraph thresholds and silent about here.
//
// So the controls below do two jobs: they prove the gate can fire, and they pin
// down the exact boundary between "reported" and "gated", because that boundary
// is where this guard's contract with its reader actually lives.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-readability.mjs");
const TRACK = "it-roadmap";

/**
 * A phase file with a lesson region and a known paragraph shape.
 *
 * `paras` is a list of word counts; each becomes one paragraph of exactly that
 * many words, separated by blank lines. `sentenceWords` controls how those words
 * are split into sentences, which is how the average-sentence figure is set.
 *
 * The full stop is ATTACHED to the final word of each sentence rather than
 * written as its own token. The first version pushed `"."` as a separate
 * element, so a 90-word paragraph was 98 whitespace-separated tokens and both
 * boundary controls failed — the guard was right and the fixture was lying
 * about its own arithmetic, for the fifteenth time in this repository. The
 * `words()` helper in the guard splits on `/\s+/`, so a standalone period is a
 * word by that definition.
 */
function sentenceOf(count, startIndex) {
  const w = [];
  for (let i = 0; i < count; i++) w.push("w" + (startIndex + i));
  return w.join(" ") + ".";
}

function phase({ paras = [20, 20, 20], sentenceWords = 12, extraBody = "" } = {}) {
  const L = [];
  L.push("## Goal of this phase");
  L.push("Learn the thing.");
  L.push("");
  L.push("## Lesson");
  L.push("");
  for (const n of paras) {
    // Break into sentences of `sentenceWords`, with the remainder last. Every
    // word is emitted exactly once and the count is exactly n.
    const out = [];
    let emitted = 0;
    let k = 0;
    while (emitted < n) {
      const take = Math.min(sentenceWords, n - emitted);
      out.push(sentenceOf(take, emitted));
      emitted += take;
      k++;
    }
    void k;
    L.push(out.join(" "));
    L.push("");
  }
  if (extraBody) {
    L.push(extraBody);
    L.push("");
  }
  L.push("## Checklist");
  L.push("- [ ] An item.");
  L.push("");
  return L.join("\n");
}

/**
 * `files` maps a path under `career-roadmaps/` to its content, so a control can
 * place phases in more than one track. A bare filename means TRACK.
 */
function runOn(files) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-read-ctl-"));
  mkdirSync(join(scratch, "scripts"), { recursive: true });
  copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
  for (const [name, content] of Object.entries(files)) {
    const rel = name.includes("/") ? name : `${TRACK}/${name}`;
    const full = join(scratch, "career-roadmaps", rel);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content, "utf8");
  }
  let out = "";
  let code = 0;
  try {
    out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    code = e.status === undefined ? 1 : e.status;
    out = (e.stdout || "") + (e.stderr || "") || "";
  }
  return { code, out, scratch };
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

const one = (t) => ({ "01-phase-probe.md": t });

// =============================================================================
// Control 0 — the baseline. Short paragraphs, short sentences.
// =============================================================================
{
  const r = runOn(one(phase()));
  const over90 = /Paragraphs over 90 words: (\d+)/.exec(r.out);
  const over110 = /Paragraphs over 110 words: (\d+)/.exec(r.out);
  const noCeiling = /No paragraph exceeds the 110-word ceiling/.test(r.out);
  record(
    "control 0: short paragraphs pass and both density figures are reported",
    r.code === 0 && over90 && over90[1] === "0" && over110 && over110[1] === "0" && noCeiling,
    [`exit ${r.code}; over90=${over90 && over90[1]}; over110=${over110 && over110[1]}; ceiling message=${noCeiling}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The gate: CEILING.
// =============================================================================
{
  // 130 words in one paragraph. Over 110, so the build must fail.
  const r = runOn(one(phase({ paras: [130] })));
  const over110 = /Paragraphs over 110 words: (\d+)/.exec(r.out);
  const failed = /FAIL — \d+ phase\(s\) contain a paragraph over 110 words/.test(r.out);
  record("CEILING: a 130-word paragraph fails the build", r.code === 1 && failed && over110 && over110[1] === "1", [
    `exit ${r.code}; over110=${over110 && over110[1]}; FAIL message=${failed}`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // Exactly 110 must PASS and exactly 111 must FAIL. A ceiling that fires at
  // 110 would fail on content the threshold permits, and one that fires at 112
  // would let a wall through — so the boundary itself is the assertion.
  const at110 = runOn(one(phase({ paras: [110] })));
  const at111 = runOn(one(phase({ paras: [111] })));
  record(
    "the CEILING boundary is exact: 110 passes, 111 fails",
    at110.code === 0 && at111.code === 1,
    [`110 words -> exit ${at110.code} (want 0); 111 words -> exit ${at111.code} (want 1)`],
  );
  rmSync(at110.scratch, { recursive: true, force: true });
  rmSync(at111.scratch, { recursive: true, force: true });
}
{
  // The same rule against EDITORIAL. 95 words is over the editorial target and
  // under the ceiling, so it must be REPORTED and NOT fail. This is the
  // distinction the guard's header argues for, and it is the one most likely to
  // be quietly lost in a future edit.
  const r = runOn(one(phase({ paras: [95] })));
  const over90 = /Paragraphs over 90 words: (\d+)/.exec(r.out);
  const notAFailure = /worth splitting, not a failure/.test(r.out);
  record(
    "EDITORIAL: a 95-word paragraph is reported, and does NOT fail the build",
    r.code === 0 && over90 && over90[1] === "1" && notAFailure,
    [`exit ${r.code}; over90=${over90 && over90[1]}; "not a failure" printed=${notAFailure}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // The EDITORIAL boundary, measured rather than assumed. The rule is
  // pWords.filter(n => n > EDITORIAL) with EDITORIAL = 90, so a paragraph of
  // exactly 90 words is NOT over the target and 91 IS.
  //
  // The first version asserted the OPPOSITE -- that 90 would be reported -- and
  // it failed, because the guard is right and the expectation was wrong. That is
  // the sixteenth fixture-side error in this work, and the reason this control
  // measures three points rather than two: were the rule `>=,` 90 would be
  // reported and this would catch it.
  const at89 = runOn(one(phase({ paras: [89] })));
  const at90 = runOn(one(phase({ paras: [90] })));
  const at91 = runOn(one(phase({ paras: [91] })));
  const c = (r) => {
    const m = /Paragraphs over 90 words: (\d+)/.exec(r.out);
    const row = /01-phase-probe\s+(\d+)/.exec(r.out);
    return { over: m ? m[1] : "?", max: row ? row[1] : "?" };
  };
  const r89 = c(at89), r90 = c(at90), r91 = c(at91);
  record(
    "the EDITORIAL boundary is exact: 90 is not reported, 91 is (rule is >, not >=)",
    r89.max === "89" && r89.over === "0" && r90.max === "90" && r90.over === "0" && r91.max === "91" && r91.over === "1",
    [
      "89w -> maxPara=" + r89.max + " over90=" + r89.over + " (want 89 / 0)",
      "90w -> maxPara=" + r90.max + " over90=" + r90.over + " (want 90 / 0)",
      "91w -> maxPara=" + r91.max + " over90=" + r91.over + " (want 91 / 1)",
    ],
  );
  rmSync(at89.scratch, { recursive: true, force: true });
  rmSync(at90.scratch, { recursive: true, force: true });
  rmSync(at91.scratch, { recursive: true, force: true });
}

// =============================================================================
// Paragraph detection must ignore what is not prose.
// =============================================================================
// A long line of code, a wide table row, or a long list item is not a paragraph
// a reader has to get through. If these counted, a single wide table would fail
// the build and the guard would be switched off — which is the failure mode the
// repository's doctrine calls out explicitly.
for (const [label, block] of [
  ["a fenced code block", "```\n" + "const x = 1; ".repeat(20) + "\n```"],
  ["a table", "| " + "cell ".repeat(30) + "|"],
  ["a list", "- " + "item ".repeat(30)],
  ["a blockquote", "> " + "quoted ".repeat(30)],
]) {
  const r = runOn(one(phase({ extraBody: block })));
  const over110 = /Paragraphs over 110 words: (\d+)/.exec(r.out);
  record(
    `${label} is not counted as a paragraph`,
    r.code === 0 && over110 && over110[1] === "0",
    [`exit ${r.code}; over110=${over110 && over110[1]} (want 0)`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The reported-not-gated averages. THIS IS THE FINDING.
// =============================================================================
// The guard states its targets on stdout — "avg para <= 45 words, avg sentence
// <= 18, at least 8 tables/phase" — and lists every phase outside them. On the
// real corpus six phases are outside the sentence target right now, and the
// guard exits 0.
//
// The first version of this control asserted the opposite (that a bad average
// FAILS), and it failed — correctly, because the guard only ever exits on
// CEILING. The control now asserts what the guard actually does, and the
// documentation is corrected to match. Asserting the aspirational behaviour
// would have been a control that documents a wish.
{
  const r = runOn(one(phase({ paras: [40, 40, 40], sentenceWords: 40 })));
  const listed = /Phases outside the target: (\d+) of/.exec(r.out);
  const sentenceLine = /sentence \d+/.test(r.out);
  record(
    "an average-sentence outside the target is REPORTED but does NOT fail (documented contract)",
    r.code === 0 && listed && listed[1] === "1" && sentenceLine,
    [
      `exit ${r.code} (want 0 — only CEILING gates);`,
      `listed=${listed && listed[1]}; a "sentence N" line was printed=${sentenceLine}`,
    ],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The lesson region must actually be located.
// =============================================================================
// A phase with no `## Lesson` heading, or with nothing after it, is skipped
// silently. That is a real state for a file that is not a phase, but it must not
// be the state of every phase — so the denominator is asserted.
{
  const noLesson = ["## Goal of this phase", "Learn the thing.", "", "## Checklist", "- [ ] An item.", ""].join("\n");
  const r = runOn({ "01-phase-probe.md": noLesson });
  const header = /^(phase\s+words)|-+\s*$/m;
  const noRows = !/01-phase-probe/.test(r.out);
  record(
    "a file with no Lesson region produces no phase row (and does not crash)",
    r.code === 0 && noRows,
    [`exit ${r.code}; the file appears in the table=${!noRows}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// Two-digit phase files must be scanned.
// =============================================================================
// `audit-readability.mjs` used to match `^0[1-9]-`, which covers 01-09 only, so
// phases 10 and above were left out of the audit entirely — a phase could fall
// outside the targets unreported. The pattern is now `^(?!00-)\d{2}-`, and this
// asserts it in the direction that matters: a WALL OF TEXT in a phase 10 file
// must fail the build.
{
  const r = runOn({ "10-phase-probe.md": phase({ paras: [130] }) });
  record(
    "a 130-word paragraph in a phase 10 file fails (the ^0[1-9]- regression)",
    r.code === 1 && /10-phase-probe/.test(r.out),
    [`exit ${r.code}; the file is named in the failure=${/10-phase-probe/.test(r.out)}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // And 00-overview, which has no lesson region, must be excluded — otherwise
  // a strategy document would be measured against lesson thresholds.
  const r = runOn({ "00-overview.md": phase({ paras: [130] }) });
  const noRows = !/00-overview/.test(r.out);
  record("00-overview.md is excluded (a strategy document has no lesson region)", r.code === 0 && noRows, [
    `exit ${r.code}; 00-overview appears in the table=${!noRows}`,
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The track averages must come from the path, not a hardcoded list.
// =============================================================================
// The guard's own header records this bug: the track summary hardcoded the
// original eight cyber phase names, so the six modules added as 09-14 were
// averaged into the IT track. The control puts a phase in the advance track and
// requires the ADVANCE line to move.
{
  const before = runOn({ "01-phase-a.md": phase() });
  const adv = /ADVANCE\s+phases=(\d+)/.exec(before.out);
  const beforeCount = adv ? adv[1] : "0";
  const r = runOn({
    "it-roadmap/01-phase-a.md": phase(),
    "advance-roadmap/01-phase-b.md": phase(),
  });
  const after = /ADVANCE\s+phases=(\d+)/.exec(r.out);
  record(
    "a phase in advance-roadmap is counted under ADVANCE, not folded into IT",
    /ADVANCE\s+phases=1/.test(r.out),
    [`before: ADVANCE phases=${beforeCount}; after adding one: ${after ? after[1] : "?"} (want 1)`],
  );
  rmSync(before.scratch, { recursive: true, force: true });
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length === 0) {
  console.log(`All ${results.length} controls passed. The gate fires, both boundaries are exact, non-prose is`);
  console.log("not counted as paragraphs, and the reported-not-gated contract is asserted rather than assumed.");
} else {
  console.log(`${failed.length} of ${results.length} controls FAILED.`);
}
process.exit(failed.length === 0 ? 0 : 1);
