#!/usr/bin/env node
// Build (or REFRESH) the dated ATT&CK snapshot the corpus guard reads.
//
// WHY A SNAPSHOT AND NOT A LIVE FETCH
//
// `audit-nist-current.mjs` fetches live and reads a status banner off the page. ATT&CK
// offers no equivalent: there is no "this technique is retired" page to check, because
// a revoked technique is simply REMOVED from the dataset. That makes the failure mode
// different from NIST's in a way that matters:
//
//   NIST   the link RESOLVES and the page says "Withdrawn". Detection is a read.
//   ATT&CK the link 404s, or the technique is absent from the dataset. Detection is
//          an ABSENCE -- and absence is exactly what a live "does this exist?" check
//          cannot distinguish from "the network hiccupped".
//
// So this guard's data is committed. That is a real cost: a committed snapshot goes
// stale, and a stale snapshot that is trusted silently stops checking anything. Three
// things keep that honest:
//
//   1. Every snapshot row is DERIVED from the corpus by this script, never typed. A
//      row for an ID the curriculum no longer uses is removed, so the snapshot cannot
//      accumulate entries nobody looks up.
//   2. The snapshot records WHEN it was taken and WHAT it was taken from, and the
//      guard FAILS once it is past its expiry. An expired snapshot is a named failure,
//      not a slow drift into uselessness.
//   3. The guard cross-checks the snapshot against the corpus in BOTH directions, so
//      a snapshot that has fallen behind shows up as "an ID in the snapshot the corpus
//      no longer uses" rather than sitting unnoticed.
//
// WHAT WAS MEASURED WHEN THIS WAS FIRST BUILT (2026-10-03)
//
//   35 distinct technique IDs, every one live.
//   15 active enterprise tactics; "Defense Evasion" is NOT among them -- ATT&CK v19
//   split it into Stealth (TA0005) and Defense Impairment (TA0112). The corpus already
//   says so, at detection-at-scale.md:1165, and that claim was CHECKED rather than
//   assumed.
//   0 revoked techniques in the dataset, because revoked ones are removed from it.
//   This is why the guard tests for ABSENCE and not for a revocation flag.
//
// Usage: node scripts/build-attack-snapshot.mjs
// Writes: scripts/attack-snapshot.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "scripts", "attack-snapshot.json");
const STIX_URL =
  "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json";

// How long a snapshot is trusted before the guard demands a refresh.
//
// Six weeks is chosen so that a refresh is a routine chore rather than an emergency.
// It is deliberately SHORTER than the curriculum's own review cadence, because the
// dataset moves monthly while this corpus is reviewed quarterly -- a snapshot that
// outlives a release cycle is not a check, it is a fossil.
const EXPIRY_DAYS = 42;

const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

// --- what the corpus uses -----------------------------------------------------
//
// The ID pattern is CASE-INSENSITIVE on purpose. `t1059.001` appears 35 times in the
// corpus inside YAML `tags:` fields, and a case-sensitive regex sees only the
// uppercase half. A guard that silently checks half its subject is worse than no
// guard, because it reports "all clear" over an unchecked half -- and that is exactly
// what the first probe of this corpus did.
const ID_RE = /\bT\d{4}(?:\.\d{3})?\b/gi;

const used = new Map(); // uppercased id -> [{ key, line, asWritten }]
for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/\.md$/.test(name)) continue;
    const key = `${track}/${name}`;
    fs.readFileSync(path.join(dir, name), "utf8")
      .split("\n")
      .forEach((line, i) => {
        ID_RE.lastIndex = 0;
        let m;
        while ((m = ID_RE.exec(line)) !== null) {
          const id = m[0].toUpperCase();
          if (!used.has(id)) used.set(id, []);
          used.get(id).push({ key, line: i + 1, asWritten: m[0] });
        }
      });
  }
}
console.log(`corpus technique IDs: ${used.size}`);

// --- what ATT&CK says ---------------------------------------------------------
const r = await fetch(STIX_URL, { signal: AbortSignal.timeout(120000) });
if (!r.ok) {
  console.error(`FAILED: could not fetch the STIX bundle (HTTP ${r.status}). Snapshot not written.`);
  process.exit(1);
}
const bundle = await r.json();

// The type is `attack-pattern`, NOT `x-mitre-attack-pattern`.
//
// The first version of this script filtered on `x-mitre-attack-pattern` -- the prefix
// the ATT&CK website's data uses in places, and the prefix on TACTICS and ANALYTICS --
// and resolved **0 of 35** corpus IDs while exiting 0. Every one of them was reported
// UNKNOWN, which would have committed a snapshot asserting that the entire curriculum
// cites 35 techniques that do not exist.
//
// A guard that produces a confident wrong answer from a mistyped filter is worse than
// one that fails, and the reason it did not fail is the real lesson: "0 resolved" was
// printed as a count, not treated as a failure. So the zero case is now an assertion,
// below, and the technique count is cross-checked against a second signal.
const TECHNIQUE_TYPE = "attack-pattern";
if (!bundle.objects.some((o) => o.type === TECHNIQUE_TYPE)) {
  console.error(`FAILED: the STIX bundle has no "${TECHNIQUE_TYPE}" objects.`);
  console.error("The dataset shape has changed, so this snapshot would record nothing as known.");
  console.error("Fix this script; do not commit a snapshot that claims every ID is unknown.");
  process.exit(2);
}

