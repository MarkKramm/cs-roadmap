// Correctness test for in-lesson search.
//
// WHY THIS EXISTS
// The lesson search engine is pure: it takes one lesson's block AST and a query
// string and returns ranked hits, with no index to fetch and no network. That
// makes it cheap to run, and it also means nothing else in this repository
// proves it works. The smoke test renders blocks, the search test covers the
// corpus-wide index, and neither of them ever calls searchLesson — so a ranking
// or attribution bug would ship as a search box that quietly points the reader
// at the wrong section.
//
// The lesson below is hand-built rather than loaded from
// src/data/generated/lessons/. That directory only exists after
// `npm run build:content`, and this test must be runnable from a clean checkout
// with no build step, so it carries its own fixture. The fixture deliberately
// reproduces the shapes that have caused real bugs elsewhere in this repo: a
// sentence-final term carrying its punctuation, a nested bullet, an h5 that
// starts no section, and a block that precedes every heading.
//
// Run: node learning-site/scripts/test-lesson-search.mjs   (from the repo root)
//      node scripts/test-lesson-search.mjs                 (from learning-site/)

import { buildEntries, lessonTerms, searchLesson } from "../src/lib/lessonSearch.js";

const failures = [];
let checks = 0;

function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(label + (detail ? " — " + detail : ""));
}

// ---- The fixture lesson ----------------------------------------------------
//
// Index comments are load-bearing: several checks assert on a specific
// blockIndex, so inserting a block above one of them changes what is being
// tested.

const BLOCKS = [
  // 0 — before any heading: indexed, but with no section to jump to.
  { type: "para", text: "This phase picks up where the previous one stopped and assumes the basics are already done." },

  // 1 — h3, the first section. A heading owns itself.
  { type: "heading", level: 3, text: "Why storage forensics matters", id: "why-storage-forensics-matters" },
  // 2
  { type: "para", text: "Storage forensics answers what happened on a disk after an incident has already been contained." },

  // 3 — h4, a subsection.
  { type: "heading", level: 4, text: "The timestomp problem", id: "the-timestomp-problem" },
  // 4 — the search term sits at the END of the sentence, so the token carries a
  // period that the tokeniser has to strip.
  { type: "para", text: "The classic giveaway is that the file was timestomped." },
  // 5 — blockquote: both paragraphs must be searchable.
  { type: "quote", paras: ["Volatile data does not survive a reboot.", "Order of volatility is the rule to memorise."] },
  // 6 — fenced code.
  { type: "code", lang: "powershell", text: "auditpol /get /category:*\nGet-ScheduledTaskInfo -TaskName Backup" },
  // 7 — list with a nested child list, which is where the concrete examples live.
  {
    type: "list",
    ordered: false,
    items: [
      {
        text: "Collect the volatile evidence first.",
        children: [
          {
            type: "list",
            ordered: true,
            items: [
              { text: "Check the recycle bin for a deleted copy.", children: [] },
              { text: "Export the browser history before it rotates.", children: [] },
            ],
          },
        ],
      },
      { text: "Hash the image before you analyse it.", children: [] },
    ],
  },
  // 8 — h5: a paragraph-level label. It must NOT start a new section, so hits
  // below it stay attributed to "The timestomp problem".
  { type: "heading", level: 5, text: "A note on ordering", id: "a-note-on-ordering" },
  // 9 — table.
  {
    type: "table",
    head: ["State", "Meaning"],
    rows: [
      ["Filtered", "The packet was dropped by a rule."],
      ["Kerberos", "An authentication protocol used by Windows domains."],
    ],
  },
  // 10 — long paragraph, so the snippet window has to truncate. The term is
  // unique to this block.
  {
    type: "para",
    text:
      "The order of volatility decides what you collect first: registers and cache, then memory, " +
      "then temporary files, then the running configuration, and only at the very end the disk " +
      "itself, because every step down that list survives longer and costs less to lose if the " +
      "machine reboots before the attacker exfiltrated anything.",
  },

  // 11 — h3, the second section.
  { type: "heading", level: 3, text: "Subnet masks and CIDR", id: "subnet-masks-and-cidr" },
  // 12 — exact "subnet" and exact "mask" in one paragraph.
  { type: "para", text: "A subnet mask separates the network part of an address from the host part." },
  // 13 — "subnets" only: a prefix match, never an exact one.
  { type: "para", text: "Two subnets on the same switch still need a router to reach each other." },
  // 14 — a block type this module has no case for. It must still be searchable.
  { type: "widget", label: "quarantine queue" },
];

