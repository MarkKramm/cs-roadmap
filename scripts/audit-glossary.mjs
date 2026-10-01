#!/usr/bin/env node
// Guard: career-roadmaps/shared/GLOSSARY.md must stay true to the corpus.
//
// WHAT IT CHECKS, and why each one
//
//   1. EVERY entry's term is actually used somewhere in the corpus. A glossary
//      entry for a term the curriculum never mentions is a thing a reader looks
//      up and finds anyway -- harmless, but it means the document is drifting
//      from its subject.
//
//   2. EVERY entry is one the extractor's classifier calls a DOMAIN term. A term
//      on the `UNIVERSAL` list -- `USB`, `HDMI`, `API` -- is a beginner-known
//      form, and glossing it is noise. `audit-terms.mjs` says so in its own
//      header, and this guard inherits that judgement rather than re-deriving it.
//
//   3. The entry's expansion still APPEARS at the cited source line. This is the
//      check that matters. The glossary cites `file.md:NNN` for every entry, and
//      the corpus is edited constantly; a cited line that no longer contains the
//      expansion means the document is asserting something its own source
//      contradicts. It fails, because a glossary entry that quietly stopped being
//      true is the exact failure this whole exercise exists to prevent.
//
//   4. The CITED FILE:LINE actually exists and is in range. A reference past the
//      end of a file is the shape of a citation that was never checked, and
//      `audit-refs.mjs` has already recorded that all 658 such citations in
//      `docs/` resolve -- so a new one that does not would be a regression.
//
// WHY IT REPORTS A BACKLOG RATHER THAN GATING ON IT
//
// The glossary is deliberately partial. Gating on coverage would mean either
// refusing to ship the 34 entries that ARE verified, or inventing expansions for
// the other 278 -- and inventing an expansion is the failure this document was
// built to avoid. So the backlog is printed as a number, the way
// `audit-terms.mjs` prints its population: a measurement a reader can see move.
//
// Read-only: writes nothing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, "..");
const GLOSSARY = path.join(REPO, "career-roadmaps", "shared", "GLOSSARY.md");
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

