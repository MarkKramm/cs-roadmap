// Controls for audit-markdown-render.mjs.
//
// This guard replaced a file that had the right question and a false premise. Its
// own header records what the previous version did, so the first thing these
// controls establish is that the replacement fails on the defect it claims to
// check -- the old one could not, because it had no `process.exit` in it at all.
//
// The controls fall into three groups:
//
//   1. THE GATE. A content string carrying a construct `renderInline` does not
//      handle must fail the build. This is the whole point of the replacement.
//   2. THE STALENESS CONTROL, which is the interesting one. `HANDLED` is
//      DECLARED in the guard rather than imported, because `renderInline.jsx` is
//      JSX and a plain Node script cannot import it. That duplication is a real
//      staleness risk: if someone teaches the renderer a new construct, this
//      guard keeps treating it as unhandled and starts failing the build on
//      correct content. So a control reads the REAL renderer and fails if the
//      two have diverged.
//   3. THE PRECONDITIONS, because a guard that cannot read its subject must say
//      so rather than report a clean result.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync, renameSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-markdown-render.mjs");
const RENDER_INLINE = join(ROOT, "learning-site", "src", "lib", "renderInline.jsx");

// A control suite for a guard that reads a build artifact must refuse to run
// without one, rather than reporting a pass because the guard exited for some
// unrelated reason.
if (!existsSync(join(ROOT, "learning-site", "src", "data", "generated"))) {
  console.error("PRECONDITION FAILED — these controls need a build: run `npm run build:content` in learning-site/.");
  process.exit(1);
}

/**
 * Run the guard over a synthetic generated directory.
 *
 * The guard resolves its subject from its own location on disk, so pointing it
 * somewhere else means giving it a scratch copy of itself inside a scratch tree
 * that also contains `learning-site/src/data/generated/`. The guard is
 * otherwise unmodified.
 */
