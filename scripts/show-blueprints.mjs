// Research captured while building the mock exams. Fetches the official blueprints and
// prints them, so the figures written into career-roadmaps/exams/ can be re-verified
// rather than remembered. Not a guard: the vendors' pages change, and a guard that fails
// when a vendor rebrands an exam would be noise, not signal.
//
// KNOWN LIMITATION: the ISC2 page is client-rendered, so the naive text extraction below
// finds nothing for it even though it returns HTTP 200. It is included anyway so that a
// future reader sees the source URL and knows where to look -- the CC domain weights were
// read from the page's embedded payload and corroborated against the official outline PDF
// at the link printed on career-roadmaps/exams/isc2-cc.md. A blank result here is not
// evidence the weights changed.
const SOURCES = [
  { name: "CompTIA A+ Core 1", url: "https://www.comptia.org/en-us/certifications/a/core-1-v15/" },
  { name: "CompTIA A+ Core 2", url: "https://www.comptia.org/en-us/certifications/a/core-2-v15/" },
  { name: "CompTIA Network+", url: "https://www.comptia.org/certifications/network" },
  { name: "CompTIA Security+", url: "https://www.comptia.org/certifications/security" },
  { name: "Microsoft SC-900", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-900" },
  { name: "Microsoft AZ-900", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900" },
  { name: "ISC2 CC", url: "https://www.isc2.org/certifications/cc/cc-certification-exam-outline" },
];

const clean = (h) => h
  .replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&#x27;/g, "'")
  .replace(/&amp;/g, "&").replace(/&ndash;/g, "-").replace(/&mdash;/g, "—")
  .replace(/\s+/g, " ");

for (const s of SOURCES) {
  try {
    const r = await fetch(s.url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
    const t = clean(await r.text());
    console.log(`\n=== ${s.name}  (${r.status})`);
    console.log("  " + s.url);
    const codes = [...new Set(t.match(/\b(?:220|N10|SY0|SC|AZ)-\d{3}\b/g) || [])];
    if (codes.length) console.log("  exam codes: " + codes.join(", "));
    for (const m of (t.match(/(Number of questions|Length of test|Duration|Passing score|Launch date|Retirement)[^.]{0,110}\./g) || []).slice(0, 6)) {
      console.log("    " + m.trim());
    }
    const domains = [...new Set(t.match(/([A-Z][A-Za-z ,\-/]{8,60}?)\s*\((\d{1,2}(?:[–-]\d{1,2})?%)\)/g) || [])];
    for (const d of domains.slice(0, 8)) console.log("    domain: " + d.trim());
  } catch (e) {
    console.log(`\n=== ${s.name}  FAILED: ${e.message}`);
  }
}
