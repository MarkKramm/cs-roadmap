// Controls for audit-glossary.mjs.
//
// Four checks, and each was wrong on its first run. The guard's job is to stop a
// glossary entry asserting something its own cited source contradicts, so the
// controls are about making sure it cannot pass a wrong one -- and, just as
// importantly, that it does not fail a right one.
//
// THE PROOF THAT THIS GUARD IS WORTH HAVING
//
// It earned its place before it had any controls. The first hand-written
// glossary normalised spellings -- the corpus writes "Annualised", the document
// wrote "Annual" -- and the guard refused all 47 entries, correctly. The fix was
// NOT to loosen the check; it was to quote the corpus verbatim, which is what the
// guard is for. A guard that had silently passed those entries would have shipped
// a glossary whose citations could not be trusted, and the 47 green entries would
// have been coverage in name only.
//
// The other two failures it caught were a real extractor bug (the citation is the
// line of the ACRONYM, which is not the line of the EXPANSION when a definition
// wraps) and two entries mangled by a line wrap in the source. All three were
// found by this guard rather than by reading the document.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-glossary.mjs");
const TRACK = "it-roadmap";

/**
 * A glossary document plus the corpus it cites.
 *
 * The guard reads `career-roadmaps/shared/GLOSSARY.md` and the phase files under
 * `career-roadmaps/<track>/`, and it also reads `scripts/audit-terms.mjs` for the
 * classifier lists -- so all three are copied into the scratch tree. Omitting
 * audit-terms.mjs would make the guard exit 2 on its "cannot read the classifier"
 * path, which is loud but is not the branch under test.
 */
function runOn({ glossary, phases }) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-gloss-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    copyFileSync(join(ROOT, "scripts", "audit-terms.mjs"), join(scratch, "scripts", "audit-terms.mjs"));

    const shared = join(scratch, "career-roadmaps", "shared");
    mkdirSync(shared, { recursive: true });
    writeFileSync(join(shared, "GLOSSARY.md"), glossary, "utf8");

    const dir = join(scratch, "career-roadmaps", TRACK);
    mkdirSync(dir, { recursive: true });
    for (const [name, body] of Object.entries(phases)) {
      writeFileSync(join(dir, name), body, "utf8");
    }

    let out = "";
    let code = 0;
    try {
      out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) {
      code = e.status === undefined ? 1 : e.status;
      out = (e.stdout || "") + (e.stderr || "") || "";
    }
    return { code, out };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

/**
 * The fixture corpus, written out line by line rather than assembled from pieces.
 *
 * The first version built it as `PHASE(nat) + PHASE(ou)`, and `PHASE` prepends
 * `"# Phase 1\n\n"` to whatever it is given -- so the two halves concatenated into
 * a file with the heading twice and `OU` on line 7, not line 5. The citation
 * constants below were computed by reading the file, so they were wrong, and
 * control 0 failed against a fixture the author believed was correct.
 *
 * That is the same class of error as the guard's own extractor bug -- a line
 * number assumed rather than observed -- and the same reason the line numbers are
 * now ASSERTED against the file rather than trusted.
 */
const CORPUS_LINES = [
  "# Phase 1",                                                     // 1
  "",                                                              // 2
  "NAT (Network Address Translation) rewrites addresses as traffic crosses a", // 3
  "router, so many private hosts can share one public address.",   // 4
  "",                                                              // 5
  "An **Organisational Unit (OU)** is a container in Active Directory", // 6
  "that objects live in.",                                         // 7
  "",                                                              // 8
];

/** Assert the constants against the file, so a future edit cannot desync them. */
const NAT_LINE = CORPUS_LINES.findIndex((l) => l.includes("Network Address Translation")) + 1;
const OU_LINE = CORPUS_LINES.findIndex((l) => l.includes("Organisational Unit")) + 1;
const cite = (n) => "*Sourced from `it-roadmap/01-phase-probe.md:" + n + "`.*";

const CORPUS = { "01-phase-probe.md": CORPUS_LINES.join("\n") };
const PHASE = (body) => ["# Phase 1", "", body, ""].join("\n");

/** A correct two-entry glossary citing the corpus above. */
const GOOD_GLOSSARY = [
  "# Glossary",
  "",
  "## The entries",
  "",
  "### N",
  "",
  "**NAT** — Network Address Translation.",
  "Rewrites addresses as traffic crosses a router.",
  `*Sourced from \`it-roadmap/01-phase-probe.md:${NAT_LINE}\`.*`,
  "",
  "### O",
  "",
  "**OU** — Organisational Unit.",
  "A container in Active Directory.",
  `*Sourced from \`it-roadmap/01-phase-probe.md:${OU_LINE}\`.*`,
  "",
].join("\n");

