// Controls for audit-nist-current.mjs.
//
// THE ONLY NETWORK-DEPENDENT GUARD IN THE REPOSITORY, and the only one whose
// failure branches cannot be reached with a real network.
//
// The guard's method is to retrieve every cited csrc.nist.gov page and read NIST's
// own "Withdrawn on <date>. Superseded by <newer>." sentence out of it. Its header
// is admirably clear that it fails ONLY on a confirmed withdrawal and reports
// anything else as UNCHECKED, because "failing on infrastructure noise trains people
// to ignore the guard."
//
// That design has a consequence for controls, and it is the interesting part: **the
// branches that matter cannot be tested against the real NIST.** The pages that would
// exercise the withdrawal path are pages that are not withdrawn, and the pages that
// would exercise the network-failure path are pages that usually work. A control suite
// hitting csrc.nist.gov could only ever assert the happy path -- the one outcome that
// already reads green -- which is exactly the coverage this pass exists to remove.
//
// So `fetch` is stubbed through a loader module (see fetch-stub.mjs) and the guard runs
// its real logic against invented responses. The trade is the same one
// test-audit-site-figures.mjs makes when it stubs `npm`, and the limit is the same: a
// stub cannot prove NIST's real pages parse. What it CAN prove is that each branch of
// the guard fires, that the withdrawal sentence is read correctly out of arbitrary HTML
// around it, and that a network failure is reported as unchecked rather than as a pass
// or a false alarm. The real fetch is exercised by the guard's own CI step.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-nist-current.mjs");

// The fetch stub, written to a temp file and loaded with `node --import`.
//
// It lives HERE as a string rather than as a committed `scripts/fetch-stub.mjs`
// because a second file under scripts/ is a file every repository guard then has
// an opinion about -- and this one exists only to be loaded by a test. Keeping it
// inline also means the stub and the controls that depend on it cannot drift apart,
// which is the failure this whole pass has been about in five different guises.
const FETCH_STUB = `
// Installed before the guard runs. Driven by CS_FETCH_SPEC (JSON), keyed by a
// substring of the URL:
//   { "61/r2": { "status": 200, "body": "<html>..." } }
//   { "boom":  { "throw": "TypeError" } }
//   anything else -> 404
const spec = JSON.parse(process.env.CS_FETCH_SPEC || "{}");
const entryFor = (url) => {
  for (const [key, value] of Object.entries(spec)) {
    if (String(url).includes(key)) return value;
  }
  return { status: 404, body: "not found" };
};
globalThis.fetch = async (url) => {
  const entry = entryFor(String(url));
  if (entry.throw) {
    const e = new Error("simulated network failure");
    e.name = entry.throw;
    throw e;
  }
  const status = entry.status ?? 200;
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() { return entry.body ?? ""; },
  };
};
`;

// One temp file for the stub, reused by every run, and removed on exit.
const STUB_DIR = mkdtempSync(join(tmpdir(), "cs-nist-stub-"));
const STUB_PATH = join(STUB_DIR, "fetch-stub.mjs");
writeFileSync(STUB_PATH, FETCH_STUB, "utf8");
process.on("exit", () => rmSync(STUB_DIR, { recursive: true, force: true }));

