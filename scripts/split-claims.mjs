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

// Which track's worklist to split, and its output folder. The IT pass is
// complete; the cyber pass is the live one.
const trackIdx = process.argv.indexOf("--track");
const TRACK_KEY = trackIdx > -1 ? process.argv[trackIdx + 1] : "it";
const TRACKS = {
  it: { src: "IT-CLAIM-VERIFICATION.md", out: "claims-to-verify" },
  cybersec: { src: "CYBER-CLAIM-VERIFICATION.md", out: "claims-to-verify-cyber" },
};
if (!TRACKS[TRACK_KEY]) {
  console.error(`unknown track "${TRACK_KEY}" — expected: ${Object.keys(TRACKS).join(", ")}`);
  process.exit(2);
}
const SRC = path.join(ROOT, "docs", TRACKS[TRACK_KEY].src);
const OUT = path.join(ROOT, "docs", TRACKS[TRACK_KEY].out);

// Which classes still need an external source, and how much of each is DONE.
//
// This list is the fix for a real confusion: the script used to emit a chunk for
// every class it knew how to produce, including four that had already been
// verified. The folder then held five files and no way to tell which were
// outstanding work and which were already finished -- so the obvious move was
// to re-verify work that was already done.
//
// `doneThrough` is the last row number already verified. Rows up to it are
// dropped, so what is on disk is exactly what is left to do. When a class is
// fully done, set `done: true` and it stops being emitted at all.
//
// This is hand-maintained ON PURPOSE. The results of a verification pass live
// in a conversation, not in the repository, so there is nothing to read them
// from -- and a script that guessed would be wrong in the direction of silently
// skipping unverified rows.
//
// The `settled` classes (cidr, port, number) are ABSENT by design: they are
// recomputed by scripts/verify-*.mjs, and sending them would invite a model to
// "verify" arithmetic it cannot check.
// WHY THE IT TRACK IS NOT MARKED DONE, EVEN THOUGH A PASS WAS RUN.
//
// The IT verification pass genuinely happened -- commit 858206b records three real
// defects it found, all of the "right name, broken invocation" shape. But its
// VERDICTS were never written into docs/IT-CLAIM-VERIFICATION.md: all 225 rows in
// that document carry an empty verdict column, the document's own class table still
// says "needs checking" for five of them, and the header nonetheless reads
// "Status: verified -- 224 claims, 0 WRONG".
//
// So the result is known but UNREPRODUCIBLE, which for a verification record is the
// same as unknown. Marking these done again would repeat the exact mistake that lost
// the cyber DNS class: a class that looks finished, yields no worklist, and cannot be
// told from one that was actually checked. The rows are re-emitted until verdicts
// exist for them, row by row, in the document.
const WANTED_BY_TRACK = {
  it: [
    // All five classes verified as of 2026-09-18: 225 rows, 208 OK, 0 WRONG,
    // 17 UNVERIFIABLE. Recorded row by row by record-it-verdicts.mjs (the command
    // class) and record-it-verdicts-2.mjs (the other four). IT emits no worklist.
    { title: "Command and cmdlet usage", done: true, doneThrough: 161 },
    { title: "DNS record types", done: true, doneThrough: 4 },
    { title: "Protocol and standard behaviour", done: true, doneThrough: 26 },
    { title: "Product versions and editions", done: true, doneThrough: 17 },
    { title: "Registry paths, file paths and filenames", done: true, doneThrough: 17 },
  ],
  cybersec: [
    { title: "MITRE ATT&CK technique identifiers", done: true, doneThrough: 34 },
    // NOT done: 3 rows still await a verdict. Do not add `done: true` here.
    { title: "DNS record types" },
    { title: "CVE identifiers and vulnerability claims", done: true, doneThrough: 4 },
    { title: "Cryptography algorithm claims", done: true, doneThrough: 5 },
    { title: "Standards, frameworks and control identifiers", done: true, doneThrough: 105 },
    { title: "Security tool commands and flags", done: true, doneThrough: 99 },
    { title: "Protocol and standard behaviour", done: true, doneThrough: 44 },
    { title: "Registry paths, file paths and filenames", done: true, doneThrough: 47 },
    { title: "Product versions and editions", done: true, doneThrough: 9 },
    { title: "Command and cmdlet usage", done: true, doneThrough: 60 },
  ],
};
const WANTED = WANTED_BY_TRACK[TRACK_KEY];

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

