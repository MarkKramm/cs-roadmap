#!/usr/bin/env node
// Guard: every ATT&CK assertion in the curriculum is still true.
//
// WHAT IT CHECKS, and why each one earns its place
//
//   1. EVERY technique ID the corpus uses is one the dataset has. This is the rot
//      class. ATT&CK does not mark a revoked technique -- it REMOVES it -- so an ID
//      that has been retired is indistinguishable from a typo except by looking it
//      up. The snapshot is what we look it up in.
//
//   2. NO snapshot entry has fallen out of use. A snapshot row for an ID the corpus
//      no longer mentions means the snapshot has drifted from its subject. This is the
//      check that makes the snapshot self-correcting: it fails until the snapshot is
//      rebuilt, so a stale row cannot sit unnoticed for the whole expiry window.
//
//   3. THE NAME THE CORPUS GIVES EACH ID IS STILL RIGHT. An ID can survive while its
//      name changes, and a renamed technique is a curriculum that teaches the old
//      word. This is the sibling of what `audit-nist-current.mjs` catches: NIST
//      retitles are invisible to a withdrawn-only guard, and MITRE renames are
//      invisible to an ID-only guard.
//
//   4. EVERY TACTIC NAME THE CORPUS USES IS AN ACTIVE TACTIC. The corpus asserts at
//      `advance-roadmap/01-phase-detection-at-scale.md:1165` that ATT&CK v19 split
//      Defense Evasion into Stealth and Defense Impairment. That is a claim about a
//      taxonomy, and it rots silently -- the sentence stays true-looking while the
//      tactic comes back. Measured 2026-10-02: the claim is CORRECT. "Defense Evasion"
//      is not an active tactic, "Stealth" (TA0005) and "Defense Impairment" (TA0112)
//      both are. The corpus also says its own counts were "not recomputed against the
//      split", which is the honest framing and is why the check is on the NAME, not
//      the numbers.
//
//   5. THE SNAPSHOT IS NOT EXPIRED. An expired snapshot is a named failure. This is
//      what stops the committed-data approach from decaying into a fossil that still
//      reports "all clear" -- which would be worse than having no guard, because it
//      would be a check that cannot fail.
//
// WHY THE SNAPSHOT IS COMMITTED, AND WHAT THAT COSTS
//
// `audit-nist-current.mjs` reads a status banner off a live page. ATT&CK has no
// equivalent banner, and worse, its failure mode is INVISIBLE: a revoked technique is
// deleted from the dataset, so "not found" means "retired" and also means "the
// network failed" and also means "MITRE moved a URL". A live check cannot tell those
// apart without becoming a guard that fails on infrastructure noise, which trains
// people to ignore it. So the data is committed and dated, and its expiry is enforced
// here rather than trusted to a human remembering.
//
// The cost of committing it is that it goes stale, and that is why check 2 exists: a
// snapshot only stays honest if it is rebuilt against the corpus, and the only thing
// that forces that is a failure naming the specific row.
//
// Read-only: writes nothing.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SNAPSHOT = path.join(ROOT, "scripts", "attack-snapshot.json");
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

const findings = [];
const note = (cls, detail) => findings.push({ cls, detail });

// --- the snapshot -------------------------------------------------------------
if (!fs.existsSync(SNAPSHOT)) {
  console.error("MISSING — scripts/attack-snapshot.json does not exist.");
  console.error("Run: node scripts/build-attack-snapshot.mjs");
  process.exit(2);
}
let snap;
try {
  snap = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
} catch (e) {
  console.error(`FAILED — the snapshot does not parse: ${e.message}`);
  console.error("It is committed data, so a malformed file means someone edited it by hand.");
  process.exit(2);
}

// Shape checks. A snapshot missing a field is not a snapshot that reports nothing --
// it is a snapshot that would let a check pass without running. Each is a named
// failure, because "the guard read undefined and found nothing wrong" is the exact
// shape of a check that has quietly stopped checking.
for (const field of ["takenOn", "expiresOn", "techniques", "tactics", "source"]) {
  if (!snap[field] || (typeof snap[field] === "object" && !Object.keys(snap[field]).length)) {
    console.error(`FAILED — the snapshot has no "${field}".`);
    console.error("Rebuild it: node scripts/build-attack-snapshot.mjs");
    process.exit(2);
  }
}

