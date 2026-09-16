// Controls for scripts/audit-framework-claims.mjs.
//
// The guard's whole value is that it fails on the real defect and passes on the
// corrected text -- and the FIRST version of its rule failed that second test,
// flagging the correct six-function list because "Identify, Protect, Detect,
// Respond, Recover" is a substring of it. This asserts both directions.
//
// It works by writing a probe line into a real phase file, running the guard,
// and restoring. That exercises the same code path the corpus takes.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-framework-claims.mjs");
const PROBE_FILE = path.join(ROOT, "career-roadmaps", "cybersec-roadmap", "01-phase-foundations.md");

const original = fs.readFileSync(PROBE_FILE);

function runGuard() {
  try {
    execFileSync(process.execPath, [GUARD], { encoding: "utf8", stdio: "pipe" });
    return 0;
  } catch (e) {
    return e.status ?? 1;
  }
}

const results = [];

function control(name, line, expectFail) {
  // Append the probe as its own paragraph, then restore.
  fs.writeFileSync(PROBE_FILE, Buffer.concat([original, Buffer.from(`\n${line}\n`, "utf8")]));
  const code = runGuard();
  fs.writeFileSync(PROBE_FILE, original);
  const failed = code !== 0;
  results.push({ name, expectFail, failed, ok: failed === expectFail });
}

// --- must fail: the retired model, in the shapes it actually appeared --------
control(
  "summary table says five functions",
  "| **NIST CSF** | Organises security work into five functions: Identify, Protect, Detect, Respond, Recover | A coverage checklist |",
  true,
);
control("heading says the five functions", "#### NIST CSF: the five functions", true);
control(
  "running order omits Govern entirely",
  "The framework is built on Identify, Protect, Detect, Respond, Recover as its structure.",
  true,
);
control(
  "exit criterion says all five functions",
  "If you can explain all five functions using an example of your own, you are ready.",
  true,
);

// --- must pass: correct text, and legitimate historical explanation ----------
control(
  "summary table lists all six correctly",
  "| **NIST CSF** | Organises security work into six functions: Govern, Identify, Protect, Detect, Respond, Recover | A coverage checklist |",
  false,
);
control("heading says the six functions", "#### NIST CSF: the six functions", false);
control(
  "historical note explaining the change is LEGITIMATE",
  "CSF 2.0 (2024) added **Govern** to the five functions of CSF 1.1. You will see older material that lists five.",
  false,
);
control(
  "running order including Govern",
  "Govern, Identify, Protect, Detect, Respond, Recover is the CSF 2.0 structure.",
  false,
);
control(
  "slash-separated correct list in a resource row",
  "| NIST CSF | Security framework | Free | Summarize Govern/Identify/Protect/Detect/Respond/Recover | CIS Controls |",
  false,
);
control("unrelated text mentioning Identify once", "Identify what you own before you protect it.", false);

// --- CIS Controls, the second rule ------------------------------------------
control("stale CIS control count", "CIS Controls provides 20 controls covering the basics.", true);
control("correct CIS control count", "CIS Controls v8 provides 18 controls covering the basics.", false);

// The guard scans career-roadmaps/ only. docs/ is meta-documentation and
// legitimately QUOTES retired claims when recording what was fixed -- a guard
// that flagged DECISIONS.md for describing the bug would punish writing the
// defect down. This control asserts the exclusion, because an earlier version
// scanned docs/ and failed 7 "must pass" controls on its own documentation.
{
  const docsProbe = path.join(ROOT, "docs", "__framework-probe.md");
  fs.writeFileSync(docsProbe, "# probe\n\nNIST CSF organises security work into five functions: Identify, Protect, Detect, Respond, Recover\n");
  const code = runGuard();
  fs.unlinkSync(docsProbe);
  const passed = code === 0;
  results.push({
    name: "retired claim in docs/ is NOT flagged (meta-docs quote it)",
    expectFail: false,
    failed: !passed,
    ok: passed,
  });
}

console.log("");
console.log("Framework-claim guard controls");
console.log("=".repeat(66));
for (const r of results) {
  const want = r.expectFail ? "must fail" : "must pass";
  console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(52)} (${want})`);
}
const bad = results.filter((r) => !r.ok);
console.log("");
if (bad.length) {
  console.log(`${bad.length} control(s) failed — the guard does not behave as documented.`);
  process.exit(1);
}
console.log(`All ${results.length} controls behaved as documented.`);
console.log("");

// Confirm the probe left the file exactly as it was.
const after = fs.readFileSync(PROBE_FILE);
if (!after.equals(original)) {
  console.log("WARNING: probe file was not restored exactly. Restoring from git is required.");
  process.exit(1);
}
