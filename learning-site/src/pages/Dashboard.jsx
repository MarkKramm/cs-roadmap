import ProgressBar from "../components/ProgressBar.jsx";
import PhaseCard from "../components/PhaseCard.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import EnergyModeSelector, {
  acceptsTask,
} from "../components/EnergyModeSelector.jsx";
import TimeBudgetSelector from "../components/TimeBudgetSelector.jsx";
import { countDone } from "../hooks/useProgress.js";
import { readStarts } from "../hooks/useSchedule.js";
import { readPortfolio } from "../hooks/usePortfolio.js";
import { readApplications } from "../hooks/useApplications.js";
import { readNotes } from "../hooks/useNotes.js";
import { renderInline } from "../lib/renderInline.jsx";
import { paceFor, fmtWeeks, fmtDate } from "../lib/pace.js";
import { allTools } from "../data/tools.js";
import { pickToday, addressedTaskIds, bandInfo } from "../lib/today.js";
import {
  tracks,
  allTasks,
  allPracticeTasks,
  firstUnfinishedPhase,
  findPhase,
  trackWeeks,
} from "../data/roadmaps.js";

// The dashboard answers one question: "What should I do today?"
// It shows the next unfinished task that fits today's energy level, then
// overall progress. Nothing else competes for attention.
// See docs/DESIGN-SYSTEM.md → Purpose.
//
// LAYOUT. The page is two columns above 1180px: the one next action and the
// track it belongs to on the left, and a reference rail on the right holding the
// numbers a reader checks rather than acts on — progress as a ring, the plan's
// dates, readiness counts, and what comes after this phase. Below that width the
// rail folds back under the main column, in the same order.
//
// The rail exists because the dashboard had a wide empty half. It is not a
// second dashboard: every figure in it is either already computed here or is a
// read-only count, and the only controls in it are links to the page that owns
// the thing being counted. See docs/DESIGN-SYSTEM.md → Anti-patterns — progress
// bars and counts only, no charts, no streaks, no shame.
//
// "Carry on" sits under the focus card and earns its place against the same
// rule: on a curriculum that takes 34–112 weeks, "where was I" is asked at least
// as often as "what now", and it is not answerable from a percentage. It is
// hidden when the reader is already looking at the phase it would offer.

// Why there is nothing to suggest, said honestly.
//
// The old version had two messages — "every task is complete" and "nothing left
// at this energy level" — and they were the only two cases it knew about. The
// picker now distinguishes six, and three of them were previously rendered as
// "every task in this track is complete", which is a lie: the reader has real
// work left, it just cannot be offered as a sitting right now. Saying "done"
// when the reader is not done is the one failure this page must never have.
//
// See lib/today.js → pickToday for the taxonomy.
function NothingToday({ reason, smallestBlocking, ongoingCount, mode, onGoToView }) {
  if (reason === "all-addressed" || reason === "empty") {
    return (
      <p>
        No practice tasks left in this track. Switch tracks, or use Reset progress
        in the sidebar to start over.
      </p>
    );
  }

  if (reason === "none-fit") {
    const band = smallestBlocking ? bandInfo(smallestBlocking) : null;
    return (
      <p>
        The next task needs{" "}
        <strong>{band ? band.label.toLowerCase() : "a longer sitting"}</strong>.
        Tell the page you have more time, or do something small from{" "}
        {onGoToView ? (
          <button type="button" className="link-btn" onClick={() => onGoToView("shared")}>
            Shared
          </button>
        ) : (
          "Shared"
        )}
        .
      </p>
    );
  }

  if (reason === "none-fit-energy") {
    return (
      <p>
        Nothing left fits <strong>{mode}</strong> energy today. Switch to a higher
        energy level, or rest — an off day is part of the plan.
      </p>
    );
  }

  if (reason === "only-ongoing") {
    return (
      <p>
        What is left is not a single sitting —{" "}
        {ongoingCount === 1 ? "one commitment" : ongoingCount + " commitments"}{" "}
        that build up over weeks rather than finish in an afternoon. Open the phase
        to pick one up.
      </p>
    );
  }

  // `unjudged` and `no-budget` are not reachable in normal use, and are written
  // out rather than folded into a catch-all so that if one ever IS reached the
  // reader sees a true sentence instead of a wrong "you are done".
  return <p>No suggestion available right now. Open a phase to pick a task.</p>;
}

