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
  "Security tool commands and flags",
  "MITRE ATT&CK technique identifiers",
  "Protocol and standard behaviour",
  "Registry paths, file paths and filenames",
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

// --- 0. NO class may hold a row with an empty verdict column unless it is
//        genuinely TRACKED as outstanding work.
//
// This is the check that was missing, and its absence let a whole class sit
// unverified while every other guard passed. "DNS record types" was marked
// `done: true` in split-claims.mjs with `doneThrough: 4` -- a figure carried over
// from the IT track, whose version of that class genuinely has 4 rows. The cyber
// version has 3 different rows, so they were never sent to anyone, were never
// counted in the DONE list below, and were never missed. The verifier reported
// "all 125 rows completed" and the totals stayed clean, because **an unverified
// class is simply absent from a list of verified classes.**
//
// That is D-038's failure mode: a record that cannot tell done from outstanding.
// Counting only the classes you remembered to list cannot catch a class you forgot.
//
// THE DISTINCTION THAT MATTERS. An empty verdict column is not automatically a
// bug. A class can be legitimately in flight -- its pack is on disk, waiting for a
// verifier -- and failing on that would make the guard useless during exactly the
// period it is needed. What must never happen is a class that is BOTH unverified
// AND marked finished. So the guard reads the splitter's own `done` flags:
//
//   * empty rows + `done: true`  -> FAIL. This is the bug. It is unreachable work.
//   * empty rows + not done      -> PASS, and report it as outstanding.
//   * no empty rows + `done`     -> PASS.
//
// Deriving "outstanding" from split-claims.mjs rather than from a list here is
// deliberate: a second hand-maintained list would drift from the first, which is
// how the class was lost in the first place.
let outstandingSections = new Set();
try {
  const sp = fs.readFileSync("scripts/split-claims.mjs", "utf8");
  const cyber = /cybersec:\s*\[([\s\S]*?)\n\s*\],/.exec(sp);
  if (!cyber) {
    problems.push("could not read the cybersec class list from scripts/split-claims.mjs");
  } else {
    for (const m of cyber[1].matchAll(/\{\s*title:\s*"([^"]+)"([^}]*)\}/g)) {
      if (!/done:\s*true/.test(m[2])) outstandingSections.add(m[1]);
    }
  }
} catch (e) {
  problems.push(`could not read scripts/split-claims.mjs: ${e.message}`);
}

{
  const bySection = new Map();
  let s = "";
  for (const l of lines) {
    const h = /^## (.+)/.exec(l);
    if (h) s = h[1].replace(/\s+$/, "");
    if (!ROW.test(l)) continue;
    if (!/\*\*(OK|WRONG|UNVERIFIABLE)\*\*/.test(l)) {
      if (!bySection.has(s)) bySection.set(s, []);
      bySection.get(s).push(l.trim().slice(0, 110));
    }
  }
  for (const [section, rs] of bySection) {
    const tracked = outstandingSections.has(section);
    if (tracked && !DONE.includes(section)) {
      console.log(`  OUTSTANDING (tracked, not a failure): "${section}" — ${rs.length} row(s) awaiting a verdict`);
      continue;
    }
    problems.push(
      `section "${section}" has ${rs.length} row(s) with an EMPTY verdict column` +
        (DONE.includes(section) ? " (and it is listed as done!)" : "") +
        (tracked ? "" : " and is not tracked as outstanding in split-claims.mjs") +
        `\n      first: ${rs[0]}`,
    );
  }
}

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
