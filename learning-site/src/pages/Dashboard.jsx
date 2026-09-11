import ProgressBar from "../components/ProgressBar.jsx";
import PhaseCard from "../components/PhaseCard.jsx";
import { countDone } from "../hooks/useProgress.js";
import { tracks, allTasks } from "../data/roadmaps.js";

// The dashboard answers one question: "What should I do today?"
// It shows the next unfinished task in the current track, then overall
// progress. Nothing else competes for attention.
// See docs/DESIGN-SYSTEM.md → Purpose.

export default function Dashboard({ track, done, onOpenTrack, onOpenPhase }) {
  const tasks = allTasks(track);
  const trackDone = countDone(done, tasks);

  const nextTask = tasks.find((t) => !done[t.id]) || null;
  const nextPhase = nextTask
    ? track.phases.find((p) => p.checklist.some((c) => c.id === nextTask.id))
    : null;

  return (
    <div className="dashboard">
      <h1>What should I do today?</h1>

      <div className="card card--focus">
        {nextTask ? (
          <>
            <div className="muted focus__label">
              {track.label}
              {nextPhase ? " · " + nextPhase.title : ""}
            </div>
            <p className="focus__task">{nextTask.text}</p>
            <div className="focus__meta">
              {nextTask.energy && (
                <span className={"badge badge--" + nextTask.energy}>
                  {nextTask.energy} energy
                </span>
              )}
              {nextPhase && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => onOpenPhase(nextPhase.id)}
                >
                  Open phase
                </button>
              )}
            </div>
          </>
        ) : (
          <p>
            Every task in this track is complete. Switch tracks or reset
            progress in Settings.
          </p>
        )}
      </div>

      <div className="card">
        <h2>Progress</h2>
        <ProgressBar done={trackDone} total={tasks.length} />
      </div>

      <h2>Tracks</h2>
      <div className="track-grid">
        {tracks.map((t) => {
          const ts = allTasks(t);
          const td = countDone(done, ts);
          return (
            <button
              key={t.id}
              type="button"
              className={
                "phase-card track-card" + (t.id === track.id ? " is-active" : "")
              }
              onClick={() => onOpenTrack(t.id)}
            >
              <h3 className="phase-card__title">{t.label}</h3>
              <p className="muted">{t.note}</p>
              <ProgressBar done={td} total={ts.length} />
            </button>
          );
        })}
      </div>

      <h2>Phases in {track.label}</h2>
      {track.phases.map((p) => (
        <PhaseCard
          key={p.id}
          phase={p}
          done={countDone(done, p.checklist)}
          total={p.checklist.length}
          onOpen={onOpenPhase}
        />
      ))}
    </div>
  );
}