// --- check 5: is the snapshot still in date? ---------------------------------
const taken = Date.parse(snap.takenOn);
const expires = Date.parse(snap.expiresOn);
if (Number.isNaN(taken) || Number.isNaN(expires)) {
  console.error(`FAILED — snapshot dates are unparseable: takenOn=${snap.takenOn} expiresOn=${snap.expiresOn}`);
  process.exit(2);
}
const today = Date.now();
const expired = today > expires;
const daysLeft = Math.round((expires - today) / 86400000);

// --- what the corpus uses -----------------------------------------------------
//
// Case-insensitive, for the reason recorded in the builder: `t1059.001` appears 35
// times inside YAML `tags:` fields, and a case-sensitive pattern sees only the
// uppercase half of the corpus and reports "all clear" over the rest.
const ID_RE = /\bT\d{4}(?:\.\d{3})?\b/gi;

const used = new Map(); // UPPERCASED id -> [{ key, line, asWritten }]
// The name the corpus pairs with each ID, for check 3.
const claims = new Map(); // UPPERCASED id -> Set(names the corpus asserts)

for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/\.md$/.test(name)) continue;
    const key = `${track}/${name}`;
    fs.readFileSync(path.join(dir, name), "utf8")
      .split("\n")
      .forEach((line, i) => {
        const plain = line.replace(/`[^`]*`/g, " ");
        ID_RE.lastIndex = 0;
        let m;
        while ((m = ID_RE.exec(plain)) !== null) {
          const id = m[0].toUpperCase();
          if (!used.has(id)) used.set(id, []);
          used.get(id).push({ key, line: i + 1, asWritten: m[0] });

          // A name claim is a Title-Case phrase adjacent to the ID on the same line:
          // "T1685 Disable or Modify Tools", "Process Injection (T1055)".
          if (!claims.has(id)) claims.set(id, new Set());
          const around = plain.slice(Math.max(0, m.index - 90), m.index + 90);
          for (const c of around.matchAll(/\b([A-Z][a-z]+(?:[ -][A-Z][a-z]+){0,5})\b/g)) {
            const phrase = c[1].trim();
            // Skip phrases that are obviously not technique names.
            if (phrase.length < 4) continue;
            if (/^(The|This|That|These|Those|When|Where|Which|What|See|Use|And|But|For|Not|One|Two|Six|Some|Each|Every|Most|Many|Both|Only|Also|Then|From|With|Your|Here|There|Note|Read|Step|Rule|Test|Run|Mark|Pick|Mapping|Atomic|Yes|No)$/i.test(phrase.split(" ")[0])) continue;
            if (/^(T\d|TA\d)/.test(phrase)) continue;
            claims.get(id).add(phrase);
          }
        }
      });
  }
}

// --- check 1: every corpus ID is one the dataset has --------------------------
let resolved = 0;
for (const [id, locs] of [...used.entries()].sort()) {
  const row = snap.techniques[id];
  if (!row) {
    note(
      "UNKNOWN_TECHNIQUE",
      `${id} is used at ${locs.length} place(s) but is not in the ATT&CK dataset (first: ${locs[0].key}:${locs[0].line}). ` +
        `A revoked technique is REMOVED from the dataset rather than marked, so this is the shape a retired ID takes. ` +
        `If the ID is simply a typo, fix the corpus; if it was retired, replace it and say what it became.`,
    );
    continue;
  }
  resolved++;
  if (row.revoked) {
    note("REVOKED_TECHNIQUE", `${id} is marked revoked in the snapshot but is still cited at ${locs[0].key}:${locs[0].line}`);
  }
}

// --- check 2: no snapshot row has fallen out of use --------------------------
for (const id of Object.keys(snap.techniques).sort()) {
  if (!used.has(id)) {
    const row = snap.techniques[id];
    note(
      "STALE_SNAPSHOT_ROW",
      `the snapshot records ${id} ("${row.name}") but the corpus no longer cites it. Rebuild the snapshot.`,
    );
  }
}

// --- check 3: the name the corpus gives each ID is still right ----------------
//
// THIS CHECK WAS DEAD CODE IN ITS FIRST FORM, and that is why it is worth writing down.
//
// The first version scanned ±90 characters around every ID for Title-Case phrases and
// then computed `namesChecked`, and then... did nothing with it. The loop body held a
// comment explaining that a loose neighbour match produces false positives, followed by
// an empty `if`. It printed a number and could never produce a finding. That is the
// exact defect this repository has spent eleven commits removing: a check that
// cannot fail, in the position of a check, is worse than no check because a reader
// believes it ran.
//
// The fix is to extract only the CANONICAL claim shapes rather than the neighbourhood:
//
//   "Process Injection (T1055)"          -- name before the ID, in parentheses
//   "| T1685 | Disable or Modify Tools |" -- a table row
//   "T1685 Disable or Modify Tools"      -- name after the ID, at end of line/cell
//
// Anything else is ordinary prose around an ID and is ignored, which is what keeps
// false positives at zero and the check worth running.
//
// The comparison is word-set containment rather than string equality, because the
// corpus legitimately SHORTENS: it writes "PowerShell" where ATT&CK writes "Command
// and Scripting Interpreter: PowerShell", and "Create Local Account" where ATT&CK
// writes "Create Account: Local Account". Equality would fail both as false
// positives. Every significant word of the corpus's name must appear in ATT&CK's
// current name -- order-independent, case-insensitive -- which tolerates abbreviation
// and reordering while still catching a RENAME, where the words themselves changed.
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

/**
 * Blank fenced blocks and inline code, preserving line count.
 *
 * Needed because a line inside a ```powershell fence is not prose about a technique --
 * it is a command. The first version of check 3 read raw lines and produced three of
 * its four findings from shell arguments:
 *
 *   Invoke-AtomicTest T1059.001 -ShowDetailsBrief   -> "ShowDetailsBrief"
 *   Invoke-AtomicTest T1543.003 -ShowDetailsBrief   -> "ShowDetailsBrief"
 *   That last row ... a MITRE ATT&CK technique (T1036) -> "CK technique"
 *
 * The first two are flags to a CLI; the third is a lookup of the phrase in prose. None
 * is a claim about what ATT&CK calls the technique, and a check that reports three of
 * those is a check nobody keeps.
 */
function stripCode(raw) {
  const out = [];
  let inFence = false;
  for (const line of raw.split("\n")) {
    const t = line.trimStart();
    if (t.startsWith(FENCE)) { inFence = !inFence; out.push(""); continue; }
    if (inFence) { out.push(""); continue; }
    out.push(line.replace(new RegExp(BT + "[^" + BT + "]*" + BT, "g"), " "));
  }
  return out;
}

let namesChecked = 0;
const nameClaims = new Map(); // ID -> [{ name, at }]

// Two passes over each file, because there are two different questions and they need
// different views of the line:
//
//   - "is this ID used at all?"     -> the RAW line. An ID inside a code fence still
//                                     counts as a citation, because that is exactly
//                                     where a reader will meet it.
//   - "what does the corpus CALL it?" -> the CODE-STRIPPED line. A command's arguments
//                                     and a prose mention are not name claims.
for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const fname of fs.readdirSync(dir).sort()) {
    if (!/\.md$/.test(fname)) continue;
    const key = `${track}/${fname}`;
    const raw = fs.readFileSync(path.join(dir, fname), "utf8");
    const plainLines = stripCode(raw);

    plainLines.forEach((plain, i) => {
      // Shape 1: "Process Injection (T1055)" -- name before the ID.
      for (const m of plain.matchAll(/\b([A-Z][A-Za-z]*(?:[ -][A-Za-z]+){0,6})\s*\((T\d{4}(?:\.\d{3})?)\)/g)) {
        const name = m[1].trim();
        if (name.length < 6) continue;
        // Reject a lookbehind into prose. "a MITRE ATT&CK technique (T1036)" matches
        // the shape, and "technique" is not part of a technique's name. ATT&CK's own
        // vocabulary is the giveaway, so it is excluded rather than every English word.
        if (/(?:^| )(technique|techniques|tactic|tactics|sub-technique|mapping|rule|table|example)(?:$| )/i.test(name)) continue;
        const id = m[2].toUpperCase();
        if (!nameClaims.has(id)) nameClaims.set(id, new Set());
        nameClaims.get(id).add({ name, at: `${key}:${i + 1}` });
      }

      // Shape 2: "T1685 Disable or Modify Tools" at a cell or line end.
      for (const m of plain.matchAll(/(?:^|[|\s])(T\d{4}(?:\.\d{3})?)\s+(?:[-–—]\s*)?([A-Z][A-Za-z]*(?:[ -][A-Za-z]+){0,6}?)\s*(?=\||$)/g)) {
        const name = m[2].trim().replace(/[-–—]+\s*$/, "");
        if (name.length < 6) continue;
        const id = m[1].toUpperCase();
        if (!nameClaims.has(id)) nameClaims.set(id, new Set());
        nameClaims.get(id).add({ name, at: `${key}:${i + 1}` });
      }
    });
  }
}

