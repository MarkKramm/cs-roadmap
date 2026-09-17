import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { useCertifications, CERT_STATUSES } from "../hooks/useCertifications.js";

// Certifications the reader is considering, in the order they were written down.
//
// WHY THIS PAGE EXISTS
// Cybersecurity Phase 07 is 8,929 words that end by asking for a decision
// document — a target certification, a cost checked on the official site, job
// post evidence, a topic gap table, and an exam date decision. It calls the
// 30-job-post comparison the single most valuable task in the phase, and then had
// nowhere to put the result. A certification is also the longest-lived commitment
// the curriculum asks for: three to twelve months inside a thirty-four to
// one-hundred-and-twelve week plan.
//
// A table rather than cards, for the same reason Applications is: the useful
// question is "what is still open, and what has a date attached", which is a scan
// across a row.
//
// WHAT THIS PAGE MUST NEVER BECOME
// There is no percentage ready, no objectives-cleared count, no study hours, and
// no colour that turns "considering" into a warning. **The statuses are positions
// in a decision, not rungs of a ladder** — `deferred` in particular is a
// legitimate outcome that the phase explicitly endorses ("Exam date decision or
// reason to delay"), so it is rendered in the same neutral tone as everything
// else. A reader who records five certifications and books none of them sees a
// tidy list, not a failing grade. See docs/DESIGN-SYSTEM.md -> the no-shame rule.
//
// Upcoming exams are surfaced as a reminder of a date the reader chose and paid
// for, never as urgency. Same reasoning as `followUpOn` on Applications.

function today() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_DRAFT = {
  name: "",
  issuer: "",
  status: "considering",
  cost: "",
  examOn: "",
  gaps: "",
  notes: "",
};

// An exam date that has been reached or passed, on an entry that is still active.
// Computed from YYYY-MM-DD strings so no timezone maths is involved, and excluded
// for terminal statuses so a passed or deferred certification never nags.
const TERMINAL = ["passed", "deferred"];

function upcomingExam(entry, now) {
  if (!entry.examOn) return false;
  if (TERMINAL.includes(entry.status)) return false;
  return entry.examOn <= now;
}

