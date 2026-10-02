// Controls for audit-attack-refs.mjs.
//
// The guard exists to catch ATT&CK rot, and this repository's rule is that a guard
// which has never failed is a comment. So every branch below is proved able to fire,
// and every branch is proved able to STAY SILENT on correct content -- because the
// guard's own first draft reported three IDENTICAL technique names as renames and two
// CLI flags as renames. A guard that cries wolf on correct content is switched off, and
// a switched-off guard catches nothing.
//
// The branches, and the defect each one corresponds to:
//
//   UNKNOWN_TECHNIQUE      the rot class -- a revoked ID is REMOVED from the dataset
//   STALE_SNAPSHOT_ROW     the snapshot drifted from the corpus, the self-correcting check
//   TECHNIQUE_RENAMED      an ID survives a rename; the old word is what rots
//   RETIRED_TACTIC_IN_USE  a retired tactic still used as a heading
//   RETIRED_TACTIC_BACK    the corpus's split claim is stale in the OPPOSITE direction
//   EXPIRED                an expired snapshot, which is a check that cannot fail
//   the fail-loud paths    a missing/malformed snapshot, and an absent field
//
// The snapshot is written by the control rather than fetched, so every control is
// offline and deterministic. The builder is exercised separately, because a control
// that mocked the dataset would be testing the mock.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";

const ROOT = process.cwd();
const GUARD = "audit-attack-refs.mjs";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

/**
 * Run the guard against a scratch tree.
 *
 * The guard reads three things: `scripts/audit-attack-refs.mjs`, the snapshot at
 * `scripts/attack-snapshot.json`, and the phase files under `career-roadmaps/`. All
 * three are created here, so a control can move any one of them without touching the
 * repository.
 */
