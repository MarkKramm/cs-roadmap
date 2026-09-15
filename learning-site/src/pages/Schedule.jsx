import { useMemo, useState } from "react";
import ProgressBar from "../components/ProgressBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { tracks, findTrack, allTasks, firstUnfinishedPhase } from "../data/roadmaps.js";
import { countDone } from "../hooks/useProgress.js";
import { useSchedule } from "../hooks/useSchedule.js";
import {
  paceFor,
  upcomingPhases,
  today,
  fmtWeeks,
  fmtDate,
} from "../lib/pace.js";

// Schedule and pace for the current track.
//
// The question this page answers is "am I going to finish, and what is next?"
// — which the dashboard's percentage could not, because a percentage with no
// reference point is not a pace.
//
// The tone is the hard part. This is a curriculum that explicitly forbids shame
// UI (docs/DESIGN-SYSTEM.md → Anti-patterns), so a reader behind the calendar
// gets a factual statement and the option to re-baseline, never a warning colour
// and never a "you are failing" framing. Falling behind a self-set schedule on a
// 34-week part-time curriculum is the normal case, not an error state.

const VERDICT_COPY = {
  ahead: {
    label: "Ahead of plan",
    tone: "success",
    note: "Tasks are landing faster than the calendar. Nothing to do — the buffer is yours to keep.",
  },
  "on-plan": {
    label: "On plan",
    tone: "success",
    note: "Tasks and calendar are moving together. This is the target, not a floor.",
  },
  behind: {
    label: "Behind the calendar",
    tone: "warning",
    note: "Elapsed time is ahead of completed work. That is information, not a judgement — a slow month is expected on a plan this long. Either keep going at your own speed, or move the start date so the plan matches your life.",
  },
  unknown: {
    label: "Not enough information",
    tone: "muted",
    note: "Set a start date to compare work completed against time elapsed.",
  },
};

