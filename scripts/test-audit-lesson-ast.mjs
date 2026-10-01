// Controls for audit-lesson-ast.mjs.
//
// THIS IS THE GUARD THAT CAN CAUSE HARM RATHER THAN REPORT IT.
//
// Every other guard in this repository fails the build or stays quiet. This one
// exists because a parser bug does not crash anything -- it makes lesson content
// quietly disappear from the site, and 84-95% of every phase file passes through
// it. A lesson that loses a paragraph still builds, still renders, and still
// looks like a page. The only thing standing between a parser bug and 495,000
// words of silently missing content is this script.
//
// So the controls below are shaped differently from the others in this
// directory. "Does the guard exit 1 on bad input" is nearly the least interesting
// question here, because the guard's own header records that its first version
// over-counted table delimiters and under-counted wrapped blockquotes -- it
// reported losses in EVERY phase, and a guard that always fails gets ignored,
// which the header calls "worse than having none."
//
// The load-bearing controls are therefore the MUTATION ones: they break
// `lesson-ast.mjs` in a scratch copy and require the guard to notice. That is the
// only test that distinguishes a guard which detects content loss from one that
// merely counts characters. A character count cannot tell you the parser dropped
// a block; it can only tell you the totals disagree, which is the same thing
// only if the dropping changes the total.
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const GUARD_REL = join("scripts", "audit-lesson-ast.mjs");
const PARSER_REL = join("scripts", "lesson-ast.mjs");
const TRACK = "it-roadmap";

/** A lesson with one of every block type the parser claims to handle. */
function lesson({ body = "" } = {}) {
  return [
    "## Goal of this phase",
    "Learn the thing.",
    "",
    "## Lesson",
    "",
    "### A first section",
    "",
    "A paragraph with **bold**, `code`, and a [link](https://example.com) in it.",
    "",
    "#### A subsection",
    "",
    "> A blockquote line.",
    "> A second blockquote line.",
    "",
    "- A bullet item",
    "- Another bullet item",
    "",
    "1. An ordered item",
    "2. Another ordered item",
    "",
    "| Column | Value |",
    "| --- | --- |",
    "| alpha | 12 |",
    "| beta | 34 |",
    "",
    "```bash",
    "Get-Process | Select-Object Name",
    "```",
    "",
    "A closing paragraph.",
    "",
    ...(body ? [body, ""] : []),
    "## Checklist",
    "- [ ] An item.",
    "",
  ].join("\n");
}

/**
 * Run the guard over a synthetic corpus in a scratch tree.
 *
 * Two mutation hooks, because there are two files and the distinction matters:
 *
 *   mutateParser — breaks `lesson-ast.mjs`, so the parser genuinely stops
 *     producing content. This is the real-world failure: a parser bug.
 *   mutateGuard  — breaks the guard's own reader (`astBare`), so the comparison
 *     stops counting something the parser did produce. This is the *instrument*
 *     failing rather than the subject, and it is tested too: a guard whose
 *     reader quietly stops enumerating a block type would report a corpus loss
 *     that never happened, or miss one that did.
 *
 * Both REQUIRE that the mutation actually changed the file. A `replace` whose
 * anchor no longer exists returns the input unchanged, the unmutated guard runs
 * against valid content, and the control then asserts a failure that cannot
 * occur. Two of these controls were written that way before the explicit
 * "explicit form" variants beside them passed, which is how the mistake was
 * caught -- see the note on control 1.
 */
