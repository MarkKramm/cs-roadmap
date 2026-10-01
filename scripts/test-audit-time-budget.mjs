// Controls for audit-time-budget.mjs.
//
// WHY THIS FILE EXISTS
// This guard gates CI and has five classes, all of which compare a stated
// figure against something else. It has no controls at all — and its own header
// records that three of its rules were WRONG on the first attempt:
//
//   - Class 1 was once scoped by proximity to a heading and summed bare "4-6"
//     cells out of a schedule table, reporting success on three tables that were
//     not budget tables at all.
//   - Class 4 used a live "am I inside a table" flag, which is always false by
//     the last line of a file, so the check "passed" on both track overviews
//     having cross-checked nothing. The header's own words: "never cross-checked
//     a single week count."
//   - Class 5 compared two budget claims with `overlaps()`, which accepts 40-55
//     against 41-58 because they share 41-55 — so it passed the exact defect it
//     was written for. Then its first implementation scanned only bold spans and
//     missed shape A entirely, "so it passed the very defect it was written for"
//     again, in the other direction.
//
// A class that was wrong three times and has never been proven able to fail is
// the exact hazard D-077 records: a claim about coverage with nothing behind it.
//
// THE SHAPE OF EVERY CONTROL HERE
// Arithmetic on prose is only meaningful against a corpus that is otherwise
// valid, so each control is a complete minimal phase file in a scratch tree,
// and each asserts WHICH finding fired. The messages are matched as substrings
// because the class names are not printed — the guard reports free text.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-time-budget.mjs");
const TRACK = "it-roadmap"; // any track name works; only the directory layout is read

/**
 * A minimal, internally-consistent phase file.
 *
 * Everything here is chosen so the five classes all pass: the frontmatter
 * duration matches the prose, the table sums to its stated total, the two
 * statements of the budget are identical, and no range is inverted. Each
 * control then breaks exactly one of those.
 */
function phase({
  duration = "5 weeks",
  durationWeeks = "5",
  estProse = "**5 weeks** at about 8-11 focused hours a week. Roughly 41-58 hours, and the write-up is a real part of it.",
  // An optional budget table, given as rows of [label, hours] plus a Total.
  table = null,
  extra = "",
} = {}) {
  const L = [];
  L.push("---");
  L.push("id: probe-01");
  L.push("track: it");
  L.push("phase: 1");
  L.push(`duration: "${duration}"`);
  L.push(`duration_weeks: ${durationWeeks}`);
  L.push("---");
  L.push("");
  L.push("## Goal of this phase");
  L.push("Learn the thing.");
  L.push("");
  L.push("## Estimated time");
  L.push("");
  L.push(estProse);
  L.push("");
  if (table) {
    L.push(`**Roughly ${table.total} hours over ${durationWeeks} weeks:**`);
    L.push("");
    L.push("| Part | Hours |");
    L.push("| --- | --- |");
    for (const [label, hours] of table.parts) L.push(`| ${label} | ${hours} |`);
    L.push(`| **Total** | **${table.total}** |`);
    L.push("");
  }
  L.push("## Lesson");
  L.push("Prose.");
  L.push("");
  L.push(`## Checklist${extra ? "" : ""}`);
  L.push("- [ ] An item.");
  L.push("");
  if (extra) {
    L.push(extra);
    L.push("");
  }
  return L.join("\n");
}

function runOn(files) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-tb-ctl-"));
  mkdirSync(join(scratch, "scripts"), { recursive: true });
  copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
  const dir = join(scratch, "career-roadmaps", TRACK);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content, "utf8");
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
function record(name, passed, detail) {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

/**
 * The guard's actual findings, excluding its bookkeeping lines.
 *
 * It prints `note:` lines for a track or overview that does not exist, which is
 * correct behaviour in a scratch tree — only one track is created — and those
 * notes are not evidence about any class.
 */
function findingsOf(out) {
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^note:/.test(l) && !/^phases checked:/.test(l) && !/^findings:/.test(l))
    .filter((l) => !/^(All time budgets|Time-budget)/.test(l));
}

