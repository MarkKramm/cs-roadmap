// Guard: the documentation's reproducible figures must still reproduce.
//
// WHY THIS EXISTS.
//
// Six separate wrong figures have been found in this repository's own documentation, and
// every one was the same shape: a number typed into prose, a command that prints a
// different number, and nothing comparing them.
//
//   1. IT-CLAIM-VERIFICATION.md carried a "verified" status over 225 empty rows.
//   2. CHECKPOINT.md's expected-results line claimed encoding covered "71 files" / "16
//      controls" -- the real figures were ~227 and 15.
//   3. The cyber claim count was published as 410 in three places; it is 411.
//   4. Three of four verdict recorders were not wired into CI.
//   5. lint-content's file count was stated twice and wrong twice (162, then 203 -> 217).
//   6. "23 content guards, 14 site suites" -- the real counts are 18 and 15.
//
// Five of the six were caught by accident, while doing something else. This guard is the
// mechanism that was missing: for the figures that a command can print, it prints them
// and compares against every place the documentation states them.
//
// WHAT IT DELIBERATELY DOES NOT DO. It does not try to parse prose for any number it can
// find -- that produces noise, and a noisy guard gets switched off. It checks a small,
// explicit table of (figure, command, pattern) triples, and it fails only on a mismatch.
// A figure that is not in the table is not checked, which is a real limitation and is
// reported as one rather than hidden.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// --- the measured side ------------------------------------------------------
const captured = {};
const runCapture = (key, args, re) => {
  let out;
  try {
    out = execFileSync("node", args, { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    out = (e.stdout || "") + (e.stderr || "");
  }
  const m = re.exec(out);
  captured[key] = m ? Number(m[1]) : null;
  if (captured[key] === null) {
    console.error(`  !! could not read "${key}" from: node ${args.join(" ")}`);
  }
};

runCapture("lessons", ["scripts/audit-lesson-ast.mjs"], /all (\d+) lessons/);
runCapture("quizQuestions", ["scripts/audit-quiz.mjs"], /questions checked:\s*(\d+)/);
runCapture("terms", ["scripts/audit-terms.mjs"], /domain terms:\s*(\d+)/);
runCapture("lintFiles", ["scripts/lint-content.mjs"], /(\d+) files checked/);

// Directory counts are read from disk, which is the strongest form: the substrate itself.
const countFiles = (dir, re) =>
  fs.readdirSync(path.join(ROOT, dir)).filter((f) => re.test(f)).length;
captured.auditGuards = countFiles("scripts", /^audit-.*\.mjs$/);
captured.verifyScripts = countFiles("scripts", /^verify-.*\.mjs$/);
captured.testScripts = countFiles("scripts", /^test-.*\.mjs$/);
captured.siteSuites = fs.readdirSync(path.join(ROOT, "learning-site", "scripts")).filter((f) => /\.mjs$/.test(f)).length;
captured.ciNodeSteps = (
  fs.readFileSync(path.join(ROOT, ".github", "workflows", "ci.yml"), "utf8").match(/run:\s*node\s+scripts\/\S+\.mjs/g) || []
).length;
captured.ciSteps = (fs.readFileSync(path.join(ROOT, ".github", "workflows", "ci.yml"), "utf8").match(/^\s+- name:/gm) || []).length;

// Independent recomputation, so the guard is not merely agreeing with another guard.
const build = (() => {
  try {
    return execFileSync("node", ["scripts/build-content.mjs"], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    return (e.stdout || "") + (e.stderr || "");
  }
})();
captured.banded = Number((/task bands:\s*(\d+) banded/.exec(build) || [])[1] ?? NaN);
captured.taskIds = Number((/total phase task IDs:\s*(\d+)/.exec(build) || [])[1] ?? NaN);
captured.sharedDocs = Number((/wrote shared\.json — (\d+) document/.exec(build) || [])[1] ?? NaN);

// --- the documentation side -------------------------------------------------
// Each assertion: the figure, and the claims that state it. A claim is a file plus a
// regex whose FIRST capture group is the number the file publishes.
const DOC = (file, re, what) => ({ file, re, what });
const ASSERTIONS = [
  {
    key: "auditGuards",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/audit-\*\.mjs` is \*\*(\d+)\*\* files/, "guard count")],
    why: "guards on disk",
  },
  {
    key: "verifyScripts",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/verify-\*\.mjs` is \*\*(\d+)\*\*/, "verify script count")],
    why: "verify scripts on disk",
  },
  {
    key: "testScripts",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/test-\*\.mjs` is \*\*(\d+)\*\*/, "test script count")],
    why: "test scripts on disk",
  },
  {
    key: "siteSuites",
    claims: [DOC("docs/CHECKPOINT.md", /`learning-site\/scripts\/\*\.mjs` is \*\*(\d+)\*\*/, "site suite count")],
    why: "site suites on disk",
  },
  {
    key: "ciNodeSteps",
    claims: [DOC("docs/CHECKPOINT.md", /CI runs \*\*(\d+) node steps\*\*/, "CI node steps")],
    why: "node steps in ci.yml",
  },
  {
    key: "ciSteps",
    claims: [DOC("docs/CHECKPOINT.md", /`validate-ci` reports \*\*(\d+) steps\*\*/, "validate-ci steps")],
    why: "named steps in ci.yml",
  },
  {
    key: "lessons",
    claims: [DOC("docs/CHECKPOINT.md", /all (\d+) lessons parse/, "lesson count")],
    why: "lessons the AST parser reads",
  },
  {
    key: "quizQuestions",
    claims: [
      DOC("docs/CHECKPOINT.md", /quiz `0 findings \/ (\d+) questions`/, "quiz count"),
      DOC("docs/CHECKPOINT.md", /(\d+) questions` across/, "quiz count"),
    ],
    why: "questions the quiz guard checks",
  },
  {
    key: "terms",
    claims: [DOC("docs/CHECKPOINT.md", /emits \*\*(\d+) domain terms\*\*/, "term count")],
    why: "domain terms the detector emits",
  },
  {
    key: "banded",
    claims: [
      DOC("docs/CHECKPOINT.md", /build `(\d+) banded/, "banded count"),
      DOC("docs/CHECKPOINT.md", /`build-content\.mjs` — \*\*(\d+) practice tasks banded/, "banded count"),
    ],
    why: "practice tasks the build bands",
  },
  {
    key: "taskIds",
    claims: [DOC("docs/CHECKPOINT.md", /\*\*(\d+)\*\* total phase task IDs/, "task id count")],
    why: "phase task ids the build counts",
  },
  {
    key: "sharedDocs",
    claims: [DOC("docs/CHECKPOINT.md", /shared documents `(\d+)`/, "shared document count")],
    why: "shared documents the build writes",
  },
];

console.log("Measured from commands and from disk:");
for (const [k, v] of Object.entries(captured)) console.log(`  ${k.padEnd(16)} ${v}`);

console.log("");
const findings = [];
let checked = 0;
for (const a of ASSERTIONS) {
  const actual = captured[a.key];
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    findings.push({ a, stated: "?", actual, note: "the measurement itself failed" });
    continue;
  }
  for (const c of a.claims) {
    const full = path.join(ROOT, c.file);
    if (!fs.existsSync(full)) continue;
    fs.readFileSync(full, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const m = c.re.exec(line);
        if (!m) return;
        checked++;
        const stated = Number(m[1]);
        if (stated !== actual) {
          findings.push({ a, c, stated, actual, line: i + 1, text: line.trim().slice(0, 120) });
        }
      });
  }
}

console.log(`Documentation figures checked: ${checked}`);
console.log("");
if (!findings.length) {
  console.log("DOC CLAIMS OK — every checked figure matches the command that produces it.");
  process.exit(0);
}

console.error(`DOC CLAIMS FAILED — ${findings.length} figure(s) disagree with reality:`);
console.error("");
for (const f of findings) {
  console.error(`  ${f.c ? `${f.c.file}:${f.line}` : f.a.key}  [${f.c ? f.c.what : f.a.why}]`);
  console.error(`      document says ${f.stated}   reality is ${f.actual}   (${f.a.why})`);
  if (f.text) console.error(`      ${f.text}`);
}
console.error("");
console.error("FIX: correct the document, or correct the count. Never edit this guard to agree.");
process.exit(1);
