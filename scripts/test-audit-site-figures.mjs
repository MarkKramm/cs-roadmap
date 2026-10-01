// Controls for audit-site-figures.mjs.
//
// WHY THESE CONTROLS STUB `npm` RATHER THAN RUNNING THE SUITES
//
// This guard's entire method is to RUN the site suites and read the counts they
// print -- it cannot know a check count any other way, which is the reason it
// exists (see its header: the bundle figure rotted from 1,527,506 to 1,527,558
// because nothing re-derived it). So the obvious way to control it is to mutate
// the document and let it run, which means two real `npm run` invocations per
// control. At a dozen controls that is minutes of wall clock for assertions
// about string matching.
//
// The guard does `spawn("npm", ["run", script], { cwd: SITE, shell: true })`.
// Under `shell: true` the command is resolved through the shell, so a `npm` (or
// `npm.cmd`) placed earlier on PATH wins. The controls below put a stub there
// that prints whatever count the control needs. The guard is unmodified: it runs
// its real code path, spawns, reads stdout, and parses -- only the suite is
// replaced. That is the difference between testing the guard and reimplementing
// it, and it is why these controls run in about a second.
//
// The trade is named rather than hidden: a stub cannot tell you the REAL suites
// print what the guard expects. That is what the guard's own run in CI is for,
// and it happens in the same job on every commit. What these controls establish
// is that each of the guard's four failure branches can fire at all -- which was
// the open question, since it shipped with no controls and has never been shown
// to fail.
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD = "scripts/audit-site-figures.mjs";
const DOC_PATH = join(ROOT, "docs", "CHECKPOINT.md");

// --- the stubbed npm --------------------------------------------------------
//
// Counts come from environment variables so a control can set them without
// rewriting the stub. `CS_STUB_FAIL` makes a suite exit non-zero, which is how
// the "suite could not be run" branch is reached -- a branch that matters,
// because a suite that fails to run must leave the figure UNCHECKED rather than
// silently passing.
const STUB_DIR = mkdtempSync(join(tmpdir(), "cs-sitefig-ctl-"));
const IS_WIN = process.platform === "win32";
const STUB_NAME = IS_WIN ? "npm.cmd" : "npm";

const STUB = IS_WIN
  ? `@echo off
if "%CS_STUB_FAIL%"=="data" if "%2"=="test:data" exit /b 1
if "%CS_STUB_FAIL%"=="smoke" if "%2"=="test:smoke" exit /b 1
if "%CS_STUB_FAIL%"=="both" exit /b 1
if "%2"=="test:data" echo DATA TEST PASSED -- %CS_STUB_DATA% checks across the storage keys
if "%2"=="test:smoke" echo SMOKE RENDER PASSED -- %CS_STUB_SMOKE% renders across the corpus
exit /b 0
`
  : `#!/bin/sh
if [ "$CS_STUB_FAIL" = "data" ] && [ "$2" = "test:data" ]; then exit 1; fi
if [ "$CS_STUB_FAIL" = "smoke" ] && [ "$2" = "test:smoke" ]; then exit 1; fi
if [ "$CS_STUB_FAIL" = "both" ]; then exit 1; fi
if [ "$2" = "test:data" ]; then echo "DATA TEST PASSED -- $CS_STUB_DATA checks across the storage keys"; fi
if [ "$2" = "test:smoke" ]; then echo "SMOKE RENDER PASSED -- $CS_STUB_SMOKE renders across the corpus"; fi
exit 0
`;

writeFileSync(join(STUB_DIR, STUB_NAME), STUB, "utf8");
if (!IS_WIN) chmodSync(join(STUB_DIR, STUB_NAME), 0o755);

// The stub must actually be found, or every control below "passes" by never
// reaching the guard's comparison at all -- and the real `npm` would be spawned
// instead, making the suite slow AND the assertions meaningless.
if (!existsSync(join(STUB_DIR, STUB_NAME))) {
  console.error("PRECONDITION FAILED — the npm stub was not created at " + STUB_DIR);
  process.exit(1);
}

const STUB_PATH = STUB_DIR + (IS_WIN ? ";" : ":") + (process.env.PATH || "");

// --- the document -----------------------------------------------------------
const ORIGINAL = readFileSync(DOC_PATH, "utf8");

/** The counts the document currently publishes, read from the document itself. */
function statedCounts(doc) {
  const d = /`?test:data`? \((\d+) checks\)/.exec(doc);
  const s = /`?test:smoke`? \((\d+) renders\)/.exec(doc);
  return { data: d ? Number(d[1]) : null, smoke: s ? Number(s[1]) : null };
}

