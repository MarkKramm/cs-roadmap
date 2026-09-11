import ProgressBar from "../components/ProgressBar.jsx";
import PhaseCard from "../components/PhaseCard.jsx";
import EnergyModeSelector, {
  acceptsTask,
} from "../components/EnergyModeSelector.jsx";
import { countDone } from "../hooks/useProgress.js";
import { tracks, allTasks } from "../data/roadmaps.js";

// The dashboard answers one question: "What should I do today?"
// It shows the next unfinished task that fits today's energy level, then
// overall progress. Nothing else competes for attention.
// See docs/DESIGN-SYSTEM.md → Purpose.

export default function Dashboard({
  track,
  done,
  mode,
  onModeChange,
  onOpenTrack,
  onOpenPhase,
}) {
  const tasks = allTasks(track);
  const trackDone = countDone(done, tasks);

  const remaining = tasks.filter((t) => !done[t.id]);
  const nextTask = remaining.find((t) => acceptsTask(mode, t)) || null;
  // Distinguish "nothing left" from "nothing left at this energy level" —
  // otherwise a low-energy day at the end of a track falsely reads as done.
  const blockedByEnergy = !nextTask && remaining.length > 0;
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
        ) : blockedByEnergy ? (
          <p>
            Nothing left at <strong>{mode}</strong> energy. Switch to a higher
            energy level, or rest — an off day is part of the plan.
          </p>
        ) : (
          <p>
            Every task in this track is complete. Switch tracks or reset
            progress in Settings.
          </p>
        )}
        <EnergyModeSelector mode={mode} onChange={onModeChange} />
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