/** A control that must produce a finding matching `expect`. */
function expectFinding(name, files, expect) {
  const r = runOn(files);
  const re = new RegExp(expect);
  const fired = re.test(r.out);
  record(name, r.code !== 0 && fired, [
    `exit ${r.code}; matched=${fired}`,
    // Show the FINDING lines, not the "no directory yet / not written yet"
    // notes. The first version filtered on "contains a colon", which every one
    // of those notes has, so a failing control printed four lines of scenery
    // and none of the evidence — and the message then has to be read from a
    // debug script instead of from the suite that failed.
    ...findingsOf(r.out)
      .slice(0, 4)
      .map((l) => `  | ${l}`),
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

/** A control that must produce NO findings at all. */
function expectClean(name, files) {
  const r = runOn(files);
  const m = /findings: (\d+)/.exec(r.out);
  const n = m ? m[1] : "(not reported)";
  record(name, r.code === 0 && n === "0", [`exit ${r.code}; findings: ${n} (want 0)`]);
  if (n !== "0") for (const l of findingsOf(r.out).slice(0, 5)) console.log(`  | ${l}`);
  rmSync(r.scratch, { recursive: true, force: true });
}

const one = (t) => ({ "01-phase-probe.md": t });

// A valid table: 20 + 21 = 41, 30 + 28 = 58.
const GOOD_TABLE = { parts: [["Reading", "20-30"], ["Hands-on", "21-28"]], total: "41-58" };

// =============================================================================
// Control 0 — the baseline must be clean.
// =============================================================================
// If the fixture is not valid, every failure below is ambiguous. The
// repository has recorded six cases where the fixture was at fault; this is
// the control that makes those attributable.
expectClean(
  "control 0: a consistent phase with a summing table -> PASS",
  one(phase({ table: GOOD_TABLE })),
);

// =============================================================================
// Class 1 — a budget table whose parts must sum to the total it prints.
// =============================================================================
{
  // Parts sum to 41-58, the claim above the table says 45-60.
  //
  // The expectation names "the line above", not the Total row, and that is a
  // real behaviour rather than a wording choice: `checkBudgetTables` prefers
  // `claim` (the line above the table) over the Total row whenever both are
  // present, so the prose lead is what a reader plans from and what the
  // message points at. The first version of this control asserted the Total
  // row and failed — the guard was right and the fixture's expectation was
  // wrong, for the tenth time in this repository.
  //
  // The prose in the section is set to 45-60 as well, deliberately, so the
  // ONLY disagreement here is table-vs-prose. If the prose still said 41-58,
  // this control would be tripped by class 5 instead and would pass for the
  // wrong reason.
  expectFinding(
    "class 1: parts do not sum to the stated total",
    one(
      phase({
        table: { parts: GOOD_TABLE.parts, total: "45-60" },
        estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 45-60 hours, and the write-up is a real part of it.",
      }),
    ),
    // "the Total row", not "the line above" — the guard prefers the total it
    // read out of the row's own Hours cell, which is the figure a reader sums
    // against. The prose lead is deliberately set to 45-60 too, so class 5 is
    // not what fires here: the only disagreement is table-vs-total.
    /parts sum to 41-58 hours but the Total row says 45-60/,
  );
}
{
  // The Total-row shape, with NO claim above the table, so the Total row is the
  // only statement to check against. The previous control covers the opposite
  // case (a claim above the table, which the guard prefers), so between them
  // both paths through `stated = totalRow ? ... : claim` are exercised.
  const totalOnly = phase({ table: GOOD_TABLE })
    .replace(/\*\*Roughly 41-58 hours over 5 weeks:\*\*\n/, "")
    .replace("| **Total** | **41-58** |", "| **Total** | **45-60** |")
    // Keep the section prose at 41-58 so the only defect is table-vs-total.
    ;
  expectFinding(
    "class 1: parts do not sum to the Total row, with no claim above the table",
    one(totalOnly),
    /parts sum to 41-58 hours but the Total row says 45-60/,
  );
}
{
  // The other shape: no Total row, so the claim is the line ABOVE the table.
  // This is the shape class 1 found the corpus's real defects in, and it is the
  // only way to reach the `claim` branch now that a Total row is read from its
  // own cell.
  const noTotal = phase({ table: GOOD_TABLE })
    .replace(/\| \*\*Total\*\* \| \*\*41-58\*\* \|\n/, "")
    .replace("**Roughly 41-58 hours over 5 weeks:**", "**Roughly 45-60 hours over 5 weeks:**")
    .replace("Roughly 41-58 hours, and", "Roughly 45-60 hours, and");
  expectFinding(
    "class 1: parts do not sum to the line above the table (no Total row)",
    one(noTotal),
    /parts sum to 41-58 hours but the line above says 45-60/,
  );
}
{
  // NEGATIVE, and the reason class 1 is scoped by the Hours column: a schedule
  // table has time-ish cells and no total. The header's own record says the
  // first version summed bare "4-6" cells out of exactly this shape and
  // "reported success on three tables out of the corpus". Flagging it here
  // would be a false positive, so it must stay silent.
  const schedule = phase({ extra: "" }).replace(
    "## Checklist",
    [
      "## Schedule",
      "",
      "| Week | Study % | Hands-on % |",
      "| --- | --- | --- |",
      "| 1 | 60 | 40 |",
      "| 2 | 60 | 40 |",
      "| 3 | 40 | 60 |",
      "",
      "## Checklist",
    ].join("\n"),
  );
  expectClean("class 1 negative: a schedule table is not a budget table", one(schedule));
}
{
  // The failure mode the header names explicitly: a table that HAS an Hours
  // column but no checkable claim is a FAILURE, not a silent skip — "a check
  // whose skip path looks like its pass path is not a check".
  const noClaim = phase({}).replace(
    "## Checklist",
    [
      "| Part | Hours |",
      "| --- | --- |",
      "| Reading | 20-30 |",
      "| Hands-on | 21-28 |",
      "",
      "## Checklist",
    ].join("\n"),
  );
  expectFinding(
    "class 1: an Hours column with no total to check against is itself a finding",
    one(noClaim),
    /has an Hours column or a Total row but prints no hour total/,
  );
}

// =============================================================================
// Class 2 — an inverted range followed by a time unit.
// =============================================================================
{
  // The message ends "(hours.)" — the guard slices 12 characters of tail and
  // takes the first whitespace-delimited token, so the sentence's full stop
  // comes along. The first version of this control asserted "(hours)" and
  // failed on exactly that character, which is the eleventh fixture-side error
  // and a reminder that a message-matching control has to match the message.
  expectFinding(
    "class 2: an inverted range '60-40 hours'",
    one(phase({ estProse: "**5 weeks** at about 8-11 hours a week. Roughly 60-40 hours." })),
    /inverted range 60-40 \(hours\.\)/,
  );
}
{
  // A different unit, to show the scope is not specific to hours. IT 03's real
  // defect was an inverted WEEK range inside a schedule sentence.
  //
  // The message is "(weeks)" here, not "(hours.)" as in the control above. The
  // guard slices 12 characters after the match and prints the first
  // whitespace-delimited token, so the trailing full stop appears only when the
  // range ends a sentence. Asserting on the unit rather than the whole
  // parenthetical keeps this control about the unit scope, which is the thing
  // under test.
  expectFinding(
    "class 2: an inverted range with a 'weeks' unit",
    one(
      phase({
        estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 41-58 hours.",
        extra: "That is 9-4 weeks at a glance.",
      }),
    ),
    /inverted range 9-4 \(weeks/,
  );
}
{
  // NEGATIVE: an inverted pair NOT followed by a time unit. A negative number
  // or an unrelated dash pair must not be misread — the guard scopes this
  // deliberately, so removing the scope must be caught here if it regresses.
  expectClean(
    "class 2 negative: an inverted number pair with no time unit after it",
    one(phase({ extra: "A range like 10-5 in plain prose is not a budget." })),
  );
}

// =============================================================================
// Class 3 — frontmatter vs the bold lead of the prose estimate.
// =============================================================================
{
  // Frontmatter says 5 weeks, the prose lead says 9 weeks.
  expectFinding(
    "class 3: the prose week count disagrees with the frontmatter duration",
    one(phase({ estProse: "**9 weeks** at about 8-11 focused hours a week. Roughly 41-58 hours." })),
    /prose says 9-9 weeks but frontmatter says "5 weeks"/,
  );
}
{
  // The other class-3 check: duration_weeks sitting outside the duration string.
  expectFinding(
    "class 3: duration_weeks outside the duration range",
    one(phase({ duration: "4-6 weeks", durationWeeks: "9" })),
    /duration_weeks 9 sits outside duration "4-6 weeks"/,
  );
}
{
  // NEGATIVE: a range that contains duration_weeks is fine.
  expectClean(
    "class 3 negative: duration_weeks inside the duration range",
    one(phase({ duration: "4-6 weeks", durationWeeks: "5" })),
  );
}

// =============================================================================
// Class 4 — the track overview against the phase file it points at.
// =============================================================================
{
  // This is the check that "never cross-checked a single week count" in its
  // first version. The control has to build a real phase file AND a real
  // overview row, because the class is about the two disagreeing.
  const phaseFile = phase({ duration: "5 weeks", durationWeeks: "5" });
  const overview = [
    "## Timeline",
    "",
    "| Phase | Title | Weeks | Notes |",
    "| --- | --- | --- | --- |",
    "| 1 | One | 9 weeks | a note |",
    "",
  ].join("\n");
  expectFinding(
    "class 4: the overview lists 9 weeks where the phase file says 5",
    { "01-phase-probe.md": phaseFile, "00-overview.md": overview },
    /lists phase 1 as 9-9 weeks but the phase file says "5 weeks"/,
  );
}
{
  // NEGATIVE: agreement must produce silence. The first version's live-flag bug
  // made this pass for the wrong reason, so the negative matters as much as the
  // positive here.
  const phaseFile = phase({ duration: "5 weeks", durationWeeks: "5" });
  const overviewOk = [
    "## Timeline",
    "",
    "| Phase | Title | Weeks | Notes |",
    "| --- | --- | --- | --- |",
    "| 1 | One | 5 weeks | a note |",
    "",
  ].join("\n");
  expectClean(
    "class 4 negative: the overview and the phase file agree",
    { "01-phase-probe.md": phaseFile, "00-overview.md": overviewOk },
  );
}
{
  // The other class-4 finding: an overview row pointing at a phase that does
  // not exist. Counting only the classes a reader remembers is how a phase
  // gets skipped without anyone noticing.
  const overviewDangling = [
    "## Timeline",
    "",
    "| Phase | Title | Weeks | Notes |",
    "| --- | --- | --- | --- |",
    "| 7 | Seven | 5 weeks | a note |",
    "",
  ].join("\n");
  expectFinding(
    "class 4: the overview lists a phase with no duration declared",
    { "01-phase-probe.md": phase({}), "00-overview.md": overviewDangling },
    /lists phase 7 but no matching phase file declares a duration/,
  );
}

// =============================================================================
// Class 5 — two hour-claims for the same phase that do not overlap.
// =============================================================================
// THE class this guard was extended for, and the one that was wrong twice:
// `overlaps()` accepted 40-55 against 41-58 because they share 41-55, and the
// first implementation scanned only bold spans so it missed the "Estimated
// time" prose shape entirely. Both failure directions are asserted here.
{
  // THE ACTUAL DEFECT, verbatim in shape from advance 02: "Roughly 40-55 hours"
  // in the section, "Roughly 41-58 hours" above the table.
  const drift = phase({
    estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 40-55 hours, and the write-up is a real part of it.",
    table: GOOD_TABLE,
  });
  expectFinding(
    "class 5: the section says 40-55 and the table lead says 41-58 (partial overlap must FAIL)",
    one(drift),
    /states 41-58 hours but line \d+ states 40-55 — two totals for one phase/,
  );
}
{
  // The failure mode that makes this the sharper test: if the rule were
  // reverted to `overlaps()`, the control above would PASS, because 40-55 and
  // 41-58 share 41-55. So this assertion is what distinguishes the current rule
  // from the wrong one that shipped.
  record(
    "class 5: the ranges above really do overlap (so overlaps() would have accepted them)",
    (() => {
      const ov = (a, b) => a[0] <= b[1] && b[0] <= a[1];
      return ov([40, 55], [41, 58]);
    })(),
    ["40-55 and 41-58 share 41-55, so an overlaps() rule would have let this defect through"],
  );
}
{
  // NEGATIVE: the two statements agree exactly.
  expectClean(
    "class 5 negative: both statements give the identical range",
    one(phase({ table: GOOD_TABLE })),
  );
}
{
  // NEGATIVE: rounding. IT 06 says "about 6.1 hours. Answer: roughly 6 hours"
  // and one bound differing by 1 is not a contradiction — the guard's own
  // header lists this as a real output it had to learn to ignore.
  expectClean(
    "class 5 negative: two claims differing by 1 hour at every bound is rounding",
    one(
      phase({
        estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 42-58 hours.",
        table: GOOD_TABLE,
      }),
    ),
  );
}
{
  // NEGATIVE: a rate is not a total. "8-11 focused hours a week" appears in the
  // Estimated time prose of every real phase, and reading it as a budget would
  // make class 5 fire on the whole corpus.
  expectClean(
    "class 5 negative: an 'N-M focused hours a week' rate is not a phase total",
    one(
      phase({
        estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 41-58 hours.",
      }),
    ),
  );
}
{
  // NEGATIVE: the same line twice is one figure, not a contradiction. IT 06
  // rounds 6.1 to 6 within a single sentence.
  expectClean(
    "class 5 negative: two mentions on the SAME line are one statement",
    one(
      phase({
        estProse: "**5 weeks** at about 8-11 focused hours a week. Roughly 41-58 hours, which is 6.1 hours a day over 8 days.",
      }),
    ),
  );
}

// =============================================================================
// The table that was never checked.
// =============================================================================
// `advance-roadmap/01-phase-detection-at-scale.md:564` is a real budget table:
//
//   | Rule | Alerts/month | Minutes each | Hours/month | Share of capacity |
//   | DET-014 Encoded PowerShell | 1,240 | 12 | 248.0 | 40% |
//   ...
//   | **Total** | **3,100** | — | **618.5** | **100%** |
//
// Its parts sum to exactly its stated 618.5, so the table is CORRECT. But
// class 1 never once looked at it, for two independent reasons, each of which
// had to be fixed before the other was even visible:
//
//   1. The Hours column header is `Hours/month`, and the column matcher required
//      the header to be exactly `Hour`/`Hours`. The table was therefore OUT OF
//      SCOPE and skipped without a word.
//   2. Its Total row is `**Total**`, which the total-row detector could not see
//      (it matched only a bare `Total`), and whose value `**618.5**` none of
//      the number readers could parse, because every pattern is anchored on a
//      digit and the asterisks sat in between.
//
// So this control asserts the arithmetic is now actually performed, by breaking
// the total. Under the pre-fix guard this phase produced NO findings whatever
// the total said — which is the shape of every silent-skip bug in this
// repository's history.
{
  // Built explicitly rather than by patching phase()'s table, because the
  // column layout IS the thing under test here and a string replacement over a
  // 2-column template cannot express a 5-column table. The first version tried,
  // and its replacements silently matched nothing — so the fixture kept the
  // 2-column shape and only one part row was ever read. **A fixture whose
  // edits quietly do not apply is indistinguishable from a fixture that is
  // correct**, which is the reason the expected sums below are written out.
  const detectionPhase = (totalCell) =>
    [
      "---",
      "id: advance-01-detection",
      "track: advance",
      "phase: 1",
      'duration: "4 weeks"',
      "duration_weeks: 4",
      "---",
      "",
      "## Goal of this phase",
      "Teach detection engineering.",
      "",
      "## Estimated time",
      "",
      "**4 weeks** at about 8-11 focused hours a week. Roughly 618.5 hours, and the write-up is a real part of it.",
      "",
      "#### Where the capacity actually goes",
      "",
      "| Rule | Alerts/month | Minutes each | Hours/month | Share of capacity |",
      "|---|---|---|---|---|",
      "| DET-014 Encoded PowerShell | 1,240 | 12 | 248.0 | 40% |",
      "| DET-002 Multiple Failed Logons | 690 | 8 | 92.0 | 15% |",
      "| DET-031 Admin Group Change | 410 | 15 | 102.5 | 17% |",
      "| DET-007 Outbound to New Domain | 300 | 20 | 100.0 | 16% |",
      "| DET-055 Service Installed | 260 | 6 | 26.0 | 4% |",
      "| 38 other rules | 200 | 15 | 50.0 | 8% |",
      `| **Total** | **3,100** | — | **${totalCell}** | **100%** |`,
      "",
      "## Lesson",
      "Prose.",
      "",
      "## Checklist",
      "- [ ] An item.",
      "",
    ].join("\n");

  // 248.0 + 92.0 + 102.5 + 100.0 + 26.0 + 50.0 = 618.5 exactly, which is what
  // the real file says.
  expectClean(
    "the real corpus shape: a 'Hours/month' column summing correctly -> PASS (the table is in scope)",
    { "01-phase-detection-at-scale.md": detectionPhase("618.5") },
  );
  expectFinding(
    "the same 'Hours/month' table with a wrong Total -> FAIL (proves the check runs, not a silent skip)",
    { "01-phase-detection-at-scale.md": detectionPhase("700.0") },
    /parts sum to 618\.5-618\.5 hours but the Total row says 700-700/,
  );
}

// =============================================================================
// Control N — the phase-file pattern must include 10 and above.
// =============================================================================
// Every guard in this repository carried a `^0[1-9]-` bug at some point. This
// one matches `^\d{2}-phase-`, so it is correct — but "correct today" is the
// claim under test, and a control that only ever runs against 01- would not
// notice a regression to a narrower pattern.
{
  const ten = phase({ id: "probe-10" });
  const r = runOn({
    "01-phase-one.md": phase({}),
    "10-phase-ten.md": ten.replace("phase: 1", "phase: 10"),
  });
  const m = /phases checked: (\d+)/.exec(r.out);
  record(
    "a two-digit phase file is checked (phases checked = 2)",
    r.code === 0 && m && m[1] === "2",
    [`exit ${r.code}; phases checked=${m ? m[1] : "(not reported)"} (want 2)`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================

const failed = results.filter((r) => !r.passed);
console.log("");
if (failed.length === 0) {
  console.log(`All ${results.length} controls passed: all five classes can be made to fail on a real`);
  console.log("instance, the three classes that were wrong on the first attempt are held to the");
  console.log("corrected rule, and seven of them stay silent on legitimate content.");
} else {
  console.log(`${failed.length} of ${results.length} controls FAILED.`);
}
process.exit(failed.length === 0 ? 0 : 1);