const ENTRIES = buildEntries(BLOCKS);

// ---- The tokeniser ---------------------------------------------------------
//
// lessonTerms must agree with queryTerms in useSearch.js, or the lesson box and
// the corpus box disagree about what the reader typed.

const termsOf = (q) => lessonTerms(q).join(",");

ok(termsOf("subnet mask") === "subnet,mask", 'two words tokenise to two terms', termsOf("subnet mask"));
ok(termsOf("Timestomped.") === "timestomped", "a term is lowercased and loses its trailing period", termsOf("Timestomped."));
ok(termsOf("risk, register?") === "risk,register", "edge punctuation separates terms", termsOf("risk, register?"));
ok(termsOf("Get-ScheduledTaskInfo") === "get-scheduledtaskinfo", "an identifier keeps its interior hyphens", termsOf("Get-ScheduledTaskInfo"));
ok(termsOf("don’t") === "don’t", "an interior curly apostrophe is part of the word", termsOf("don’t"));
ok(lessonTerms("a").length === 0, "a single character narrows nothing and is dropped");
ok(lessonTerms("").length === 0, "an empty query produces no terms");
ok(lessonTerms("   ").length === 0, "a whitespace-only query produces no terms");
ok(lessonTerms(null).length === 0, "a null query produces no terms rather than throwing");
ok(lessonTerms(undefined).length === 0, "an undefined query produces no terms rather than throwing");

// ---- buildEntries ----------------------------------------------------------

ok(ENTRIES.length === BLOCKS.length, "every block produces exactly one entry", ENTRIES.length + " of " + BLOCKS.length);

let misaligned = 0;
for (let i = 0; i < ENTRIES.length; i++) if (ENTRIES[i].blockIndex !== i) misaligned++;
ok(misaligned === 0, "every entry records its own array position", misaligned + " misaligned");

ok(ENTRIES[0].sectionId === null, "a block before the first heading has no section", String(ENTRIES[0].sectionId));
ok(ENTRIES[0].sectionText === "", "a section-less entry carries an empty section text", JSON.stringify(ENTRIES[0].sectionText));
ok(ENTRIES[1].sectionId === "why-storage-forensics-matters", "an h3 owns itself rather than the previous section", String(ENTRIES[1].sectionId));
ok(ENTRIES[2].sectionId === "why-storage-forensics-matters", "a paragraph after an h3 maps to that h3", String(ENTRIES[2].sectionId));
ok(ENTRIES[4].sectionId === "the-timestomp-problem", "a block after an h4 maps to the h4, not the h3 above it", String(ENTRIES[4].sectionId));
ok(ENTRIES[8].sectionId === "the-timestomp-problem", "an h5 starts no section and keeps the current one", String(ENTRIES[8].sectionId));
ok(ENTRIES[11].sectionId === "subnet-masks-and-cidr", "a second h3 starts a second section", String(ENTRIES[11].sectionId));
ok(ENTRIES[14].sectionId === "subnet-masks-and-cidr", "the last block keeps the section it follows", String(ENTRIES[14].sectionId));

