// Derive the completed-class totals from the recorded rows and check EVERY figure
// the document prints about them.
//
// WHY THIS IS A GUARD AND NOT A ONE-OFF
// The summary table was hand-written and wrong twice (83/40, then 70/53, against a
// real 75/48). Fixing it by hand produced three MORE wrong numbers in one pass: the
// command/cmdlet split (typed 55/5, actual 56/4) and the distinct-location figures
// (typed 183 locations / 187 rows, actual 182 / 183). Six wrong numbers in a document
// whose entire purpose is to be the trustworthy record of what was checked.
//
// **The problem was never the arithmetic. It was that a human was doing it.** So the
// guard re-derives every published figure, including the ones in prose, and fails on
// any disagreement.
import fs from "node:fs";

const lines = fs.readFileSync("docs/CYBER-CLAIM-VERIFICATION.md", "utf8").split("\n");
const ROW = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/;

const DONE = [
  "Standards, frameworks and control identifiers",
  "CVE identifiers and vulnerability claims",
  "Cryptography algorithm claims",
  "Product versions and editions",
  "Command and cmdlet usage",
];

let cls = "";
const per = new Map();
for (const l of lines) {
  const h = /^## (.+)/.exec(l);
  if (h) cls = h[1].replace(/\s+$/, "");
  if (!ROW.test(l)) continue;
  const v = /\*\*OK\*\*/.test(l) ? "OK" : /\*\*UNVERIFIABLE\*\*/.test(l) ? "UNV" : /\*\*WRONG\*\*/.test(l) ? "WRONG" : "empty";
  if (!DONE.includes(cls)) continue;
  if (!per.has(cls)) per.set(cls, { OK: 0, UNV: 0, WRONG: 0, empty: 0 });
  per.get(cls)[v]++;
}

let T = { OK: 0, UNV: 0, WRONG: 0, empty: 0 };
const rows = [];
for (const name of DONE) {
  const c = per.get(name) || { OK: 0, UNV: 0, WRONG: 0, empty: 0 };
  const n = c.OK + c.UNV + c.WRONG + c.empty;
  rows.push({ name, n, ...c });
  T.OK += c.OK; T.UNV += c.UNV; T.WRONG += c.WRONG; T.empty += c.empty;
}
const total = T.OK + T.UNV + T.WRONG + T.empty;

console.log("DERIVED from the rows:");
for (const r of rows) {
  console.log(`  | ${r.name} | ${r.n} | ${r.OK} | **${r.WRONG}** | ${r.UNV} |`);
}
console.log(`  | **Total** | **${total}** | **${T.OK}** | **${T.WRONG}** | **${T.UNV}** |`);
console.log("");

const doc = fs.readFileSync("docs/CYBER-CLAIM-VERIFICATION.md", "utf8");
const problems = [];

// --- 1. every class row in the summary table
for (const r of rows) {
  const re = new RegExp(
    `\\| ${r.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| (\\d+) \\| (\\d+) \\| \\*\\*(\\d+)\\*\\* \\| (\\d+) \\|`,
  );
  const mm = re.exec(doc);
  if (!mm) {
    problems.push(`no summary row found for "${r.name}"`);
    continue;
  }
  const [, n, ok2, wrong, unv] = mm.map(Number);
  if (n !== r.n || ok2 !== r.OK || wrong !== r.WRONG || unv !== r.UNV) {
    problems.push(
      `"${r.name}": doc says ${n}/${ok2}/${wrong}/${unv}, rows say ${r.n}/${r.OK}/${r.WRONG}/${r.UNV}`,
    );
  }
}

// --- 2. the summary Total row
const m = /\| \*\*Total\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/.exec(doc);
if (!m) {
  problems.push("could not find the summary Total row");
} else {
  const [, dRows, dOK, dWrong, dUnv] = m.map(Number);
  if (dRows !== total || dOK !== T.OK || dWrong !== T.WRONG || dUnv !== T.UNV) {
    problems.push(`Total: doc says ${dRows}/${dOK}/${dWrong}/${dUnv}, rows say ${total}/${T.OK}/${T.WRONG}/${T.UNV}`);
  }
}

// --- 3. the distinct-location figures, which live in PROSE and were wrong twice.
// A location can be cited by more than one class, so rows >= locations always.
const distinct = new Set();
for (const l of doc.split("\n")) {
  const rm = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/.exec(l);
  if (!rm || !/\*\*(OK|UNVERIFIABLE|WRONG)\*\*/.test(l)) continue;
  // Only count rows inside a completed class.
  distinct.add(`${rm[2]}:${rm[3]}`);
}
// Count only completed-class rows for the distinct figure.
let doneCls = "";
const distinctDone = new Set();
for (const l of doc.split("\n")) {
  const h = /^## (.+)/.exec(l);
  if (h) doneCls = h[1].replace(/\s+$/, "");
  if (!DONE.includes(doneCls)) continue;
  const rm = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/.exec(l);
  if (!rm || !/\*\*(OK|UNVERIFIABLE|WRONG)\*\*/.test(l)) continue;
  distinctDone.add(`${rm[2]}:${rm[3]}`);
}
const pm = /\*\*(\d+) distinct\s+locations fill (\d+) rows\.\*\*/.exec(doc);
if (!pm) {
  problems.push("could not find the distinct-locations sentence");
} else {
  const dLoc = Number(pm[1]);
  const dRow = Number(pm[2]);
  if (dLoc !== distinctDone.size || dRow !== total) {
    problems.push(
      `distinct-locations prose says ${dLoc} locations / ${dRow} rows, derived ${distinctDone.size} / ${total}`,
    );
  }
}

// --- 4. any row still unaccounted for in a completed class
if (T.empty !== 0) problems.push(`${T.empty} row(s) in completed classes have no verdict`);

if (problems.length) {
  console.log("MISMATCH — the document prints figures that disagree with its own rows:\n");
  for (const p of problems) console.log("  - " + p);
  console.log("\nFIX: correct the document, or correct the rows. Never edit the guard to agree.");
  process.exit(1);
}
console.log(`MATCH — every published figure agrees with the ${total} recorded rows.`);
console.log(`  classes checked : ${rows.length}`);
console.log(`  distinct locations: ${distinctDone.size}, filling ${total} rows`);
