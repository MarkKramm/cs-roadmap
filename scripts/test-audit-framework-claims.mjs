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

// For rules whose allow-list is satisfied by anything ANYWHERE in the file, the
// shared probe file is the wrong instrument: it already contains the words that
// satisfy the rule. This writes a throwaway file that contains ONLY the probe,
// so a per-file rule is genuinely exercised.
const ISOLATED = path.join(ROOT, "career-roadmaps", "cybersec-roadmap", "__probe-phase.md");

function controlIsolated(name, body, expectFail) {
  fs.writeFileSync(ISOLATED, body, "utf8");
  const code = runGuard();
  fs.unlinkSync(ISOLATED);
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

// --- withdrawn-publication citations ----------------------------------------
// These were live in the corpus: every one of these links RESOLVED, which is
// why audit-refs.mjs was happy with all three. A withdrawn document still
// serves HTTP 200. Resolution is not currency.
control(
  "cites withdrawn SP 800-61 Rev. 2",
  "- NIST SP 800-61 Rev. 2, Computer Security Incident Handling Guide — https://csrc.nist.gov/pubs/sp/800/61/r2/final",
  true,
);
control(
  "cites current SP 800-61 Rev. 3",
  "- NIST SP 800-61 Rev. 3, Incident Response Recommendations — https://csrc.nist.gov/pubs/sp/800/61/r3/final",
  false,
);
control(
  "cites withdrawn SP 800-50",
  "- NIST SP 800-50, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/final",
  true,
);
control(
  "cites current SP 800-50 Rev. 1",
  "- NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final",
  false,
);
control(
  "cites withdrawn SP 800-63-3",
  "- NIST SP 800-63C, Federation and Assertions — https://csrc.nist.gov/pubs/sp/800/63/3/final",
  true,
);
control(
  "cites current SP 800-63C Rev. 4",
  "- NIST SP 800-63C Rev. 4, Federation and Assertions — https://csrc.nist.gov/pubs/sp/800/63/c/4/final",
  false,
);

// --- OWASP Top 10 edition ----------------------------------------------------
// Six of ten categories moved number between 2021 and 2025, and SSRF lost its
// own entry. These controls pin BOTH directions -- and the "must pass" ones
// matter most, because the first version of this rule flagged the corrected
// headings (A04 Cryptographic failures is a 2021 pairing AND the right 2025
// heading, so a number-then-name match is not sufficient evidence of staleness).
control(
  "pins the OWASP Top 10 to the 2021 edition",
  "- OWASP Top 10 2021 in depth: A01 to A10",
  true,
);
control("calls SSRF A10", "| A10 | Server-side request forgery | was A10 |", true);
control(
  "teaches A02 as cryptographic failures (the 2021 pairing)",
  "#### A02 — Cryptographic failures",
  true,
);
control(
  "teaches A03 as injection (the 2021 pairing)",
  "#### A03 — Injection",
  true,
);
control(
  "teaches A09 as logging and monitoring (the 2021 name)",
  "#### A09 — Security logging and monitoring failures",
  true,
);
control(
  "CORRECT 2025 heading A04 Cryptographic failures",
  "#### A04 — Cryptographic failures",
  false,
);
control(
  "CORRECT 2025 heading A02 Security misconfiguration",
  "#### A02 — Security misconfiguration",
  false,
);
control(
  "CORRECT 2025 heading A03 Software supply chain failures",
  "#### A03 — Software supply chain failures",
  false,
);
control(
  "explaining the 2021 history is LEGITIMATE",
  "SSRF was its own Top 10 entry in 2021, and in 2025 it was folded into A01.",
  false,
);
control(
  "a 2021 mapping table row is LEGITIMATE",
  "| A04 | Cryptographic failures | was A02 |",
  false,
);

// --- SOC 2 edition -----------------------------------------------------------
// This rule is per-file: naming the edition ONCE is enough, and the earlier
// line-scoped version flagged all three mentions, which is the noise that
// teaches people to ignore a guard. These use the isolated probe because the
// shared probe file already contains the satisfying words.
controlIsolated(
  "describes the TSC with no edition anywhere in the file",
  "# probe\n\nSOC 2 is an attestation against the Trust Services Criteria produced by an auditor.\n",
  true,
);
controlIsolated(
  "names the edition once, even if later lines omit it",
  "# probe\n\nSOC 2 uses the 2017 Trust Services Criteria, revised 2022.\n\nThe Trust Services Criteria are the auditor's benchmark.\n",
  false,
);

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
