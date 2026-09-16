// Guard: framework claims that are VERSION-DEPENDENT and have silently aged.
//
// WHY THIS EXISTS
// The cyber verification pass found a real defect that every existing guard
// passed over: cybersec phase 01 taught **five** NIST CSF functions
// (Identify, Protect, Detect, Respond, Recover) in a summary table, a numbered
// lesson section, an exit criterion, and a resource row. CSF 2.0 (2024) has
// **six** — it added Govern. NIST's own wording:
//
//   "This figure depicts the CSF Core as a hierarchy of six Functions, each of
//    which contains multiple Categories."
//   "The inner layer of the wheel contains only the Govern Function. The outer
//    layer, which surrounds the Govern circle, contains the other five
//    Functions."
//
// WHAT THE OTHER GUARDS COULD NOT SEE
//   lint-content    the markdown was perfect
//   audit-refs      the NIST URL resolved
//   audit-quiz      the quiz never mentioned the functions
//   audit-content   the structure was intact
//   AST diff        five functions parsed as cleanly as six
//   readability     the sentences were short
//   comprehension   a reader follows "five functions" without difficulty
//
// **Every one of those checks the text against ITSELF.** A document that says
// five functions consistently, cleanly, and readably is wrong in a way no
// self-consistency check can reach. The corpus even contradicted itself --
// phase 13 said six, correctly -- and nothing compared the two, because nothing
// compares one phase to another.
//
// THE SHAPE OF THIS CLASS
// A versioned external standard is summarised. The summary is accurate when
// written. The standard is revised. The summary silently becomes false, and
// nothing in the repository notices, because nothing in the repository knows
// what version the text was written against.
//
// This guard is deliberately NARROW and evidence-based: it checks claims whose
// current value was established by reading the standard, and it is meant to
// grow one entry at a time as more are verified. A broad "does this look
// stale" heuristic would flag correct content, and a guard that cries wolf
// teaches people to ignore it.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Each rule records: what is asserted, what it should be, the source that
// settles it, and the version the source is at.
const RULES = [
  {
    id: "csf-function-count",
    what: "NIST CSF function count",
    // The retired model. Two shapes, and BOTH must name five or omit Govern --
    // the first version of this rule also matched the bare running order
    // "Identify, Protect, Detect, Respond, Recover", which is a SUBSTRING of
    // the correct six-function list, so it flagged the corrected text. A guard
    // that flags correct content teaches people to ignore it, so the pattern
    // is anchored on the count word or on the list STARTING at Identify.
    forbid: [
      // "five functions" in a sentence that is about the functions
      /\bfive\s+(?:CSF\s+)?functions?\b/i,
      // a function list that begins at Identify and ends at Recover, with no
      // Govern anywhere on the line -- the shape of the retired table
      /^(?=[^\n]*\bIdentify\b)(?=[^\n]*\bRecover\b)(?![^\n]*\bGovern\b)[^\n]*$/i,
    ],
    // Explaining the history is LEGITIMATE and must not be flagged. A phase
    // that says "CSF 2.0 added Govern to the five functions of CSF 1.1" is
    // teaching the reader why they will see five elsewhere.
    allow: [
      /\bCSF 1\.1\b/,
      /\bold(?:er)?\s+(?:material|versions?|docs?)\b/i,
      /\bprevious(?:ly)?\b/i,
      /\badded\s+\*{0,2}Govern\*{0,2}\b/i,
      /\bbefore\s+Govern\b/i,
    ],
    correct: "six functions: Govern, Identify, Protect, Detect, Respond, Recover",
    source: "NIST CSWP 29 (CSF 2.0), https://doi.org/10.6028/NIST.CSWP.29",
    evidence: '"the CSF Core as a hierarchy of six Functions"',
  },
  {
    id: "owasp-top10-edition",
    what: "OWASP Top 10 edition",
    // OWASP's own project page: "The most current released version is the
    // OWASP Top 10 2025." and metadata "Latest Version 2025".
    // https://owasp.org/projects/top-ten
    //
    // This is not a cosmetic label change. Between 2021 and 2025 SIX of the ten
    // categories moved number and ONE was removed:
    //   2021 A02 Cryptographic Failures      -> 2025 A04
    //   2021 A03 Injection                   -> 2025 A05
    //   2021 A04 Insecure Design             -> 2025 A06
    //   2021 A05 Security Misconfiguration   -> 2025 A02
    //   2021 A06 Vulnerable/Outdated         -> 2025 A03 (renamed Supply Chain)
    //   2021 A10 SSRF                        -> folded into A01, no longer listed
    //   new 2025: A03 Software Supply Chain Failures, A10 Mishandling of
    //             Exceptional Conditions
    // So text that says "A10 — Server-side request forgery", or teaches A02 as
    // cryptographic failures, is wrong in a way a reader will repeat aloud.
    forbid: [
      /\bOWASP Top 10 2021\b[^\n]{0,40}\b(?:in depth|current|latest|A01 to A10)\b/i,
      /\bA10\b[^\n]{0,40}\b(?:Server-Side Request Forgery|SSRF)\b/i,
      // The 2021 PAIRINGS only. "A04 — Cryptographic failures" is a 2021
      // pairing AND the correct 2025 heading, so a bare number-then-name match
      // flags correct text -- it did, on the newly-renumbered sections. The
      // guard therefore anchors on the pairs that are UNIQUELY 2021: a number
      // whose 2025 occupant is a different category entirely.
      /\bA02\b[^\n]{0,30}\bcryptographic failures\b/i,
      /\bA03\b[^\n]{0,30}\b(?:injection|vulnerable and outdated)\b/i,
      /\bA04\b[^\n]{0,30}\binsecure design\b/i,
      /\bA05\b[^\n]{0,30}\bsecurity misconfiguration\b/i,
      /\bA06\b[^\n]{0,30}\bvulnerable and outdated components\b/i,
      /\bA07\b[^\n]{0,30}\bidentification and authentication failures\b/i,
      /\bA09\b[^\n]{0,30}\blogging and monitoring failures\b/i,
    ],
    allow: [
      /\b2021\b[^\n]{0,60}\b(?:edition|still widely|superseded|previous|older)\b/i,
      /\bwas A0\d\b/i,
      /\bno longer\b/i,
      /\bfolded into\b/i,
    ],
    correct: "OWASP Top 10:2025 is current; SSRF is folded into A01 and is no longer its own entry",
    source: "https://owasp.org/projects/top-ten and https://raw.githubusercontent.com/OWASP/Top10/master/2025/docs/en/index.md",
    evidence: '"The most current released version is the OWASP Top 10 2025."',
  },
  {
    id: "soc2-tsc-edition",
    what: "SOC 2 Trust Services Criteria described without any edition",
    // AICPA's title is "2017 Trust Services Criteria ... (With Revised Points of
    // Focus — 2022)". Naming no edition ANYWHERE is the defect; repeating the
    // year in every sentence is not required, and an earlier version of this
    // rule flagged all three mentions, which is exactly the noise that teaches
    // people to ignore a guard.
    //
    // So this fires only when the phrase appears with NO year anywhere in the
    // same file. One `2017` or `revised 2022` anywhere satisfies it.
    perFile: true,
    forbid: [/\bTrust Services Criteria\b/i],
    allow: [/\b(?:19|20)\d\d\b/, /\brevised\b/i, /\brevised 2022\b/i],
    correct: "name the edition once: the 2017 Trust Services Criteria, revised 2022",
    source: "AICPA, https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022",
    evidence: '"2017 Trust Services Criteria ... (With Revised Points of Focus — 2022)"',
  },
  {
    id: "cis-control-count",
    what: "CIS Critical Security Controls count and terminology",
    // Two separate errors are possible here, and the curriculum had one:
    //   1. a retired COUNT -- v7 had 20 controls, v8 has 18
    //   2. the wrong NOUN -- CIS has 18 CONTROLS, each holding many
    //      SAFEGUARDS. "18 safeguards" conflates the two levels.
    // CIS's own wording, from https://www.cisecurity.org/controls/cis-controls-list:
    //   heading "The 18 CIS Critical Security Controls"
    //   and https://www.cisecurity.org/controls/v8-1 calls them
    //   "a prioritized set of CIS Safeguards".
    forbid: [
      /\bCIS\b[^.\n]{0,40}\b(?:15|17|20)\s+(?:Controls?|safeguards?)\b/i,
      /\b(?:15|17|20)\s+(?:CIS\s+)?(?:Controls?|safeguards?)\b/i,
      // "18 safeguards" / "eighteen safeguards" -- the level confusion
      /\b(?:18|eighteen)\s+(?:CIS\s+)?safeguards?\b/i,
    ],
    allow: [/\bv8\b/, /\bv7\b/, /\bv8\.1\b/, /\bversion\s+\d\b/i, /\bSafeguards?\s+\d/i, /\bIG[123]\b/],
    correct: "CIS Controls v8.1 has 18 Controls, each containing numbered Safeguards",
    source: "https://www.cisecurity.org/controls/cis-controls-list and /controls/v8-1",
    evidence: '"The 18 CIS Critical Security Controls"; v8 is "a prioritized set of CIS Safeguards"',
  },
  {
    id: "cis-version",
    what: "CIS Controls version stated as current",
    // v8.1 superseded v8; the differences are the CSF 2.0 realignment and the
    // added Govern function. Naming v8 as current is a mild staleness, so this
    // only fires when v8 is called CURRENT rather than merely referenced.
    forbid: [/\bCIS Controls v8\b(?![.\d])[^.\n]{0,40}\b(?:current|latest|newest)\b/i],
    allow: [/\bv8\.1\b/, /\bv8\.0\b/],
    correct: "the current version is CIS Controls v8.1",
    source: "https://www.cisecurity.org/controls/v8-1",
    evidence: '"CIS Controls v8.1 is an iterative update to v8"',
  },
  {
    id: "pci-mfa-scope",
    what: "PCI DSS MFA scope",
    // The UNDERSTATEMENT shape: correct requirement number, scope narrower
    // than the actual rule. PCI DSS v4.0 Requirement 8 requires MFA for ALL
    // access into the cardholder data environment, not only remote access.
    // PCI SSC's own words (blog, "Just Published: PCI DSS v4.0.1", 11 Jun 2024):
    //   "Added an Applicability Note that multi-factor authentication for all
    //    (non-administrative) access into the CDE does not apply to user
    //    accounts that are only authenticated with phishing-resistant
    //    authentication factors."
    // "On all remote access" is the v3.2.1 rule, and describing it that way
    // understates what an assessor tests. This fires only when PCI DSS is
    // named on the same line, so an org's own sample policy -- which may quite
    // correctly choose remote-access scope -- is not flagged.
    forbid: [
      /(?:PCI(?:\s+DSS)?|cardholder|CDE)[^\n]{0,120}\bMFA\b[^\n]{0,40}\bremote access\b/i,
      /\bMFA\b[^\n]{0,60}\bremote access\b[^\n]{0,120}(?:PCI(?:\s+DSS)?|cardholder|\bCDE\b)/i,
      /remote access[^\n]{0,80}PCI DSS requirement 8/i,
    ],
    allow: [/\ball access into the CDE\b/i, /\bwherever card data\b/i, /\bv3\.2\.1\b/i, /\bphishing-resistant\b/i],
    correct: "PCI DSS v4.0 Req 8 requires MFA for all access into the CDE, with a phishing-resistant carve-out",
    source: "PCI SSC blog, 11 Jun 2024, https://blog.pcisecuritystandards.org/just-published-pci-dss-v4-0-1",
    evidence: '"multi-factor authentication for all (non-administrative) access into the CDE"',
  },
  {
    id: "sp800-61-revision",
    what: "SP 800-61 revision cited",
    // Rev. 2 was withdrawn 2025-04-03 and superseded by Rev. 3, verified at
    // https://csrc.nist.gov/pubs/sp/800/61/r2/final. The STAGE NAMES the lesson
    // teaches did not change -- Rev. 3 restates them as the "previous life
    // cycle model" and maps each onto CSF 2.0 -- so this rule checks the
    // CITATION, not the content. A reader following the old link lands on a
    // retired document.
    forbid: [/sp\/800\/61\/r2\/final/i, /\bSP 800-61 Rev\.? 2\b/i],
    allow: [/Rev\.?\s*3/i, /\bprevious\b/i, /\bsuperseded\b/i, /\bwithdrawn\b/i],
    correct: "SP 800-61 Rev. 3 (April 2025), https://csrc.nist.gov/pubs/sp/800/61/r3/final",
    source: "https://csrc.nist.gov/pubs/sp/800/61/r2/final — \"Withdrawn on April 03, 2025. Superseded by SP 800-61 Rev. 3\"",
    evidence: "Rev. 3 Table 1 restates the Rev. 2 phases and maps them to CSF 2.0",
  },
  {
    id: "sp800-50-revision",
    what: "SP 800-50 revision cited",
    forbid: [/sp\/800\/50\/final/i, /\bSP 800-50\b(?![ \u2014-]*Rev)/i],
    allow: [/Rev\.?\s*1/i, /\bwithdrawn\b/i, /\bsuperseded\b/i],
    correct: "SP 800-50 Rev. 1, https://csrc.nist.gov/pubs/sp/800/50/r1/final",
    source: "https://csrc.nist.gov/pubs/sp/800/50/final — \"Withdrawn on September 12, 2024. Superseded by SP 800-50 Rev. 1\"",
    evidence: "the withdrawn page names Rev. 1 as its replacement",
  },
  {
    id: "sp800-63-revision",
    what: "SP 800-63 digital identity revision cited",
    // 63-3 was withdrawn 2017-12-01; the current series is 63-4 (July 2025),
    // whose volumes are 63A/63B/63C.
    forbid: [/sp\/800\/63\/3\/final/i, /\bSP 800-63-3\b/i],
    allow: [/\bRev\.?\s*4\b/i, /63\/[abc]\/4/i, /\bwithdrawn\b/i, /\bsuperseded\b/i],
    correct: "SP 800-63 Rev. 4 (July 2025), e.g. https://csrc.nist.gov/pubs/sp/800/63/c/4/final",
    source: "https://csrc.nist.gov/pubs/sp/800/63/3/final — \"Withdrawn on December 01, 2017\"; 63-4 published July 2025",
    evidence: "SP 800-63-4 supersedes SP 800-63-3 (03/02/2020)",
  },
];