export default function Schedule({ trackId, done, onOpenPhase, onOpenTrack }) {
  const track = findTrack(trackId) || tracks[0];
  const { starts, setStart } = useSchedule();
  const [window_weeks, setWindow] = useState(4);

  const start = starts[track.id] || "";
  const tasks = allTasks(track);
  const doneCount = countDone(done, tasks);
  const pace = paceFor(track, start, doneCount, tasks.length);
  const copy = VERDICT_COPY[pace.verdict] || VERDICT_COPY.unknown;

  const upcoming = useMemo(
    () => upcomingPhases(track, today(), done, window_weeks),
    [track, done, window_weeks]
  );

  // Per-phase rows: planned length, completed tasks, and whether the phase is
  // finished. The planned length is in weeks; a phase with none is flagged
  // rather than shown as instant.
  const rows = track.phases.map((p, i) => {
    const d = countDone(done, p.checklist);
    return {
      phase: p,
      index: i,
      done: d,
      total: p.checklist.length,
      weeks: Number(p.durationWeeks) || 0,
      complete: d === p.checklist.length,
    };
  });

  const missingWeeks = rows.filter((r) => r.weeks === 0).length;
  const nextUnfinished = firstUnfinishedPhase(track, done);

  return (
    <div className="schedule">
      <h1>Schedule</h1>
      <p className="muted">
        Each phase in the curriculum carries a planned length in weeks. Setting a
        start date compares that plan against the calendar — a readout, not a
        deadline.
      </p>

      <div className="card tools-filters">
        <div className="tools-filters__row">
          <label className="tools-filters__field">
            <span className="tools-filters__label">Track</span>
            <select
              className="tools-filters__select"
              value={track.id}
              onChange={(e) => onOpenTrack(e.target.value)}
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="tools-filters__field">
            <span className="tools-filters__label">
              Start date {start ? "(clear it to remove the comparison)" : ""}
            </span>
            <input
              className="tools-filters__input"
              type="date"
              value={start}
              max={today()}
              onChange={(e) => setStart(track.id, e.target.value)}
            />
          </label>

          <label className="tools-filters__field">
            <span className="tools-filters__label">Look ahead</span>
            <select
              className="tools-filters__select"
              value={window_weeks}
              onChange={(e) => setWindow(Number(e.target.value))}
            >
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </label>
        </div>
      </div>

      <div className="card">
        <h2>{track.label} at a glance</h2>
        <div className="stat-grid">
          <div className="stat">
            <span className="stat__value">{pace.planned}</span>
            <span className="stat__label">weeks planned</span>
          </div>
          <div className="stat">
            <span className="stat__value">{rows.length}</span>
            <span className="stat__label">phases</span>
          </div>
          <div className="stat">
            <span className="stat__value">
              {doneCount}
              <span className="stat__sub">/{tasks.length}</span>
            </span>
            <span className="stat__label">checklist items done</span>
          </div>
          <div className="stat">
            <span className="stat__value">{fmtWeeks(pace.elapsedWeeks)}</span>
            <span className="stat__label">elapsed since start</span>
          </div>
          <div className="stat">
            <span className="stat__value">{fmtWeeks(pace.remaining)}</span>
            <span className="stat__label">left on the plan</span>
          </div>
          <div className="stat">
            <span className="stat__value">{fmtDate(pace.finishOn)}</span>
            <span className="stat__label">planned finish</span>
          </div>
        </div>

        <ProgressBar done={doneCount} total={tasks.length} />
      </div>

      <div className={"card pace pace--" + copy.tone}>
        <h2>
          Pace <span className={"badge badge--" + copy.tone}>{copy.label}</span>
        </h2>
        <p>{copy.note}</p>

        {pace.elapsedWeeks !== null && (
          <div className="pace__bars">
            <div className="pace__row">
              <span className="pace__label">Time elapsed</span>
              <span className="pace__track">
                <span
                  className="pace__fill pace__fill--time"
                  style={{ width: pace.timePct + "%" }}
                />
              </span>
              <span className="pace__value">{Math.round(pace.timePct)}%</span>
            </div>
            <div className="pace__row">
              <span className="pace__label">Work done</span>
              <span className="pace__track">
                <span
                  className="pace__fill pace__fill--work"
                  style={{ width: pace.taskPct + "%" }}
                />
              </span>
              <span className="pace__value">{Math.round(pace.taskPct)}%</span>
            </div>
          </div>
        )}

        {start && (
          <p className="pace__actions">
            <button
              type="button"
              className="link-btn"
              onClick={() => setStart(track.id, today())}
            >
              Restart the plan from today
            </button>
            {" · "}
            <button
              type="button"
              className="link-btn"
              onClick={() => setStart(track.id, "")}
            >
              Clear the start date
            </button>
          </p>
        )}

        {missingWeeks > 0 && (
          <p className="muted pace__note">
            {missingWeeks} phase{missingWeeks === 1 ? "" : "s"} in this track
            carr{missingWeeks === 1 ? "ies" : "y"} no planned length, so the
            totals above exclude {missingWeeks === 1 ? "it" : "them"}.
          </p>
        )}
      </div>

      <h2>Next {window_weeks} weeks</h2>
      {upcoming.length === 0 ? (
        <EmptyState
          message={
            start
              ? "Nothing scheduled in that window. Either every phase in it is finished, or try a longer look-ahead."
              : "Set a start date above to lay the phases out against the calendar. Everything not yet finished is included, in order."
          }
        />
      ) : (
        <ol className="plan">
          {upcoming.map((u) => (
            <li className="plan__item" key={u.phase.id}>
              <button
                type="button"
                className="plan__open"
                onClick={() => onOpenPhase(u.phase.id)}
              >
                <span className="plan__dates">
                  {fmtDate(u.startsOn)} → {fmtDate(u.endsOn)}
                </span>
                <span className="plan__title">{u.phase.title}</span>
                <span className="plan__weeks muted">
                  {u.weeks} week{u.weeks === 1 ? "" : "s"} ·{" "}
                  {countDone(done, u.phase.checklist)}/{u.phase.checklist.length}{" "}
                  done
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <h2>Phase plan</h2>
      <div className="card app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>Planned</th>
              <th>Done</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.phase.id}>
                <td>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onOpenPhase(r.phase.id)}
                  >
                    {r.phase.title}
                  </button>
                  <span className="app-table__sub">
                    {r.phase.duration}
                    {r.phase.deliverable ? " · " + r.phase.deliverable : ""}
                  </span>
                </td>
                <td>{r.weeks > 0 ? r.weeks + "w" : "—"}</td>
                <td>
                  {r.done}/{r.total}
                  <span className="app-table__sub">
                    {r.total > 0 ? Math.round((r.done / r.total) * 100) : 0}%
                  </span>
                </td>
                <td>
                  <span
                    className={
                      "badge badge--" +
                      (r.complete ? "done" : r.done > 0 ? "in-progress" : "idea")
                    }
                  >
                    {r.complete ? "Complete" : r.done > 0 ? "Started" : "Not started"}
                  </span>
                </td>
                <td className="app-table__actions">
                  {r.index < rows.length - 1 && (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => onOpenPhase(rows[r.index + 1].phase.id)}
                    >
                      Next
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* A reader who has scrolled the whole plan has one question left: what do
          I open now. The answer is the first phase with unfinished work, which
          is also what the dashboard's focus card picks. */}
      {nextUnfinished && (
        <section className="card card--focus">
          <div className="muted focus__label">Carry on</div>
          <p className="focus__task">{nextUnfinished.title}</p>
          <div className="focus__meta">
            <span className="muted">
              {countDone(done, nextUnfinished.checklist)}/
              {nextUnfinished.checklist.length} done ·{" "}
              {Number(nextUnfinished.durationWeeks) || 0} weeks planned
            </span>
            <button
              type="button"
              className="btn"
              onClick={() => onOpenPhase(nextUnfinished.id)}
            >
              Open phase
            </button>
          </div>
        </section>
      )}
    </div>
  );
}