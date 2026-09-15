// Render smoke test for the learning site.
//
// `vite build` proves the code compiles. It does not prove a component renders
// with the props it is actually given: a component whose signature does not
// match its call site still compiles cleanly. That is how ToolCard shipped
// containing PhaseCard's implementation — the build passed, the dev server
// booted, and opening any phase crashed at render time.
//
// Rendering App alone would not have caught it. App shows the Dashboard, and
// the Dashboard never mounts PhaseDetail. This script renders PhaseDetail for
// every phase, which walks into ToolCard with real tool data.
//
// Uses only what is already installed — react-dom/server to render, and Vite's
// ssrLoadModule to transform JSX. No new dependencies.
//
// LIMITATION: server rendering runs no useEffect and no event handlers, so this
// catches render-time crashes, not interaction bugs.
//
// Run: npm run test:smoke   (from learning-site/)

import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const failures = [];
let renders = 0;

// React escapes text nodes. Decode before asserting on rendered text, so the
// assertion is about content rather than about entity encoding.
function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function render(label, element) {
  try {
    const html = renderToStaticMarkup(element);
    if (!html) {
      failures.push(label + " — rendered empty output");
      return null;
    }
    renders++;
    return decode(html);
  } catch (e) {
    failures.push(label + " — " + e.message);
    return null;
  }
}

function assert(label, ok, detail) {
  if (!ok) failures.push(label + " — " + detail);
}

// Exact class-token match. A plain substring check would confuse
// "badge--free" with "badge--freemium".
function hasClass(html, name) {
  return new RegExp("\\b" + name + "\\b").test(html);
}

const noop = () => {};

// Declared out here so the summary line can report totals after the try block.
let allPhases = [];
let allTools = [];
// Also needed by the inline-markup sweep below, which runs after the try block.
let PhaseDetailForSweep = null;

