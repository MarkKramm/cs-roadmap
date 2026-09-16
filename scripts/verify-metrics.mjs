// Tier-1 verification: IT 06's worked service-desk metrics, recomputed from the
// phase's own ticket table.
//
// The phase asks the reader to compute five numbers by hand and then prints the
// answers with the arithmetic. That makes it checkable without any external
// source — the table in the file is the input, the prose is the claim, and
// recomputation settles it exactly. The failure mode this catches is the one
// that has bitten this repository before: a worked example whose stated answer
// does not follow from its own data, so a reader who computes correctly
// concludes they are wrong.
//
// Run: node scripts/verify-metrics.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FILE = path.join(ROOT, "career-roadmaps", "it-roadmap", "06-phase-tools-and-ticketing.md");
const text = fs.readFileSync(FILE, "utf8");

const findings = [];
let checks = 0;
function ok(cond, label, detail) {
  checks++;
  if (!cond) findings.push(label + (detail ? " — " + detail : ""));
}

// --- the table, as the phase prints it -------------------------------------
// Parsed from the file rather than hard-coded, so if the phase's data changes
// this fails loudly instead of silently checking a table that no longer exists.
const rowRe =
  /^\|\s*(INC-\d+)\s*\|\s*((?:Mon|Tue|Wed|Thu|Fri) \d{2}:\d{2})\s*\|\s*((?:Mon|Tue|Wed|Thu|Fri) \d{2}:\d{2}|—)\s*\|\s*((?:Mon|Tue|Wed|Thu|Fri) \d{2}:\d{2}|—)\s*\|\s*(Yes|No)\s*\|\s*([A-Za-z ]+?)\s*\|/;

const rows = [];
let inTable = false;
for (const line of text.split("\n")) {
  if (/^\|\s*Ticket\s*\|/.test(line)) {
    inTable = true;
    continue;
  }
  if (inTable && !/^\|/.test(line)) {
    inTable = false;
    continue;
  }
  const m = rowRe.exec(line);
  if (m) {
    rows.push({
      id: m[1],
      opened: m[2],
      firstResponse: m[3],
      resolved: m[4],
      reopened: m[5] === "Yes",
      status: m[6].trim(),
    });
  }
}

console.log("TIER 1 — IT 06 service-desk metrics, recomputed\n");
console.log(`  parsed ${rows.length} ticket rows from ${path.basename(FILE)}`);

if (rows.length < 10) {
  console.log(`\nTIER 1 FAILED — expected 10 ticket rows, parsed ${rows.length}.`);
  console.log("The table shape changed; this check needs updating before it means anything.");
  process.exit(1);
}

const DAY = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };
const toMinutes = (s) => {
  const m = /^(Mon|Tue|Wed|Thu|Fri) (\d{2}):(\d{2})$/.exec(s);
  if (!m) return null;
  return DAY[m[1]] * 1440 + Number(m[2]) * 60 + Number(m[3]);
};
const emDash = (v) => v === "—" || v == null;

const openMins = rows.map((r) => toMinutes(r.opened));
const frMins = rows.map((r) => (emDash(r.firstResponse) ? null : toMinutes(r.firstResponse)));
const resMins = rows.map((r) => (emDash(r.resolved) ? null : toMinutes(r.resolved)));

// 1. Mean first response, over tickets that HAVE a first response.
const frGaps = rows.map((r, i) => (frMins[i] == null ? null : frMins[i] - openMins[i])).filter((x) => x != null);
const frSum = frGaps.reduce((a, b) => a + b, 0);
const frMean = frSum / frGaps.length;
console.log(`\n  first-response gaps : ${frGaps.join(", ")}`);
console.log(`  sum ${frSum}, mean ${frMean.toFixed(1)}   (prose: 245 / 27.2)`);
ok(frSum === 245, "first-response total", `recomputed ${frSum}, prose says 245`);
ok(Math.abs(frMean - 27.2) < 0.05, "mean first response", `recomputed ${frMean.toFixed(2)}, prose says 27.2`);
ok(frGaps.length === 9, "tickets with a response", `recomputed ${frGaps.length}, prose says nine`);

