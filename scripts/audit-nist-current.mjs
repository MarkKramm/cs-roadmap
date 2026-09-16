// Guard: NIST publications the curriculum links to must not be WITHDRAWN.
//
// WHY THIS EXISTS
// The framework-claims guard (D-040) catches a summary that states a retired
// VALUE. This catches the sibling failure: a citation pointing at a retired
// DOCUMENT. The link works, the page renders, HTTP 200 all the way -- and NIST
// has marked it "Withdrawn on <date>. Superseded by <newer>".
//
// Three instances were live in the corpus:
//   SP 800-61 Rev. 2   withdrawn 2025-04-03 -> Rev. 3
//   SP 800-50          withdrawn 2024-09-12 -> Rev. 1
//   SP 800-63-3        withdrawn 2017-12-01 -> Rev. 4
//
// `audit-refs.mjs` already checks that a link RESOLVES, and all three did.
// Resolution is not currency. That distinction is the whole point of this file.
//
// NETWORK DEPENDENCE, STATED PLAINLY
// This needs the network. CI has it. When a fetch fails for a reason that is
// not a withdrawal -- a timeout, a 503, a DNS hiccup -- this reports the link
// as UNCHECKED and does not fail, because failing on infrastructure noise
// trains people to ignore the guard. It fails only on a confirmed withdrawal,
// which is a fact read out of NIST's own page.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const urls = new Map(); // url -> [locations]
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) {
      const rel = path.relative(ROOT, p);
      fs.readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const m of line.matchAll(/https:\/\/csrc\.nist\.gov\/pubs\/[^\s)<]+/g)) {
            const u = m[0];
            if (!urls.has(u)) urls.set(u, []);
            urls.get(u).push(`${rel}:${i + 1}`);
          }
        });
    }
  }
}
walk(path.join(ROOT, "career-roadmaps"));

// The generated worklists QUOTE old links by design -- skip them above by only
// walking career-roadmaps/ and excluding the generated files.
for (const u of [...urls.keys()]) {
  const locs = urls.get(u);
  if (locs.every((l) => /CLAIM-VERIFICATION|claims-to-verify/.test(l))) urls.delete(u);
}

const withdrawn = [];
const unchecked = [];

for (const [u, locs] of [...urls].sort()) {
  try {
    const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (!r.ok) {
      unchecked.push({ u, why: `HTTP ${r.status}` });
      continue;
    }
    const body = await r.text();
    if (/Withdrawn on/i.test(body)) {
      // The banner markup differs between pages, so parse the WITHDRAWAL
      // SENTENCE out of the page's plain text rather than out of its tags.
      const plain = body
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ");
      const m = plain.match(
        /Withdrawn on\s+([A-Z][a-z]+ \d{1,2}, \d{4})\s*\.\s*(?:Superseded by\s+(.{0,90}?))?\s*(?:Share|Document|Date Published|$)/i,
      );
      withdrawn.push({
        u,
        locs,
        when: m ? m[1] : "(date not parsed)",
        by: m && m[2] ? m[2].trim() : "(no replacement named on the page)",
      });
    }
  } catch (e) {
    unchecked.push({ u, why: e.name || "fetch failed" });
  }
}

console.log("");
if (withdrawn.length) {
  console.log(`WITHDRAWN NIST PUBLICATIONS — ${withdrawn.length} link(s) point at a retired document`);
  console.log("");
  for (const w of withdrawn) {
    console.log(`  ${w.u}`);
    console.log(`    withdrawn ${w.when} — superseded by ${w.by}`);
    console.log(`    cited at: ${w.locs.join(", ")}`);
    console.log("");
  }
  console.log("  A withdrawn link still resolves. Check the replacement, update the");
  console.log("  citation, and confirm whether the VALUE it supports also changed.");
  console.log("");
  process.exit(1);
}

const suffix = unchecked.length
  ? ` ${unchecked.length} could not be checked this run (${unchecked.map((x) => x.why).join(", ")}).`
  : "";
console.log(
  `NIST LINKS CURRENT — ${urls.size} publication link(s) checked; none withdrawn.${suffix}`,
);
console.log("");
