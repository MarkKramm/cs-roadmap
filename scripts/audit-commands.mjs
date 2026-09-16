// Guards against a specific, repeatable authoring error: a command written so
// abbreviated inside a summary table that it is no longer VALID SYNTAX.
//
// WHY THIS EXISTS
// IT 02 line 219 states DISM correctly:
//     DISM /Online /Cleanup-Image /RestoreHealth
// and 300 lines later its summary table said:
//     `DISM /RestoreHealth`, then `sfc /scannow`
// The table version throws an error if a beginner types it. Nobody lied and
// nothing was inconsistent -- the author abbreviated a long command to fit a
// table cell, and the abbreviation silently became a different, broken command.
//
// That is the failure mode this checks: not "is the command name right" but
// "would this exact string work if a beginner typed it". A summary table is
// where it happens, because a table cell invites shortening.
//
// Run: node scripts/audit-commands.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "career-roadmaps");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Each rule: `bad` must NOT appear in content, `why` explains the failure, and
// `fix` names the correct form. Rules are deliberately narrow -- a guard that
// flags valid usage gets ignored, which is worse than not having it.
const RULES = [
  {
    id: "dism-bare-restorehealth",
    bad: /\bDISM\s+\/RestoreHealth\b/i,
    why: "`DISM /RestoreHealth` is invalid syntax and errors when run.",
    fix: "`DISM /Online /Cleanup-Image /RestoreHealth`",
  },
  {
    id: "dism-bare-scanhealth",
    bad: /\bDISM\s+\/ScanHealth\b/i,
    why: "`DISM /ScanHealth` is invalid syntax and errors when run.",
    fix: "`DISM /Online /Cleanup-Image /ScanHealth`",
  },
  {
    id: "dism-bare-checkhealth",
    bad: /\bDISM\s+\/CheckHealth\b/i,
    why: "`DISM /CheckHealth` is invalid syntax and errors when run.",
    fix: "`DISM /Online /Cleanup-Image /CheckHealth`",
  },
  {
    id: "dism-bare-analyzecomponentstore",
    bad: /\bDISM\s+\/AnalyzeComponentStore\b/i,
    why: "`DISM /AnalyzeComponentStore` is missing the `/Online /Cleanup-Image` scope flags.",
    fix: "`DISM /Online /Cleanup-Image /AnalyzeComponentStore`",
  },
  {
    id: "dism-bare-startcomponentcleanup",
    bad: /\bDISM\s+\/StartComponentCleanup\b/i,
    why: "`DISM /StartComponentCleanup` is missing the `/Online /Cleanup-Image` scope flags.",
    fix: "`DISM /Online /Cleanup-Image /StartComponentCleanup`",
  },
  {
    id: "sfc-missing-slash",
    bad: /\bsfc\s+scannow\b/i,
    why: "`sfc scannow` is missing the slash; the switch is `/scannow`.",
    fix: "`sfc /scannow`",
  },
  {
    id: "chkdsk-missing-slash",
    bad: /\bchkdsk\s+([A-Z]:\s*)?(scan|f|r)\b(?!\s*\/)/i,
    why: "chkdsk switches take a leading slash.",
    fix: "`chkdsk C: /scan`",
  },
];

const files = walk(CONTENT);
const findings = [];
let linesChecked = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    linesChecked++;
    for (const rule of RULES) {
      if (rule.bad.test(line)) {
        findings.push({
          rel,
          line: i + 1,
          rule: rule.id,
          why: rule.why,
          fix: rule.fix,
          text: line.trim().slice(0, 120),
        });
      }
    }
  }
}

console.log(`Checked ${linesChecked} line(s) across ${files.length} content file(s).`);
console.log("");

if (findings.length) {
  console.log(`COMMAND AUDIT FAILED — ${findings.length} abbreviated command(s) that would error:\n`);
  for (const f of findings) {
    console.log(`  ${f.rel}:${f.line}  [${f.rule}]`);
    console.log(`    found: ${f.text}`);
    console.log(`    ${f.why}`);
    console.log(`    use:   ${f.fix}`);
    console.log("");
  }
  process.exit(1);
}

console.log(
  "Command audit passed: every DISM/sfc/chkdsk invocation is written in a form that runs.",
);
