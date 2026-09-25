import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import {
  useApplications,
  STATUSES,
  CLOSED_STATUS,
} from "../hooks/useApplications.js";
import { today } from "../lib/pace.js";

// Job applications, in the order they were sent.
//
// A table rather than cards: the useful question here is "what is still open
// and what needs chasing", which is a scan across a row, not a read of a card.
// See docs/DESIGN-SYSTEM.md → Layout rules (wider content for tables).
//
// Follow-ups are a nudge, never a red alarm — a missed follow-up is a missed
// reminder, not a failure. See docs/DESIGN-SYSTEM.md → Anti-patterns.

const STATUS_LABELS = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));

const EMPTY_DRAFT = {
  company: "",
  role: "",
  source: "",
  url: "",
  appliedOn: "",
  status: "applied",
  followUpOn: "",
  notes: "",
};

// Overdue follow-ups, computed from YYYY-MM-DD strings so no timezone maths
// is involved. Closed applications are never counted as needing a follow-up.
function needsFollowUp(entry, now) {
  if (!entry.followUpOn) return false;
  if (CLOSED_STATUS.includes(entry.status)) return false;
  return entry.followUpOn <= now;
}

export default function Applications() {
  const { entries, add, setStatus, setFollowUp, remove } = useApplications();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const now = today();

  const counts = useMemo(() => {
    const c = { all: entries.length, due: 0 };
    for (const s of STATUSES) c[s.id] = 0;
    for (const e of entries) {
      if (c[e.status] !== undefined) c[e.status]++;
      if (needsFollowUp(e, now)) c.due++;
    }
    return c;
  }, [entries, now]);

  const shown = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "due") return entries.filter((e) => needsFollowUp(e, now));
    return entries.filter((e) => e.status === filter);
  }, [entries, filter, now]);

  function submit(e) {
    e.preventDefault();
    if (!draft.company.trim() || !draft.role.trim()) return;
    add(draft);
    setDraft(EMPTY_DRAFT);
    setShowForm(false);
  }

  return (
    <div className="applications">
      <h1>Applications</h1>
      <p className="muted">
        Every application you have sent, newest first. Set a follow-up date and
        it surfaces here when it comes due — a reminder, not a deadline.
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

              {counts.due > 0 && (
                <button
                  type="button"
                  className={
                    "chip chip--due" + (filter === "due" ? " is-active" : "")
                  }
                  onClick={() => setFilter("due")}
                >
                  Follow up <span className="chip__count">{counts.due}</span>
                </button>
              )}

              {STATUSES.map((s) => (
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
          <h2>Add an application</h2>

          <div className="entry-form__row">
            <label className="entry-form__field">
              <span className="tools-filters__label">Company</span>
              <input
                className="tools-filters__input"
                type="text"
                value={draft.company}
                autoFocus
                placeholder="Acme Support Services"
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              />
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Role</span>
              <input
                className="tools-filters__input"
                type="text"
                value={draft.role}
                placeholder="IT Support Specialist"
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </label>
          </div>

          <div className="entry-form__row">
            <label className="entry-form__field">
              <span className="tools-filters__label">Source (optional)</span>
              <input
                className="tools-filters__input"
                type="text"
                value={draft.source}
                placeholder="LinkedIn, referral, job board"
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              />
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Posting URL (optional)</span>
              <input
                className="tools-filters__input"
                type="url"
                value={draft.url}
                placeholder="https://…"
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              />
            </label>
          </div>

          <div className="entry-form__row">
            <label className="entry-form__field">
              <span className="tools-filters__label">Applied on</span>
              <input
                className="tools-filters__input"
                type="date"
                value={draft.appliedOn}
                onChange={(e) =>
                  setDraft({ ...draft, appliedOn: e.target.value })
                }
              />
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Follow up on (optional)</span>
              <input
                className="tools-filters__input"
                type="date"
                value={draft.followUpOn}
                onChange={(e) =>
                  setDraft({ ...draft, followUpOn: e.target.value })
                }
              />
            </label>

            <label className="entry-form__field">
              <span className="tools-filters__label">Status</span>
              <select
                className="tools-filters__select"
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="entry-form__field">
            <span className="tools-filters__label">Notes (optional)</span>
            <textarea
              className="tools-filters__input"
              rows={2}
              value={draft.notes}
              placeholder="Contact name, what they asked for, next step"
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </label>

          <div className="entry-form__actions">
            <button
              type="submit"
              className="btn"
              disabled={!draft.company.trim() || !draft.role.trim()}
            >
              Add application
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
            Add an application
          </button>
        </p>
      )}

      {entries.length === 0 ? (
        <EmptyState message="No applications yet. Add the first one — tracking them is what turns a scatter of sent resumes into a pipeline you can read.">
          <button type="button" className="btn" onClick={() => setShowForm(true)}>
            Add an application
          </button>
        </EmptyState>
      ) : shown.length === 0 ? (
        <EmptyState message="No applications with that status.">
          <button type="button" className="btn" onClick={() => setFilter("all")}>
            Show all
          </button>
        </EmptyState>
      ) : (
        <div className="card app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Company / role</th>
                <th>Applied</th>
                <th>Follow up</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className="app-table__company">{e.company}</span>
                    <span className="app-table__sub">{e.role}</span>
                    {e.source && (
                      <span className="app-table__sub">{e.source}</span>
                    )}
                    {e.notes && <span className="app-table__sub">{e.notes}</span>}
                    {e.url && (
                      <a
                        className="app-table__sub"
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Posting
                      </a>
                    )}
                  </td>
                  <td>{e.appliedOn}</td>
                  <td>
                    <input
                      className="tools-filters__input"
                      type="date"
                      value={e.followUpOn}
                      onChange={(ev) => setFollowUp(e.id, ev.target.value)}
                    />
                    {needsFollowUp(e, now) && (
                      <span className="app-table__sub app-due">Due</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="tools-filters__select"
                      value={e.status}
                      onChange={(ev) => setStatus(e.id, ev.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="app-table__actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Remove this application? This cannot be undone."
                          )
                        ) {
                          remove(e.id);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}