function runOn(files, { mutateParser = null, mutateGuard = null } = {}) {
  const scratch = mkdtempSync(join(tmpdir(), "cs-ast-ctl-"));
  mkdirSync(join(scratch, "scripts"), { recursive: true });

  let guard = readFileSync(join(ROOT, GUARD_REL), "utf8");
  if (mutateGuard) {
    const next = mutateGuard(guard);
    if (next === guard) throw new Error("a guard mutation changed nothing -- it would be a control that cannot fail");
    guard = next;
  }
  writeFileSync(join(scratch, GUARD_REL), guard, "utf8");

  let parser = readFileSync(join(ROOT, PARSER_REL), "utf8");
  if (mutateParser) {
    const next = mutateParser(parser);
    if (next === parser) throw new Error("a parser mutation changed nothing -- it would be a control that cannot fail");
    parser = next;
  }
  writeFileSync(join(scratch, PARSER_REL), parser, "utf8");

  const dir = join(scratch, "career-roadmaps", TRACK);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    const rel = name.includes("/") ? name : `${TRACK}/${name}`;
    const full = join(scratch, "career-roadmaps", rel);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content, "utf8");
  }

  let out = "";
  let code = 0;
  try {
    out = execFileSync(process.execPath, [GUARD_REL], { cwd: scratch, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    code = e.status === undefined ? 1 : e.status;
    out = (e.stdout || "") + (e.stderr || "") || "";
  }
  return { code, out, scratch };
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  for (const d of detail) console.log(`        ${d}`);
}

const one = (t) => ({ "01-phase-probe.md": t });

function expectClean(name, files) {
  const r = runOn(files);
  const ok = r.code === 0;
  record(ok ? "clean: " + name : "WRONGLY FAILED: " + name, ok, ok ? ["exit 0"] : [`exit ${r.code}`, r.out.trim().split("\n").slice(-6).map((l) => "  | " + l).join("\n")]);
  rmSync(r.scratch, { recursive: true, force: true });
  return r;
}

function expectFail(name, files, pattern) {
  const r = runOn(files);
  const hit = pattern ? new RegExp(pattern, "i").test(r.out) : true;
  const ok = r.code !== 0 && hit;
  record(ok ? "notice: " + name : "FAILED TO NOTICE: " + name, ok, ok ? ["exit 1"] : [`exit ${r.code}; matched=${hit}`, r.out.trim().split("\n").slice(-6).map((l) => "  | " + l).join("\n")]);
  rmSync(r.scratch, { recursive: true, force: true });
  return r;
}

// =============================================================================
// Control 0 — the baseline. Every block type, unmutated parser.
// =============================================================================
// If this fails, the fixture is wrong, not the guard.
expectClean("control 0: a lesson with every block type parses with no content loss", one(lesson()));

// =============================================================================
// The MUTATION controls. These are the ones that matter.
// =============================================================================
// Each breaks the parser in the way real parser bugs break -- a branch that
// stops pushing, a condition that stops matching -- and requires the guard to
// notice the content that no longer reaches the AST.
//
// A character-count guard would pass all of these if the dropped text happened
// to be empty, and would only catch them because the totals moved. The three
// below are chosen so that each drops REAL WORDS, which is the failure a reader
// would see and a count-only check might miss.

{
  // 1. Paragraphs stop being pushed at all.
  //
  // The first version of this control called expectFail with no parser
  // mutation, so it ran the UNMUTATED parser against valid content and required
  // exit 1 — it could only ever fail, and for no reason to do with content loss.
  // The explicit form below it passed on the first run, which is what exposed
  // it. That is the same defect as a control whose fixture silently does not
  // apply, one level up: a control that cannot test the thing it names.
  const r = runOn(one(lesson()), {
    mutateParser: (src) => src.replace('if (text) blocks.push({ type: "para", text });', 'if (false) blocks.push({ type: "para", text });'),
  });
  const ok = r.code !== 0 && /word delta/.test(r.out);
  record(ok ? "notice: MUTATION — the parser stops emitting paragraph blocks" : "FAILED TO NOTICE: paragraphs dropped", ok, [
    `exit ${r.code}`,
    r.out.trim().split("\n").find((l) => /word delta/.test(l))?.trim() || "(no delta line)",
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

{
  // 2. Code blocks lose their body. A lesson that teaches PowerShell with an
  //    empty code block is the exact failure the guard was written for.
  const r = runOn(one(lesson()), {
    mutateParser: (src) => src.replace('blocks.push({ type: "code", lang: lang || null, text: body.join("\\n") });', 'blocks.push({ type: "code", lang: lang || null, text: "" });'),
  });
  const ok = r.code !== 0 && /word delta/.test(r.out);
  record(ok ? "notice: MUTATION — the parser emits code blocks with an empty body" : "FAILED TO NOTICE: code body emptied", ok, [
    `exit ${r.code}`,
    r.out.trim().split("\n").find((l) => /word delta/.test(l))?.trim() || "(no delta line)",
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

{
  // 3. Table cells stop reaching the AST side. The most dangerous of these,
  //    because a table is where the curriculum keeps command output, subnet
  //    ranges and answer keys.
  //
  //    This one mutates the GUARD's own reader (astBare), not the parser,
  //    because a parser bug that lost table content and a reader that stopped
  //    counting it are indistinguishable from the outside -- which is precisely
  //    why the comparison has to notice either. Dropping the branch is what
  //    "the AST no longer carries the table" looks like.
  const r = runOn(one(lesson()), {
    mutateGuard: (src) => src.replace("else if (b.type === 'table')", "else if (false && b.type === 'table')"),
  });
  const ok = r.code !== 0 && /word delta/.test(r.out);
  record(ok ? "notice: MUTATION — table cells dropped from the AST side" : "FAILED TO NOTICE: table cells dropped", ok, [
    `exit ${r.code}`,
    r.out.trim().split("\n").find((l) => /word delta/.test(l))?.trim() || "(no delta line)",
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

{
  // 4. The blockquote loses its paragraphs.
  const r = runOn(one(lesson()), {
    mutateGuard: (src) =>
      src.replace("else if (b.type === 'quote') b.paras.forEach((p) => parts.push(bare(p)));", "else if (b.type === 'quote') { /* dropped */ }"),
  });
  const ok = r.code !== 0 && /word delta/.test(r.out);
  record(ok ? "notice: MUTATION — blockquote paragraphs dropped" : "FAILED TO NOTICE: blockquote dropped", ok, [
    `exit ${r.code}`,
    r.out.trim().split("\n").find((l) => /word delta/.test(l))?.trim() || "(no delta line)",
  ]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The other two gates. The word delta is one; these are the others.
// =============================================================================
{
  // A block type the parser does not handle at all. The corpus has none, and a
  // new one appearing silently would render as nothing.
  const r = runOn({
    "01-phase-probe.md": lesson({ body: ":::note\nAn admonition block the parser may not know.\n:::" }),
  });
  const ok = r.code === 0 || /unhandled line/.test(r.out);
  record(
    "an unrecognised construct is either handled or reported as an unhandled line",
    ok,
    [`exit ${r.code}; "unhandled line" reported=${/unhandled line/.test(r.out)}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // A lesson with no headings has no table of contents and renders as an
  // unnavigable wall of text, so it is a failure in its own right.
  const noHeadings = [
    "## Goal of this phase",
    "Learn the thing.",
    "",
    "## Lesson",
    "",
    "Just prose, and more prose, with nothing to navigate by.",
    "",
    "## Checklist",
    "- [ ] An item.",
    "",
  ].join("\n");
  expectFail("a lesson with no headings is a failure (no table of contents)", one(noHeadings), /no headings for the table of contents/);
}

// =============================================================================
// Whitespace-insensitivity: the property the whole comparison rests on.
// =============================================================================
// A wrapped paragraph, a wrapped blockquote and a table's pipes must not read as
// data loss, or the guard cries wolf on every reflow and gets switched off --
// which its own header calls "worse than having none."
for (const [label, text] of [
  ["a paragraph wrapped across lines", "A paragraph that has been\nhard-wrapped at column 60 because the\nauthor's editor did that."],
  ["a blockquote wrapped across lines", "> A blockquote that has been\n> hard-wrapped mid-sentence."],
]) {
  expectClean(`reflow is not data loss: ${label}`, one(lesson({ body: text })));
}
{
  const t = lesson();
  // A table with a delimiter row is normal; the source reader strips delimiter
  // rows and the AST reader does not see them, so they must cancel out.
  const r = runOn(one(t));
  const ok = r.code === 0;
  record("table delimiter rows do not read as data loss", ok, [`exit ${r.code}`]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The corpus scope controls. The `^0[0-9]-` bug bit this guard too.
// =============================================================================
{
  // A content-loss defect in a phase 10 file must be caught. Before the pattern
  // was fixed to `^(?!00-)\d{2}-`, phases 10 and above were never checked --
  // the guard covered four fifths of the curriculum and said nothing.
  const broken = lesson();
  const r = runOn({ "10-phase-probe.md": broken }, { mutateParser: (s) => s.replace('if (text) blocks.push({ type: "para", text });', 'if (false) blocks.push({ type: "para", text });') });
  const ok = r.code !== 0 && /10-phase-probe/.test(r.out);
  record(
    "content loss in a phase 10 file is caught (the ^0[0-9]- regression)",
    ok,
    [`exit ${r.code}; the file is named=${/10-phase-probe/.test(r.out)}`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}
{
  // 00-overview is a strategy document with no lesson region, so it is skipped
  // rather than measured against lesson thresholds.
  const r = runOn({ "00-overview.md": lesson() });
  const ok = r.code === 0 && !/00-overview/.test(r.out);
  record("00-overview.md is skipped (no lesson region)", ok, [`exit ${r.code}; 00-overview appears=${!/00-overview/.test(r.out)}`]);
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================
// The denominator. A guard that reads zero files must not print OK.
// =============================================================================
{
  // This is the shape of the `^0[1-9]-` bug exactly: an empty corpus produces
  // "all 0 lessons parse with no content loss" and exit 0, which is a green
  // result about no subject at all. The guard does print the count, so the
  // assertion is that the count is visible and non-zero on real content.
  const r = runOn(one(lesson()));
  const line = r.out.split("\n").find((l) => /lessons parse with no content loss/.test(l)) || "";
  const n = /all (\d+) lessons/.exec(line);
  record(
    "the passing line states how many lessons were parsed (a green result names its subject)",
    r.code === 0 && n && n[1] === "1",
    [`line: "${line.trim()}"`],
  );
  rmSync(r.scratch, { recursive: true, force: true });
}

// =============================================================================

const failed = results.filter((r) => !r.ok);
console.log("");
if (failed.length === 0) {
  console.log(`All ${results.length} controls passed. The mutations are the point: a guard that cannot`);
  console.log("notice a parser losing paragraphs, code bodies, table cells or quotes is not checking");
  console.log("for content loss, and the corpus-scope controls hold the file pattern open.");
} else {
  console.log(`${failed.length} of ${results.length} controls FAILED.`);
}
process.exit(failed.length === 0 ? 0 : 1);
