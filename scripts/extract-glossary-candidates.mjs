#!/usr/bin/env node
// Extract GLOSSARY CANDIDATES: domain terms and the expansion string nearest each
// first use, with file:line provenance.
//
// WHY THIS IS A CANDIDATE LIST AND NOT THE GLOSSARY
//
// `docs/DESIGN-SYSTEM.md` describes the missing glossary as blocked on "new build
// tooling to produce the data first". That understates the problem, and measuring
// it changed the design. Running this extractor over the corpus on 2026-10-02:
//
//   312  distinct domain terms
//    64  terms where SOME expansion string was found
//    25  of those 64 independently corroborated (39%)
//
// And the failures are not near-misses, they are confidently wrong:
//
//   KQL -> Microsoft Sentinel and Defender XDR   (Kusto Query Language)
//   ICS -> The incident command system           (wrong sense entirely)
//   CSF -> task 7                                (a cross-reference, not a phrase)
//   CK  -> T1036                                 (an ATT&CK id)
//   CISA-> audit                                 (a gloss, not an expansion)
//
// A glossary that says "KQL means Microsoft Sentinel and Defender XDR" is worse
// than no glossary at all: it turns a term a beginner can look up into a wrong
// fact they will repeat. This repository's own doctrine says a stale ANSWER KEY is
// the worst outcome a self-study curriculum can produce, and that is precisely
// what an unverified expansion is.
//
// So the output of this script is a WORKLIST, not content. Each candidate is
// adjudicated by a human, and only verified entries reach
// `career-roadmaps/shared/GLOSSARY.md`. The pattern is the one the repository
// already uses for 1,144 claim rows: extract candidates, record verdicts against
// them, and guard the record against drift.
//
// The 39% figure is a LOWER bound, because the corroboration test used to produce
// it (do the expansion's initials spell the acronym?) has a known false negative:
// `CIDR -> Classless Inter-Domain Routing` is a perfect extraction scored as a
// failure, because the real answer skips the "I". Do not quote that number as the
// extraction's quality. Review the candidates.
//
// Usage:
//   node scripts/extract-glossary-candidates.mjs            # human-readable
//   node scripts/extract-glossary-candidates.mjs --json     # for tooling
//
// Read-only: writes nothing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..");
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

// Curriculum order, matching audit-terms.mjs. Shared documents are read last: they
// are reference material a reader reaches after the phases, so a term expanded
// there is the latest possible introduction.
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

function collect() {
  const files = [];
  for (const track of TRACKS) {
    const dir = path.join(REPO, "career-roadmaps", track);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!/^\d\d-phase-.*\.md$/.test(name)) continue;
      files.push({ key: `${track}/${name}`, file: path.join(dir, name) });
    }
  }
  const shared = path.join(REPO, "career-roadmaps", "shared");
  if (fs.existsSync(shared)) {
    for (const name of fs.readdirSync(shared).sort()) {
      // The glossary itself is excluded: its entries are the OUTPUT, and
      // re-extracting them would report every glossed term as its own candidate.
      if (!name.endsWith(".md")) continue;
      if (name.toUpperCase() === "GLOSSARY.MD") continue;
      files.push({ key: `shared/${name}`, file: path.join(shared, name) });
    }
  }
  return files;
}

