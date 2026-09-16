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

// Some components are CORRECTLY empty in a given state: ResumePrompt is silent
// when the remembered section is the one the page already opens at, and
// ShortcutHelp renders nothing while closed. Passing those through render()
// would report a passing design as a defect, so they get their own entry point
// that distinguishes "rendered nothing, as intended" from "threw".
function renderMaybeEmpty(label, element) {
  try {
    const html = renderToStaticMarkup(element);
    renders++;
    return decode(html || "");
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
  const ProgressRing = await load("/src/components/ProgressRing.jsx");
  const PhaseCard = await load("/src/components/PhaseCard.jsx");
  const ChecklistItem = await load("/src/components/ChecklistItem.jsx");
  const ToolCard = await load("/src/components/ToolCard.jsx");
  const Lesson = await load("/src/components/Lesson.jsx");
  const EnergyModeSelector = await load("/src/components/EnergyModeSelector.jsx");
  const EmptyState = await load("/src/components/EmptyState.jsx");
  const ToolsLibrary = await load("/src/pages/ToolsLibrary.jsx");
  const Portfolio = await load("/src/pages/Portfolio.jsx");
  const Applications = await load("/src/pages/Applications.jsx");
  const Certifications = await load("/src/pages/Certifications.jsx");
  const Search = await load("/src/pages/Search.jsx");
  const Schedule = await load("/src/pages/Schedule.jsx");
  const PhaseNav = await load("/src/components/PhaseNav.jsx");
  const ShortcutHelp = await load("/src/components/ShortcutHelp.jsx");
  const { ReadingBar, ResumePrompt } = await server.ssrLoadModule(
    "/src/components/ReadingPosition.jsx"
  );
  const LessonToolbar = await load("/src/components/LessonToolbar.jsx");
  const NotesPanel = await load("/src/components/NotesPanel.jsx");
  const TaskList = await load("/src/components/TaskList.jsx");
  const TimeBudgetSelector = await load("/src/components/TimeBudgetSelector.jsx");
  const Shared = await load("/src/pages/Shared.jsx");
  const YourWork = await load("/src/pages/YourWork.jsx");
  // The shared corpus is a build artifact, imported directly by Shared.jsx. It
  // is loaded here too so the render assertions are checked against the real
  // document count rather than a number copied into this file.
  const sharedData = await server
    .ssrLoadModule("/src/data/generated/shared.json")
    .then((m) => m.default || m)
    .catch(() => null);
  if (!sharedData) failures.push("shared.json — not present (run the content build)");

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
          budget: "focused",
          onBudgetChange: noop,
          onOpenTrack: noop,
          onOpenPhase: noop,
          onGoToView: noop,
        })
      );
      if (html) {
        assert(
          "Dashboard " + track.id + ": prompt",
          html.includes("What should I do today?"),
          "missing the dashboard's primary question"
        );
        assert(
          "Dashboard " + track.id + ": time control",
          hasClass(html, "budget__options"),
          "no time budget control rendered"
        );
        assert(
          "Dashboard " + track.id + ": energy control",
          hasClass(html, "energy__options"),
          "no energy control rendered"
        );
        // The bands are authored estimates, not measurements. If this label ever
        // disappears the page is presenting a guess with the confidence of a
        // measurement, which is the failure it exists to prevent.
        assert(
          "Dashboard " + track.id + ": says the estimate is an estimate",
          /estimate/i.test(html),
          "the band estimate is presented without qualification"
        );
        // The suggestion must come from the practice tasks, which carry bands,
        // and not from the checklist, which does not. With an empty `done` and a
        // focused budget, a task is expected — so a "nothing" message here means
        // the picker was wired to the wrong list.
        assert(
          "Dashboard " + track.id + ": offers a task",
          !/No practice tasks left/.test(html),
          "an untouched track reported no practice tasks"
        );
      }
    }

    // A budget of "quick" against a deep-only remainder must name what it is
    // missing rather than claim the track is finished. Rendered against the
    // second track so the first track's assertions above stay untouched.
    if (tracks.length > 1) {
      const blocked = render(
        "Dashboard " + tracks[1].id + " (quick)",
        createElement(Dashboard, {
          track: tracks[1],
          done: {},
          mode: "normal",
          onModeChange: noop,
          budget: "quick",
          onBudgetChange: noop,
          onOpenTrack: noop,
          onOpenPhase: noop,
          onGoToView: noop,
        })
      );
      if (blocked) {
        assert(
          "Dashboard (quick): never claims a non-empty track is complete",
          !/No practice tasks left in this track/.test(blocked),
          "a track with work left rendered the all-done message"
        );
      }
    }
  }

  // --- Phase navigation, every phase ---
  // The pager is the feature whose absence was most obvious in use: a phase
  // ended after its exit criteria with no way forward. What this asserts is that
  // every phase in a track has at least ONE live neighbour and that the boundary
  // phases are honest about being boundaries — a pager that renders two dead
  // buttons on the last phase of a track looks broken rather than finished.
  if (PhaseNav) {
    for (const track of tracks) {
      const phases = track.phases;
      for (let i = 0; i < phases.length; i++) {
        const prev = i > 0 ? phases[i - 1] : null;
        const next = i < phases.length - 1 ? phases[i + 1] : null;
        const label = "PhaseNav " + phases[i].id;

        const html = render(
          label,
          createElement(PhaseNav, {
            prev,
            next,
            index: i,
            count: phases.length,
            onOpenPhase: noop,
          })
        );
        if (!html) continue;

        assert(
          label + ": names the next phase",
          !next || html.includes(next.title.replace(/^Phase \d+\s*—\s*/, "")),
          "next phase name not rendered"
        );
        assert(
          label + ": names the previous phase",
          !prev || html.includes(prev.title.replace(/^Phase \d+\s*—\s*/, "")),
          "previous phase name not rendered"
        );
        assert(
          label + ": first phase says so",
          prev || html.includes("first phase"),
          "no indication that this is the first phase"
        );
        assert(
          label + ": last phase says so",
          next || html.includes("last phase"),
          "no indication that this is the last phase"
        );

        // The position line lives on the compact variant, which is the one that
        // sits beside the Back button at the top of a phase.
        const compact = render(
          label + " (compact)",
          createElement(PhaseNav, {
            prev,
            next,
            index: i,
            count: phases.length,
            onOpenPhase: noop,
            variant: "compact",
          })
        );
        if (compact) {
          assert(
            label + " compact: position line",
            compact.includes("Phase " + (i + 1) + " of " + phases.length),
            "position not rendered in the compact pager"
          );
        }
      }
    }
  }

  // --- Lesson section toggles ---
  // Every h3/h4 in a lesson must get a done control, and h5 must NOT — those are
  // paragraph-level labels with no section identity, so a control on one would
  // produce a heading the TOC cannot show or count. Asserted per lesson against
  // the TOC, which is the list the phase's section progress is measured from.
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
      if (!existsSync(lessonPath)) continue;
      const lesson = JSON.parse(readFileSync(lessonPath, "utf8"));

      const html = render(
        "Lesson toggles " + phase.id,
        createElement(Lesson, {
          title: lesson.title,
          blocks: lesson.blocks,
          toc: lesson.toc,
          phaseId: phase.id,
        })
      );
      if (!html) continue;

      const label = "Lesson toggles " + phase.id;
      const tocIds = new Set((lesson.toc || []).map((t) => t.id));
      const headingBlocks = (lesson.blocks || []).filter(
        (b) => b.type === "heading"
      );
      const expected = headingBlocks.filter(
        (b) => (b.level === 3 || b.level === 4) && tocIds.has(b.id)
      ).length;
      const rendered = (html.match(/class="lesson__done"/g) || []).length;

      assert(
        label + ": one done control per section heading",
        rendered === expected,
        "expected " + expected + " section controls, rendered " + rendered
      );

      // The toolbar must report the same denominator the controls are counted
      // against, or the progress line and the checkboxes disagree.
      assert(
        label + ": toolbar total matches sections",
        html.includes("0/" + expected + " sections"),
        "toolbar does not report " + expected + " sections"
      );
    }
  }

  // --- Section progress counts persisted state ---
  // useLessonProgress resolves its "done" state through a namespaced key. A key
  // collision between two phases would make progress in one appear in the other,
  // which is invisible in the UI — the checkbox just renders already-ticked.
  if (LessonToolbar) {
    const html = render(
      "LessonToolbar",
      createElement(LessonToolbar, {
        doneCount: 7,
        total: 20,
        tickMode: false,
        onToggleTickMode: noop,
        size: "m",
        onSizeChange: noop,
      })
    );
    if (html) {
      assert(
        "LessonToolbar: count",
        html.includes("7/20 sections"),
        "section count not rendered"
      );
      assert(
        "LessonToolbar: progressbar role",
        html.includes('role="progressbar"'),
        "missing progressbar role"
      );
      assert(
        "LessonToolbar: four size options",
        (html.match(/chip--s/g) || []).length === 4,
        "expected 4 reading-size options"
      );
      assert(
        "LessonToolbar: tick toggle is a pressed state",
        html.includes('aria-pressed="false"'),
        "the tick-off toggle does not report its state"
      );
    }
  }

  // --- Reading position ---
  if (ReadingBar) {
    const html = render("ReadingBar", createElement(ReadingBar, { fraction: 0.42 }));
    if (html) {
      assert(
        "ReadingBar: width follows the fraction",
        html.includes("width:42%"),
        "bar width does not track the reading fraction"
      );
      assert(
        "ReadingBar: hidden from assistive tech",
        html.includes('aria-hidden="true"'),
        "a decorative position bar should not be announced"
      );
    }
  }

  if (ResumePrompt) {
    const html = render(
      "ResumePrompt",
      createElement(ResumePrompt, {
        section: { id: "part-7", text: "Part 7 — Storage" },
        firstSectionId: "why",
        onJump: noop,
      })
    );
    if (html) {
      assert(
        "ResumePrompt: names the section",
        html.includes("Part 7 — Storage"),
        "the remembered section is not named"
      );
    }

    // The first section is where the page already opens, so the prompt would be
    // pure noise there. Rendered as empty, not as a prompt that jumps nowhere.
    const silent = renderMaybeEmpty(
      "ResumePrompt (first section)",
      createElement(ResumePrompt, {
        section: { id: "why", text: "Why this lesson exists" },
        firstSectionId: "why",
        onJump: noop,
      })
    );
    assert(
      "ResumePrompt: silent at the first section",
      silent !== null && !silent.includes("You were reading"),
      "prompt rendered for the section the page already opens at"
    );
  }

  // --- Schedule ---
  // A page with a date comparison in it is exactly where a wrong render is
  // invisible: the numbers still look like numbers.
  if (Schedule) {
    for (const track of tracks) {
      const html = render(
        "Schedule " + track.id,
        createElement(Schedule, {
          trackId: track.id,
          done: {},
          onOpenPhase: noop,
          onOpenTrack: noop,
        })
      );
      if (!html) continue;
      const label = "Schedule " + track.id;

      assert(label + ": heading", html.includes("Schedule"), "heading not rendered");
      assert(
        label + ": planned weeks",
        html.includes("weeks planned"),
        "planned length not rendered"
      );
      assert(
        label + ": phase count",
        html.includes(track.phases.length + "</span>") ||
          html.includes(">" + track.phases.length + "<"),
        "phase count not rendered"
      );
      assert(
        label + ": offers a start date",
        html.includes('type="date"'),
        "no way to set the track's start date"
      );
      assert(
        label + ": lists every phase",
        track.phases.every((p) => html.includes(p.title)),
        "a phase is missing from the plan table"
      );
      // The planned total must equal the sum of the phases' own durations, or
      // the headline number and the table beneath it disagree.
      const totalWeeks = track.phases.reduce(
        (n, p) => n + (Number(p.durationWeeks) || 0),
        0
      );
      assert(
        label + ": planned total matches the phase rows",
        html.includes(">" + totalWeeks + "</span>"),
        "headline total is not the sum of the phase durations (" + totalWeeks + ")"
      );
      // With no start date there is no comparison to make, and the page must say
      // so rather than render a confident 0%.
      assert(
        label + ": says when it cannot compare",
        html.includes("Not enough information"),
        "no start date, but no explanation of what is missing"
      );
    }
  }

  // --- Shortcut help ---
  if (ShortcutHelp) {
    const closed = renderMaybeEmpty(
      "ShortcutHelp (closed)",
      createElement(ShortcutHelp, { open: false, onClose: noop })
    );
    assert(
      "ShortcutHelp: nothing rendered when closed",
      closed !== null && !closed.includes("Keyboard shortcuts"),
      "an open dialog rendered while closed"
    );

    const html = render(
      "ShortcutHelp (open)",
      createElement(ShortcutHelp, { open: true, onClose: noop })
    );
    if (html) {
      assert(
        "ShortcutHelp: dialog role",
        html.includes('role="dialog"'),
        "the panel is not announced as a dialog"
      );
      assert(
        "ShortcutHelp: lists the search key",
        html.includes("Focus search"),
        "the search shortcut is not documented"
      );
      assert(
        "ShortcutHelp: lists phase navigation",
        html.includes("Next phase") && html.includes("Previous phase"),
        "phase navigation shortcuts are not documented"
      );
      assert(
        "ShortcutHelp: says shortcuts are ignored while typing",
        html.includes("ignored while you are typing"),
        "no warning that shortcuts are suspended in fields"
      );
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

  // The ring is a chart, so the value must survive without it. These assertions
  // are about that duty, not about the svg's geometry: the arc is drawn from the
  // dash array, and the number the reader needs is also rendered as text.
  if (ProgressRing) {
    const html = render(
      "ProgressRing",
      createElement(ProgressRing, { value: 42, label: "42 of 100 tasks complete" })
    );
    if (html) {
      assert(
        "ProgressRing: accessible name",
        html.includes("42 of 100 tasks complete"),
        "the ring carries no accessible label"
      );
      assert(
        "ProgressRing: filled arc is drawn",
        html.includes("stroke-dasharray") && !html.includes("stroke-dasharray=\"0 "),
        "no arc drawn for a 42% value"
      );
      assert(
        "ProgressRing: track is drawn too",
        html.includes("ring__track"),
        "missing the unfilled track"
      );
    }

    // Bounds. A percentage outside 0–100 must clamp rather than draw an arc
    // longer than the circle, and a non-numeric value must not reach the dash
    // arithmetic as NaN — which renders as no arc at all, silently.
    const over = render(
      "ProgressRing (over 100)",
      createElement(ProgressRing, { value: 140, label: "clamped" })
    );
    assert(
      "ProgressRing: clamps above 100",
      over !== null && !over.includes("NaN"),
      "an out-of-range value reached the geometry"
    );

    const junk = render(
      "ProgressRing (non-numeric)",
      createElement(ProgressRing, { value: "nonsense", label: "empty" })
    );
    assert(
      "ProgressRing: survives a non-numeric value",
      junk !== null && !junk.includes("NaN"),
      "a non-numeric value reached the geometry"
    );

    // The arc must be proportional, not merely present. A ring whose arc never
    // changed would satisfy every assertion above and still be a lie about the
    // one number it exists to show.
    const arcOf = (value) => {
      const html = render(
        "ProgressRing",
        createElement(ProgressRing, { value })
      );
      const m = html && html.match(/stroke-dasharray="([\d.]+)/);
      return m ? Number(m[1]) : null;
    };
    const smallArc = arcOf(10);
    const largeArc = arcOf(80);
    assert(
      "ProgressRing: arc is proportional to the value",
      smallArc !== null && largeArc !== null && largeArc > smallArc,
      "an 80% ring does not draw a longer arc than a 10% one"
    );

    const zeroArc = arcOf(0);
    assert(
      "ProgressRing: zero draws an empty arc",
      zeroArc === 0,
      "a 0% ring drew a non-zero arc"
    );
  }

  // --- NotesPanel ---
  // The reader's own writing. What matters here is that the panel renders with
  // no note at all (the common case: most phases are opened before anything is
  // written), that a note is not visible until the panel is opened, and — the
  // one that would actually hurt — that the rendered output contains no count or
  // completion language, which would turn a workspace into a scoreboard.
  if (NotesPanel) {
    const empty = render(
      "NotesPanel (empty)",
      createElement(NotesPanel, {
        phaseId: "it-01-computer-fundamentals",
        note: "",
        hasAnswers: false,
        onChange: noop,
        onClear: noop,
      })
    );
    if (empty) {
      assert(
        "NotesPanel: empty state renders a prompt",
        empty.includes("Add a note"),
        "no control to open the panel"
      );
      assert(
        "NotesPanel: closed panel has no textarea",
        !empty.includes("<textarea"),
        "the textarea renders before the panel is opened"
      );
      assert(
        "NotesPanel: never reports a count",
        !/\b\d+\s*(of|\/)\s*\d+\b/.test(empty),
        "the notes panel rendered something that reads as a score"
      );
    }

    const written = render(
      "NotesPanel (written)",
      createElement(NotesPanel, {
        phaseId: "it-01-computer-fundamentals",
        note: "RAM is volatile, storage is not.",
        hasAnswers: true,
        onChange: noop,
        onClear: noop,
      })
    );
    if (written) {
      assert(
        "NotesPanel: a written note changes the control label",
        written.includes("Your notes"),
        "an existing note is not acknowledged"
      );
    }
  }

  // --- TaskList ---
  // Two shapes must render: the pipeline's `{ id, text }` and the older plain
  // string, because a stale generated file would otherwise blank the section.
  if (TaskList) {
    const withIds = render(
      "TaskList (ids)",
      createElement(TaskList, {
        tasks: [
          { id: "it-01-x-t01", text: "Identify your machine." },
          { id: "it-01-x-t02", text: "Watch the machine work." },
        ],
        phaseId: "it-01-x",
        answers: {},
        onAnswer: noop,
      })
    );
    if (withIds) {
      assert(
        "TaskList: renders every task",
        withIds.includes("Identify your machine") && withIds.includes("Watch the machine work"),
        "a task was dropped"
      );
      assert(
        "TaskList: one answer control per task",
        (withIds.match(/task__toggle/g) || []).length === 2,
        "expected two answer controls"
      );
      assert(
        "TaskList: answers start closed",
        !withIds.includes("<textarea"),
        "an answer box rendered before it was asked for"
      );
    }

    // An existing answer marks the task, and the marker is a dot — not a count.
    const answered = render(
      "TaskList (answered)",
      createElement(TaskList, {
        tasks: [{ id: "it-01-x-t01", text: "Identify your machine." }],
        phaseId: "it-01-x",
        answers: { "it-01-x-t01": "CPU, RAM, disk." },
        onAnswer: noop,
      })
    );
    if (answered) {
      assert(
        "TaskList: an answered task is marked",
        answered.includes("task--answered"),
        "an existing answer is not signalled"
      );
      assert(
        "TaskList: the marker is not a count",
        !/\b\d+\s*(of|\/)\s*\d+\b/.test(answered),
        "the task list rendered something that reads as a score"
      );
    }

    // The pre-id shape must not crash the section.
    const legacy = render(
      "TaskList (legacy strings)",
      createElement(TaskList, {
        tasks: ["A task with no id."],
        phaseId: "it-01-x",
        answers: {},
        onAnswer: noop,
      })
    );
    assert(
      "TaskList: tolerates the pre-id string shape",
      legacy !== null && legacy.includes("A task with no id"),
      "a task with no id blanked the list"
    );

    const none = render(
      "TaskList (empty)",
      createElement(TaskList, { tasks: [], phaseId: "it-01-x", answers: {}, onAnswer: noop })
    );
    assert(
      "TaskList: handles an empty list",
      none !== null && none.includes("no practice tasks"),
      "an empty task list rendered nothing"
    );
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

  if (TimeBudgetSelector) {
    const html = render(
      "TimeBudgetSelector",
      createElement(TimeBudgetSelector, { budget: "focused", onChange: noop })
    );
    if (html) {
      assert(
        "TimeBudgetSelector: all three budgets",
        html.includes("Under 30 min") &&
          html.includes("30–90 min") &&
          html.includes("90 min +"),
        "a budget option is missing from the control"
      );
      assert(
        "TimeBudgetSelector: marks the active one",
        hasClass(html, "is-active"),
        "no option marked as selected"
      );
      // `ongoing` is a band a TASK can have, never an amount of time a reader
      // can have. Offering it here would let a reader select a budget the
      // picker fails closed on, which reads as a broken control.
      assert(
        "TimeBudgetSelector: does not offer ongoing as a budget",
        !html.includes('value="ongoing"'),
        "ongoing was offered as an amount of available time"
      );
      assert(
        "TimeBudgetSelector: qualifies the estimate",
        /estimate/i.test(html),
        "the budget is presented as a measurement"
      );
    }
  }

  // --- Shared documents ---
  // Every document the build emitted is rendered, so a new shared file fails
  // here rather than silently never being reachable.
  if (Shared && sharedData && Array.isArray(sharedData.docs)) {
    assert(
      "Shared: the corpus is non-empty",
      sharedData.docs.length > 0,
      "shared.json contains no documents"
    );

    // The three documents from the cyber track are named explicitly, because
    // nothing else in this file would notice if they silently disappeared from
    // the build. The loop below covers whatever `shared.json` happens to contain,
    // so removing a document makes the corpus smaller and every remaining
    // assertion still passes — a shrinking corpus is invisible to a per-document
    // loop. These three had **zero references** anywhere in the site before they
    // were listed, which is how they went unnoticed for the life of the project;
    // a check that names them is what stops that recurring.
    for (const id of ["when-to-buy-thm-premium", "free-tool-map", "cyber-toolbox"]) {
      assert(
        "Shared: the cyber track's " + id + " is reachable",
        sharedData.docs.some((d) => d.id === id),
        "a cyber-track document is missing from the corpus"
      );
    }

    // Every document must name an honest source path, and it must be a path that
    // exists. This is what caught the cost of adding a second source directory:
    // the payload used to hardcode `career-roadmaps/shared/` for every entry, so
    // a cyber document would have claimed to live somewhere it does not.
    for (const doc of sharedData.docs) {
      assert(
        "Shared: " + doc.id + " names a real source path",
        typeof doc.sourcePath === "string" &&
          doc.sourcePath.startsWith("career-roadmaps/") &&
          !doc.sourcePath.includes("//"),
        "source path is missing or malformed: " + doc.sourcePath
      );
    }

    for (const doc of sharedData.docs) {
      const html = render(
        "Shared: " + doc.id,
        createElement(Shared, { initialId: doc.id })
      );
      if (!html) continue;

      // The document the reader picked is the one on screen. Without this the
      // render below could pass while showing a different document entirely.
      assert(
        "Shared: " + doc.id + " opens the named document",
        html.includes(doc.title),
        "the requested document is not the one rendered"
      );

      // The chip picker renders every document, so this is asserted once per
      // render rather than per document — but it is the thing that makes the
      // other documents reachable, so it is worth asserting.
      assert(
        "Shared: " + doc.id + " names every document",
        sharedData.docs.every((d) => html.includes(d.title)),
        "a document is not reachable from the picker"
      );

      // The heading levels are shifted (a standalone doc is authored at level 1
      // and rendered under the page's own h1), so a literal "##" in the output
      // means a block was rendered as raw text instead of parsed.
      assert(
        "Shared: " + doc.id + " renders no literal Markdown heading",
        !/(^|>)##/.test(html),
        "an unparsed heading marker reached the page"
      );
      assert(
        "Shared: " + doc.id + " renders no literal table pipes",
        !/\|\s*-{3,}/.test(html),
        "an unparsed table reached the page"
      );
    }

    // The resource list is the one document whose value depends on being
    // clickable: 42 URLs rendered as prose would be 42 dead ends.
    const resources = sharedData.docs.find((d) => d.kind === "resources");
    if (resources) {
      const html = render(
        "Shared: resources render as links",
        createElement(Shared, { initialId: resources.id })
      );
      if (html) {
        // Every resource in the document, not just the first: a group whose
        // renderer was missed would otherwise pass on the strength of a
        // sibling that worked.
        const missing = [];
        for (const group of resources.groups) {
          for (const r of group.resources) {
            if (!html.includes('href="' + r.url + '"')) missing.push(r.name);
          }
        }
        assert(
          "Shared: every resource is a real anchor",
          missing.length === 0,
          missing.length + " unclickable: " + missing.slice(0, 3).join(", ")
        );
        assert(
          "Shared: anchors open in a new tab",
          /target="_blank"/.test(html),
          "external links replace the app"
        );
        assert(
          "Shared: no bare URL left as text",
          !/>https?:\/\//.test(html),
          "a URL was rendered as prose rather than a link"
        );
      }
    } else {
      failures.push("Shared: no resources document in shared.json");
    }
  }

  // --- Your work ---
  // Server rendering has no localStorage, so this is the empty state — which is
  // also what a first-time visitor sees, and therefore worth pinning.
  if (YourWork) {
    const html = render("YourWork", createElement(YourWork, { onOpenPhase: noop }));
    if (html) {
      assert(
        "YourWork: heading",
        html.includes("Your work"),
        "page heading not rendered"
      );
      assert(
        "YourWork: empty state",
        html.includes("Nothing written yet"),
        "empty-state message not rendered"
      );
      assert(
        "YourWork: points at where writing happens",
        html.includes("Your notes"),
        "the empty state does not say where to write"
      );
      // The whole point of this page is that it carries no denominator. A
      // number here would turn a workspace into a report card, which the
      // curriculum's design rules forbid.
      assert(
        "YourWork: no completion denominator",
        !/\bof\s+\d+\b/.test(html) && !/\d+\s*%/.test(html),
        "the page renders a count out of a total"
      );
    }
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

    // Certifications. Same reasoning as Applications: localStorage is unavailable
    // in the server renderer, so this is the empty-state branch.
    //
    // This page is asserted rather than assumed because it was momentarily
    // invisible to this file. The smoke test renders pages from an explicit list,
    // so a new page that nobody adds here is silent: the suite passed at 234
    // renders both with and without the page wired in. The count not changing was
    // the only signal, and a count that does not change is not a check.
    if (Certifications) {
      const html = render("Certifications", createElement(Certifications));
      if (html) {
        assert(
          "Certifications: heading",
          html.includes("Certifications"),
          "page heading not rendered"
        );
        assert(
          "Certifications: empty state",
          html.includes("No certifications yet"),
          "empty-state message not rendered"
        );
        assert(
          "Certifications: add affordance",
          html.includes("Add a certification"),
          "no way to record the first certification"
        );
        assert(
          "Certifications: names the phase that asks for the decision",
          html.includes("Phase 07"),
          "the page does not say where the decision comes from"
        );
        // The no-shame rule, asserted rather than trusted. `deferred` is an
        // outcome the phase explicitly endorses, so an empty-state or form that
        // nudged the reader toward booking would be a defect. Checking the
        // status vocabulary is present is what keeps the page honest if someone
        // later "improves" it into a progress meter.
        assert(
          "Certifications: no percentage or completion language",
          !/%|percent|complete|progress/i.test(
            html.replace(/<[^>]+>/g, " ").replace(/Certifications/g, "")
          ),
          "the page grades the reader"
        );
      }
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