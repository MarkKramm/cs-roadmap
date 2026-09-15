// App shell. Navigation is a single `view` string held in local state — no
// router, see docs/DECISIONS.md → D-007. Content is rendered from the JSON
// emitted by scripts/build-content.mjs; see docs/CONTENT-SCHEMA.md.
//
// This file owns three pieces of cross-cutting state that individual pages read
// but do not own: the current view, the open phase, and the reader's preferences
// (energy mode, reading size). Everything else lives with the page that uses it.

import { useState, useEffect, useRef, useCallback } from "react";
import { tracks, findTrack, neighbours } from "./data/roadmaps.js";
import { useProgress, countDone } from "./hooks/useProgress.js";
import { useEnergyMode } from "./hooks/useEnergyMode.js";
import { useReadingState } from "./hooks/useReadingState.js";
import { useReadingSize, scaleFor } from "./hooks/useReadingSize.js";
import { useTimeBudget } from "./hooks/useTimeBudget.js";
import { useShortcuts } from "./hooks/useShortcuts.js";
import Dashboard from "./pages/Dashboard.jsx";
import PhaseDetail from "./pages/PhaseDetail.jsx";
import ToolsLibrary from "./pages/ToolsLibrary.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Applications from "./pages/Applications.jsx";
import Search from "./pages/Search.jsx";
import Schedule from "./pages/Schedule.jsx";
import Shared from "./pages/Shared.jsx";
import YourWork from "./pages/YourWork.jsx";
import ShortcutHelp from "./components/ShortcutHelp.jsx";
import DataTransfer from "./components/DataTransfer.jsx";

// Every destination the sidebar can reach. Adding a page means adding an entry
// here and a branch in the content switch below.
const VIEWS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule", label: "Schedule" },
  { id: "search", label: "Search" },
  { id: "shared", label: "Shared" },
  { id: "your-work", label: "Your work" },
  { id: "tools", label: "Tools" },
  { id: "portfolio", label: "Portfolio" },
  { id: "applications", label: "Applications" },
];