// =============================================================================
// Control 0 — the baseline.
// =============================================================================
{
  const r = runOn({ glossary: GOOD_GLOSSARY, phases: CORPUS });
  record("control 0: a correct glossary passes", r.code === 0, [
    r.out.split("\n").find((l) => /entries in GLOSSARY/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}

// =============================================================================
// Check 1 — the term must be used in the corpus.
// =============================================================================
{
  const g = GOOD_GLOSSARY.replace(
    /\*\*OU\*\*[\s\S]*$/,
    [
      "**OU** — Organisational Unit.",
      "A container in Active Directory.",
      cite(OU_LINE),
      "",
      "**XYZ** — A term the curriculum never uses.",
      "Glossed anyway.",
      cite(OU_LINE),
      "",
    ].join("\n"),
  );
  const r = runOn({ glossary: g, phases: CORPUS });
  const ok = r.code === 1 && /UNUSED_TERM/.test(r.out) && /XYZ/.test(r.out);
  record("a term the corpus never uses is caught", ok, [
    r.out.split("\n").find((l) => /XYZ/.test(l))?.trim() || `(exit ${r.code}, no XYZ finding)`,
  ]);
}

// =============================================================================
// Check 2 — the term must be a DOMAIN term, not a universal.
// =============================================================================
// `USB` is on audit-terms.mjs's UNIVERSAL list: a beginner knows it, so glossing
// it is noise. A glossary padded with universals is the same failure as the
// acronym report padded with English words — its value is that a human reads it.
{
  const g = GOOD_GLOSSARY.replace(
    /\*\*OU\*\*[\s\S]*$/,
    [
      "**USB** — Universal Serial Bus.",
      "The port everything plugs into.",
      cite(OU_LINE),
      "",
    ].join("\n"),
  );
  const body = CORPUS_LINES.join("\n") + "A USB port is on the front of every machine.\n";
  const r = runOn({ glossary: g, phases: { "01-phase-probe.md": body } });
  const ok = r.code === 1 && /NOT_A_DOMAIN_TERM/.test(r.out) && /USB/.test(r.out);
  record("a beginner-known term (USB) is caught as noise", ok, [
    r.out.split("\n").find((l) => /USB/.test(l))?.trim() || `(exit ${r.code}, no USB finding)`,
  ]);
}

// =============================================================================
// Check 3 — THE CITED LINE MUST STILL CARRY THE EXPANSION. The check that matters.
// =============================================================================
{
  // The document says one thing and the corpus says another. A guard that only
  // checked the term was USED would pass this, which is the whole reason the
  // citation check exists.
  const r = runOn({ glossary: GOOD_GLOSSARY, phases: { "01-phase-probe.md": PHASE("NAT is something else entirely, and OU is a folder.\n") } });
  const ok = r.code === 1 && /EXPANSION_NOT_AT_CITED_LINE/.test(r.out);
  record("an entry whose cited line does not contain its expansion is caught", ok, [
    `exit ${r.code}; ${(r.out.match(/EXPANSION_NOT_AT_CITED_LINE/g) || []).length} finding(s)`,
  ]);
}
{
  // The subtler version: the right expansion on the WRONG line. This is the
  // defect the guard found for real -- the extractor cites the line of the
  // acronym, which is not the line of the expansion when a definition wraps.
  const g = GOOD_GLOSSARY.replace(/01-phase-probe\.md:\d+/g, '01-phase-probe.md:6');
  const r = runOn({ glossary: g, phases: CORPUS });
  const ok = r.code === 1 && /EXPANSION_NOT_AT_CITED_LINE/.test(r.out);
  record("an entry citing the wrong line is caught even when the term is used", ok, [
    `exit ${r.code}; ${(r.out.match(/EXPANSION_NOT_AT_CITED_LINE/g) || []).length} finding(s)`,
  ]);
}

// =============================================================================
// Check 4 — the cited line must be in range.
// =============================================================================
{
  const g = GOOD_GLOSSARY.replace(/01-phase-probe\.md:\d+/g, '01-phase-probe.md:9999');
  const r = runOn({ glossary: g, phases: CORPUS });
  const ok = r.code === 1 && /CITED_LINE_OUT_OF_RANGE/.test(r.out);
  record("a citation past the end of the file is caught", ok, [
    r.out.split("\n").find((l) => /OUT_OF_RANGE/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}
{
  // A file that does not exist at all. A citation that resolves to nothing is the
  // shape of a reference nobody checked.
  const g = GOOD_GLOSSARY.replace(/it-roadmap\/01-phase-probe\.md/g, "it-roadmap/99-phase-ghost.md");
  const r = runOn({ glossary: g, phases: CORPUS });
  const ok = r.code === 1 && /CITED_FILE_MISSING/.test(r.out);
  record("a citation to a file that does not exist is caught", ok, [
    r.out.split("\n").find((l) => /CITED_FILE_MISSING/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}

// =============================================================================
// The fail-loud paths, which are checks in their own right.
// =============================================================================
{
  // A document whose entries stopped matching their own shape. Without this the
  // guard would parse zero entries and report "all good" over nothing -- the
  // `^0[1-9]-` bug wearing a different hat.
  const r = runOn({ glossary: "# Glossary\n\nProse only, no entries at all.\n", phases: CORPUS });
  record("a glossary with no parseable entries is a named failure, not a pass", r.code === 1 && /no entries matched/.test(r.out), [
    r.out.split("\n")[1]?.trim() || `(exit ${r.code})`,
  ]);
}
{
  // An entry with no citation at all. An entry nobody can check is an entry that
  // should not be allowed to exist.
  const g = GOOD_GLOSSARY.replace(/\*Sourced from `it-roadmap\/01-phase-probe\.md:3`\.\*\n/, "");
  const r = runOn({ glossary: g, phases: CORPUS });
  record("an entry with no citation is a named failure", r.code === 1 && /has no/.test(r.out), [
    r.out.split("\n").find((l) => /has no/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}
{
  // A duplicate entry for the same term.
  const g = GOOD_GLOSSARY.replace(
    /## The entries/,
    ["## The entries", "", "**NAT** — Network Address Translation.", "Again.", cite(NAT_LINE)].join("\n"),
  );
  const r = runOn({ glossary: g, phases: CORPUS });
  const ok = r.code === 1 && /DUPLICATE_ENTRY/.test(r.out);
  record("a term with two entries is caught", ok, [
    r.out.split("\n").find((l) => /DUPLICATE/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}
{
  // The classifier lists missing entirely: the guard must exit 2 and say so,
  // rather than classifying nothing as a domain term and passing.
  const scratch = mkdtempSync(join(tmpdir(), "cs-gloss-noclass-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    writeFileSync(join(scratch, "scripts", "audit-terms.mjs"), "// the lists are gone\n", "utf8");
    mkdirSync(join(scratch, "career-roadmaps", "shared"), { recursive: true });
    writeFileSync(join(scratch, "career-roadmaps", "shared", "GLOSSARY.md"), GOOD_GLOSSARY, "utf8");
    mkdirSync(join(scratch, "career-roadmaps", TRACK), { recursive: true });
    writeFileSync(join(scratch, "career-roadmaps", TRACK, "01-phase-probe.md"), CORPUS["01-phase-probe.md"], "utf8");
    let code = 0, out = "";
    try {
      out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || "") || ""; }
    record(
      "an unreadable classifier is a named failure, not a silent pass",
      code === 2 && /could not read/.test(out),
      [`exit ${code} (want 2); ${out.split("\n")[1]?.trim() || ""}`],
    );
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

// =============================================================================
// The real corpus, on the real document.
// =============================================================================
// The counts are the point. Coverage is a number a reader can see move, and the
// figure guard in CI is what stops this suite's own reporting from drifting.
{
  const out = execFileSync(process.execPath, [GUARD_REL], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  const entries = /entries in GLOSSARY\.md:\s+(\d+)/.exec(out);
  const domain = /domain terms in the corpus:\s+(\d+)/.exec(out);
  // Group 1 of the coverage line is the entry count, and it MUST equal the count
  // on the entries line. The first version compared group 2 (the domain total)
  // against the entry count, so it asserted 47 === 47 as 310 === 47 and failed
  // against a perfectly healthy document.
  const coverage = /coverage:\s+(\d+) of (\d+) \((\d+)%\)/.exec(out);
  record(
    "the real glossary passes, and its own coverage figure agrees with its entry count",
    Number(entries && entries[1]) > 0 &&
      Number(domain && domain[1]) > 0 &&
      !!coverage &&
      Number(coverage[1]) === Number(entries[1]) &&
      Number(coverage[2]) === Number(domain[1]),
    [
      entries ? entries[0].trim() : "(no entries line)",
      domain ? domain[0].trim() : "(no domain line)",
      coverage ? coverage[0].trim() : "(no coverage line)",
    ],
  );
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(failed.length
  ? `${failed.length} of ${results.length} controls FAILED.`
  : `All ${results.length} controls passed. A glossary entry cannot assert an expansion its own cited\n` +
    `source contradicts, and every fail-loud path is reachable rather than theoretical.`);
process.exit(failed.length === 0 ? 0 : 1);