function runOn(jsonFiles, { dropGenerated = false } = {}) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-md-ctl-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));

    if (!dropGenerated) {
      const gen = join(scratch, "learning-site", "src", "data", "generated");
      mkdirSync(gen, { recursive: true });
      for (const [name, content] of Object.entries(jsonFiles)) {
        writeFileSync(join(gen, name), typeof content === "string" ? content : JSON.stringify(content, null, 2), "utf8");
      }
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

// =============================================================================
// Control 0 — the baseline. Content the site renders correctly.
// =============================================================================
{
  const r = runOn({
    "it.json": { phases: [{ title: "A phase", lesson: "Run `Get-Process` and read **HealthStatus** carefully." }] },
  });
  const ok = r.code === 0 && /no content string carries inline Markdown/.test(r.out);
  record("control 0: content the site renders correctly passes", ok, [`exit ${r.code}`]);
}

// =============================================================================
// THE GATE. Each unhandled construct must fail the build.
// =============================================================================
for (const [label, text, expect] of [
  ["a Markdown link", "See [the docs](https://example.com) for more.", /renders literally/],
  ["strikethrough", "This is ~~deleted~~ text.", /renders literally/],
  ["underscore italic", "This is _emphasised_ text.", /renders literally/],
]) {
  const r = runOn({ "it.json": { phases: [{ title: "P", lesson: text }] } });
  const ok = r.code === 1 && expect.test(r.out);
  record(`${label} in a content string fails the build`, ok, [`exit ${r.code}; expected the finding=${expect.test(r.out)}`]);
}

// The field is named in the finding, so a reader can find the string. A guard
// that says "somewhere in the JSON" is a guard that has to be re-run by hand.
{
  const r = runOn({ "it.json": { phases: [{ title: "P", deliverableItems: ["Write it up with [a link](https://x.com)."] }] } });
  const ok = r.code === 1 && /deliverableItems/.test(r.out);
  record("the finding names the field, not just the file", ok, [`exit ${r.code}; the field is named=${/deliverableItems/.test(r.out)}`]);
}

// A bare URL is NOT a finding. It is ordinary prose in this curriculum and the
// renderer has no reason to touch it; a guard that flagged it would fire on
// hundreds of correct strings and get switched off.
{
  const r = runOn({ "it.json": { phases: [{ title: "P", lesson: "Read https://learn.microsoft.com for the full reference." }] } });
  record("a bare URL is not a finding (it is ordinary prose here)", r.code === 0, [`exit ${r.code} (want 0)`]);
}

// Emphasis that the renderer DOES handle must never fail, including the
// awkward case renderInline's own comment describes: bold CONTAINING a code
// span whose content is an asterisk. That is the real defect its masking pass
// exists to fix, so the guard must not reintroduce a complaint about it.
{
  const r = runOn({
    "it.json": { phases: [{ title: "P", lesson: 'The third statement uses `Resource: "*"` inside a key policy.' }] },
  });
  record("a code span containing an asterisk is not a finding (renderInline masks it)", r.code === 0, [`exit ${r.code} (want 0)`]);
}
{
  const r = runOn({
    "it.json": { phases: [{ title: "P", lesson: "**`/etc`** is a path, and **bold with `code` inside** works." }] },
  });
  record("bold containing a code span is not a finding", r.code === 0, [`exit ${r.code} (want 0)`]);
}

// =============================================================================
// The staleness control. HANDLED is duplicated from renderInline.jsx.
// =============================================================================
// This is the control that makes the duplication safe. It reads the REAL
// renderer and requires that every construct it claims to handle is one the
// guard also treats as handled -- so if someone teaches the renderer to handle,
// say, strikethrough, this fails and says the guard must be updated, rather than
// the guard failing the build on every correct strikethrough in the corpus.
{
  const src = readFileSync(RENDER_INLINE, "utf8");

  // Decode the renderer's own regexes rather than pattern-matching its source.
  //
  // A regex LITERAL cannot be found by searching for its own pattern: a link
  // branch written as /\[([^\]\n]+)\]\(([^)\n]+)\)/g contains "]\\(" in the
  // file, not "](", so a test looking for the latter is always false. The first
  // version of this control did exactly that and passed while the renderer had
  // genuinely learned to handle links -- a control that could not fail, which is
  // the defect this whole pass exists to remove. It was caught by proving the
  // control against a deliberately extended renderer.
  //
  // So: pull the TOKEN alternation apart and classify each branch by the marker
  // it consumes. Anything that is neither ** nor * is a construct this guard
  // still treats as unhandled, and that is drift by construction.
  const tokenSrc = (/const TOKEN = (\/.*?\/g);/.exec(src) || [])[1] || "";
  const codeSrc = (/const CODE_SPAN = (\/.*?\/g);/.exec(src) || [])[1] || "";

  // Split a regex literal on its top-level alternation, respecting escapes and
  // character classes so a | inside [...] or \| does not split the string.
  //
  // The trailing flags must be stripped too. The first version removed only the
  // leading slash, so the body ended "…)/g" and the outer group `( … | … )` was
  // never opened as a branch boundary -- the alternation sat at depth 1 and
  // `branchesOf` returned ONE branch containing the whole literal. Every
  // classification downstream then ran against a string that was not a branch,
  // and the decoded set came out as "bold, code" with italicStar silently
  // missing. **A classifier that quietly classifies less than it appears to is
  // worse than one that fails**, because the set it feeds looks complete.
  const branchesOf = (literal) => {
    const body = literal.replace(/^\//, "").replace(/\/[a-z]*$/, "");
    // Drop one enclosing group if the whole alternation is wrapped in it.
    const inner =
      body.startsWith("(") && body.endsWith(")") ? body.slice(1, -1) : body;
    const out = [];
    let depth = 0, cur = "", inClass = false;
    for (let i = 0; i < inner.length; i++) {
      const c = inner[i];
      if (c === "\\") { cur += c + (inner[i + 1] || ""); i++; continue; }
      if (c === "[") inClass = true;
      else if (c === "]") inClass = false;
      if (c === "(" || c === "[") depth++;
      else if (c === ")" || c === "]") depth--;
      if (c === "|" && depth === 0 && !inClass) { out.push(cur); cur = ""; continue; }
      cur += c;
    }
    if (cur) out.push(cur);
    return out;
  };

  const KNOWN = new Set(["bold", "italicStar", "code"]);
  const learned = [];
  const unknownBranches = [];

  for (const branch of branchesOf(tokenSrc)) {
    // **bold** consumes a doubled asterisk; *italic* a single one. The branch
    // text still carries its backslashes, so a doubled marker is the two
    // characters \* followed by \*, not "**" -- testing for the latter never
    // matched, and italicStar was silently absent from the decoded set. That is
    // the same class of bug as the pattern-match version it replaced: a
    // classifier that quietly classifies less than it thinks, so the check it
    // feeds cannot see what it is looking for.
    const doubled = branch.includes("\\*\\*") || branch.includes("**");
    const single = branch.includes("\\*") && !doubled;
    if (doubled) learned.push("bold");
    else if (single) learned.push("italicStar");
    else unknownBranches.push(branch);
  }
  if (codeSrc) learned.push("code");

  // A constructor the renderer defines but this control cannot classify is
  // reported rather than ignored -- that is the whole drift signal.
  const extraConsts = [...src.matchAll(/const\s+([A-Z_]+)\s*=\s*\//g)]
    .map((m) => m[1])
    .filter((n) => n !== "TOKEN" && n !== "CODE_SPAN" && n !== "SENTINEL");

  const UNHANDLED_KINDS = new Set(["italicUnderscore", "link", "strikethrough"]);
  const drift = [...new Set(learned)].filter((k) => UNHANDLED_KINDS.has(k));
  const problems = [];
  if (drift.length) problems.push(`renderInline now handles ${drift.join(", ")}, which this guard still treats as UNHANDLED`);
  if (unknownBranches.length) problems.push(`TOKEN has ${unknownBranches.length} branch(es) this control cannot classify: ${unknownBranches.join(" | ")}`);
  if (extraConsts.length) problems.push(`renderInline defines new formatting regex(es): ${extraConsts.join(", ")}`);
  record(
    "HANDLED in the guard has not drifted from what renderInline actually formats",
    problems.length === 0,
    problems.length
      ? problems
      : [`renderer constructs decoded: ${[...new Set(learned)].join(", ") || "none"} — all listed as handled by the guard`],
  );
}

// A companion assertion: the staleness control above silently passes if the
// renderer file is missing, because every decode then yields nothing and there
// is no drift to report. So the file's existence is asserted in its own right.
{
  record("renderInline.jsx exists at the path the staleness control reads", existsSync(RENDER_INLINE), [RENDER_INLINE]);
}

// =============================================================================
// Preconditions. A guard that cannot read its subject must say so.
// =============================================================================
{
  const r = runOn({}, { dropGenerated: true });
  const ok = r.code === 1 && /MISSING BUILD ARTIFACT/.test(r.out);
  record("no generated directory -> a named failure, not a clean result", ok, [
    `exit ${r.code}; "MISSING BUILD ARTIFACT" reported=${/MISSING BUILD ARTIFACT/.test(r.out)}`,
  ]);
}
{
  // An EMPTY generated directory is the shape of the `^0[1-9]-` bug: a guard
  // with nothing to read prints a healthy line about no subject at all.
  const scratch = mkdtempSync(join(tmpdir(), "cs-md-empty-"));
  try {
    mkdirSync(join(scratch, "scripts"), { recursive: true });
    copyFileSync(join(ROOT, GUARD_REL), join(scratch, GUARD_REL));
    mkdirSync(join(scratch, "learning-site", "src", "data", "generated"), { recursive: true });
    let out = "", code = 0;
    try {
      out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch (e) { code = e.status ?? 1; out = (e.stdout || "") + (e.stderr || ""); }
    const ok = code === 1 && /MISSING BUILD ARTIFACT/.test(out);
    record("an EMPTY generated directory -> a named failure, not a clean result", ok, [
      `exit ${code}; "MISSING BUILD ARTIFACT" reported=${/MISSING BUILD ARTIFACT/.test(out)}`,
    ]);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}
{
  // A file that will not parse must be reported, not silently skipped: a
  // swallowed parse failure is a file that is never checked.
  const r = runOn({ "it.json": "{ this is not json" });
  const ok = r.code === 1 && /not valid JSON/.test(r.out);
  record("a generated file that will not parse is reported", ok, [`exit ${r.code}; "not valid JSON" reported=${/not valid JSON/.test(r.out)}`]);
}

// =============================================================================
// The denominator, on the real corpus.
// =============================================================================
// The old guard read two of five generated files. This asserts all six are read,
// because the advance track is the most senior material in the repository and was
// invisible to the thing whose job was to look at generated content.
{
  const out = execFileSync(process.execPath, [GUARD_REL], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
  const m = /Generated files scanned: (\d+)/.exec(out);
  const line = out.split("\n")[0];
  const all = ["advance", "cyber", "exams", "it", "search", "shared"].every((n) => line.includes(n));
  record("every generated file is scanned, including the advance track", !!m && Number(m[1]) === 6 && all, [line.trim()]);

  // And the handled-span count must be non-zero, or "OK" would mean the patterns
  // stopped matching rather than that the content is clean.
  const handled = /Spans the site renders correctly: (.+)/.exec(out);
  record(
    "the handled-span count is non-zero (so OK means clean, not blind)",
    !!handled && /[1-9]/.test(handled[1]),
    [handled ? handled[0].trim() : "(no count line)"],
  );
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length === 0) {
  console.log(`All ${results.length} controls passed. The guard gates on the real defect, the duplicated`);
  console.log("handled-set has not drifted from the renderer, and every precondition is a named failure.");
} else {
  console.log(`${failed.length} of ${results.length} controls FAILED.`);
  for (const f of failed) {
    const line = results.find((r) => r.name === f.name);
    void line;
  }
}
process.exit(failed.length === 0 ? 0 : 1);

