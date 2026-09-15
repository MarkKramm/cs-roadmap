import ProgressBar from "../components/ProgressBar.jsx";
import PhaseCard from "../components/PhaseCard.jsx";
import EnergyModeSelector, {
  acceptsTask,
} from "../components/EnergyModeSelector.jsx";
import { countDone } from "../hooks/useProgress.js";
import { renderInline } from "../lib/renderInline.jsx";
import {
  tracks,
  allTasks,
  firstUnfinishedPhase,
  findPhase,
  trackWeeks,
} from "../data/roadmaps.js";

// The dashboard answers one question: "What should I do today?"
// It shows the next unfinished task that fits today's energy level, then
// overall progress. Nothing else competes for attention.
// See docs/DESIGN-SYSTEM.md → Purpose.
//
// The "Carry on" card below the focus card is the one addition, and it earns its
// place against the same rule: on a curriculum that takes 34–112 weeks, "where
// was I" is asked at least as often as "what now", and it is not answerable from
// a percentage. It is hidden when the reader is already looking at the phase it
// would offer.

export default function Dashboard({
  track,
  done,
  mode,
  onModeChange,
  onOpenTrack,
  onOpenPhase,
  lastPhaseId,
  onGoToSchedule,
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

  // The phase the reader was last inside, if it is in this track and is not
  // already the one the focus card is offering. Resolved across tracks so a
  // remembered phase from the other track still opens correctly.
  const remembered = lastPhaseId ? findPhase(lastPhaseId) : null;
  const carryOn =
    remembered && remembered.track.id === track.id ? remembered.phase : null;
  const showCarryOn = Boolean(carryOn) && carryOn.id !== (nextPhase && nextPhase.id);

  const weeks = trackWeeks(track);
  const nextUnfinished = firstUnfinishedPhase(track, done);

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
            <p className="focus__task">
              {renderInline(nextTask.text, "focus-task")}
            </p>
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
            Every task in this track is complete. Switch tracks, or use Reset
            progress in the sidebar to start over.
          </p>
        )}
        <EnergyModeSelector mode={mode} onChange={onModeChange} />
      </div>

      {showCarryOn && (
        <div className="card carry-on">
          <div className="muted focus__label">Carry on where you left off</div>
          <p className="carry-on__title">{carryOn.title}</p>
          <div className="focus__meta">
            <span className="muted">
              {countDone(done, carryOn.checklist)}/{carryOn.checklist.length} done
              {carryOn.duration ? " · " + carryOn.duration : ""}
            </span>
            <button
              type="button"
              className="btn"
              onClick={() => onOpenPhase(carryOn.id)}
            >
              Reopen phase
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Progress</h2>
        <ProgressBar done={trackDone} total={tasks.length} />
        <p className="muted progress__note">
          {weeks.weeks > 0 && (
            <>
              {weeks.weeks} weeks planned across {weeks.counted} phase
              {weeks.counted === 1 ? "" : "s"}
              {nextUnfinished ? " · next up: " + nextUnfinished.title : ""}
              {onGoToSchedule && (
                <>
                  {" · "}
                  <button type="button" className="link-btn" onClick={onGoToSchedule}>
                    see the schedule
                  </button>
                </>
              )}
            </>
          )}
        </p>
      </div>

      <h2>Tracks</h2>
      <div className="track-grid">
        {tracks.map((t) => {
          const ts = allTasks(t);
          const td = countDone(done, ts);
          const tw = trackWeeks(t);
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
              {tw.weeks > 0 && (
                <p className="muted track-card__weeks">
                  {tw.weeks} weeks planned · {t.phases.length} phases
                </p>
              )}
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