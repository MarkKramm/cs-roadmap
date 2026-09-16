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
    id: "cis-control-count",
    what: "CIS Critical Security Controls count",
    // The retired counts: v7 had 20 controls, and 15/17 are simply wrong.
    // "CIS" may come before OR after the number -- "CIS Controls provides 20
    // controls" and "20 CIS Controls" are both real phrasings, and an earlier
    // version of this rule required CIS first, so it missed the first shape.
    // The control test caught that, which is why the test exists.
    forbid: [
      /\bCIS\b[^.\n]{0,40}\b(?:15|17|20)\s+(?:Controls?|safeguards?)\b/i,
      /\b(?:15|17|20)\s+(?:CIS\s+)?(?:Controls?|safeguards?)\b/i,
    ],
    allow: [/\bv8\b/, /\bv7\b/, /\bversion\s+\d\b/i],
    correct: "CIS Controls v8 has 18 controls",
    source: "CIS Critical Security Controls v8, https://www.cisecurity.org/controls",
    evidence: "v8 restructured the former 20 controls into 18",
  },
];

// Framework-claim files only. Scanning the whole corpus for a phrase this
// specific would be noise; these are the files that summarise external
// standards, which is where the class lives.
function targets() {
  const out = [];
  for (const track of ["cybersec-roadmap", "it-roadmap", "advance-roadmap"]) {
    const dir = path.join(ROOT, "career-roadmaps", track);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) out.push(path.join(dir, f));
    }
  }
  for (const f of fs.readdirSync(path.join(ROOT, "docs"))) {
    if (f.endsWith(".md")) out.push(path.join(ROOT, "docs", f));
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
  scanned++;
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.allow.some((a) => a.test(line))) continue;
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