const byId = new Map();
for (const o of bundle.objects) {
  if (o.type !== TECHNIQUE_TYPE) continue;
  const ref = (o.external_references || []).find((x) => x.source_name?.startsWith("mitre-attack"));
  if (!ref) continue;
  const id = ref.external_id?.toUpperCase();
  if (!id) continue;
  // A revoked or deprecated object is NOT a usable answer. It is recorded as such so
  // the corpus can be told the difference between "this ID does not exist" and "this
  // ID was retired" -- the guard reports both, because they need different fixes.
  byId.set(id, {
    name: o.name,
    revoked: o.revoked === true,
    deprecated: o.x_mitre_deprecated === true,
  });
}
console.log(`ATT&CK techniques in the dataset: ${byId.size}`);

// A sanity floor, checked BEFORE anything is written. The corpus uses 35 IDs; a bundle
// that resolves almost none of them means the filter or the dataset shape is wrong,
// not that the curriculum is fictional. This is the assertion the first version
// lacked, and it is the specific thing that let a mistyped type string through.
const wouldResolve = [...used.keys()].filter((id) => byId.has(id)).length;
if (wouldResolve < used.size * 0.5) {
  console.error(`FAILED: only ${wouldResolve} of ${used.size} corpus IDs resolved against the dataset.`);
  console.error("That is far below the corpus's own usage, which means the reader is broken --");
  console.error("not that the curriculum cites techniques that do not exist. Snapshot not written.");
  process.exit(2);
}

const tactics = bundle.objects
  .filter((o) => o.type === "x-mitre-tactic")
  .map((o) => {
    const ref = (o.external_references || []).find((x) => x.source_name?.startsWith("mitre-attack"));
    return {
      id: ref?.external_id,
      name: o.name,
      active: !o.revoked && !o.x_mitre_deprecated,
    };
  })
  .filter((t) => t.id)
  .sort((a, b) => a.id.localeCompare(b.id));
console.log(`tactics: ${tactics.length} (${tactics.filter((t) => t.active).length} active)`);

// --- the snapshot -------------------------------------------------------------
const now = new Date();
const expiry = new Date(now.getTime() + EXPIRY_DAYS * 86400000);

const techniques = {};
const unknown = [];
const retired = [];
for (const [id, locs] of [...used.entries()].sort()) {
  const hit = byId.get(id);
  if (!hit) {
    // Not in the dataset. This is the ROT CLASS: either revoked and removed, or a
    // typo. The snapshot records it as unknown rather than dropping it, so the guard
    // has something to fail on and this script says what it found.
    unknown.push(id);
    continue;
  }
  if (hit.revoked) retired.push(id);
  techniques[id] = {
    name: hit.name,
    revoked: hit.revoked,
    deprecated: hit.deprecated,
    // Where the corpus uses it, so a reader can judge a rename without a grep.
    uses: locs.length,
    firstUse: `${locs[0].key}:${locs[0].line}`,
  };
}

const snapshot = {
  // What this is, so a reader who opens the JSON is not left guessing.
  _why:
    "Dated snapshot of the ATT&CK facts the curriculum asserts. Committed because a revoked ATT&CK technique is REMOVED from the dataset rather than marked, so absence is the only signal and absence is indistinguishable from a network failure. Read by scripts/audit-attack-refs.mjs, which fails once this file is past takenOn + expiryDays.",
  source: STIX_URL,
  takenOn: now.toISOString().slice(0, 10),
  expiryDays: EXPIRY_DAYS,
  expiresOn: expiry.toISOString().slice(0, 10),
  // The dataset version, if it declares one. Recorded so a refresh can be compared to
  // the previous one and "nothing changed" is a claim rather than an assumption.
  datasetId: bundle.id || null,
  counts: {
    corpusIds: used.size,
    inDataset: Object.keys(techniques).length,
    unknown,
    retired,
    tactics: tactics.length,
    activeTactics: tactics.filter((t) => t.active).length,
  },
  techniques,
  tactics,
};

fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
console.log(`  taken ${snapshot.takenOn}, expires ${snapshot.expiresOn} (${EXPIRY_DAYS} days)`);
console.log(`  ${Object.keys(techniques).length} of ${used.size} corpus IDs resolved`);
if (unknown.length) console.log(`  UNKNOWN (not in the dataset): ${unknown.join(", ")}`);
if (retired.length) console.log(`  RETIRED (present but revoked): ${retired.join(", ")}`);
console.log(`  ${snapshot.counts.activeTactics} active tactics`);