// The list entry must contain BOTH a top-level bullet and a nested child one.
ok(ENTRIES[7].text.includes("Collect the volatile evidence first."), "a list indexes its top-level items");
ok(ENTRIES[7].text.includes("Check the recycle bin for a deleted copy."), "a list recurses into nested child items");
ok(ENTRIES[7].text.includes("Hash the image before you analyse it."), "a list indexes every top-level item, not just the first");
ok(ENTRIES[5].text.includes("reboot") && ENTRIES[5].text.includes("memorise"), "a quote joins all of its paragraphs");
ok(ENTRIES[6].text.includes("auditpol /get /category:*"), "a code block indexes its text");
ok(ENTRIES[9].text.includes("Kerberos"), "a table indexes a body cell");
ok(ENTRIES[9].text.includes("State"), "a table indexes its header cells");
ok(ENTRIES[8].text.includes("ordering"), "an h5 is still searchable even though it owns no section");
ok(ENTRIES[14].text.includes("quarantine queue"), "an unknown block type is indexed by its string content");

ok(buildEntries([]).length === 0, "buildEntries([]) returns no entries");
ok(buildEntries(null).length === 0, "buildEntries(null) returns no entries rather than throwing");
let holeOk = true;
try {
  const holed = buildEntries([null, BLOCKS[1], undefined, BLOCKS[2]]);
  holeOk = holed.length === 4 && holed[0].text === "" && holed[1].blockIndex === 1;
} catch {
  holeOk = false;
}
ok(holeOk, "a malformed block in the array does not throw and does not shift the indices");

// ---- searchLesson: section attribution -------------------------------------
//
// The whole point of recording a section is that the reader can jump to it, so a
// hit attributed to the wrong heading sends them to the wrong place.

const storage = searchLesson(ENTRIES, "storage");
ok(storage.length === 2, '"storage" is found in both the heading and the paragraph', "got " + storage.length);
ok(storage.every((h) => h.sectionId === "why-storage-forensics-matters"), '"storage" hits are attributed to the h3 that owns them',
  storage.map((h) => h.sectionId).join(", "));

const matters = searchLesson(ENTRIES, "matters");
ok(matters.length === 1 && matters[0].blockIndex === 1, "a term in a heading is found and points at the heading block",
  matters.map((h) => h.blockIndex).join(", "));

const separates = searchLesson(ENTRIES, "separates");
ok(separates.length === 1 && separates[0].sectionId === "subnet-masks-and-cidr",
  "a block after a heading maps to that heading, not the previous one",
  separates.map((h) => h.sectionId).join(", "));

const picks = searchLesson(ENTRIES, "picks");
ok(picks.length === 1, "a term in the pre-heading preamble is found", "got " + picks.length);
ok(picks.length === 1 && picks[0].sectionId === null, "a pre-heading hit is attributed safely to no section",
  picks.map((h) => String(h.sectionId)).join(", "));

// ---- searchLesson: every block type is reachable ---------------------------

const browser = searchLesson(ENTRIES, "browser");
ok(browser.length === 1 && browser[0].blockIndex === 7, "a nested list item is searchable", browser.map((h) => h.blockIndex).join(", "));

const kerberos = searchLesson(ENTRIES, "kerberos");
ok(kerberos.length === 1 && kerberos[0].blockIndex === 9, "a table cell is searchable", kerberos.map((h) => h.blockIndex).join(", "));
ok(kerberos.length === 1 && kerberos[0].sectionId === "the-timestomp-problem",
  "a hit below an h5 stays attributed to the enclosing h4 section", kerberos.map((h) => h.sectionId).join(", "));

const auditpol = searchLesson(ENTRIES, "auditpol");
ok(auditpol.length === 1 && auditpol[0].blockIndex === 6, "a code block is searchable", auditpol.map((h) => h.blockIndex).join(", "));

// "reboot" also matches "reboots" in block 10 by the stem rule (six characters,
// so the stem is "reboo"). That is the sibling engine's behaviour, not a leak —
// the assertion here is only that the QUOTE block is among the hits, and the
// stem rule itself is asserted separately below.
const reboot = searchLesson(ENTRIES, "reboot");
ok(reboot.some((h) => h.blockIndex === 5), "a quote is searchable", reboot.map((h) => h.blockIndex).join(", "));
ok(reboot.length === 2 && reboot[0].blockIndex === 5 && reboot[1].blockIndex === 10,
  "an exact hit outranks the stem-only match it pulls in", reboot.map((h) => h.blockIndex).join(", "));

