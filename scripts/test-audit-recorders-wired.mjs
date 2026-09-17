// Control: the recorder-wiring guard must FAIL on an unwired recorder.
// A guard that cannot fail is a comment (D-049).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const CI = path.join(ROOT, ".github", "workflows", "ci.yml");
const GUARD = path.join(ROOT, "scripts", "audit-recorders-wired.mjs");

const orig = fs.readFileSync(CI, "utf8");
const results = [];

const run = () => {
  try {
    return { code: 0, out: execFileSync("node", [GUARD], { encoding: "utf8" }) };
  } catch (e) {
    return { code: e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
};

const control = (name, mutate, expectFail) => {
  fs.writeFileSync(CI, mutate(orig), "utf8");
  let r;
  try {
    r = run();
  } finally {
    fs.writeFileSync(CI, orig, "utf8");
  }
  const failed = r.code !== 0;
  const ok = failed === expectFail;
  results.push({ name, ok, out: r.out.trim().split("\n").filter(Boolean).slice(-1)[0] || "" });
};

// 1. Negative control: the real workflow must pass.
control("the real workflow as shipped -> must PASS", (t) => t, false);

// 2. Remove one recorder line: must FAIL, and name that recorder.
control(
  "one recorder dropped from CI -> must FAIL",
  (t) => {
    const out = t.replace("          node scripts/record-it-verdicts-2.mjs\n", "");
    if (out === t) throw new Error("control 2 fixture did not remove a recorder line");
    return out;
  },
  true,
);

// 3. Remove all recorder lines: must FAIL.
control(
  "every recorder dropped from CI -> must FAIL",
  (t) => {
    const out = t
      .split("\n")
      .filter((l) => !/^\s+node scripts\/record-.*verdicts.*\.mjs\s*$/.test(l))
      .join("\n");
    if (out === t) throw new Error("control 3 fixture removed nothing");
    return out;
  },
  true,
);

const untouched = fs.readFileSync(CI, "utf8") === orig;
console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
console.log(`  ci.yml restored byte-identical: ${untouched}`);
const bad = results.filter((r) => !r.ok).length;
console.log(bad === 0 && untouched ? "ALL CONTROLS PASS" : `${bad} CONTROL(S) FAILED`);
process.exit(bad === 0 && untouched ? 0 : 1);
