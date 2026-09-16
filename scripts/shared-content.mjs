// Parser for career-roadmaps/shared/ — the strategy documents that sit BESIDE
// the two tracks rather than inside either one.
//
// WHY THIS MODULE EXISTS
// The anti-burnout rules, the free resource list and the weekly tracker have
// always been part of the curriculum and have never been reachable from the
// site: `build-content.mjs` walks for `*-phase-*.md` and these are not phase
// files. A reader on a 34–112 week plan — the exact reader the anti-burnout
// rules were written for — had no path to them from the app.
//
// WHY NOT JUST CALL parseLesson ON ALL THREE
// Because they are not all the same kind of document:
//
//   * `anti-burnout-rules.md` and `weekly-tracker-template.md` are prose with
//     tables and lists. parseLesson handles them once told their heading depth
//     (they are standalone files, so they start at `#`, not `###`).
//   * `resource-list.md` is a structured catalogue — 42 entries of
//     `Name — https://url` under six category headings. Rendered as prose it
//     would be a wall of unclickable text; `renderInline` handles bold, code and
//     italic only, and deliberately does not autolink. So its categories and
//     entries are extracted into data and rendered as links.
//
// A resource line that does not parse is a build failure, not a silent skip —
// the same contract `build-content.mjs` enforces for phase resources, and for
// the same reason: an unlinked resource far from its cause is a mystery, while a
// named error at build time is a five-second fix.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLesson } from "./lesson-ast.mjs";

// The documents, in the order a reader should meet them. Anti-burnout first is
// deliberate: on a plan this long, the rule that says a 25-minute day is a
// success is more load-bearing than any resource link.
//
// WHY DOCUMENTS FROM THE CYBER TRACK SIT HERE TOO
// `career-roadmaps/cybersec-roadmap/` carries three standalone documents that are
// not phases, so `build-content.mjs` — which walks for `*-phase-*.md` — never
// sees them, and until now nothing else did either: they had **zero references**
// anywhere in the site. The cyber track tells the reader to consult them.
//
// This is not a new decision. D-020 named exactly this gap for
// `career-roadmaps/shared/` and closed it by rendering those documents from a
// build artifact. The same problem had simply been left open on the other track,
// and the reader it strands is the same one: someone deciding whether a $0
// budget can carry them, or whether one month of TryHackMe Premium is worth
// buying — which is why `when-to-buy-thm-premium.md` matters more than its
// length suggests.
//
// `dir` names the track directory so a document's source path stays honest in
// the payload; it is not a routing concept. All three are `kind: "doc"` and
// render through the same path as everything else — no new block types, no new
// render branch. All three were checked against the parser before being listed:
// **zero unparsed constructs**, so the build's unknown-block guard is a real
// check on them rather than a formality.
const DOCS = [
  {
    dir: "shared",
    file: "anti-burnout-rules.md",
    id: "anti-burnout-rules",
    kind: "doc",
    blurb: "The rules that make a 34–112 week plan survivable. Read this first.",
  },
  {
    dir: "shared",
    file: "weekly-tracker-template.md",
    id: "weekly-tracker-template",
    kind: "doc",
    blurb: "A one-page weekly template, meant to be copied rather than filled in here.",
  },
  {
    dir: "shared",
    file: "resource-list.md",
    id: "resource-list",
    kind: "resources",
    blurb: "Every free resource the two tracks point at, grouped by subject.",
  },
  {
    dir: "cybersec-roadmap",
    file: "WHEN-TO-BUY-THM-PREMIUM.md",
    id: "when-to-buy-thm-premium",
    kind: "doc",
    blurb:
      "Whether to pay for TryHackMe Premium, and for how long — a $0-budget question answered honestly.",
  },
  {
    dir: "cybersec-roadmap",
    file: "FREE-TOOL-MAP.md",
    id: "free-tool-map",
    kind: "doc",
    blurb: "Every paid tool the cyber track mentions, and the free alternative for it.",
  },
  {
    dir: "cybersec-roadmap",
    file: "TOOLBOX.md",
    id: "cyber-toolbox",
    kind: "doc",
    blurb:
      "The cyber track's toolkit, with the phase and practice task each tool belongs to.",
  },
];

function titleOf(markdown, fallback) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

/**
 * Pull `## Category` headings and their `- Name — https://url` entries out of
 * the resource list.
 *
 * The separator is an em dash surrounded by spaces, which is what the file
 * actually uses. It is written as an explicit alternation rather than a loose
 * `\s+—\s+` so a future line using a hyphen is reported instead of being
 * silently half-parsed into a name containing a URL.
 */
function parseResources(markdown, fail) {
  const groups = [];
  let current = null;
  let inFence = false;

  for (const raw of markdown.split("\n")) {
    const line = raw.trimEnd();

    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    // A top-level `# Title` is the document title, not a category.
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      current = { heading: h2[1].trim(), resources: [] };
      groups.push(current);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (!bullet) continue;
    if (!current) {
      fail("resource entry before any `##` category: " + bullet[1].slice(0, 60));
      continue;
    }

    const entry = bullet[1].trim();
    const m = entry.match(/^(.*?)\s+—\s+(https?:\/\/\S+)$/);
    if (!m) {
      fail(
        /https?:\/\//.test(entry)
          ? 'resource line has a URL but the separator is not " — ": ' + entry
          : 'resource line has no URL — expected "Name — https://…": ' + entry
      );
      continue;
    }
    current.resources.push({ name: m[1].trim(), url: m[2] });
  }

  return groups;
}

/**
 * Build the shared-document payload.
 *
 * @param {string} contentRoot absolute path to career-roadmaps — the root, not a
 *   single track directory, because documents come from more than one track and
 *   each DOCS entry names its own `dir`.
 * @param {(msg: string) => void} fail called for each contract violation
 * @returns {{generatedAt: string, docs: Array<object>}}
 */
export function buildShared(contentRoot, fail) {
  const docs = [];

  for (const spec of DOCS) {
    const rel = spec.dir + "/" + spec.file;
    const path = join(contentRoot, spec.dir, spec.file);
    let markdown;
    try {
      markdown = readFileSync(path, "utf8");
    } catch {
      fail("missing shared document: " + rel);
      continue;
    }

    const title = titleOf(markdown, spec.id);
    const base = {
      id: spec.id,
      kind: spec.kind,
      title,
      blurb: spec.blurb,
      sourcePath: "career-roadmaps/" + rel,
    };

    if (spec.kind === "resources") {
      const groups = parseResources(markdown, (m) => fail(rel + ": " + m));
      const count = groups.reduce((n, g) => n + g.resources.length, 0);
      if (count === 0) fail(spec.file + ": parsed zero resource entries");
      docs.push({ ...base, groups, resourceCount: count });
      continue;
    }

    // A standalone file starts at `#`, so its headings are levels 1–3 rather
    // than the 3–5 a lesson uses inside its `## Lesson` wrapper.
    const parsed = parseLesson(markdown, { headingBase: 1 });

    // An unhandled construct would reach the page as literal text, so this
    // fails the build for the same reason the lesson path does. Note the
    // checkbox branch in lesson-ast.mjs: the weekly tracker's `- [ ]` lines are
    // list items with a `checked` flag, not unknown constructs.
    for (const line of parsed.unknown) {
      fail(rel + ": unsupported construct: " + line);
    }

    docs.push({
      ...base,
      blocks: parsed.blocks,
      toc: parsed.toc,
      blockCount: parsed.blockCount,
    });
  }

  return { generatedAt: new Date().toISOString(), docs };
}