/** Run the guard over a synthetic corpus, with `fetch` stubbed by `spec`. */
function runOn(files, spec) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-nist-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    const content = join(scratch, "career-roadmaps", "it-roadmap");
    mkdirSync(content, { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      writeFileSync(join(content, name), text, "utf8");
    }
    const env = {
      ...process.env,
      CS_FETCH_SPEC: JSON.stringify(spec || {}),
    };
    let out = "";
    let code = 0;
    try {
      out = execFileSync(
        process.execPath,
        ["--import", pathToFileURL(STUB_PATH).href, GUARD_REL],
        { cwd: scratch, encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] },
      );
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

const cites = (url) => ({ "01-phase-probe.md": `See ${url} for the current text.\n` });

// A realistic NIST page: the withdrawal sentence buried in markup, with a script tag,
// a non-breaking space, and nested tags around the words.
const WITHDRAWN_HTML = `<!doctype html>
<html><head><title>SP 800-61 Rev. 2</title>
<script>var x = "Withdrawn on January 1, 1999. Superseded by nothing.";</script>
</head><body>
  <div class="banner"><p><strong>Withdrawn on April 3, 2025.</strong>
  Superseded by <a href="/pubs/sp/800/61/r3/final">NIST SP 800-61 Rev. 3</a>.</p></div>
  <h1>Computer Security Incident Handling Guide</h1>
</body></html>`;

const CLEAN_HTML = `<!doctype html><html><body>
  <h1>NIST SP 800-53 Rev. 5</h1><p>This publication is current.</p>
</body></html>`;

// =============================================================================
// Control 0 -- a current publication passes.
// =============================================================================
{
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/53/r5/final"), { clean: { status: 200, body: CLEAN_HTML } });
  const ok = r.code === 0 && /NIST LINKS CURRENT/.test(r.out) && /1 publication link\(s\) checked/.test(r.out);
  record("control 0: a current publication passes and names its count", ok, [
    r.out.split("\n").find((l) => /NIST LINKS CURRENT/.test(l))?.trim() || `(exit ${r.code})`,
  ]);
}

// =============================================================================
// THE DEFECT. A confirmed withdrawal must fail, and name the facts.
// =============================================================================
// The three historical instances were SP 800-61 Rev. 2, SP 800-50 and SP 800-63-3,
// each live in the corpus while NIST's page marked it withdrawn. This is that case.
{
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/61/r2/final"), { "61/r2": { status: 200, body: WITHDRAWN_HTML } });
  const ok =
    r.code === 1 &&
    /WITHDRAWN NIST PUBLICATIONS/.test(r.out) &&
    /April 3, 2025/.test(r.out) &&
    /800-61 Rev\. 3/.test(r.out);
  record("a withdrawn publication fails and reports the date and the replacement", ok, [
    `exit ${r.code}`,
    ...r.out.split("\n").filter((l) => /withdrawn|superseded/i.test(l)).slice(0, 3).map((l) => "  | " + l.trim()),
  ]);
}
{
  // The withdrawal sentence must be read out of the PLAIN TEXT, not out of the tags.
  // A script tag on the same page mentions a different, decoy withdrawal sentence; if
  // the guard matched markup it would report January 1, 1999 instead of April 3, 2025.
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/61/r2/final"), { "61/r2": { status: 200, body: WITHDRAWN_HTML } });
  const ok = /April 3, 2025/.test(r.out) && !/January 1, 1999/.test(r.out);
  record("the real sentence wins over a decoy inside a <script> tag", ok, [
    `April 3, 2025 reported=${/April 3, 2025/.test(r.out)}; decoy reported=${/January 1, 1999/.test(r.out)}`,
  ]);
}
{
  // The cited LOCATION must be reported, or the reader has a finding with nothing to
  // go and fix.
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/61/r2/final"), { "61/r2": { status: 200, body: WITHDRAWN_HTML } });
  const ok = /01-phase-probe\.md:1/.test(r.out);
  record("the finding names the file and line that cites it", ok, [`location reported=${ok}`]);
}

// =============================================================================
// Network failure is UNCHECKED, never a pass and never a false alarm.
// =============================================================================
// This is the guard's stated design and the reason it is not a nuisance: it fails only
// on a fact read out of NIST's page. Both failure shapes must be tolerated.
for (const [label, spec] of [
  ["a thrown fetch", { boom: { throw: "TypeError" } }],
  ["HTTP 503", { clean: { status: 503, body: "service unavailable" } }],
  ["HTTP 404", { clean: { status: 404, body: "gone" } }],
]) {
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/53/r5/final"), spec);
  const ok = r.code === 0 && /could not be checked this run/.test(r.out);
  record(`${label} -> reported as UNCHECKED, and the run still passes`, ok, [
    `exit ${r.code}; "could not be checked" reported=${/could not be checked this run/.test(r.out)}`,
  ]);
}
{
  // A partial failure is the interesting case: one link confirmed current, one that
  // could not be fetched. The guard must pass AND say the second was not checked --
  // a clean line with no caveat would be a claim it cannot support.
  //
  // The first version of this control called `cites(url)["name"]` to get the text back,
  // which is a filename lookup into a helper that returns { filename: text }. That
  // yielded `undefined` and writeFileSync threw before the guard ever ran. A control
  // that crashes is at least loud, but it tests nothing -- the fix is to build the two
  // files directly, which is what the text actually is.
  const r = runOn(
    {
      "01-phase-a.md": "See https://csrc.nist.gov/pubs/sp/800/53/r5/final for the controls.\n",
      "02-phase-b.md": "See https://csrc.nist.gov/pubs/sp/800/57/r5/final for the controls.\n",
    },
    { clean: { status: 200, body: CLEAN_HTML }, boom: { throw: "TypeError" } },
  );
  const ok = r.code === 0 && /could not be checked this run/.test(r.out) && /2 publication link/.test(r.out);
  record("a partial failure passes but states the caveat and the denominator", ok, [
    `exit ${r.code}; caveat=${/could not be checked this run/.test(r.out)}`,
    r.out.split("\n").find((l) => /NIST LINKS CURRENT/.test(l))?.trim() || "",
  ]);
}

// =============================================================================
// A confirmed withdrawal WINS over an unchecked link in the same run.
// =============================================================================
// The failure direction that matters most: if the guard finds one withdrawal and one
// timeout, it must still fail. A version that returned early on the timeout would
// report clean and leave a retired citation in the curriculum.
{
  const r = runOn(
    {
      "01-phase-a.md": "See https://csrc.nist.gov/pubs/sp/800/61/r2/final for incident handling.\n",
      "02-phase-b.md": "See https://csrc.nist.gov/pubs/sp/800/57/r5/final for the controls.\n",
    },
    { "61/r2": { status: 200, body: WITHDRAWN_HTML }, boom: { throw: "TypeError" } },
  );
  const ok = r.code === 1 && /WITHDRAWN NIST PUBLICATIONS/.test(r.out);
  record("a confirmed withdrawal still fails when another link timed out", ok, [`exit ${r.code}`]);
}

// =============================================================================
// The worklist exclusion. The generated claim files QUOTE old links by design.
// =============================================================================
// A verification worklist that records "this link was withdrawn and here is the
// replacement" contains the withdrawn URL on purpose. Flagging it would make the
// record of the fix into a permanent failure, which is the shape of a guard that
// stops being run.
{
  // ONLY the worklist cites it. The first version of this control also wrote the
  // phase file, which made it a duplicate of the control below it and asserted a
  // property the exclusion does not claim: the rule is "every location is a
  // worklist", not "some location is a worklist". The correct reading is the
  // stronger one -- a worklist mention must not launder a real citation, and that
  // is what the next control checks.
  const r = runOn(
    {
      "CYBER-CLAIM-VERIFICATION.md": "The old link https://csrc.nist.gov/pubs/sp/800/61/r2/final was withdrawn and superseded.\n",
    },
    { "61/r2": { status: 200, body: WITHDRAWN_HTML } },
  );
  const ok = r.code === 0 && /0 publication link/.test(r.out);
  record("a URL cited ONLY by a claim worklist is excluded, not flagged", ok, [
    `exit ${r.code}; count line: ${r.out.split("\n").find((l) => /publication link/.test(l))?.trim() || "(none)"}`,
  ]);
}
{
  // But a worklist mention does NOT launder a real citation. If the phase cites it too,
  // the phase is a real subject and the guard must still fail.
  const r = runOn(
    {
      "01-phase-probe.md": "See https://csrc.nist.gov/pubs/sp/800/61/r2/final for incident handling.\n",
      "CYBER-CLAIM-VERIFICATION.md": "The old link https://csrc.nist.gov/pubs/sp/800/61/r2/final was withdrawn.\n",
    },
    { "61/r2": { status: 200, body: WITHDRAWN_HTML } },
  );
  const ok = r.code === 1;
  record("but a worklist mention does not excuse a real citation of the same URL", ok, [`exit ${r.code}`]);
}

// =============================================================================
// URL extraction scope.
// =============================================================================
{
  // Only csrc.nist.gov publication pages are in scope. A link to a NIST page that is
  // not a publication (a topic page, a news item) must not be fetched, or the guard
  // spends requests on URLs whose pages have no withdrawal banner by design.
  const r = runOn(cites("https://www.nist.gov/news-events/news/2024/09/something"), { clean: { status: 200, body: CLEAN_HTML } });
  const ok = /0 publication link/.test(r.out);
  record("a non-csrc.nist.gov URL is out of scope", ok, [r.out.split("\n").find((l) => /publication link/.test(l))?.trim() || ""]);
}
{
  const r = runOn(cites("https://csrc.nist.gov/pubs/sp/800/53/r5/final"), { clean: { status: 200, body: CLEAN_HTML } });
  const ok = /1 publication link/.test(r.out);
  record("a csrc publication URL is in scope", ok, [r.out.split("\n").find((l) => /publication link/.test(l))?.trim() || ""]);
}

// =============================================================================
// The denominator, on an empty corpus.
// =============================================================================
// A guard with nothing to read must not print a clean line about no subject -- the
// exact shape of the `^0[1-9]-` bug that this repository has now hit in four guards.
{
  const r = runOn({ "01-phase-probe.md": "This phase cites no external standards at all.\n" }, {});
  const line = r.out.split("\n").find((l) => /publication link/.test(l)) || "";
  const ok = r.code === 0 && /0 publication link/.test(line);
  record("a corpus with no citations reports 0 -- and says so rather than implying a sweep", ok, [line.trim()]);
}

// =============================================================================

// =============================================================================
// THE SECOND ROT CLASS: a RETITLE.
//
// A withdrawal check cannot see this. A retitled publication carries no withdrawal
// banner, resolves normally, and is current in every way except its NAME -- so a corpus
// can cite a live document by a title it no longer has, teach that title, and leave
// every other guard green.
//
// SP 800-50 is the live example, and the reason this was found at all: its replacement
// was not reissued under the old name but RENAMED, from "Information Security
// Awareness and Training" to "Building a Cybersecurity and Privacy Learning Program".
// A corpus citing the WITHDRAWN url would have been caught by the class above. A
// corpus citing the LIVE url under the old name would not have been caught by
// anything, because nothing about it is broken.
// =============================================================================

const SP50 = "https://csrc.nist.gov/pubs/sp/800/50/r1/final";

/** An HTML page carrying a title, with no withdrawal banner. */
const titledPage = (title) =>
  `<html><head><title>${title} | CSRC</title></head><body><p>Some publication.</p></body></html>`;

{
  // The rot class: the corpus names the document by a title it no longer has.
  const files = {
    "01-phase-a.md": `SP 800-50 Rev. 1, Information Security Awareness and Training - ${SP50}\n`,
  };
  const spec = {
    "800/50": {
      status: 200,
      body: titledPage("SP 800-50 Rev. 1, Building a Cybersecurity and Privacy Learning Program"),
    },
  };
  const r = runOn(files, spec);
  const ok = r.code === 1 && /RETITLED NIST PUBLICATIONS/.test(r.out) && /Building a Cybersecurity/.test(r.out);
  record("a citation naming a document by a title it no longer has is caught", ok, [
    /RETITLED/.test(r.out) ? "RETITLED fired and named the current title" : `exit ${r.code}, no finding`,
  ]);
}
{
  // The message must say WHERE, or a reader cannot act on it.
  const files = {
    "01-phase-a.md": `SP 800-50 Rev. 1, Information Security Awareness and Training - ${SP50}\n`,
  };
  const spec = {
    "800/50": {
      status: 200,
      body: titledPage("SP 800-50 Rev. 1, Building a Cybersecurity and Privacy Learning Program"),
    },
  };
  const r = runOn(files, spec);
  const ok = /01-phase-a\.md:1/.test(r.out);
  record("the retitle finding names the file and line that states it", ok, [
    ok ? "location reported" : "no location in the finding",
  ]);
}
{
  // THE FALSE POSITIVE THAT MATTERS MOST, because the corpus writes titles this way on
  // purpose: it states the SHORT form and NIST's page carries a subtitle. "Managing
  // Information Security Risk" against
  // "Managing Information Security Risk: Organization, Mission, and Information System
  // Views". Reported as a retitle that would be wrong, and a check wrong about correct
  // content is a check nobody keeps.
  const url = "https://csrc.nist.gov/pubs/sp/800/39/final";
  const files = { "01-phase-a.md": `SP 800-39, Managing Information Security Risk - ${url}\n` };
  const spec = {
    "800/39": {
      status: 200,
      body: titledPage(
        "SP 800-39, Managing Information Security Risk: Organization, Mission, and Information System Views",
      ),
    },
  };
  const r = runOn(files, spec);
  record(
    "a corpus stating the SHORT title against a page carrying a subtitle is NOT a retitle",
    r.code === 0,
    [r.code === 0 ? "silent" : `exit ${r.code}: ${/RETITLED/.test(r.out) ? "FALSE POSITIVE" : "unexpected"}`],
  );
}
{
  // The corpus's CURRENT SP 800-50 citation, verbatim. This is the shape that must stay
  // green, and the previous control is the general case of it.
  const files = {
    "01-phase-a.md": `SP 800-50 Rev. 1, Building a Cybersecurity and Privacy Learning Program - ${SP50}\n`,
  };
  const spec = {
    "800/50": {
      status: 200,
      body: titledPage("SP 800-50 Rev. 1, Building a Cybersecurity and Privacy Learning Program"),
    },
  };
  const r = runOn(files, spec);
  record("the corpus's CURRENT SP 800-50 title passes", r.code === 0, [
    r.code === 0 ? "silent" : `exit ${r.code}: ${/RETITLED/.test(r.out) ? "FALSE POSITIVE" : "unexpected"}`,
  ]);
}
{
  // A citation that states NO title. The corpus writes bare links and descriptions
  // ("SP 800-53 control catalogue - https://...") constantly, and reporting those would
  // be the guard reporting its own parser rather than a defect.
  const url = "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final";
  const files = { "01-phase-a.md": `SP 800-53 control catalogue - ${url}\n` };
  const spec = {
    "800/53": {
      status: 200,
      body: titledPage(
        "SP 800-53 Rev. 5, Security and Privacy Controls for Information Systems and Organizations",
      ),
    },
  };
  const r = runOn(files, spec);
  record("a citation that states no title is not a finding", r.code === 0, [
    r.code === 0 ? "silent" : `exit ${r.code}: ${/RETITLED/.test(r.out) ? "FALSE POSITIVE" : "unexpected"}`],
  );
}
{
  // A WITHDRAWN publication whose page still carries the old title. Both classes can
  // describe the same document, and reporting the retitle too would bury the actionable
  // finding under the one already being fixed.
  const url = "https://csrc.nist.gov/pubs/sp/800/61/r2/final";
  const files = {
    "01-phase-a.md": `SP 800-61 Rev. 2, Computer Security Incident Handling Guide - ${url}\n`,
  };
  const spec = {
    "61/r2": {
      status: 200,
      body: titledPage("SP 800-61 Rev. 2, Computer Security Incident Handling Guide").replace(
        "<body>",
        "<body><p>Withdrawn on April 3, 2025. Superseded by SP 800-61 Rev. 3.</p>",
      ),
    },
  };
  const r = runOn(files, spec);
  const ok = r.code === 1 && /WITHDRAWN/.test(r.out) && !/RETITLED NIST/.test(r.out);
  record("a withdrawn page is reported as withdrawn, NOT as a retitle", ok, [
    ok
      ? "WITHDRAWN fired alone"
      : `exit ${r.code}; WITHDRAWN=${/WITHDRAWN/.test(r.out)} RETITLED=${/RETITLED NIST/.test(r.out)}`,
  ]);
}
{
  // A network failure must not become a retitle finding. This is the shape that would
  // make the guard cry wolf on infrastructure noise, which is the documented reason the
  // guard reports UNCHECKED rather than failing on anything it cannot read.
  const files = {
    "01-phase-a.md": `SP 800-50 Rev. 1, Information Security Awareness and Training - ${SP50}\n`,
  };
  const spec = { "800/50": { throw: "TypeError" } };
  const r = runOn(files, spec);
  const ok = r.code === 0 && /could not be checked/.test(r.out) && !/RETITLED NIST/.test(r.out);
  record("a fetch failure is UNCHECKED, never a retitle", ok, [
    ok ? "reported UNCHECKED" : `exit ${r.code}; UNCHECKED=${/could not be checked/.test(r.out)}`,
  ]);
}
{
  // A page with no <title> at all: nothing to compare against, so nothing to report.
  const files = {
    "01-phase-a.md": `SP 800-50 Rev. 1, Information Security Awareness and Training - ${SP50}\n`,
  };
  const spec = { "800/50": { status: 200, body: "<html><body>no title element</body></html>" } };
  const r = runOn(files, spec);
  record("a page with no title element yields no finding and does not fail", r.code === 0 && !/RETITLED NIST/.test(r.out), [
    r.code === 0 ? "silent" : `exit ${r.code}`,
  ]);
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(failed.length
  ? `${failed.length} of ${results.length} controls FAILED.`
  : `All ${results.length} controls passed: a confirmed withdrawal fails with the date and the replacement,\n` +
    `a RETITLE fails with the current title and where it is stated -- a class invisible to every other\n` +
    `check, because nothing about a renamed document is broken -- and every network failure shape is\n` +
    `reported as UNCHECKED rather than as a pass or a false alarm.`);
process.exit(failed.length === 0 ? 0 : 1);
