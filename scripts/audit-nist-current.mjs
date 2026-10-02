// Guard: NIST publications the curriculum links to must not be WITHDRAWN, and the
// TITLE the curriculum states for one must still be that publication's title.
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
//
// TWO ROT CLASSES, AND WHY BOTH LIVE IN ONE FILE
//
//   WITHDRAWN  the page says "Withdrawn on <date>. Superseded by <newer>".
//   RETITLED   the page is perfectly current and carries a DIFFERENT TITLE from the
//              one the corpus states.
//
// A withdrawal check cannot see a retitle, because a retitled publication carries no
// withdrawal banner. SP 800-50 Rev. 1 is the live example, and it is why this was
// found: the original SP 800-50 ("Information Security Awareness and Training") was
// withdrawn on 2024-09-12, and its replacement was not reissued under the old name --
// it was RENAMED to "Building a Cybersecurity and Privacy Learning Program". A corpus
// that cited the withdrawn URL would be caught below; a corpus that cited the LIVE url
// while still calling the document by its old name would not have been caught at all,
// because nothing about it is broken.
//
// WHY NOT A SEPARATE GUARD
//
// Both classes need the same fetch, the same plain-text parse, the same UNCHECKED
// convention, and the same URL walk. A second network guard would fetch every
// publication a second time, double CI's wall clock on the slowest part of the
// pipeline, and create two guards that could disagree about the same page -- which is
// the defect this repository has recorded more often than any other. The retitle
// check reads the page title from the response this guard has ALREADY fetched.
//
// Unlike the ATT&CK guard, this one stays LIVE rather than reading a committed
// snapshot, and that difference is not an inconsistency. NIST does not delete a
// retitled publication: the page stays, the URL resolves, and the title on it changes
// to the new one. A live read sees that immediately. ATT&CK does the opposite -- a
// revoked technique is REMOVED from the dataset, so "not found" is indistinguishable
// from a network failure and has to be committed and dated. The storage follows the
// failure mode.

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
const retitled = [];
const unchecked = [];

/**
 * The title the CORPUS states for a publication on a given line, or null.
 *
 * The corpus's citation convention is one line:
 *
 *   SP 800-50 Rev. 1, Building a Cybersecurity and Privacy Learning Program - https://...
 *
 * so the stated title is whatever sits between the designation and the URL. It is
 * frequently absent -- a bare link, or "SP 800-53 control catalogue - https://..." --
 * and null means "the corpus does not claim a title", which is not a finding. A guard
 * that reported those would be reporting its own parsing, not a defect.
 *
 * The trailing em-dash the corpus uses before the URL is stripped, and a parenthetical
 * is dropped, because neither is part of a title. Anything still trailing is dropped
 * too: the regex is deliberately generous about the START of the title and strict about
 * its END, because over-reading produces noise and under-reading misses the rot.
 */
function statedTitle(line, url) {
  const at = line.indexOf(url);
  if (at === -1) return null;
  const before = line.slice(0, at);
  const m = /SP\s*800[-‐-―]\d+[A-Za-z]*(?:[-‐-―]\d+)?(?:\s*Rev\.\s*\d+(?:[-‐-―]\d+)?)?\s*[,:]\s*(.{6,150})$/i.exec(before);
  if (!m) return null;
  let t = m[1].trim();
  t = t.replace(/\s*[—–-]\s*$/, "").trim(); // the separator before the URL
  t = t.replace(/\s*\(.*$/, "").trim(); // a parenthetical gloss
  return t.length >= 6 ? t : null;
}

/** Significant words, for comparing two titles without tripping on word order. */
const titleWords = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

/**
 * Does the corpus's stated title still match the publication's current one?
 *
 * Compared as a SET of significant words, in both directions, because the corpus
 * legitimately shortens and NIST legitimately carries a subtitle:
 *
 *   corpus "Managing Information Security Risk"
 *   NIST   "Managing Information Security Risk: Organization, Mission, and ..."
 *
 * A truncation is a match. A RENAME is not -- the words the corpus teaches are not on
 * the page at all -- and that is the rot this exists to catch.
 */
function titleAgrees(stated, current) {
  const a = titleWords(stated);
  const b = titleWords(current);
  if (!a.length || !b.length) return { ok: true, missing: [] };
  const missing = [...new Set(a)].filter((w) => !b.includes(w));
  return { ok: missing.length === 0, missing };
}

for (const [u, locs] of [...urls].sort()) {
  try {
    const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(30000) });
    if (!r.ok) {
      unchecked.push({ u, why: `HTTP ${r.status}` });
      continue;
    }
    const body = await r.text();

    // The current title, straight out of the <title> element, with the trailing
    // site name removed. This is read BEFORE the withdrawal branch on purpose: a
    // withdrawn publication's title is the OLD one, so comparing against it would
    // report a rename on every withdrawal and bury the real finding.
    const tm = /<title>\s*([^<]*?)\s*<\/title>/i.exec(body);
    const pageTitle = tm ? tm[1].replace(/\s*\|\s*CSRC\s*$/i, "").trim() : null;

    // The title the corpus states, read off a line that cites this URL. `locs` can
    // name several; each is checked, because two citations of one document can state
    // two different titles and only one of them may be stale.
    if (pageTitle && !/Withdrawn on/i.test(body)) {
      for (const loc of locs) {
        const [file, ln] = [loc.slice(0, loc.lastIndexOf(":")), Number(loc.slice(loc.lastIndexOf(":") + 1))];
        let line = "";
        try {
          line = fs.readFileSync(path.join(ROOT, file), "utf8").split("\n")[ln - 1] || "";
        } catch {
          continue;
        }
        const stated = statedTitle(line, u);
        if (!stated) continue;
        const verdict = titleAgrees(stated, pageTitle);
        if (!verdict.ok) {
          retitled.push({ u, loc, stated, current: pageTitle, missing: verdict.missing });
        }
      }
    }

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
// The retitle report comes FIRST and exits on its own, before the withdrawal report.
// A retitle and a withdrawal on the same document are not independent: a withdrawal
// usually MEANS the replacement was retitled, so reporting both at once buries the
// actionable one under the one already being fixed.
if (retitled.length) {
  console.error(`RETITLED NIST PUBLICATIONS — ${retitled.length} citation(s) name a document by a title it no longer has\n`);
  for (const t of retitled) {
    console.error(`  ${t.u}`);
    console.error(`    cited at     : ${t.loc}`);
    console.error(`    corpus says  : ${t.stated}`);
    console.error(`    now titled   : ${t.current}`);
    console.error(`    word(s) gone : ${t.missing.join(", ")}`);
    console.error("");
  }
  console.error("  Nothing about this link is broken -- it resolves, and the publication is current.");
  console.error("  That is what makes a retitle easy to miss: there is nothing to see unless you");
  console.error("  compare the NAME the corpus teaches against the NAME on the page.");
  console.error("");
  console.error("  Update the title in the corpus to the current one. If the citation is correct");
  console.error("  and the page is wrong, record why in docs/DECISIONS.md rather than editing");
  console.error("  this guard to accept it.");
  console.error("");
  process.exit(1);
}

console.log(
  `NIST LINKS CURRENT — ${urls.size} publication link(s) checked; none withdrawn, none retitled.${suffix}`,
);
console.log("");
