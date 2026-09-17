// Derive the completed-class totals from the recorded rows and print the exact
// summary-table line, so the doc's figures can be checked without hand-counting.
import fs from "node:fs";

const lines = fs.readFileSync("docs/CYBER-CLAIM-VERIFICATION.md", "utf8").split("\n");
const ROW = /^\|\s*(\d+)\s*\|\s*`([^`]+?):(\d+)`\s*▶?\s*\|/;

const DONE = [
  "Standards, frameworks and control identifiers",
  "CVE identifiers and vulnerability claims",
  "Cryptography algorithm claims",
  "Product versions and editions",
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

// Now read what the doc's summary table actually says.
const doc = fs.readFileSync("docs/CYBER-CLAIM-VERIFICATION.md", "utf8");
const m = /\| \*\*Total\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/.exec(doc);
if (!m) {
  console.log("could not find the summary Total row");
  process.exit(1);
}
const [, dRows, dOK, dWrong, dUnv] = m.map(Number);
console.log(`doc summary says: rows=${dRows} OK=${dOK} WRONG=${dWrong} UNV=${dUnv}`);
const good = dRows === total && dOK === T.OK && dWrong === T.WRONG && dUnv === T.UNV && T.empty === 0;
console.log(good ? "MATCH — summary agrees with the rows." : "MISMATCH.");
process.exit(good ? 0 : 1);
