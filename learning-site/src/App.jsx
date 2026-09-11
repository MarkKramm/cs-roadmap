// M1 Step 1 shell. Navigation, phase rendering, and the dashboard land in
// Steps 3 and 4. Nothing here reads the Markdown yet — see docs/CONTENT-SCHEMA.md.

import { useState } from "react";
import { tracks, findTrack } from "./data/roadmaps.js";
import { useProgress, countDone } from "./hooks/useProgress.js";
import Dashboard from "./pages/Dashboard.jsx";
import PhaseDetail from "./pages/PhaseDetail.jsx";

// View state is deliberately local and minimal: which track, and whether a
// phase is open. No router — see docs/DECISIONS.md D-006.
// Progress lives in localStorage, keyed by stable task IDs.

export default function App() {
  const [trackId, setTrackId] = useState("it");
  const [openPhaseId, setOpenPhaseId] = useState(null);
  const { done, toggle, reset } = useProgress();

  const track = findTrack(trackId);
  const openPhase = openPhaseId
    ? track.phases.find((p) => p.id === openPhaseId) || null
    : null;

  function switchTrack(id) {
    setTrackId(id);
    setOpenPhaseId(null);
  }

  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar__title">CS Roadmap</div>

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
                onClick={() => setOpenPhaseId(p.id)}
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
        {openPhase ? (
          <PhaseDetail
            phase={openPhase}
            done={done}
            onToggle={toggle}
            onBack={() => setOpenPhaseId(null)}
          />
        ) : (
          <Dashboard
            track={track}
            done={done}
            onOpenTrack={switchTrack}
            onOpenPhase={setOpenPhaseId}
          />
        )}
      </main>
    </div>
  );
}