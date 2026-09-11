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
  const ProgressBar = await load("/src/components/ProgressBar.jsx");
  const PhaseCard = await load("/src/components/PhaseCard.jsx");
  const ChecklistItem = await load("/src/components/ChecklistItem.jsx");
  const ToolCard = await load("/src/components/ToolCard.jsx");
  const EnergyModeSelector = await load("/src/components/EnergyModeSelector.jsx");
  const EmptyState = await load("/src/components/EmptyState.jsx");
  const ToolsLibrary = await load("/src/pages/ToolsLibrary.jsx");

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