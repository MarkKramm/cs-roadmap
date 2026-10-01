// Controls for audit-commands.mjs.
//
// The guard is the narrowest in the repository: seven rules, each naming one command
// that was abbreviated into invalid syntax. Its own header explains the failure it
// exists for -- IT 02 stated DISM correctly at line 219 and its summary table said
// `DISM /RestoreHealth` 300 lines later, which throws if a beginner types it.
//
// That defect is already CLOSED in the corpus, so there is no defect to find here. What
// these controls establish is that the guard can still catch it -- because a guard
// whose rule has stopped matching is the exact shape this pass has now found four
// times, and a re-injection is the only honest test of a rule list.
//
// TWO PROPERTIES, and the second is the one that matters more:
//
//   1. Each rule fires on the broken form and STAYS SILENT on the correct one. A guard
//      that flags valid usage gets ignored, which its own header calls "worse than not
//      having it" -- and the whole rule set is deliberately narrow for that reason.
//   2. The corpus is genuinely clean, proven by re-injecting the ORIGINAL defect text
//      verbatim rather than by trusting that the fix is still in place.
//
// The re-injection controls are the load-bearing ones. Every other guard suite in this
// directory plants a defect to see whether it is caught; this one plants the exact
// historical defect, because the risk here is not that the rule is wrong but that it
// has quietly stopped applying to a file that still contains the correct form.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-commands.mjs");

/**
 * The guard walks `career-roadmaps/` from its own location on disk, so pointing it
 * at a fixture means giving it a scratch copy of itself beside a scratch content tree.
 */
