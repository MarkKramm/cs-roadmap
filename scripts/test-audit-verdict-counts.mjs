// Control for the new empty-verdict check: prove it fires on the historical bug.
//
// Install the exact condition that existed for five passes -- "DNS record types"
// marked done while its rows are empty -- and require the guard to fail. A guard
// that has never been shown to fail on the real defect is not evidence (D-049).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const GUARD = "scripts/audit-verdict-counts.mjs";
const DOC = "docs/CYBER-CLAIM-VERIFICATION.md";
const SPLIT = "scripts/split-claims.mjs";

const orig = fs.readFileSync(DOC, "utf8");
const splitOrig = fs.readFileSync(SPLIT, "utf8");
let fails = 0;

// Run the guard with an optional mutation to split-claims.mjs too, since the
// guard's verdict depends on which classes the splitter marks done.
const check = (name, wantFail, mutate, mutateSplit) => {
  fs.writeFileSync(DOC, mutate(orig), "utf8");
  fs.writeFileSync(SPLIT, mutateSplit ? mutateSplit(splitOrig) : splitOrig, "utf8");
  let failed = false, out = "";
  try {
    out = execFileSync("node", [GUARD], { encoding: "utf8" });
  } catch (e) {
    failed = true;
    out = (e.stdout || "") + (e.stderr || "");
  }
  const ok = failed === wantFail;
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}  (expected ${wantFail ? "exit!=0" : "exit=0"}, got ${failed ? "exit!=0" : "exit=0"})`);
  const line = out.split("\n").find((l) => l.includes("EMPTY verdict") || l.includes("OUTSTANDING"));
  if (line) console.log(`          -> ${line.trim().slice(0, 130)}`);
};

console.log("controls for the EMPTY-verdict check:");
console.log("  (the DNS class is real, tracked, outstanding work — these controls move it in and out of that state)");

const fillDns = (t) => {
  const i = t.indexOf("## DNS record types");
  const j = t.indexOf("\n## ", i + 1);
  const seg = t.slice(i, j === -1 ? t.length : j);
  const filled = seg.replace(/(\| \d+ \|[^|]*\|[^|]*\|)\s*\|/g, "$1 **UNVERIFIABLE** — control fixture |");
  return t.slice(0, i) + filled + t.slice(j === -1 ? t.length : j);
};
// The splitter now carries BOTH tracks, and "DNS record types" appears in each.
// A track-blind regex matches the IT entry first and silently mutates the wrong
// track -- which is how control 3 became a no-op that passed while proving nothing.
// Anchor every mutation inside the cybersec array.
const CYBER_START = "cybersec: [";
const inCyber = (s, fn) => {
  const i = s.indexOf(CYBER_START);
  if (i === -1) throw new Error("no cybersec class list in split-claims.mjs");
  const j = s.indexOf("\n  ],", i);
  const end = j === -1 ? s.length : j;
  return s.slice(0, i) + fn(s.slice(i, end)) + s.slice(end);
};
const markDnsDone = (s) =>
  inCyber(s, (seg) =>
    seg.replace(/\{ title: "DNS record types" \}/, '{ title: "DNS record types", done: true, doneThrough: 3 }'),
  );
const untrackDns = (s) => inCyber(s, (seg) => seg.replace(/\n\s*\{ title: "DNS record types" \},/, ""));

// 1. THE REAL BUG, EXACTLY AS IT SHIPPED. DNS is marked done in the splitter while
//    its rows carry no verdict -- the state the repository was actually in, which
//    five completed passes reported as clean.
check("DNS marked DONE but rows empty -> must FAIL", true, (t) => t, (s) => {
  const mutated = markDnsDone(s);
  if (mutated === s) throw new Error("control 1 fixture did not mutate split-claims.mjs");
  return mutated;
});

// 2. The correct in-flight state: DNS is outstanding AND its pack exists. The guard
//    must NOT fail, or it would be unusable during the very period it is needed.
check("DNS tracked as outstanding -> must PASS", false, (t) => t);

// 3. A class that is neither done nor tracked is unreachable work. Emptied and
//    unlisted, it must fail -- this is the "forgot to list it" case.
//
//    Assert the mutation actually happened before asserting the guard's verdict.
//    The previous version used a regex that no longer matched after the splitter
//    was restructured, so it silently mutated NOTHING, the guard correctly passed,
//    and the control reported a failure against working code. **A control that
//    cannot tell "the guard is wrong" from "my fixture is wrong" wastes exactly the
//    time it was built to save.**
check("empty rows in an untracked class -> must FAIL", true, (t) => t, (s) => {
  const mutated = untrackDns(s);
  if (mutated === s) throw new Error("control 3 fixture did not mutate split-claims.mjs");
  return mutated;
});

// 4. Negative control: everything answered must pass, whatever the tracking says.
check("all rows answered, DNS marked done -> must PASS", false, fillDns, markDnsDone);
check("all rows answered, DNS outstanding -> must PASS", false, fillDns);

fs.writeFileSync(DOC, orig, "utf8");
fs.writeFileSync(SPLIT, splitOrig, "utf8");
const restored = fs.readFileSync(DOC, "utf8") === orig && fs.readFileSync(SPLIT, "utf8") === splitOrig;
console.log("");
console.log(`  both files restored byte-identical: ${restored}`);
console.log(fails === 0 && restored ? "ALL CONTROLS PASS" : `${fails} CONTROL(S) FAILED`);
process.exit(fails === 0 && restored ? 0 : 1);