export default function Dashboard({
  track,
  done,
  mode,
  onModeChange,
  budget,
  onBudgetChange,
  onOpenTrack,
  onOpenPhase,
  onGoToView,
  lastPhaseId,
  onGoToSchedule,
}) {
  const tasks = allTasks(track);
  const trackDone = countDone(done, tasks);
  const pct = tasks.length > 0 ? Math.round((trackDone / tasks.length) * 100) : 0;

  // The suggestion is drawn from the PRACTICE TASKS, not the checklist.
  //
  // The checklist is a list of things the reader can say about themselves ("I
  // can use 20 basic Linux commands"); a practice task is an instruction to do
  // something ("Run `ss -tulpn` and identify listening services"). Only the
  // second has a duration, so only the second can answer "what fits in the time
  // I have". Progress still counts the checklist — the two lists are different
  // on purpose and this page is the only place they meet.
  //
  // See lib/today.js and docs/DECISIONS.md → D-021.
  const practice = allPracticeTasks(track);
  const addressed = addressedTaskIds(readNotes(), done, track.phases);
  const pick = pickToday({
    tasks: practice,
    budget,
    energy: mode,
    addressed,
    accepts: acceptsTask,
  });
  const nextTask = pick.task;
  const nextPhase = nextTask
    ? track.phases.find((p) => p.id === nextTask.phaseId)
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

  // The schedule facts, read once at mount. The dashboard must not own the
  // start date — that preference belongs to the Schedule page and to
  // useSchedule — so this is a read, never a second live copy of the key.
  // See hooks/useSchedule.js → readStarts.
  const start = readStarts()[track.id] || "";
  const pace = paceFor(track, start, trackDone, tasks.length);

  // Readiness: what exists outside the curriculum. Counts are read-only and the
  // chips link to the page that owns each one. They are phrased as "you have N"
  // rather than "you are missing N" on purpose — the number belongs to the
  // reader, and this curriculum forbids shame UI.
  const portfolioCount = readPortfolio().length;
  const applicationCount = readApplications().length;
  // Counted across both tracks, because the Tools page this chip opens lists
  // both. A chip reading 42 that opens a page reading 191 is a chip that lies,
  // and the reader has no way to tell which of the two numbers is wrong.
  const toolCount = allTools().length;
  const readiness = [
    { id: "portfolio", label: "Portfolio", value: portfolioCount },
    { id: "applications", label: "Applications", value: applicationCount },
    { id: "tools", label: "Tools", value: toolCount },
  ];

  // The three phases after the one the reader is in. Enough to answer "what
  // comes next" without turning the rail into a second phase list.
  const upcoming = nextUnfinished
    ? track.phases
        .slice(
          track.phases.findIndex((p) => p.id === nextUnfinished.id),
          track.phases.findIndex((p) => p.id === nextUnfinished.id) + 3
        )
        .map((p) => ({
          phase: p,
          done: countDone(done, p.checklist),
          total: p.checklist.length,
        }))
    : [];

  return (
    <div className="dashboard">
      <h1>What should I do today?</h1>

      <div className="dashboard__grid">
        <div className="dashboard__main">
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
                  {nextTask.band && bandInfo(nextTask.band) && (
                    <span
                      className={"badge badge--band-" + nextTask.band}
                      title={bandInfo(nextTask.band).note}
                    >
                      {bandInfo(nextTask.band).label}
                    </span>
                  )}
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
              <NothingToday
                reason={pick.reason}
                smallestBlocking={pick.smallestBlocking}
                ongoingCount={pick.ongoingCount}
                mode={mode}
                onGoToView={onGoToView}
              />
            )}
            <div className="focus__controls">
              <TimeBudgetSelector budget={budget} onChange={onBudgetChange} />
              <EnergyModeSelector mode={mode} onChange={onModeChange} />
            </div>
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
          <div className="phase-grid">
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
        </div>

        <aside className="dashboard__rail" aria-label="Reference">
          <div className="card rail-card">
            <div className="rail-progress">
              <ProgressRing
                value={pct}
                label={`${trackDone} of ${tasks.length} tasks complete in ${track.label}`}
              />
              <div className="rail-progress__text">
                <span className="rail-progress__value">{pct}%</span>
                <span className="muted">
                  {trackDone}/{tasks.length} checklist items
                </span>
                <span className="muted">
                  {track.phases.length} phases
                  {weeks.weeks > 0 ? " · " + weeks.weeks + " weeks planned" : ""}
                </span>
              </div>
            </div>

            {nextUnfinished && (
              <button
                type="button"
                className="link-btn rail-card__cta"
                onClick={() => onOpenPhase(nextUnfinished.id)}
              >
                Next up — {nextUnfinished.title}
              </button>
            )}

            {onGoToSchedule && (
              <button
                type="button"
                className="link-btn rail-card__cta"
                onClick={onGoToSchedule}
              >
                See the schedule
              </button>
            )}
          </div>

          <div className="card rail-card">
            <h2 className="rail-card__title">Plan</h2>
            <dl className="rail-facts">
              <div className="rail-fact">
                <dt>Planned</dt>
                <dd>{pace.planned > 0 ? pace.planned + " weeks" : "—"}</dd>
              </div>
              <div className="rail-fact">
                <dt>Started</dt>
                <dd>{start ? fmtDate(start) : "Not set"}</dd>
              </div>
              <div className="rail-fact">
                <dt>Elapsed</dt>
                <dd>
                  {pace.elapsedWeeks === null ? "—" : fmtWeeks(pace.elapsedWeeks)}
                </dd>
              </div>
              <div className="rail-fact">
                <dt>Left on plan</dt>
                <dd>{pace.remaining === null ? "—" : fmtWeeks(pace.remaining)}</dd>
              </div>
              <div className="rail-fact">
                <dt>Planned finish</dt>
                <dd>{pace.finishOn ? fmtDate(pace.finishOn) : "—"}</dd>
              </div>
            </dl>
            {!start && onGoToSchedule && (
              <p className="muted rail-card__note">
                Set a start date on the{" "}
                <button type="button" className="link-btn" onClick={onGoToSchedule}>
                  Schedule
                </button>{" "}
                page to compare work done against the calendar.
              </p>
            )}
          </div>

          <div className="card rail-card">
            <h2 className="rail-card__title">Readiness</h2>
            <div className="rail-chips">
              {readiness.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="rail-chip"
                  onClick={() => onGoToView && onGoToView(r.id)}
                >
                  <span className="rail-chip__value">{r.value}</span>
                  <span className="rail-chip__label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {upcoming.length > 0 && (
            <div className="card rail-card">
              <h2 className="rail-card__title">Coming up</h2>
              <ol className="rail-list">
                {upcoming.map((u, i) => (
                  <li className="rail-list__item" key={u.phase.id}>
                    <button
                      type="button"
                      className="rail-list__open"
                      onClick={() => onOpenPhase(u.phase.id)}
                    >
                      <span className="rail-list__title">
                        {i === 0 && <span className="rail-list__now">Next · </span>}
                        {u.phase.title}
                      </span>
                      <span className="muted rail-list__meta">
                        {u.done}/{u.total} done
                        {u.phase.duration ? " · " + u.phase.duration : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}