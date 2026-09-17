// Controls for audit-open-items.mjs.
//
// Control 1 is the real defect this guard was written from, restored to the file: the IT-gaps
// item as it read before the fix, with an unchecked box whose own next sentence said the
// re-verification had happened. If the guard cannot catch that, it cannot catch anything.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GUARD = "scripts/audit-open-items.mjs";
const TARGET = path.join(ROOT, "docs", "CHECKPOINT.md");

const SNAPSHOT = new Map();
const snapshot = (f) => {
  if (!SNAPSHOT.has(f)) SNAPSHOT.set(f, fs.readFileSync(f, "utf8"));
  return SNAPSHOT.get(f);
};
const original = snapshot(TARGET);

const run = () => {
  try {
    return { code: 0, out: execFileSync("node", [GUARD], { encoding: "utf8", cwd: ROOT }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") };
  }
};

const results = [];
const control = (name, mutate, expectFail, allowNoop = false) => {
  fs.writeFileSync(TARGET, original, "utf8");
  const mutated = mutate(original);
  if (mutated === original && !allowNoop) throw new Error(`fixture for "${name}" changed nothing`);
  fs.writeFileSync(TARGET, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    // Restore in `finally`, never from a process-level handler -- a process-level write is
    // what silently discarded an author's edit earlier in this session (D-062).
    fs.writeFileSync(TARGET, original, "utf8");
  }
  const failed = r.code !== 0;
  results.push({ name, ok: failed === expectFail, out: r.out });
};

// 1. Negative: the real repository must pass.
control("the real repository -> must PASS", (t) => t, false, true);

// 2. THE ACTUAL DEFECT, restored verbatim. This is the control that matters: the guard exists
//    because this exact sentence sat in CHECKPOINT.md for passes while reading as open.
control(
  "the real IT-gaps defect, restored -> must FAIL",
  (t) => {
    const defective =
      "- [ ] **The nine IT gaps are closed; the audit that found them is not fully re-verified.** `docs/IT-CONTENT-AUDIT.md` records four MISSING and five THIN topics, all now taught, and eleven suspected gaps it disproved. A second pass over the *new* text has now happened (see the closed item above), which is what this item was waiting on. What has still not happened is a check of the *market claim itself* against real postings.";
    // Replace whatever the current item is with the defective original.
    const re = /^- \[ \] \*\*The nine IT gaps[\s\S]*?(?=\n- \[)/m;
    if (!re.test(t)) throw new Error("control 2 fixture did not find the IT-gaps item");
    return t.replace(re, defective + "\n");
  },
  true,
);

// 3. The same shape with different wording, so the guard is not tuned to one sentence.
control(
  "an invented item in the same shape -> must FAIL",
  (t) => t.replace(/^(- \[ \] \*\*The acronym corpus report)/m, "- [ ] **The glossary is not yet written**, and the data extraction has now happened. $1"),
  true,
);

// 4. NEGATIVE: a legitimately open item that reports a TOOL's output. This is the false
//    positive the first draft produced against real text (CHECKPOINT.md:265), and it must
//    stay silent or the guard would be switched off.
control(
  "an open item reporting a tool's output -> must PASS",
  (t) => t.replace(/(- \[ \] \*\*The acronym corpus report still needs a human\*\*[^\n]*?)(\.)/, "$1 and the report now shows 274 terms$2"),
  false,
);

// 5. NEGATIVE: "X is closed; what remains open is Y" -- a correct restatement.
control(
  "an item that names what remains open -> must PASS",
  (t) => t.replace(/(- \[ \] \*\*The nine IT gaps[^\n]*?)(\.)/, "$1 The topic audit has now happened; what remains open is the market claim$2"),
  false,
);

// 6. A CLOSED box is not scanned at all -- closing an item is how the defect is fixed, and
//    flagging `[x]` text would make the fix impossible.
control(
  "a closed item with the same wording -> must PASS",
  (t) => t.replace(/^- \[ \] \*\*The nine IT gaps/m, "- [x] **The nine IT gaps are closed and not fully re-verified"),
  false,
);

const restored = fs.readFileSync(TARGET, "utf8") === original;
console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
console.log(`  CHECKPOINT.md restored byte-identical: ${restored}`);
const bad = results.filter((r) => !r.ok);
if (bad.length) {
  console.log("");
  for (const b of bad) console.log(b.out.split("\n").slice(-12).join("\n"));
}
const allClean = bad.length === 0 && restored;
console.log(allClean ? "ALL CONTROLS PASS" : `${bad.length} CONTROL(S) FAILED`);
process.exit(allClean ? 0 : 1);
