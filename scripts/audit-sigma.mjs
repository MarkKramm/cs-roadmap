// Guard: every Sigma rule example in the corpus must satisfy the Sigma
// specification's own schema constraints.
//
// WHY THIS EXISTS
// An external claim-verification pass over the advance track found seven
// instances of two defects, and **every existing guard passed over all seven**.
// That is the point, not a footnote — this repository's guards test internal
// consistency (does the parser lose content, do cross-references resolve, does
// a table sum to what the prose says) and the comprehension passes test whether
// a beginner can follow the text. Neither can see a rule that is internally
// coherent, clearly written, and invalid.
//
//   1. `date: 2026/03/14` and `modified: 2026/03/14` in six places. The spec
//      mandates ISO 8601 with dashes, and the normative JSON schema constrains
//      the value with a regex that slashes cannot match.
//   2. `status: production` in one place. The spec permits exactly five values —
//      stable, test, experimental, deprecated, unsupported — and `production` is
//      not among them. Phase 07 line 304 *teaches* those five values, so the
//      corpus contradicted its own teaching and no guard noticed.
//
// The second defect is the instructive one. It is not rot and it is not a typo
// an author would have spotted: the value is the intuitive English word for
// what the author meant, and it means nothing to the specification. That is the
// shape of error this guard exists to make impossible to reintroduce silently.
//
// WHY NO NETWORK
// Both constraints are readable straight out of the specification's own JSON
// schema, and the values below are transcribed from it. The guard therefore
// runs in CI with nothing to fetch, and it cannot fail because a vendor site
// was slow — which is why `verify-ports.mjs` is deliberately not in CI and this
// one is. Source:
//   https://github.com/SigmaHQ/sigma-specification
//   json-schema/sigma-detection-rule-schema.json
//   and the field tables in specification/sigma-rules-specification.md
//
// WHAT IT DELIBERATELY DOES NOT CHECK
// Whether a rule is a *good* rule. The three values below are the only ones the
// specification constrains, and a guard that flagged a well-formed rule for
// being un-tuned would be ignored within a week — a guard that flags valid
// usage is worse than no guard, because it teaches people to disable it.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

// The specification's own values. Kept here as literals, deliberately, rather
// than fetched: a guard whose pass/fail depends on a network round-trip is a
// guard that one day fails for a reason unrelated to the content, and this
// repository has already recorded that lesson (verify-ports.mjs is not in CI
// for exactly this reason).
const STATUS_VALUES = new Set(["stable", "test", "experimental", "deprecated", "unsupported"]);
const LEVEL_VALUES = new Set(["informational", "low", "medium", "high", "critical"]);

// The schema's own pattern, transcribed:
//   "pattern": "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$"
const ISO_DATE = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

// A Sigma rule example is a block of `key: value` lines. Rather than parse YAML
// (which would mean a dependency, and this repository keeps the content side
// dependency-free), the guard looks for the keys the schema constrains wherever
// they appear at the start of a line inside a fenced block or under one. The
// keys are specific enough that a prose line beginning "status: " is a rule
// example by any reading.
const FIELDS = {
  date: (v) => (ISO_DATE.test(v) ? null : `\`${v}\` is not ISO 8601 with dashes; the spec and the schema's own regex require YYYY-MM-DD`),
  modified: (v) => (ISO_DATE.test(v) ? null : `\`${v}\` is not ISO 8601 with dashes; the spec and the schema's own regex require YYYY-MM-DD`),
  status: (v) => (STATUS_VALUES.has(v) ? null : `\`${v}\` is not one of the five permitted values (${[...STATUS_VALUES].join(", ")})`),
  level: (v) => (LEVEL_VALUES.has(v) ? null : `\`${v}\` is not one of the five permitted values (${[...LEVEL_VALUES].join(", ")})`),
};

// A PLACEHOLDER IS NOT A CLAIM, and the distinction is load-bearing.
//
// The corpus writes rule examples as templates: `author: Your Name` appears in
// several of them. A date written `<date>` or `YYYY-MM-DD` is the same kind of
// value — a slot for the reader to fill — and failing it would be the guard
// inventing a claim that nobody made. That is the failure mode every rule in
// this repository is written to avoid, and a control suite asserts it.
//
// The check is deliberately narrow: angle brackets, or a value that opens with
// a literal `YYYY`/`TODO`/`TBD`. Anything that merely LOOKS like a date but is
// wrong (`2026/03/14`, `2026-13-14`) is still a defect, because it is a date
// somebody wrote.
const PLACEHOLDER = /[<>]|^(?:YYYY|yyyy|TODO|TBD)\b/;

const KEY = Object.keys(FIELDS).join("|");
const RE = new RegExp(`^\\s*(${KEY})\\s*:\\s*["']?([^"'\\s#]+)`);

const findings = [];
let blocks = 0;
let checked = 0;

function walk(dir, onFile) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, onFile);
    else if (/^\d\d-.*\.md$/.test(e.name)) onFile(p);
  }
}

for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  walk(dir, (file) => {
    const rel = path.relative(ROOT, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    let inFence = false;
    let sawTitle = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(?:```|~~~)/.test(line)) {
        inFence = !inFence;
        continue;
      }
      // A rule block is recognised by its `title:`, which the schema makes
      // mandatory. Counting them is what lets the guard report "checked N rule
      // blocks" — a number a reader can compare against the number of rules in
      // the corpus, rather than a silence.
      if (/^\s*title\s*:\s*\S/.test(line)) {
        blocks++;
        sawTitle = true;
      }
      if (!sawTitle) continue;

      const m = RE.exec(line);
      if (!m) continue;
      const [, key, value] = m;
      if (PLACEHOLDER.test(value)) continue;
      checked++;
      const problem = FIELDS[key](value);
      if (problem) findings.push({ where: `${rel}:${i + 1}`, key, value, problem, inFence });
      // `logsource` and `detection` start the interesting part of a rule and
      // nothing after them is another top-level metadata field, so the scan
      // stops there rather than leaking into a later unrelated block.
      if (/^\s*(?:logsource|detection)\s*:/.test(line)) sawTitle = false;
    }
  });
}

console.log("Sigma rule fields against the specification's own schema");
console.log("-".repeat(70));
console.log(`rule blocks found      : ${blocks}`);
console.log(`constrained fields read: ${checked}`);

if (!findings.length) {
  console.log("");
  console.log(
    `OK — every date, modified, status and level in a rule block is one the specification permits.`,
  );
  process.exit(0);
}

console.log("");
console.log(`${findings.length} field(s) the Sigma specification does not permit:`);
console.log("");
for (const f of findings) {
  console.log(`  ${f.where}${f.inFence ? "  (inside a code block — meant to be copy-pasted)" : ""}`);
  console.log(`    ${f.key}: ${f.value}`);
  console.log(`    ${f.problem}`);
}
console.log("");
console.log("Source: json-schema/sigma-detection-rule-schema.json in SigmaHQ/sigma-specification.");
console.log("Fix the value, or delete the field — the specification makes none of these four required");
console.log("except within a rule's detection block, so removing an invented one is a valid repair.");
process.exit(1);
