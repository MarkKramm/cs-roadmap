// App shell. Navigation is a single `view` string held in local state — no
// router, see docs/DECISIONS.md → D-007. Content is rendered from the JSON
// emitted by scripts/build-content.mjs; see docs/CONTENT-SCHEMA.md.

import { useState, useEffect, useRef } from "react";
import { tracks, findTrack } from "./data/roadmaps.js";
import { useProgress, countDone } from "./hooks/useProgress.js";
import { useEnergyMode } from "./hooks/useEnergyMode.js";
import Dashboard from "./pages/Dashboard.jsx";
import PhaseDetail from "./pages/PhaseDetail.jsx";
import ToolsLibrary from "./pages/ToolsLibrary.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Applications from "./pages/Applications.jsx";

// Every destination the sidebar can reach. Adding a page means adding an entry
// here and a branch in the content switch below.
const VIEWS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tools", label: "Tools" },
  { id: "portfolio", label: "Portfolio" },
  { id: "applications", label: "Applications" },
];

// Progress lives in localStorage, keyed by stable task IDs.

export default function App() {
  const [view, setView] = useState("dashboard");
  const [trackId, setTrackId] = useState("it");
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const { done, toggle, reset } = useProgress();
  const { mode, change: changeMode } = useEnergyMode();
  const mainRef = useRef(null);
  const activePhaseRef = useRef(null);

  const track = findTrack(trackId);
  const activePhase = openPhaseId
    ? track.phases.find((p) => p.id === openPhaseId) || null
    : null;

  // Opening a phase keeps whatever scroll position the dashboard was at, which
  // lands the reader in the middle of a lesson. Reset on every view change.
  useEffect(() => {
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  // Keep the open phase visible in a long sidebar list.
  useEffect(() => {
    if (activePhaseRef.current) {
      activePhaseRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [openPhaseId]);

  function switchTrack(id) {
    setTrackId(id);
    setOpenPhaseId(null);
    setView("dashboard");
    setNavOpen(false);
  }

  function openPhase(id) {
    setOpenPhaseId(id);
    setView("phase");
    setNavOpen(false);
  }

  function goBack() {
    setOpenPhaseId(null);
    setView("dashboard");
  }

  function goTo(target) {
    setOpenPhaseId(null);
    setView(target);
    setNavOpen(false);
  }

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
          <span className="muted">{track.label}</span>
        </div>

        {view === "phase" && activePhase ? (
          <PhaseDetail
            phase={activePhase}
            done={done}
            onToggle={toggle}
            onBack={goBack}
          />
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
            onOpenTrack={switchTrack}
            onOpenPhase={openPhase}
          />
        )}
      </main>
    </div>
  );
}