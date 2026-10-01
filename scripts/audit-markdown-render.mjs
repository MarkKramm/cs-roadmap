// Guard: the generated content JSON must contain no inline Markdown that the
// site renders literally.
//
// WHAT THIS REPLACES, and why the replacement was not "keep the old one and add
// controls to it"
//
// The previous `audit-markdown-render.mjs` had the right question and a false
// premise. It asked whether the site renders inline Markdown literally, on the
// stated basis that "learning-site has no Markdown renderer" -- and it counted
// every `**bold**`, `*italic*` and `` `code` `` span in the generated JSON as a
// problem. Every one of those 1,458 spans is rendered correctly, by
// `learning-site/src/lib/renderInline.jsx`, which 15 components import. So the
// guard reported 299 correctly-rendered spans in the IT track alone and called
// them defects. It also had three further problems, each of which alone would
// have been enough to justify replacing it:
//
//   - it NEVER EXITED NON-ZERO. There is no `process.exit` in the file at all.
//     Every finding it printed was reported and then ignored, which is why
//     `docs/CHECKPOINT.md` described it as "deliberately outside CI" and why the
//     CHANGELOG noted "exits 0 whatever it finds" without anyone connecting that
//     to the premise being false.
//   - it read only `it` and `cyber`. The advance track -- 7 phases, 117,002
//     words, the most senior material in the repository -- was never scanned.
//   - it was a REPORTER for a defect that no longer existed, which is the worst
//     combination: a file that costs a build artifact to run and produces
//     nothing but noise. `docs/CHECKPOINT.md` even named it as the one guard
//     deliberately outside CI.
//
// Adding controls to that file would have been the wrong kind of thoroughness.
// A guard whose premise is false cannot be made true by testing it.
//
// THE REAL INVARIANT, which nothing was checking
//
// `renderInline.jsx` documents its own scope precisely: it handles `**bold**`,
// `*italic*` and `` `code` ``, and it "does not handle headings, lists, links,
// or block structure, because the JSON contains none -- those are parsed out by
// scripts/build-content.mjs and become real UI elements."
//
// That last clause is a CLAIM, and it is the one worth gating. If a practice
// task or a deliverable ever acquires a Markdown link or a strikethrough span,
// `renderInline` will not touch it and the reader sees the raw syntax. Nothing
// would notice: the content build succeeds, the render smoke test succeeds, and
// the site renders a page with visible `[text](url)` in it.
//
// So this guard checks the claim instead of the retired defect. It scans every
// generated file, and fails on any inline construct outside the handled set.
//
// WHY THE HANDLED SET IS DECLARED HERE AND NOT IMPORTED
//
// `renderInline.jsx` is JSX and cannot be imported by a plain Node script, so
// the set is declared rather than derived. That is a staleness risk, and it is
// addressed rather than ignored: `scripts/test-audit-markdown-render.mjs`
// includes a control that reads the real `renderInline.jsx` and fails if it
// learns to handle a construct this guard still treats as unhandled. The control
// is the mechanism; the duplication is the cost, and the cost is smaller than a
// guard reporting 299 false positives.
//
// Read-only: writes nothing.
import fs from "node:fs";
import path from "node:path";

const SITE = path.join(path.resolve(import.meta.dirname, ".."), "learning-site");
const GEN = path.join(SITE, "src", "data", "generated");

// Constructs the site CAN render. A hit in any of these is fine.
const HANDLED = new Set(["bold", "italicStar", "code"]);

// Constructs that would render LITERALLY, each with what a reader would see.
// `block` entries are deliberately absent: headings, lists and tables are parsed
// into real UI by build-content.mjs before this JSON exists, so their presence
// here would mean the pipeline had changed shape, which a content guard
// elsewhere would catch first.
const UNHANDLED = {
  italicUnderscore: { pattern: /(?<![_\w])_(?!_)[^_\n]+_(?![_\w])/g, shows: "_italic_" },
  link: { pattern: /\[[^\]\n]+\]\([^)\n]+\)/g, shows: "[text](url)" },
  strikethrough: { pattern: /~~[^~\n]+~~/g, shows: "~~struck~~" },
  // A reference-style or bare URL is not Markdown the renderer claims, so it is
  // counted for information only, never as a finding.
  bareUrl: { pattern: /https?:\/\/\S+/g, shows: "a bare URL", informational: true },
};

if (!fs.existsSync(GEN)) {
  console.error("MISSING BUILD ARTIFACT — " + GEN + " does not exist.");
  console.error("Run `npm run build:content` in learning-site/ first; a guard that cannot read");
  console.error("its subject must say so rather than report a clean result.");
  process.exit(1);
}

const files = fs.readdirSync(GEN).filter((f) => f.endsWith(".json")).sort();

if (!files.length) {
  console.error("MISSING BUILD ARTIFACT — no generated JSON in " + GEN + ".");
  process.exit(1);
}

const findings = [];
const handledTotals = {};
let stringsScanned = 0;

for (const f of files) {
  const name = f.replace(/\.json$/, "");
  let json;
  try {
    json = JSON.parse(fs.readFileSync(path.join(GEN, f), "utf8"));
  } catch (e) {
    findings.push({ name, field: "<parse>", detail: "is not valid JSON: " + e.message });
    continue;
  }

  const walk = (node, field) => {
    if (typeof node === "string") {
      stringsScanned++;
      for (const [kind, def] of Object.entries(UNHANDLED)) {
        const m = node.match(def.pattern);
        if (!m) continue;
        if (def.informational) continue;
        findings.push({
          name,
          field,
          detail: `renders literally — ${m.length} occurrence(s) of ${def.shows} in a string the site does not format`,
          sample: m[0].slice(0, 60),
        });
      }
      for (const kind of HANDLED) {
        const re = kind === "bold" ? /\*\*[^*\n]+\*\*/g
          : kind === "italicStar" ? /(?<!\*)\*(?!\*)[^*\n]+\*(?!\*)/g
          : /`[^`\n]+`/g;
        const m = node.match(re);
        if (m) handledTotals[kind] = (handledTotals[kind] || 0) + m.length;
      }
      return;
    }
    if (Array.isArray(node)) { node.forEach((v) => walk(v, field)); return; }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) walk(v, k);
    }
  };
  walk(json, "root");
}

console.log(`Generated files scanned: ${files.length} (${files.map((f) => f.replace(/\.json$/, "")).join(", ")})`);
console.log(`Content strings scanned: ${stringsScanned}`);
const handledDesc = Object.entries(handledTotals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ");
console.log(`Spans the site renders correctly: ${handledDesc || "none"}`);
console.log("");

if (findings.length) {
  console.error(`MARKDOWN RENDER FAILED — ${findings.length} string(s) carry inline Markdown the site will not render:`);
  for (const x of findings) {
    console.error(`  [${x.name} / ${x.field}]  ${x.detail}`);
    if (x.sample) console.error(`      e.g. ${x.sample}`);
  }
  console.error("");
  console.error("FIX: either add the construct to renderInline.jsx and list it in HANDLED here, or");
  console.error("     write the content without it. A visible `[text](url)` on a lesson page is a");
  console.error("     rendering defect the reader sees, and nothing else in CI would catch it.");
  process.exit(1);
}

console.log("MARKDOWN RENDER OK — no content string carries inline Markdown the site renders literally.");