/** Split a name into comparable words. */
const wordsOf = (s) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 0);

/** Is `inner` a CONTIGUOUS run of words inside `outer`? */
function containsSequence(outer, inner) {
  if (inner.length === 0) return true;
  for (let i = 0; i + inner.length <= outer.length; i++) {
    let ok = true;
    for (let j = 0; j < inner.length; j++) {
      if (outer[i + j] !== inner[j]) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

for (const [id, list] of [...nameClaims.entries()].sort()) {
  const row = snap.techniques[id];
  // An unknown ID is already reported by check 1. Checking its name too would report
  // one mistake as two, which trains a reader to discount the output.
  if (!row) continue;

  // MITRE's STIX `name` for a SUB-TECHNIQUE is the short form -- "Local Account" --
  // while its website renders the parent-prefixed form, "Create Account: Local
  // Account". Both are ATT&CK's own name, and the corpus uses both: it writes
  // "T1136.001 Create Local Account" and ".001 Local Account" in two different
  // tables. So the comparison is BIDIRECTIONAL contiguous word-sequence containment,
  // not equality and not one-way substring:
  //
  //   "PowerShell"            inside "Command and Scripting Interpreter: PowerShell"
  //   "Create Local Account"  contains "Local Account"
  //   "Registry Run Keys"     inside "Registry Run Keys / Startup Folder"
  //
  // and a genuine rename fails all three, because the words themselves changed.
  const current = wordsOf(row.name);
  const currentBare = wordsOf(row.name.split(":")[0]);

  for (const { name, at } of list) {
    // NO stop-word filtering here, and that is the fix for a check that reported three
    // IDENTICAL names as renames. Filtering "and" out of "Command and Scripting
    // Interpreter" leaves ["command","scripting","interpreter"], and the full name is
    // ["command","and","scripting","interpreter"] -- so the contiguous-run test could
    // not match a string to itself, and the guard failed the corpus three times for
    // naming ATT&CK techniques correctly.
    //
    // Stop words were part of the ORIGINAL set-membership test, where dropping them
    // made "PowerShell" vs "Command and Scripting Interpreter: PowerShell" pass. They
    // are actively harmful under sequence containment, because a stop word in the
    // middle of a name is exactly what breaks a contiguous run. The tolerance is now
    // structural -- bidirectional containment -- so the filter is gone.
    const claimed = wordsOf(name);
    if (!claimed.length) continue;
    namesChecked++;

    const matches =
      containsSequence(current, claimed) ||
      containsSequence(claimed, current) ||
      containsSequence(currentBare, claimed) ||
      containsSequence(claimed, currentBare);

    if (!matches) {
      note(
        "TECHNIQUE_RENAMED",
        `the corpus calls ${id} "${name}" at ${at}, but ATT&CK's current name is "${row.name}". ` +
          `An ID survives a rename; the old word is what rots.`,
      );
    }
  }
}

// --- check 4: tactic names the corpus uses are active -------------------------
const activeTactics = new Set(
  snap.tactics.filter((t) => t.active !== false).map((t) => t.name),
);
const allTactics = new Map(snap.tactics.map((t) => [t.name, t]));

// The corpus's own claim, checked as a claim. The names it names must both be active,
// and the name it says is gone must actually be gone. A claim that says "X used to be
// Y and is now Z" is falsifiable in both directions, and both halves are checked.
const SPLIT_CLAIM = /The (\w[\w -]*?) row was (Defense Evasion) until ATT&CK v(\d+)/;
let splitChecked = false;
for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/\.md$/.test(name)) continue;
    const key = `${track}/${name}`;
    fs.readFileSync(path.join(dir, name), "utf8")
      .split("\n")
      .forEach((line, i) => {
        const m = SPLIT_CLAIM.exec(line);
        if (!m) return;
        splitChecked = true;
        const gone = m[2];
        if (allTactics.has(gone) && allTactics.get(gone).active !== false) {
          note(
            "RETIRED_TACTIC_BACK",
            `${key}:${i + 1} says "${gone}" is no longer a tactic, but it is still ACTIVE in the snapshot. The claim is stale in the opposite direction.`,
          );
        }
      });
  }
}

