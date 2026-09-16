// Controls for scripts/audit-quiz-owasp.mjs.
//
// The guard exists because the 2021->2025 OWASP renumbering moved six of ten
// categories. A quiz is a special case: a stale LESSON misinforms a reader, but
// a stale ANSWER KEY tells a learner they are WRONG for being right, which is
// the worst outcome in a self-study curriculum.
//
// The whole difficulty is that the guard must be narrow. Its first form searched
// all text after "## Quiz" and produced two false positives:
//   1. a Checklist section that FOLLOWS the quiz
//   2. "A10" matching inside a networking question about port 445
// So the controls below pin both the two detections and the two non-detections.
//
// Probe strategy: write a whole scratch quiz file, run the guard, remove it.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-quiz-owasp.mjs");
const PROBE = path.join(ROOT, "career-roadmaps", "cybersec-roadmap", "__quiz-probe.md");

function runGuard() {
  try {
    // cwd is EXPLICIT. The guard resolves its target list from
    // import.meta.dirname, which is stable, but the probe is written relative
    // to ROOT -- and without an explicit cwd the child inherits the caller's,
    // which made every "must fail" control pass silently. A control that
    // cannot fail is worse than no control.
    execFileSync(process.execPath, [GUARD], { cwd: ROOT, encoding: "utf8", stdio: "pipe" });
    return 0;
  } catch (e) {
    return e.status ?? 1;
  }
}

const results = [];

function control(name, quiz, expectFail) {
  fs.writeFileSync(PROBE, quiz, "utf8");
  const code = runGuard();
  fs.unlinkSync(PROBE);
  const failed = code !== 0;
  results.push({ name, expectFail, failed, ok: failed === expectFail });
}

const head = "# probe phase\n\n## Quiz\n\n";

// --- must fail: a numbered OWASP category in an answer ----------------------
control(
  "question binds a number to a category name",
  head +
    '### Q1. Which category covers SQL injection? <!-- id: p-q01 energy: low -->\n\n' +
    "- [x] A03 Injection\n- [ ] A01 Broken access control\n- [ ] A05 Security misconfiguration\n- [ ] A02 Cryptographic failures\n\n" +
    "**Why:** Injection is its own category.\n",
  true,
);
control(
  "question binds a number to SSRF",
  head +
    "### Q1. What does A10 cover? <!-- id: p-q01 energy: low -->\n\n" +
    "- [x] Server-side request forgery\n- [ ] Injection\n- [ ] Insecure design\n- [ ] Logging failures\n\n" +
    "**Why:** A10 was SSRF in 2021.\n",
  true,
);
control(
  "question names a misconfiguration number",
  head +
    "### Q1. Which number is security misconfiguration? <!-- id: p-q01 energy: low -->\n\n" +
    "- [x] A05 Security misconfiguration\n- [ ] A01 Broken access control\n- [ ] A03 Injection\n- [ ] A06 Insecure design\n\n" +
    "**Why:** In 2021 it was A05.\n",
  true,
);

// --- must pass: the two real false positives, and clean quizzes -------------
control(
  "a Checklist section after the quiz is NOT part of the quiz",
  head +
    "### Q1. What is a threat? <!-- id: p-q01 energy: low -->\n\n" +
    "- [x] A worm\n- [ ] A database\n- [ ] A firewall\n- [ ] A policy\n\n" +
    "**Why:** A worm spreads by itself.\n\n" +
    "## Checklist\n\n- [ ] I summarized OWASP Top 10. <!-- id: p-c05 energy: normal -->\n",
  false,
);
control(
  "'A10' inside a networking answer about a port is not a category",
  head +
    "### Q1. What does port 445 carry? <!-- id: p-q01 energy: normal -->\n\n" +
    "- [x] SMB, which carries Windows file and printer sharing\n- [ ] RDP\n- [ ] IMAP\n- [ ] SSH\n\n" +
    "**Why:** 445 is SMB. A10 is not a category reference here, and injection is unrelated.\n",
  false,
);
control(
  "a question mentioning OWASP Top 10 by name only",
  head +
    "### Q1. What is the OWASP Top 10? <!-- id: p-q01 energy: low -->\n\n" +
    "- [x] An awareness document about web risks\n- [ ] A certification\n- [ ] A law\n- [ ] A scanner\n\n" +
    "**Why:** It is an awareness document, not a standard.\n",
  false,
);
control(
  "a question naming a category with no number",
  head +
    "### Q1. Which bug lets a user read another user's invoice? <!-- id: p-q01 energy: normal -->\n\n" +
    "- [x] Broken access control\n- [ ] Injection\n- [ ] Insecure design\n- [ ] Misconfiguration\n\n" +
    "**Why:** Authorisation was never checked.\n",
  false,
);
control(
  "a quiz with no OWASP content at all",
  head +
    "### Q1. What is a CVE? <!-- id: p-q01 energy: low -->\n\n" +
    "- [x] An identifier for a published vulnerability\n- [ ] A score\n- [ ] A tool\n- [ ] A vendor\n\n" +
    "**Why:** It names one vulnerability.\n",
  false,
);

console.log("");
console.log("Quiz OWASP-answer-key controls");
console.log("=".repeat(66));
for (const r of results) {
  const want = r.expectFail ? "must fail" : "must pass";
  console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(52)} (${want})`);
}
const bad = results.filter((r) => !r.ok);
console.log("");
if (bad.length) {
  console.log(`${bad.length} control(s) failed.`);
  process.exit(1);
}
console.log(`All ${results.length} controls behaved as documented.`);
console.log("");

// Leave no probe behind.
if (fs.existsSync(PROBE)) {
  fs.unlinkSync(PROBE);
  console.log("WARNING: a probe file was left behind and has been removed.");
  process.exit(1);
}
