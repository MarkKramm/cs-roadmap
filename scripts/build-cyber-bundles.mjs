// Build the cyber verification bundles.
//
// WHY THIS EXISTS
// The nine packs in claims-to-verify-cyber/ are the right unit for a *sitting* and
// the wrong unit for a *paste*. Two ways to get this wrong, and D-038 records both
// already being made once on the IT pass:
//   1. One paste of everything (369 rows, ~30k tokens in) demands 2-3x that back out,
//      because every OK row must carry a URL and a quote. The IT pass's 160-row table
//      came back verified through row 152 and stopped. Truncation is not a maybe.
//   2. Nine separate pastes with no index means the human has to track which are done,
//      which is the "folder that could not distinguish done from outstanding" failure.
//
// So this emits bundles sized to survive a reply, numbered, each self-contained, plus
// a manifest that says what is in each and in what order to send them.
//
// Run: node scripts/build-cyber-bundles.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const SRC = path.join(ROOT, "docs", "claims-to-verify-cyber");
const OUT = path.join(ROOT, "docs", "claims-to-verify-cyber", "bundles");

// The FOUR packs still outstanding, in the order they should be SENT.
//
// Five of the original nine are GONE from this list because they are verified:
// standards/frameworks (105 rows), CVE (4), cryptography (5), product versions (9)
// and command/cmdlet usage (60) -- **185 rows cleared with zero WRONG verdicts**.
// They are withheld by `split-claims.mjs` via `done: true`, so they never reach
// this script. That is the fix for the confusion that made a reader re-verify
// finished work. If one reappears in this folder, the splitter's WANTED_BY_TRACK
// list has been edited and this script will pick it up and send it again.
//
// Ordering principle: highest expected yield first. Command/cmdlet usage led the
// previous plan and has now been done -- it produced no defects, but the class it
// was grouped with on the IT pass, tool commands and flags, is the same
// "right name, broken invocation" shape and is the largest remaining.
//
// `rows` is NOT declared here. It is read from the pack at build time, because a
// hard-coded count silently disagrees with the table beside it the moment the
// corpus moves -- the exact defect fixed in extract-claims.mjs, where "216 claims"
// was IT's figure printed into every track.
const PLAN = [
  { file: "02-security-tool-commands-and-flags.md", why: "Tool man pages settle each one. The same broken-invocation shape that produced real defects on the IT pass, at larger scale." },
  { file: "01-mitre-att-ck-technique-identifiers.md", why: "ATT&CK IDs and technique names, checked against attack.mitre.org." },
  { file: "03-protocol-and-standard-behaviour.md", why: "RFC-settled, mechanical, unambiguous." },
  { file: "04-registry-paths-file-paths-and-filenames.md", why: "Microsoft Learn or the OS itself. Mechanical." },
];

// Count the data rows in a pack, so the plan above never carries a stale number.
const countRows = (file) =>
  (fs.readFileSync(path.join(SRC, file), "utf8").match(/^\|\s*\d+\s*\|/gm) || []).length;

for (const item of PLAN) {
  item.rows = countRows(item.file);
}

// Stale bundles must not survive a rebuild.
//
// The first version of this script wrote bundle N without removing bundle N+1 from
// a previous, larger plan. After four classes were verified the plan shrank from
// four bundles to three, and `04-bundle.md` -- 99 rows of already-verified work --
// was left sitting in the folder looking exactly like outstanding work. That is
// the failure D-038 records verbatim: a folder where nothing distinguishes done
// from outstanding, so the obvious move is to redo finished work.
//
// Wipe the generated bundles before writing, and let the folder be the source of
// truth about what is left.
if (fs.existsSync(OUT)) {
  for (const f of fs.readdirSync(OUT)) {
    if (/^\d+-bundle\.md$/.test(f)) fs.rmSync(path.join(OUT, f));
  }
}
fs.mkdirSync(OUT, { recursive: true });

// Group packs into bundles that stay under a size a reply can actually answer.
//
// The binding constraint is the OUTPUT, not the input: each verified row returns a
// verdict, a URL and a quote, so a bundle's reply is roughly 2.5x its row-text. A
// ~120-row bundle has come back complete before (the IT pass verified 152 of 160 in
// one reply); ~200 has not been tested and is not the place to find out.
const MAX_ROWS = 130;
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];

const bundles = [];
let current = null;
for (const item of PLAN) {
  if (!current || current.rows + item.rows > MAX_ROWS) {
    current = { items: [], rows: 0 };
    bundles.push(current);
  }
  current.items.push(item);
  current.rows += item.rows;
}

// Split a pack into (instructions, table) so the header can appear once per bundle
// rather than nine times. The instructions are identical across packs by construction.
function split(file) {
  const text = fs.readFileSync(path.join(SRC, file), "utf8");
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.startsWith("# "));
  if (start === -1) throw new Error("no '# ' heading in " + file);
  return { rules: lines.slice(0, start).join("\n").trim(), table: lines.slice(start).join("\n").trim() };
}