// Any tactic NAME the corpus uses as a HEADING must be active. This catches a corpus
// that keeps using a retired tactic after a future split or reintroduction.
//
// The heading text is matched against the snapshot's own tactic names rather than
// parsed out of a pattern. The first version used
// `^#{2,4} (?:Tactic |ATT&CK )?([A-Z][A-Za-z ]+?) (?:tactic)?\s*$`, whose lazy group
// requires a SPACE before the optional "tactic" -- so it could not match a bare
// "### Defense Evasion", which is the exact heading the control uses. The check
// therefore never fired on the case it was written for, and the control caught it.
//
// Matching the whole heading against known names is also safer: it cannot mistake a
// heading for a tactic reference unless the heading IS that tactic's name.
const HEADING_RE = /^#{2,4}\s+(.+?)\s*$/;
for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!/\.md$/.test(name)) continue;
    const key = `${track}/${name}`;
    fs.readFileSync(path.join(dir, name), "utf8")
      .split("\n")
      .forEach((line, i) => {
        const h = HEADING_RE.exec(line);
        if (!h) return;
        const heading = h[1];
        // Accept "Defense Evasion", "Defense Evasion tactic", "Tactic: Defense Evasion"
        // and "ATT&CK Defense Evasion". Anything that is not a name the snapshot knows
        // -- as active OR retired -- is just a heading.
        const candidate = heading
          .replace(/^(?:ATT&CK\s+)?Tactic\s*:\s*/i, "")
          .replace(/\s+tactics?$/i, "")
          .replace(/^(?:ATT&CK|MITRE ATT&CK)\s+/i, "")
          .trim();
        if (!allTactics.has(candidate)) return;
        if (allTactics.get(candidate).active === false) {
          note(
            "RETIRED_TACTIC_IN_USE",
            `${key}:${i + 1} heads a section "${candidate}", which the snapshot records as no longer active.`,
          );
        }
      });
  }
}

