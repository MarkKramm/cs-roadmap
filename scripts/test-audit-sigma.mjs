// Controls for audit-sigma.mjs.
//
// WHY A CONTROL SUITE
// A guard that has never failed is a comment. Every rule in this file was
// proved able to FAIL on a defect it claims to catch, and to PASS on the real
// corpus and on correct text. The four defects it was written for were all
// present in the repository when it was written, so the strongest available
// control is the original defect re-injected — the same technique that
// `audit-commands.mjs` used, and the reason it can be trusted to have been
// proven able to see the thing it was built for.
//
// Every fixture is applied to a COPY, and the working tree is verified
// byte-identical afterwards. A control suite that mutates the corpus and leaves
// it changed is worse than no control suite.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-sigma.mjs");

let pass = 0;
let failed = 0;

function run() {
  try {
    const out = execFileSync(process.execPath, [GUARD], { cwd: ROOT, encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

function check(name, cond, detail = "") {
  if (cond) {
    console.log(`  pass  ${name}`);
    pass++;
  } else {
    console.log(`  FAIL  ${name}${detail ? "\n        " + detail : ""}`);
    failed++;
  }
}

// --- the real corpus, untouched -------------------------------------------
{
  const r = run();
  check("the corpus as shipped -> must PASS", r.code === 0, r.code !== 0 ? r.out.slice(0, 400) : "");
}

const TARGETS = [
  "career-roadmaps/advance-roadmap/01-phase-detection-at-scale.md",
  "career-roadmaps/advance-roadmap/07-phase-detection-as-code.md",
  "career-roadmaps/cybersec-roadmap/10-phase-detection-engineering.md",
];
const BACKUP = TARGETS.map((t) => {
  const p = path.join(ROOT, t);
  return { p, text: fs.readFileSync(p, "utf8") };
});

function restore() {
  for (const b of BACKUP) fs.writeFileSync(b.p, b.text, "utf8");
}

function withFixture(name, file, find, replace, expectFail) {
  const target = BACKUP.find((b) => b.p === path.join(ROOT, "career-roadmaps", file));
  if (!target) throw new Error(`control names a file that is not a target: ${file}`);
  const original = target.text;
  if (!original.includes(find)) {
    check(name, false, `FIXTURE MATCHED NOTHING — the guard's control tests a string the corpus no longer contains. A control that cannot be applied proves nothing.`);
    return;
  }
  fs.writeFileSync(target.p, original.replace(find, replace), "utf8");
  const r = run();
  restore();
  const sawIt = r.out.includes("the Sigma specification does not permit") || r.out.includes("not one of the five permitted");
  check(
    name,
    expectFail ? r.code !== 0 && sawIt : r.code === 0,
    `exit=${r.code} guardNamedTheDefect=${sawIt}`,
  );
}

// --- 1. the exact defects the guard was written for, re-injected -----------
withFixture(
  "slash date (the original 01-phase defect) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: 2026/03/14",
  true,
);

withFixture(
  "slash modified (a context line, never a row of its own) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "modified: 2026-03-14",
  "modified: 2026/03/14",
  true,
);

withFixture(
  "`status: production` (not one of the five) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "status: stable",
  "status: production",
  true,
);

// --- 2. the boundary cases, which are where a date rule usually goes wrong ---
withFixture(
  "a correct ISO date -> must still PASS",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: 2026-03-14",
  false,
);

withFixture(
  "month 13 (matches the shape, not the calendar) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: 2026-13-14",
  true,
);

withFixture(
  "day 32 -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: 2026-03-32",
  true,
);

withFixture(
  "a one-digit month (`2026-3-14`) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: 2026-3-14",
  true,
);

withFixture(
  "`status: Stable` (right word, wrong case) -> must FAIL",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "status: stable",
  "status: Stable",
  true,
);

withFixture(
  "every other permitted status value -> must still PASS",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "status: stable",
  "status: deprecated",
  false,
);

withFixture(
  "a level value the corpus does use, changed to an invalid one -> must FAIL",
  "advance-roadmap/07-phase-detection-as-code.md",
  "level: medium",
  "level: urgent",
  true,
);

// --- 3. a value the guard must not invent a rule for -----------------------
// A `date:` that is not a date at all is not this guard's business. Failing it
// would be the guard inventing a claim, which is the failure mode every rule in
// this repository is written to avoid.
withFixture(
  "a YAML anchor or placeholder, not a date -> must still PASS",
  "advance-roadmap/01-phase-detection-at-scale.md",
  "date: 2026-03-14",
  "date: <date>",
  false,
);

// --- 4. the corpus must be byte-identical afterwards ----------------------
{
  let intact = true;
  const detail = [];
  for (const b of BACKUP) {
    if (fs.readFileSync(b.p, "utf8") !== b.text) {
      intact = false;
      detail.push(path.relative(ROOT, b.p));
    }
  }
  check(`real repository files untouched by every fixture: ${intact}`, intact, detail.join(", "));
}

restore();

console.log("");
console.log(failed === 0 ? `ALL ${pass} CONTROLS PASS` : `${failed} CONTROL(S) FAILED (${pass} passed)`);
process.exit(failed === 0 ? 0 : 1);
