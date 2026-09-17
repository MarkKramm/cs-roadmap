// Guard: an open item whose prose says a DIFFERENT item's work is finished.
//
// WHY THIS EXISTS
//
// This is the third member of the family D-061/D-064 named. Two real defects had this shape:
//
//   1. `CONTENT-SCHEMA.md` said the quiz was in "10 of 31 phases" and gave a REASON
//      ("Phase 1 has no quiz because it is orientation"). All 31 have one. A stale number
//      invites a re-count; a stale reason does not. (D-064)
//   2. `CHECKPOINT.md` carried an unchecked box reading "the audit that found them is not
//      fully re-verified", whose NEXT SENTENCE said the re-verification "has now happened".
//      The box stayed open for passes because the sentence explained why it was open.
//
// Both are items that assert an incomplete state while their own text contains the
// completion. That is mechanically detectable, which is why it is a guard and not a note.
//
// WHAT IT DOES NOT DO -- and this matters, because a guard that cries wolf gets disabled:
//
//   - It does NOT flag an open box whose text describes finished work **belonging to
//     something else**. `CHECKPOINT.md:265` is legitimately open ("needs a human") while
//     reporting that the guard "now emits 274 domain terms". The 274 is the tool's output,
//     not the item's completion.
//   - It does NOT claim an open box is wrong. An open box is the author's judgement; this
//     only fails when the SAME item both denies and asserts completion.
//
// So the check is deliberately narrow: an open box that names an incomplete state AND an
// achieved one, where the achievement is introduced by a phrase that closes a loop
// ("has now happened", "is now done"). That phrasing is what made both real defects read as
// open when they were not.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS = path.join(ROOT, "docs");

// Phrases that close a loop: the work this item was waiting on has occurred.
const ACHIEVED =
  /\b(has now happened|have now happened|is now (?:done|closed|written|taught|verified)|are now (?:done|closed|written|taught|verified|built)|now been (?:done|closed|written|taught|verified)|all now (?:taught|written|closed|fixed))\b/i;
// Phrases that assert the item is still incomplete.
const INCOMPLETE = /\b(not fully|not yet|has not|have not|nobody has|never been|remains? open|still needs?|still (?:cannot|un))\b/i;

// Items that are open for a stated, legitimate reason. The pattern above is a heuristic and
// these are the shapes that read as contradictions without being one; each is justified.
//
// SCOPE MATTERS HERE, and the first draft got it wrong. These were bare regexes tested
// against the whole line, so a fixture that appended unrelated text containing "it now
// emits" made a genuine defect exempt -- the escape hatch swallowed the thing it was meant
// to let through. Each exemption is now anchored to the START of the item, where the
// subject is, rather than matching anywhere in 500 characters of prose.
const EXEMPT = [
  // "X is closed; what remains open is Y" -- a correct restatement, not a contradiction.
  // Anchored after the box marker and any bold lead-in.
  /^\s*-\s*\[ \]\s*(?:\*\*)?[^.]{0,120}?what remains open is/i,
  // Reporting a TOOL's output ("it now emits 274 terms") while the item's own work is a
  // human read. The achieved phrase belongs to the tool, not to the item. Anchored to the
  // sentence that introduces the tool, and required to be near the item's start.
  /^\s*-\s*\[ \]\s*(?:\*\*)?[^.]{0,160}?\b(?:the (?:guard|report|tool|script)|it) now (?:emits|reports|prints|shows)\b/i,
];

const findings = [];
let scanned = 0;
for (const f of fs.readdirSync(DOCS).filter((x) => x.endsWith(".md")).sort()) {
  const lines = fs.readFileSync(path.join(DOCS, f), "utf8").split("\n");
  lines.forEach((line, i) => {
    if (!/^\s*-\s*\[ \]/.test(line)) return; // unchecked box only
    scanned++;
    if (!ACHIEVED.test(line) || !INCOMPLETE.test(line)) return;
    if (EXEMPT.some((re) => re.test(line))) return;
    findings.push({ file: f, line: i + 1, text: line.trim().slice(0, 180) });
  });
}

console.log(`Open checkbox items scanned: ${scanned}`);
console.log("");
if (!findings.length) {
  console.log("OPEN-ITEM CLAIMS OK — no open item both denies and asserts its own completion.");
  process.exit(0);
}
console.error(`OPEN-ITEM CLAIMS FAILED — ${findings.length} item(s) contradict themselves:`);
console.error("");
for (const x of findings) {
  console.error(`  ${x.file}:${x.line}`);
  console.error(`      ${x.text}`);
}
console.error("");
console.error("FIX: close the item if the work is done, or remove the claim that it happened.");
process.exit(1);