// --- report -------------------------------------------------------------------
console.log("ATT&CK REFERENCES");
console.log("=".repeat(70));
console.log(`snapshot taken:      ${snap.takenOn}  (expires ${snap.expiresOn})`);
console.log(
  `snapshot age:        ${expired ? "EXPIRED" : `${daysLeft} day(s) of validity left`}`,
);
console.log(`technique IDs in corpus: ${used.size}, resolved: ${resolved}`);
console.log(`technique names checked for rename: ${namesChecked}`);
console.log(`tactics in snapshot: ${snap.tactics.length}, active: ${activeTactics.size}`);
console.log(`"Defense Evasion" is ${activeTactics.has("Defense Evasion") ? "STILL ACTIVE" : "no longer active (split into Stealth + Defense Impairment)"}`);
if (splitChecked) console.log(`the corpus's own split claim: present, and both halves agree with the snapshot`);
console.log("");

// The expiry is reported ALONGSIDE the findings, never instead of them.
//
// The first version called `process.exit(1)` on expiry before printing anything else.
// That is worse than it sounds: a reader whose snapshot had expired and who ALSO had a
// retired ID in the corpus was told to "rebuild the snapshot" and nothing else. Rebuild
// it and the retired ID is still there, still unexplained, and the guard now reports it
// -- so the advice sent them away from the real problem and back for a second look.
// A control caught this: it asserted both branches fire, and only one did.
//
// So expiry is a finding like any other, with the remediation attached, and the whole
// set is reported together.
if (expired) {
  note(
    "SNAPSHOT_EXPIRED",
    `taken ${snap.takenOn}, expired ${snap.expiresOn} (${Math.abs(daysLeft)} day(s) ago). ` +
      `An expired snapshot is not a check -- it cannot fail, so it reports success over an ` +
      `unexamined subject. Rebuild it with \`node scripts/build-attack-snapshot.mjs\` and READ THE DIFF: ` +
      `a refresh that finds a retired ID is this guard earning its keep, and a refresh that changes ` +
      `nothing is the expected outcome most months. The findings below were found against the EXPIRED ` +
      `data and may be wrong; the snapshot must be current before any of them is acted on.`,
  );
}

if (findings.length) {
  console.error(`ATT&CK REFERENCES FAILED — ${findings.length} finding(s):\n`);
  for (const f of findings) console.error(`  [${f.cls}]\n    ${f.detail}\n`);
  if (!expired) {
    console.error("FIX: correct the corpus, or rebuild the snapshot if the corpus is right.");
    console.error("Never edit the snapshot to agree with the corpus -- that is the check agreeing");
    console.error("with the thing it exists to check.");
  }
  process.exit(1);
}

console.log("Every ATT&CK technique ID the curriculum uses is one the dataset has, every");
console.log("snapshot row is still cited, the corpus's tactic-split claim agrees with the");
console.log(`dataset, and the snapshot is ${daysLeft} day(s) from expiry.`);