const quarantine = searchLesson(ENTRIES, "quarantine");
ok(quarantine.length === 1 && quarantine[0].blockIndex === 14, "an unhandled block type is still searchable",
  quarantine.map((h) => h.blockIndex).join(", "));

// ---- searchLesson: ranking -------------------------------------------------

const subnet = searchLesson(ENTRIES, "subnet");
ok(subnet.length === 3, '"subnet" finds the heading and both paragraphs', "got " + subnet.length);
ok(subnet.length > 0 && subnet[0].blockIndex === 11, "a heading hit outranks the same hit in body prose",
  subnet.map((h) => h.blockIndex).join(", "));

const exactAt = subnet.findIndex((h) => h.blockIndex === 12);
const prefixAt = subnet.findIndex((h) => h.blockIndex === 13);
ok(exactAt >= 0 && prefixAt >= 0 && exactAt < prefixAt, "an exact match outranks a prefix-only match",
  "exact=" + exactAt + " prefix=" + prefixAt);

let descending = true;
for (let i = 1; i < subnet.length; i++) if (subnet[i].score > subnet[i - 1].score) descending = false;
ok(descending, "hits come back in descending score order");
ok(subnet.every((h) => h.blockIndex === 11 || h.blockIndex === 12 || h.blockIndex === 13),
  "no unrelated block is returned for a single-term query");

// ---- searchLesson: query semantics -----------------------------------------

const andQuery = searchLesson(ENTRIES, "subnet recycle");
ok(andQuery.length === 0, "two terms that never co-occur return nothing (AND, not OR)", "got " + andQuery.length);

const both = searchLesson(ENTRIES, "subnet mask");
ok(both.length === 2, '"subnet mask" returns only the blocks containing both terms', "got " + both.length);
ok(both.some((h) => h.blockIndex === 11) && both.some((h) => h.blockIndex === 12),
  '"subnet mask" includes both the heading and the paragraph', both.map((h) => h.blockIndex).join(", "));
ok(both.length <= subnet.length, "adding a term never widens the result set",
  "subnet=" + subnet.length + ' "subnet mask"=' + both.length);

ok(searchLesson(ENTRIES, "zzzzqqqxxyy").length === 0, "a query matching nothing returns an empty array");
ok(searchLesson(ENTRIES, "").length === 0, "an empty query returns an empty array");
ok(searchLesson(ENTRIES, "   ").length === 0, "a whitespace query returns an empty array");
ok(searchLesson([], "subnet").length === 0, "an empty entry list returns an empty array");
ok(searchLesson(null, "subnet").length === 0, "a null entry list returns an empty array rather than throwing");
ok(Array.isArray(searchLesson(ENTRIES, {})), "a non-string query returns an array rather than throwing");
ok(Array.isArray(searchLesson(ENTRIES, [])) && searchLesson(ENTRIES, []).length === 0,
  "an array query returns an empty array rather than throwing");

const upper = searchLesson(ENTRIES, "SUBNET");
ok(upper.length === subnet.length, "searching is case-insensitive",
  "SUBNET=" + upper.length + " subnet=" + subnet.length);

const typing = searchLesson(ENTRIES, "subn");
ok(typing.length === subnet.length, "a partial word matches while the reader is still typing",
  "subn=" + typing.length + " subnet=" + subnet.length);

const withStopword = searchLesson(ENTRIES, "the subnet");
ok(withStopword.length === subnet.length, "a stopword does not narrow the result set",
  '"the subnet"=' + withStopword.length + " subnet=" + subnet.length);
ok(searchLesson(ENTRIES, "the", 1).length === 1, "a query of only stopwords still returns something, capped by the limit");