// Framework-claim detection is about CONTENT, and content lives in the
// curriculum. docs/ is meta-documentation: it QUOTES retired claims on purpose
// when recording what was fixed, as DECISIONS.md and CHECKPOINT.md now do. A
// guard that flags the changelog entry describing the bug is noise of the worst
// kind, because it punishes writing the defect down.
//
// So docs/ is scanned for nothing. The class lives in career-roadmaps/.
function targets() {
  const out = [];
  for (const track of ["cybersec-roadmap", "it-roadmap", "advance-roadmap"]) {
    const dir = path.join(ROOT, "career-roadmaps", track);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) out.push(path.join(dir, f));
    }
  }
  return out;
}

const findings = [];
let scanned = 0;

for (const file of targets()) {
  const rel = path.relative(ROOT, file);
  // Skip the generated worklists: they QUOTE the old text by design.
  if (/CLAIM-VERIFICATION|claims-to-verify/.test(rel)) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  const whole = lines.join("\n");
  scanned++;
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      // A per-file rule is satisfied by the edition being named ANYWHERE in the
      // document, so a file that says "2017 Trust Services Criteria (revised
      // 2022)" once is clean even though three later mentions omit the year.
      // Line-scoped behaviour for such a rule would flag every mention, which
      // is noise, and noise teaches people to ignore the guard.
      const scope = rule.perFile ? whole : line;
      if (rule.allow.some((a) => a.test(scope))) continue;
      for (const re of rule.forbid) {
        if (re.test(line)) {
          findings.push({
            file: rel,
            line: i + 1,
            rule: rule.id,
            what: rule.what,
            text: line.trim().slice(0, 120),
            correct: rule.correct,
            source: rule.source,
            evidence: rule.evidence,
          });
          break;
        }
      }
    }
  });
}

console.log("");
if (findings.length) {
  console.log(`STALE FRAMEWORK CLAIMS — ${findings.length} finding(s)`);
  console.log("");
  for (const f of findings) {
    console.log(`  ${f.file}:${f.line}`);
    console.log(`    ${f.what} — the text asserts a retired value`);
    console.log(`    text:    ${f.text}`);
    console.log(`    correct: ${f.correct}`);
    console.log(`    source:  ${f.source}`);
    console.log(`    evidence: ${f.evidence}`);
    console.log("");
  }
  process.exit(1);
}
console.log(
  `FRAMEWORK CLAIMS OK — ${scanned} file(s) scanned against ${RULES.length} versioned rule(s); ` +
    `no retired value asserted.`,
);
console.log("");
