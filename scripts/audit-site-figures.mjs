// Guard: the site suites' own check counts must match what the documentation says.
//
// WHY THIS IS A SEPARATE FILE FROM `audit-doc-figures.mjs`, and the difference
// is the whole point.
//
// `docs/CHECKPOINT.md` states "test:data (107 checks), test:smoke (236
// renders)". Those numbers are printed by the suites themselves and NOTHING
// compares them to the document. It is the same shape as the bundle figure that
// sat unchecked and rotted from 1,527,506 to 1,527,558: a number in prose with
// no command behind it.
//
// The bundle guard could read `dist/`. This one cannot read anything -- the
// counts are whatever each suite decides to print, so the only honest way to
// know them is to RUN the suites and read what they say. That is expensive, so
// the suites run CONCURRENTLY here rather than one after another, and the cost
// is paid in the `site` job where they are already running.
//
// WHAT IS ASSERTED, and what is not:
//
//   Each suite's count is compared against the number the documentation
//   publishes for it. A suite whose pattern no longer matches the document is an
//   ABSENT CHECK and is reported as such -- a suite that quietly stops being
//   counted must not read as a pass.
//
//   The bundles, the chunk count and the KiB figure are deliberately NOT checked
//   here. `audit-build-figures.mjs` owns those, it runs in the same job, and two
//   guards claiming the same figure is one more thing that can disagree with
//   itself.

import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SITE = path.join(ROOT, "learning-site");
const DOC_FILE = "docs/CHECKPOINT.md";

// The suites, and the pattern in docs/CHECKPOINT.md that states each count.
//
// ONLY SUITES WHOSE COUNT THE DOCUMENTATION ACTUALLY PUBLISHES. The first
// version listed `test:ui` as well, and the guard reported it as a failure --
// correctly, and for a reason worth recording: CHECKPOINT's live row states
// counts for test:data and test:smoke but never for test:ui, which appears only
// in dated records. The fix was to DROP the suite, not to add a figure to the
// document. Publishing a number nobody asked for, so that a guard has something
// to compare against, is the same error as measuring a value and printing it as
// though it were covered.
const SUITES = [
  { script: "test:data", docPattern: /`?test:data`? \((\d+) checks\)/, label: "test:data" },
  { script: "test:smoke", docPattern: /`?test:smoke`? \((\d+) renders\)/, label: "test:smoke" },
];

// Read a count out of a suite's own output. Each prints a shape like
// "DATA TEST PASSED -- 107 checks across ..." or "SMOKE RENDER PASSED -- 236
// renders across ...". The LAST such line is the summary; an earlier one is
// part of the run's chatter.
function parseCount(stdout, kind) {
  // The `g` flag is required: `matchAll` throws on a non-global RegExp, which it
  // did, loudly, on the first run.
  const re =
    kind === "renders"
      ? /(\d+)\s+renders?\b/gi
      : /(\d+)\s+checks?\b/gi;
  const all = [...stdout.matchAll(re)];
  if (!all.length) return null;
  return Number(all[all.length - 1][1]);
}

function runSuite(script) {
  return new Promise((resolve) => {
    // `shell: true` is how npm is invoked on Windows, and it draws a
    // DEP0190 warning under Node 24 because the argument is concatenated rather
    // than escaped. The argument is a literal from the SUITES table above, not
    // anything external, and the alternative -- resolving npm.cmd and spawning it
    // without a shell -- is the same thing with more moving parts.
    const p = spawn("npm", ["run", script], { cwd: SITE, shell: true });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
    p.on("error", () => resolve({ code: -1, out: "" }));
  });
}

const docPath = path.join(ROOT, DOC_FILE);
if (!fs.existsSync(docPath)) {
  console.error("MISSING DOCUMENT — " + DOC_FILE + " does not exist, so nothing can be checked.");
  process.exit(1);
}
const doc = fs.readFileSync(docPath, "utf8");

const findings = [];
const measured = {};

// All suites at once. Sequential runs of three npm scripts would dominate the
// job's wall clock, and the whole point of putting this in the `site` job was
// to keep the cost honest.
const results = await Promise.all(SUITES.map((s) => runSuite(s.script)));

let checked = 0;
for (let i = 0; i < SUITES.length; i++) {
  const s = SUITES[i];
  const r = results[i];
  const kind = /renders/.test(s.docPattern.source) ? "renders" : "checks";

  if (r.code !== 0) {
    findings.push({
      what: s.label,
      detail: "the suite exited " + r.code + ", so its count could not be read — the figure is unchecked, not verified",
    });
    continue;
  }
  const actual = parseCount(r.out, kind);
  if (actual === null || !Number.isFinite(actual)) {
    findings.push({
      what: s.label,
      detail:
        "the suite passed but printed no '" + kind + "' count, so the documentation figure is unchecked",
    });
    continue;
  }
  measured[s.label] = actual;

  const m = s.docPattern.exec(doc);
  if (!m) {
    findings.push({
      what: s.label,
      detail:
        "docs/CHECKPOINT.md no longer states this suite's count in the form the guard reads (" +
        s.docPattern.source + ") — an absent check, not a passing one",
    });
    continue;
  }
  const stated = Number(m[1]);
  checked++;
  if (stated !== actual) {
    findings.push({
      what: s.label,
      detail: "document says " + stated + " " + kind + ", the suite prints " + actual,
    });
  }
}

console.log("Measured by running the suites:");
for (const [k, v] of Object.entries(measured)) console.log("  " + k.padEnd(14) + v);
console.log("");
console.log("Suite figures checked: " + checked + " of " + SUITES.length);
console.log("");

if (findings.length) {
  console.log("SUITE FIGURES FAILED — " + findings.length + " finding(s):");
  for (const f of findings) {
    console.log("  [" + f.what + "]  " + f.detail);
  }
  console.log("");
  console.log("FIX: correct the document, or correct the suite. Never edit this guard to agree.");
  process.exit(1);
}

console.log("SUITE FIGURES OK — every stated count is what the suite actually prints.");