function runOn(files) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-cmd-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    const content = join(scratch, "career-roadmaps", "it-roadmap");
    mkdirSync(content, { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      writeFileSync(join(content, name), text, "utf8");
    }
    let out = "";
    let code = 0;
    try {
      out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) {
      code = e.status === undefined ? 1 : e.status;
      out = (e.stdout || "") + (e.stderr || "") || "";
    }
    return { code, out };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

const one = (line) => ({ "01-phase-probe.md": line + "\n" });

function expectClean(name, line) {
  const r = runOn(one(line));
  const ok = r.code === 0;
  record(ok ? "quiet: " + name : "WRONGLY FAILED: " + name, ok, ok
    ? ["exit 0"]
    : [`exit ${r.code}`, r.out.split("\n").filter((l) => /\[/.test(l)).slice(0, 3).map((l) => "  | " + l.trim()).join("\n")]);
}

function expectCaught(name, line, ruleId) {
  const r = runOn(one(line));
  const named = new RegExp("\\[\\s*" + ruleId + "\\s*\\]").test(r.out);
  const ok = r.code === 1 && named;
  record(ok ? "notice: " + name : "FAILED TO NOTICE: " + name, ok, ok
    ? ["exit 1", r.out.split("\n").find((l) => l.includes(ruleId))?.trim() || ""]
    : [`exit ${r.code}; rule ${ruleId} named=${named}`, r.out.trim().split("\n").slice(0, 6).map((l) => "  | " + l).join("\n")]);
}

// =============================================================================
// Control 0 -- the baseline. Correct, complete invocations.
// =============================================================================
{
  const r = runOn({
    "01-phase-probe.md": [
      "# Phase 1",
      "",
      "Run `DISM /Online /Cleanup-Image /RestoreHealth` to repair the store.",
      "Then `sfc /scannow`, then `chkdsk C: /scan`.",
      "",
    ].join("\n"),
  });
  record("control 0: correct invocations pass", r.code === 0, [`exit ${r.code}`]);
}

// =============================================================================
// Each rule: fires on the broken form, silent on the correct one.
// =============================================================================
// Paired, because a rule that fires on the correct form is worse than no rule: it
// trains a reader to skip the report, and the real defect goes with it.
const CASES = [
  {
    id: "dism-bare-restorehealth",
    bad: "In the table: `DISM /RestoreHealth`",
    good: "In the table: `DISM /Online /Cleanup-Image /RestoreHealth`",
  },
  {
    id: "dism-bare-scanhealth",
    bad: "Try `DISM /ScanHealth` first.",
    good: "Try `DISM /Online /Cleanup-Image /ScanHealth` first.",
  },
  {
    id: "dism-bare-checkhealth",
    bad: "Then `DISM /CheckHealth`.",
    good: "Then `DISM /Online /Cleanup-Image /CheckHealth`.",
  },
  {
    id: "dism-bare-analyzecomponentstore",
    bad: "See `DISM /AnalyzeComponentStore`.",
    good: "See `DISM /Online /Cleanup-Image /AnalyzeComponentStore`.",
  },
  {
    id: "dism-bare-startcomponentcleanup",
    bad: "Run `DISM /StartComponentCleanup` to reclaim space.",
    good: "Run `DISM /Online /Cleanup-Image /StartComponentCleanup` to reclaim space.",
  },
  {
    id: "sfc-missing-slash",
    bad: "Then run `sfc scannow` to verify.",
    good: "Then run `sfc /scannow` to verify.",
  },
  {
    id: "chkdsk-missing-slash",
    bad: "Schedule `chkdsk C: scan` for the next reboot.",
    good: "Schedule `chkdsk C: /scan` for the next reboot.",
  },
];

for (const c of CASES) {
  expectCaught(`broken form is caught [${c.id}]`, c.bad, c.id);
  expectClean(`correct form is silent [${c.id}]`, c.good);
}

// =============================================================================
// The chkdsk rule has a trailing lookahead, and it is the subtlest one.
// =============================================================================
// Its pattern is /\bchkdsk\s+([A-Z]:\s*)?(scan|f|r)\b(?!\s*\/)/i -- the negative
// lookahead exists so the RULE does not match its own FIX string, which contains
// `/scan`. That is the kind of detail a rule can regress silently, so both halves are
// asserted: a bare switch is caught, and a switched one is not.
{
  const r = runOn(one("`chkdsk C: /f` is the scheduling form."));
  record("chkdsk WITH a slash is not flagged by the chkdsk rule", r.code === 0, [`exit ${r.code} (want 0)`]);
}
{
  const r = runOn(one("`chkdsk D: f` is missing the slash."));
  const ok = r.code === 1 && /chkdsk-missing-slash/.test(r.out);
  record("chkdsk with a different drive letter and a bare switch is still caught", ok, [`exit ${r.code}`]);
}

// =============================================================================
// Case-insensitivity, which every rule declares and none of the above exercises
// at its lower bound.
// =============================================================================
// A reader may type `dism /restorehealth`; the rule is `/i` and must catch it, and it
// must catch it in the middle of prose rather than only at the start of a line.
for (const [label, line] of [
  ["lowercase", "run `dism /restorehealth` now"],
  ["mixed case", "run `Dism /RestoreHealth` now"],
  ["mid-sentence", "The table says DISM /RestoreHealth, which is wrong."],
]) {
  const r = runOn(one(line));
  const ok = r.code === 1 && /dism-bare-restorehealth/.test(r.out);
  record(`case-insensitive, mid-sentence: ${label}`, ok, [`exit ${r.code}`]);
}

// =============================================================================
// Scope. The guard is deliberately narrow, and narrowness has a cost worth pinning:
// a command it does not know about cannot be caught by it.
// =============================================================================
// Nothing here asserts that other tools are checked -- that would be a different guard.
// What is asserted is the boundary: the word "DISM" alone, and "DISM /Online" without
// a switch, are both fine.
for (const [label, line] of [
  ["the bare tool name", "DISM is a component servicing tool."],
  ["a scoped invocation with no switch", "Use DISM /Online to target the running OS."],
  ["the correct form in a table cell", "| Repair the store | `DISM /Online /Cleanup-Image /RestoreHealth` |"],
]) {
  expectClean(`narrow enough: ${label}`, line);
}

// =============================================================================
// THE RE-INJECTION. The historical defect, restored verbatim in shape.
// =============================================================================
// The failure this guard exists for is not hypothetical and the corpus is now clean, so
// the honest test of the rule list is to put the original defect back and require the
// guard to see it. This is the control that distinguishes "the rule works" from "the
// rule was correct once and the corpus no longer contains the thing it catches."
{
  // The shape IT 02 shipped: a correct full invocation in the lesson, and the broken
  // abbreviation in a summary TABLE 300 lines later. Both in one file, because the
  // defect was never that the correct form was absent -- it was that the table had a
  // different one.
  const r = runOn({
    "01-phase-probe.md": [
      "# Phase 2",
      "",
      "## Lesson",
      "",
      "Run the full form:",
      "",
      "```powershell",
      "DISM /Online /Cleanup-Image /RestoreHealth",
      "```",
      "",
      "## Checklist",
      "",
      "| Step | Command |",
      "| --- | --- |",
      "| Repair the store | `DISM /RestoreHealth` |",
      "| Verify files | `sfc scannow` |",
      "",
    ].join("\n"),
  });
  const dism = /dism-bare-restorehealth/.test(r.out);
  const sfc = /sfc-missing-slash/.test(r.out);
  const ok = r.code === 1 && dism && sfc;
  record(
    "RE-INJECTION: the original defect (correct form in the lesson, abbreviation in the table) is caught",
    ok,
    [
      `exit ${r.code}; dism-bare-restorehealth=${dism}; sfc-missing-slash=${sfc}`,
      "Both must be reported -- one rule firing while the other is silent is the same defect twice.",
    ],
  );
}

// =============================================================================
// The corpus, on the real tree.
// =============================================================================
{
  const out = execFileSync(process.execPath, [GUARD_REL], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  const m = /Checked (\d+) line\(s\) across (\d+) content file\(s\)/.exec(out);
  record(
    "the real corpus is clean, and the guard says how much it read",
    /^Command audit passed/m.test(out) && m && Number(m[1]) > 10000 && Number(m[2]) > 50,
    [out.split("\n")[0].trim()],
  );
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(failed.length
  ? `${failed.length} of ${results.length} controls FAILED.`
  : `All ${results.length} controls passed: all seven rules fire on the broken form, stay silent on the\n` +
    `correct one, and the original defect re-injected into a scratch corpus is caught.`);
process.exit(failed.length === 0 ? 0 : 1);