// Days until an exam, for the "in N days" phrasing. Returns null when there is no
// date or the date has passed.
function daysUntil(dateStr, now) {
  if (!dateStr || dateStr <= now) return null;
  const a = Date.parse(dateStr + "T00:00:00Z");
  const b = Date.parse(now + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((a - b) / 86400000);
}

export default function Certifications() {
  const { entries, add, update, remove } = useCertifications();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  const now = today();

  const counts = useMemo(() => {
    const c = { all: entries.length, soon: 0 };
    for (const s of CERT_STATUSES) c[s.id] = 0;
    for (const e of entries) {
      if (c[e.status] !== undefined) c[e.status]++;
      if (upcomingExam(e, now)) c.soon++;
    }
    return c;
  }, [entries, now]);

  const shown = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "soon") return entries.filter((e) => upcomingExam(e, now));
    return entries.filter((e) => e.status === filter);
  }, [entries, filter, now]);

  function submit(e) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    add(draft);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  return (
    <div className="applications certifications">
      <h1>Certifications</h1>
      <p className="muted">
        The certifications you are weighing up. Nothing here is scored — record a
        target, what it costs, and whether you have a date, and come back to it as
        the decision firms up.
      </p>

      {entries.length > 0 && (
        <div className="card tools-filters">
          <fieldset className="tools-filters__tones">
            <legend className="tools-filters__label">Status</legend>
            <div className="tools-filters__chips">
              <button
                type="button"
                className={"chip" + (filter === "all" ? " is-active" : "")}
                onClick={() => setFilter("all")}
              >
                All <span className="chip__count">{counts.all}</span>
              </button>

              {counts.soon > 0 && (
                <button
                  type="button"
                  className={"chip chip--due" + (filter === "soon" ? " is-active" : "")}
                  onClick={() => setFilter("soon")}
                >
                  Exam date here <span className="chip__count">{counts.soon}</span>
                </button>
              )}

              {CERT_STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={"chip" + (filter === s.id ? " is-active" : "")}
                  onClick={() => setFilter(s.id)}
                >
                  {s.label} <span className="chip__count">{counts[s.id]}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {showForm ? (
        <form className="card entry-form" onSubmit={submit}>
          <h2>Add a certification</h2>

          <div className="entry-form__row">
            <label className="entry-form__field">
              <span className="tools-filters__label">Certification</span>
              <input
                className="tools-filters__input"
                type="text"
                value={draft.name}
                autoFocus
                placeholder="CompTIA Security+"
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Issuer (optional)</span>
              <input
                className="tools-filters__input"
                type="text"
                value={draft.issuer}
                placeholder="CompTIA, ISC2, Cisco"
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
              />
            </label>
          </div>

          <div className="entry-form__row">
            <label className="entry-form__field">
              <span className="tools-filters__label">Status</span>
              <select
                className="tools-filters__input"
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                {CERT_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Exam date (optional)</span>
              <input
                className="tools-filters__input"
                type="date"
                value={draft.examOn}
                onChange={(e) => setDraft({ ...draft, examOn: e.target.value })}
              />
            </label>
          </div>

          <label className="entry-form__field">
            <span className="tools-filters__label">
              Cost, as checked on the official site (optional)
            </span>
            <input
              className="tools-filters__input"
              type="text"
              value={draft.cost}
              placeholder="About $400 with the training bundle, PHP 22,000"
              onChange={(e) => setDraft({ ...draft, cost: e.target.value })}
            />
            <span className="muted">
              Free text on purpose. Phase 07 asks you to check the real price
              yourself rather than trust a figure written here, and the qualifier
              is often the honest part.
            </span>
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">
              Topic gaps — what you could not explain (optional)
            </span>
            <textarea
              className="tools-filters__input"
              rows={3}
              value={draft.gaps}
              placeholder="Certificate chains, risk registers, IAM frameworks"
              onChange={(e) => setDraft({ ...draft, gaps: e.target.value })}
            />
          </label>

          <label className="entry-form__field">
            <span className="tools-filters__label">Notes (optional)</span>
            <textarea
              className="tools-filters__input"
              rows={3}
              value={draft.notes}
              placeholder="What the 30 job posts said, and what made you pick this one"
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </label>

          <div className="entry-form__actions">
            <button type="submit" className="btn" disabled={!draft.name.trim()}>
              Add certification
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setDraft(EMPTY_DRAFT);
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p>
          <button type="button" className="btn" onClick={() => setShowForm(true)}>
            Add a certification
          </button>
        </p>
      )}

      {entries.length === 0 ? (
        <EmptyState message="No certifications yet. Cyber Phase 07 walks through choosing one — the 30-job-post test, the objective gap table, and the exam date decision. Anything you settle on can be written down here.">
          <button type="button" className="btn" onClick={() => setShowForm(true)}>
            Add a certification
          </button>
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState message="No certifications with that status.">
          <button type="button" className="btn" onClick={() => setFilter("all")}>
            Show all
          </button>
        </EmptyState>
      ) : (
        <div className="card app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Certification</th>
                <th>Cost</th>
                <th>Exam</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((e) => {
                const days = daysUntil(e.examOn, now);
                const isEditing = editing === e.id;
                return (
                  <tr key={e.id} className={isEditing ? "is-editing" : ""}>
                    <td>
                      <div className="app-table__company">{e.name}</div>
                      {e.issuer && <div className="app-table__sub">{e.issuer}</div>}
                      {e.gaps && (
                        <div className="app-table__sub">Gaps: {e.gaps}</div>
                      )}
                      {e.notes && <div className="app-table__sub">{e.notes}</div>}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className="tools-filters__input"
                          type="text"
                          defaultValue={e.cost}
                          aria-label={"Cost for " + e.name}
                          onBlur={(ev) => update(e.id, { cost: ev.target.value })}
                        />
                      ) : e.cost ? (
                        e.cost
                      ) : (
                        <span className="muted">not checked</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          className="tools-filters__input"
                          type="date"
                          defaultValue={e.examOn}
                          aria-label={"Exam date for " + e.name}
                          onBlur={(ev) => update(e.id, { examOn: ev.target.value })}
                        />
                      ) : e.examOn ? (
                        <>
                          {e.examOn}
                          {days !== null && (
                            <div className="app-table__sub">
                              in {days} {days === 1 ? "day" : "days"}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="muted">no date yet</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="tools-filters__input"
                        value={e.status}
                        aria-label={"Status for " + e.name}
                        onChange={(ev) => update(e.id, { status: ev.target.value })}
                      >
                        {CERT_STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="app-table__actions">
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => setEditing(isEditing ? null : e.id)}
                      >
                        {isEditing ? "Done" : "Edit"}
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => {
                          // A certification is the longest-lived commitment in
                          // the curriculum — a target date and an exam — so
                          // removing one is confirmed, like every other
                          // destructive action here (Portfolio, Applications,
                          // reset progress). It was the one single-click delete.
                          if (window.confirm(`Remove ${e.name}? This cannot be undone.`)) {
                            remove(e.id);
                          }
                        }}
                        aria-label={"Remove " + e.name}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