/** Blank fenced blocks and inline code, preserving line count. */
function stripCode(raw) {
  const out = [];
  let inFence = false;
  for (const line of raw.split("\n")) {
    const t = line.trimStart();
    if (t.startsWith(FENCE)) { inFence = !inFence; out.push(""); continue; }
    if (inFence) { out.push(""); continue; }
    out.push(line.replace(/`[^`]*`/g, (m) => " ".repeat(m.length)));
  }
  return out;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stripEmphasis = (s) => s.replace(/\*+/g, "");
const JOINERS = new Set(["and", "of", "the", "for", "in", "to", "a", "an"]);

// The classifier lists are read out of audit-terms.mjs rather than copied, so this
// script and the guard cannot disagree about what counts as a domain term. Reading
// another script's source is fragile in general; here it is deliberate, it fails
// LOUDLY if the shape changes, and the alternative -- a second copy of four
// hand-maintained lists -- is a figure nobody re-derives.
const AUDIT_SRC = fs.readFileSync(path.join(HERE, "audit-terms.mjs"), "utf8");
function setFromSource(name) {
  const m = new RegExp("const " + name + " = new Set\\(\\[([\\s\\S]*?)\\]\\);").exec(AUDIT_SRC);
  if (!m) {
    console.error(`FAILED: could not read ${name} from audit-terms.mjs — its shape changed.`);
    process.exit(2);
  }
  return new Set([...m[1].matchAll(/'([A-Z0-9]{1,7})'/g)].map((x) => x[1]));
}
const UNIVERSAL = setFromSource("UNIVERSAL");
const ENGLISH_CAPS = setFromSource("ENGLISH_CAPS");
const ASSUMED_EXTRA = setFromSource("ASSUMED_EXTRA");
const CURRENCY = setFromSource("CURRENCY");
const classify = (a) =>
  UNIVERSAL.has(a) ? "assumed"
  : ENGLISH_CAPS.has(a) ? "not-an-initialism"
  : ASSUMED_EXTRA.has(a) ? "assumed"
  : CURRENCY.has(a) ? "assumed"
  : "domain";

/**
 * Find the expansion nearest one use, and NAME the shape it matched.
 *
 * The shape name is the point of this function. A candidate is only as trustworthy
 * as the rule that produced it, and a reviewer can check a table-cell match in
 * seconds while needing domain knowledge to check an "is-a" match. The shape is
 * carried into the output so the reviewer knows which kind of check they are doing.
 *
 * The six shapes are the ones audit-terms.mjs recognises, in the same order.
 */
function expansionAt(line, idx, acr) {
  const e = escapeRe(acr);

  // 1. Expansion then the short form: "Random Access Memory (RAM)"
  let m = new RegExp(
    "([A-Z][A-Za-z0-9]*(?:[\\s-][A-Za-z0-9]+){1,7})\\s*\\(\\s*" + e + "s?\\s*\\)",
  ).exec(line);
  if (m) return { expansion: m[1].trim(), shape: "exp-then-short" };

  // 2. Short form then a parenthesised phrase: "RAM (Random Access Memory)"
  m = new RegExp("\\b" + e + "s?\\s*\\(([A-Za-z][A-Za-z0-9 —–-]{3,})\\)").exec(line);
  if (m) return { expansion: m[1].trim(), shape: "short-then-exp" };

  // 3. A lowercase noun between: "CIDR notation (Classless Inter-Domain Routing)"
  m = new RegExp("\\b" + e + "s?\\s+[a-z][a-z0-9-]*\\s*\\(([A-Za-z][A-Za-z0-9 —–-]{3,})\\)").exec(line);
  if (m) return { expansion: m[1].trim(), shape: "noun-then-exp" };

  // 4. "MSP is a Managed Service Provider"
  m = new RegExp("\\b" + e + "s?\\s+is\\s+(?:an?|the)\\s+([A-Z][A-Za-z0-9 —–,-]{3,60})").exec(line);
  if (m) return { expansion: m[1].trim(), shape: "is-a" };

  // 5. Dash apposition: "NOC — a Network Operations Centre"
  m = new RegExp("\\b" + e + "s?\\s+[—–-]\\s+(?:an?\\s+|the\\s+)?([A-Z][A-Za-z0-9 —–,-]{3,60})").exec(line);
  if (m) return { expansion: m[1].trim(), shape: "apposition" };

  // 6. The next table cell, admitted only when its initials spell the acronym.
  //    This is the one shape with a built-in correctness check, which is why its
  //    yield was 4 of 4 while the looser shapes were far worse.
  const bar = line.indexOf("|", idx);
  if (bar !== -1) {
    const rest = line.slice(bar + 1);
    const end = rest.indexOf("|");
    const cell = (end === -1 ? rest : rest.slice(0, end)).trim();
    if (initialsSpell(cell, acr)) return { expansion: cell, shape: "table-cell" };
  }
  return null;
}

/** Do this phrase's own initials spell the acronym? */
function initialsSpell(phrase, acr) {
  const words = phrase.match(/\b[A-Z][A-Za-z-]*\b/g) || [];
  const initials = words
    .filter((w) => !JOINERS.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join("");
  return initials === acr.toUpperCase();
}

const ACRONYM = /\b[A-Z][A-Z0-9]{1,5}\b/g;
const ROMAN = /^[IVXLCM]+$/;

const files = collect();
const domainTerms = new Set();
const candidates = new Map();

for (const { key, file } of files) {
  const lines = stripCode(fs.readFileSync(file, "utf8"));
  const text = lines.join("\n");
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  const lineOf = (idx) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= idx) lo = mid; else hi = mid - 1; }
    return lo;
  };

  ACRONYM.lastIndex = 0;
  let m;
  while ((m = ACRONYM.exec(text)) !== null) {
    const acr = m[0];
    if (ROMAN.test(acr)) continue;
    if (/[0-9]/.test(acr)) continue; // ATT&CK ids, resource concatenations
    if (classify(acr) !== "domain") continue;
    domainTerms.add(acr);
    if (candidates.has(acr)) continue;
    const at = lineOf(m.index);
    const rawLine = lines[at] ?? "";
    const col = rawLine.indexOf(acr);
    const hit = expansionAt(stripEmphasis(rawLine), col >= 0 ? col : 0, acr);
    if (hit) candidates.set(acr, { ...hit, key, line: at + 1, context: rawLine.trim().slice(0, 150) });
  }
}

const rows = [...candidates.entries()]
  .map(([term, v]) => ({ term, ...v }))
  .sort((a, b) => a.term.localeCompare(b.term));

// Terms used in the corpus that the extractor could not gloss at all. This is the
// BACKLOG, and it is the larger half: 312 domain terms, 64 with any candidate.
const noCandidate = [...domainTerms].filter((t) => !candidates.has(t)).sort();

if (process.argv.includes("--json")) {
  process.stdout.write(
    JSON.stringify({ generated: "extract-glossary-candidates", domainTerms: domainTerms.size, candidates: rows, backlog: noCandidate }, null, 2) + "\n",
  );
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n);
process.stdout.write("GLOSSARY CANDIDATES — a worklist for review, not content.\n\n");
process.stdout.write(
  "Every line below is a TERM plus whatever the extractor believed its expansion to be,\n" +
    "with the file and line it came from. VERIFY EACH ONE against that line before it\n" +
    "reaches career-roadmaps/shared/GLOSSARY.md. Several are known to be wrong.\n\n",
);
process.stdout.write(`files scanned:        ${files.length}\n`);
process.stdout.write(`domain terms:         ${domainTerms.size}\n`);
process.stdout.write(`candidates found:     ${rows.length}\n`);
process.stdout.write(`no candidate found:   ${noCandidate.length}  (the backlog)\n\n`);

const byShape = new Map();
for (const r of rows) {
  if (!byShape.has(r.shape)) byShape.set(r.shape, 0);
  byShape.set(r.shape, byShape.get(r.shape) + 1);
}
process.stdout.write("candidates by shape (a reviewer trusts these differently):\n");
for (const [s, n] of [...byShape].sort((a, b) => b[1] - a[1])) {
  process.stdout.write(`  ${pad(s, 18)} ${n}\n`);
}
process.stdout.write("\n");

for (const r of rows) {
  const spell = initialsSpell(r.expansion, r.term) ? "initials-spell" : "UNVERIFIED";
  process.stdout.write(`${pad(r.term, 10)} [${pad(r.shape, 16)}] ${pad(spell, 15)}\n`);
  process.stdout.write(`  expansion: ${r.expansion}\n`);
  process.stdout.write(`  from:      ${r.key}:${r.line}\n`);
  process.stdout.write(`  context:   ${r.context}\n\n`);
}

process.stdout.write(`\n=== BACKLOG: ${noCandidate.length} domain terms with no candidate expansion ===\n`);
process.stdout.write(noCandidate.join(", ") + "\n");
