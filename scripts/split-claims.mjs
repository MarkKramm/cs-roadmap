// Split the claim-verification worklist into paste-ready chunks for a chat
// model with web access.
//
// WHY THIS EXISTS
// The first hand-written prompt ended with the literal line
//     [paste the five tables here]
// and that placeholder was never replaced, because the tables live INSIDE the
// file being pasted -- so "paste the file" and "paste the tables" were the same
// action and the instruction was self-contradictory. The model receiving it
// said the tables were missing and then produced 145 fabricated verdicts
// anyway, complete with a source column it had invented.
//
// The fix is not a better-worded prompt. It is to remove the step where a
// human assembles the message: each chunk below is a COMPLETE, SELF-CONTAINED
// message, with the context a verifier needs and an explicit instruction about
// what to do if something is missing. There is nothing left to paste in.
//
// Run: node scripts/split-claims.mjs
// Writes: docs/claims-to-verify/NN-<class>.md

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "docs", "IT-CLAIM-VERIFICATION.md");
const OUT = path.join(ROOT, "docs", "claims-to-verify");

// Only the classes that still need an external source. The settled classes
// (subnetting, ports, arithmetic) are recomputed by scripts and are skipped --
// sending them would invite a model to "verify" arithmetic it cannot check.
const WANTED = [
  "Command and cmdlet usage",
  "DNS record types",
  "Protocol and standard behaviour",
  "Product versions and editions",
  "Registry paths, file paths and filenames",
];

const lines = fs.readFileSync(SRC, "utf8").split("\n");

// Slice the file into "## <title>" sections.
const sections = new Map();
let current = null;
for (const line of lines) {
  const m = /^## (.+?)\s*$/.exec(line);
  if (m) {
    current = m[1];
    sections.set(current, []);
    continue;
  }
  if (current) sections.get(current).push(line);
}

const HEADER = `You are verifying technical claims from a training curriculum against
**primary sources** — Microsoft Learn, IANA, RFCs, POSIX man pages, and vendor
documentation.

The table below is complete and self-contained. Every row you need is here.

## What to do

For each row, replace the empty last column with exactly one of:

| Verdict | Format |
|---|---|
| \`OK\` | \`OK\` — then the **URL** that settles it, and a short quote from it |
| \`WRONG\` | \`WRONG\` — the correct value, **and** the URL that proves it |
| \`UNVERIFIABLE\` | \`UNVERIFIABLE\` — say briefly why (judgement, analogy, or simplification) |

## Rules

1. **Every \`OK\` and every \`WRONG\` must carry a source URL, and a quote from
   it that settles the claim.** The quote is not decoration: a URL alone says
   only that a page exists. If you cannot quote the line that decides the
   claim, the verdict is \`UNVERIFIABLE\`. A recollection is not a source.
2. **Prefer the authority over a page that agrees with it.** Rank sources:
   the standard itself (RFC, POSIX, FHS, IANA registry) > the vendor's own
   reference documentation > a vendor tutorial or blog > a forum answer or a
   third-party article. Use the highest rank you can reach, and **name the
   source type** in the verdict. A claim sourced to a forum post or a
   third-party tutorial is weaker evidence than the same claim sourced to the
   spec, and the reader needs to know which they are getting.
3. **Never cite a page you could not open or whose text you could not read.**
   If a source is paywalled, login-gated, blocked, or empty, it does not count
   as a source. Say so.
4. **Cite in the language you read.** If the only page you can reach is a
   localised version of the vendor's documentation, say that explicitly, and
   prefer finding the English original.
5. **Do not guess to fill a row.** An honest \`UNVERIFIABLE\` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
6. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
7. **If any part of a row is unclear, say so in the verdict** (\`UNVERIFIABLE —
   text truncated\`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
8. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
9. \`UNVERIFIABLE\` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.

`;

// A chunk can be too large for one reply. The first pass at the 160-row command
// table stopped at row 152 of 160 -- the model ran out of room mid-table and
// said so at a row boundary, which is rule 6 working. Rather than re-pasting
// 45 KB to reach eight rows, `--from <n>` emits a continuation chunk starting
// at that row, with its own copy of the instructions.
const fromArg = process.argv.indexOf("--from");
const FROM = fromArg > -1 ? Number(process.argv[fromArg + 1]) : null;

fs.mkdirSync(OUT, { recursive: true });

let written = 0;
let n = 0;
for (const title of WANTED) {
  const body = sections.get(title);
  if (!body) {
    console.log(`WARNING: section not found — "${title}"`);
    continue;
  }
  // Trim the trailing notes that follow the table in the source file; the
  // verifier does not need the author's commentary about the class.
  const kept = [];
  for (const line of body) {
    if (/^---\s*$/.test(line)) break;
    kept.push(line);
  }
  while (kept.length && !kept[kept.length - 1].trim()) kept.pop();

  n++;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // --from <n>: keep only rows numbered >= n, and drop the now-dangling
  // context lines that belonged to the row above the cut.
  let outLines = kept;
  let suffix = "";
  if (FROM) {
    const want = new Set();
    outLines = [];
    let keepCtx = false;
    for (const line of kept) {
      const m = /^\| (\d+) \|/.exec(line);
      if (m) {
        keepCtx = Number(m[1]) >= FROM;
        if (keepCtx) outLines.push(line);
        continue;
      }
      // A context row belongs to the claim directly above it.
      if (keepCtx && /^\| \| \| <sub>/.test(line)) outLines.push(line);
    }
    suffix = `-from-${FROM}`;
  }

  const file = path.join(OUT, `${String(n).padStart(2, "0")}-${slug}${suffix}.md`);
  const rows = outLines.filter((l) => /^\| \d+ \|/.test(l)).length;

  // A class with fewer rows than the cut point has no continuation. Writing an
  // empty file would be a file that looks like a task and contains none.
  if (!rows) {
    console.log(`  ${path.basename(file).padEnd(46)}    (no rows at or after ${FROM} — skipped)`);
    continue;
  }

  const heading = FROM
    ? `# ${title} — rows ${FROM} onward\n\nThis is the CONTINUATION of a table whose earlier rows were already verified. **Verify only the rows below.** Do not restate or re-check earlier rows.\n`
    : `# ${title}\n`;

  fs.writeFileSync(file, HEADER + heading + "\n" + outLines.join("\n") + "\n", "utf8");
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  console.log(`  ${path.basename(file).padEnd(46)} ${String(rows).padStart(4)} rows  ${kb} KB`);
  written++;
}

console.log("");
console.log(`Wrote ${written} self-contained message(s) to docs/claims-to-verify/.`);
console.log("Each file is a COMPLETE message: instructions, then the whole table.");
console.log("Nothing needs to be added -- paste the file's contents and send.");