// Start from a clean folder. A stale chunk from a previous run is
// indistinguishable from outstanding work, and the whole point of this script
// is that what is on disk equals what is left to do.
let removed = 0;
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".md")) {
    fs.unlinkSync(path.join(OUT, f));
    removed++;
  }
}
if (removed) console.log(`cleared ${removed} stale chunk(s) from a previous run\n`);

let written = 0;
let n = 0;
for (const spec of WANTED) {
  const title = spec.title;
  if (spec.done) {
    console.log(`  ${title.padEnd(44)}    (fully verified — not emitted)`);
    continue;
  }
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

  // Rows already verified are dropped, so the file on disk is only what is
  // left. `--from <n>` can still override this by hand.
  //
  // TWO mechanisms, because one is not enough:
  //
  //  * `cut` (`doneThrough`) drops a contiguous PREFIX. That is how every
  //    completed class shrank as its rows came back in order.
  //  * the row-level filter below drops ANY row that already carries a verdict,
  //    wherever it sits. `cut` cannot express "rows 1-3 outstanding, row 4 done",
  //    and that is not hypothetical: the cyber "DNS record types" class had
  //    exactly that shape, and re-sending row 4 would have asked a verifier to
  //    redo settled work -- D-038's failure mode, a worklist that cannot tell
  //    done from outstanding. A row with a verdict is done; do not send it.
  //
  // The row-level filter is deliberately independent of `cut`, so a class with no
  // `doneThrough` at all (never partially cut) still cannot re-send answered rows.
  const cut = FROM || (spec.doneThrough ? spec.doneThrough + 1 : null);
  const answered = (line) => /\|\s*\*\*(OK|WRONG|UNVERIFIABLE)\*\*/.test(line);
  let suffix = "";
  let outLines = [];
  {
    let keepCtx = false;
    for (const line of kept) {
      const m = /^\| (\d+) \|/.exec(line);
      if (m) {
        keepCtx = (!cut || Number(m[1]) >= cut) && !answered(line);
        if (keepCtx) outLines.push(line);
        continue;
      }
      // A context row belongs to the claim directly above it.
      if (keepCtx && /^\| \| \| <sub>/.test(line)) outLines.push(line);
    }
  }
  if (cut && cut > 1) suffix = `-from-${cut}`;

  const file = path.join(OUT, `${String(n).padStart(2, "0")}-${slug}${suffix}.md`);
  const rows = outLines.filter((l) => /^\| \d+ \|/.test(l)).length;

  // A class with fewer rows than the cut point has no continuation. Writing an
  // empty file would be a file that looks like a task and contains none.
  if (!rows) {
    console.log(`  ${path.basename(file).padEnd(46)}    (nothing left at or after row ${cut} — skipped)`);
    continue;
  }

  const heading = cut && cut > 1
    ? `# ${title} — rows ${cut} onward\n\nThis is the CONTINUATION of a table whose earlier rows were already verified. **Verify only the rows below.** Do not restate or re-check earlier rows.\n`
    : `# ${title}\n`;

  fs.writeFileSync(file, HEADER + heading + "\n" + outLines.join("\n") + "\n", "utf8");
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  console.log(`  ${path.basename(file).padEnd(46)} ${String(rows).padStart(4)} rows  ${kb} KB`);
  written++;
}

console.log("");
console.log(`Wrote ${written} self-contained message(s) to docs/${TRACKS[TRACK_KEY].out}/.`);
console.log("Each file is a COMPLETE message: instructions, then the whole table.");
console.log("Nothing needs to be added -- paste the file's contents and send.");