// 2. Mean time to resolve, over CLOSED tickets only.
const closed = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.status === "Closed");
const resGaps = closed.map(({ i }) => resMins[i] - openMins[i]);
const resSum = resGaps.reduce((a, b) => a + b, 0);
const resMean = resSum / resGaps.length;
console.log(`  resolution times    : ${resGaps.join(", ")}`);
console.log(
  `  sum ${resSum}, mean ${resMean.toFixed(2)} = ${(resMean / 60).toFixed(1)}h   (prose: 2950 / 368.75 / 6.1h)`,
);
ok(resSum === 2950, "resolution total", `recomputed ${resSum}, prose says 2950`);
ok(Math.abs(resMean - 368.75) < 0.01, "MTTR", `recomputed ${resMean.toFixed(2)}, prose says 368.75`);
ok(closed.length === 8, "closed tickets", `recomputed ${closed.length}, prose says eight`);

// 3. Reopen rate, over closed tickets only.
const reopened = closed.filter(({ r }) => r.reopened).length;
const reopenRate = (reopened / closed.length) * 100;
console.log(`  reopen rate         : ${reopened}/${closed.length} = ${reopenRate}%   (prose: 2/8 = 25%)`);
ok(reopened === 2, "reopened ticket count", `recomputed ${reopened}, prose says two`);
ok(reopenRate === 25, "reopen rate", `recomputed ${reopenRate}%, prose says 25%`);

// 4. First contact resolution: response-to-resolution gap within 15 minutes.
//    The phase is explicit that this measures response -> resolution, NOT from
//    the open time, and says the boundary case (exactly 15) passes.
const fcr = closed.filter(({ i }) => {
  const f = frMins[i];
  const r = resMins[i];
  return f != null && r != null && r - f <= 15;
});
const fcrRate = (fcr.length / closed.length) * 100;
console.log(`  FCR (resp->res <=15): ${fcr.map(({ r }) => r.id).join(", ")} = ${fcr.length}/${closed.length} = ${fcrRate}%`);
console.log(`  prose says          : INC-105, INC-106, INC-108 = 3/8 = 38%`);
ok(fcr.length === 3, "FCR count", `recomputed ${fcr.length}, prose says three`);
ok(
  ["INC-105", "INC-106", "INC-108"].every((id) => fcr.some(({ r }) => r.id === id)),
  "FCR membership",
  `recomputed ${fcr.map(({ r }) => r.id).join(", ")}, prose names INC-105, INC-106, INC-108`,
);
// The boundary case the phase warns about: INC-108 is exactly 15 and must pass.
{
  const i108 = rows.findIndex((r) => r.id === "INC-108");
  ok(
    resMins[i108] - frMins[i108] === 15,
    "INC-108 is the exactly-15 boundary case",
    `recomputed gap ${resMins[i108] - frMins[i108]}`,
  );
}

// 5. Breaches of the 4-hour first-response target.
const breached = rows.filter((r, i) => frMins[i] == null || frMins[i] - openMins[i] > 240);
console.log(`  4-hour breaches     : ${breached.map((r) => r.id).join(", ")} = ${breached.length}   (prose: 1)`);
ok(breached.length === 1, "breach count", `recomputed ${breached.length}, prose says one`);
ok(breached[0] && breached[0].id === "INC-110", "the breach is INC-110", `recomputed ${breached.map((r) => r.id).join(", ")}`);

// 6. The concentration claim: INC-107 and INC-109 carry most of the MTTR.
{
  const pair = ["INC-107", "INC-109"]
    .map((id) => {
      const i = rows.findIndex((r) => r.id === id);
      return resMins[i] - openMins[i];
    })
    .reduce((a, b) => a + b, 0);
  console.log(`  INC-107 + INC-109   : ${pair} of ${resSum} minutes   (prose: 2430 of 2950)`);
  ok(pair === 2430, "the two-ticket concentration", `recomputed ${pair}, prose says 2430`);
}

// 7. The median claim, used to argue the mean hides the outlier.
{
  const sorted = [...frGaps].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  console.log(`  median first resp.  : ${median} minutes   (prose: 15)`);
  ok(median === 15, "median first response", `recomputed ${median}, prose says 15`);
}

console.log("");
if (findings.length) {
  console.log(`TIER 1 FAILED — ${findings.length} of ${checks} checks failed:\n`);
  for (const f of findings) console.log("  " + f);
  process.exit(1);
}
console.log(`TIER 1 PASSED — ${checks} metric checks recomputed, 0 wrong.`);
console.log("Every figure the phase prints follows from its own table, so a reader who");
console.log("computes correctly and a reader who reads the answer arrive at the same place.");