const TRUTH = statedCounts(ORIGINAL);

function run(stubData, stubSmoke, stubFail = "") {
  const env = {
    ...process.env,
    PATH: STUB_PATH,
    CS_STUB_DATA: String(stubData),
    CS_STUB_SMOKE: String(stubSmoke),
    CS_STUB_FAIL: stubFail,
  };
  try {
    const out = execFileSync(process.execPath, [GUARD], { encoding: "utf8", cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

/**
 * `expected` is a regex the guard's OUTPUT must contain.
 *
 * Separate from the description on purpose, and the reason is recorded in the
 * sibling suite: one string used for both means a control "fails" while the
 * guard is correctly exiting 1, because the helper was looking for its own
 * description in the guard's output. A control that cannot tell "failed for the
 * right reason" from "failed for an unrelated reason" is not a control.
 */
function mustNotice(name, expected, fn) {
  const r = fn();
  const ok = r.code !== 0 && new RegExp(expected, "i").test(r.out);
  record(ok ? "notice: " + name : "FAILED TO NOTICE: " + name, ok, ok ? [`exit ${r.code}`] : [`exit ${r.code}`, r.out.trim().split("\n").slice(0, 8).map((l) => "  | " + l).join("\n")]);
}

function mustBeQuiet(name, fn) {
  const r = fn();
  const ok = r.code === 0;
  record(ok ? "quiet: " + name : "WRONGLY FAILED: " + name, ok, ok ? ["exit 0"] : [`exit ${r.code}`, r.out.trim().split("\n").slice(0, 8).map((l) => "  | " + l).join("\n")]);
}

// =============================================================================
// Control A — the document's own figures must pass against the suites' own
// counts. This is the healthy path, and it is asserted with the stub printing
// EXACTLY the numbers the document states, so the comparison is exercised and
// not skipped.
// =============================================================================
{
  const r = run(TRUTH.data, TRUTH.smoke);
  const checked = /Suite figures checked: (\d+) of (\d+)/.exec(r.out);
  record(
    "control A: the document's figures match the suites' counts (both suites checked)",
    r.code === 0 && checked && checked[1] === "2",
    [`exit ${r.code}; checked ${checked ? checked[1] + " of " + checked[2] : "?"} (want 2 of 2)`],
  );
}

// =============================================================================
// Control B — a figure that has drifted. THE ACTUAL DEFECT CLASS.
// =============================================================================
// This is the whole reason the guard exists: a number in prose with no command
// behind it. The bundle figure rotted 52 bytes unnoticed; these two had never
// been compared to anything at all.
mustNotice(
  "a test:data count that has drifted",
  /document says \d+ checks, the suite prints \d+/,
  () => run(TRUTH.data + 1, TRUTH.smoke),
);
mustNotice(
  "a test:smoke render count that has drifted",
  /document says \d+ renders, the suite prints \d+/,
  () => run(TRUTH.data, TRUTH.smoke + 1),
);

// =============================================================================
// Control C — an absent check, which must NOT read as a pass.
// =============================================================================
// The guard's header names this branch: "a suite that quietly stops being
// counted must not read as a pass." The document's phrasing is what the guard's
// pattern reads, so changing it removes the check entirely -- and a guard that
// reported nothing there would look identical to a healthy corpus.
mustNotice(
  "the document stops stating a test:data count at all (an absent check, not a pass)",
  /no longer states this suite's count/,
  () => {
    const doc = ORIGINAL.replace(/`?test:data`? \(\d+ checks\)/, "test:data — count not published");
    writeFileSync(DOC_PATH, doc, "utf8");
    try {
      return run(TRUTH.data, TRUTH.smoke);
    } finally {
      writeFileSync(DOC_PATH, ORIGINAL, "utf8");
    }
  },
);
mustNotice(
  "the document stops stating a test:smoke count at all",
  /no longer states this suite's count/,
  () => {
    const doc = ORIGINAL.replace(/`?test:smoke`? \(\d+ renders\)/, "test:smoke — count not published");
    writeFileSync(DOC_PATH, doc, "utf8");
    try {
      return run(TRUTH.data, TRUTH.smoke);
    } finally {
      writeFileSync(DOC_PATH, ORIGINAL, "utf8");
    }
  },
);

// =============================================================================
// Control D — a suite that cannot be run leaves the figure UNCHECKED.
// =============================================================================
// The distinction this guard is built on, and the easiest one to get wrong: a
// suite exiting non-zero has NOT verified anything. If this reported "OK", a
// broken test suite would certify every figure in the document.
mustNotice(
  "a suite that exits non-zero -> the figure is unchecked, not verified",
  /exited \d+, so its count could not be read/,
  () => run(TRUTH.data, TRUTH.smoke, "data"),
);

// The "passes but prints no count" branch needs the count to be ABSENT, not
// zero. An earlier version of this control set the stub to print "0 checks",
// which still parses as a count — so the guard correctly reported "the suite
// prints 0" and the control failed against a guard doing the right thing. That
// is the thirteenth fixture-side error in this repository, and it is worth the
// space: **a stub that exercises the wrong branch is worse than no stub**, since
// it looks like coverage of the branch it misses.
//
// So the stub is REPLACED for this one run with a variant that prints no summary
// line for test:data at all.
mustNotice(
  "a suite that prints no count at all -> unchecked (no summary line)",
  /printed no 'checks' count/,
  () => {
    const p = join(STUB_DIR, STUB_NAME);
    writeFileSync(
      p,
      IS_WIN
        ? `@echo off
if "%2"=="test:smoke" echo SMOKE RENDER PASSED -- ${TRUTH.smoke} renders across the corpus
exit /b 0
`
        : `#!/bin/sh
if [ "$2" = "test:smoke" ]; then echo "SMOKE RENDER PASSED -- ${TRUTH.smoke} renders across the corpus"; fi
exit 0
`,
      "utf8",
    );
    try {
      return run(TRUTH.data, TRUTH.smoke);
    } finally {
      writeFileSync(p, STUB, "utf8"); // restore the real stub
    }
  },
);

// The mirror of that branch: a suite that prints a count it does not own. Not
// required, but it pins the "checked N of M" denominator falling when one suite
// cannot be read -- the difference between "all verified" and "one skipped".
{
  const r = run(TRUTH.data, TRUTH.smoke, "smoke");
  const checked = /Suite figures checked: (\d+) of (\d+)/.exec(r.out);
  record(
    "a suite that cannot be run lowers the 'checked N of M' denominator",
    r.code !== 0 && checked && checked[1] === "1" && checked[2] === "2",
    [`exit ${r.code}; checked ${checked ? checked[1] + " of " + checked[2] : "?"} (want 1 of 2)`],
  );
}

// =============================================================================
// Control E — the report must state its denominator.
// =============================================================================
// "Suite figures checked: N of M" is what distinguishes "everything verified"
// from "one suite silently stopped being counted". A guard that printed only
// "OK" would make those two identical, which is the failure this whole file is
// about.
{
  const r = run(TRUTH.data, TRUTH.smoke);
  const line = r.out.split("\n").find((l) => /Suite figures checked/.test(l)) || "(absent)";
  record("a passing run still prints 'checked N of M'", /of 2/.test(line), [line.trim()]);
}

// =============================================================================
// Control F — the fixture mutations must actually have changed the document.
// =============================================================================
// Every control above that writes DOC_PATH restores it in a `finally`, but a
// mutation whose search string no longer exists would write an unchanged
// document and the guard would report the same thing as the healthy path. This
// asserts the anchors these controls rely on are present in the real file, so a
// future edit to CHECKPOINT.md cannot turn them into silent no-ops.
{
  const hasData = /`?test:data`? \(\d+ checks\)/.test(ORIGINAL);
  const hasSmoke = /`?test:smoke`? \(\d+ renders\)/.test(ORIGINAL);
  record(
    "the document still contains the anchors the mutating controls search for",
    hasData && hasSmoke,
    [`test:data anchor=${hasData}  test:smoke anchor=${hasSmoke}`],
  );
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(failed.length
  ? `${failed.length} of ${results.length} controls FAILED — the branches above are not proven.`
  : `All ${results.length} controls passed: every failure branch of the suite-figure guard can fire,\n` +
    `and it reports its denominator so a shrinking set of checks cannot read as a pass.`);

rmSync(STUB_DIR, { recursive: true, force: true });
// The document must be byte-identical to how this suite found it.
if (readFileSync(DOC_PATH, "utf8") !== ORIGINAL) {
  console.error("FATAL: docs/CHECKPOINT.md was not restored byte-identical.");
  process.exit(1);
}
process.exit(failed.length === 0 ? 0 : 1);