const limited = searchLesson(ENTRIES, "the", 2);
ok(limited.length === 2, "the limit caps the number of hits", "got " + limited.length);

// ---- searchLesson: the snippet ---------------------------------------------

ok(subnet.every((h) => h.snippet && typeof h.snippet.before === "string" &&
  typeof h.snippet.match === "string" && typeof h.snippet.after === "string"),
  "every hit carries a before/match/after snippet");

ok(subnet.every((h) => h.snippet.match.toLowerCase().includes("subnet")),
  "the snippet's match region contains the matched term",
  subnet.map((h) => h.snippet.match).join(" | "));

ok(subnet.every((h) => h.snippet.before.length + h.snippet.match.length + h.snippet.after.length <= 220),
  "the snippet stays short enough to display",
  subnet.map((h) => h.snippet.before.length + h.snippet.match.length + h.snippet.after.length).join(", "));

// A sentence-final term carries its period in the raw text, so this is the
// regression test for the punctuation strip: without it, "timestomped." and
// "timestomped" are separate terms and the reader who types the more natural
// spelling finds nothing.
//
// "timestomped" also matches the heading "The timestomp problem" by the stem
// rule, and that is intentional — useSearch.js documents the same case for
// "timestomp" -> "timestomping". The assertion is that the EXACT hit wins.
const timestomp = searchLesson(ENTRIES, "timestomped");
ok(timestomp.some((h) => h.blockIndex === 4), '"timestomped" finds the sentence-final word',
  timestomp.map((h) => h.blockIndex).join(", "));
ok(timestomp.length > 0 && timestomp[0].blockIndex === 4,
  "the exact sentence-final hit outranks a stem-only heading match",
  timestomp.map((h) => h.blockIndex).join(", "));
ok(timestomp.length > 0 && timestomp[0].snippet.match === "timestomped",
  "the match region excludes the sentence punctuation that follows the word",
  timestomp.length ? JSON.stringify(timestomp[0].snippet.match) : "no hit");

// The stem rule itself, asserted directly: a term longer than the word on the
// page still finds it. Without this, typing more precisely returns fewer
// results, which is the bug the rule was added to fix.
const stemmed = searchLesson(ENTRIES, "timestomping");
ok(stemmed.some((h) => h.blockIndex === 4), 'a longer query term still finds the shorter word it stems to',
  stemmed.map((h) => h.blockIndex).join(", "));

const exfil = searchLesson(ENTRIES, "exfiltrated");
ok(exfil.length === 1, '"exfiltrated" finds its single long paragraph', "got " + exfil.length);
ok(exfil.length === 1 && exfil[0].snippet.before.startsWith("…"),
  "a snippet cut from the middle of a block is marked as truncated",
  exfil.length ? JSON.stringify(exfil[0].snippet.before.slice(0, 20)) : "no hit");
ok(exfil.length === 1 && exfil[0].snippet.match === "exfiltrated" && exfil[0].snippet.before.includes("reboots"),
  "a truncated snippet still carries context from before the match",
  exfil.length ? JSON.stringify(exfil[0].snippet.before.slice(-30)) : "no hit");

ok(subnet.every((h) => h.sectionId !== undefined && h.sectionText !== undefined &&
  Number.isFinite(h.blockIndex) && Number.isFinite(h.score) && h.snippet),
  "every hit carries sectionId, sectionText, blockIndex, score and snippet");

// ---- Report ----------------------------------------------------------------

console.log("lesson search fixture: " + BLOCKS.length + " blocks, " + ENTRIES.length + " entries, " +
  ENTRIES.filter((e) => e.sectionId).length + " attributed to a section");

if (failures.length) {
  console.error("\nLESSON SEARCH TEST FAILED — " + failures.length + " of " + checks + " check(s):");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log("LESSON SEARCH TEST PASSED — " + checks + " checks across the tokeniser, the entry builder, the ranker and the snippet.");