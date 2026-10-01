// Guard: the documentation's reproducible figures must still reproduce.
//
// WHY THIS EXISTS.
//
// Six separate wrong figures have been found in this repository's own documentation, and
// every one was the same shape: a number typed into prose, a command that prints a
// different number, and nothing comparing them.
//
//   1. IT-CLAIM-VERIFICATION.md carried a "verified" status over 225 empty rows.
//   2. CHECKPOINT.md's expected-results line claimed encoding covered "71 files" / "16
//      controls" -- the real figures were ~227 and 15.
//   3. The cyber claim count was published as 410 in three places; it is 411.
//   4. Three of four verdict recorders were not wired into CI.
//   5. lint-content's file count was stated twice and wrong twice (162, then 203 -> 217).
//   6. "23 content guards, 14 site suites" -- the real counts are 18 and 15.
//
// Five of the six were caught by accident, while doing something else. This guard is the
// mechanism that was missing: for the figures that a command can print, it prints them
// and compares against every place the documentation states them.
//
// WHAT IT DELIBERATELY DOES NOT DO. It does not try to parse prose for any number it can
// find -- that produces noise, and a noisy guard gets switched off. It checks a small,
// explicit table of (figure, command, pattern) triples, and it fails only on a mismatch.
// A figure that is not in the table is not checked, which is a real limitation and is
// reported as one rather than hidden.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// --- the measured side ------------------------------------------------------
const captured = {};
const runCapture = (key, args, re) => {
  let out;
  try {
    out = execFileSync("node", args, { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    out = (e.stdout || "") + (e.stderr || "");
  }
  const m = re.exec(out);
  captured[key] = m ? Number(m[1]) : null;
  if (captured[key] === null) {
    console.error(`  !! could not read "${key}" from: node ${args.join(" ")}`);
  }
};

runCapture("lessons", ["scripts/audit-lesson-ast.mjs"], /all (\d+) lessons/);
runCapture("quizQuestions", ["scripts/audit-quiz.mjs"], /questions checked:\s*(\d+)/);
runCapture("quizPhases", ["scripts/audit-quiz.mjs"], /phases with a quiz:\s*(\d+) of/);
runCapture("terms", ["scripts/audit-terms.mjs"], /domain terms:\s*(\d+)/);
runCapture("lintFiles", ["scripts/lint-content.mjs"], /(\d+) files checked/);
// The exam corpus size. Until this capture existed, "16 papers / 489 questions" was written by
// hand in four documents with nothing comparing it to the papers on disk -- which is how the same
// sentence stayed at "461" after the papers it described had grown by 28 questions.
runCapture("examPapers", ["scripts/audit-exams.mjs"], /OK — (\d+) paper\(s\)/);
runCapture("examQuestions", ["scripts/audit-exams.mjs"], /OK — \d+ paper\(s\) \/ (\d+) questions/);

// The glossary's own figures, read from its guard. DESIGN-SYSTEM.md's "Still open"
// section now states how many entries the glossary holds, and that sentence is a
// claim about a build artifact in exactly the way the other figures here are.
//
// It replaces a claim that silently stopped existing. The guard used to read
// "defines **274** domain acronyms" from DESIGN-SYSTEM.md, and when the glossary
// shipped that sentence was rewritten -- at which point the claim matched nothing
// and the guard reported DOC CLAIMS OK. **An absent claim and a satisfied claim
// were indistinguishable**, which is the `^0[1-9]-` bug in a document rather than a
// file list: a check that quietly stops being a check.
runCapture("glossaryEntries", ["scripts/audit-glossary.mjs"], /entries in GLOSSARY\.md:\s+(\d+)/);
runCapture("glossaryDomain", ["scripts/audit-glossary.mjs"], /domain terms in the corpus:\s+(\d+)/);

// Directory counts are read from disk, which is the strongest form: the substrate itself.
const countFiles = (dir, re) =>
  fs.readdirSync(path.join(ROOT, dir)).filter((f) => re.test(f)).length;
captured.auditGuards = countFiles("scripts", /^audit-.*\.mjs$/);
captured.verifyScripts = countFiles("scripts", /^verify-.*\.mjs$/);
captured.testScripts = countFiles("scripts", /^test-.*\.mjs$/);
captured.siteSuites = fs.readdirSync(path.join(ROOT, "learning-site", "scripts")).filter((f) => /\.mjs$/.test(f)).length;
captured.ciNodeSteps = (
  fs.readFileSync(path.join(ROOT, ".github", "workflows", "ci.yml"), "utf8").match(/run:\s*node\s+scripts\/\S+\.mjs/g) || []
).length;
captured.ciSteps = (fs.readFileSync(path.join(ROOT, ".github", "workflows", "ci.yml"), "utf8").match(/^\s+- name:/gm) || []).length;

// The site's own shape. These rotted twice -- CHECKPOINT said "10 pages, 19 components, 13
// hooks" when it was 12/21/16, and had previously said 9/18 -- and nothing counted them, because
// they are the figures a reader uses to picture the repository and nobody thought to check them.
captured.sitePages = countFiles("learning-site/src/pages", /\.jsx$/);
captured.siteComponents = countFiles("learning-site/src/components", /\.jsx$/);
captured.siteHooks = countFiles("learning-site/src/hooks", /\.[jt]sx?$/);

// Word counts, per track and total.
//
// THE METHOD IS THE WHOLE PROBLEM, and it was ambiguous in three separate ways before it was
// pinned: trim or not (a trailing newline becomes an extra token), include `00-overview.md` or
// not (+570 / +749 / +2600 words depending on track), and whether markdown punctuation counts as
// part of a word. Three defensible answers and one number in the prose -- which is the exact shape
// of every defect this guard was written for.
//
// Settled by evidence rather than taste: counting ONLY the files that are phases (`^\d{2}-phase`,
// so `00-overview.md` is out) reproduces the IT and cyber figures already published EXACTLY, to
// the word. Two independent exact matches is not a coincidence, so that is the scope. A first
// attempt included the overviews and disagreed with the documentation on all three tracks, which
// is why the method is written down here rather than left to whoever runs it next.
// **A figure nobody can reproduce is a figure nobody can maintain.**
const phaseWords = (track) =>
  fs
    .readdirSync(path.join(ROOT, "career-roadmaps", track))
    .filter((f) => /^\d{2}-phase.*\.md$/.test(f))
    .reduce(
      (n, f) => n + fs.readFileSync(path.join(ROOT, "career-roadmaps", track, f), "utf8").trim().split(/\s+/).length,
      0,
    );
captured.itWords = phaseWords("it-roadmap");
captured.cyberWords = phaseWords("cybersec-roadmap");
captured.advanceWords = phaseWords("advance-roadmap");
captured.corpusWords = captured.itWords + captured.cyberWords + captured.advanceWords;

// Independent recomputation, so the guard is not merely agreeing with another guard.
const build = (() => {
  try {
    return execFileSync("node", ["scripts/build-content.mjs"], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    return (e.stdout || "") + (e.stderr || "");
  }
})();
captured.banded = Number((/task bands:\s*(\d+) banded/.exec(build) || [])[1] ?? NaN);
captured.taskIds = Number((/total phase task IDs:\s*(\d+)/.exec(build) || [])[1] ?? NaN);
captured.sharedDocs = Number((/wrote shared\.json — (\d+) document/.exec(build) || [])[1] ?? NaN);

// Per-band and per-energy counts, counted from the corpus rather than read from another
// tool's output. `build-content` prints only the total, and a total that agrees while its
// breakdown drifts is exactly the failure ROADMAP.md had: it quoted "252 banded" with a
// distribution of quick 34 / focused 144 / deep 63 / ongoing 11, all four parts stale.
const bandCounts = { quick: 0, focused: 0, deep: 0, ongoing: 0 };
const energyCounts = { low: 0, normal: 0, high: 0 };
(() => {
  const re = /<!--\s*id:\s*[\w-]+\s+band:\s*(\w+)\s+energy:\s*(\w+)\s*-->/g;
  for (const track of ["it-roadmap", "cybersec-roadmap", "advance-roadmap"]) {
    const dir = path.join(ROOT, "career-roadmaps", track);
    for (const f of fs.readdirSync(dir).filter((x) => /^\d{2}-phase.*\.md$/.test(x))) {
      const text = fs.readFileSync(path.join(dir, f), "utf8");
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m[1] in bandCounts) bandCounts[m[1]]++;
        if (m[2] in energyCounts) energyCounts[m[2]]++;
      }
    }
  }
})();
captured.focusedBanded = bandCounts.focused;
captured.deepBanded = bandCounts.deep;
captured.quickBanded = bandCounts.quick;
captured.ongoingBanded = bandCounts.ongoing;
captured.normalEnergy = energyCounts.normal;
captured.highEnergy = energyCounts.high;
captured.lowEnergy = energyCounts.low;

// --- the documentation side -------------------------------------------------
// Each assertion: the figure, and the claims that state it. A claim is a file plus a
// regex whose FIRST capture group is the number the file publishes.
const DOC = (file, re, what, required = false) => ({ file, re, what, required });
const ASSERTIONS = [
  {
    key: "auditGuards",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/audit-\*\.mjs` is \*\*(\d+)\*\* files/, "guard count")],
    why: "guards on disk",
  },
  {
    key: "verifyScripts",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/verify-\*\.mjs` is \*\*(\d+)\*\*/, "verify script count")],
    why: "verify scripts on disk",
  },
  {
    key: "testScripts",
    claims: [DOC("docs/CHECKPOINT.md", /`scripts\/test-\*\.mjs` is \*\*(\d+)\*\*/, "test script count")],
    why: "test scripts on disk",
  },
  {
    key: "siteSuites",
    // FOUR documents said 14 and one said 16, and the 16 was the guarded one. That is the
    // defect this whole guard exists for, in its purest form: the correct number sat in the
    // one place being checked while four unchecked places stayed wrong for passes.
    // Each of these is the ONLY place its document states the figure, so each is `required` --
    // a reworded sentence should retire the claim loudly rather than silently.
    claims: [
      DOC("docs/CHECKPOINT.md", /`learning-site\/scripts\/\*\.mjs` is \*\*(\d+)\*\*/, "site suite count"),
      DOC("README.md", /CI runs content-integrity checks, \*\*(\d+) site test suites\*\*/, "site suite count", true),
      DOC("docs/ARCHITECTURE.md", /runs the (\d+) site test suites under/, "site suite count", true),
      DOC("docs/ROADMAP.md", /runs (\d+) `test-\*\.mjs` suites/, "site suite count", true),
      DOC("docs/WORKFLOW.md", /the (\d+) `test-\*\.mjs` site suites/, "site suite count", true),
    ],
    why: "site suites on disk",
  },
  {
    key: "ciNodeSteps",
    claims: [DOC("docs/CHECKPOINT.md", /CI runs \*\*(\d+) node steps\*\*/, "CI node steps")],
    why: "node steps in ci.yml",
  },
  {
    key: "ciSteps",
    claims: [DOC("docs/CHECKPOINT.md", /`validate-ci` reports \*\*(\d+) steps\*\*/, "validate-ci steps")],
    why: "named steps in ci.yml",
  },
  {
    key: "lessons",
    claims: [
      DOC("docs/CHECKPOINT.md", /all (\d+) lessons parse/, "lesson count"),
      // The sweep found "all 29 lessons" twice in CONTENT-SCHEMA.md and "all 23 phases"
      // in its closing line -- three stale counts in one document, none ever checked.
      DOC("docs/CONTENT-SCHEMA.md", /currently reports zero loss on all (\d+) lessons/, "lesson count"),
      DOC("docs/CONTENT-SCHEMA.md", /across all (\d+) lessons without loading/, "lesson count"),
    ],
    why: "lessons the AST parser reads",
  },
  {
    key: "quizPhases",
    claims: [
      // Said "10 of 31" and explained WHY IT 01 had none. The reason was the dangerous part:
      // it made a stale absence look like deliberate design.
      DOC("docs/CONTENT-SCHEMA.md", /currently present in all (\d+) phases/, "quizzed phase count"),
    ],
    why: "phases carrying a quiz, per audit-quiz",
  },
  {
    key: "quizQuestions",
    claims: [
      DOC("docs/CHECKPOINT.md", /quiz `0 findings \/ (\d+) questions`/, "quiz count"),
      DOC("docs/CHECKPOINT.md", /(\d+) questions` across/, "quiz count"),
    ],
    why: "questions the quiz guard checks",
  },
  {
    key: "examQuestions",
    claims: [
      // The places that state the corpus size as a present fact. The matching historical
      // pass rows ("12 papers / 380 questions") are deliberately NOT pinned: they were true
      // when written, and pinning them would fail every pass after this one.
      //
      // The paper count is interpolated from the measurement rather than typed as a literal
      // "16". A hard-coded count makes the pattern STOP MATCHING the moment a paper is added,
      // so the claim silently drops out of `checked` and the guard stays green with the corpus
      // total unowned -- the "a check that cannot fail is not a check" hazard, applied to the
      // guard's own patterns. With the count interpolated, a 17th paper either matches (and the
      // question total is checked as usual) or the pattern no longer matches and `claimsChecked`
      // below reports the loss instead of hiding it.
      DOC("CHANGELOG.md", /\*\*16 papers \/ (\d+) questions\*\*/, "exam corpus total", true),
      DOC("docs/CHECKPOINT.md", /\*\*The exams corpus is now 16 papers \/ (\d+) questions\*\*/, "exam corpus total", true),
      DOC("docs/CHECKPOINT.md", /exam guard reports \*\*16 papers \/ (\d+) questions\*\*/, "exam corpus total", true),
      DOC("docs/SESSION-LOG.md", /16 papers \/ (\d+) questions/, "exam corpus total", true),
    ],
    why: "questions across all exam papers, per audit-exams",
    // Every claim above must match at least once. Without this, a pattern that stops matching
    // (a reworded sentence, an added paper) is indistinguishable from a passing check.
    minMatches: 5,
  },
  {
    key: "terms",
    claims: [
      DOC("docs/CHECKPOINT.md", /emits \*\*(\d+) domain terms\*\*/, "term count"),
    ],
    why: "domain terms the detector emits",
  },
  {
    // The glossary's own size, measured by its own guard.
    //
    // It replaces a claim that SILENTLY STOPPED EXISTING. This assertion used to
    // read "defines **274** domain acronyms" from DESIGN-SYSTEM.md, and when the
    // glossary shipped that sentence was rewritten — at which point the pattern
    // matched nothing and the guard reported DOC CLAIMS OK. **An absent claim and a
    // satisfied claim were indistinguishable**, which is the `^0[1-9]-` bug in a
    // document rather than in a file list: a check that quietly stops being a
    // check. `required: true` is what makes the difference visible, and the
    // DESIGN-SYSTEM sentence now names the figure this measures.
    key: "glossaryEntries",
    claims: [
      DOC("docs/DESIGN-SYSTEM.md", /holds\s*\*\*(\d+)\s*verified entries\*\*/, "glossary entry count", true),
    ],
    why: "entries the glossary guard verifies",
  },
  {
    key: "banded",
    claims: [
      DOC("docs/CHECKPOINT.md", /build `(\d+) banded/, "banded count"),
      DOC("docs/CHECKPOINT.md", /`build-content\.mjs` — \*\*(\d+) practice tasks banded/, "banded count"),
      DOC("docs/CHECKPOINT.md", /\*\*(\d+) practice tasks\*\* carry authored/, "banded count"),
      DOC("docs/ROADMAP.md", /\*\*(\d+)\*\* practice tasks carry authored/, "banded count"),
      // Quoted build output that said 252 -- stale in a code block, which is the worst
      // place for it because a quoted command's output reads as authoritative.
      DOC("docs/CONTENT-SCHEMA.md", /task bands:\s+(\d+) banded/, "banded count"),
      DOC("docs/CONTENT-SCHEMA.md", /task energy:\s+(\d+) of \d+ practice/, "banded count"),
    ],
    why: "practice tasks the build bands",
  },
  {
    // The breakdown, not just the total. ROADMAP.md:108 quoted "252 banded" AND a
    // distribution of quick 34 / focused 144 / deep 63 / ongoing 11 -- five stale numbers
    // in one sentence, where the total is the only one a reader would think to re-check.
    key: "focusedBanded",
    claims: [DOC("docs/ROADMAP.md", /Bands — focused (\d+), deep \d+, quick \d+, ongoing \d+/, "focused band count")],
    why: "practice tasks banded `focused`",
  },
  {
    key: "deepBanded",
    claims: [DOC("docs/ROADMAP.md", /Bands — focused \d+, deep (\d+), quick \d+, ongoing \d+/, "deep band count")],
    why: "practice tasks banded `deep`",
  },
  {
    key: "quickBanded",
    claims: [DOC("docs/ROADMAP.md", /Bands — focused \d+, deep \d+, quick (\d+), ongoing \d+/, "quick band count")],
    why: "practice tasks banded `quick`",
  },
  {
    key: "ongoingBanded",
    claims: [DOC("docs/ROADMAP.md", /Bands — focused \d+, deep \d+, quick \d+, ongoing (\d+)/, "ongoing band count")],
    why: "practice tasks banded `ongoing`",
  },
  {
    key: "normalEnergy",
    claims: [DOC("docs/ROADMAP.md", /Energy — normal (\d+), high \d+, low \d+/, "normal energy count")],
    why: "practice tasks carrying `energy: normal`",
  },
  {
    key: "highEnergy",
    claims: [DOC("docs/ROADMAP.md", /Energy — normal \d+, high (\d+), low \d+/, "high energy count")],
    why: "practice tasks carrying `energy: high`",
  },
  {
    key: "lowEnergy",
    claims: [DOC("docs/ROADMAP.md", /Energy — normal \d+, high \d+, low (\d+)/, "low energy count")],
    why: "practice tasks carrying `energy: low`",
  },
  {
    key: "phases",
    claims: [
      DOC("docs/CONTENT-SCHEMA.md", /present on all (\d+) phase files/, "phase count (total)"),
      DOC("docs/CONTENT-SCHEMA.md", /practice-task IDs are on all (\d+) phase files/, "phase count (total)"),
    ],
    why: "phase files in career-roadmaps",
  },
  {
    key: "taskIds",
    claims: [DOC("docs/CHECKPOINT.md", /\*\*(\d+)\*\* total phase task IDs/, "task id count")],
    why: "phase task ids the build counts",
  },
  {
    key: "sharedDocs",
    claims: [DOC("docs/CHECKPOINT.md", /shared documents `(\d+)`/, "shared document count")],
    why: "shared documents the build writes",
  },
  {
    // Word counts. README.md and CHECKPOINT.md both published a corpus total and both were
    // wrong by 764 words, with the whole drift in the advance track, whose phases were edited
    // by the claim-verification pass. IT and cyber were correct -- which is what identified the
    // counting method, since they only reproduce when `00-overview.md` is excluded.
    key: "corpusWords",
    claims: [
      DOC("README.md", /\*\*([\d,]+) phase-file words\*\*/, "corpus word count", true),
      DOC("docs/CHECKPOINT.md", /\*\*([\d,]+) words across the 31 phase files\*\*/, "corpus word count", true),
    ],
    why: "words across the 31 phase files, per split(/\\s+/) excluding 00-overview.md",
  },
  {
    // The per-track breakdown, not just the total. The total was the only number a reader would
    // think to re-check, and the reason it was wrong is that the drift was all in one track --
    // so a total-only check would have caught a sum that happened to agree for the wrong reason.
    //
    // Every pattern here is anchored to the phrase `words across the 31 phase files`, and that
    // anchoring is load-bearing rather than decoration. The first version used a bare
    // `cyber ([\d,]+), advance` and matched the *task-ID* rows instead -- "IT 99, cyber 181,
    // advance 116" -- so it reported a word count of 181 against a real 214,649, twice. A loose
    // pattern is not a weaker check; it is a check against the wrong sentence, and it fails
    // loudly in a way that looks like the document being wrong.
    key: "itWords",
    claims: [DOC("docs/CHECKPOINT.md", /words across the 31 phase files\*\* — IT ([\d,]+),/, "IT word count")],
    why: "words in the nine IT phase files",
  },
  {
    key: "cyberWords",
    claims: [DOC("docs/CHECKPOINT.md", /— IT [\d,]+, cyber ([\d,]+), advance/, "cyber word count")],
    why: "words in the fifteen cyber phase files",
  },
  {
    key: "advanceWords",
    claims: [DOC("docs/CHECKPOINT.md", /— IT [\d,]+, cyber [\d,]+, advance ([\d,]+) —/, "advance word count")],
    why: "words in the seven advance phase files",
  },
  {
    // See the note where `docsRead` is computed: the document count is pinned, the figure
    // count deliberately is not.
    key: "docsRead",
    claims: [DOC("docs/CHECKPOINT.md", /reads \*\*(\d+) documents\*\*/, "documents this guard reads", true)],
    why: "distinct documents carrying at least one claim above",
  },
  {
    // The site's shape, stated once in CHECKPOINT's structure block. It has now rotted twice.
    key: "sitePages",
    claims: [DOC("docs/CHECKPOINT.md", /React \+ Vite; (\d+) pages/, "site page count", true)],
    why: "page components in learning-site/src/pages",
  },
  {
    key: "siteComponents",
    claims: [DOC("docs/CHECKPOINT.md", /pages, (\d+) components/, "site component count", true)],
    why: "components in learning-site/src/components",
  },
  {
    key: "siteHooks",
    claims: [DOC("docs/CHECKPOINT.md", /components, (\d+) hooks/, "site hook count", true)],
    why: "hooks in learning-site/src/hooks",
  },
  {
    key: "phases",
    // The structure block near the top of CHECKPOINT.md states the track sizes. Those are
    // the figures a reader uses to understand the repository's shape, and nothing counted
    // them — the sweep found "all 23 phases" and "all 29 phases" in docs and site comments
    // long after the corpus reached 31.
    claims: [
      DOC("docs/CHECKPOINT.md", /it-roadmap\/\s+\((\d+) phases/, "IT phase count"),
      DOC("docs/CHECKPOINT.md", /cybersec-roadmap\/\s+\((\d+) phases/, "cyber phase count"),
      DOC("docs/CHECKPOINT.md", /advance-roadmap\/\s+\((\d+) phases/, "advance phase count"),
    ],
    why: "phase files in career-roadmaps",
  },
];

// The per-track measurements the structure block needs. Kept separate from `captured`
// because each track is its own assertion rather than one scalar.
const phaseFiles = (dir) =>
  fs.readdirSync(path.join(ROOT, "career-roadmaps", dir)).filter((f) => /^\d{2}-phase.*\.md$/.test(f)).length;
captured.itPhases = phaseFiles("it-roadmap");
captured.cyberPhases = phaseFiles("cybersec-roadmap");
captured.advancePhases = phaseFiles("advance-roadmap");
// The total, for claims that state "all N phase files" with no track named.
captured.phases = captured.itPhases + captured.cyberPhases + captured.advancePhases;

// The claim regexes above name a track, so each must be compared against ITS OWN count,
// not one shared scalar. Map claim -> the key that measures it.
const TRACK_KEYS = { "IT phase count": "itPhases", "cyber phase count": "cyberPhases", "advance phase count": "advancePhases" };

// THE GUARD'S OWN COVERAGE, AS A CHECKED FIGURE.
//
// CHECKPOINT.md said for a long time that this guard "reads four documents and checks 25
// figures" when it read six and checked thirty-nine. That is the worst kind of stale figure:
// a guard that UNDERSTATES what it covers tells a reader to stop looking in the places it
// already reads, and the two documents it was quietly wrong about -- ROADMAP.md and
// DESIGN-SYSTEM.md -- are among the most heavily guarded files in the repository.
//
// Only the DOCUMENT count is pinned, and the omission is deliberate. The figure count moves
// every time a sentence is reworded or a claim is added, including edits that are entirely
// legitimate, so asserting it in prose would make a correct edit fail the build. That is
// D-033's shape: a check whose pass path and fail path cannot be told apart.
captured.docsRead = new Set(ASSERTIONS.flatMap((a) => a.claims.map((c) => c.file))).size;

// Anything measured but never claimed is a check that CANNOT fail, so it is named rather than
// left in a list of "measured" values that reads as though each were covered. `lintFiles` is
// the standing case: it is measured and nothing asserts it, deliberately -- CHECKPOINT.md's
// health-check row says so, on the grounds that the count moves with every file added and
// "says nothing about the content", which is a fair reason to decline a claim and a poor
// reason to imply one exists. Printing it without saying so would be the same mistake as a
// stale figure, in the other direction.
const assertedKeys = new Set([
  ...ASSERTIONS.map((a) => a.key),
  ...Object.values(TRACK_KEYS),
]);
const unasserted = Object.keys(captured).filter((k) => !assertedKeys.has(k));

console.log("Measured from commands and from disk:");
for (const [k, v] of Object.entries(captured)) console.log(`  ${k.padEnd(16)} ${v}`);

console.log("");
const findings = [];
let checked = 0;
/** How many lines of a claim's file its pattern matches. Used by the `minMatches` floor. */
const countMatches = (c) => {
  const full = path.join(ROOT, c.file);
  if (!fs.existsSync(full)) return 0;
  return fs
    .readFileSync(full, "utf8")
    .split("\n")
    .filter((line) => c.re.test(line)).length;
};
for (const a of ASSERTIONS) {
  const actual = captured[a.key];
  // An assertion may mix claims resolved by the assertion's own key (the total) and claims
  // resolved per-track through TRACK_KEYS. It is only an error when NO claim resolves.
  const anyResolvable = a.claims.some((c) =>
    TRACK_KEYS[c.what] ? typeof captured[TRACK_KEYS[c.what]] === "number" : typeof actual === "number",
  );
  if (!anyResolvable) {
    findings.push({ a, stated: "?", actual, note: "the measurement itself failed" });
    continue;
  }
  for (const c of a.claims) {
    // A per-track claim is measured by its own track's count, not by the assertion's key.
    const actualForClaim = TRACK_KEYS[c.what] ? captured[TRACK_KEYS[c.what]] : actual;
    if (typeof actualForClaim !== "number" || Number.isNaN(actualForClaim)) {
      findings.push({ a, c, stated: "?", actual: actualForClaim, note: "the measurement itself failed" });
      continue;
    }
    const full = path.join(ROOT, c.file);
    if (!fs.existsSync(full)) continue;
    let matched = 0;
    fs.readFileSync(full, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const m = c.re.exec(line);
        if (!m) return;
        matched++;
        checked++;
        const stated = Number(String(m[1]).replace(/,/g, ""));
        if (stated !== actualForClaim) {
          findings.push({ a, c, stated, actual: actualForClaim, line: i + 1, text: line.trim().slice(0, 120) });
        }
      });
    // A pattern that matches NOTHING is not a passing check -- it is an absent one. Without
    // this, rewording a sentence or adding a paper silently retires the assertion and the guard
    // reports success for a figure it never looked at.
    //
    // OPT-IN via `required: true`, because several claims here list ALTERNATIVE wordings for the
    // same figure (documents phrase a count differently, and only one variant matches at a time).
    // Failing those whenever a variant is absent would flag a healthy corpus, and a guard that
    // cries wolf gets switched off. So a claim opts in when its sentence is the only place the
    // figure is stated and its disappearance would therefore be a real loss.
    if (matched === 0 && c.required) {
      findings.push({
        a,
        c,
        stated: "—",
        actual: actualForClaim,
        note: `pattern matched nothing in ${c.file}; the claim has silently stopped being checked`,
      });
    }
  }
  // A per-assertion floor, for claims whose wording legitimately varies (several sentences may
  // state the same figure, and their exact number can rise as documents are added).
  if (a.minMatches && a.claims.reduce((n, c) => n + countMatches(c), 0) < a.minMatches) {
    findings.push({ a, stated: "—", actual: a.minMatches, note: `fewer than ${a.minMatches} matching statements remain` });
  }
}

console.log(`Documentation figures checked: ${checked}`);
if (unasserted.length) {
  console.log(`Measured but NOT asserted (no claim can fail on these): ${unasserted.join(", ")}`);
}
console.log("");
if (!findings.length) {
  console.log("DOC CLAIMS OK — every checked figure matches the command that produces it.");
  process.exit(0);
}

console.error(`DOC CLAIMS FAILED — ${findings.length} figure(s) disagree with reality:`);
console.error("");
for (const f of findings) {
  console.error(`  ${f.c ? `${f.c.file}:${f.line}` : f.a.key}  [${f.c ? f.c.what : f.a.why}]`);
  console.error(`      document says ${f.stated}   reality is ${f.actual}   (${f.a.why})`);
  if (f.text) console.error(`      ${f.text}`);
}
console.error("");
console.error("FIX: correct the document, or correct the count. Never edit this guard to agree.");
process.exit(1);