const manifest = [];
bundles.forEach((b, i) => {
  const num = String(i + 1).padStart(2, "0");
  const parts = b.items.map((it) => split(it.file));
  // The rules block is identical in every pack (it is generated by split-claims.mjs),
  // so take the first and assert the rest match rather than silently shipping a
  // bundle whose rules differ from its neighbour's.
  const rules = parts[0].rules;
  parts.forEach((p, j) => {
    if (p.rules !== rules) throw new Error(`rules differ in ${b.items[j].file} — refusing to merge`);
  });

  const body = [
    rules,
    "",
    "---",
    "",
    `# This bundle covers ${b.items.length} claim class${b.items.length > 1 ? "es" : ""}, ${b.rows} rows total.`,
    "",
    "**Answer every row in every table below, in order, and output the tables complete.**",
    "Do not summarise and do not sample. If you run low on room, stop at a row boundary",
    "and say which table and row number to continue from — a continuation is cheap and",
    "an incomplete table is not.",
    "",
    ...parts.flatMap((p, j) => {
      const it = b.items[j];
      return [
        "---",
        "",
        `<!-- ${it.file} — ${it.rows} rows -->`,
        "",
        p.table,
        "",
      ];
    }),
  ].join("\n");

  const name = `${num}-bundle.md`;
  fs.writeFileSync(path.join(OUT, name), body + "\n", "utf8");
  manifest.push({
    num,
    name,
    rows: b.rows,
    classes: b.items.map((it) => ({ file: it.file, rows: it.rows, why: it.why })),
    chars: body.length,
  });
});

fs.writeFileSync(
  path.join(OUT, "README.md"),
  [
    "# Cyber claim verification — send these in order",
    "",
    "Generated by `scripts/build-cyber-bundles.mjs`. **Do not hand-edit**: re-run the",
    "script, which regenerates from `docs/claims-to-verify-cyber/*.md`.",
    "",
    "## Why bundles and not one paste",
    "",
    `${manifest.reduce((a, m) => a + m.rows, 0)} rows need a verdict, a source URL and a quote each.`,
    "That reply is roughly 2.5× the prompt, so one paste asks for far more back than a",
    "reply reliably completes — and **it will truncate.** The IT pass's 160-row command",
    "table came back verified through row 152 and stopped there. Nine separate pastes fix",
    "the truncation and reintroduce the other failure D-038 records: a folder where nothing",
    "says which packs are done.",
    "",
    `So: **${WORDS[manifest.length] || manifest.length} bundles, numbered, in the order below.** Send one, paste the answer back,`,
    "then send the next. Each is self-contained — the rules travel with every one, per",
    "D-038 (\"no placeholders, ever\").",
    "",
    "## The bundles",
    "",
    "| # | Bundle | Rows | Classes |",
    "|---|---|---|---|",
    ...manifest.map((m) => `| ${m.num} | \`${m.name}\` | ${m.rows} | ${m.classes.map((c) => c.file.replace(/^\d+-|\.md$/g, "")).join(", ")} |`),
    "",
    `**Total: ${manifest.reduce((a, m) => a + m.rows, 0)} rows across ${manifest.length} bundles.**`,
    "",
    "## Order and reasoning",
    "",
    ...manifest.flatMap((m) => [
      `### Bundle ${m.num} — ${m.rows} rows`,
      "",
      ...m.classes.map((c) => `- \`${c.file}\` (${c.rows} rows) — ${c.why}`),
      "",
    ]),    "## After each reply",
    "",
    "Paste the returned tables back into the conversation with me. I will:",
    "",
    "1. record the verdicts into `docs/CYBER-CLAIM-VERIFICATION.md` and the pack files,",
    "2. mark `doneThrough` in `scripts/split-claims.mjs` so the pack stops regenerating,",
    "3. **verify every `WRONG` against the primary source myself before changing any content** —",
    "   D-038: *\"a model's answer remains not a source.\"* This is what caught that three",
    "   first-pass defects were real, and what would have caught 145 fabricated verdicts.",
    "",
    "## The failure this is shaped to avoid",
    "",
    "D-038's first failure was a prompt containing an unfilled placeholder. The model",
    "reported the data missing and then **produced 145 fabricated verdicts anyway**, with",
    "an invented source column and no URLs. Hence: no placeholders, a quotable source",
    "required per row, and `UNVERIFIABLE` as an offered verdict rather than an admission",
    "of failure. **Expect `UNVERIFIABLE` to be common** — 48 of 224 on the IT pass (21%) —",
    "and do not push for a filled column.",
    "",
  ].join("\n"),
  "utf8",
);

for (const m of manifest) {
  console.log(`  ${m.name}  ${String(m.rows).padStart(3)} rows  ${String(Math.round(m.chars / 1024)).padStart(3)} KB  ~${Math.round(m.chars / 4 / 1000)}k tokens in`);
}
console.log(`\n  ${manifest.length} bundles, ${manifest.reduce((a, m) => a + m.rows, 0)} rows -> docs/claims-to-verify-cyber/bundles/`);