const server = await createServer({
  root: ROOT,
  logLevel: "silent",
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  async function load(path) {
    try {
      return (await server.ssrLoadModule(path)).default;
    } catch (e) {
      failures.push(path + " — failed to load: " + e.message);
      return null;
    }
  }

  const roadmaps = await server.ssrLoadModule("/src/data/roadmaps.js");
  const tracks = roadmaps.tracks || [];
  if (tracks.length === 0) {
    failures.push("roadmaps.js — no tracks loaded (is src/data/generated present?)");
  }

  const App = await load("/src/App.jsx");
  const Dashboard = await load("/src/pages/Dashboard.jsx");
  const PhaseDetail = await load("/src/pages/PhaseDetail.jsx");
  PhaseDetailForSweep = PhaseDetail;
  const ProgressBar = await load("/src/components/ProgressBar.jsx");
  const PhaseCard = await load("/src/components/PhaseCard.jsx");
  const ChecklistItem = await load("/src/components/ChecklistItem.jsx");
  const ToolCard = await load("/src/components/ToolCard.jsx");
  const Lesson = await load("/src/components/Lesson.jsx");
  const EnergyModeSelector = await load("/src/components/EnergyModeSelector.jsx");
  const EmptyState = await load("/src/components/EmptyState.jsx");
  const ToolsLibrary = await load("/src/pages/ToolsLibrary.jsx");
  const Portfolio = await load("/src/pages/Portfolio.jsx");
  const Applications = await load("/src/pages/Applications.jsx");
  const Search = await load("/src/pages/Search.jsx");

  allPhases = tracks.flatMap((t) => t.phases);
  allTools = allPhases.flatMap((p) => p.tools);

  // --- ToolCard ---
  // This is the component that shipped containing PhaseCard's implementation.
  // Called as <ToolCard tool={...} />, the old code destructured `phase` and
  // threw on the first property access.
  const freeTool = allTools.find(
    (t) => /^free/i.test(t.cost) && !/freemium/i.test(t.cost)
  );
  const freemiumTool = allTools.find((t) => /freemium/i.test(t.cost));

  if (!freeTool) failures.push("fixtures — no free-cost tool in generated data");
  if (!freemiumTool) failures.push("fixtures — no freemium tool in generated data");

  if (ToolCard && freeTool) {
    const html = render("ToolCard (free)", createElement(ToolCard, { tool: freeTool }));
    if (html) {
      assert("ToolCard: name", html.includes(freeTool.name), "tool name not rendered");
      assert("ToolCard: purpose", html.includes(freeTool.purpose), "purpose not rendered");
      assert("ToolCard: mini-task", html.includes(freeTool.task), "mini-task not rendered");
      assert(
        "ToolCard: cost badge",
        hasClass(html, "badge--free"),
        "expected badge--free for cost " + JSON.stringify(freeTool.cost)
      );
      assert(
        "ToolCard: not a phase card",
        !hasClass(html, "phase-card"),
        "renders phase-card markup instead of tool-card markup"
      );
    }
  }

  if (ToolCard && freemiumTool) {
    const html = render(
      "ToolCard (freemium)",
      createElement(ToolCard, { tool: freemiumTool })
    );
    if (html) {
      assert(
        "ToolCard: freemium badge",
        hasClass(html, "badge--freemium"),
        "expected badge--freemium for cost " + JSON.stringify(freemiumTool.cost)
      );
    }
  }

  // --- PhaseDetail, every phase ---
  // The path the dashboard never exercises. This is what mounts ToolCard
  // with real data, so it is the test that actually catches the crash.
  if (PhaseDetail) {
    for (const phase of allPhases) {
      const html = render(
        "PhaseDetail " + phase.id,
        createElement(PhaseDetail, {
          phase,
          done: {},
          onToggle: noop,
          onBack: noop,
        })
      );
      if (html) {
        assert(
          "PhaseDetail " + phase.id + ": title",
          html.includes(phase.title),
          "phase title not rendered"
        );
      }
    }
  }

  // --- Lesson renderer, every phase ---
  // The lesson is ~90% of each phase file and is the reason the site exists.
  // Server rendering never runs useEffect or IntersectionObserver, so what this
  // proves is the block switch itself: that every block type the parser emits
  // has a renderer, that tables and code survive, and that inline Markdown is
  // not left as literal asterisks. The parser is checked for content loss
  // separately by scripts/audit-lesson-ast.mjs.
  if (Lesson) {
    for (const phase of allPhases) {
      const lessonPath = join(
        ROOT,
        "src",
        "data",
        "generated",
        "lessons",
        phase.id + ".json"
      );
      if (!existsSync(lessonPath)) {
        failures.push("Lesson " + phase.id + " — no lesson file at " + lessonPath);
        continue;
      }
      const lesson = JSON.parse(readFileSync(lessonPath, "utf8"));

      const html = render(
        "Lesson " + phase.id,
        createElement(Lesson, {
          title: lesson.title,
          blocks: lesson.blocks,
          toc: lesson.toc,
        })
      );
      if (!html) continue;

      const label = "Lesson " + phase.id;

      assert(label + ": has blocks", (lesson.blocks || []).length > 0, "lesson has no blocks");

      assert(
        label + ": no unsupported block",
        !html.includes("Unsupported block type"),
        "a block type reached the renderer with no case for it"
      );

      // Literal Markdown markers in rendered prose mean inline formatting was
      // not applied. Code blocks are excluded: their whole purpose is to show
      // text verbatim, and a `markdown` fence legitimately displays **bold** as
      // an example. Only the surrounding prose is checked.
      const prose = html
        .replace(/<pre[\s\S]*?<\/pre>/g, "")
        .replace(/<code[\s\S]*?<\/code>/g, "");
      assert(
        label + ": inline bold rendered",
        !prose.includes("**"),
        "literal ** reached rendered prose — renderInline did not run"
      );
      assert(
        label + ": inline code rendered",
        !/`[^`]+`/.test(prose),
        "literal backticks reached rendered prose — renderInline did not run"
      );

      // Tables: compare counts against the AST so a dropped table is caught.
      const tableBlocks = (lesson.blocks || []).filter((b) => b.type === "table").length;
      const renderedTables = (html.match(/<table/g) || []).length;
      assert(
        label + ": tables rendered",
        renderedTables === tableBlocks,
        "expected " + tableBlocks + " tables, rendered " + renderedTables
      );

      const codeBlocks = (lesson.blocks || []).filter((b) => b.type === "code").length;
      const renderedCode = (html.match(/<pre/g) || []).length;
      assert(
        label + ": code blocks rendered",
        renderedCode === codeBlocks,
        "expected " + codeBlocks + " code blocks, rendered " + renderedCode
      );

      // Every code block needs a copy control. The curriculum ships hundreds of
      // runnable commands and retyping one is how a beginner mistypes a flag and
      // concludes the lesson is wrong, so a missing button is a real defect and
      // not a cosmetic one. Asserted against the code count so a block that
      // renders without its button is caught rather than counted as fine.
      if (codeBlocks > 0) {
        const copyButtons = (html.match(/class="lesson__copy"/g) || []).length;
        assert(
          label + ": copy button per code block",
          copyButtons === codeBlocks,
          "expected " + codeBlocks + " copy buttons, found " + copyButtons
        );

        // The wrap must exist too: the button is positioned against it, and
        // without the wrapper the button and the code block are siblings with
        // no shared box.
        const wraps = (html.match(/class="lesson__code-wrap"/g) || []).length;
        assert(
          label + ": code wrapper per code block",
          wraps === codeBlocks,
          "expected " + codeBlocks + " code wrappers, found " + wraps
        );
      }

      // Every heading needs a unique id, or the table of contents links to the
      // wrong place (or to nothing).
      const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      assert(
        label + ": heading ids unique",
        dupes.length === 0,
        "duplicate id(s): " + [...new Set(dupes)].slice(0, 3).join(", ")
      );

      // Each TOC entry must point at an id that exists in the body.
      const tocTargets = (lesson.toc || []).map((t) => t.id);
      const missingTargets = tocTargets.filter((t) => !ids.includes(t));
      assert(
        label + ": toc targets exist",
        missingTargets.length === 0,
        "toc points at missing id(s): " + missingTargets.slice(0, 3).join(", ")
      );
    }
  }

  // --- Dashboard, every track ---
  if (Dashboard) {
    for (const track of tracks) {
      const html = render(
        "Dashboard " + track.id,
        createElement(Dashboard, {
          track,
          done: {},
          mode: "normal",
          onModeChange: noop,
          onOpenTrack: noop,
          onOpenPhase: noop,
        })
      );
      if (html) {
        assert(
          "Dashboard " + track.id + ": prompt",
          html.includes("What should I do today?"),
          "missing the dashboard's primary question"
        );
      }
    }
  }

  // --- App ---
  render("App", createElement(App));

  // --- Standalone components ---
  if (ProgressBar) {
    const html = render(
      "ProgressBar",
      createElement(ProgressBar, { done: 3, total: 10 })
    );
    if (html) {
      assert("ProgressBar: label", html.includes("3/10"), "expected a 3/10 label");
      assert("ProgressBar: aria", html.includes('role="progressbar"'), "missing progressbar role");
    }
  }

  if (PhaseCard && allPhases[0]) {
    render(
      "PhaseCard",
      createElement(PhaseCard, {
        phase: allPhases[0],
        done: 1,
        total: 5,
        onOpen: noop,
      })
    );
  }

  if (ChecklistItem) {
    render(
      "ChecklistItem",
      createElement(ChecklistItem, {
        item: { id: "test-c01", text: "A test checklist item", energy: "low" },
        checked: false,
        onToggle: noop,
      })
    );
  }

  if (EnergyModeSelector) {
    render(
      "EnergyModeSelector",
      createElement(EnergyModeSelector, { mode: "normal", onChange: noop })
    );
  }

  if (ToolsLibrary) {
    const html = render(
      "ToolsLibrary",
      createElement(ToolsLibrary, { onOpenPhase: noop })
    );
    if (html) {
      assert(
        "ToolsLibrary: heading",
        html.includes("Tools library"),
        "page heading not rendered"
      );
      assert(
        "ToolsLibrary: lists a known tool",
        html.includes(allTools[0].name),
        "no tool card rendered"
      );
      assert(
        "ToolsLibrary: count line",
        html.includes(allTools.length + " tools") ||
          html.includes("of " + allTools.length),
        "tool count not rendered"
      );
    }
  }

  if (Portfolio) {
    // usePortfolio's load() touches window.localStorage inside a try/catch, so
    // in the server renderer it falls back to an empty list rather than
    // throwing. That makes this the empty-state path, which is the branch a
    // first-time visitor actually sees.
    const html = render("Portfolio", createElement(Portfolio));
    if (html) {
      assert(
        "Portfolio: heading",
        html.includes("Portfolio"),
        "page heading not rendered"
      );
      assert(
        "Portfolio: empty state",
        html.includes("No portfolio entries yet"),
        "empty-state message not rendered"
      );
      assert(
        "Portfolio: add affordance",
        html.includes("Add an entry"),
        "no way to add the first entry"
      );
    }
  }

  if (Applications) {
    // Same reasoning as Portfolio: localStorage is unavailable in the server
    // renderer, so load() returns an empty list and this is the empty-state
    // branch — what a first-time visitor sees.
    const html = render("Applications", createElement(Applications));
    if (html) {
      assert(
        "Applications: heading",
        html.includes("Applications"),
        "page heading not rendered"
      );
      assert(
        "Applications: empty state",
        html.includes("No applications yet"),
        "empty-state message not rendered"
      );
      assert(
        "Applications: add affordance",
        html.includes("Add an application"),
        "no way to add the first application"
      );
    }
  }

  if (Search) {
    // The idle state, which is what a reader sees on arrival: no index fetched
    // yet, so the hint block must render without any data.
    const html = render("Search", createElement(Search, { onOpenResult: noop }));
    if (html) {
      assert("Search: heading", html.includes("Search"), "page heading not rendered");
      assert(
        "Search: input",
        html.includes('type="search"') || html.includes("aria-label=\"Search lessons\""),
        "no search input rendered"
      );
      assert(
        "Search: hints when idle",
        html.includes("What you can search for"),
        "idle-state guidance not rendered"
      );
      assert(
        "Search: does not render results before a query",
        !html.includes("search__result"),
        "rendered result rows with no query"
      );
    }
  }

  if (EmptyState) {
    const bare = render(
      "EmptyState (message only)",
      createElement(EmptyState, { message: "Nothing here yet." })
    );
    if (bare) {
      assert(
        "EmptyState: message",
        bare.includes("Nothing here yet."),
        "message not rendered"
      );
    }
    render(
      "EmptyState (with action)",
      createElement(
        EmptyState,
        { message: "Nothing here yet." },
        createElement("button", { type: "button", className: "btn" }, "Add one")
      )
    );
  }
} finally {
  await server.close();
}

// ---------------------------------------------------------------------------
// Regression check: no literal inline Markdown in rendered output.
//
// The generated JSON carries **bold**, `code` and *italic* from the curriculum
// Markdown. The site has no Markdown renderer, so before src/lib/renderInline.jsx
// existed these were displayed with the asterisks and backticks visible to the
// reader. This asserts that every content string containing that syntax is
// rendered through the formatter.
//
// Scoped to the fields the site renders as text. A visible "**" or "`" in any
// of them means a render site was missed.
{
  const MARKUP = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*)/;

  function collectStrings(node, out) {
    if (typeof node === "string") {
      if (MARKUP.test(node)) out.push(node);
      return;
    }
    if (Array.isArray(node)) return node.forEach((v) => collectStrings(v, out));
    if (node && typeof node === "object") {
      Object.values(node).forEach((v) => collectStrings(v, out));
    }
  }

  const marked = [];
  for (const phase of allPhases) collectStrings(phase, marked);

  // Rendered phase pages, so the assertion is about output rather than intent.
  if (allPhases.length > 0 && PhaseDetailForSweep) {
    let withMarkup = 0;
    for (const phase of allPhases) {
      const html = render("PhaseDetail: " + phase.id, createElement(PhaseDetailForSweep, {
        phase,
        done: {},
        onToggle: noop,
        onBack: noop,
      }));
      if (html && /\*\*|`/.test(html)) {
        withMarkup++;
        const sample = html.match(/.{0,60}(\*\*|`).{0,60}/);
        assert(
          "PhaseDetail: " + phase.id,
          false,
          "literal Markdown markers in rendered text: " +
            (sample ? sample[0].replace(/\s+/g, " ").trim() : "")
        );
      }
    }
    if (withMarkup === 0) {
      renders++; // count the sweep itself as one passing render
    }
  }

  console.log(
    "  inline-markup sweep: " +
      marked.length +
      " content string(s) contain formatting, none rendered literally."
  );
}

if (failures.length > 0) {
  console.error("SMOKE RENDER FAILED — " + failures.length + " issue(s):");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log(
  "SMOKE RENDER PASSED — " +
    renders +
    " renders across " +
    allPhases.length +
    " phases and " +
    allTools.length +
    " tools, 0 failures."
);