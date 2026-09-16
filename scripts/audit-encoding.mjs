// Guard: catch corrupted text encoding in the content corpus.
//
// WHY THIS EXISTS
// AGENTS.md rule 2 requires UTF-8 without BOM and real typographic characters.
// No guard checked it. During a verification pass I corrupted IT 02 with
// `Set-Content -Encoding utf8` -- a BOM plus every em-dash mangled -- and the
// only reason it was caught was that `git diff` showed 198 insertions and 198
// deletions on a one-line change. That is luck, not a guard.
//
// Then the SAME bug wrote mojibake into docs/SESSION-LOG.md, in a sentence
// *describing* mojibake, and it survived several passes. My first scan for it
// missed the corruption for a specific and instructive reason: it matched
// printable mojibake signatures, and this instance contained **U+009D**, a C1
// control character. Text that is corrupted twice can contain bytes that no
// printable-signature regex will ever list. So this guard does not enumerate
// mojibake sequences. It checks the property that actually matters:
//
//   a well-formed UTF-8 text file contains no C1 control characters.
//
// U+0080-U+009F are not valid in text. Their presence means the file has been
// through a lossy encode/decode cycle. That test is decidable, it does not need
// a list, and it catches double-encoding that a signature scan cannot.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCAN = ["docs", "career-roadmaps"];
const SKIP_DIRS = new Set(["node_modules", ".git", ".cache", "dist", "build"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(md|txt)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const findings = [];
let checked = 0;

for (const base of SCAN) {
  const root = path.join(ROOT, base);
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    checked++;
    const rel = path.relative(ROOT, file);
    const buf = fs.readFileSync(file);

    // 1. BOM. Almost always the fingerprint of a Windows shell write.
    if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
      findings.push(`${rel}: starts with a UTF-8 BOM (rule 2) — a shell write did this`);
    }

    // Decode strictly. Invalid UTF-8 throws, which is itself a finding.
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
    } catch {
      findings.push(`${rel}: not valid UTF-8`);
      continue;
    }

    // 2. C1 control characters. The decidable test for a lossy round trip.
    const c1 = [];
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c >= 0x80 && c <= 0x9f) {
        const line = text.slice(0, i).split("\n").length;
        c1.push(`line ${line}: U+${c.toString(16).toUpperCase().padStart(4, "0")}`);
      }
    }
    if (c1.length) {
      findings.push(
        `${rel}: ${c1.length} C1 control character(s) — the file has been through a lossy ` +
          `encode/decode cycle (${c1.slice(0, 3).join("; ")}${c1.length > 3 ? "; …" : ""})`,
      );
    }

    // 3. U+FFFD, the replacement character. Something was already lost.
    const fffd = (text.match(/\uFFFD/g) || []).length;
    if (fffd) {
      findings.push(`${rel}: contains ${fffd} U+FFFD replacement character(s) — bytes were lost`);
    }

    // 4. Mojibake: a typographic character that was decoded as CP1252/Latin-1
    //    and then re-encoded as UTF-8.
    //
    //    THIS CHECK IS HERE BECAUSE ITS ABSENCE WAS A REAL GAP, and the way it
    //    was found is the point. The three checks above are decidable and need
    //    no list -- but the actual defect in this repository (an em-dash stored
    //    as U+00E2 U+20AC U+201D in the committed SESSION-LOG.md) PASSES ALL
    //    THREE. It is valid UTF-8, it has no BOM, and it contains no C1
    //    control. A single round trip through CP1252 produces no control
    //    characters; only a DOUBLE round trip does, which is what the earlier
    //    IT 02 corruption did and what led me to over-trust the property test.
    //
    //    So both kinds of check are needed, and neither alone is sufficient:
    //    the structural checks catch corruption that produces impossible bytes,
    //    and this list catches corruption that produces plausible ones. The
    //    list is anchored on the leading bytes of a re-encoded multi-byte
    //    sequence, which have no legitimate reading in English prose.
    //    The third character of each sequence is the one that distinguishes
    //    what was originally there, so the class must list it exactly:
    //    U+201D right double quote, U+201C left double quote, U+2122 trade mark
    //    sign, U+2013 en-dash, U+2014 em-dash, U+00A0 nbsp, U+00A6 broken bar.
    //    Getting this list wrong is silent -- the guard simply never fires --
    //    which is why test-audit-encoding.mjs re-plants the real bytes.
    const MOJIBAKE = [
      [/\u00e2\u20ac[\u0099\u009c\u009d\u2013\u2014\u00a0\u00a6\u201d\u201c\u2122]/, "an em-dash or curly quote run through a CP1252 round trip"],
      [/\u00c3[\u00a0-\u00bf]/, "a Latin-1 accented character re-encoded as UTF-8"],
      [/\u00c2[\u00a0-\u00bf]/, "a non-breaking space or similar re-encoded as UTF-8"],
    ];
    //    Code spans are excluded, because the corpus legitimately QUOTES
    //    mojibake when documenting it (`Ã¢â‚¬`, `â€”` in DECISIONS.md and
    //    SESSION-LOG.md are deliberate illustrations). Without this the guard
    //    flags the documentation that exists to warn about the bug -- the
    //    noise problem that got the ASCII-substitute rule dropped.
    const prose = text.replace(/`[^`\n]*`/g, (s) => "\u0000".repeat(s.length));
    for (const [re, what] of MOJIBAKE) {
      const m = prose.match(new RegExp(re.source, "g"));
      if (m) {
        const line = prose.slice(0, prose.search(re)).split("\n").length;
        findings.push(
          `${rel}: ${m.length} mojibake sequence(s) — ${what} (first at line ${line}); ` +
            `a shell write did this, restore from git and re-edit with the edit tool`,
        );
      }
    }
  }
}

console.log("");
if (findings.length) {
  console.log(`ENCODING PROBLEMS — ${findings.length} finding(s) in ${checked} files`);
  console.log("");
  for (const f of findings) console.log(`  ${f}`);
  console.log("");
  process.exit(1);
}
console.log(`ENCODING OK — ${checked} files checked, no BOM, no C1 controls, no lost bytes.`);
console.log("");