// --- the classifier, read from audit-terms.mjs rather than copied -------------
// Two hand-maintained lists copied into a second file are two figures nobody
// re-derives, which is the failure this repository has recorded more often than
// any other. This reads the source and FAILS LOUDLY if its shape changes.
const AUDIT_SRC = fs.readFileSync(path.join(HERE, "audit-terms.mjs"), "utf8");
function setFromSource(name) {
  const m = new RegExp("const " + name + " = new Set\\(\\[([\\s\\S]*?)\\]\\);").exec(AUDIT_SRC);
  if (!m) {
    console.error(`GLOSSARY AUDIT FAILED — could not read ${name} from audit-terms.mjs.`);
    console.error("Its shape changed, so this guard cannot tell a domain term from a universal one.");
    console.error("Fix this guard; do not weaken the check.");
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

if (!fs.existsSync(GLOSSARY)) {
  console.error("MISSING — career-roadmaps/shared/GLOSSARY.md does not exist.");
  process.exit(1);
}

const glossaryText = fs.readFileSync(GLOSSARY, "utf8");

// --- parse the glossary's own entries ----------------------------------------
// The entry shape is: a bolded term, an em-dash, the expansion ending in a full
// stop, then one or more lines of description, then a source line in italics.
//
// The first version anchored the expansion with `[^.]+?` and required the source
// line to be the IMMEDIATE next line. Both were wrong: several expansions contain
// a full stop, and every entry has a description paragraph between the expansion
// and its source. The result was "no entries matched the expected shape" -- the
// guard's fail-loud path, working as intended, on a parser bug rather than a
// document problem.
//
// The shape is matched in two steps instead, which is also easier to read: find
// each term heading, then take the first sentence after the em-dash as the
// expansion, and the LAST `*Sourced from ...*` line before the next entry as the
// citation. A parser that cannot match a document it was written for is a parser
// bug, and it is better that it says so than that it reports zero entries.
const ENTRY_HEAD_RE = /^\*\*([A-Z][A-Z0-9]{1,5})\*\* — (.*)$/gm;
const SOURCE_RE = /^\*Sourced from `([^`]+):(\d+)`\.\*$/;

const heads = [];
let head;
ENTRY_HEAD_RE.lastIndex = 0;
while ((head = ENTRY_HEAD_RE.exec(glossaryText)) !== null) {
  heads.push({ term: head[1], rest: head[2], at: head.index });
}

const entries = [];
for (let i = 0; i < heads.length; i++) {
  const h = heads[i];
  const end = i + 1 < heads.length ? heads[i + 1].at : glossaryText.length;
  const block = glossaryText.slice(h.at, end);

  // The expansion is the first sentence: up to a full stop followed by a space or
  // a newline. Trailing abbreviations are not an issue here because every entry
  // is written as a sentence.
  const sentence = /^(.+?[.])(?=\s|$)/.exec(h.rest);
  const expansion = sentence ? sentence[1] : h.rest.trim();

  const srcLines = block.split("\n").filter((l) => SOURCE_RE.test(l.trim()));
  const src = srcLines.length ? SOURCE_RE.exec(srcLines[srcLines.length - 1].trim()) : null;
  if (!src) {
    console.error(`GLOSSARY AUDIT FAILED — the entry for ${h.term} has no "*Sourced from \`file:line\`.*" line.`);
    console.error("Every entry must cite where its expansion came from, or it cannot be checked.");
    process.exit(1);
  }
  entries.push({ term: h.term, expansion, file: src[1], line: Number(src[2]) });
}

const findings = [];
const note = (cls, detail) => findings.push({ cls, detail });

if (entries.length === 0) {
  // A document whose entries stopped matching its own pattern is a document that
  // would silently render as prose. Fail rather than report "0 entries, all good".
  console.error("GLOSSARY AUDIT FAILED — no entries matched the expected shape.");
  console.error("If the entry format changed, update the parser here AND the guard's controls.");
  process.exit(1);
}

// --- load the corpus --------------------------------------------------------
// The subject is EVERY document a reader meets: the 31 phase files AND the
// standalone documents in `shared/`, which is where the toolbox, the free-tool map
// and the anti-burnout rules live. A term used only in `FREE-TOOL-MAP.md` is still
// a term this curriculum uses, and a glossary that ignored those files would
// report full coverage over two thirds of the corpus.
//
// The first version walked the three track directories only, and reported 307
// where the extractor reported 312. Five terms live only in the shared documents.
// Two guards counting one population differently is the defect this repository has
// recorded more often than any other, and the difference was found by the two
// numbers disagreeing -- which is the mechanism working.
const corpus = new Map(); // "track/file.md" | "shared/file.md" -> { raw, lines }
const usage = new Map(); // TERM -> [{ key, line }]

function addCorpusFile(key, abs) {
  const raw = fs.readFileSync(abs, "utf8");
  corpus.set(key, { raw, lines: raw.split("\n") });
}

for (const track of TRACKS) {
  const dir = path.join(REPO, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/^\d\d-phase-.*\.md$/.test(name)) continue;
    if (name.toUpperCase() === "GLOSSARY.MD") continue;
    addCorpusFile(`${track}/${name}`, path.join(dir, name));
  }
}
{
  // `shared/` holds the standalone documents. The glossary is excluded: it is the
  // OUTPUT of this process, so scanning it as subject would count a term
  // documented only in the glossary as a term the curriculum fails to explain --
  // and that gap could never be closed, because closing it would mean adding the
  // term to the glossary. Stated explicitly rather than left to the loop.
  const dir = path.join(REPO, "career-roadmaps", "shared");
  if (fs.existsSync(dir)) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".md")) continue;
      if (name.toUpperCase() === "GLOSSARY.MD") continue;
      addCorpusFile(`shared/${name}`, path.join(dir, name));
    }
  }
}

const ACRONYM = /\b[A-Z][A-Z0-9]{1,5}\b/g;
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

/**
 * Blank fenced blocks and inline code spans, preserving line count.
 *
 * Without this the guard counted 522 domain terms where the extractor counts 312,
 * because it was reading acronyms out of command examples: `GET`, `POST`, `PID`,
 * every AWS and PowerShell noun in a code block. Two guards counting the same
 * population differently is worse than either count, because the glossary's
 * coverage percentage is computed from this one and a reader would be told they
 * were missing 400 terms that are not terms at all.
 */
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

// The corpus, with the same two exclusions `extract-glossary-candidates.mjs`
// applies: fenced/inline code, and the syllabus sections.
//
// The syllabus exclusion is not cosmetic. "Specific topics to learn" is a table of
// contents -- it names terms the reader has NOT met yet, because meeting them is
// the point of the phase -- so counting it makes the glossary's coverage figure
// permanently short by however many terms the syllabi list. Without this the guard
// counted 310 where the extractor counts 312, and two guards disagreed about one
// population, which is a figure nobody can re-derive.
const SYLLABUS_HEADING = /^##\s+(Specific topics to learn|What to learn|Topics)\b/i;

// THE GLOSSARY IS EXCLUDED FROM ITS OWN POPULATION, and that is not a detail.
//
// The glossary is the OUTPUT of this process. Scanning it as part of the subject
// counts terms that appear nowhere else in the curriculum as if the curriculum
// were failing to explain them -- so a term documented *only* in the glossary
// inflates the backlog and depresses the coverage figure forever, with no way to
// improve it. The first version did scan it and reported 307 against the
// extractor's 312; the two guards disagreed about one population, which is the
// defect this repository has recorded more often than any other.
for (const [key, { raw }] of corpus) {
  const rawLines = stripCode(raw);
  const isSyllabus = new Array(rawLines.length).fill(false);
  let inSyllabus = false;
  for (let i = 0; i < rawLines.length; i++) {
    if (/^##\s/.test(rawLines[i])) inSyllabus = SYLLABUS_HEADING.test(rawLines[i]);
    isSyllabus[i] = inSyllabus;
  }
  rawLines.forEach((line, i) => {
    if (isSyllabus[i]) return;
    ACRONYM.lastIndex = 0;
    let a;
    while ((a = ACRONYM.exec(line)) !== null) {
      const t = a[0];
      if (/[0-9]/.test(t)) continue;
      if (/^[IVXLCM]+$/.test(t)) continue;
      if (!usage.has(t)) usage.set(t, []);
      usage.get(t).push({ key, line: i + 1 });
    }
  });
}

const domainTermsInCorpus = new Set([...usage.keys()].filter((t) => classify(t) === "domain"));
const glossed = new Set();

// --- the four checks ---------------------------------------------------------
for (const e of entries) {
  if (glossed.has(e.term)) {
    note("DUPLICATE_ENTRY", `${e.term} has more than one entry`);
    continue;
  }
  glossed.add(e.term);

  // 1. the term is used in the corpus
  if (!usage.has(e.term)) {
    note("UNUSED_TERM", `${e.term} is glossed but never appears in any phase file`);
    continue;
  }

  // 2. the term is a DOMAIN term, not a universal
  const cls = classify(e.term);
  if (cls !== "domain") {
    note("NOT_A_DOMAIN_TERM", `${e.term} is glossed but the classifier calls it "${cls}" — a beginner-known form, so glossing it is noise`);
  }

  // 3. the cited source line still contains the expansion
  const doc = corpus.get(e.file);
  if (!doc) {
    note("CITED_FILE_MISSING", `${e.term} cites ${e.file}, which is not a phase file in the corpus`);
    continue;
  }
  if (e.line < 1 || e.line > doc.lines.length) {
    note("CITED_LINE_OUT_OF_RANGE", `${e.term} cites ${e.file}:${e.line}, but the file has ${doc.lines.length} lines`);
    continue;
  }
  const cited = doc.lines[e.line - 1].replace(/\*+/g, "");
  // The comparison is deliberately narrow, and every narrowing is a case that
  // failed loudly first:
  //
  //   - TRAILING PUNCTUATION IS STRIPPED. The glossary writes "…expectancy." and
  //     the corpus writes "…expectancy (ALE)". Comparing the full stop made all 47
  //     entries fail against correct source lines.
  //   - THE HEAD BEFORE AN EM-DASH IS COMPARED, not the whole string. The corpus
  //     writes "Role-Based Access Control — which is how least privilege is a
  //     thing", and the entry trims the trailing clause.
  //   - THE FIRST FEW WORDS ONLY, because an entry may legitimately shorten a
  //     long gloss.
  //   - CASE-INSENSITIVELY, because the corpus capitalises a table-cell expansion
  //     that the entry renders as a sentence.
  //
  // Each of these makes the check weaker, so the question each one answers is
  // whether it can hide a WRONG expansion. None can: an expansion that is wrong
  // is wrong in its first words too, and a citation pointing at a line that does
  // not contain the term's own expansion is exactly what must fail.
  const head = e.expansion
    .replace(/[.,;:]+$/, "")
    .split(/\s+—|\s+–/)[0]
    .trim();
  const headWords = head.split(/\s+/).slice(0, 4).join(" ").toLowerCase();
  const citedFlat = cited.replace(/\s+/g, " ").toLowerCase();
  if (!citedFlat.includes(headWords)) {
    note(
      "EXPANSION_NOT_AT_CITED_LINE",
      `${e.term} cites ${e.file}:${e.line}, but "${headWords}" is not on that line — the expansion and its source disagree`,
    );
  }
}

// --- report ------------------------------------------------------------------
const missingFromGlossary = [...domainTermsInCorpus].filter((t) => !glossed.has(t)).sort();
const coverage = domainTermsInCorpus.size
  ? Math.round((glossed.size / domainTermsInCorpus.size) * 100)
  : 0;

console.log("GLOSSARY AUDIT");
console.log("=".repeat(64));
console.log(`entries in GLOSSARY.md:          ${entries.length}`);
console.log(`domain terms in the corpus:       ${domainTermsInCorpus.size}`);
console.log(`coverage:                         ${glossed.size} of ${domainTermsInCorpus.size} (${coverage}%)`);
console.log(`terms with no entry (the backlog): ${missingFromGlossary.length}`);
console.log("");

if (findings.length) {
  console.error(`GLOSSARY AUDIT FAILED — ${findings.length} finding(s):\n`);
  for (const f of findings) console.error(`  [${f.cls}]\n    ${f.detail}`);
  console.error("\nFIX: correct the glossary entry, or correct the corpus. Never edit this guard to agree.");
  process.exit(1);
}

console.log("Every entry is a domain term the curriculum actually uses, and every cited line");
console.log("still carries the expansion it claims. The backlog above is a measurement, not a");
console.log("finding -- the glossary is deliberately partial, and the number is here so it moves.");