// Given to Search so `/` and Ctrl+K can drop the cursor into the box rather than
// merely switching to the view and leaving the reader to click.
const SEARCH_INPUT_ID = "search-input";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [trackId, setTrackId] = useState("it");
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const { done, toggle, reset } = useProgress();
  const { mode, change: changeMode } = useEnergyMode();
  const { budget, change: changeBudget } = useTimeBudget();
  const { size, change: changeSize } = useReadingSize();
  const {
    lastTrackId,
    lastPhaseId,
    lastSection,
    visitPhase,
    visitSection,
  } = useReadingState();
  const mainRef = useRef(null);
  const activePhaseRef = useRef(null);
  // Set when a search result is opened, read once by the lesson renderer.
  const pendingAnchor = useRef("");

  const track = findTrack(trackId);
  const activePhase = openPhaseId
    ? track.phases.find((p) => p.id === openPhaseId) || null
    : null;

  // Where the open phase sits in its track, and who its neighbours are. Computed
  // here rather than in PhaseDetail because the keyboard shortcuts need the same
  // answer without the phase being mounted.
  const { prev, next, index, count } = neighbours(track, openPhaseId);

  // Opening a phase keeps whatever scroll position the dashboard was at, which
  // lands the reader in the middle of a lesson. Reset on every view change.
  // A search result carries an anchor and scrolls there instead, so skip the
  // reset in that case — otherwise the two effects fight and the reader lands
  // at the top of the lesson rather than at the matched heading.
  useEffect(() => {
    if (pendingAnchor.current) return;
    window.scrollTo(0, 0);
  }, [view, openPhaseId, trackId]);

  // A drawer that traps the page behind it is worse than no drawer. Close on
  // Escape, and lock background scrolling while it is open.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [navOpen]);

  // Keep the open phase visible in a long sidebar list.
  useEffect(() => {
    if (activePhaseRef.current) {
      activePhaseRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [openPhaseId]);

  // Remember which phase the reader is in, so the dashboard can offer it back.
  useEffect(() => {
    if (view === "phase" && activePhase) visitPhase(trackId, activePhase.id);
  }, [view, activePhase, trackId, visitPhase]);

  function switchTrack(id) {
    setTrackId(id);
    setOpenPhaseId(null);
    setView("dashboard");
    setNavOpen(false);
  }

  const openPhase = useCallback(
    (id) => {
      setOpenPhaseId(id);
      setView("phase");
      setNavOpen(false);
    },
    []
  );

  function goBack() {
    setOpenPhaseId(null);
    setView("dashboard");
  }

  function goTo(target) {
    setOpenPhaseId(null);
    setView(target);
    setNavOpen(false);
  }

  // A search result can live in the other track, so this switches track as well
  // as opening the phase. The heading anchor is handed to PhaseDetail, which
  // scrolls to it once the lesson has rendered.
  function openSearchResult(hit) {
    setTrackId(hit.k);
    setOpenPhaseId(hit.p);
    setView("phase");
    setNavOpen(false);
    pendingAnchor.current = hit.a || "";
  }

  // --- Keyboard navigation -------------------------------------------------
  // The neighbour handlers only act while a phase is open, so `j` on the
  // dashboard does nothing rather than teleporting into a phase the reader did
  // not ask for.
  const goNext = useCallback(() => {
    if (view === "phase" && next) {
      openPhase(next.id);
    }
  }, [view, next, openPhase]);

  const goPrev = useCallback(() => {
    if (view === "phase" && prev) {
      openPhase(prev.id);
    }
  }, [view, prev, openPhase]);

  const focusSearch = useCallback(() => {
    setOpenPhaseId(null);
    setView("search");
    setNavOpen(false);
    // The input mounts with the view, so it does not exist yet in this tick.
    // Two frames is enough for React to commit and the browser to lay out.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(SEARCH_INPUT_ID);
        if (el && typeof el.focus === "function") el.focus();
      });
    });
  }, []);

  const goToView = useCallback((target) => {
    if (!VIEWS.some((v) => v.id === target)) return;
    setOpenPhaseId(null);
    setView(target);
    setNavOpen(false);
  }, []);

  const { helpOpen, setHelpOpen, toggleHelp } = useShortcuts({
    onNext: goNext,
    onPrev: goPrev,
    onSearch: focusSearch,
    onView: goToView,
  });

  const scale = scaleFor(size);

  return (
    <div className="app-shell">
      {navOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}

      <nav
        className={"sidebar" + (navOpen ? " is-open" : "")}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="sidebar__close"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        >
          ×
        </button>

        <div className="sidebar__title">CS Roadmap</div>

        <div className="sidebar__section">Views</div>
        <div className="sidebar__nav">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={
                "sidebar__link" + (v.id === view ? " is-active" : "")
              }
              onClick={() => goTo(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="sidebar__section">Tracks</div>
        <div className="sidebar__nav">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                "sidebar__link" + (t.id === track.id ? " is-active" : "")
              }
              onClick={() => switchTrack(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="sidebar__section">
          {track.short} phases
        </div>
        <div className="sidebar__nav">
          {track.phases.map((p) => {
            const pd = countDone(done, p.checklist);
            const complete = pd === p.checklist.length;
            return (
              <button
                key={p.id}
                type="button"
                ref={p.id === openPhaseId ? activePhaseRef : null}
                aria-current={p.id === openPhaseId ? "page" : undefined}
                title={p.title}
                className={
                  "sidebar__link" +
                  (complete ? " is-complete" : "") +
                  (p.id === openPhaseId ? " is-active" : "")
                }
                onClick={() => openPhase(p.id)}
              >
                {p.title.replace(/^Phase \d+ — /, "")}
              </button>
            );
          })}
        </div>

        <div className="sidebar__section">Data</div>
        <div className="sidebar__nav">
          <button
            type="button"
            className="sidebar__link"
            onClick={() => setHelpOpen(true)}
          >
            Keyboard shortcuts
          </button>
          <button
            type="button"
            className="sidebar__link"
            onClick={() => {
              setDataOpen(true);
              setNavOpen(false);
            }}
          >
            Back up &amp; restore
          </button>
          <button
            type="button"
            className="sidebar__link"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all progress? This cannot be undone."
                )
              ) {
                reset();
              }
            }}
          >
            Reset progress
          </button>
        </div>
      </nav>

      <main className="content" ref={mainRef}>
        <div className="content__topbar">
          <button
            type="button"
            className="nav-toggle"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          >
            ☰ Menu
          </button>
          <span className="muted topbar__where">{track.label}</span>
          <button
            type="button"
            className="nav-toggle topbar__help"
            onClick={toggleHelp}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>
        </div>

        {view === "phase" && activePhase ? (
          <PhaseDetail
            phase={activePhase}
            done={done}
            onToggle={toggle}
            onBack={goBack}
            anchorRef={pendingAnchor}
            prev={prev}
            next={next}
            index={index}
            phaseCount={count}
            onOpenPhase={openPhase}
            onVisitSection={visitSection}
            lastSection={lastSection[activePhase.id] || null}
            size={size}
            onSizeChange={changeSize}
            scale={scale}
          />
        ) : view === "search" ? (
          <Search onOpenResult={openSearchResult} inputId={SEARCH_INPUT_ID} />
        ) : view === "schedule" ? (
          <Schedule
            trackId={trackId}
            done={done}
            onOpenPhase={openPhase}
            onOpenTrack={switchTrack}
          />
        ) : view === "shared" ? (
          <Shared />
        ) : view === "your-work" ? (
          <YourWork onOpenPhase={openPhase} />
        ) : view === "tools" ? (
          <ToolsLibrary onOpenPhase={openPhase} />
        ) : view === "portfolio" ? (
          <Portfolio />
        ) : view === "applications" ? (
          <Applications />
        ) : (
          <Dashboard
            track={track}
            done={done}
            mode={mode}
            onModeChange={changeMode}
            budget={budget}
            onBudgetChange={changeBudget}
            onOpenTrack={switchTrack}
            onOpenPhase={openPhase}
            lastPhaseId={lastTrackId === trackId ? lastPhaseId : ""}
            onGoToSchedule={() => goTo("schedule")}
            onGoToView={goToView}
          />
        )}
      </main>

      <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      <DataTransfer open={dataOpen} onClose={() => setDataOpen(false)} />
    </div>
  );
}