function run({ snapshot, corpus }) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "cs-attack-"));
  try {
    fs.mkdirSync(path.join(scratch, "scripts"), { recursive: true });
    fs.copyFileSync(path.join(ROOT, "scripts", GUARD), path.join(scratch, "scripts", GUARD));
    fs.writeFileSync(path.join(scratch, "scripts", "attack-snapshot.json"), JSON.stringify(snapshot, null, 2), "utf8");

    for (const [rel, body] of Object.entries(corpus)) {
      const abs = path.join(scratch, "career-roadmaps", rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, body, "utf8");
    }

    // Invoked as `scripts/<guard>`, NOT bare. The guard derives its root from
    // `import.meta.dirname`, so a bare filename makes it look for the snapshot one
    // directory too high and every control failed with "Cannot find module" -- which
    // looked like a guard problem and was a harness problem. The first draft of this
    // suite reported all thirteen controls failing at once, which is the shape of a
    // broken harness rather than thirteen broken checks.
    let code = 0;
    let out = "";
    try {
      out = execFileSync(process.execPath, [path.join("scripts", GUARD)], {
        cwd: scratch,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e) {
      code = e.status === undefined ? 1 : e.status;
      out = (e.stdout || "") + (e.stderr || "") || "";
    }
    return { code, out };
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

// --- fixtures -----------------------------------------------------------------
const future = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
const past = (days) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

/** A snapshot holding exactly what the baseline corpus below needs. */
function snapshotFor({ extra = {}, drop = [], revoked = [], taken = future(10), expires = future(40) } = {}) {
  const base = {
    _why: "control fixture",
    source: "https://example.invalid/enterprise-attack.json",
    takenOn: taken,
    expiresOn: expires,
    expiryDays: 40,
    datasetId: "bundle--control",
    counts: {},
    // Quoted, because a sub-technique ID contains a dot and `T1059.001:` is a syntax
    // error -- not a key. The first draft of this fixture failed to parse for exactly
    // that reason, which is a good reminder that a fixture nobody can even load has
    // silently tested nothing.
    techniques: {
      "T1059": { name: "Command and Scripting Interpreter", revoked: false, deprecated: false, uses: 2, firstUse: "it-roadmap/01-phase-a.md:1" },
      "T1059.001": { name: "Command and Scripting Interpreter: PowerShell", revoked: false, deprecated: false, uses: 1, firstUse: "it-roadmap/01-phase-a.md:1" },
      "T1136.001": { name: "Local Account", revoked: false, deprecated: false, uses: 1, firstUse: "it-roadmap/01-phase-a.md:1" },
      ...extra,
    },
    tactics: [
      { id: "TA0005", name: "Stealth", active: true },
      { id: "TA0112", name: "Defense Impairment", active: true },
    ],
  };
  for (const id of drop) delete base.techniques[id];
  for (const id of revoked) base.techniques[id] = { ...base.techniques[id], revoked: true };
  return base;
}

/** A corpus that exercises every name shape the guard tolerates. */
const BASELINE = {
  "it-roadmap/01-phase-a.md": [
    "# Phase 1",
    "",
    "Command and Scripting Interpreter (T1059) is the parent.",
    "PowerShell (T1059.001) is the sub-technique the reader meets first.",
    "",
    "| 4 | T1136.001 Create Local Account | Persistence |",
    "",
    "The Stealth row was Defense Evasion until ATT&CK v19 split that tactic",
    "into Stealth and Defense Impairment.",
    "",
  ].join("\n"),
};

const BASELINE_SNAPSHOT = snapshotFor();

// Read the guard's counts. The labels are matched with a tolerant pattern rather than
// the exact wording, because the first version built `` new RegExp(`${label}:\\s+(\\d+)`) ``
// from strings like "resolved" -- and the guard prints "technique IDs in corpus: 35,
// resolved: 35", so `resolved:` matches but `technique IDs in corpus:` does not, and
// every control read `null` while still reporting a plausible-looking failure.
const countOf = (out, label) => {
  const m = new RegExp(`${label}[^\\d\\n]*(\\d+)`).exec(out);
  return m ? Number(m[1]) : null;
};

// =============================================================================
console.log("=== the baseline ===");
// =============================================================================
{
  const r = run({ snapshot: BASELINE_SNAPSHOT, corpus: BASELINE });
  record(
    "control 0: a correct corpus against a correct snapshot passes",
    r.code === 0 && countOf(r.out, "resolved") === 3,
    [`exit ${r.code}; ${/resolved: \d+/.exec(r.out)?.[0] || "no count"}`],
  );
}

// =============================================================================
console.log("\n=== check 1: the rot class -- an ID the dataset does not have ===");
// =============================================================================
{
  const r = run({ snapshot: snapshotFor({ drop: ["T1059.001"] }), corpus: BASELINE });
  record(
    "a technique ID the dataset does not have is caught",
    r.code === 1 && /UNKNOWN_TECHNIQUE/.test(r.out) && /T1059\.001/.test(r.out),
    [/UNKNOWN_TECHNIQUE/.test(r.out) ? "UNKNOWN_TECHNIQUE fired" : `exit ${r.code}, no finding`],
  );
}
{
  // The shape a RETIRED ID takes: absent, not flagged. The message has to say so,
  // because "unknown" reads as a typo to a reader and "retired" reads as rot -- and
  // the fix differs.
  const r = run({ snapshot: snapshotFor({ drop: ["T1059"] }), corpus: BASELINE });
  const explains = /REMOVED from the dataset/.test(r.out);
  record(
    "an unknown ID's message distinguishes 'retired' from 'typo'",
    r.code === 1 && explains,
    [explains ? "the message explains removal" : "the message does not say the ID was removed"],
  );
}
{
  const r = run({ snapshot: snapshotFor({ revoked: ["T1059"] }), corpus: BASELINE });
  record(
    "an ID the snapshot records as revoked is caught separately from 'unknown'",
    r.code === 1 && /REVOKED_TECHNIQUE/.test(r.out),
    [/REVOKED_TECHNIQUE/.test(r.out) ? "REVOKED_TECHNIQUE fired" : `exit ${r.code}, no finding`],
  );
}

// =============================================================================
console.log("\n=== check 2: the snapshot drifted from the corpus ===");
// =============================================================================
{
  // The baseline snapshot holds exactly the three IDs the corpus uses, so nothing is
  // stale. Adding one the corpus never mentions must be caught -- that is the check
  // that keeps the committed snapshot honest between rebuilds.
  //
  // (An earlier version of this block also computed `stale` from
  // `Object.keys(...).keys()`, which is not iterable, and crashed before reaching the
  // control. The count was never read by anything.)
  const withExtra = snapshotFor({
    extra: { T9999: { name: "Never Cited", revoked: false, deprecated: false, uses: 1, firstUse: "x:1" } },
  });
  const r2 = run({ snapshot: withExtra, corpus: BASELINE });
  record(
    "a snapshot row the corpus no longer cites is caught",
    r2.code === 1 && /STALE_SNAPSHOT_ROW/.test(r2.out) && /T9999/.test(r2.out),
    [/STALE_SNAPSHOT_ROW/.test(r2.out) ? `STALE_SNAPSHOT_ROW fired on T9999` : `exit ${r2.code}, no finding`],
  );
}

// =============================================================================
console.log("\n=== check 3: a rename -- the ID survives, the word does not ===");
// =============================================================================
{
  // ATT&CK renamed it; the corpus still teaches the old name. This is the failure an
  // ID-only guard cannot see, and it is why this check exists at all.
  const renamed = snapshotFor({
    extra: { "T1059.001": { name: "Encoded Script Execution", revoked: false, deprecated: false, uses: 1, firstUse: "x:1" } },
  });
  const r = run({ snapshot: renamed, corpus: BASELINE });
  record(
    "a technique the corpus calls by its OLD name is caught",
    r.code === 1 && /TECHNIQUE_RENAMED/.test(r.out) && /T1059\.001/.test(r.out),
    [/TECHNIQUE_RENAMED/.test(r.out) ? "TECHNIQUE_RENAMED fired" : `exit ${r.code}, no finding`],
  );
}
{
  // The false positives that the guard's first draft produced, as controls. Each is
  // correct content, and each must stay silent.
  const cliArgs = {
    "it-roadmap/01-phase-a.md": [
      "# Phase 1",
      "",
      "Command and Scripting Interpreter (T1059) is the parent.",
      "PowerShell (T1059.001) is the sub-technique.",
      "",
      "```powershell",
      "Invoke-AtomicTest T1059.001 -ShowDetailsBrief",
      "Invoke-AtomicTest T1059 -TestIds T1059.001",
      "```",
      "",
      "| 4 | T1136.001 Create Local Account | Persistence |",
      "",
    ].join("\n"),
  };
  const r = run({ snapshot: BASELINE_SNAPSHOT, corpus: cliArgs });
  record(
    "a CLI flag inside a fenced block is NOT read as a technique name",
    r.code === 0,
    [r.code === 0 ? "silent" : `exit ${r.code}: ${/TECHNIQUE_RENAMED/.exec(r.out)?.[0] || "unexpected finding"}`],
  );
}
{
  // "a MITRE ATT&CK technique (T1036)" matched the name-before-ID shape and yielded
  // "CK technique" as a claimed name. The word "technique" is not part of a technique's
  // name, and this is the third of the guard's original three false positives.
  const prose = {
    "it-roadmap/01-phase-a.md": [
      "# Phase 1",
      "",
      "Command and Scripting Interpreter (T1059) is the parent.",
      "PowerShell (T1059.001) is the sub-technique.",
      "",
      "That last row introduces masquerading, a MITRE ATT&CK technique (T1059).",
      "",
      "| 4 | T1136.001 Create Local Account | Persistence |",
      "",
    ].join("\n"),
  };
  const r = run({ snapshot: BASELINE_SNAPSHOT, corpus: prose });
  record(
    "a prose lookbehind is NOT read as a technique name",
    r.code === 0,
    [r.code === 0 ? "silent" : `exit ${r.code}: ${/TECHNIQUE_RENAMED/.exec(r.out)?.[0] || "unexpected finding"}`],
  );
}
{
  // The guard reported three IDENTICAL names as renames because it filtered "and" out
  // of "Command and Scripting Interpreter" and then required a contiguous run. This
  // control is the regression test for that: the name in the corpus is character-for-
  // character what the snapshot says.
  const identical = {
    "it-roadmap/01-phase-a.md": [
      "# Phase 1",
      "",
      "| T1059 | Command and Scripting Interpreter |",
      "| T1059.001 | PowerShell |",
      "| T1136.001 | Local Account |",
      "",
    ].join("\n"),
  };
  const r = run({ snapshot: BASELINE_SNAPSHOT, corpus: identical });
  record(
    "a name character-for-character identical to the snapshot's is NOT a rename",
    r.code === 0,
    [r.code === 0 ? "silent" : `exit ${r.code}: ${/TECHNIQUE_RENAMED/.exec(r.out)?.[0] || "unexpected finding"}`],
  );
}
{
  // MITRE's STIX short name vs its website's parent-prefixed name. The corpus uses
  // both across two tables, and both are ATT&CK's own name.
  const stixShort = {
    "it-roadmap/01-phase-a.md": [
      "# Phase 1",
      "",
      "| T1059 | Command and Scripting Interpreter |",
      "| T1059.001 | Command and Scripting Interpreter: PowerShell |",
      "| T1136.001 | Create Account: Local Account |",
      "",
    ].join("\n"),
  };
  const r = run({ snapshot: BASELINE_SNAPSHOT, corpus: stixShort });
  record(
    "MITRE's website name (parent-prefixed) is accepted against its STIX short name",
    r.code === 0,
    [r.code === 0 ? "silent" : `exit ${r.code}: ${/TECHNIQUE_RENAMED/.exec(r.out)?.[0] || "unexpected finding"}`],
  );
}

// =============================================================================
console.log("\n=== check 4: tactics, and the corpus's own split claim ===");
// =============================================================================
{
  // The corpus says Defense Evasion is gone and names Stealth. If the snapshot says
  // Defense Evasion is still active, the CLAIM is wrong -- the rot class, in the
  // opposite direction, and the one a "is it still there?" check misses.
  const r = run({
    snapshot: {
      ...BASELINE_SNAPSHOT,
      tactics: [
        { id: "TA0005", name: "Defense Evasion", active: true },
        { id: "TA0112", name: "Stealth", active: true },
      ],
    },
    corpus: BASELINE,
  });
  record(
    "the corpus's split claim is checked against the snapshot, not assumed",
    r.code === 1 && /RETIRED_TACTIC_BACK/.test(r.out),
    [/RETIRED_TACTIC_BACK/.test(r.out) ? "RETIRED_TACTIC_BACK fired" : `exit ${r.code}, no finding`],
  );
}
{
  // A retired tactic still used as a section heading.
  const corpus = {
    "it-roadmap/01-phase-a.md": [
      "# Phase 1",
      "",
      "Command and Scripting Interpreter (T1059) is the parent.",
      "PowerShell (T1059.001) is the sub-technique.",
      "",
      "### Defense Evasion",
      "",
      "Where the techniques used to sit.",
      "",
      "| 4 | T1136.001 Create Local Account | Persistence |",
      "",
    ].join("\n"),
  };
  const r = run({
    snapshot: {
      ...BASELINE_SNAPSHOT,
      tactics: [
        { id: "TA0005", name: "Stealth", active: true },
        { id: "TA0112", name: "Defense Impairment", active: true },
        { id: "TA0004", name: "Defense Evasion", active: false },
      ],
    },
    corpus,
  });
  record(
    "a retired tactic used as a section heading is caught",
    r.code === 1 && /RETIRED_TACTIC_IN_USE/.test(r.out),
    [/RETIRED_TACTIC_IN_USE/.test(r.out) ? "RETIRED_TACTIC_IN_USE fired" : `exit ${r.code}, no finding`],
  );
}

// =============================================================================
console.log("\n=== check 5: the snapshot's own clock ===");
// =============================================================================
{
  // The reason the data is committed at all. An expired snapshot cannot fail, so it
  // reports success over an unexamined subject -- which is worse than no guard,
  // because a reader believes it ran.
  const r = run({ snapshot: snapshotFor({ taken: past(90), expires: past(1) }), corpus: BASELINE });
  record(
    "an expired snapshot is a named failure, not a pass",
    r.code === 1 && /EXPIRED/.test(r.out),
    [/EXPIRED/.test(r.out) ? "EXPIRED fired" : `exit ${r.code}, no finding`],
  );
}
{
  // And it must not be the ONLY thing it checks -- an expired snapshot with a
  // clean corpus still reports the corpus findings first.
  const r = run({ snapshot: snapshotFor({ taken: past(90), expires: past(1), drop: ["T1059"] }), corpus: BASELINE });
  record(
    "an expired snapshot still reports corpus findings",
    r.code === 1 && /EXPIRED/.test(r.out) && /UNKNOWN_TECHNIQUE/.test(r.out),
    [`exit ${r.code}; EXPIRED=${/EXPIRED/.test(r.out)} UNKNOWN=${/UNKNOWN_TECHNIQUE/.test(r.out)}`],
  );
}

// =============================================================================
console.log("\n=== the fail-loud paths, which are checks in their own right ===");
// =============================================================================
{
  const r = run({ snapshot: { ...BASELINE_SNAPSHOT, techniques: {} }, corpus: BASELINE });
  const named = /no "techniques"/.test(r.out);
  record(
    "an empty techniques map is a named failure, not a silent 'nothing to check'",
    r.code === 2 && named,
    [`exit ${r.code} (want 2); ${named ? "named" : "silent"}`],
  );
}
{
  const r = run({ snapshot: { ...BASELINE_SNAPSHOT, expiresOn: "not-a-date" }, corpus: BASELINE });
  const named = /unparseable/.test(r.out);
  record(
    "an unparseable snapshot date is a named failure",
    r.code === 2 && named,
    [`exit ${r.code} (want 2); ${named ? "named" : "silent"}`],
  );
}
{
  // A snapshot with no `source` is one nobody can re-derive, which is the whole reason
  // a committed snapshot is allowed to exist.
  const { source, ...noSource } = BASELINE_SNAPSHOT;
  const r = run({ snapshot: noSource, corpus: BASELINE });
  const named = /no "source"/.test(r.out);
  record(
    "a snapshot with no recorded source is a named failure",
    r.code === 2 && named,
    [`exit ${r.code} (want 2); ${named ? "named" : "silent"}`],
  );
}

// =============================================================================
console.log("\n=== the real corpus against the real snapshot ===");
// =============================================================================
{
  // `scripts/<guard>`, for the same reason as `run()` above. This control ran the bare
  // filename, so it got "Cannot find module" on every execution and read `null` for
  // every count -- and reported that as a corpus failure, which is the most expensive
  // possible misreading: a harness fault dressed up as a finding about the content.
  let code = 0;
  let out = "";
  try {
    out = execFileSync(process.execPath, [path.join("scripts", GUARD)], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    code = e.status ?? 1;
    out = (e.stdout || "") + (e.stderr || "") || "";
  }
  const used = countOf(out, "technique IDs in corpus");
  const resolved = countOf(out, "resolved");
  const names = countOf(out, "technique names checked for rename");
  record(
    "the real corpus passes, and every check actually ran",
    code === 0 && used > 0 && resolved === used && names > 0,
    [
      `exit ${code}`,
      `IDs used ${used}, resolved ${resolved}`,
      `names checked ${names} -- ${names === 0 ? "CHECK 3 IS DEAD CODE" : "check 3 is live"}`,
    ],
  );
}

// =============================================================================
const failed = results.filter((r) => !r.ok);
console.log("");
console.log(
  failed.length
    ? `${failed.length} of ${results.length} controls FAILED.`
    : `All ${results.length} controls passed. The rot class (an ID removed from the dataset), a rename\n` +
      `the corpus has not caught up with, a retired tactic, and an expired snapshot can each fail this\n` +
      `guard -- and the false positives its first draft produced stay silent.`,
);
process.exit(failed.length === 0 ? 0 : 1);