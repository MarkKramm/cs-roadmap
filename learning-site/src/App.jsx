// App shell. Navigation is a single `view` string held in local state — no
// router, see docs/DECISIONS.md → D-007. Content is rendered from the JSON
// emitted by scripts/build-content.mjs; see docs/CONTENT-SCHEMA.md.

import { useState } from "react";
import { tracks, findTrack } from "./data/roadmaps.js";
import { useProgress, countDone } from "./hooks/useProgress.js";
import { useEnergyMode } from "./hooks/useEnergyMode.js";
import Dashboard from "./pages/Dashboard.jsx";
import PhaseDetail from "./pages/PhaseDetail.jsx";

// Every destination the sidebar can reach. Adding a page means adding an entry
// here and a branch in the content switch below.
const VIEWS = [{ id: "dashboard", label: "Dashboard" }];

// Progress lives in localStorage, keyed by stable task IDs.

export default function App() {
  const [view, setView] = useState("dashboard");
  const [trackId, setTrackId] = useState("it");
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const { done, toggle, reset } = useProgress();
  const { mode, change: changeMode } = useEnergyMode();

  const track = findTrack(trackId);
  const activePhase = openPhaseId
    ? track.phases.find((p) => p.id === openPhaseId) || null
    : null;

  function switchTrack(id) {
    setTrackId(id);
    setOpenPhaseId(null);
    setView("dashboard");
  }

  function openPhase(id) {
    setOpenPhaseId(id);
    setView("phase");
  }

  function goBack() {
    setOpenPhaseId(null);
    setView("dashboard");
  }

  return (
    <div className="app-shell">
      <nav className="sidebar">
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
              onClick={() => {
                setOpenPhaseId(null);
                setView(v.id);
              }}
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

      <main className="content">
        {view === "phase" && activePhase ? (
          <PhaseDetail
            phase={activePhase}
            done={done}
            onToggle={toggle}
            onBack={goBack}
          />
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